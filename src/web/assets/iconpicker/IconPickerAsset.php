<?php
namespace verbb\vizy\web\assets\iconpicker;

use verbb\vizy\helpers\ViteManifest;
use verbb\vizy\web\assets\cp\VizyCpAsset;

use craft\web\AssetBundle;
use craft\web\View;

class IconPickerAsset extends AssetBundle
{
    // Public Methods
    // =========================================================================

    public function init(): void
    {
        $this->sourcePath = dirname(__DIR__) . '/field/dist/';

        $assets = ViteManifest::assets(
            $this->sourcePath . 'manifest.json',
            'iconpicker/src/ts/icon-picker.ts',
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
                'Search icons',
                'Search images',
                'No icons match your query.',
                'No images match your query.',
                'Choose an icon',
                'Choose a preview image',
                'Clear',
                'Couldn’t load icons.',
                'Couldn’t load images.',
                'Couldn’t load catalog.',
                'Preview Images',
                'Icon',
                'Preview Image',
            ]);
        }
    }
}
