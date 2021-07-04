<?php
namespace verbb\vizy\helpers;

use verbb\vizy\Vizy;

use Craft;

class Matrix
{
    public static function sanitizeMatrixContent($field, $content)
    {
        $blockTypes = array_map(function ($block) {
            return $block->handle;
        }, $field->blockTypes);

        $blockFields = array_map(function ($block) {
            return $block->handle;
        }, $field->blockTypeFields);

        if (!is_array($content)) {
            $content = [];
        }

        if (array_key_exists('blocks', $content)) {
            // Filter block types against those available
            $content['blocks'] = array_filter($content['blocks'], function ($block) use ($blockTypes) {
                return in_array($block['type'], $blockTypes);
            });

            // Filter fields within valid blocks against those available
            $content['blocks'] = array_map(function ($block) use ($blockFields) {
                if (array_key_exists('fields', $block)) {
                    $block['fields'] = array_filter($block['fields'], function ($key) use ($blockFields) {
                        return in_array($key, $blockFields);
                    }, ARRAY_FILTER_USE_KEY);
                }

                return $block;
            }, $content['blocks']);
        }

        return $content;
    }

    public static function isMatrix($field)
    {
        return $field instanceof craft\fields\Matrix;
    }
}