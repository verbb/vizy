<?php
namespace verbb\vizy\integrations\feedme\fields;

use verbb\vizy\fields\VizyField;

use craft\helpers\Html;
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
        $value = $this->fetchValue() ?? null;

        if (!$value) {
            $value = ['content' => ''];
        }

        // Non-string scalars (e.g. int from a JSON feed) are an unknown format to TipTap
        if (is_scalar($value) && !is_string($value)) {
            $value = (string)$value;
        }

        // TipTap treats any successful json_decode() as a document, including JSON
        // scalars like `"quoted title"` or `2026`. Those are plain text — force HTML.
        if (is_string($value) && $value !== '') {
            $decoded = Json::decodeIfJson($value);

            if ($decoded !== $value && !is_array($decoded)) {
                $value = '<p>' . Html::encode($value) . '</p>';
            }
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
            ],
        ]);

        $doc = $editor->getDocument();

        if (is_array($doc) && array_key_exists('content', $doc)) {
            return Json::encode($doc['content']);
        }

        return '';
    }
}
