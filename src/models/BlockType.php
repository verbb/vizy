<?php
namespace verbb\vizy\models;

use verbb\vizy\Vizy;

use Craft;
use craft\base\Model;
use craft\db\Table;
use craft\helpers\Db;
use craft\helpers\Json;
use craft\helpers\StringHelper;
use craft\models\FieldLayout;

class BlockType extends Model
{
    // Properties
    // =========================================================================

    public $id;
    public $name;
    public $handle;
    public $icon;
    public $template;
    public $enabled;
    public $layoutUid;
    public $layoutConfig;

    private $_fieldLayout;


    // Public Methods
    // =========================================================================

    public static function displayName(): string
    {
        return Craft::t('vizy', 'Vizy Block');
    }

    public static function lowerDisplayName(): string
    {
        return StringHelper::toLowerCase(static::displayName());
    }

    public static function pluralDisplayName(): string
    {
        return Craft::t('vizy', 'Vizy Blocks');
    }

    public static function pluralLowerDisplayName(): string
    {
        return StringHelper::toLowerCase(static::pluralDisplayName());
    }

    public static function refHandle()
    {
        return null;
    }

    protected function defineRules(): array
    {
        $rules = parent::defineRules();
        $rules[] = [['name', 'handle', 'icon'], 'required'];

        return $rules;
    }

    public function getFieldLayout()
    {
        if ($this->_fieldLayout !== null) {
            return $this->_fieldLayout;
        }

        if ($this->layoutUid) {
            $this->_fieldLayout = Vizy::$plugin->getService()->getFieldLayoutByUid($this->layoutUid);
        }

        return $this->_fieldLayout;
    }

    public function setFieldLayout(FieldLayout $fieldLayout)
    {
        $this->_fieldLayout = $fieldLayout;
    }

    public function serializeArray()
    {
        $data = $this->toArray();

        // Don't store the SVG itself in the db, just the label/name
        unset($data['icon']['svg']);

        // Store the field layout, which isn't stored in project config. We'll use this in PC event handlers.
        if ($fieldLayout = $this->getFieldLayout()) {
            $data['layoutConfig'] = $fieldLayout->getConfig();

            // Set the layout UID, if not already set, fetch an existing one, or generate a new one.
            // This is so we have always maintain a reference to a layout UID, even if we might not be
            // creating one until after the field has saved, and the PC event handlers kick in.
            $data['layoutUid'] = $data['layoutUid'] ?? $fieldLayout->uid ??
                    ($fieldLayout->id ? Db::uidById(Table::FIELDLAYOUTS, $fieldLayout->id) : null) ??
                    StringHelper::UUID();
        }

        return $data;
    }

    public function toArray(array $fields = [], array $expand = [], $recursive = true)
    {
        $array = parent::toArray($fields, $expand, $recursive);

        // Add in the SVG for the icon fresh
        if (isset($array['icon']['value'])) {
            if ($icon = Vizy::$plugin->getIcons()->getIconForValue($array['icon']['value'], true)) {
                $array['icon'] = $icon;
            }
        }

        return $array;
    }
}
