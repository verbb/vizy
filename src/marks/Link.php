<?php
namespace verbb\vizy\marks;

use verbb\vizy\base\Mark;
use verbb\vizy\helpers\Nodes;

use Craft;

class Link extends Mark
{
    // Properties
    // =========================================================================

    public static $type = 'link';
    public $tagName = 'a';


    // Public Methods
    // =========================================================================

    public function getTag()
    {
        if (isset($this->attrs['target'])) {
            if ($this->attrs['target'] === '_blank') {
                $this->attrs['rel'] = 'noopener noreferrer nofollow';
            }
        }

        // Parse the link URL for ref tags
        $href = $this->attrs['href'] ?? '';

        if ($href) {
            $siteId = $this->element->siteId ?? null;

            $this->attrs['href'] = Nodes::parseRefTags($href, $siteId);
        }

        return parent::getTag();
    }
}
