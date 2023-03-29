<?php
namespace verbb\vizy\marks;

use verbb\vizy\base\Mark;
use verbb\vizy\helpers\Nodes;

use Craft;
use craft\base\ElementInterface;

class Link extends Mark
{
    // Properties
    // =========================================================================

    public static ?string $type = 'link';
    public mixed $tagName = 'a';

    private ?string $_originalHref = null;


    // Public Methods
    // =========================================================================

    public function init(): void
    {
        parent::init();

        // On-load, parse the link URL for ref tags
        $href = $this->attrs['href'] ?? '';

        // Store the original for later (GQL)
        $this->_originalHref = $href;

        if ($href) {
            $siteId = $this->getElement()->siteId ?? null;

            $this->attrs['href'] = Nodes::parseRefTags($href, $siteId);
        }
    }

    public function getTag(): array
    {
        // Reset
        $this->attrs['rel'] = null;

        if (isset($this->attrs['target']) && $this->attrs['target'] === '_blank') {
            $this->attrs['rel'] = 'noopener noreferrer';
        }

        return parent::getTag();
    }

    public function getLinkElement(): ?ElementInterface
    {
        // Deemed an element link if contains `#asset:694@1` or a ref
        $href = $this->_originalHref;

        preg_match('/([^\'"\?#]*)(\?[^\'"\?#]+)?(#[^\'"\?#]+)?(?:#|%23)([\w]+)\:(\d+)(?:@(\d+))?(\:(?:transform\:)?' . \craft\validators\HandleValidator::$handlePattern . ')?/', $href, $matches);

        [, $url, $query, $hash, $elementType, $ref, $siteId, $transform] = array_pad($matches, 10, null);

        if (!$elementType) {
            return null;
        }

        $elementType = Craft::$app->getElements()->getElementTypeByRefHandle($elementType);

        return Craft::$app->getElements()->getElementById($ref, $elementType, $siteId);
    }
}
