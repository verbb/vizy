<?php
namespace verbb\vizy\helpers;

use verbb\vizy\Vizy;
use verbb\vizy\web\assets\field\VizyAsset;

class Plugin
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
            'onload' => '',
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
