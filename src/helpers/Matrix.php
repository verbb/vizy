<?php
namespace verbb\vizy\helpers;

use verbb\vizy\Vizy;

use Craft;

class Matrix
{
    // Static Methods
    // =========================================================================

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

        foreach ($content as $blockKey => $block) {
            // Filter block types against those available
            if (!in_array($block['type'], $blockTypes)) {
                unset($content[$blockKey]);
            }

            // Filter fields within valid blocks against those available
            foreach ($block['fields'] as $fieldKey => $field) {
                if (!in_array($fieldKey, $blockFields)) {
                    unset($content[$blockKey]['fields'][$fieldKey]);
                }
            }
        }

        return $content;
    }

    public static function isMatrix($field)
    {
        return $field instanceof craft\fields\Matrix;
    }
}