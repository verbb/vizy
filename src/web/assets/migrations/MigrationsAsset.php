<?php
namespace verbb\vizy\web\assets\migrations;

use verbb\vizy\helpers\ViteManifest;
use verbb\vizy\web\assets\cp\VizyCpAsset;

use craft\web\AssetBundle;

class MigrationsAsset extends AssetBundle
{
    // Public Methods
    // =========================================================================

    public function init(): void
    {
        $this->sourcePath = dirname(__DIR__) . '/field/dist/';

        $assets = ViteManifest::assets(
            $this->sourcePath . 'manifest.json',
            'migrations/src/ts/migrations.ts',
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
