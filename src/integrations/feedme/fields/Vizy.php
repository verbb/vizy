<?php
namespace verbb\vizy\integrations\feedme\fields;

use verbb\vizy\fields\VizyField;

use craft\helpers\Json;

use craft\feedme\base\Field;
use craft\feedme\base\FieldInterface;

use Tiptap\Editor;
use Tiptap\Marks\Underline;
use Tiptap\Marks\Superscript;
use Tiptap\Marks\Subscript;
use Tiptap\Marks\Link;
use Tiptap\Marks\Highlight;
use Tiptap\Nodes\Image;
use Tiptap\Extensions\StarterKit;

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
        $value = $this->fetchValue() ?? [ 'content' => '' ];

        $editor = new Editor([
            'content' => $value,
            'extensions' => [
                new StarterKit,
                new Image,
                new Highlight,
                new Link,
                new Subscript,
                new Superscript,
                new Underline,
            ],
        ]);

        $doc = $editor->getDocument();

        if (is_array($doc) && array_key_exists('content', $doc)) {
            return Json::encode($doc['content']);
        }

        return '';
    }
}
