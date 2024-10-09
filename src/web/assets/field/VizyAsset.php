<?php
namespace verbb\vizy\web\assets\field;

use Craft;
use craft\base\ElementInterface;
use craft\helpers\Json;
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
            $this->registerRefHandles($view);

            $view->registerTranslations('vizy', [
                'Link to the current site',
            ]);
        }
    }


    // Private Methods
    // =========================================================================

    private function registerRefHandles(View $view): void
    {
        $refHandles = [];

        foreach (Craft::$app->getElements()->getAllElementTypes() as $elementType) {
            /** @var string|ElementInterface $elementType */
            if ($elementType::isLocalized() && ($refHandle = $elementType::refHandle()) !== null) {
                $refHandles[] = $refHandle;
            }
        }

        $view->registerJsWithVars(fn($refHandles) => <<<JS
            window.VizyLocalizedRefHandles = $refHandles;
        JS, [$refHandles], View::POS_END);
    }
}
