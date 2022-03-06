<?php
namespace verbb\vizy\base;

use verbb\vizy\Vizy;
use verbb\vizy\services\Icons;
use verbb\vizy\services\Nodes;
use verbb\vizy\services\Service;

use Craft;

use yii\log\Logger;

use verbb\base\BaseHelper;

trait PluginTrait
{
    // Properties
    // =========================================================================

    public static Vizy $plugin;


    // Static Methods
    // =========================================================================

    public static function log($message): void
    {
        Craft::getLogger()->log($message, Logger::LEVEL_INFO, 'vizy');
    }

    public static function error($message): void
    {
        Craft::getLogger()->log($message, Logger::LEVEL_ERROR, 'vizy');
    }


    // Public Methods
    // =========================================================================

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


    // Private Methods
    // =========================================================================

    private function _setPluginComponents(): void
    {
        $this->setComponents([
            'icons' => Icons::class,
            'nodes' => Nodes::class,
            'service' => Service::class,
        ]);

        BaseHelper::registerModule();
    }

    private function _setLogging(): void
    {
        BaseHelper::setFileLogging('vizy');
    }
}
