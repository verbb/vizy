<?php
namespace verbb\vizy\nodes;

use verbb\vizy\base\Node;

use craft\base\ElementInterface;

class TableCell extends Node
{
    // Properties
    // =========================================================================

    public static ?string $type = 'tableCell';
    public mixed $tagName = 'td';


    // Public Methods
    // =========================================================================

    public function getTag(): array
    {
        $attrs = [];

        if (isset($this->attrs)) {
            if (isset($this->attrs['colspan'])) {
                $attrs['colspan'] = $this->attrs['colspan'];
            }

            if (isset($this->attrs['colwidth']) && $widths = $this->attrs['colwidth']) {
                if (count($widths) === $attrs['colspan']) {
                    $attrs['data-colwidth'] = implode(',', $widths);
                }
            }

            if (isset($this->attrs['rowspan'])) {
                $attrs['rowspan'] = $this->attrs['rowspan'];
            }
        }

        return [
            [
                'tag' => $this->tagName,
                'attrs' => $attrs,
            ],
        ];
    }

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

}
