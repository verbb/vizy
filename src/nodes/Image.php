<?php
namespace verbb\vizy\nodes;

use verbb\vizy\base\Node;
use verbb\vizy\marks\Link;

use craft\helpers\ArrayHelper;

class Image extends Node
{
    // Properties
    // =========================================================================

    protected $type = 'image';
    protected $tagName = 'img';

    
    // Public Methods
    // =========================================================================

    public function selfClosing()
    {
        return true;
    }

    public function renderNode()
    {
        if (isset($this->node['attrs']['url'])) {
            $renderClass = new Link([
                'type' => 'link',
                'attrs' => [
                    'href' => $this->node['attrs']['url'] ?? '',
                    'target' => $this->node['attrs']['target'] ?? '',
                ],
            ]);

            $html = $renderClass->renderOpeningTag();
            $html .= parent::renderNode();
            $html .= $renderClass->renderClosingTag();

            return $html;
        }

        return parent::renderNode();
    }
    
    public function getTag()
    {
        // Don't include certain attributes in rendering
        ArrayHelper::remove($this->node['attrs'], 'id');
        ArrayHelper::remove($this->node['attrs'], 'url');
        ArrayHelper::remove($this->node['attrs'], 'target');
        ArrayHelper::remove($this->node['attrs'], 'transform');

        return [
            [
                'tag' => $this->tagName,
                'attrs' => $this->node['attrs'],
            ],
        ];
    }
}
