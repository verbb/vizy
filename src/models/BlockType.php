<?php
namespace verbb\vizy\models;

use verbb\vizy\Vizy;

use Craft;
use craft\base\Model;
use craft\db\Table;
use craft\helpers\Db;
use craft\helpers\StringHelper;
use craft\models\FieldLayout;

use yii\base\InvalidConfigException;
use craft\base\FieldInterface;

class BlockType extends Model
{
    // Static Methods
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

    public static function refHandle(): ?string
    {
        return null;
    }


    // Properties
    // =========================================================================

    public ?string $id = null;
    public ?string $name = null;
    public ?string $handle = null;
    public mixed $icon = null;
    public ?string $template = null;
    public ?bool $enabled = null;
    public ?string $layoutUid = null;
    public ?array $layoutConfig = null;
    public ?int $fieldId = null;
    public ?int $minBlocks = null;
    public ?int $maxBlocks = null;

    private ?FieldLayout $_fieldLayout = null;


    // Public Methods
    // =========================================================================

    public function getFieldLayout(): ?FieldLayout
    {
        if ($this->_fieldLayout !== null) {
            return $this->_fieldLayout;
        }

        if ($this->layoutUid) {
            $this->_fieldLayout = Vizy::$plugin->getService()->getFieldLayoutByUid($this->layoutUid);
        }

        return $this->_fieldLayout;
    }

    public function setFieldLayout(FieldLayout $fieldLayout): void
    {
        $this->_fieldLayout = $fieldLayout;
    }

    public function getField(): FieldInterface
    {
        if ($this->fieldId === null) {
            throw new InvalidConfigException('Block type missing its field ID');
        }

        if (($field = Craft::$app->getFields()->getFieldById($this->fieldId)) === null) {
            throw new InvalidConfigException('Invalid field ID: ' . $this->fieldId);
        }

        return $field;
    }

    public function serializeArray(): array
    {
        $data = $this->toArray();

        // Don't store the SVG itself in the db, just the label/name
        unset($data['icon']['svg']);

        // Store the field layout, which isn't stored in project config. We'll use this in PC event handlers.
        if ($fieldLayout = $this->getFieldLayout()) {
            $data['layoutConfig'] = $fieldLayout->getConfig();

            // Set the layout UID, if not already set, fetch an existing one, or generate a new one.
            // This is so we have always maintained a reference to a layout UID, even if we might not be
            // creating one until after the field has saved, and the PC event handlers kick in.
            $data['layoutUid'] ??= $fieldLayout->uid ??
                ($fieldLayout->id ? Db::uidById(Table::FIELDLAYOUTS, $fieldLayout->id) : null) ??
                StringHelper::UUID();
        }

        return $data;
    }

    public function toArray(array $fields = [], array $expand = [], $recursive = true): array
    {
        $array = parent::toArray($fields, $expand, $recursive);

        // Add in the SVG for the icon fresh
        if (isset($array['icon']['value'])) {
            if ($icon = Vizy::$plugin->getIcons()->getIconForValue($array['icon']['value'])) {
                $array['icon'] = $icon;
            }
        }

        return $array;
    }


    // Protected Methods
    // =========================================================================

    protected function defineRules(): array
    {
        $rules = parent::defineRules();
        $rules[] = [['name', 'handle', 'icon'], 'required'];

        return $rules;
    }
}
