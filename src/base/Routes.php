<?php
namespace verbb\vizy\base;

use craft\events\RegisterUrlRulesEvent;
use craft\web\UrlManager;

use yii\base\Event;

trait Routes
{
    // Private Methods
    // =========================================================================

    public function _registerCpRoutes(): void
    {
        Event::on(UrlManager::class, UrlManager::EVENT_REGISTER_CP_URL_RULES, function(RegisterUrlRulesEvent $event): void {
            $event->rules['vizy'] = 'vizy/settings/index';
            $event->rules['vizy/settings'] = 'vizy/settings/index';
        });
    }
}

