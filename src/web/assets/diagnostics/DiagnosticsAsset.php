<?php
namespace verbb\vizy\web\assets\diagnostics;

use craft\web\AssetBundle;
use craft\web\View;

class DiagnosticsAsset extends AssetBundle
{
    // Public Methods
    // =========================================================================

    public function init(): void
    {
        $this->sourcePath = __DIR__ . '/dist';
        $this->js = ['capture.js'];
        // A small, dependency-free classic script runs before editor modules so
        // failed imports and early initialization errors can be observed.
        $this->jsOptions = ['position' => View::POS_HEAD];

        parent::init();
    }
}
