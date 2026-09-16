<?php
namespace verbb\vizy\deprecations;

use Craft;

/**
 * Vizy 3 JS plugin registration (`Craft.Vizy.Config` / AssetBundle `plugins[]`).
 *
 * Replaced in Vizy 4 by `EVENT_REGISTER_EXTENSIONS` (PHP) +
 * `Craft.Vizy.registerModule` / `registerControl` / `replaceModule` (JS).
 * This trait's `registerPlugin()` no-ops and logs a deprecation. Removed in Vizy 5.
 */
trait VizyFieldPluginDeprecations
{
    // Static Methods
    // =========================================================================

    /**
     * @deprecated Use Craft.Vizy.registerModule / registerControl. Removed in Vizy 5.
     */
    public static function registerPlugin(string $pluginKey): void
    {
        Craft::$app->getDeprecator()->log(
            'verbb\\vizy\\fields\\VizyField::registerPlugin',
            "VizyField::registerPlugin('{$pluginKey}') is deprecated. "
            . 'Register TipTap modules with EVENT_REGISTER_EXTENSIONS and Craft.Vizy.registerModule() instead. '
            . 'It will be removed in Vizy 5.',
        );
    }


    // Constants
    // =========================================================================

    /**
     * @deprecated Use Extensions registration + Craft.Vizy.registerModule. This event is never usefully triggered. Removed in Vizy 5.
     */
    public const EVENT_REGISTER_PLUGINS = 'registerPlugins';
}
