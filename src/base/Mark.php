<?php
namespace verbb\vizy\base;

use verbb\vizy\events\ModifyMarkTagEvent;
use verbb\vizy\helpers\Nodes;

use craft\base\Component;

class Mark extends Component
{
    // Constants
    // =========================================================================

    public const EVENT_MODIFY_TAG = 'modifyTag';


    // Properties
    // =========================================================================

    public static ?string $type = null;

    public mixed $tagName = null;
    public array $attrs = [];
    
    private mixed $element = null;
    private mixed $field = null;


    // Public Methods
    // =========================================================================

    public function getType(): ?string
    {
        return static::$type;
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

    public function getTag(): array
    {
        return [
            [
                'tag' => $this->tagName,
                'attrs' => $this->attrs,
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
    
}
