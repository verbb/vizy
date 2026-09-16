<?php
namespace verbb\vizy\web\assets\field;

use verbb\vizy\helpers\ViteManifest;

use Craft;
use craft\base\ElementInterface;
use craft\web\AssetBundle;
use craft\web\assets\cp\CpAsset;
use craft\web\View;

use verbb\base\assetbundles\CpAsset as VerbbCpAsset;

class VizyAsset extends AssetBundle
{
    // Public Methods
    // =========================================================================

    public function init(): void
    {
        $this->sourcePath = __DIR__ . '/dist/';

        $assets = ViteManifest::assets($this->sourcePath . 'manifest.json', 'field/src/ts/vizy.ts');

        $this->js = [$assets['js']];
        $this->css = $assets['css'];
        $this->jsOptions = ['type' => 'module'];

        $this->depends = [
            VerbbCpAsset::class,
            CpAsset::class,
        ];

        parent::init();
    }

    public function registerAssetFiles($view): void
    {
        parent::registerAssetFiles($view);

        if ($view instanceof View) {
            $this->_registerRefHandles($view);

            $view->registerTranslations('vizy', [
                'Link to the current site',
            ]);
        }
    }


    // Private Methods
    // =========================================================================

    private function _registerRefHandles(View $view): void
    {
        $refHandles = [];

        foreach (Craft::$app->getElements()->getAllElementTypes() as $elementType) {
            if ($elementType::isLocalized() && ($refHandle = $elementType::refHandle()) !== null) {
                $refHandles[] = $refHandle;
            }
        }

        $view->registerJsWithVars(fn($refHandles) => <<<JS
            window.VizyLocalizedRefHandles = $refHandles;
        JS, [$refHandles], View::POS_END);
    }
}
