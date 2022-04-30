<?php
namespace verbb\vizy\base;

use verbb\vizy\Vizy;
use verbb\vizy\events\ModifyNodeTagEvent;
use verbb\vizy\helpers\Nodes;

use craft\base\Component;
use craft\base\ElementInterface;
use craft\helpers\Template;

use GraphQL\Type\Definition\Type;
use GraphQL\Type\Definition\ScalarType;

class Node extends Component
{
    // Constants
    // =========================================================================

    public const EVENT_MODIFY_TAG = 'modifyTag';


    // Properties
    // =========================================================================

    public static ?string $type = null;

    public mixed $tagName = null;
    public array $content = [];
    public array $attrs = [];
    public array $marks = [];
    public ?string $text = null;
    public array $rawNode = [];

    private mixed $element = null;
    private mixed $field = null;


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

    public function getField()
    {
        return $this->field;
    }

    public function setField($value): void
    {
        $this->field = $value;
    }

    public function getElement()
    {
        return $this->element;
    }

    public function setElement($value): void
    {
        $this->element = $value;
    }

    public function getAttrs(): array
    {
        return $this->attrs;
    }

    public function getText(): ?string
    {
        return $this->text;
    }

    public function getEnabled(): bool
    {
        return true;
    }

    public function isEmpty()
    {
        return !($this->getContent() || $this->getText());
    }

    public function renderNode(): ?string
    {
        return Vizy::$plugin->getNodes()->renderNode($this);
    }

    public function renderHtml(): ?string
    {
        return Template::raw((string)$this->renderNode());
    }

    public function renderStaticHtml(): ?string
    {
        return $this->renderHtml();
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
        $classNameParts = explode('\\', static::class);
        $end = array_pop($classNameParts);

        return 'VizyNode_' . $end;
    }

    public function getContentGqlType($context): ScalarType
    {
        return Type::string();
    }

    public function serializeValue(ElementInterface $element = null): ?array
    {
        return $this->rawNode;
    }
}
