<?php
namespace verbb\vizy\integrations\feedme\fields;

use verbb\vizy\fields\VizyField;
use verbb\vizy\integrations\feedme\FeedMeDocumentAdapter;
use verbb\vizy\integrations\feedme\VizyBlock;

use craft\feedme\base\Field;
use craft\feedme\base\FieldInterface;
use Tiptap\Editor;
use Tiptap\Extensions\StarterKit;
use Tiptap\Marks;
use Tiptap\Nodes;

class Vizy extends Field implements FieldInterface
{
    // Properties
    // =========================================================================

    public static $name = 'Vizy';
    public static $class = VizyField::class;


    // Public Methods
    // =========================================================================

    // Templates

    public function getMappingTemplate(): string
    {
        return 'feed-me/_includes/fields/default';
    }

    public function parseField(): string
    {
        $value = $this->fetchValue() ?? null;

        $adapter = new FeedMeDocumentAdapter();
        if ($canonical = $adapter->canonicalize($value)) {
            return $canonical;
        }

        if (!$value) {
            $value = ['content' => ''];
        }

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
                new VizyBlock,
            ],
        ]);

        $doc = $editor->getDocument();

        if (is_array($doc) && array_key_exists('content', $doc)) {
            return $adapter->validateEnvelope($doc['content']);
        }

        return $adapter->validateEnvelope([]);
    }
}
