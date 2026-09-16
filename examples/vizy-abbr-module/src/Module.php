<?php
namespace modules\vizyabbr;

use Craft;
use modules\vizyabbr\assets\AbbrAsset;
use verbb\vizy\events\RegisterExtensionsEvent;
use verbb\vizy\services\Extensions;
use yii\base\Event;
use yii\base\Module as BaseModule;

/**
 * Sample third-party module — Abbreviation mark.
 *
 * Copy into a Craft project; see README.md in this folder.
 */
class Module extends BaseModule
{
    public function init(): void
    {
        parent::init();

        Event::on(
            Extensions::class,
            Extensions::EVENT_REGISTER_EXTENSIONS,
            static function(RegisterExtensionsEvent $event): void {
                $event->marks[] = Abbr::class;
            }
        );

        if (Craft::$app->getRequest()->getIsCpRequest()) {
            Craft::$app->getView()->registerAssetBundle(AbbrAsset::class);
        }
    }
}
