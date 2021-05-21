<?php
namespace verbb\vizy\services;

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

}
