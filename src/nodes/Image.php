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

    public static ?string $type = 'image';
    public mixed $tagName = 'img';

    private ?int $_elementId = null;

    // Public Methods
    // =========================================================================

    public function selfClosing(): bool
    {
        return true;
    }

    public function renderNode(array $config = []): ?string
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
            $html .= parent::renderNode($config);
            $html .= $renderClass->renderClosingTag();

            return $html;
        }

        return parent::renderNode($config);
    }

    public function getTag(): array
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
            $siteId = $this->getElement()->siteId ?? null;

            $this->attrs['src'] = Nodes::parseRefTags($src, $siteId);
        }

        return parent::getTag();
    }

    public function getAsset()
    {
        $id = $this->attrs['id'] ?? $this->_elementId ?? null;
        $siteId = $this->getElement()->siteId ?? null;

        if ($id) {
            return Craft::$app->getElements()->getElementById($id, Asset::class, $siteId);
        }

        return null;
    }
}
