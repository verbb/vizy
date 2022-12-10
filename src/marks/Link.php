<?php
namespace verbb\vizy\marks;

use verbb\vizy\base\Mark;
use verbb\vizy\helpers\Nodes;

class Link extends Mark
{
    // Properties
    // =========================================================================

    public static ?string $type = 'link';
    public mixed $tagName = 'a';


    // Public Methods
    // =========================================================================

    public function init(): void
    {
        parent::init();

        // On-load, parse the link URL for ref tags
        $href = $this->attrs['href'] ?? '';

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
}
