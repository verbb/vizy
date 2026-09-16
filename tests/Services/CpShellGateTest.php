<?php

declare(strict_types=1);

use craft\helpers\FileHelper;
use craft\helpers\Json;
use craft\helpers\StringHelper;
use craft\models\FieldLayout;
use verbb\vizy\elements\Block;
use verbb\vizy\helpers\Fields;
use verbb\vizy\models\BlockType;
use verbb\vizy\services\EditorConfigs;
use verbb\vizy\Vizy;

it('declares settings CP routes for block types and editor configs', function() {
    $routes = file_get_contents(dirname(__DIR__, 2) . '/src/base/Routes.php');
    $nav = file_get_contents(dirname(__DIR__, 2) . '/src/templates/_includes/settings-nav.html');
    expect($routes)->toContain("'vizy/settings'")
        ->and($routes)->toContain("'vizy/settings/block-types'")
        ->and($routes)->toContain("'vizy/settings/editor-configs'")
        ->and($routes)->not->toContain('insertion-lab')
        ->and($routes)->not->toContain("'vizy/settings/labs'")
        ->and($nav)->not->toContain('insertion-lab')
        ->and($nav)->not->toContain("'labs'");
});

it('exposes a reference-only block configurator in field settings', function() {
    $type = new BlockType([
        'uid' => StringHelper::UUID(),
        'name' => 'Card',
        'handle' => 'card' . StringHelper::randomString(5),
    ]);
    $layout = new FieldLayout(['uid' => StringHelper::UUID(), 'type' => Block::class]);
    $layout->setTabs([]);
    $type->setFieldLayout($layout);
    expect(Vizy::$plugin->getBlockTypes()->saveBlockType($type))->toBeTrue();

    $field = new \verbb\vizy\fields\VizyField([
        'uid' => StringHelper::UUID(),
        'name' => 'Body',
        'handle' => 'body' . StringHelper::randomString(5),
        'blockTypePickerGroups' => [
            ['name' => 'Content', 'blockTypeUids' => [$type->uid]],
        ],
    ]);
    $html = $field->getSettingsHtml();

    expect($html)->toContain('<vizy-field-settings')
        ->and($html)->toContain('Block Configuration')
        ->and($html)->toContain('data-picker-groups-name="blockTypePickerGroups"')
        // The referenced type is passed as a summary for the picker only.
        ->and($html)->toContain($type->uid)
        ->and($html)->toContain('Manage all block types');

    // Global Block Type schema is never editable inline: no embedded editor
    // panel, no field layout designer, and no global schema inputs to submit.
    expect($html)->not->toContain('data-vizy-block-editor')
        ->and($html)->not->toContain('vizyBlockTypes[')
        ->and($html)->not->toContain('block-type-field-layout');
});

it('offers Field and UI libraries without a Content library', function() {
    $layout = new FieldLayout(['uid' => StringHelper::UUID(), 'type' => Block::class]);
    $layout->setTabs([]);
    $html = Fields::fieldLayoutDesignerHtml($layout, ['id' => 'test-fld']);

    expect($html)->toContain('data-library="field"')
        ->and($html)->toContain('data-library="ui"')
        ->and($html)->not->toContain('data-library="content"')
        ->and($html)->not->toContain('fld-vizy-content-library');
});

it('renders the block type edit screen template', function() {
    // Field + UI designer only — Content library / Content Areas retired.
    $type = new BlockType([
        'uid' => StringHelper::UUID(),
        'name' => 'Quote',
        'handle' => 'quote' . StringHelper::randomString(5),
    ]);
    $layout = new FieldLayout(['uid' => StringHelper::UUID(), 'type' => Block::class]);
    $layout->setTabs([]);
    $type->setFieldLayout($layout);

    // Craft's CP form templates require browser request APIs, even in CLI tests.
    $html = Tests\Support\WebControllerHarness::withWebRequest([], 'vizy/block-types/edit',
        static fn(): string => Craft::$app->getView()->renderTemplate('vizy/block-types/_edit', [
            'blockType' => $type,
            'isNew' => false,
            'iconPickerHtml' => '<vizy-image-browser mode="icon"></vizy-image-browser>',
            'colorInputHtml' => '<vizy-color-input></vizy-color-input>',
            'previewImagePickerHtml' => '<vizy-image-browser mode="image"></vizy-image-browser>',
        ], craft\web\View::TEMPLATE_MODE_CP),
    );

    expect($html)->toContain('name="handle"')
        ->and($html)->not->toContain('fld-vizy-content-library')
        ->and($html)->not->toContain('add-content-area')
        ->and($html)->not->toContain('contentAreas[')
        ->and($html)->not->toContain('data-vizy-delete-block-type')
        ->and($html)->not->toContain('data-vizy-duplicate-block-type');
})->group('slow');

it('offers Save-and-continue, Duplicate and Delete on the Block Type CP screen header', function() {
    // Regression: Duplicate/Delete lived as footer buttons in the body, and there was no
    // Cmd+S / continue-editing path — unlike Editor Configs and Craft's Fields screens.
    $type = new BlockType([
        'uid' => StringHelper::UUID(),
        'name' => 'Header Actions',
        'handle' => 'headerActions' . StringHelper::randomString(5),
    ]);
    $layout = new FieldLayout(['uid' => StringHelper::UUID(), 'type' => Block::class]);
    $layout->setTabs([]);
    $type->setFieldLayout($layout);
    expect(Vizy::$plugin->getBlockTypes()->saveBlockType($type))->toBeTrue();

    $response = Tests\Support\WebControllerHarness::withWebRequest([], 'vizy/block-types/edit', static function() use ($type) {
        $controller = new verbb\vizy\controllers\BlockTypesController('block-types', Vizy::$plugin);
        $controller->enableCsrfValidation = false;
        $controller->request = Craft::$app->getRequest();
        $controller->response = Craft::$app->getResponse();

        return $controller->actionEdit($type->uid);
    });

    /** @var craft\web\CpScreenResponseBehavior $screen */
    $screen = $response->getBehavior(craft\web\CpScreenResponseBehavior::NAME);
    $labels = array_column($screen->altActions ?? [], 'label');

    expect($screen->action)->toBe('vizy/block-types/save')
        ->and($screen->redirectUrl)->toBe('vizy/settings/block-types')
        ->and($labels)->toContain(Craft::t('app', 'Save and continue editing'))
        ->and($labels)->toContain(Craft::t('app', 'Duplicate'))
        ->and($labels)->toContain(Craft::t('app', 'Delete'));

    $continue = collect($screen->altActions)->firstWhere('label', Craft::t('app', 'Save and continue editing'));
    expect($continue['shortcut'] ?? false)->toBeTrue()
        ->and($continue['redirect'] ?? null)->toBe('vizy/settings/block-types/{uid}');

    $delete = collect($screen->altActions)->firstWhere('label', Craft::t('app', 'Delete'));
    expect($delete['destructive'] ?? false)->toBeTrue()
        ->and($delete['action'] ?? null)->toBe('vizy/block-types/delete');

    // A brand-new type is only Save / continue — nothing to duplicate or delete yet.
    $newResponse = Tests\Support\WebControllerHarness::withWebRequest([], 'vizy/block-types/edit', static function() {
        $controller = new verbb\vizy\controllers\BlockTypesController('block-types', Vizy::$plugin);
        $controller->enableCsrfValidation = false;
        $controller->request = Craft::$app->getRequest();
        $controller->response = Craft::$app->getResponse();

        return $controller->actionEdit(null);
    });
    $newScreen = $newResponse->getBehavior(craft\web\CpScreenResponseBehavior::NAME);
    $newLabels = array_column($newScreen->altActions ?? [], 'label');

    expect($newLabels)->toContain(Craft::t('app', 'Save and continue editing'))
        ->and($newLabels)->not->toContain(Craft::t('app', 'Duplicate'))
        ->and($newLabels)->not->toContain(Craft::t('app', 'Delete'));
})->group('slow');

it('ships field layout designer JS for block type slideouts', function() {
    // Regression: registerJs output must land in bodyHtml so Craft.FieldLayoutDesigner
    // initializes when the edit screen opens in a CpScreenSlideout, not only full page.
    $data = Tests\Support\WebControllerHarness::withWebRequest([], 'vizy/block-types/edit', static function() {
        $controller = new verbb\vizy\controllers\BlockTypesController('block-types', Vizy::$plugin);
        $controller->enableCsrfValidation = false;
        $request = Craft::$app->getRequest();
        $request->headers->set('Accept', 'application/json');
        $request->headers->set('X-Craft-Container-Id', 'cp-screen-test');
        $controller->request = $request;
        $controller->response = Craft::$app->getResponse();

        $response = $controller->actionEdit(null);
        $formatter = new craft\web\CpScreenResponseFormatter();
        $formatter->format($response);

        return $response->data;
    });

    expect($data['content'] ?? null)->toContain('layoutdesigner')
        ->and($data['bodyHtml'] ?? null)->toContain('Craft.FieldLayoutDesigner');

    preg_match('/id="([^"]*block-type-field-layout-[^"]+)"/', (string)$data['content'], $idMatch);
    expect($idMatch[1] ?? null)->not->toBeEmpty()
        ->and((string)$data['bodyHtml'])->toContain($idMatch[1]);
})->group('slow');

it('suggests a config ID from the label, on new configs only', function() {
    // Regression: the two inputs were left to `forms.textField`'s random ids, so the generator
    // was wired to `#label` and `#newId`, which matched nothing and silently did nothing.
    // `{% js %}` registers on the app's view rather than emitting into the returned markup, so the
    // generator is only visible as a diff of what that view is holding either side of the render.
    $render = fn(string $id, bool $isNew): string => Tests\Support\WebControllerHarness::withWebRequest([], 'vizy/editor-configs/edit', function() use ($id, $isNew): string {
        $config = Vizy::$plugin->getEditorConfigs()->getConfig(EditorConfigs::DEFAULT_ID);
        $view = Craft::$app->getView();
        $before = $view->js;

        $html = $view->renderTemplate('vizy/editor-configs/_edit', [
            'configId' => $id,
            'config' => $config,
            'isNew' => $isNew,
            'isStandard' => false,
            'editorConfigInitial' => [],
        ], craft\web\View::TEMPLATE_MODE_CP);

        $added = [];
        foreach ($view->js as $position => $scripts) {
            $added[] = implode("\n", array_diff($scripts, $before[$position] ?? []));
        }

        return $html . "\n" . implode("\n", $added);
    });

    $new = $render('', true);
    expect($new)->toContain('id="label"')
        ->and($new)->toContain('id="newId"')
        ->and($new)->toContain("new Craft.DynamicGenerator('#label', '#newId'")
        // Craft's handle casing would offer `longFormArticle`, which `normalize()` rejects.
        ->and($new)->not->toContain('Craft.HandleGenerator');

    // The ID cannot change after saving, so there is nothing left to generate.
    expect($render('standard', false))->not->toContain('Generator');
});

it('shows a file-backed config as identity plus read-only JSON', function() {
    $service = Vizy::$plugin->getEditorConfigs();
    $id = 'inspect' . strtolower(StringHelper::randomString(6));
    $dir = Craft::$app->getPath()->getConfigPath() . DIRECTORY_SEPARATOR . EditorConfigs::FILE_CONFIG_DIR;
    FileHelper::createDirectory($dir);
    $path = $dir . DIRECTORY_SEPARATOR . $id . '.json';
    $json = Json::encode([
        'label' => 'Inspect Me',
        'capabilities' => [
            'nodes' => ['heading'],
            'marks' => ['bold'],
        ],
        'headings' => ['levels' => [2]],
        'toolbar' => ['bold'],
        'bubble' => ['enabled' => false, 'items' => []],
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    file_put_contents($path, $json);

    try {
        $service->invalidate();
        $config = $service->getConfig($id);
        $html = Craft::$app->getView()->renderTemplate('vizy/editor-configs/_edit', [
            'configId' => $id,
            'config' => $config,
            'isNew' => false,
            'isFile' => true,
            'filename' => $id . '.json',
            'fileJson' => $service->fileContents($id),
            'isStandard' => false,
        ], craft\web\View::TEMPLATE_MODE_CP);

        expect($html)->toContain('Inspect Me')
            ->and($html)->toContain($id)
            ->and($html)->toContain('readonly')
            // Textarea value is HTML-escaped; match the on-disk JSON after entity encoding.
            ->and($html)->toContain(htmlspecialchars($json, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'))
            ->and($html)->not->toContain('vizy-editor-config-settings')
            ->and($html)->not->toContain('Duplicate as Project Config')
            ->and($html)->not->toContain('data-vizy-delete-editor-config');
    } finally {
        @unlink($path);
        $service->invalidate();
    }
})->group('slow');
