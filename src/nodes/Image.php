<?php
namespace verbb\vizy\nodes;

use verbb\vizy\base\Node;
use verbb\vizy\helpers\Nodes;
use verbb\vizy\marks\Link;

use Craft;
use craft\elements\Asset;
use craft\helpers\ArrayHelper;

class Image extends Node
{
    // Properties
    // =========================================================================

    public static $type = 'image';
    public $tagName = 'img';

    private $_elementId = null;

    
    // Public Methods
    // =========================================================================

    public function selfClosing()
    {
        return true;
    }

    public function renderNode()
    {
        if (isset($this->attrs['url'])) {
            $renderClass = new Link([
                'attrs' => [
                    'href' => $this->attrs['url'] ?? '',
                    'target' => $this->attrs['target'] ?? '',
                    'class' => $this->attrs['linkClass'] ?? '',
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
        $this->_elementId = ArrayHelper::remove($this->attrs, 'id');
        ArrayHelper::remove($this->attrs, 'url');
        ArrayHelper::remove($this->attrs, 'target');
        ArrayHelper::remove($this->attrs, 'transform');
        ArrayHelper::remove($this->attrs, 'linkClass');

        // Parse the image src for ref tags
        $src = $this->attrs['src'] ?? '';

        if ($src) {
            $siteId = $this->element->siteId ?? null;

            $this->attrs['src'] = Nodes::parseRefTags($src, $siteId);
        }

        return parent::getTag();
    }

    public function getAsset()
    {
        $id = $this->attrs['id'] ?? $this->_elementId ?? null;
        $siteId = $this->element->siteId ?? null;

        if ($id) {
            return Craft::$app->getElements()->getElementById($id, Asset::class, $siteId);
        }

        return null;
    }
}
