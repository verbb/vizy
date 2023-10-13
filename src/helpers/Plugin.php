<?php
namespace verbb\vizy\helpers;

use verbb\vizy\Vizy;
use verbb\vizy\web\assets\field\VizyAsset;

use verbb\base\helpers\Plugin as BasePlugin;

class Plugin extends BasePlugin
{
    // Static Methods
    // =========================================================================

    public static function registerAsset(string $path): void
    {
        $viteService = Vizy::$plugin->getVite();

        $scriptOptions = [
            'depends' => [
                VizyAsset::class,
            ],
            'onload' => null,
        ];

        $styleOptions = [
            'depends' => [
                VizyAsset::class,
            ],
        ];

        $viteService->register($path, false, $scriptOptions, $styleOptions);

        // Provide nice build errors - only in dev
        if ($viteService->devServerRunning()) {
            $viteService->register('@vite/client', false);
        }
    }

}
