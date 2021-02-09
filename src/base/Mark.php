<?php
namespace verbb\vizy\base;

use verbb\vizy\Vizy;
use verbb\vizy\helpers\Nodes;

use Craft;
use craft\helpers\Template;

class Mark
{
    // Properties
    // =========================================================================

    protected $mark;
    protected $type;
    protected $tagName = null;


    // Public Methods
    // =========================================================================

    public function __construct($mark)
    {
        $this->mark = $mark;
    }

    public function matching()
    {
        if (isset($this->mark['type'])) {
            return $this->mark['type'] === $this->type;
        }
        
        return false;
    }

    public function getMark()
    {
        return $this->mark;
    }

    public function getType()
    {
        return $this->type;
    }

    public function getTag()
    {
        return $this->tagName;
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
