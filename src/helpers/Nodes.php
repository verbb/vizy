<?php
namespace verbb\vizy\helpers;

use Craft;
use craft\helpers\Html;
use craft\helpers\StringHelper;
use craft\validators\HandleValidator;

use LitEmoji\LitEmoji;

class Nodes
{
    // Static Methods
    // =========================================================================

    public static function renderOpeningTag($tags): ?string
    {
        $tags = (array)$tags;

        if (!$tags || !count($tags)) {
            return null;
        }

        return implode('', array_map(function($item) {
            $tags = (array)$item['tag'];

            return implode('', array_map(function($tag) use ($item) {
                $attrs = '';

                if (isset($item['attrs'])) {
                    foreach ($item['attrs'] as $attribute => $value) {
                        $attrs .= " {$attribute}=\"{$value}\"";
                    }
                }

                return "<{$tag}{$attrs}>";
            }, $tags));
        }, $tags));
    }

    public static function renderClosingTag($tags): ?string
    {
        $tags = (array)$tags;
        $tags = array_reverse($tags);

        if (!$tags || !count($tags)) {
            return null;
        }

        return implode('', array_map(function($item) {
            $tags = (array)$item['tag'];

            return implode('', array_map(function($tag) use ($item) {
                return "</{$tag}>";
            }, $tags));
        }, $tags));
    }

    public static function parseRefTags($value, $siteId): array|string|null
    {
        $value = preg_replace_callback('/([^\'"\?#]*)(\?[^\'"\?#]+)?(#[^\'"\?#]+)?(?:#|%23)([\w]+)\:(\d+)(?:@(\d+))?(\:(?:transform\:)?' . HandleValidator::$handlePattern . ')?/', function($matches) {
            [, $url, $query, $hash, $elementType, $ref, $siteId, $transform] = array_pad($matches, 10, null);

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

            return '{' . $ref . '||' . $url . '}' . $query . $hash;
        }, $value);

        if (StringHelper::contains($value, '{')) {
            $value = Craft::$app->getElements()->parseRefs($value, $siteId);
        }

        return $value;
    }

    public static function serializeEmojis($rawNode): array
    {
        $content = $rawNode['content'] ?? [];

        foreach ($content as $key => $block) {
            $text = $block['text'] ?? '';

            // We only want to modify simple nodes and their text content, not complicated
            // nodes like VizyBlocks, which could mess things up as fields control their content.
            $rawNode['content'][$key]['text'] = LitEmoji::unicodeToShortcode($text);
        }

        return $rawNode;
    }

    public static function normalizeEmojis($rawNode): array
    {
        $content = $rawNode['content'] ?? [];

        foreach ($content as $key => $block) {
            $text = $block['text'] ?? '';

            // We only want to modify simple nodes and their text content, not complicated
            // nodes like VizyBlocks, which could mess things up as fields control their content.
            $rawNode['content'][$key]['text'] = LitEmoji::shortcodeToUnicode($text);
        }

        return $rawNode;
    }
    
}
