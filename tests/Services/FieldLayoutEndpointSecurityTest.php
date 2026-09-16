<?php

declare(strict_types=1);

use craft\behaviors\CustomFieldBehavior;
use craft\elements\Entry;
use craft\elements\User;
use craft\fieldlayoutelements\CustomField;
use craft\fields\Assets;
use craft\fields\Entries;
use craft\fields\Lightswitch;
use craft\fields\PlainText;
use craft\helpers\Json;
use craft\helpers\StringHelper;
use craft\models\FieldLayout;
use craft\models\FieldLayoutTab;
use Tests\Support\Fixtures\AssetSpikeFixture;
use Tests\Support\Fixtures\VizyFixtureFactory;
use Tests\Support\WebControllerHarness;
use verbb\vizy\elements\Block;
use verbb\vizy\models\BlockType;
use verbb\vizy\Vizy;
use yii\web\ForbiddenHttpException;

beforeEach(function() {
    AssetSpikeFixture::ensureAdminUser();
});

afterEach(function() {
    WebControllerHarness::endWebRequest();
});

function fieldLayoutSecurityFixture(string $label, bool $withRelations = false): array
{
    AssetSpikeFixture::ensureAdminUser();
    $suffix = StringHelper::randomString(5);
    $plain = new PlainText(['name' => 'Heading', 'handle' => 'heading' . $suffix]);
    $light = new Lightswitch(['name' => 'Toggle', 'handle' => 'toggle' . $suffix]);
    $fields = [$plain, $light];
    $entries = null;
    $assets = null;
    if ($withRelations) {
        $entries = new Entries(['name' => 'Related', 'handle' => 'related' . $suffix]);
        $assets = AssetSpikeFixture::assetsField('{id}');
        $fields[] = $entries;
        CustomFieldBehavior::$fieldHandles[$assets->handle] = true;
    }
    foreach ([$plain, $light] as $craftField) {
        expect(Craft::$app->getFields()->saveField($craftField))->toBeTrue();
        CustomFieldBehavior::$fieldHandles[$craftField->handle] = true;
    }
    if ($entries) {
        expect(Craft::$app->getFields()->saveField($entries))->toBeTrue();
        CustomFieldBehavior::$fieldHandles[$entries->handle] = true;
    }

    $elements = [
        ['type' => CustomField::class, 'fieldUid' => $plain->uid],
        ['type' => CustomField::class, 'fieldUid' => $light->uid],
    ];
    if ($entries && $assets) {
        $elements[] = ['type' => CustomField::class, 'fieldUid' => $entries->uid];
        $elements[] = ['type' => CustomField::class, 'fieldUid' => $assets->uid];
    }

    $layout = new FieldLayout(['uid' => StringHelper::UUID(), 'type' => Block::class]);
    $layout->setTabs([new FieldLayoutTab([
        'layout' => $layout,
        'name' => 'Fields',
        'elements' => $elements,
    ])]);
    $type = new BlockType([
        'uid' => StringHelper::UUID(),
        'name' => "Security {$label}",
        'handle' => 'security' . $label . $suffix,
    ]);
    $type->setFieldLayout($layout);
    expect(Vizy::$plugin->getBlockTypes()->saveBlockType($type))->toBeTrue();
    $type = Vizy::$plugin->getBlockTypes()->getBlockTypeByUid($type->uid);

    $field = VizyFixtureFactory::vizyField();
    $field->blockTypePickerGroups = [['name' => 'Root', 'blockTypeUids' => [$type->uid]]];
    expect(Craft::$app->getFields()->saveField($field))->toBeTrue();
    Craft::$app->getFields()->refreshFields();
    $field = Craft::$app->getFields()->getFieldByUid($field->uid);
    expect($field)->toBeInstanceOf(\verbb\vizy\fields\VizyField::class);
    $owner = VizyFixtureFactory::entry("Security {$label} owner");
    foreach ($owner->getFieldLayout()?->getCustomFieldElements() ?? [] as $placement) {
        $layoutField = $placement->getField();
        if ($layoutField instanceof \verbb\vizy\fields\VizyField && $layoutField->uid === $field->uid) {
            $layoutField->blockTypePickerGroups = $field->blockTypePickerGroups;
        }
    }
    $context = Vizy::$plugin->getEditorContexts()->issue($owner, $field);
    $block = [
        'type' => 'vizyBlock',
        'attrs' => [
            'blockUid' => StringHelper::UUID(),
            'blockTypeUid' => $type->uid,
            'enabled' => true,
            'fieldSlots' => [],
        ],
    ];

    return compact('plain', 'light', 'entries', 'assets', 'type', 'field', 'owner', 'context', 'block');
}

function fieldLayoutRequest(array $fixture, array $overrides = []): array
{
    $block = $overrides['block'] ?? $fixture['block'];
    $request = [
        'editorContextToken' => $fixture['context']['token'],
        'requestId' => StringHelper::UUID(),
        'documentRevision' => 1,
        'blockHash' => WebControllerHarness::stableBlockHash($block),
        'block' => $block,
        'destination' => ['kind' => 'root'],
    ];
    foreach ($overrides as $key => $value) {
        $request[$key] = $value;
    }
    if (!array_key_exists('blockHash', $overrides)) {
        $request['blockHash'] = WebControllerHarness::stableBlockHash($request['block']);
    }
    return $request;
}

it('renders typed adapters for Plain Text and Lightswitch without saving the owner', function() {
    $fixture = fieldLayoutSecurityFixture('Mount');
    $before = $fixture['owner']->dateUpdated?->format('c') ?? 'null';
    $response = WebControllerHarness::renderFieldLayout(fieldLayoutRequest($fixture));
    expect($response->getStatusCode())->toBe(200, json_encode($response->data ?? null));
    $adapters = array_column($response->data['fields'], 'adapterId');
    $reloaded = Craft::$app->getElements()->getElementById($fixture['owner']->id, Entry::class, $fixture['owner']->siteId);

    expect($adapters)->toBe(['craft.plainText', 'craft.lightswitch'])
        ->and($response->data['html'])->toContain('data-vizy-adapter-id="craft.plainText"')
        ->and($response->data['html'])->toContain('data-vizy-adapter-id="craft.lightswitch"')
        ->and($response->data['hostNamespace'])->toStartWith('vizyHost[')
        ->and($response->data['tabLabels'])->toBeArray()
        ->and($response->data['tabLabels'])->not->toBeEmpty()
        ->and($reloaded->dateUpdated?->format('c') ?? 'null')->toBe($before)
        ->and($reloaded->id)->toBe($fixture['owner']->id);
});

it('server-renders every mountable FieldLayout for initial bootstrap', function() {
    $fixture = fieldLayoutSecurityFixture('Initial');
    $blocks = [];
    for ($index = 0; $index < 8; $index++) {
        $block = $fixture['block'];
        $block['attrs']['blockUid'] = StringHelper::UUID();
        $blocks[] = $block;
    }
    $document = [
        'type' => 'doc',
        'attrs' => ['schemaVersion' => 2],
        'content' => $blocks,
    ];
    $before = $fixture['owner']->dateUpdated?->format('c') ?? 'null';

    $layouts = Vizy::$plugin->getInitialFieldLayouts()->build(
        $document,
        $fixture['context'],
        $fixture['owner'],
        $fixture['field'],
    );
    $reloaded = Craft::$app->getElements()->getElementById(
        $fixture['owner']->id,
        Entry::class,
        $fixture['owner']->siteId,
    );

    expect($layouts)->toHaveCount(8)
        ->and(array_column($layouts, 'blockUid'))->toBe(array_map(
            static fn(array $block): string => $block['attrs']['blockUid'],
            $blocks,
        ))
        ->and($layouts[0]['html'])->toContain('data-vizy-adapter-id="craft.plainText"')
        ->and($reloaded->dateUpdated?->format('c') ?? 'null')->toBe($before);
});

it('preserves an empty fieldSlots object while decoding the raw HTTP body', function() {
    // A block that has never had a custom field edited serialises fieldSlots as
    // `{}` in the browser. Yii decodes JSON bodies into associative arrays,
    // where `{}` and `[]` are indistinguishable, so the endpoint used to
    // re-encode that as `"fieldSlots":[]` and reject every such request as
    // staleBlockHash — which meant Edit never worked on a fresh block.
    $fixture = fieldLayoutSecurityFixture('EmptySlots');
    $block = $fixture['block'];
    $block['attrs']['fieldSlots'] = new \stdClass();

    $response = WebControllerHarness::renderFieldLayout(fieldLayoutRequest($fixture, ['block' => $block]));

    expect($response->getStatusCode())->toBe(200, json_encode($response->data ?? null));
});

it('renders several blocks in one batch and isolates a bad item', function() {
    $fixture = fieldLayoutSecurityFixture('Batch');
    $good = fieldLayoutRequest($fixture);

    // Same Block Type, different Block UID, so both items are independently
    // valid and must each come back with their own namespaced host.
    $secondBlock = $fixture['block'];
    $secondBlock['attrs']['blockUid'] = StringHelper::UUID();
    $second = fieldLayoutRequest($fixture, ['block' => $secondBlock]);

    // A deliberately stale hash on the third item must not cost the other two.
    $stale = fieldLayoutRequest($fixture);
    $stale['blockHash'] = str_repeat('a', 64);

    $response = WebControllerHarness::renderFieldLayoutBatch([
        'editorContextToken' => $fixture['context']['token'],
        'items' => [$good, $second, $stale],
    ]);

    expect($response->getStatusCode())->toBe(200, json_encode($response->data ?? null));
    $results = $response->data['results'];
    expect($results)->toHaveCount(3)
        ->and($results[0]['ok'])->toBeTrue()
        ->and($results[1]['ok'])->toBeTrue()
        ->and($results[2]['ok'])->toBeFalse()
        ->and($results[2]['error'])->toBe('staleBlockHash')
        ->and($results[0]['blockUid'])->toBe($fixture['block']['attrs']['blockUid'])
        ->and($results[1]['blockUid'])->toBe($secondBlock['attrs']['blockUid'])
        ->and($results[0]['hostNamespace'])->not->toBe($results[1]['hostNamespace']);
});

it('renders large field values on initial and lazy mounts without truncation', function() {
    $fixture = fieldLayoutSecurityFixture('LargeValue');
    $placement = $fixture['type']->getFieldLayout()->getCustomFieldElements()[0];
    $value = rtrim(str_repeat('Large field content. ', 16_000));
    $fixture['block']['attrs']['fieldSlots'][$placement->uid] = $value;

    $response = WebControllerHarness::renderFieldLayout(fieldLayoutRequest($fixture));
    expect($response->getStatusCode())->toBe(200, json_encode($response->data));

    $result = Vizy::$plugin->getFieldLayoutForms()->renderInitial(
        $fixture['context'], $fixture['owner'], $fixture['field'],
        $fixture['block'], ['kind' => 'root'],
    );
    expect($result['ok'])->toBeTrue();
    foreach ([$response->data['html'], $result['data']['html']] as $html) {
        // Assert the actual field control value, not incidental text elsewhere in the HTML.
        $dom = new DOMDocument();
        $dom->loadHTML($html, LIBXML_NOERROR | LIBXML_NOWARNING);
        $values = (new DOMXPath($dom))->query('//input[contains(@name, "[' . $fixture['plain']->handle . ']")]/@value');
        expect($values->length)->toBe(1)
            ->and($values->item(0)->nodeValue)->toBe($value);
    }
});

it('rejects an empty or oversized batch', function() {
    $fixture = fieldLayoutSecurityFixture('BatchLimit');
    $token = $fixture['context']['token'];

    expect(WebControllerHarness::renderFieldLayoutBatch([
        'editorContextToken' => $token,
        'items' => [],
    ])->data['error'] ?? null)->toBe('invalidBatch');

    expect(WebControllerHarness::renderFieldLayoutBatch([
        'editorContextToken' => $token,
        'items' => array_fill(0, 26, fieldLayoutRequest($fixture)),
    ])->data['error'] ?? null)->toBe('invalidBatch');
});

it('maps Entries and Assets adapter IDs for FieldLayout placements', function() {
    // Full relation-widget HTML needs craft\web\Session; the console Pest app
    // throws from Application::getSession(). Adapter identity is still proven.
    $forms = Vizy::$plugin->getFieldLayoutForms();
    $method = new ReflectionMethod($forms, '_adapterId');
    $method->setAccessible(true);
    expect($method->invoke($forms, new Entries()))->toBe('craft.entries')
        ->and($method->invoke($forms, new Assets()))->toBe('craft.assets')
        ->and($method->invoke($forms, new PlainText()))->toBe('craft.plainText')
        ->and($method->invoke($forms, new Lightswitch()))->toBe('craft.lightswitch')
        ->and($method->invoke($forms, new \craft\fields\Json()))->toBe('craft.json')
        ->and($method->invoke($forms, new \craft\fields\Dropdown()))->toBe('craft.generic');
});

it('rejects tampered context, old versions, wrong user, wrong site, wrong owner, wrong field, and wrong placement', function() {
    $fixture = fieldLayoutSecurityFixture('Tamper');
    $valid = fieldLayoutRequest($fixture);

    $tampered = $valid;
    $tampered['editorContextToken'] .= 'x';
    expect(WebControllerHarness::renderFieldLayout($tampered)->data['error'] ?? null)->toBe('invalidContext');

    $oldPayload = $fixture['context'];
    unset($oldPayload['token']);
    $oldPayload['version'] = 2;
    $oldPayload['expiresAt'] = time() + 3600;
    $oldToken = rtrim(strtr(base64_encode(Craft::$app->getSecurity()->hashData(Json::encode($oldPayload))), '+/', '-_'), '=');
    expect(WebControllerHarness::renderFieldLayout(fieldLayoutRequest($fixture, [
        'editorContextToken' => $oldToken,
    ]))->data['error'] ?? null)->toBe('invalidContext');

    $admin = AssetSpikeFixture::ensureAdminUser();
    $wrongUser = $fixture['context'];
    unset($wrongUser['token']);
    $wrongUser['userId'] = ((int)$admin->id) + 99999;
    $wrongUserToken = rtrim(strtr(base64_encode(Craft::$app->getSecurity()->hashData(Json::encode($wrongUser))), '+/', '-_'), '=');
    expect(WebControllerHarness::renderFieldLayout(fieldLayoutRequest($fixture, [
        'editorContextToken' => $wrongUserToken,
    ]))->data['error'] ?? null)->toBe('invalidContext');
    Craft::$app->getUser()->setIdentity($admin);

    $wrongSite = $fixture['context'];
    unset($wrongSite['token']);
    $wrongSite['siteId'] = ((int)$wrongSite['siteId']) + 99999;
    $wrongSiteToken = rtrim(strtr(base64_encode(Craft::$app->getSecurity()->hashData(Json::encode($wrongSite))), '+/', '-_'), '=');
    expect(WebControllerHarness::renderFieldLayout(fieldLayoutRequest($fixture, [
        'editorContextToken' => $wrongSiteToken,
    ]))->data['error'] ?? null)->toBe('invalidContext');

    // A missing persisted identity is stale even for an administrator who can
    // create entries. It must not be reconstructed as a new element.
    $wrongOwner = $fixture['context'];
    unset($wrongOwner['token']);
    $wrongOwner['ownerId'] = 999_999_999;
    $wrongOwner['ownerUid'] = StringHelper::UUID();
    $wrongOwner['definingAttributes'] = [];
    $wrongOwner['ownerLayoutUid'] = StringHelper::UUID();
    $wrongOwner['ownerPlacementUid'] = StringHelper::UUID();
    $wrongOwnerToken = rtrim(strtr(base64_encode(Craft::$app->getSecurity()->hashData(Json::encode($wrongOwner))), '+/', '-_'), '=');
    expect(WebControllerHarness::renderFieldLayout(fieldLayoutRequest($fixture, [
        'editorContextToken' => $wrongOwnerToken,
    ]))->data['error'] ?? null)->toBe('invalidContext');

    $wrongField = $fixture['context'];
    unset($wrongField['token']);
    $wrongField['fieldUid'] = StringHelper::UUID();
    $wrongFieldToken = rtrim(strtr(base64_encode(Craft::$app->getSecurity()->hashData(Json::encode($wrongField))), '+/', '-_'), '=');
    expect(WebControllerHarness::renderFieldLayout(fieldLayoutRequest($fixture, [
        'editorContextToken' => $wrongFieldToken,
    ]))->data['error'] ?? null)->toBe('staleField');

    $wrongPlacement = $fixture['context'];
    unset($wrongPlacement['token']);
    $wrongPlacement['ownerPlacementUid'] = StringHelper::UUID();
    $wrongPlacementToken = rtrim(strtr(base64_encode(Craft::$app->getSecurity()->hashData(Json::encode($wrongPlacement))), '+/', '-_'), '=');
    expect(WebControllerHarness::renderFieldLayout(fieldLayoutRequest($fixture, [
        'editorContextToken' => $wrongPlacementToken,
    ]))->data['error'] ?? null)->toBe('staleField');
});

it('supports unsaved Entry defining context and rejects canSave denial', function() {
    $section = VizyFixtureFactory::section();
    $entryType = Craft::$app->getEntries()->getEntryTypesBySectionId($section->id)[0];
    $field = VizyFixtureFactory::vizyField();
    $type = new BlockType([
        'uid' => StringHelper::UUID(),
        'name' => 'Unsaved Mount',
        'handle' => 'unsaved' . StringHelper::randomString(5),
    ]);
    $plain = new PlainText(['name' => 'Title', 'handle' => 'title' . StringHelper::randomString(5)]);
    expect(Craft::$app->getFields()->saveField($plain))->toBeTrue();
    CustomFieldBehavior::$fieldHandles[$plain->handle] = true;
    $layout = new FieldLayout(['uid' => StringHelper::UUID(), 'type' => Block::class]);
    $layout->setTabs([new FieldLayoutTab([
        'layout' => $layout,
        'name' => 'Content',
        'elements' => [['type' => CustomField::class, 'fieldUid' => $plain->uid]],
    ])]);
    $type->setFieldLayout($layout);
    expect(Vizy::$plugin->getBlockTypes()->saveBlockType($type))->toBeTrue();
    $type = Vizy::$plugin->getBlockTypes()->getBlockTypeByUid($type->uid);
    $field->blockTypePickerGroups = [['name' => 'Root', 'blockTypeUids' => [$type->uid]]];
    expect(Craft::$app->getFields()->saveField($field))->toBeTrue();

    $unsaved = new Entry([
        'uid' => StringHelper::UUID(),
        'sectionId' => $section->id,
        'typeId' => $entryType->id,
        'siteId' => Craft::$app->getSites()->getPrimarySite()->id,
        'scenario' => Entry::SCENARIO_LIVE,
    ]);
    $context = Vizy::$plugin->getEditorContexts()->issue($unsaved, $field);
    $block = [
        'type' => 'vizyBlock',
        'attrs' => [
            'blockUid' => StringHelper::UUID(),
            'blockTypeUid' => $type->uid,
            'enabled' => true,
            'fieldSlots' => [],
        ],
    ];
    $response = WebControllerHarness::renderFieldLayout([
        'editorContextToken' => $context['token'],
        'requestId' => StringHelper::UUID(),
        'documentRevision' => 1,
        'blockHash' => WebControllerHarness::stableBlockHash($block),
        'block' => $block,
        'destination' => ['kind' => 'root'],
    ]);
    expect($response->getStatusCode())->toBe(200)
        ->and($response->data['fields'][0]['adapterId'])->toBe('craft.plainText');

    $admin = AssetSpikeFixture::ensureAdminUser();
    Craft::$app->getUser()->setIdentity(null);
    $guestToken = Vizy::$plugin->getEditorContexts()->issue($unsaved, $field)['token'];
    // Guest identity cannot save the Entry; the controller must fail closed.
    expect(fn() => WebControllerHarness::renderFieldLayout([
        'editorContextToken' => $guestToken,
        'requestId' => StringHelper::UUID(),
        'documentRevision' => 1,
        'blockHash' => WebControllerHarness::stableBlockHash($block),
        'block' => $block,
        'destination' => ['kind' => 'root'],
    ], ensureAdmin: false))->toThrow(\yii\web\HttpException::class);
    Craft::$app->getUser()->setIdentity($admin);
});

it('rejects invalid requests and refreshes layout HTML and hash when its UID is unchanged', function() {
    $fixture = fieldLayoutSecurityFixture('Stale');
    $badHash = fieldLayoutRequest($fixture);
    $badHash['blockHash'] = str_repeat('a', 64);
    expect(WebControllerHarness::renderFieldLayout($badHash)->data['error'] ?? null)->toBe('staleBlockHash');

    $unknownType = $fixture['block'];
    $unknownType['attrs']['blockTypeUid'] = StringHelper::UUID();
    expect(WebControllerHarness::renderFieldLayout(fieldLayoutRequest($fixture, [
        'block' => $unknownType,
    ]))->data['error'] ?? null)->toBe('unknownBlockType');

    // Content Area destinations are retired — not a well-formed destination kind.
    expect(WebControllerHarness::renderFieldLayout(fieldLayoutRequest($fixture, [
        'destination' => ['kind' => 'contentArea', 'parentBlockTypeUid' => $fixture['type']->uid, 'contentAreaUid' => StringHelper::UUID()],
    ]))->data['error'] ?? null)->toBe('invalidDestination');

    expect(WebControllerHarness::renderFieldLayout(fieldLayoutRequest($fixture, [
        'destination' => ['kind' => 'nope'],
    ]))->data['error'] ?? null)->toBe('invalidDestination');

    $before = WebControllerHarness::renderFieldLayout(fieldLayoutRequest($fixture));
    expect($before->getStatusCode())->toBe(200);
    $layout = $fixture['type']->getFieldLayout();
    $layoutUid = $layout->uid;
    $extra = new PlainText(['name' => 'Extra', 'handle' => 'extra' . StringHelper::randomString(4)]);
    expect(Craft::$app->getFields()->saveField($extra))->toBeTrue();
    CustomFieldBehavior::$fieldHandles[$extra->handle] = true;
    $layout->setTabs([new FieldLayoutTab([
        'layout' => $layout,
        'name' => 'Changed',
        'elements' => [
            ['type' => CustomField::class, 'fieldUid' => $fixture['plain']->uid],
            ['type' => CustomField::class, 'fieldUid' => $extra->uid],
        ],
    ])]);
    $fixture['type']->setFieldLayout($layout);
    expect(Vizy::$plugin->getBlockTypes()->saveBlockType($fixture['type']))->toBeTrue();
    $reloaded = Vizy::$plugin->getBlockTypes()->getBlockTypeByUid($fixture['type']->uid);
    expect($reloaded->getFieldLayout()->uid)->toBe($layoutUid);
    $fresh = fieldLayoutRequest($fixture);
    $after = WebControllerHarness::renderFieldLayout($fresh);
    expect($after->getStatusCode())->toBe(200)
        ->and($after->data['fieldLayoutHash'])->not->toBe($before->data['fieldLayoutHash'])
        ->and($after->data['hostNamespace'])->toBe($before->data['hostNamespace'])
        ->and($after->data['html'])->toContain($extra->handle)
        ->and($before->data['html'])->not->toContain($extra->handle)
        ->and($after->data['tabLabels'])->not->toBe($before->data['tabLabels']);
})->group('slow');

it('rejects malformed and over-deep blocks without persisting transient Blocks', function() {
    $fixture = fieldLayoutSecurityFixture('Malformed');
    $malformed = $fixture['block'];
    $malformed['attrs']['enabled'] = 'yes';
    expect(WebControllerHarness::renderFieldLayout(fieldLayoutRequest($fixture, [
        'block' => $malformed,
    ]))->data['error'] ?? null)->toBe('invalidBlock');

    $deep = $fixture['block'];
    $cursor = &$deep;
    for ($i = 0; $i < 40; $i++) {
        $cursor['content'] = [['type' => 'wrapper', 'content' => []]];
        $cursor = &$cursor['content'][0];
    }
    expect(WebControllerHarness::renderFieldLayout(fieldLayoutRequest($fixture, [
        'block' => $deep,
    ]))->data['error'] ?? null)->toBe('invalidBlock');

    $block = new Block();
    expect($block->id)->toBeNull();
    $beforeBlocks = (int)Block::find()->count();
    WebControllerHarness::renderFieldLayout(fieldLayoutRequest($fixture));
    expect((int)Block::find()->count())->toBe($beforeBlocks)
        ->and($block->id)->toBeNull();
})->group('slow');

it('rejects wrong owner layout UID, missing destination, and id-zero Block side effects', function() {
    $fixture = fieldLayoutSecurityFixture('LayoutZero');
    $wrongLayout = $fixture['context'];
    unset($wrongLayout['token']);
    $wrongLayout['ownerLayoutUid'] = StringHelper::UUID();
    $wrongLayoutToken = rtrim(strtr(base64_encode(Craft::$app->getSecurity()->hashData(Json::encode($wrongLayout))), '+/', '-_'), '=');
    expect(WebControllerHarness::renderFieldLayout(fieldLayoutRequest($fixture, [
        'editorContextToken' => $wrongLayoutToken,
    ]))->data['error'] ?? null)->toBe('staleField');

    // A destination that is missing or of an unrecognised kind is rejected as
    // malformed, distinctly from a well-formed destination that simply doesn't
    // allow the Block Type. Both fail closed.
    $missingDestination = fieldLayoutRequest($fixture);
    unset($missingDestination['destination']);
    expect(WebControllerHarness::renderFieldLayout($missingDestination)->data['error'] ?? null)
        ->toBe('invalidDestination');

    $defaultDestination = fieldLayoutRequest($fixture, [
        'destination' => ['kind' => 'default'],
    ]);
    expect(WebControllerHarness::renderFieldLayout($defaultDestination)->data['error'] ?? null)
        ->toBe('invalidDestination');

    $block = new Block();
    $block->id = 0;
    $beforeBlocks = (int)Block::find()->count();
    $beforeElements = (int)Entry::find()->count();
    WebControllerHarness::renderFieldLayout(fieldLayoutRequest($fixture));
    expect((int)Block::find()->count())->toBe($beforeBlocks)
        ->and((int)Entry::find()->count())->toBe($beforeElements)
        ->and($block->id === null || (int)$block->id === 0)->toBeTrue();
})->group('slow');

it('covers draft and revision owner contexts for FieldLayout render', function() {
    $fixture = fieldLayoutSecurityFixture('Derivative');
    $canonical = $fixture['owner'];
    $userId = AssetSpikeFixture::ensureAdminUser()->id;
    $draft = Craft::$app->getDrafts()->createDraft($canonical, $userId, 'FL draft');
    $draftContext = Vizy::$plugin->getEditorContexts()->issue($draft, $fixture['field']);
    $draftResponse = WebControllerHarness::renderFieldLayout(fieldLayoutRequest($fixture, [
        'editorContextToken' => $draftContext['token'],
    ]));
    expect($draftResponse->getStatusCode())->toBe(200);

    $section = Craft::$app->getEntries()->getSectionById($canonical->sectionId);
    $section->enableVersioning = true;
    expect(Craft::$app->getEntries()->saveSection($section))->toBeTrue();
    $revisionId = Craft::$app->getRevisions()->createRevision($canonical, $userId, force: true);
    $revisionElement = Entry::find()
        ->id($revisionId)
        ->siteId($canonical->siteId)
        ->revisions()
        ->status(null)
        ->one();
    expect($revisionElement)->toBeInstanceOf(Entry::class);
    $revisionContext = Vizy::$plugin->getEditorContexts()->issue($revisionElement, $fixture['field']);
    $revisionResponse = WebControllerHarness::renderFieldLayout(fieldLayoutRequest($fixture, [
        'editorContextToken' => $revisionContext['token'],
    ]));
    expect($revisionResponse->getStatusCode())->toBe(200);
});

it('reauthorizes an authenticated editor for the exact owner and after permissions are revoked', function() {
    $fixture = fieldLayoutSecurityFixture('EditorPermissions');
    $admin = AssetSpikeFixture::ensureAdminUser();
    $actor = new User([
        'username' => 'layouteditor' . StringHelper::randomString(6),
        'email' => StringHelper::randomString(8) . '@example.test',
        'active' => true, 'pending' => false,
    ]);
    $actor->newPassword = 'Testing1!';
    expect(Craft::$app->getElements()->saveElement($actor))->toBeTrue();
    $section = $fixture['owner']->getSection();
    $permissions = Craft::$app->getUserPermissions();
    $sitePermission = 'editSite:' . $fixture['owner']->getSite()->uid;
    $permissions->saveUserPermissions($actor->id, ['accessCp', $sitePermission, "viewEntries:$section->uid", "saveEntries:$section->uid"]);
    $fixture['owner']->setAuthorIds([$actor->id]);
    expect(Craft::$app->getElements()->saveElement($fixture['owner']))->toBeTrue();
    $peer = VizyFixtureFactory::entry('Uneditable peer');
    $peer->setAuthorIds([$admin->id]);
    expect(Craft::$app->getElements()->saveElement($peer))->toBeTrue();
    $before = $peer->getFieldValue($fixture['field']->handle)->toArray();
    Craft::$app->getUser()->setIdentity($actor);
    try {
        expect(Craft::$app->getElements()->canSave($fixture['owner'], $actor))->toBeTrue()
            ->and(Craft::$app->getElements()->canSave($peer, $actor))->toBeFalse();
        $token = Vizy::$plugin->getEditorContexts()->issue($fixture['owner'], $fixture['field'])['token'];
        $allowed = fieldLayoutRequest($fixture, ['editorContextToken' => $token]);
        expect(WebControllerHarness::renderFieldLayout($allowed, ensureAdmin: false)->getStatusCode())->toBe(200);
        $denied = fieldLayoutRequest($fixture, [
            'editorContextToken' => Vizy::$plugin->getEditorContexts()->issue($peer, $fixture['field'])['token'],
        ]);
        expect(fn() => WebControllerHarness::renderFieldLayout($denied, ensureAdmin: false))
            ->toThrow(ForbiddenHttpException::class);
        $permissions->saveUserPermissions($actor->id, ['accessCp', $sitePermission, "viewEntries:$section->uid"]);
        expect(fn() => WebControllerHarness::renderFieldLayout($allowed, ensureAdmin: false))
            ->toThrow(ForbiddenHttpException::class);
        $reloaded = Entry::find()->id($peer->id)->status(null)->one();
        expect($reloaded->getFieldValue($fixture['field']->handle)->toArray())->toBe($before);
    } finally {
        Craft::$app->getUser()->setIdentity($admin);
    }
});

function lifetimeContextToken(array $context): string
{
    unset($context['token']);
    $context['issuedAt'] = time() - 86400;
    return rtrim(strtr(base64_encode(Craft::$app->getSecurity()->hashData(Json::encode($context))), '+/', '-_'), '=');
}

it('keeps long-lived contexts usable for single and batch rendering without an independent deadline', function() {
    $fixture = fieldLayoutSecurityFixture('Lifetime');
    expect($fixture['context'])->not->toHaveKey('expiresAt');
    $request = fieldLayoutRequest($fixture, ['editorContextToken' => lifetimeContextToken($fixture['context'])]);
    $response = WebControllerHarness::renderFieldLayout($request);
    expect($response->getStatusCode())->toBe(200)
        ->and($response->data['html'])->toContain('data-vizy-adapter-id="craft.plainText"');
    $response = WebControllerHarness::renderFieldLayoutBatch([
        'editorContextToken' => $request['editorContextToken'], 'items' => [$request],
    ]);
    expect($response->getStatusCode())->toBe(200)
        ->and($response->data['results'][0]['ok'])->toBeTrue()
        ->and($response->data['results'][0]['html'])->toContain('data-vizy-adapter-id="craft.plainText"');
});

it('rejects deleted saved owners and derivatives without reconstructing an unsaved entry', function(string $kind) {
    $fixture = fieldLayoutSecurityFixture('Deleted' . $kind);
    $owner = $fixture['owner'];
    if ($kind === 'draft') {
        $owner = Craft::$app->getDrafts()->createDraft($owner, Craft::$app->getUser()->getId(), 'Stale draft');
    } elseif ($kind === 'revision') {
        $section = $owner->getSection();
        $section->enableVersioning = true;
        expect(Craft::$app->getEntries()->saveSection($section))->toBeTrue();
        $id = Craft::$app->getRevisions()->createRevision($owner, Craft::$app->getUser()->getId(), force: true);
        $owner = Entry::find()->id($id)->siteId($owner->siteId)->revisions()->status(null)->one();
    }
    $token = Vizy::$plugin->getEditorContexts()->issue($owner, $fixture['field'])['token'];
    expect(Craft::$app->getElements()->deleteElement($owner))->toBeTrue();
    $count = Entry::find()->status(null)->count();
    foreach ([false, true] as $batch) {
        $request = fieldLayoutRequest($fixture, ['editorContextToken' => $token]);
        $response = $batch
            ? WebControllerHarness::renderFieldLayoutBatch(['editorContextToken' => $token, 'items' => [$request]])
            : WebControllerHarness::renderFieldLayout($request);
        expect($response->getStatusCode())->toBe(409)
            ->and($response->data['error'])->toBe('invalidContext');
    }
    expect(Entry::find()->status(null)->count())->toBe($count);
})->with(['entry', 'draft', 'revision']);

it('resolves an initially unsaved context after the same entry is first persisted', function() {
    $fixture = fieldLayoutSecurityFixture('FirstSave');
    $original = $fixture['owner'];
    $owner = new Entry([
        'uid' => StringHelper::UUID(), 'sectionId' => $original->sectionId,
        'typeId' => $original->getTypeId(), 'siteId' => $original->siteId,
        'title' => 'First save transition', 'slug' => 'first-save-transition',
    ]);
    $context = Vizy::$plugin->getEditorContexts()->issue($owner, $fixture['field']);
    $request = fieldLayoutRequest($fixture, ['editorContextToken' => lifetimeContextToken($context)]);
    expect(WebControllerHarness::renderFieldLayout($request)->getStatusCode())->toBe(200);
    $owner->setAuthorIds([Craft::$app->getUser()->getId()]);
    expect(Craft::$app->getElements()->saveElement($owner))->toBeTrue(Json::encode($owner->getErrors()));
    expect(WebControllerHarness::renderFieldLayout($request)->getStatusCode())->toBe(200);
    $resolver = new ReflectionMethod(\verbb\vizy\controllers\FieldLayoutController::class, '_resolveOwner');
    $controller = new \verbb\vizy\controllers\FieldLayoutController('field-layout', Vizy::$plugin);
    expect($resolver->invoke($controller, $context)->id)->toBe($owner->id);
});

it('requires current CP access even when a signed context owner remains editable', function() {
    $fixture = fieldLayoutSecurityFixture('CpAccess');
    $admin = AssetSpikeFixture::ensureAdminUser();
    $actor = new User([
        'username' => 'contexteditor' . StringHelper::randomString(6),
        'email' => StringHelper::randomString(8) . '@example.test', 'active' => true, 'pending' => false,
    ]);
    $actor->newPassword = 'Testing1!';
    expect(Craft::$app->getElements()->saveElement($actor))->toBeTrue();
    $section = $fixture['owner']->getSection();
    $permissions = ['accessCp', 'editSite:' . $fixture['owner']->getSite()->uid, "viewEntries:$section->uid", "saveEntries:$section->uid"];
    Craft::$app->getUserPermissions()->saveUserPermissions($actor->id, $permissions);
    $fixture['owner']->setAuthorIds([$actor->id]);
    expect(Craft::$app->getElements()->saveElement($fixture['owner']))->toBeTrue();
    Craft::$app->getUser()->setIdentity($actor);
    try {
        $context = Vizy::$plugin->getEditorContexts()->issue($fixture['owner'], $fixture['field']);
        $request = fieldLayoutRequest($fixture, ['editorContextToken' => lifetimeContextToken($context)]);
        expect(WebControllerHarness::renderFieldLayout($request, ensureAdmin: false)->getStatusCode())->toBe(200);
        Craft::$app->getUserPermissions()->saveUserPermissions($actor->id, array_values(array_diff($permissions, ['accessCp'])));
        expect(Craft::$app->getElements()->canSave($fixture['owner'], $actor))->toBeTrue();
        expect(fn() => WebControllerHarness::renderFieldLayout($request, ensureAdmin: false))->toThrow(ForbiddenHttpException::class);
    } finally {
        Craft::$app->getUser()->setIdentity($admin);
    }
});

/** Build real nested layouts, then obtain contexts from the actual HTML producer. */
function lifetimeHostedFixture(array $deepContent = []): array
{
    $fixture = fieldLayoutSecurityFixture('HostedLifetime');
    $fields = [$fixture['field']];
    $types = [$fixture['type']];
    $placements = [];
    for ($depth = 1; $depth <= \verbb\vizy\services\HostedVizy::MAX_DEPTH; $depth++) {
        $nested = new \verbb\vizy\fields\VizyField([
            'name' => 'Lifetime nested ' . $depth, 'handle' => 'lifetime' . StringHelper::randomString(8),
        ]);
        expect(Craft::$app->getFields()->saveField($nested))->toBeTrue();
        CustomFieldBehavior::$fieldHandles[$nested->handle] = true;
        $type = new BlockType(['uid' => StringHelper::UUID(), 'name' => 'Lifetime level ' . $depth, 'handle' => 'lifetime' . StringHelper::randomString(8)]);
        $childLayout = new FieldLayout(['uid' => StringHelper::UUID(), 'type' => Block::class]);
        $childLayout->setTabs([new FieldLayoutTab([
            'layout' => $childLayout, 'name' => 'Fields',
            'elements' => [['type' => CustomField::class, 'fieldUid' => $fixture['plain']->uid]],
        ])]);
        $type->setFieldLayout($childLayout);
        expect(Vizy::$plugin->getBlockTypes()->saveBlockType($type))->toBeTrue();
        $types[] = Vizy::$plugin->getBlockTypes()->getBlockTypeByUid($type->uid);
        $nested->blockTypePickerGroups = [['name' => 'Content', 'blockTypeUids' => [$type->uid]]];
        expect(Craft::$app->getFields()->saveField($nested))->toBeTrue();
        $fields[] = $nested;
        $parentType = $types[$depth - 1];
        $layout = $parentType->getFieldLayout();
        $tab = $layout->getTabs()[0];
        $placement = new CustomField($nested);
        $placement->uid = StringHelper::UUID();
        $tab->setElements([...$tab->getElements(), $placement]);
        expect(Vizy::$plugin->getBlockTypes()->saveBlockType($parentType))->toBeTrue();
        $placements[] = $placement->uid;


    }
    Craft::$app->getFields()->refreshFields();
    (new ReflectionMethod(Vizy::$plugin->getBlockTypes(), '_resetCache'))->invoke(Vizy::$plugin->getBlockTypes());
    $document = null;
    for ($depth = count($fields) - 1; $depth >= 0; $depth--) {
        $slots = $document === null ? [] : [$placements[$depth] => $document];
        $block = $fixture['block'];
        $block['attrs']['blockUid'] = StringHelper::UUID();
        $block['attrs']['blockTypeUid'] = $types[$depth]->uid;
        $block['attrs']['fieldSlots'] = $slots;
        $document = ['type' => 'doc', 'attrs' => ['schemaVersion' => 2], 'content' => [
            $block,
            ...($document === null ? $deepContent : []),
        ]];
    }
    $fixture['block'] = $document['content'][0];
    $response = WebControllerHarness::renderFieldLayout(fieldLayoutRequest($fixture));
    expect($response->getStatusCode())->toBe(200);
    $bootstraps = [];
    $extract = function(string $html) use (&$extract, &$bootstraps): void {
        preg_match_all('/<template\b[^>]*data-vizy-bootstrap[^>]*>(.*?)<\/template>/s', $html, $matches);
        foreach ($matches[1] as $json) {
            $bootstrap = Json::decode(html_entity_decode($json, ENT_QUOTES | ENT_HTML5));
            $depth = $bootstrap['hosted']['depth'];
            $bootstraps[$depth] = $bootstrap;
            foreach ($bootstrap['initialFieldLayouts'] as $initial) {
                expect($initial['ok'])->toBeTrue(Json::encode($initial));
                $extract($initial['html']);
            }
        }
    };
    $extract($response->data['html']);
    expect($bootstraps)->toHaveCount(5)
        ->and(\verbb\vizy\services\HostedVizy::renderingPath())->toBe([]);
    return [...$fixture, ...compact('fields', 'types', 'placements', 'bootstraps')];
}

it('renders structured rich text at the supported five-level Hosted depth', function(bool $nestedLists) {
    $content = ['type' => 'table', 'content' => [[
        'type' => 'tableRow', 'content' => [[
            'type' => 'tableCell', 'content' => [[
                'type' => 'paragraph', 'content' => [[
                    'type' => 'text', 'text' => 'Deep table content', 'marks' => [['type' => 'bold']],
                ]],
            ]],
        ]],
    ]]];
    if ($nestedLists) {
        // Still below the editor's node-depth limit, but beyond 64 JSON containers
        // once Hosted envelopes and ordinary list items are included.
        for ($depth = 0; $depth < 8; $depth++) {
            $content = ['type' => 'bulletList', 'content' => [[
                'type' => 'listItem', 'content' => [['type' => 'paragraph'], $content],
            ]]];
        }
    }
    $fixture = lifetimeHostedFixture([$content]);
    expect($fixture['bootstraps'][5]['document']['content'][1])->toBe($content);

    $document = ['type' => 'doc', 'attrs' => ['schemaVersion' => 2], 'content' => [$fixture['block']]];
    $fixture['owner']->setFieldValue($fixture['field']->handle, $document);
    expect(Craft::$app->getElements()->saveElement($fixture['owner']))->toBeTrue();
    $owner = Entry::find()->id($fixture['owner']->id)->status(null)->one();
    $saved = $owner->getFieldValue($fixture['field']->handle)->toArray();
    $initial = Vizy::$plugin->getFieldLayoutForms()->renderInitial(
        $fixture['context'], $owner, $fixture['field'], $saved['content'][0], ['kind' => 'root'],
    );
    expect($initial['ok'])->toBeTrue(Json::encode($initial))
        ->and($initial['data']['html'])->toContain('Deep table content');
    $request = fieldLayoutRequest($fixture, ['block' => $saved['content'][0]]);
    $response = WebControllerHarness::renderFieldLayoutBatch([
        'editorContextToken' => $fixture['context']['token'], 'items' => [$request],
    ]);
    expect($response->getStatusCode())->toBe(200)
        ->and($response->data['results'][0]['ok'])->toBeTrue(Json::encode($response->data))
        ->and($response->data['results'][0]['html'])->toContain('Deep table content');
})->with([false, true]);

it('reauthorizes the entire original hosted ancestry through depth five', function(string $change) {
    $fixture = lifetimeHostedFixture();
    foreach ($fixture['bootstraps'] as $depth => $bootstrap) {
        $context = Vizy::$plugin->getEditorContexts()->verify($bootstrap['editorContextToken']);
        expect($context['hostedPath'])->toHaveCount($depth);
        $request = fieldLayoutRequest($fixture, [
            'editorContextToken' => lifetimeContextToken($context), 'block' => $bootstrap['document']['content'][0],
        ]);
        $response = WebControllerHarness::renderFieldLayout($request);
        expect($response->getStatusCode())->toBe(200, Json::encode($response->data))
            ->and($response->data['html'])->toContain('data-vizy-adapter-id="craft.plainText"');
    }
    // Retain the deepest token. Removing either its immediate placement or a
    // distant ancestor must reject it even though the nested field still exists.
    $deep = $fixture['bootstraps'][5];
    $request = fieldLayoutRequest($fixture, ['editorContextToken' => $deep['editorContextToken'], 'block' => $deep['document']['content'][0]]);
    if ($change === 'allowlist') {
        $field = Craft::$app->getFields()->getFieldByUid($fixture['fields'][1]->uid);
        $field->blockTypePickerGroups = [];
        expect(Craft::$app->getFields()->saveField($field))->toBeTrue();
        Craft::$app->getFields()->refreshFields();
    } else {
        $index = $change === 'immediate' ? 4 : 0;
        $type = $fixture['types'][$index];
        $tab = $type->getFieldLayout()->getTabs()[0];
        $tab->setElements(array_values(array_filter($tab->getElements(), fn($placement) => $placement->uid !== $fixture['placements'][$index])));
        expect(Vizy::$plugin->getBlockTypes()->saveBlockType($type))->toBeTrue();
    }
    // A subsequent HTTP request starts with current layout/field instances.
    (new ReflectionMethod(Vizy::$plugin->getBlockTypes(), '_resetCache'))->invoke(Vizy::$plugin->getBlockTypes());
    expect(Craft::$app->getFields()->getFieldByUid($fixture['fields'][5]->uid))->not->toBeNull();
    $response = WebControllerHarness::renderFieldLayout($request);
    expect($response->getStatusCode())->toBe(409)->and($response->data['error'])->toBe('staleField');
    $batch = WebControllerHarness::renderFieldLayoutBatch(['editorContextToken' => $deep['editorContextToken'], 'items' => [$request]]);
    expect($batch->getStatusCode())->toBe(409)->and($batch->data['error'])->toBe('staleField');
})->with(['immediate', 'ancestor', 'allowlist']);
