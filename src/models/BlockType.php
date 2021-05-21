<?php
namespace verbb\vizy\models;

use verbb\vizy\Vizy;

use Craft;
use craft\base\Model;

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

    private $_fieldLayout;


    // Public Methods
    // =========================================================================

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

    public function serializeArray()
    {
        $data = $this->toArray();

        // Don't store the SVG itself in the db, just the label/name
        unset($data['icon']['svg']);

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
