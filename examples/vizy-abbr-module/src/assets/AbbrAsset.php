<?php
namespace modules\vizyabbr\assets;

use craft\web\AssetBundle;
use craft\web\assets\cp\CpAsset;
use verbb\vizy\web\assets\field\VizyAsset;

class AbbrAsset extends AssetBundle
{
    public function init(): void
    {
        $this->sourcePath = dirname(__DIR__) . '/web';
        $this->depends = [
            CpAsset::class,
            // Ensures Craft.Vizy.registerModule / tiptap.* exist before abbr.js
            VizyAsset::class,
        ];
        $this->js = ['abbr.js'];
        parent::init();
    }
}
