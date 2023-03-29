<?php
namespace verbb\vizy\base;

use verbb\vizy\events\ModifyMarkTagEvent;
use verbb\vizy\helpers\Nodes;

use craft\base\Component;
use craft\base\ElementInterface;
use craft\base\FieldInterface;

use GraphQL\Type\Definition\Type;
use GraphQL\Type\Definition\ScalarType;

class Mark extends Component implements MarkInterface
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

        return 'VizyMark_' . $end;
    }


    // Properties
    // =========================================================================

    public static ?string $type = null;

    public mixed $tagName = null;
    public array $attrs = [];
    
    private ?ElementInterface $element = null;
    private ?FieldInterface $field = null;


    // Public Methods
    // =========================================================================

    public function getType(): ?string
    {
        return static::$type;
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

    public function getTag(): array
    {
        return [
            [
                'tag' => $this->tagName,
                'attrs' => array_filter($this->attrs),
            ],
        ];
    }

    public function renderOpeningTag(): ?string
    {
        $tag = $this->getTag();

        $event = new ModifyMarkTagEvent([
            'tag' => $tag,
            'mark' => $this,
            'opening' => true,
        ]);

        $this->trigger(self::EVENT_MODIFY_TAG, $event);

        return Nodes::renderOpeningTag($event->tag);
    }

    public function renderClosingTag(): ?string
    {
        $tag = $this->getTag();

        $event = new ModifyMarkTagEvent([
            'tag' => $tag,
            'mark' => $this,
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

}
