<?php
namespace verbb\vizy\services;

use verbb\vizy\helpers\StringHelper;

use Craft;
use craft\base\Component;
use craft\helpers\Html;
use craft\validators\HandleValidator;

/**
 * Focused Craft ref → URL resolver for Link / Image attrs (and similar).
 *
 * Called from type resolveAttrs methods — not a parallel public override API.
 */
final class RefTags extends Component
{
    // Public Methods
    // =========================================================================

    /**
     * Parse Craft element refs in a URL-ish string for the given site.
     */
    public function parse(mixed $value, ?int $siteId): array|string|null
    {
        if (!is_string($value) || $value === '') {
            return $value;
        }

        $value = preg_replace_callback(
            '/([^\'"\?#]*)(\?[^\'"\?#]+)?(#[^\'"\?#]+)?(?:#|%23)([\w]+)\:(\d+)(?:@(\d+))?(\:(?:transform\:)?' . HandleValidator::$handlePattern . ')?/',
            function($matches) {
                [, $url, $query, $hash, $elementType, $ref, $siteIdMatch, $transform] = array_pad($matches, 10, null);

                // Create the ref tag, and make sure :url is in there
                $refTag = $elementType . ':' . $ref . ($siteIdMatch ? "@$siteIdMatch" : '') . ($transform ?: ':url');

                if ($query || $hash) {
                    // Make sure that the query/hash isn't actually part of the parsed URL
                    $parsed = Craft::$app->getElements()->parseRefs("{{$refTag}}");

                    if ($query) {
                        $query = Html::decode($query);

                        if (str_contains($parsed, $query)) {
                            $url .= $query;
                            $query = '';
                        }
                    }
                    if ($hash && str_contains($parsed, $hash)) {
                        $url .= $hash;
                        $hash = '';
                    }
                }

                return '{' . $refTag . '||' . $url . '}' . $query . $hash;
            },
            $value,
        );

        if (is_string($value) && StringHelper::contains($value, '{')) {
            $value = Craft::$app->getElements()->parseRefs($value, $siteId);
        }

        return $value;
    }
}
