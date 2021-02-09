<?php
namespace verbb\vizy\helpers;

use verbb\vizy\Vizy;

use Craft;
use craft\helpers\Template;

class Nodes
{
    // Static Methods
    // =========================================================================

    public static function renderOpeningTag($tags)
    {
        $tags = (array)$tags;

        if (!$tags || !count($tags)) {
            return null;
        }

        return join('', array_map(function($item) {
            if (is_string($item)) {
                return "<{$item}>";
            }

            $attrs = '';
            if (isset($item['attrs'])) {
                foreach ($item['attrs'] as $attribute => $value) {
                    $attrs .= " {$attribute}=\"{$value}\"";
                }
            }

            return "<{$item['tag']}{$attrs}>";
        }, $tags));
    }

    public static function renderClosingTag($tags)
    {
        $tags = (array)$tags;
        $tags = array_reverse($tags);

        if (!$tags || !count($tags)) {
            return null;
        }

        return join('', array_map(function($item) {
            if (is_string($item)) {
                return "</{$item}>";
            }

            return "</{$item['tag']}>";
        }, $tags));
    }
    
}
