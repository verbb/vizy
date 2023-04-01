<?php
namespace verbb\vizy\base;

use verbb\vizy\Vizy;
use verbb\vizy\services\Cache;
use verbb\vizy\services\Content;
use verbb\vizy\services\Icons;
use verbb\vizy\services\Nodes;
use verbb\vizy\services\Service;
use verbb\vizy\web\assets\field\VizyAsset;
use verbb\base\BaseHelper;

use Craft;

use yii\log\Logger;

use nystudio107\pluginvite\services\VitePluginService;

trait PluginTrait
{
    // Properties
    // =========================================================================

    public static Vizy $plugin;


    // Static Methods
    // =========================================================================

    public static function log(string $message, array $params = []): void
    {
        $message = Craft::t('vizy', $message, $params);

        Craft::getLogger()->log($message, Logger::LEVEL_INFO, 'vizy');
    }

    public static function error(string $message, array $params = []): void
    {
        $message = Craft::t('vizy', $message, $params);

        Craft::getLogger()->log($message, Logger::LEVEL_ERROR, 'vizy');
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


    // Private Methods
    // =========================================================================

    private function _registerComponents(): void
    {
        $this->setComponents([
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
        ]);

        BaseHelper::registerModule();
    }

    private function _registerLogTarget(): void
    {
        BaseHelper::setFileLogging('vizy');
    }
}
