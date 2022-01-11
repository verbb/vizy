<?php
namespace verbb\vizy\nodes;

use verbb\vizy\base\Node;

use craft\base\ElementInterface;
use craft\helpers\ArrayHelper;
use craft\helpers\StringHelper;

class Paragraph extends Node
{
    // Properties
    // =========================================================================

    public static $type = 'paragraph';
    public $tagName = 'p';
    

    // Public Methods
    // =========================================================================

    public function getTag()
    {
        // Don't include certain attributes in rendering
        $align = ArrayHelper::remove($this->attrs, 'textAlign');

        // Add instead as a class, `text-left`, `text-right`, etc.
        if ($align && $align !== 'start') {
            $this->attrs['class'] = trim(($this->attrs['class'] ?? '') . ' text-' . $align);
        }

        return parent::getTag();
    }

    public function serializeValue(ElementInterface $element = null)
    {
        $value = parent::serializeValue($element);

        // Check if we're to exclude empty nodes
        if ($this->field->trimEmptyParagraphs) {
            $text = $value['content'][0]['text'] ?? '';
            $text = StringHelper::trim($text);

            if ($text === '') {
                return false;
            }
        }

        return $value;
    }

}
