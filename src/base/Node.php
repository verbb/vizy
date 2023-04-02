<?php
namespace verbb\vizy\base;

use verbb\vizy\Vizy;
use verbb\vizy\events\ModifyNodeTagEvent;
use verbb\vizy\helpers\Nodes;

use Craft;
use craft\base\Component;
use craft\base\ElementInterface;
use craft\base\FieldInterface;
use craft\helpers\Template;

use GraphQL\Type\Definition\Type;
use GraphQL\Type\Definition\ScalarType;

use Twig\Markup;

class Node extends Component implements NodeInterface
{
    // Constants
    // =========================================================================

    public const EVENT_MODIFY_TAG = 'modifyTag';


    // Static Methods
    // =========================================================================

    public static function gqlTypeNameByContext(mixed $context): string
    {
        $classNameParts = explode('\\', static::class);
        $end = array_pop($classNameParts);

        return 'VizyNode_' . $end;
    }


    // Properties
    // =========================================================================

    public static ?string $type = null;

    public mixed $tagName = null;
    public array $content = [];
    public array $attrs = [];
    public array $marks = [];
    public array $rawNode = [];

    protected ?string $text = null;

    private ?ElementInterface $element = null;
    private ?FieldInterface $field = null;


    // Public Methods
    // =========================================================================

    public function selfClosing(): bool
    {
        return false;
    }

    public function isDeleted(): bool
    {
        return false;
    }

    public function getTag(): array
    {
        return [
            [
                'tag' => $this->tagName,
                'attrs' => $this->attrs,
            ],
        ];
    }

    public function getType(): ?string
    {
        return static::$type;
    }

    public function getMarks(): array
    {
        return $this->marks;
    }

    public function getContent(): array
    {
        return $this->content;
    }

    public function getField(): ?FieldInterface
    {
        return $this->field;
    }

    public function setField(FieldInterface $value): void
    {
        $this->field = $value;
    }

    public function getElement(): ?ElementInterface
    {
        return $this->element;
    }

    public function setElement(ElementInterface $value): void
    {
        $this->element = $value;
    }

    public function getAttrs(): array
    {
        return $this->attrs;
    }

    public function getText(): ?Markup
    {
        return Template::raw((string)$this->text);
    }

    public function setText(mixed $value): void
    {
        $this->text = $value;
    }

    public function getEnabled(): bool
    {
        return true;
    }

    public function isEmpty(): bool
    {
        return !($this->getContent() || $this->getText());
    }

    public function renderNode(array $config = []): ?string
    {
        Craft::configure($this, $config);

        return Vizy::$plugin->getNodes()->renderNode($this);
    }

    public function renderHtml(array $config = []): ?Markup
    {
        return Template::raw((string)$this->renderNode($config));
    }

    public function renderStaticHtml(): ?Markup
    {
        return $this->renderHtml();
    }

    public function getStaticText(): string
    {
        return trim(implode('', $this->_getNestedValues($this->rawNode, 'text')));
    }

    public function renderOpeningTag(): ?string
    {
        $tag = $this->getTag();

        $event = new ModifyNodeTagEvent([
            'tag' => $tag,
            'node' => $this,
            'opening' => true,
        ]);

        $this->trigger(self::EVENT_MODIFY_TAG, $event);

        return Nodes::renderOpeningTag($event->tag);
    }

    public function renderClosingTag(): ?string
    {
        $tag = $this->getTag();

        $event = new ModifyNodeTagEvent([
            'tag' => $tag,
            'node' => $this,
            'closing' => true,
        ]);

        $this->trigger(self::EVENT_MODIFY_TAG, $event);

        return Nodes::renderClosingTag($event->tag);
    }

    public function getGqlTypeName(): string
    {
        return static::gqlTypeNameByContext($this);
    }

    public function getContentGqlType(): ScalarType
    {
        return Type::string();
    }

    public function serializeValue(?ElementInterface $element = null): ?array
    {
        // Filter attributes before saving to the database
        $attrs = $this->rawNode['attrs'] ?? [];

        if ($attrs) {
            $this->rawNode['attrs'] = array_filter($attrs, function($value, $attr) {
                // Remove `textAlign = start` - the default, it's just annoying
                if ($attr === 'textAlign' && $value === 'start') {
                    return false;
                }

                // No need to store null values
                if ($value === null) {
                    return false;
                }

                return true;
            }, ARRAY_FILTER_USE_BOTH);
        }

        return $this->rawNode;
    }

    public function normalizeValue(?ElementInterface $element = null): ?array
    {
        return $this->rawNode;
    }


    // Public Methods
    // =========================================================================

    private function _getNestedValues($value, $key, &$items = []): array
    {
        foreach ($value as $k => $v) {
            if ((string)$k === $key) {
                $items[] = $v;
            }

            if (is_array($v)) {
                $this->_getNestedValues($v, $key, $items);
            }
        }

        return $items;
    }
}
