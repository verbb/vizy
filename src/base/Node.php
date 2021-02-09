<?php
namespace verbb\vizy\base;

use verbb\vizy\Vizy;
use verbb\vizy\helpers\Nodes;

use Craft;
use craft\base\Component;
use craft\helpers\Template;

class Node extends Component
{
    // Properties
    // =========================================================================

    protected $field;
    protected $node;
    protected $type;
    protected $tagName = null;


    // Public Methods
    // =========================================================================

    public function __construct($field, $node)
    {
        $this->field = $field;
        $this->node = $node;
    }

    public function matching()
    {
        if (isset($this->node['type'])) {
            return $this->node['type'] === $this->type;
        }

        return false;
    }

    public function selfClosing()
    {
        return false;
    }

    public function getTag()
    {
        return $this->tagName;
    }

    public function getNode()
    {
        return $this->node;
    }

    public function getField()
    {
        return $this->field;
    }

    public function getType()
    {
        return $this->type;
    }

    public function text()
    {
        return null;
    }

    public function renderNode()
    {
        return Vizy::$plugin->getNodes()->renderNode($this->field, $this->node);
    }

    public function renderHtml()
    {
        return Template::raw((string)$this->renderNode());
    }

    public function renderOpeningTag()
    {
        return Nodes::renderOpeningTag($this->getTag());
    }

    public function renderClosingTag()
    {
        return Nodes::renderClosingTag($this->getTag());
    }
}