<?php
namespace verbb\vizy\integrations\feedme\fields;

use verbb\vizy\fields\VizyField;

use craft\helpers\Json;

use craft\feedme\base\Field;
use craft\feedme\base\FieldInterface;

use Tiptap\Editor;

class Vizy extends Field implements FieldInterface
{
    // Properties
    // =========================================================================

    public static $name = 'Vizy';
    public static $class = VizyField::class;


    // Templates
    // =========================================================================

    /**
     * @inheritDoc
     */
    public function getMappingTemplate(): string
    {
        return 'feed-me/_includes/fields/default';
    }


    // Public Methods
    // =========================================================================

    /**
     * @inheritDoc
     */
    public function parseField(): string
    {
        $value = $this->fetchValue();

        $editor = new Editor([
            'content' => $value,
            'extensions' => [
                new \Tiptap\Extensions\StarterKit,
                new \Tiptap\Nodes\Image,
                new \Tiptap\Marks\Highlight,
                new \Tiptap\Marks\Link,
                new \Tiptap\Marks\Subscript,
                new \Tiptap\Marks\Superscript,
                new \Tiptap\Marks\Underline,
            ],
        ]);

        $doc = $editor->getDocument();

        if (is_array($doc) && array_key_exists('content', $doc)) {
            return Json::encode($doc['content']);
        }

        return '';
    }
}
