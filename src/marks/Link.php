<?php
namespace verbb\vizy\marks;

use verbb\vizy\base\Mark;

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

            $this->attrs['href'] = $this->_parseRefTags($href, $siteId);
        }

        return parent::getTag();
    }


    // Private Methods
    // =========================================================================

    private function _parseRefTags($value, $siteId)
    {
        $split = explode('#', $value);

        if (isset($split[0]) && isset($split[1])) {
            $parsedUrl = '{' . $split[1] . ':url||' . $split[0] . '}';

            return Craft::$app->getElements()->parseRefs($parsedUrl, $siteId);
        }

        return $value;
    }
}
