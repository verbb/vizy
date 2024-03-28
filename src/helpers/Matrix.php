<?php
namespace verbb\vizy\helpers;

class Matrix
{
    // Static Methods
    // =========================================================================

    public static function sanitizeMatrixContent($field, $content)
    {
        $entryTypes = array_map(function($block) {
            return $block->handle;
        }, $field->entryTypes);

        $entryTypeFields = [];

        foreach ($field->entryTypes as $entryType) {
            $entryTypeFields[] = $entryType->getCustomFields();
        }

        $blockFields = array_map(function($block) {
            return $block->handle;
        }, array_merge(...$entryTypeFields));

        if (!is_array($content)) {
            $content = [];
        }

        // Handle new blocks, which are structured differently
        if (isset($content['blocks'])) {
            $content['blocks'] = self::filterContent($content['blocks'], $entryTypes, $blockFields);
        } else {
            $content = self::filterContent($content, $entryTypes, $blockFields);
        }

        return $content;
    }

    public static function isMatrix($field): bool
    {
        return $field instanceof \craft\fields\Matrix;
    }

    private static function filterContent($content, $entryTypes, $blockFields)
    {
        foreach ($content as $blockKey => $block) {
            $type = $block['type'] ?? '';
            $fields = $block['fields'] ?? [];

            // We save the UID of the "entry" as the key, so use that as the identifier
            $content[$blockKey]['uid'] = $blockKey;

            // Filter block types against those available
            if ($type && !in_array($type, $entryTypes)) {
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