<?php
namespace verbb\vizy\events;

use yii\base\Event;

/**
 * @deprecated Vizy 3 JS plugins / AssetBundles are not loaded in Vizy 4.
 * {@see \verbb\vizy\fields\VizyField::registerPlugin()} is a no-op. Removed in Vizy 5.
 */
class RegisterPluginEvent extends Event
{
    // Properties
    // =========================================================================

    public array $plugins = [];
}
