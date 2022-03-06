<?php
namespace verbb\vizy\integrations\feedme\fields;

use verbb\vizy\fields\VizyField;

use craft\helpers\Json;

use craft\feedme\base\Field;
use craft\feedme\base\FieldInterface;

use HtmlToProseMirror\Renderer;

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

        $renderer = new Renderer();
        $doc = $renderer->render($value);

        return Json::encode($doc['content']);
    }
}
