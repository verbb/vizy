<?php

declare(strict_types=1);

use craft\events\RegisterUrlRulesEvent;
use craft\web\UrlManager;
use craft\web\UrlRule;
use verbb\vizy\document\DeterministicUidFactory;
use verbb\vizy\Vizy;
use yii\base\Event;

function vizyBlockTypeCpRoute(string $path): ?array
{
    static $registered = false;

    // CP routes are only registered for CP requests, which tests don't run as.
    if (!$registered) {
        Vizy::$plugin->_registerCpRoutes();
        $registered = true;
    }

    $event = new RegisterUrlRulesEvent(['rules' => []]);
    Event::trigger(UrlManager::class, UrlManager::EVENT_REGISTER_CP_URL_RULES, $event);

    // Plain Yii objects keep parsing independent of the test request type.
    $urlManager = new \yii\web\UrlManager(['enablePrettyUrl' => true]);
    $request = new \yii\web\Request();
    $request->setPathInfo($path);

    foreach ($event->rules as $pattern => $route) {
        if (!str_starts_with($pattern, 'vizy/settings/block-types')) {
            continue;
        }

        $result = (new UrlRule(['pattern' => $pattern, 'route' => $route]))->parseRequest($urlManager, $request);

        if ($result !== false) {
            return $result;
        }
    }

    return null;
}

it('routes Block Types with Vizy 3 promoted UIDs to the edit screen', function() {
    // Vizy 3 schema promotion mints v5-shaped UIDs, which Craft's `{uid}` token rejects.
    $uid = (new DeterministicUidFactory('vizy3-schema-promotion:field'))->uid('blockType:uid');

    expect(substr($uid, 14, 1))->toBe('5')
        ->and(vizyBlockTypeCpRoute("vizy/settings/block-types/{$uid}"))->toBe(['vizy/block-types/edit', ['uid' => $uid]]);
});

it('routes Block Types with v4 UIDs and new Block Types to the edit screen', function() {
    $uid = 'a3bb189e-8bf9-4888-9912-ace4e6543002';

    expect(vizyBlockTypeCpRoute("vizy/settings/block-types/{$uid}"))->toBe(['vizy/block-types/edit', ['uid' => $uid]])
        ->and(vizyBlockTypeCpRoute('vizy/settings/block-types/new'))->toBe(['vizy/block-types/edit', []])
        ->and(vizyBlockTypeCpRoute('vizy/settings/block-types/not-a-uid'))->toBeNull();
});
