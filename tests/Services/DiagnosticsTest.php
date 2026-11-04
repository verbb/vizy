<?php

use craft\db\Query;
use craft\elements\User;
use craft\helpers\Json;
use craft\helpers\StringHelper;
use Tests\Support\Fixtures\AssetSpikeFixture;
use Tests\Support\Fixtures\VizyFixtureFactory;
use Tests\Support\WebControllerHarness;
use verbb\vizy\controllers\DiagnosticsController;
use verbb\vizy\services\Diagnostics;
use verbb\vizy\services\EditorManifests;
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
        Craft::$app->getRequest()->setIsCpRequest(true);
        $prepare?->__invoke();
        $controller = new DiagnosticsController('diagnostics', Vizy::$plugin);
        $controller->enableCsrfValidation = false;
        $controller->request = Craft::$app->getRequest();
        $controller->response = Craft::$app->getResponse();
        $bufferLevel = ob_get_level();
        try {
            return $controller->runAction($action);
        } finally {
            // Craft clears an output buffer for downloads, including PHPUnit's.
            // Restore the harness depth after exercising the real response method.
            while (ob_get_level() < $bufferLevel) ob_start();
        }
    });
}

it('excludes authored content by default and identifies disabled and unknown marks without changing storage', function() {
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
        $selected = reset($documents);
        $selected['field'] = clone $selected['field'];
        $selected['field']->editorConfig = $configId;
        $report = $service->createReport($selected);
        $json = $service->encodeReport($report);
        foreach (['PRIVATE-', 'private.example', 'Diagnostics private entry title', '#123456'] as $private) {
            expect($json)->not->toContain($private);
        }
        $marks = array_column($report['stored']['types'], null, 'type');
        expect($report['includesContent'])->toBeFalse()
            ->and($report)->not->toHaveKey('content')
            ->and($marks['textStyle']['registered'])->toBeTrue()
            ->and($marks['textStyle']['enabled'])->toBeFalse()
            ->and($marks['customerMark']['registered'])->toBeFalse()
            ->and($report['browser']['captured'])->toBeFalse();

        $included = $service->createReport($selected, true);
        expect($included['content']['storedValue'])->toBe($f['raw'])
            ->and($included['content']['normalizedDocument']['content'][0]['content'][0]['text'])->toBe('PRIVATE-AUTHORED-TEXT')
            ->and($included['content']['editorConfig']['label'])->toBe('PRIVATE-CONFIG-LABEL')
            ->and($service->encodeReport($included))->not->toContain('PRIVATE-UNRELATED-FIELD');
        expect((new Query())->select('content')->from('{{%elements_sites}}')->where(['elementId' => $f['entry']->id, 'siteId' => $f['entry']->siteId])->scalar())->toBe($before);
    } finally {
        $configs->removeConfig($configId);
    }
});

it('captures effective runtime capabilities but excludes sensitive exception messages', function() {
    $f = diagnosticsFixture();
    $service = new Diagnostics();
    $documents = $service->collectDocuments($f['entry']);
    $selected = reset($documents);
    $handler = function($event) {
        $event->config['capabilities']['marks'][] = 'textStyle';
    };
    Event::on(EditorManifests::class, EditorManifests::EVENT_MODIFY_EDITOR_CONFIG, $handler);
    try {
        $report = $service->createReport($selected);
        expect($report['editorConfig']['effective']['marks'])->toContain('textStyle');
    } finally {
        Event::off(EditorManifests::class, EditorManifests::EVENT_MODIFY_EDITOR_CONFIG, $handler);
    }
    $fail = fn() => throw new RuntimeException('PRIVATE-EXCEPTION https://secret.example/credential');
    Event::on(EditorManifests::class, EditorManifests::EVENT_MODIFY_EDITOR_CONFIG, $fail);
    try {
        $report = $service->createReport($selected);
        expect(array_column($report['errors'], 'code'))->toContain('editorManifestUnavailable')
            ->and($service->encodeReport($report))->not->toContain('PRIVATE-EXCEPTION', 'secret.example');
    } finally {
        Event::off(EditorManifests::class, EditorManifests::EVENT_MODIFY_EDITOR_CONFIG, $fail);
        Vizy::$plugin->getEditorManifests()->invalidate();
    }
});

it('retains malformed stored values only with content consent and bounds report size', function() {
    $f = diagnosticsFixture();
    $service = new Diagnostics();
    $documents = $service->collectDocuments($f['entry']);
    $selected = reset($documents);
    $selected['raw'] = '{PRIVATE-BROKEN-JSON';
    $report = $service->createReport($selected);
    expect(array_column($report['errors'], 'code'))->toContain('storedDocumentUnreadable', 'documentNormalizationFailed')
        ->and($service->encodeReport($report))->not->toContain('PRIVATE-BROKEN-JSON')
        ->and($service->createReport($selected, true)['content']['storedValue'])->toBe('{PRIVATE-BROKEN-JSON');
    expect(fn() => $service->encodeReport(['content' => str_repeat('x', Diagnostics::MAX_REPORT_BYTES)]))
        ->toThrow(RuntimeException::class, 'too large');
});

it('requires admin access for every diagnostics action', function(string $action) {
    expect(fn() => diagnosticsRequest($action, [], function() {
        $user = new User(['id' => 98765, 'admin' => false]);
        Craft::$app->getUser()->setIdentity($user);
    }))->toThrow(ForbiddenHttpException::class);
})->with(['index', 'preview', 'download']);

it('rejects diagnostics outside the CP', function() {
    expect(fn() => diagnosticsRequest('download', [], fn() => Craft::$app->getRequest()->setIsCpRequest(false)))
        ->toThrow(BadRequestHttpException::class);
});

it('downloads only an intact unexpired preview belonging to the current administrator', function(string $case) {
    $admin = AssetSpikeFixture::ensureAdminUser();
    $json = '{"format":"vizy-diagnostics","includesContent":false}';
    $signed = base64_encode(Craft::$app->getSecurity()->hashData(Json::encode([
        'userId' => $case === 'other user' ? $admin->id + 1 : $admin->id,
        'expires' => time() + ($case === 'expired' ? -5 : 900),
        'json' => $json,
    ])));
    if ($case === 'tampered') $signed = substr($signed, 1);
    $run = fn() => diagnosticsRequest('download', ['report' => $signed]);
    if ($case !== 'valid') {
        expect($run)->toThrow(BadRequestHttpException::class);
        return;
    }
    $general = Craft::$app->getConfig()->getGeneral();
    $previous = $general->allowAdminChanges;
    $general->allowAdminChanges = false;
    try {
        $response = $run();
        expect($response->content)->toBe($json)
            ->and($response->getHeaders()->get('Cache-Control'))->toContain('no-store')
            ->and($response->getHeaders()->get('Content-Disposition'))->toContain('attachment', 'vizy-diagnostics.json');
    } finally {
        $general->allowAdminChanges = $previous;
    }
})->with(['valid', 'tampered', 'expired', 'other user']);

it('rejects a preview selection that does not belong to the requested entry', function() {
    $f = diagnosticsFixture();
    expect(fn() => diagnosticsRequest('preview', ['entryId' => $f['entry']->id, 'siteId' => $f['entry']->siteId, 'field' => 'forged']))
        ->toThrow(BadRequestHttpException::class);
});

it('previews without content unless explicitly posted and downloads that exact reviewed snapshot', function() {
    $f = diagnosticsFixture();
    $documents = (new Diagnostics())->collectDocuments($f['entry']);
    $body = ['entryId' => $f['entry']->id, 'siteId' => $f['entry']->siteId, 'field' => array_key_first($documents)];
    $response = diagnosticsRequest('preview', $body, function() {
        Craft::$app->getRequest()->setQueryParams(['includeContent' => '1']);
    });
    $variables = $response->getBehavior(\craft\web\TemplateResponseBehavior::NAME)->variables;
    expect($variables['includeContent'])->toBeFalse()
        ->and($variables['reportJson'])->not->toContain('PRIVATE-AUTHORED-TEXT');

    $included = diagnosticsRequest('preview', [...$body, 'includeContent' => '1']);
    $includedVariables = $included->getBehavior(\craft\web\TemplateResponseBehavior::NAME)->variables;
    expect($includedVariables['reportJson'])->toContain('PRIVATE-AUTHORED-TEXT');
    // Changing storage after preview must not change what gets downloaded.
    Craft::$app->getDb()->createCommand()->update('{{%elements_sites}}', ['content' => [$f['placement'] => VizyFixtureFactory::paragraphDocument('Changed after preview')]], ['elementId' => $f['entry']->id, 'siteId' => $f['entry']->siteId])->execute();
    $download = diagnosticsRequest('download', ['report' => $includedVariables['signedReport']]);
    expect($download->content)->toBe($includedVariables['reportJson']);
});

it('lists repeated hosted fields separately and exports only the selected nested value', function() {
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
    foreach (['Nested one', 'Nested two'] as $text) {
        $content[] = ['type' => 'vizyBlock', 'attrs' => [
            'blockUid' => StringHelper::UUID(), 'blockTypeUid' => $type->uid, 'enabled' => true,
            'fieldSlots' => [$placement->uid => Json::decode(VizyFixtureFactory::paragraphDocument($text))],
        ]];
    }
    $raw = ['type' => 'doc', 'attrs' => ['schemaVersion' => 2], 'content' => $content];
    Craft::$app->getDb()->createCommand()->update('{{%elements_sites}}', ['content' => [$f['placement'] => Json::encode($raw)]], ['elementId' => $f['entry']->id, 'siteId' => $f['entry']->siteId])->execute();
    $service = new Diagnostics();
    $documents = $service->collectDocuments($f['entry']);
    expect($documents)->toHaveCount(3);
    $selected = array_values($documents)[2];
    $json = $service->encodeReport($service->createReport($selected, true));
    expect($json)->toContain('Nested two')->not->toContain('Nested one');
});

it('previews browser-only reports and strips arbitrary data and unconsented details', function() {
    $response = diagnosticsRequest('preview', [], function() {
        $capture = [
            'owner' => \verbb\vizy\services\BrowserDiagnostics::ownerKey(),
            'startedAt' => time() * 1000,
            'status' => 'stopped', 'includeDetails' => true, 'dropped' => 2,
            'events' => [[
                'kind' => 'error', 'errorType' => 'TypeError', 'elapsedMs' => 10,
                'message' => 'PRIVATE-BROWSER-MESSAGE', 'stack' => 'PRIVATE-STACK',
                'url' => 'https://private.example?token=secret', 'headers' => ['Authorization' => 'secret'],
            ], ['kind' => 'PRIVATE-UNEXPECTED-KIND']],
            'cookies' => 'PRIVATE-COOKIE',
        ];
        Craft::$app->getRequest()->setBodyParams(['browserCapture' => Json::encode($capture)]);
    });
    $variables = $response->getBehavior(\craft\web\TemplateResponseBehavior::NAME)->variables;
    $report = Json::decode($variables['reportJson']);
    expect($report['scope'])->toBeNull()
        ->and($report['browser']['captured'])->toBeTrue()
        ->and($report['browser']['includesDetails'])->toBeFalse()
        ->and($report['browser']['events'])->toHaveCount(1)
        ->and($variables['reportJson'])->not->toContain('PRIVATE-', 'private.example', 'Authorization', 'secret');
    $download = diagnosticsRequest('download', ['report' => $variables['signedReport']]);
    expect($download->content)->toBe($variables['reportJson']);
});

it('requires content consent both when recording and when exporting browser error details', function(bool $recorded, bool $exported) {
    diagnosticsRequest('index', [], function() use ($recorded, $exported) {
        $raw = Json::encode([
            'owner' => \verbb\vizy\services\BrowserDiagnostics::ownerKey(),
            'startedAt' => time() * 1000, 'status' => 'stopped', 'includeDetails' => $recorded,
            'events' => [['kind' => 'console-error', 'message' => 'PRIVATE-MESSAGE', 'stack' => 'PRIVATE-STACK', 'body' => 'PRIVATE-BODY']],
        ]);
        $report = \verbb\vizy\services\BrowserDiagnostics::readReport($raw, $exported);
        expect($report['includesDetails'])->toBe($recorded && $exported);
        expect(isset($report['events'][0]['message']))->toBe($recorded && $exported);
        expect(Json::encode($report))->not->toContain('PRIVATE-BODY');
    });
})->with([[false, false], [false, true], [true, false], [true, true]]);

it('rejects expired, other-login, active, oversized and malformed browser captures', function(string $case) {
    expect(fn() => diagnosticsRequest('preview', [], function() use ($case) {
        $capture = [
            'owner' => \verbb\vizy\services\BrowserDiagnostics::ownerKey(),
            'startedAt' => time() * 1000, 'status' => 'stopped', 'events' => [],
        ];
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
