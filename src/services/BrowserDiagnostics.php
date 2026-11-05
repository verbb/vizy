<?php
namespace verbb\vizy\services;

use verbb\vizy\web\assets\diagnostics\DiagnosticsAsset;

use Craft;
use craft\helpers\Json;
use craft\helpers\UrlHelper;

use yii\web\BadRequestHttpException;

use Throwable;

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

        $allowed = Craft::$app->getUser()->checkPermission(self::PERMISSION);
        $bundle = Craft::$app->getView()->registerAssetBundle(DiagnosticsAsset::class);
        $bundle->jsOptions['data-vizy-diagnostics'] = Json::encode([
            // A new login/user invalidates the previous tab's capture. Never expose
            // the session ID itself. Other CP pages only clear stale state.
            'owner' => $allowed ? self::ownerKey() : null,
            'now' => time() * 1000,
            'supportUrl' => self::supportUrl(),
            'labels' => [
                'title' => Craft::t('vizy', 'Vizy Support is checking for errors'),
                'goToPage' => Craft::t('vizy', 'Go to the page with the problem.'),
                'makeItHappen' => Craft::t('vizy', 'Make the problem happen, then press Done.'),
                'caught' => Craft::t('vizy', 'Noticed {count} so far. Press Done when you’ve seen enough.'),
                'saving' => Craft::t('vizy', 'Saving your latest changes…'),
                'saveFailed' => Craft::t('vizy', 'We couldn’t save your latest changes. Press Done again to continue anyway.'),
                'ready' => Craft::t('vizy', 'The check has finished, and your report is ready to review.'),
                'done' => Craft::t('vizy', 'Done'),
                'cancel' => Craft::t('vizy', 'Cancel'),
                'review' => Craft::t('vizy', 'Review report'),
                'copied' => Craft::t('vizy', 'Copied. Now paste it into your reply to support.'),
                'copyFailed' => Craft::t('vizy', 'Your browser blocked copying. Download the file instead.'),
                'failed' => Craft::t('vizy', 'The report could not be created. Tell support this happened, along with your Craft and Vizy versions.'),
            ],
        ]);
    }

    /** Utilities can be disabled by config, so fall back to the direct route. */
    public static function supportUrl(): string
    {
        return UrlHelper::cpUrl(in_array('vizy-support', Craft::$app->getConfig()->getGeneral()->disabledUtilities, true) ? 'vizy/support' : 'utilities/vizy-support');
    }

    /**
     * Validates a finished capture. Messages are held in the tab from the start of
     * a check, so this is the only point deciding whether they reach a report.
     */
    public static function readCapture(mixed $raw, bool $includeContent): ?array
    {
        if ($raw === null || $raw === '') {
            return null;
        }

        if (!is_string($raw) || strlen($raw) > 524288) {
            throw new BadRequestHttpException('Invalid browser capture. Start again.');
        }

        try {
            $capture = Json::decode($raw);
        } catch (Throwable) {
            throw new BadRequestHttpException('Invalid browser capture. Start again.');
        }

        $now = time() * 1000;

        if (!is_array($capture) || ($capture['owner'] ?? null) !== self::ownerKey()
            || !is_int($capture['startedAt'] ?? null) || $capture['startedAt'] > $now + 60000
            || $capture['startedAt'] < $now - 3600000 || ($capture['status'] ?? null) !== 'stopped'
            || !is_array($capture['events'] ?? null) || count($capture['events']) > 100
        ) {
            throw new BadRequestHttpException('This check is invalid or expired. Start again.');
        }

        $events = [];

        foreach ($capture['events'] as $event) {
            if (!is_array($event) || !in_array($event['kind'] ?? null, ['page', 'error', 'rejection', 'console-error', 'console-warn', 'resource-error', 'request-failure'], true)) {
                continue;
            }

            $clean = ['kind' => $event['kind']];

            foreach (['elapsedMs' => 900000, 'line' => 10000000, 'column' => 10000000, 'status' => 599, 'elementId' => 2147483647] as $key => $max) {
                if (is_int($event[$key] ?? null)) {
                    $clean[$key] = max(0, min($max, $event[$key]));
                }
            }

            foreach ([
                'errorType' => ['Error', 'TypeError', 'RangeError', 'ReferenceError', 'SyntaxError', 'URIError', 'EvalError', 'AggregateError', 'Other'],
                'asset' => ['vizy', 'craft', 'external', 'inline', 'other'],
                'source' => ['vizy', 'craft', 'other'],
                'transport' => ['fetch', 'xhr'],
                'resource' => ['SCRIPT', 'LINK', 'IMG', 'OTHER'],
            ] as $key => $allowed) {
                if (in_array($event[$key] ?? null, $allowed, true)) {
                    $clean[$key] = $event[$key];
                }
            }

            // Never echo arbitrary client keys, request URLs, headers, bodies or
            // console objects. Free text requires the customer's choice at review.
            if ($includeContent) {
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
            'context' => self::_context($capture['context'] ?? null),
            'report' => [
                'captured' => true,
                'source' => 'browser-observations',
                'startedAt' => gmdate('c', (int)($capture['startedAt'] / 1000)),
                'includesDetails' => $includeContent,
                'environment' => $environment,
                'droppedEvents' => max(0, min(1000000, (int)($capture['dropped'] ?? 0))),
                'events' => $events,
            ],
        ];
    }

    /** Whether the capture holds events that can carry a message, included or not. */
    public static function canHaveDetails(?array $report): bool
    {
        foreach ($report['events'] ?? [] as $event) {
            if (in_array($event['kind'], ['error', 'rejection', 'console-error', 'console-warn'], true)) {
                return true;
            }
        }

        return false;
    }

    /** Whether free text from the browser is actually in the report. */
    public static function hasDetails(?array $report): bool
    {
        foreach ($report['events'] ?? [] as $event) {
            if (isset($event['message']) || isset($event['stack'])) {
                return true;
            }
        }

        return false;
    }

    /** Removes free text from an already validated capture. */
    public static function withoutDetails(array $report): array
    {
        $report['includesDetails'] = false;
        $report['events'] = array_map(static function(array $event): array {
            unset($event['message'], $event['stack']);

            return $event;
        }, $report['events']);

        return $report;
    }


    // Constants
    // =========================================================================

    public const PERMISSION = 'utility:vizy-support';


    // Private Methods
    // =========================================================================

    /** Page details are hints from the browser. The controller still checks access. */
    private static function _context(mixed $context): ?array
    {
        if (!is_array($context) || !is_int($context['id'] ?? null) || !is_int($context['siteId'] ?? null) || $context['id'] <= 0 || $context['siteId'] <= 0) {
            return null;
        }

        $trail = $context['trail'] ?? null;
        $uid = '[0-9a-fA-F-]{36}';
        $valid = is_string($trail) && strlen($trail) <= 1000
            && preg_match("#^(field:$uid|block:$uid|row:\d+)(/(field:$uid|block:$uid|row:\d+))*$#D", $trail);

        return ['id' => $context['id'], 'siteId' => $context['siteId'], 'trail' => $valid ? $trail : null];
    }
}
