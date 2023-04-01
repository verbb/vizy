<?php
namespace verbb\vizy\base;

use craft\base\Component;

class Plugin extends Component implements PluginInterface
{
    // Properties
    // =========================================================================

    public string $handle;
    public string $assetBundle;

}
