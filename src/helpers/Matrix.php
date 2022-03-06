<?php
namespace verbb\vizy\helpers;

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

        // Handle new blocks, which are structured differently
        if (isset($content['blocks'])) {
            $content['blocks'] = self::filterContent($content['blocks'], $blockTypes, $blockFields);
        } else {
            $content = self::filterContent($content, $blockTypes, $blockFields);
        }

        return $content;
    }

    public static function isMatrix($field): bool
    {
        return $field instanceof \craft\fields\Matrix;
    }

    private static function filterContent($content, $blockTypes, $blockFields)
    {
        foreach ($content as $blockKey => $block) {
            $type = $block['type'] ?? '';
            $fields = $block['fields'] ?? [];

            // Filter block types against those available
            if ($type && !in_array($type, $blockTypes)) {
                unset($content[$blockKey]);
            }

            // Filter fields within valid blocks against those available
            foreach ($fields as $fieldKey => $field) {
                if (!in_array($fieldKey, $blockFields)) {
                    unset($content[$blockKey]['fields'][$fieldKey]);
                }
            }
        }

        return $content;
    }
}