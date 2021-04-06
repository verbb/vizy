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
            $tags = (array)$item['tag'];

            return join('', array_map(function($tag) use ($item) {
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

    public static function renderClosingTag($tags)
    {
        $tags = (array)$tags;
        $tags = array_reverse($tags);

        if (!$tags || !count($tags)) {
            return null;
        }

        return join('', array_map(function($item) {
            $tags = (array)$item['tag'];

            return join('', array_map(function($tag) use ($item) {
                return "</{$tag}>";
            }, $tags));
        }, $tags));
    }
    
}
