<?php

use craft\db\Query;
use craft\elements\User;
use craft\helpers\Json;
use craft\helpers\StringHelper;
use Tests\Support\Fixtures\AssetSpikeFixture;
use Tests\Support\Fixtures\VizyFixtureFactory;
use Tests\Support\WebControllerHarness;
use verbb\vizy\controllers\DiagnosticsController;
use verbb\vizy\services\BrowserDiagnostics;
use verbb\vizy\services\Diagnostics;
use verbb\vizy\services\EditorManifests;
use verbb\vizy\utilities\SupportUtility;
use verbb\vizy\Vizy;
use yii\base\Event;
use yii\web\BadRequestHttpException;
use yii\web\ForbiddenHttpException;

function diagnosticsFixture(): array
{
    AssetSpikeFixture::ensureAdminUser();
    $entry = VizyFixtureFactory::entry('Diagnostics private entry title');
    $field = VizyFixtureFactory::vizyField();
    $placement = $entry->getFieldLayout()->getCustomFieldElements()[0]->uid;
    $raw = Json::encode([
        'type' => 'doc', 'attrs' => ['schemaVersion' => 2],
        'content' => [['type' => 'paragraph', 'content' => [[
            'type' => 'text', 'text' => 'PRIVATE-AUTHORED-TEXT',
            'marks' => [
                ['type' => 'textStyle', 'attrs' => ['color' => '#123456']],
                ['type' => 'customerMark', 'attrs' => ['url' => 'https://private.example/token', 'value' => 'PRIVATE-ATTRIBUTE']],
            ],
        ]]]],
    ]);
    Craft::$app->getDb()->createCommand()->update('{{%elements_sites}}', ['content' => new \yii\db\JsonExpression([
        $placement => $raw,
        'unrelated-field' => 'PRIVATE-UNRELATED-FIELD',
    ])], ['elementId' => $entry->id, 'siteId' => $entry->siteId])->execute();
    return compact('entry', 'field', 'placement', 'raw');
}

function diagnosticsRequest(string $action, array $body, ?callable $prepare = null): mixed
{
    return WebControllerHarness::withWebRequest($body, 'vizy/diagnostics/' . $action, function() use ($action, $prepare) {
        $request = Craft::$app->getRequest();
        $request->setIsCpRequest(true);
        $request->getHeaders()->set('Accept', 'application/json');
        $prepare?->__invoke();
        $controller = new DiagnosticsController('diagnostics', Vizy::$plugin);
        $controller->enableCsrfValidation = false;
        $controller->request = $request;
        $controller->response = Craft::$app->getResponse();

        return $controller->runAction($action);
    });
}

function diagnosticsCapture(array $overrides = []): array
{
    return [
        'owner' => BrowserDiagnostics::ownerKey(),
        'startedAt' => time() * 1000,
        'status' => 'stopped',
        'events' => [],
        ...$overrides,
    ];
}

it('keeps content in its own section and identifies disabled and unknown marks without changing storage', function() {
    $f = diagnosticsFixture();
    $service = new Diagnostics();
    $before = (new Query())->select('content')->from('{{%elements_sites}}')->where(['elementId' => $f['entry']->id, 'siteId' => $f['entry']->siteId])->scalar();
    $configId = 'diagnostics-' . strtolower(StringHelper::randomString(8));
    $configs = Vizy::$plugin->getEditorConfigs();
    $configs->saveConfig($configId, [
        'label' => 'PRIVATE-CONFIG-LABEL',
        'capabilities' => ['nodes' => ['paragraph'], 'marks' => ['italic']],
        'toolbar' => ['italic'],
    ]);
    try {
        $documents = $service->collectDocuments($f['entry']);
        expect($documents)->toHaveCount(1);
        $key = array_key_first($documents);
        $documents[$key]['field'] = clone $documents[$key]['field'];
        $documents[$key]['field']->editorConfig = $configId;
        $report = $service->createReport($documents);
        $json = $service->encodeReport($report);
        foreach (['PRIVATE-', 'private.example', 'Diagnostics private entry title', '#123456'] as $private) {
            expect($json)->not->toContain($private);
        }
        $marks = array_column($report['fields'][0]['stored']['types'], null, 'type');
        expect($report['includesContent'])->toBeFalse()
            ->and($report)->not->toHaveKey('content')
            ->and($marks['textStyle']['registered'])->toBeTrue()
            ->and($marks['textStyle']['enabled'])->toBeFalse()
            ->and($marks['customerMark']['registered'])->toBeFalse()
            ->and($report['browser']['captured'])->toBeFalse();

        $findings = array_column($service->review($report, $documents)['findings'], 'title');
        expect(implode(' ', $findings))->toContain('turned off', 'recognize');

        $included = $service->createReport($documents, null, true, true);
        expect($included['includesContent'])->toBeTrue()
            ->and($included['content'][0]['storedValue'])->toBe($f['raw'])
            ->and($included['content'][0]['normalizedDocument']['content'][0]['content'][0]['text'])->toBe('PRIVATE-AUTHORED-TEXT')
            ->and($included['content'][0]['editorConfig']['label'])->toBe('PRIVATE-CONFIG-LABEL')
            ->and($service->encodeReport($included))->not->toContain('PRIVATE-UNRELATED-FIELD');

        // Editor Config pages are admin-only, so permitted editors don't get the full config.
        $withoutConfig = $service->createReport($documents, null, true, false);
        expect($withoutConfig['content'][0])->not->toHaveKey('editorConfig')
            ->and($service->encodeReport($withoutConfig))->not->toContain('PRIVATE-CONFIG-LABEL');
        expect((new Query())->select('content')->from('{{%elements_sites}}')->where(['elementId' => $f['entry']->id, 'siteId' => $f['entry']->siteId])->scalar())->toBe($before);
    } finally {
        $configs->removeConfig($configId);
    }
});

it('does not flag retired Content Areas, which are dropped when a document loads', function() {
    $service = new Diagnostics();
    $report = $service->createReport([]);
    $report['fields'] = [['path' => 'p', 'fieldHandle' => 'body', 'stored' => ['types' => [
        ['kind' => 'node', 'type' => 'vizySlot', 'count' => 2, 'registered' => false, 'enabled' => false],
    ]]]];
    expect(implode(' ', array_column($service->review($report, [])['findings'], 'title')))->not->toContain('recognize', 'turned off');
});

it('captures effective runtime capabilities but excludes sensitive exception messages', function() {
    $f = diagnosticsFixture();
    $service = new Diagnostics();
    $documents = $service->collectDocuments($f['entry']);
    $handler = function($event) {
        $event->config['capabilities']['marks'][] = 'textStyle';
    };
    Event::on(EditorManifests::class, EditorManifests::EVENT_MODIFY_EDITOR_CONFIG, $handler);
    try {
        $report = $service->createReport($documents);
        expect($report['fields'][0]['editorConfig']['effective']['marks'])->toContain('textStyle');
    } finally {
        Event::off(EditorManifests::class, EditorManifests::EVENT_MODIFY_EDITOR_CONFIG, $handler);
    }
    $fail = fn() => throw new RuntimeException('PRIVATE-EXCEPTION https://secret.example/credential');
    Event::on(EditorManifests::class, EditorManifests::EVENT_MODIFY_EDITOR_CONFIG, $fail);
    try {
        $report = $service->createReport($documents);
        expect(array_column($report['errors'], 'code'))->toContain('editorManifestUnavailable')
            ->and($service->encodeReport($report))->not->toContain('PRIVATE-EXCEPTION', 'secret.example');
    } finally {
        Event::off(EditorManifests::class, EditorManifests::EVENT_MODIFY_EDITOR_CONFIG, $fail);
        Vizy::$plugin->getEditorManifests()->invalidate();
    }
});

it('retains malformed stored values only with content included and bounds report size', function() {
    $f = diagnosticsFixture();
    $service = new Diagnostics();
    $documents = $service->collectDocuments($f['entry']);
    $key = array_key_first($documents);
    $documents[$key]['raw'] = '{PRIVATE-BROKEN-JSON';
    $report = $service->createReport($documents);
    expect(array_column($report['errors'], 'code'))->toContain('storedDocumentUnreadable', 'documentNormalizationFailed')
        ->and($service->encodeReport($report))->not->toContain('PRIVATE-BROKEN-JSON')
        ->and($service->createReport($documents, null, true)['content'][0]['storedValue'])->toBe('{PRIVATE-BROKEN-JSON');
    expect(fn() => $service->encodeReport(['content' => str_repeat('x', Diagnostics::MAX_REPORT_BYTES)]))
        ->toThrow(RuntimeException::class, 'too large');
});

it('requires the support permission for every action', function(string $action) {
    expect(fn() => diagnosticsRequest($action, [], function() {
        Craft::$app->getUser()->setIdentity(new User(['id' => 98765, 'admin' => false]));
    }))->toThrow(ForbiddenHttpException::class);
})->with(['index', 'review']);

it('rejects support requests outside the CP', function() {
    expect(fn() => diagnosticsRequest('review', [], fn() => Craft::$app->getRequest()->setIsCpRequest(false)))
        ->toThrow(BadRequestHttpException::class);
});

it('registers a selectable utility with its own permission', function() {
    AssetSpikeFixture::ensureAdminUser();
    expect(Craft::$app->getUtilities()->getUtilityTypeById('vizy-support'))->toBe(SupportUtility::class)
        ->and(BrowserDiagnostics::PERMISSION)->toBe('utility:' . SupportUtility::id());
});

it('works with admin changes disabled and ignores content options from the query string', function() {
    $f = diagnosticsFixture();
    $general = Craft::$app->getConfig()->getGeneral();
    $previous = $general->allowAdminChanges;
    $general->allowAdminChanges = false;
    try {
        $capture = Json::encode(diagnosticsCapture(['context' => ['id' => $f['entry']->id, 'siteId' => $f['entry']->siteId, 'trail' => null]]));
        $response = diagnosticsRequest('review', ['browserCapture' => $capture], function() {
            Craft::$app->getRequest()->setQueryParams(['includeContent' => '1']);
        });
        expect($response->data['html'])->not->toContain('PRIVATE-AUTHORED-TEXT')
            ->and($response->getHeaders()->get('Cache-Control'))->toContain('no-store');
    } finally {
        $general->allowAdminChanges = $previous;
    }
});

it('includes the focused field’s content when posted, and removes it when unticked', function() {
    $f = diagnosticsFixture();
    $documents = (new Diagnostics())->collectDocuments($f['entry']);
    $capture = Json::encode(diagnosticsCapture([
        'context' => ['id' => $f['entry']->id, 'siteId' => $f['entry']->siteId, 'trail' => reset($documents)['trail']],
        'events' => [['kind' => 'error', 'errorType' => 'TypeError', 'elapsedMs' => 38000, 'message' => 'PRIVATE-MESSAGE', 'stack' => 'PRIVATE-STACK']],
    ]));
    $included = diagnosticsRequest('review', ['browserCapture' => $capture, 'includeContent' => '1']);
    expect($included->data['html'])->toContain('PRIVATE-AUTHORED-TEXT', 'PRIVATE-MESSAGE', 'GitHub issues are public');

    $excluded = diagnosticsRequest('review', ['browserCapture' => $capture, 'includeContent' => '0']);
    expect($excluded->data['html'])->not->toContain('PRIVATE-', 'GitHub issues are public')
        ->and($excluded->data['html'])->toContain('TypeError');
});

it('only reads elements the user can view', function() {
    $f = diagnosticsFixture();
    $capture = Json::encode(diagnosticsCapture(['context' => ['id' => $f['entry']->id, 'siteId' => $f['entry']->siteId, 'trail' => null]]));
    $response = diagnosticsRequest('review', ['browserCapture' => $capture, 'includeContent' => '1'], function() {
        // Grants CP access and the utility only, with no access to the fixture's section.
        $user = new class(['id' => 98766, 'admin' => false]) extends User {
            public function can(string $permission): bool
            {
                return in_array($permission, ['accessCp', BrowserDiagnostics::PERMISSION], true);
            }
        };
        Craft::$app->getUser()->setIdentity($user);
        Craft::$app->getRequest()->setBodyParams(['browserCapture' => Json::encode(diagnosticsCapture([
            'context' => Json::decode(Craft::$app->getRequest()->getBodyParam('browserCapture'))['context'],
        ])), 'includeContent' => '1']);
    });
    expect($response->data['html'])->not->toContain('PRIVATE-AUTHORED-TEXT')
        ->and($response->data['html'])->toContain('couldn’t read that page');
});

it('honours authorization events, which only Craft’s service check applies', function() {
    $f = diagnosticsFixture();
    $deny = function(\craft\events\AuthorizationCheckEvent $event) {
        $event->authorized = false;
    };
    Event::on(\craft\services\Elements::class, \craft\services\Elements::EVENT_AUTHORIZE_VIEW, $deny);
    try {
        $capture = Json::encode(diagnosticsCapture(['context' => ['id' => $f['entry']->id, 'siteId' => $f['entry']->siteId, 'trail' => null]]));
        $response = diagnosticsRequest('review', ['browserCapture' => $capture, 'includeContent' => '1']);
        expect($response->data['html'])->not->toContain('PRIVATE-AUTHORED-TEXT')
            ->and($response->data['html'])->toContain('couldn’t read that page');
    } finally {
        Event::off(\craft\services\Elements::class, \craft\services\Elements::EVENT_AUTHORIZE_VIEW, $deny);
    }
});

it('refuses a site the user can’t edit', function() {
    $f = diagnosticsFixture();
    $capture = Json::encode(diagnosticsCapture(['context' => ['id' => $f['entry']->id, 'siteId' => 987654, 'trail' => null]]));
    $response = diagnosticsRequest('review', ['browserCapture' => $capture, 'includeContent' => '1']);
    expect($response->data['html'])->not->toContain('PRIVATE-AUTHORED-TEXT')
        ->and($response->data['html'])->toContain('couldn’t read that page');
});

it('hides fields from a non-admin when a condition hides them on the edit page', function() {
    $f = diagnosticsFixture();
    $placement = $f['entry']->getFieldLayout()->getCustomFieldElements()[0];
    $condition = new \craft\elements\conditions\users\UserCondition();
    $rule = new \craft\elements\conditions\users\AdminConditionRule();
    $rule->value = true;
    $condition->addConditionRule($rule);
    $placement->setUserCondition($condition);
    $admin = Craft::$app->getUser()->getIdentity();
    try {
        Craft::$app->getUser()->setIdentity(new User(['id' => 98767, 'admin' => false]));
        expect((new Diagnostics())->collectDocuments($f['entry']))->toHaveCount(0);
        Craft::$app->getUser()->setIdentity(AssetSpikeFixture::ensureAdminUser());
        expect((new Diagnostics())->collectDocuments($f['entry']))->toHaveCount(1);
    } finally {
        $placement->setUserCondition(null);
        Craft::$app->getUser()->setIdentity($admin);
    }
});

it('offers the choice and the warning for error messages when the page had no Vizy fields', function() {
    $capture = Json::encode(diagnosticsCapture(['events' => [['kind' => 'error', 'errorType' => 'TypeError', 'elapsedMs' => 1, 'message' => 'PRIVATE-MESSAGE', 'stack' => 'PRIVATE-STACK']]]));
    $included = diagnosticsRequest('review', ['browserCapture' => $capture, 'includeContent' => '1'])->data['html'];
    expect($included)->toContain('Include my content', 'PRIVATE-MESSAGE', 'PRIVATE-STACK', 'GitHub issues are public', '&quot;includesContent&quot;: true');
    $excluded = diagnosticsRequest('review', ['browserCapture' => $capture, 'includeContent' => '0'])->data['html'];
    expect($excluded)->toContain('Include my content', 'TypeError')
        ->not->toContain('PRIVATE-', 'GitHub issues are public');
});

it('keeps a partial report when a page goes over the field limit', function() {
    $f = diagnosticsFixture();
    $nested = new \verbb\vizy\fields\VizyField(['name' => 'Nested Body', 'handle' => 'nestedLimit' . StringHelper::randomString(6)]);
    expect(Craft::$app->getFields()->saveField($nested))->toBeTrue();
    $placement = new \craft\fieldlayoutelements\CustomField($nested);
    $placement->uid = StringHelper::UUID();
    $layout = new \craft\models\FieldLayout(['type' => \verbb\vizy\elements\Block::class]);
    $tab = new \craft\models\FieldLayoutTab(['layout' => $layout, 'name' => 'Content']);
    $tab->setElements([$placement]);
    $layout->setTabs([$tab]);
    $type = new \verbb\vizy\models\BlockType(['uid' => StringHelper::UUID(), 'name' => 'Limit card', 'handle' => 'limitCard' . StringHelper::randomString(6)]);
    $type->setFieldLayout($layout);
    expect(Vizy::$plugin->getBlockTypes()->saveBlockType($type))->toBeTrue();
    $content = array_map(fn() => ['type' => 'vizyBlock', 'attrs' => ['blockUid' => StringHelper::UUID(), 'blockTypeUid' => $type->uid, 'enabled' => true, 'fieldSlots' => [$placement->uid => Json::decode(VizyFixtureFactory::paragraphDocument('Nested'))]]], range(1, 105));
    Craft::$app->getDb()->createCommand()->update('{{%elements_sites}}', ['content' => [$f['placement'] => Json::encode(['type' => 'doc', 'attrs' => ['schemaVersion' => 2], 'content' => $content])]], ['elementId' => $f['entry']->id, 'siteId' => $f['entry']->siteId])->execute();
    $service = new Diagnostics();
    $documents = $service->collectDocuments($f['entry']);
    $report = $service->createReport($documents);
    expect($documents)->toHaveCount(100)
        ->and($report['fieldsTruncated'])->toBeTrue()
        ->and(implode(' ', array_column($service->review($report, $documents)['findings'], 'title')))->toContain('very large');
});

it('rejects forged page details rather than trusting the browser', function() {
    $f = diagnosticsFixture();
    $forged = ['id' => $f['entry']->id, 'siteId' => $f['entry']->siteId, 'trail' => '../../etc/passwd'];
    $capture = BrowserDiagnostics::readCapture(Json::encode(diagnosticsCapture(['context' => $forged])), false);
    expect($capture['context']['trail'])->toBeNull();
    expect(BrowserDiagnostics::readCapture(Json::encode(diagnosticsCapture(['context' => ['id' => 'x', 'siteId' => 1]])), false)['context'])->toBeNull();
});

it('reads an autosaved provisional draft when the page reports one', function() {
    $f = diagnosticsFixture();
    $draft = Craft::$app->getDrafts()->createDraft($f['entry'], $f['entry']->authorId ?? 1, provisional: true);
    Craft::$app->getDb()->createCommand()->update('{{%elements_sites}}', ['content' => new \yii\db\JsonExpression([
        $f['placement'] => VizyFixtureFactory::paragraphDocument('LATEST-AUTOSAVED-TEXT'),
    ])], ['elementId' => $draft->id, 'siteId' => $draft->siteId])->execute();
    $review = fn(int $id) => diagnosticsRequest('review', ['includeContent' => '1', 'browserCapture' => Json::encode(diagnosticsCapture([
        'context' => ['id' => $id, 'siteId' => $f['entry']->siteId, 'trail' => 'field:' . $f['placement']],
    ]))])->data['html'];
    expect($review($draft->id))->toContain('LATEST-AUTOSAVED-TEXT')
        ->and($review($f['entry']->id))->not->toContain('LATEST-AUTOSAVED-TEXT');
});

it('lists repeated hosted fields separately and exports only the focused nested value', function() {
    $f = diagnosticsFixture();
    $nested = new \verbb\vizy\fields\VizyField(['name' => 'Nested Body', 'handle' => 'nestedDiagnostics' . StringHelper::randomString(6)]);
    expect(Craft::$app->getFields()->saveField($nested))->toBeTrue();
    $placement = new \craft\fieldlayoutelements\CustomField($nested);
    $placement->uid = StringHelper::UUID();
    $layout = new \craft\models\FieldLayout(['type' => \verbb\vizy\elements\Block::class]);
    $tab = new \craft\models\FieldLayoutTab(['layout' => $layout, 'name' => 'Content']);
    $tab->setElements([$placement]);
    $layout->setTabs([$tab]);
    $type = new \verbb\vizy\models\BlockType(['uid' => StringHelper::UUID(), 'name' => 'Diagnostics card', 'handle' => 'diagnosticsCard' . StringHelper::randomString(6)]);
    $type->setFieldLayout($layout);
    expect(Vizy::$plugin->getBlockTypes()->saveBlockType($type))->toBeTrue();
    $content = [];
    $blockUids = [];
    foreach (['Nested one', 'Nested two'] as $text) {
        $blockUids[] = $blockUid = StringHelper::UUID();
        $content[] = ['type' => 'vizyBlock', 'attrs' => [
            'blockUid' => $blockUid, 'blockTypeUid' => $type->uid, 'enabled' => true,
            'fieldSlots' => [$placement->uid => Json::decode(VizyFixtureFactory::paragraphDocument($text))],
        ]];
    }
    $raw = ['type' => 'doc', 'attrs' => ['schemaVersion' => 2], 'content' => $content];
    Craft::$app->getDb()->createCommand()->update('{{%elements_sites}}', ['content' => [$f['placement'] => Json::encode($raw)]], ['elementId' => $f['entry']->id, 'siteId' => $f['entry']->siteId])->execute();
    $service = new Diagnostics();
    $documents = $service->collectDocuments($f['entry']);
    expect($documents)->toHaveCount(3);
    $trail = "field:{$f['placement']}/block:{$blockUids[1]}/field:{$placement->uid}";
    $target = $service->findTarget($documents, $trail);
    expect($target)->not->toBeNull();
    $report = $service->createReport($documents, $target, true);
    $contentJson = Json::encode($report['content']);
    expect($report['fields'])->toHaveCount(3)
        ->and($report['content'])->toHaveCount(1)
        ->and($contentJson)->toContain('Nested two')
        ->and($contentJson)->not->toContain('Nested one');
    expect($service->findTarget($documents, 'field:' . $placement->uid))->toBeNull();
});

it('reviews browser-only reports and strips arbitrary data and unincluded details', function() {
    $capture = diagnosticsCapture([
        'dropped' => 2,
        'events' => [[
            'kind' => 'error', 'errorType' => 'TypeError', 'elapsedMs' => 10,
            'message' => 'PRIVATE-BROWSER-MESSAGE', 'stack' => 'PRIVATE-STACK',
            'url' => 'https://private.example?token=secret', 'headers' => ['Authorization' => 'secret'],
        ], ['kind' => 'PRIVATE-UNEXPECTED-KIND']],
        'cookies' => 'PRIVATE-COOKIE',
    ]);
    $response = diagnosticsRequest('review', ['browserCapture' => Json::encode($capture)]);
    expect($response->data['html'])->toContain('TypeError')
        ->not->toContain('PRIVATE-', 'private.example', 'Authorization', 'secret');
    $report = BrowserDiagnostics::readCapture(Json::encode($capture), false);
    expect($report['report']['captured'])->toBeTrue()
        ->and($report['report']['events'])->toHaveCount(1)
        ->and($report['context'])->toBeNull();
});

it('only includes held error messages when the customer includes content', function(bool $included) {
    diagnosticsRequest('index', [], function() use ($included) {
        $raw = Json::encode(diagnosticsCapture([
            'events' => [['kind' => 'console-error', 'message' => 'PRIVATE-MESSAGE', 'stack' => 'PRIVATE-STACK', 'body' => 'PRIVATE-BODY']],
        ]));
        $report = BrowserDiagnostics::readCapture($raw, $included)['report'];
        expect($report['includesDetails'])->toBe($included)
            ->and(isset($report['events'][0]['message']))->toBe($included)
            ->and(Json::encode($report))->not->toContain('PRIVATE-BODY')
            ->and(Json::encode(BrowserDiagnostics::withoutDetails($report)))->not->toContain('PRIVATE-');
    });
})->with([false, true]);

it('rejects expired, other-login, active, oversized and malformed browser captures', function(string $case) {
    expect(fn() => diagnosticsRequest('review', [], function() use ($case) {
        $capture = diagnosticsCapture();
        if ($case === 'expired') $capture['startedAt'] -= 3601000;
        if ($case === 'other-login') $capture['owner'] = 'another-login';
        if ($case === 'active') $capture['status'] = 'recording';
        if ($case === 'too-many') $capture['events'] = array_fill(0, 101, ['kind' => 'page']);
        $raw = match ($case) {
            'oversized' => str_repeat('x', 524289),
            'malformed' => '{not json',
            default => Json::encode($capture),
        };
        Craft::$app->getRequest()->setBodyParams(['browserCapture' => $raw]);
    }))->toThrow(BadRequestHttpException::class);
})->with(['expired', 'other-login', 'active', 'too-many', 'oversized', 'malformed']);
