<?php
namespace verbb\vizy\services;

use verbb\vizy\fields\VizyField;

use Craft;
use craft\base\Component;
use craft\db\Query;
use craft\db\Table;
use craft\models\FieldLayout;

class Service extends Component
{
    // Public Methods
    // =========================================================================

    public function getFieldLayoutByUid($layoutUid)
    {
        $result = (new Query)
            ->select([
                'id',
                'type',
                'uid'
            ])
            ->from([Table::FIELDLAYOUTS])
            ->where(['uid' => $layoutUid])
            ->one();

        return $result ? new FieldLayout($result) : null;
    }

    public function getAllBlockTypes()
    {
        $blockTypes = [];

        foreach (Craft::$app->getFields()->getAllFields(false) as $field) {
            if ($field instanceof VizyField) {
                $blockTypes = array_merge($blockTypes, $field->getBlockTypes());
            }
        }

        return $blockTypes;
    }

}
