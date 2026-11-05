<?php
namespace verbb\vizy\web\assets\diagnostics;

use verbb\vizy\helpers\ViteManifest;
use verbb\vizy\web\assets\cp\VizyCpAsset;

use craft\web\AssetBundle;

/** Plugin Kit controls and styles for the support page only, unlike the small capture script. */
class SupportPageAsset extends AssetBundle
{
    // Public Methods
    // =========================================================================

    public function init(): void
    {
        $this->sourcePath = dirname(__DIR__) . '/field/dist/';

        $assets = ViteManifest::assets(
            $this->sourcePath . 'manifest.json',
            'diagnostics/src/support.ts',
        );

        $this->js = [$assets['js']];
        $this->css = $assets['css'];
        $this->jsOptions = ['type' => 'module'];

        $this->depends = [
            VizyCpAsset::class,
        ];

        parent::init();
    }
}
