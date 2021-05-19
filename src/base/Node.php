<?php
namespace verbb\vizy\base;

use verbb\vizy\Vizy;
use verbb\vizy\events\ModifyNodeTagEvent;
use verbb\vizy\helpers\Nodes;

use Craft;
use craft\base\Component;
use craft\helpers\Template;

class Node extends Component
{
    // Constants
    // =========================================================================

    const EVENT_MODIFY_TAG = 'modifyTag';


    // Properties
    // =========================================================================

    public static $type;

    public $tagName = null;
    public $content = [];
    public $attrs = [];
    public $marks = [];
    public $text = null;

    private $element;
    private $field;


    // Public Methods
    // =========================================================================

    public function selfClosing()
    {
        return false;
    }

    public function isDeleted()
    {
        return false;
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

    public function getType()
    {
        return static::$type;
    }

    public function getMarks()
    {
        return $this->marks;
    }

    public function getContent()
    {
        return $this->content;
    }

    public function getField()
    {
        return $this->field;
    }

    public function setField($value)
    {
        $this->field = $value;
    }

    public function getElement()
    {
        return $this->element;
    }

    public function setElement($value)
    {
        $this->element = $value;
    }

    public function getAttrs()
    {
        return $this->attrs;
    }

    public function getText()
    {
        return $this->text;
    }

    public function renderNode()
    {
        return Vizy::$plugin->getNodes()->renderNode($this);
    }

    public function renderHtml()
    {
        return Template::raw((string)$this->renderNode());
    }

    public function renderStaticHtml()
    {
        return $this->renderHtml();
    }

    public function renderOpeningTag()
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

    public function renderClosingTag()
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

    public function getGqlTypeName()
    {
        $classNameParts = explode('\\', static::class);
        $end = array_pop($classNameParts);

        return 'Node_' . $end;
    }

    public function getContentGqlType($context)
    {
        return [];
    }
}