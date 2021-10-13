<?php
namespace verbb\vizy\marks;

use verbb\vizy\base\Mark;

use Craft;
use craft\helpers\Html;
use craft\helpers\StringHelper;
use craft\validators\HandleValidator;

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
        $value = preg_replace_callback('/([^\'"\?#]*)(\?[^\'"\?#]+)?(#[^\'"\?#]+)?(?:#|%23)([\w]+)\:(\d+)(?:@(\d+))?(\:' . HandleValidator::$handlePattern . ')?/', function($matches) {
            list(, $url, $query, $hash, $elementType, $ref, $siteId, $transform) = array_pad($matches, 10, null);

            // Create the ref tag, and make sure :url is in there
            $ref = $elementType . ':' . $ref . ($siteId ? "@$siteId" : '') . ($transform ?: ':url');

            if ($query || $hash) {
                // Make sure that the query/hash isn't actually part of the parsed URL
                // - someone's Entry URL Format could include "?slug={slug}" or "#{slug}", etc.
                // - assets could include ?mtime=X&focal=none, etc.
                $parsed = Craft::$app->getElements()->parseRefs("{{$ref}}");
                
                if ($query) {
                    // Decode any HTML entities, e.g. &amp;
                    $query = Html::decode($query);

                    if (mb_strpos($parsed, $query) !== false) {
                        $url .= $query;
                        $query = '';
                    }
                }
                if ($hash && mb_strpos($parsed, $hash) !== false) {
                    $url .= $hash;
                    $hash = '';
                }
            }

            return '{' . $ref . '||' . $url . '}' . $query . $hash;
        }, $value);

        if (StringHelper::contains($value, '{')) {
            $value = Craft::$app->getElements()->parseRefs($value, $siteId);
        }

        return $value;
    }
}
