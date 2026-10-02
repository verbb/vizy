<?php
namespace verbb\vizy\models;

use craft\base\Model;
use craft\helpers\App;
use craft\helpers\FileHelper;

class Settings extends Model
{
    // Properties
    // =========================================================================

    public string $iconsPath = '@webroot/icons/';

    /**
     * Optional site-template folder containing `nodes/` and `marks/` partials.
     */
    public string $renderTemplatesPath = '';

    /**
     * Folder of Block Type preview images (png/jpg/webp/gif). Relative paths are
     * stored on Block Types for Project Config portability — not Craft assets.
     */
    public string $blockPreviewImagesPath = '@webroot/vizy-block-previews/';


    // Public Methods
    // =========================================================================

    public function getIconsPath(): string
    {
        if ($this->iconsPath) {
            return FileHelper::normalizePath(App::parseEnv($this->iconsPath));
        }

        return $this->iconsPath;
    }

    public function getBlockPreviewImagesPath(): string
    {
        if ($this->blockPreviewImagesPath) {
            return FileHelper::normalizePath(App::parseEnv($this->blockPreviewImagesPath));
        }

        return $this->blockPreviewImagesPath;
    }

    public function getRenderTemplatesPath(): string
    {
        $path = trim((string)App::parseEnv($this->renderTemplatesPath));

        return trim($path, '/');
    }

    public function defineRules(): array
    {
        return parent::defineRules();
    }
}
