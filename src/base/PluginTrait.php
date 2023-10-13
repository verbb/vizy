<?php
namespace verbb\vizy\base;

use verbb\vizy\Vizy;
use verbb\vizy\services\Cache;
use verbb\vizy\services\Content;
use verbb\vizy\services\Icons;
use verbb\vizy\services\Nodes;
use verbb\vizy\services\Service;
use verbb\vizy\web\assets\field\VizyAsset;

use verbb\base\LogTrait;
use verbb\base\helpers\Plugin;

use nystudio107\pluginvite\services\VitePluginService;

trait PluginTrait
{
    // Properties
    // =========================================================================

    public static ?Vizy $plugin = null;


    // Traits
    // =========================================================================

    use LogTrait;
    

    // Static Methods
    // =========================================================================

    public static function config(): array
    {
        Plugin::bootstrapPlugin('vizy');

        return [
            'components' => [
                'cache' => Cache::class,
                'content' => Content::class,
                'icons' => Icons::class,
                'nodes' => Nodes::class,
                'service' => Service::class,
                'vite' => [
                    'class' => VitePluginService::class,
                    'assetClass' => VizyAsset::class,
                    'useDevServer' => true,
                    'devServerPublic' => 'http://localhost:4001/',
                    'errorEntry' => 'js/main.js',
                    'cacheKeySuffix' => '',
                    'devServerInternal' => 'http://localhost:4001/',
                    'checkDevServer' => true,
                    'includeReactRefreshShim' => false,
                ],
            ],
        ];
    }


    // Public Methods
    // =========================================================================

    public function getCache(): Cache
    {
        return $this->get('cache');
    }

    public function getContent(): Content
    {
        return $this->get('content');
    }

    public function getIcons(): Icons
    {
        return $this->get('icons');
    }

    public function getNodes(): Nodes
    {
        return $this->get('nodes');
    }

    public function getService(): Service
    {
        return $this->get('service');
    }

    public function getVite(): VitePluginService
    {
        return $this->get('vite');
    }
}
