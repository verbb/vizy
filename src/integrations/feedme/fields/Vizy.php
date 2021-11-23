<?php
namespace verbb\vizy\integrations\feedme\fields;

use Craft;
use craft\helpers\Json;

use craft\feedme\base\Field;
use craft\feedme\base\FieldInterface;
use craft\feedme\helpers\DataHelper;

use HtmlToProseMirror\Renderer;

use Cake\Utility\Hash;

class Vizy extends Field implements FieldInterface
{
    // Properties
    // =========================================================================

    /**
     * @var string
     */
    public static $name = 'Vizy';

    /**
     * @var string
     */
    public static $class = 'verbb\vizy\fields\VizyField';


    // Templates
    // =========================================================================

    /**
     * @inheritDoc
     */
    public function getMappingTemplate()
    {
        return 'feed-me/_includes/fields/default';
    }


    // Public Methods
    // =========================================================================

    /**
     * @inheritDoc
     */
    public function parseField()
    {
        $value = $this->fetchValue();

        $renderer = new Renderer();
        $doc = $renderer->render($value);

        return Json::encode($doc['content']);
    }
}
