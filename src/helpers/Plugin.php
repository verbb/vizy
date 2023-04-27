<?php
namespace verbb\vizy\helpers;

use verbb\vizy\Vizy;
use verbb\vizy\web\assets\field\VizyAsset;

use Craft;

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

    public static function isPluginInstalledAndEnabled(string $plugin): bool
    {
        $pluginsService = Craft::$app->getPlugins();

        // Ensure that we check if initialized, installed and enabled. 
        // The plugin might be installed but disabled, or installed and enabled, but missing plugin files.
        return $pluginsService->isPluginInstalled($plugin) && $pluginsService->isPluginEnabled($plugin) && $pluginsService->getPlugin($plugin);
    }

}
