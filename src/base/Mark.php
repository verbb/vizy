<?php
namespace verbb\vizy\base;

use verbb\vizy\Vizy;
use verbb\vizy\events\ModifyMarkTagEvent;
use verbb\vizy\helpers\Nodes;

use Craft;
use craft\base\Component;
use craft\helpers\Template;

class Mark extends Component
{
    // Constants
    // =========================================================================

    const EVENT_MODIFY_TAG = 'modifyTag';


    // Properties
    // =========================================================================

    public static $type;

    public $tagName = null;
    public $attrs = [];
    
    private $field;


    // Public Methods
    // =========================================================================

    public function getType()
    {
        return static::$type;
    }

    public function getField()
    {
        return $this->field;
    }

    public function setField($value)
    {
        $this->field = $value;
    }

    public function getTag()
    {
        return [
            [
                'tag' => $this->tagName,
                'attrs' => $this->attrs,
            ],
        ];
    }

    public function renderOpeningTag()
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

    public function renderClosingTag()
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
