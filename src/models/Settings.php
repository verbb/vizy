<?php
namespace verbb\vizy\models;

use Craft;
use craft\base\Model;
use craft\helpers\App;
use craft\helpers\FileHelper;

class Settings extends Model
{
    // Properties
    // =========================================================================

    public string $iconsPath = '@webroot/icons/';


    // Public Methods
    // =========================================================================

    public function getIconsPath(): string
    {
        if ($this->iconsPath) {
            return FileHelper::normalizePath(App::parseEnv($this->iconsPath));
        }

        return $this->iconsPath;
    }

}
