<?php
namespace verbb\vizy\integrations\feedme\fields;

use verbb\vizy\fields\VizyField;

use craft\helpers\Json;

use craft\feedme\base\Field;
use craft\feedme\base\FieldInterface;

use Tiptap\Editor;
use Tiptap\Marks;
use Tiptap\Nodes;
use Tiptap\Extensions\StarterKit;

class Vizy extends Field implements FieldInterface
{
    // Properties
    // =========================================================================

    public static $name = 'Vizy';
    public static $class = VizyField::class;


    // Templates
    // =========================================================================

    public function getMappingTemplate(): string
    {
        return 'feed-me/_includes/fields/default';
    }


    // Public Methods
    // =========================================================================

    public function parseField(): string
    {
        $value = $this->fetchValue() ?? [ 'content' => '' ];

        $editor = new Editor([
            'content' => $value,
            'extensions' => [
                new StarterKit,
                new Nodes\Image,
                new Marks\Highlight,
                new Marks\Link,
                new Marks\Subscript,
                new Marks\Superscript,
                new Nodes\Table,
                new Nodes\TableCell,
                new Nodes\TableHeader,
                new Nodes\TableRow,
                new Marks\Underline,
            ],
        ]);

        $doc = $editor->getDocument();

        if (is_array($doc) && array_key_exists('content', $doc)) {
            return Json::encode($doc['content']);
        }

        return '';
    }
}
