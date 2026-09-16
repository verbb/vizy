<?php
namespace verbb\vizy\base;

use craft\events\RegisterUrlRulesEvent;
use craft\web\UrlManager;

use yii\base\Event;

trait Routes
{
    // Public Methods
    // =========================================================================

    public function _registerCpRoutes(): void
    {
        Event::on(UrlManager::class, UrlManager::EVENT_REGISTER_CP_URL_RULES, function(RegisterUrlRulesEvent $event): void {
            // Block Types and Editor Configs are admin-only project schema, so they
            // live under the plugin settings section rather than a CP nav section.
            $event->rules = array_merge($event->rules, [
                'vizy' => 'vizy/settings/index',
                'vizy/settings' => 'vizy/settings/index',
                'vizy/settings/block-types' => 'vizy/block-types/index',
                'vizy/settings/block-types/new' => 'vizy/block-types/edit',
                'vizy/settings/block-types/<uid:{uid}>' => 'vizy/block-types/edit',
                'vizy/settings/editor-configs' => 'vizy/editor-configs/index',
                'vizy/settings/editor-configs/new' => 'vizy/editor-configs/edit',
                'vizy/settings/editor-configs/<id:[\\w\\-]+>' => 'vizy/editor-configs/edit',
            ]);
        });
    }
}
