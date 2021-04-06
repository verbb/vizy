<?php
namespace verbb\vizy\models;

use verbb\vizy\Vizy;

use Craft;
use craft\base\Model;
use craft\helpers\FileHelper;

class Settings extends Model
{
    // Properties
    // =========================================================================

    public $iconsPath = '@webroot/icons/';


    // Public Methods
    // =========================================================================

    public function getIconsPath()
    {
        if ($this->iconsPath) {
            return FileHelper::normalizePath(Craft::parseEnv($this->iconsPath));
        }

        return $this->iconsPath;
    }

}
