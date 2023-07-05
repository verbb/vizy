<?php
namespace verbb\vizy\nodes;

use verbb\vizy\base\Node;

use craft\base\ElementInterface;

class TableHeader extends Node
{
    // Properties
    // =========================================================================

    public static ?string $type = 'tableHeader';
    public mixed $tagName = 'th';


    // Public Methods
    // =========================================================================

    public function serializeValue(ElementInterface $element = null): ?array
    {
        $value = parent::serializeValue($element);

        $value['content'] = array_filter(($value['content'] ?? []));

        // Table headers/cells seem to struggle if any empty paragraph is stripped out, which will happen by default
        // so always ensure at least a paragraph node exists.
        if (!$value['content']) {
            $value['content'] = [['type' => 'paragraph']];
        }

        return $value;
    }

    public function normalizeValue(?ElementInterface $element = null): ?array
    {
        $value = parent::normalizeValue($element);

        $value['content'] = array_filter(($value['content'] ?? []));

        // Table headers/cells seem to struggle if any empty paragraph is stripped out, which will happen by default
        // so always ensure at least a paragraph node exists.
        if (!$value['content']) {
            $value['content'] = [['type' => 'paragraph']];
        }

        return $value;
    }

}
