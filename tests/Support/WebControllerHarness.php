<?php

declare(strict_types=1);

namespace Tests\Support;

use Craft;
use craft\helpers\Json;
use craft\helpers\StringHelper;
use craft\web\Request as WebRequest;
use craft\web\Response as WebResponse;
use craft\web\Session as WebSession;
use RuntimeException;
use Tests\Support\Fixtures\AssetSpikeFixture;
use verbb\vizy\controllers\FieldLayoutController;
use verbb\vizy\controllers\FinalizationController;
use verbb\vizy\Vizy;
use yii\web\Response;

/**
 * Temporarily swaps Craft's console request/response/user for web controller proofs.
 *
 * The Pest harness boots Craft as a console application. These gates need real
 * craft\web\Controller POST/JSON behaviour without inventing a full CP browser.
 * FieldLayout HTML also calls web-only User APIs such as getRemainingSessionTime().
 */
final class WebControllerHarness
{
    private static ?object $previousRequest = null;
    private static ?object $previousResponse = null;
    private static ?object $previousUser = null;
    private static ?object $previousSession = null;
    private static ?string $previousRoute = null;
    /** @var array<string,mixed>|null */
    private static ?array $previousServer = null;
    private static bool $active = false;

    public static function beginWebRequest(array $bodyParams = [], string $route = 'elements/save', bool $ensureAdmin = true): void
    {
        if (self::$active) {
            throw new RuntimeException('WebControllerHarness is already active.');
        }

        if ($ensureAdmin) {
            AssetSpikeFixture::ensureAdminUser();
        }

        // Snapshot $_SERVER so console Pest state is restored after the proof.
        // Leaving REQUEST_* polluted makes later Craft Element/Asset paths behave
        // like a web request while the app request object is still console.
        self::$previousServer = $_SERVER;
        $_SERVER['SCRIPT_FILENAME'] = '/index.php';
        $_SERVER['SCRIPT_NAME'] = '/index.php';
        $_SERVER['REQUEST_URI'] = '/actions/' . $route;
        $_SERVER['HTTP_HOST'] = 'vizy.test';
        $_SERVER['SERVER_NAME'] = 'vizy.test';
        $_SERVER['REQUEST_METHOD'] = 'POST';
        unset($_SERVER['HTTP_X_CRAFT_LIVE_PREVIEW'], $_SERVER['HTTP_X_CRAFT_TOKEN']);

        self::$previousRequest = Craft::$app->getRequest();
        self::$previousResponse = Craft::$app->getResponse();
        self::$previousUser = Craft::$app->getUser();
        try {
            self::$previousSession = Craft::$app->getSession();
        } catch (\Throwable) {
            self::$previousSession = null;
        }
        self::$previousRoute = Craft::$app->requestedRoute;
        $identity = self::$previousUser->getIdentity();

        /** @var WebRequest $request */
        $request = Craft::createObject([
            'class' => WebRequest::class,
            'cookieValidationKey' => 'vizy-integration-proof-key',
            'enableCookieValidation' => false,
            'enableCsrfValidation' => false,
            'parsers' => [
                'application/json' => \yii\web\JsonParser::class,
            ],
        ]);
        $request->setIsConsoleRequest(false);
        $request->headers->set('Accept', 'application/json');
        $request->headers->set('Content-Type', 'application/json');
        // Controllers that need to tell an empty JSON object from an empty array
        // read the raw body, because Yii's parser decodes both to []. Set it
        // alongside the parsed params so the harness exercises the same input a
        // browser actually sends rather than only the post-parse view.
        $request->setRawBody(Json::encode($bodyParams));
        $request->setBodyParams($bodyParams);

        // Keep console User semantics (getId/setIdentity) but satisfy web-only
        // FieldLayout form calls such as getRemainingSessionTime().
        $user = new WebCapableConsoleUser();
        if ($identity) {
            $user->setIdentity($identity);
        }

        Craft::$app->set('request', $request);
        Craft::$app->set('response', Craft::createObject(['class' => WebResponse::class]));
        Craft::$app->set('user', $user);
        Craft::$app->set('session', Craft::createObject(['class' => WebSession::class]));
        Craft::$app->requestedRoute = $route;
        self::$active = true;
    }

    public static function endWebRequest(): void
    {
        if (!self::$active) {
            return;
        }

        if (self::$previousRequest) {
            Craft::$app->set('request', self::$previousRequest);
        }
        if (self::$previousResponse) {
            Craft::$app->set('response', self::$previousResponse);
        }
        if (self::$previousUser) {
            Craft::$app->set('user', self::$previousUser);
        }
        if (self::$previousSession) {
            Craft::$app->set('session', self::$previousSession);
        }
        Craft::$app->requestedRoute = self::$previousRoute;
        if (self::$previousServer !== null) {
            $_SERVER = self::$previousServer;
        }
        self::$previousRequest = null;
        self::$previousResponse = null;
        self::$previousUser = null;
        self::$previousSession = null;
        self::$previousRoute = null;
        self::$previousServer = null;
        self::$active = false;
    }

    /** @param array<string,mixed> $bodyParams */
    public static function withWebRequest(array $bodyParams, string $route, callable $callback, bool $ensureAdmin = true): mixed
    {
        self::beginWebRequest($bodyParams, $route, $ensureAdmin);
        try {
            return $callback();
        } finally {
            self::endWebRequest();
        }
    }

    /** @param array<string,mixed> $body */
    public static function renderFieldLayout(array $body, bool $ensureAdmin = true): Response
    {
        return self::withWebRequest($body, 'vizy/field-layout/render', static function() use ($body): Response {
            $controller = new FieldLayoutController('field-layout', Vizy::$plugin);
            $controller->enableCsrfValidation = false;
            $controller->request = Craft::$app->getRequest();
            $controller->response = Craft::$app->getResponse();
            /** @var Response $response */
            $response = $controller->runAction('render');
            return $response;
        }, $ensureAdmin);
    }

    /** @param array<string,mixed> $body */
    public static function renderFieldLayoutBatch(array $body, bool $ensureAdmin = true): Response
    {
        return self::withWebRequest($body, 'vizy/field-layout/render-batch', static function(): Response {
            $controller = new FieldLayoutController('field-layout', Vizy::$plugin);
            $controller->enableCsrfValidation = false;
            $controller->request = Craft::$app->getRequest();
            $controller->response = Craft::$app->getResponse();
            /** @var Response $response */
            $response = $controller->runAction('render-batch');
            return $response;
        }, $ensureAdmin);
    }

    /** @param array<string,mixed> $body */
    public static function retryFinalization(array $body): Response
    {
        return self::withWebRequest($body, 'vizy/finalization/retry', static function() use ($body): Response {
            $controller = new FinalizationController('finalization', Vizy::$plugin);
            $controller->enableCsrfValidation = false;
            $controller->request = Craft::$app->getRequest();
            $controller->response = Craft::$app->getResponse();
            /** @var Response $response */
            $response = $controller->runAction('retry');
            return $response;
        });
    }

    /** @param array<string,mixed> $block */
    public static function stableBlockHash(array $block): string
    {
        return Vizy::$plugin->getFieldLayoutForms()->blockHash($block);
    }

    public static function transportMetadata(
        string $editorId,
        string $fieldUid,
        string $token,
        int $generation,
        int $clientRevision,
        string $requestKind = 'save',
    ): array {
        return [
            $editorId => [
                'editorId' => $editorId,
                'fieldUid' => $fieldUid,
                'editorContextToken' => $token,
                'generation' => $generation,
                'clientRevision' => $clientRevision,
                'requestKind' => $requestKind,
            ],
        ];
    }
}
