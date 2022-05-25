<?php
namespace verbb\vizy\base;

use verbb\base\BaseHelper;
use verbb\vizy\services\Cache;
use verbb\vizy\services\Icons;
use verbb\vizy\services\Nodes;
use verbb\vizy\services\Service;

use Craft;

use yii\log\Logger;

trait PluginTrait
{
    // Static Properties
    // =========================================================================

    public static $plugin;


    // Public Methods
    // =========================================================================

    public function getCache(): Cache
    {
        return $this->get('cache');
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

    public static function log($message)
    {
        Craft::getLogger()->log($message, Logger::LEVEL_INFO, 'vizy');
    }

    public static function error($message)
    {
        Craft::getLogger()->log($message, Logger::LEVEL_ERROR, 'vizy');
    }


    // Private Methods
    // =========================================================================

    private function _setPluginComponents()
    {
        $this->setComponents([
            'cache' => Cache::class,
            'icons' => Icons::class,
            'nodes' => Nodes::class,
            'service' => Service::class,
        ]);

        BaseHelper::registerModule();
    }

    private function _setLogging()
    {
        BaseHelper::setFileLogging('vizy');
    }
}
