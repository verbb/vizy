<?php
namespace verbb\vizy\base;

use craft\base\Component;

/**
 * @deprecated Vizy 3 plugin AssetBundle registration is not used in Vizy 4. Removed in Vizy 5.
 */
class Plugin extends Component implements PluginInterface
{
    // Properties
    // =========================================================================

    public string $handle;
    public string $assetBundle;

}
