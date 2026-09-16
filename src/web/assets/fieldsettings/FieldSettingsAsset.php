<?php
namespace verbb\vizy\web\assets\fieldsettings;

use verbb\vizy\helpers\ViteManifest;
use verbb\vizy\web\assets\cp\VizyCpAsset;

use craft\web\AssetBundle;
use craft\web\View;

class FieldSettingsAsset extends AssetBundle
{
    // Public Methods
    // =========================================================================

    public function init(): void
    {
        $this->sourcePath = dirname(__DIR__) . '/field/dist/';

        $assets = ViteManifest::assets(
            $this->sourcePath . 'manifest.json',
            'fieldsettings/src/ts/field-settings.ts',
        );

        $this->js = [$assets['js']];
        $this->css = $assets['css'];
        $this->jsOptions = ['type' => 'module'];

        $this->depends = [
            VizyCpAsset::class,
        ];

        parent::init();
    }

    public function registerAssetFiles($view): void
    {
        parent::registerAssetFiles($view);

        if ($view instanceof View) {
            $view->registerTranslations('vizy', [
                'Block Configuration',
                'Add Block',
                'Add existing block type',
                'Choose a global Block Type…',
                'Add Group',
                'Select a block to edit.',
                'Add a new group to begin.',
                'Delete',
                'Blocks',
                'Global Block Type',
            ]);
        }
    }
}
