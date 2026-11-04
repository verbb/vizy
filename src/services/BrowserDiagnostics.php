<?php
namespace verbb\vizy\services;

use verbb\vizy\web\assets\diagnostics\DiagnosticsAsset;

use Craft;
use craft\helpers\Json;
use craft\helpers\UrlHelper;

use yii\web\BadRequestHttpException;

/** Browser observations are untrusted input, separate from server checks. */
final class BrowserDiagnostics
{
    // Static Methods
    // =========================================================================

    public static function ownerKey(): string
    {
        return hash_hmac('sha256', Craft::$app->getUser()->getId() . ':' . Craft::$app->get('session')->getId(), Craft::$app->getConfig()->getGeneral()->securityKey);
    }

    public static function registerAssets(): void
    {
        $request = Craft::$app->getRequest();

        if ($request->getIsConsoleRequest() || !$request->getIsCpRequest()) {
            return;
        }

        $admin = Craft::$app->getUser()->getIdentity()?->admin ?? false;
        $bundle = Craft::$app->getView()->registerAssetBundle(DiagnosticsAsset::class);
        $bundle->jsOptions['data-vizy-diagnostics'] = Json::encode([
            // A new login/user invalidates the previous tab's capture. Never expose
            // the session ID itself. Anonymous CP pages only clear stale state.
            'owner' => $admin ? self::ownerKey() : null,
            'now' => time() * 1000,
            'returnUrl' => UrlHelper::cpUrl('vizy/diagnostics'),
            'labels' => [
                'active' => Craft::t('vizy', 'Vizy browser capture is active in this tab.'),
                'stopped' => Craft::t('vizy', 'Browser capture stopped. Preview the report to review the results.'),
                'empty' => Craft::t('vizy', 'No browser capture in this tab.'),
                'unavailable' => Craft::t('vizy', 'Browser storage is unavailable. Allow session storage to capture diagnostics.'),
                'return' => Craft::t('vizy', 'Stop and return to diagnostics'),
                'discard' => Craft::t('vizy', 'Discard capture'),
            ],
        ]);
    }

    public static function readReport(mixed $raw, bool $includeContent): ?array
    {
        if ($raw === null || $raw === '') {
            return null;
        }

        if (!is_string($raw) || strlen($raw) > 524288) {
            throw new BadRequestHttpException('Invalid browser capture. Discard it and try again.');
        }

        try {
            $capture = Json::decode($raw);
        } catch (\Throwable) {
            throw new BadRequestHttpException('Invalid browser capture. Discard it and try again.');
        }

        $now = time() * 1000;

        if (!is_array($capture) || ($capture['owner'] ?? null) !== self::ownerKey()
            || !is_int($capture['startedAt'] ?? null) || $capture['startedAt'] > $now + 60000
            || $capture['startedAt'] < $now - 3600000 || ($capture['status'] ?? null) !== 'stopped'
            || !is_array($capture['events'] ?? null) || count($capture['events']) > 100
        ) {
            throw new BadRequestHttpException('This browser capture is invalid or expired. Start a new capture.');
        }

        $events = [];
        $details = $includeContent && ($capture['includeDetails'] ?? false) === true;

        foreach ($capture['events'] as $event) {
            if (!is_array($event) || !in_array($event['kind'] ?? null, ['page', 'error', 'rejection', 'console-error', 'console-warn', 'resource-error', 'request-failure'], true)) {
                continue;
            }

            $clean = ['kind' => $event['kind']];

            foreach (['elapsedMs' => 900000, 'line' => 10000000, 'column' => 10000000, 'status' => 599] as $key => $max) {
                if (is_int($event[$key] ?? null)) {
                    $clean[$key] = max(0, min($max, $event[$key]));
                }
            }

            foreach ([
                'errorType' => ['Error', 'TypeError', 'RangeError', 'ReferenceError', 'SyntaxError', 'URIError', 'EvalError', 'AggregateError', 'Other'],
                'asset' => ['vizy', 'craft', 'external', 'inline', 'other'],
                'transport' => ['fetch', 'xhr'],
                'resource' => ['SCRIPT', 'LINK', 'IMG', 'OTHER'],
            ] as $key => $allowed) {
                if (in_array($event[$key] ?? null, $allowed, true)) {
                    $clean[$key] = $event[$key];
                }
            }

            // Never echo arbitrary client keys, request URLs, headers, bodies or
            // console objects. Free text requires consent both at capture and export.
            if ($details) {
                foreach (['message' => 1000, 'stack' => 3000] as $key => $max) {
                    if (is_string($event[$key] ?? null)) {
                        $clean[$key] = mb_substr($event[$key], 0, $max);
                    }
                }
            }

            $events[] = $clean;
        }

        $environment = [];

        if (is_array($capture['environment'] ?? null)) {
            foreach (['majorVersion' => 10000, 'width' => 20000, 'height' => 20000] as $key => $max) {
                if (is_int($capture['environment'][$key] ?? null)) {
                    $environment[$key] = max(0, min($max, $capture['environment'][$key]));
                }
            }

            if (in_array($capture['environment']['browser'] ?? null, ['edge', 'firefox', 'chrome', 'safari', 'other'], true)) {
                $environment['browser'] = $capture['environment']['browser'];
            }
        }

        return [
            'captured' => true,
            'source' => 'browser-observations',
            'startedAt' => gmdate('c', (int)($capture['startedAt'] / 1000)),
            'includesDetails' => $details,
            'detailsRecorded' => ($capture['includeDetails'] ?? false) === true,
            'environment' => $environment,
            'droppedEvents' => max(0, min(1000000, (int)($capture['dropped'] ?? 0))),
            'events' => $events,
        ];
    }
}
