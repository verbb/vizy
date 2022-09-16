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

        if (!$value) {
            return '';
        }

        $renderer = new Renderer();
        $doc = $renderer->render($value);

        $json = Json::encode($doc['content']);

        // Hack for now, better support for nodes in Vizy 2.
        $json = str_replace('bullet_list', 'bulletList', $json);
        $json = str_replace('code_block', 'codeBlock', $json);
        $json = str_replace('hard_break', 'hardBreak', $json);
        $json = str_replace('horizontal_rule', 'horizontalRule', $json);
        $json = str_replace('ordered_list', 'orderedList', $json);

        return $json;
    }
}
