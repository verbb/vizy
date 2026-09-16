<?php

declare(strict_types=1);

use craft\elements\Entry;
use craft\helpers\FileHelper;
use craft\helpers\Json;
use craft\helpers\StringHelper;
use RuntimeException;
use verbb\vizy\document\DocumentParser;
use verbb\vizy\elements\Block;
use verbb\vizy\events\RegisterExtensionsEvent;
use verbb\vizy\fields\VizyField;
use verbb\vizy\helpers\EditorConfigPresentation;
use verbb\vizy\helpers\ToolbarIcons;
use verbb\vizy\services\EditorConfigs;
use verbb\vizy\services\Extensions;
use verbb\vizy\models\BlockType;
use verbb\vizy\Vizy;
use yii\base\Event;

it('builds a deterministic registry with dependency closure and reserved transport names', function() {
    $extensions = Vizy::$plugin->getExtensions();
    $extensions->reset();

    $first = $extensions->getRevision();
    $second = $extensions->getRevision();
    $enabled = $extensions->resolveEnabled(['bulletList', 'table'], ['bold']);

    expect($first)->toBe($second)
        ->and($extensions->getNodes())->toHaveKey('paragraph')
        ->and($extensions->getMarks())->toHaveKey('bold')
        ->and($enabled['nodes'])->toContain('listItem', 'tableRow', 'tableCell', 'tableHeader')
        ->and($enabled['internalNodes'])->toContain('doc', 'text', 'vizyBlock')
        ->and($extensions->getDefinition('node', 'unsupportedNode'))->toBeNull();
});

it('resolves always-on capabilities whether or not a config lists them', function() {
    $extensions = Vizy::$plugin->getExtensions();
    $extensions->reset();

    // A config that names neither Paragraph nor Hard break must still get both,
    // otherwise the editor would have no way to write prose.
    $omitted = $extensions->resolveEnabled(['blockquote'], []);
    // Listing them stays legal, so existing stored configs keep validating.
    $listed = $extensions->resolveEnabled(['blockquote', 'paragraph', 'hardBreak'], []);

    expect($omitted['nodes'])->toContain('paragraph', 'hardBreak')
        ->and($omitted)->toBe($listed);
});

it('offers only genuine editorial choices in the allowed-content picker', function() {
    Vizy::$plugin->getExtensions()->reset();
    $catalog = EditorConfigPresentation::capabilityCatalog();

    $nodeValues = array_column($catalog['nodes'], 'value');
    $nodeLabels = array_column($catalog['nodes'], 'label');

    expect($nodeValues)
        // Always-on mechanics are not toggles.
        ->not->toContain('paragraph')
        ->not->toContain('hardBreak')
        // Internal schema plumbing is never author-facing.
        ->not->toContain('listItem')
        ->not->toContain('tableRow')
        ->not->toContain('column')
        // Headings own their own section.
        ->not->toContain('heading')
        ->and($nodeValues)->toContain('blockquote', 'codeBlock', 'image', 'iframe', 'mediaEmbed', 'table')
        // Labels are author-facing, not raw TipTap names.
        ->and($nodeLabels)->toContain('Bulleted list', 'Code block', 'Quote')
        ->and(array_column($catalog['marks'], 'value'))->toContain('bold', 'italic', 'link')
        ->and(array_column($catalog['marks'], 'label'))->toContain('Strikethrough', 'Inline code')
        ->and($catalog['headingAvailable'])->toBeTrue();
});

it('rejects duplicate, conflicting, and reserved extension definitions', function(string $class, string $message) {
    $handler = function(RegisterExtensionsEvent $event) use ($class): void {
        $event->nodes[] = $class;
    };
    Event::on(Extensions::class, Extensions::EVENT_REGISTER_EXTENSIONS, $handler);
    $service = new Extensions();
    try {
        expect(fn() => $service->getDefinitions())->toThrow(RuntimeException::class, $message);
    } finally {
        Event::off(Extensions::class, Extensions::EVENT_REGISTER_EXTENSIONS, $handler);
    }
})->with([
    [\Tests\Support\Types\DuplicateParagraph::class, 'Duplicate'],
    [\Tests\Support\Types\ReservedUnsupported::class, 'Reserved'],
]);

it('installs partner TipTap modules registered outside vizy/core', function() {
    $handler = function(RegisterExtensionsEvent $event): void {
        $event->marks[] = \Tests\Support\Types\Abbr::class;
    };
    Event::on(Extensions::class, Extensions::EVENT_REGISTER_EXTENSIONS, $handler);
    $service = Vizy::$plugin->getExtensions();
    $service->reset();
    try {
        $definition = $service->getDefinition('mark', 'abbr');
        expect($definition)->not->toBeNull()
            ->and($definition['installed'])->toBeTrue()
            ->and($definition['module'])->toBe('acme/mark/abbr')
            ->and($definition['render']['strategy'])->toBe('type');

        $enabled = $service->resolveEnabled([], ['abbr', 'bold']);
        expect($enabled['marks'])->toContain('abbr', 'bold')
            ->and($enabled['modules'])->toContain('acme/mark/abbr', 'vizy/core/mark/bold');

        // Palette picks up author-selectable installed marks automatically.
        $catalogIds = array_column(EditorConfigPresentation::toolbarCatalog(), 'id');
        expect($catalogIds)->toContain('abbr');
    } finally {
        Event::off(Extensions::class, Extensions::EVENT_REGISTER_EXTENSIONS, $handler);
        $service->reset();
    }
});

it('catalogues partner icons, surfaces, nodes, and behaviour extensions', function() {
    $handler = function(RegisterExtensionsEvent $event): void {
        $event->marks[] = \Tests\Support\Types\Abbr::class;
        $event->nodes[] = \Tests\Support\Types\Emoji::class;
        $event->extensions[] = \Tests\Support\Types\CharacterCount::class;
    };
    Event::on(Extensions::class, Extensions::EVENT_REGISTER_EXTENSIONS, $handler);
    $service = Vizy::$plugin->getExtensions();
    $service->reset();
    try {
        $abbr = $service->getDefinition('mark', 'abbr');
        expect($abbr['icon'])->toStartWith('<svg')
            ->and($abbr['surfaces'])->toBe(['bubble', 'toolbar'])
            ->and($abbr['controlId'])->toBe('abbr');

        $enabled = $service->resolveEnabled(['emoji'], ['abbr'], ['characterCount']);
        expect($enabled['nodes'])->toContain('emoji')
            ->and($enabled['marks'])->toContain('abbr')
            ->and($enabled['extensions'])->toContain('characterCount')
            ->and($enabled['modules'])->toContain('acme/node/emoji', 'acme/mark/abbr', 'acme/extension/characterCount');

        $toolbar = collect(EditorConfigPresentation::toolbarCatalog())->keyBy('id');
        expect($toolbar->has('abbr'))->toBeTrue()
            ->and($toolbar['abbr']['icon'])->toStartWith('<svg')
            ->and($toolbar->has('emoji'))->toBeTrue()
            ->and($toolbar['emoji']['group'])->toBe('Media')
            ->and($toolbar->has('characterCount'))->toBeTrue()
            ->and($toolbar['characterCount']['kind'])->toBe('extension');

        $bubbleIds = array_column(EditorConfigPresentation::bubbleCatalog(), 'id');
        expect($bubbleIds)->toContain('abbr')
            ->and($bubbleIds)->not->toContain('emoji');

        $control = EditorConfigPresentation::controlFor(
            'characterCount',
            ['abbr'],
            ['emoji'],
            [],
            [],
            ['characterCount'],
        );
        expect($control)->not->toBeNull()
            ->and($control['action']['command'])->toBe('registeredControl');

        expect(EditorConfigPresentation::capabilityCatalog()['extensions'])
            ->toContain(['label' => 'Character count', 'value' => 'characterCount']);
    } finally {
        Event::off(Extensions::class, Extensions::EVENT_REGISTER_EXTENSIONS, $handler);
        $service->reset();
    }
});

it('refuses duplicate control ids and control ids that collide with built-in toolbar tokens', function() {
    $duplicate = function(RegisterExtensionsEvent $event): void {
        $event->marks[] = \Tests\Support\Types\BoldCollider::class;
    };
    Event::on(Extensions::class, Extensions::EVENT_REGISTER_EXTENSIONS, $duplicate);
    $service = Vizy::$plugin->getExtensions();
    $service->reset();
    try {
        expect(fn() => $service->getDefinitions())
            ->toThrow(RuntimeException::class, 'Duplicate');
    } finally {
        Event::off(Extensions::class, Extensions::EVENT_REGISTER_EXTENSIONS, $duplicate);
        $service->reset();
    }

    $reserved = function(RegisterExtensionsEvent $event): void {
        $event->extensions[] = \Tests\Support\Types\HistoryHack::class;
    };
    Event::on(Extensions::class, Extensions::EVENT_REGISTER_EXTENSIONS, $reserved);
    $service->reset();
    try {
        expect(fn() => $service->getDefinitions())
            ->toThrow(RuntimeException::class, 'built-in toolbar token');
    } finally {
        Event::off(Extensions::class, Extensions::EVENT_REGISTER_EXTENSIONS, $reserved);
        $service->reset();
    }
});

it('omits catalogue controls when surfaces are empty', function() {
    $handler = function(RegisterExtensionsEvent $event): void {
        $event->extensions[] = \Tests\Support\Types\SilentHelper::class;
    };
    Event::on(Extensions::class, Extensions::EVENT_REGISTER_EXTENSIONS, $handler);
    $service = Vizy::$plugin->getExtensions();
    $service->reset();
    try {
        $definition = $service->getDefinition('extension', 'silentHelper');
        expect($definition['controlId'])->toBeNull()
            ->and($definition['surfaces'])->toBe([]);

        $enabled = $service->resolveEnabled([], [], ['silentHelper']);
        expect($enabled['extensions'])->toContain('silentHelper')
            ->and($enabled['modules'])->toContain('acme/extension/silentHelper');

        expect(array_column(EditorConfigPresentation::toolbarCatalog(), 'id'))
            ->not->toContain('silentHelper');
    } finally {
        Event::off(Extensions::class, Extensions::EVENT_REGISTER_EXTENSIONS, $handler);
        $service->reset();
    }
});

it('refuses unlisted vizy/core module IDs so typos cannot claim a missing core factory', function() {
    $handler = function(RegisterExtensionsEvent $event): void {
        $event->marks[] = \Tests\Support\Types\FakeCoreMark::class;
    };
    Event::on(Extensions::class, Extensions::EVENT_REGISTER_EXTENSIONS, $handler);
    $service = new Extensions();
    try {
        $definition = $service->getDefinition('mark', 'fakeCore');
        expect($definition)->not->toBeNull()
            ->and($definition['installed'])->toBeFalse();
        expect(fn() => $service->resolveEnabled([], ['fakeCore']))
            ->toThrow(RuntimeException::class, 'unavailable');
    } finally {
        Event::off(Extensions::class, Extensions::EVENT_REGISTER_EXTENSIONS, $handler);
    }
});

it('round-trips named configs through Project Config and preserves only baseline unknown references', function() {
    $service = Vizy::$plugin->getEditorConfigs();
    $service->removeConfig('test');
    $id = 'test' . strtolower(StringHelper::randomString(8));
    $config = [
        'label' => 'Focused',
        'capabilities' => ['nodes' => ['paragraph', 'bulletList'], 'marks' => ['bold']],
        'headings' => ['levels' => [2]],
    ];

    expect($service->saveConfig($id, $config))->toBeTrue();
    $loaded = $service->getConfig($id);
    expect($loaded['id'])->toBe($id)
        // The author ticked Bulleted list; List item and Paragraph are resolved in, so they
        // belong to the schema and not to the selection the edit screen posts back.
        ->and($loaded['schema']['nodes'])->toContain('listItem')
        ->and($loaded['capabilities']['nodes'])->toBe(['paragraph', 'bulletList'])
        ->and($loaded['capabilities']['nodes'])->not->toContain('listItem')
        ->and($loaded['toolbar'])->toBe(EditorConfigPresentation::defaultToolbar())
        ->and($loaded['bubble']['items'])->toContain('bold')
        ->and($loaded['hash'])->toHaveLength(64)
        ->and($service->getConfig(EditorConfigs::DEFAULT_ID))->not->toBeNull();

    $unknown = $config;
    $unknown['capabilities']['nodes'][] = 'removedProjectNode';
    expect(fn() => $service->saveConfig('new' . strtolower(StringHelper::randomString(8)), $unknown))
        ->toThrow(RuntimeException::class, 'Unknown');

    $normalize = new ReflectionMethod($service, '_normalize');
    $preserved = $normalize->invoke($service, $id, $unknown, $unknown);
    expect($preserved['diagnostics'][0])->toMatchArray([
        'code' => 'missingExtension',
        'kind' => 'node',
        'name' => 'removedProjectNode',
    ])->and($preserved['capabilities']['nodes'])->not->toContain('removedProjectNode');

    $service->removeConfig($id);
});

it('refuses a config that names capabilities under any other key', function() {
    // `capabilities` is the only spelling. Nothing has shipped under an older name, so an
    // unrecognised key is a typo worth reporting rather than something to quietly accept.
    $service = Vizy::$plugin->getEditorConfigs();
    $id = 'legacy' . strtolower(StringHelper::randomString(8));
    $normalize = new ReflectionMethod($service, '_normalize');

    expect(fn() => $normalize->invoke($service, $id, [
        'label' => 'Legacy',
        'vocabulary' => ['nodes' => ['bulletList'], 'marks' => ['bold']],
        'headings' => ['levels' => [2]],
    ], null))->toThrow(RuntimeException::class, 'Unknown Vizy Editor Config keys');
});

it('persists explicit toolbar and bubble presentation through Project Config', function() {
    $service = Vizy::$plugin->getEditorConfigs();
    $id = 'toolbar' . strtolower(StringHelper::randomString(8));
    $config = [
        'label' => 'Toolbar Test',
        'capabilities' => [
            'nodes' => ['paragraph', 'heading', 'horizontalRule'],
            'marks' => ['bold', 'italic', 'link'],
        ],
        'headings' => ['levels' => [2, 3]],
        'toolbar' => ['separator', 'bold', 'link', 'horizontalRule'],
        'bubble' => ['enabled' => true, 'items' => ['italic', 'link']],
    ];

    expect($service->saveConfig($id, $config))->toBeTrue();
    $loaded = $service->getConfig($id);
    expect($loaded['toolbar'])->toBe($config['toolbar'])
        ->and($loaded['bubble'])->toBe($config['bubble']);

    $field = new VizyField([
        'uid' => StringHelper::UUID(),
        'name' => 'Toolbar manifest',
        'handle' => 'toolbarManifest' . StringHelper::randomString(5),
        'editorConfig' => $id,
    ]);
    $manifest = Vizy::$plugin->getEditorManifests()->build($field);
    expect($manifest['toolbar']['controls'][1]['action'] ?? null)->toBe(['command' => 'toggleMark', 'markName' => 'bold'])
        ->and($manifest['bubble']['enabled'])->toBeTrue()
        ->and($manifest['bubble']['controls'][0]['action'] ?? null)->toBe(['command' => 'toggleMark', 'markName' => 'italic'])
        // Omitted flags default on for older configs.
        ->and($manifest['gutterInsert'])->toBeTrue()
        ->and($manifest['slashInsert'])->toBeTrue();

    $service->removeConfig($id);
});

it('persists gutter and slash insertion chrome flags on Editor Config and manifesto', function() {
    $service = Vizy::$plugin->getEditorConfigs();
    $id = 'insertchrome' . strtolower(StringHelper::randomString(8));
    $config = [
        'label' => 'Insert Chrome',
        'capabilities' => [
            'nodes' => ['paragraph'],
            'marks' => ['bold'],
        ],
        'headings' => ['levels' => [2]],
        'toolbar' => ['bold', 'addBlock'],
        'bubble' => ['enabled' => false, 'items' => []],
        'gutterInsert' => false,
        'slashInsert' => false,
    ];

    expect($service->saveConfig($id, $config))->toBeTrue();
    $loaded = $service->getConfig($id);
    expect($loaded['gutterInsert'])->toBeFalse()
        ->and($loaded['slashInsert'])->toBeFalse();

    $field = new VizyField([
        'uid' => StringHelper::UUID(),
        'name' => 'Insert chrome',
        'handle' => 'insertChrome' . StringHelper::randomString(5),
        'editorConfig' => $id,
    ]);
    $manifest = Vizy::$plugin->getEditorManifests()->build($field);
    expect($manifest['gutterInsert'])->toBeFalse()
        ->and($manifest['slashInsert'])->toBeFalse();

    $service->removeConfig($id);
});

it('renders toolbar and bubble controls as icons, and a dropdown as its registration', function() {
    $service = Vizy::$plugin->getEditorConfigs();
    $id = 'icons' . strtolower(StringHelper::randomString(8));
    $service->saveConfig($id, [
        'label' => 'Icon Toolbar',
        'capabilities' => [
            'nodes' => ['heading', 'horizontalRule', 'blockquote'],
            'marks' => ['bold', 'italic', 'link'],
        ],
        'headings' => ['levels' => [2, 3]],
        'toolbar' => ['dropdown:formatting', 'separator', 'bold', 'horizontalRule'],
        'bubble' => ['enabled' => true, 'items' => ['bold', 'link']],
    ]);

    $field = new VizyField([
        'uid' => StringHelper::UUID(),
        'name' => 'Icon toolbar',
        'handle' => 'iconToolbar' . StringHelper::randomString(5),
        'editorConfig' => $id,
    ]);
    $manifest = Vizy::$plugin->getEditorManifests()->build($field);
    $controls = collect($manifest['toolbar']['controls'])->keyBy('id')->all();
    // Named exactly as the toolbar named it, so the client's open-menu state keys on the same
    // token. It was a hash of the contents once, which changed whenever a member did.
    $formatting = 'dropdown:formatting';

    // Every control except the separator carries a glyph, so the client never
    // has to fall back to a text label.
    expect($controls['bold']['icon'])->toStartWith('<svg')
        ->and($controls['horizontalRule']['icon'])->toStartWith('<svg')
        ->and($controls[$formatting]['icon'])->toStartWith('<svg')
        ->and($controls[$formatting]['label'])->toBe('Formatting')
        ->and($controls['separator']['icon'])->toBeNull()
        ->and($manifest['bubble']['controls'][0]['icon'])->toStartWith('<svg');

    // Paragraph, then the levels this config allows, then the enabled block transforms — all
    // resolved from the registration at build time. `codeBlock` is not an allowed capability so
    // it is dropped rather than refused: a dropdown renders less than it names.
    expect(array_column($controls[$formatting]['items'], 'id'))
        ->toBe(['paragraph', 'heading2', 'heading3', 'blockquote']);

    // The trigger keeps the registered glyph; current value is shown inside the open menu.
    expect($controls[$formatting])->not->toHaveKey('reflectsValue');

    $service->removeConfig($id);
});

it('resolves a dropdown’s contents from its registration, minus this config’s trim', function() {
    // A placed dropdown is an ID and nothing else. It was `{dropdown, items}` while an author
    // could compose the contents, and `{label, icon, items}` before that — and both meant the
    // same dropdown could hold anything at all in two configs, under the same name.
    //
    // What a config may now say is narrower and is the whole of the feature: a dropdown holds a
    // registered roster, and a config can leave members out of it and reorder the rest. So a
    // trim is always recognisable as the menu it trimmed, which is what makes it safe to keep
    // resolving labels and glyphs from the registration.
    $align = EditorConfigPresentation::controlFor('dropdown:alignment', [], []);
    expect(array_column($align['items'], 'id'))
        ->toBe(['alignLeft', 'alignCenter', 'alignRight', 'alignJustify']);

    // Formatting holds all six levels, and which of them render is the Content schema's answer,
    // applied here rather than baked into the roster. So a menu holding "the headings" follows
    // the levels without anything about the dropdown being rewritten.
    $headings = fn(array $levels) => array_column(
        EditorConfigPresentation::controlFor('dropdown:formatting', [], ['heading'], $levels)['items'],
        'id',
    );
    expect($headings([3, 5]))->toBe(['paragraph', 'heading3', 'heading5'])
        ->and($headings([2]))->toBe(['paragraph', 'heading2']);

    // A stored membership goes through the same gate, so a config that trims Formatting does not
    // incidentally freeze which of the levels it holds are offered. Naming all six is what makes
    // that safe: there is no seventh level for a stored list to be missing.
    $trimmed = fn(array $levels) => array_column(EditorConfigPresentation::controlFor(
        'dropdown:formatting',
        [],
        ['heading', 'blockquote'],
        $levels,
        ['formatting' => ['blockquote', 'heading1', 'heading2', 'heading3', 'heading4', 'heading5', 'heading6']],
    )['items'], 'id');
    expect($trimmed([2, 4]))->toBe(['blockquote', 'heading2', 'heading4'])
        ->and($trimmed([2, 4, 6]))->toBe(['blockquote', 'heading2', 'heading4', 'heading6']);

    // The palette advertises them as dropdowns, prefixed as they are stored and kept out of the
    // button catalog entirely — a `table` dropdown and a `table` button would otherwise be one
    // token. `members` comes with them, as concrete button IDs, because the roster panel draws
    // the whole set a dropdown may hold and marks this config's trimmings as left out.
    $dropdowns = collect(EditorConfigPresentation::dropdownCatalog())->keyBy('id')->all();
    // In palette order rather than registration order, these being offered in the same row as the
    // buttons — see the sequencing test below.
    expect(array_keys($dropdowns))->toBe([
        'dropdown:formatting', 'dropdown:alignment', 'dropdown:table',
    ])
        ->and($dropdowns['dropdown:formatting']['kind'])->toBe('dropdown')
        ->and($dropdowns['dropdown:formatting']['members'])->toBe([
            'paragraph',
            'heading1', 'heading2', 'heading3', 'heading4', 'heading5', 'heading6',
            'blockquote', 'codeBlock',
        ])
        ->and(array_column(EditorConfigPresentation::toolbarCatalog(), 'id'))
        ->not->toContain('dropdown:formatting');

    // The roster is the vocabulary a stored membership is checked against, and it is also what a
    // config that has never touched a dropdown gets. The registry's `headingLevels` shorthand is
    // expanded to all six here and does not travel any further than this.
    expect(EditorConfigPresentation::dropdownRoster('formatting'))->toBe([
        'paragraph',
        'heading1', 'heading2', 'heading3', 'heading4', 'heading5', 'heading6',
        'blockquote', 'codeBlock',
    ])
        ->and(EditorConfigPresentation::dropdownRoster('nosuch'))->toBeNull();
});

it('follows a dropdown rename rather than losing the dropdown', function() {
    // `align` became `alignment` so its name and its label agree. From a stored toolbar a rename
    // is indistinguishable from the plugin that registered it being uninstalled, and the answer
    // to that is to drop the dropdown — so without an alias the rename would quietly delete
    // Alignment from every config that had placed it.
    $control = EditorConfigPresentation::controlFor('dropdown:align', ['textAlign'], []);
    expect($control['label'])->toBe('Alignment')
        ->and(EditorConfigPresentation::dropdownRoster('align'))
        ->toBe(EditorConfigPresentation::dropdownRoster('alignment'));

    // Only for renames. Headings was *retired* — its job is a trim of Formatting now — and
    // turning one into the other would be a change of meaning wearing a rename's clothes.
    expect(EditorConfigPresentation::dropdownRoster('headings'))->toBeNull();
});

it('drops a dropdown naming a registration that does not exist', function() {
    $service = Vizy::$plugin->getEditorConfigs();
    $id = 'ghost' . strtolower(StringHelper::randomString(8));

    // A plugin that registered a dropdown and was then uninstalled, or the shape a toolbar was
    // saved in before dropdowns were registered at all. Dropped like a retired token, because
    // there is nothing to render it as and no honest way to guess what was meant — and an
    // unopenable settings screen is a worse answer than a toolbar an author can refill.
    $service->saveConfig($id, [
        'label' => 'Ghost Dropdown',
        'capabilities' => ['nodes' => ['bulletList'], 'marks' => ['bold']],
        'headings' => ['levels' => []],
        'toolbar' => [
            'bold',
            'dropdown:nothingRegisteredHere',
            // Both authored shapes, from before the contents were frozen.
            ['dropdown' => 'lists', 'items' => ['bulletList']],
            ['label' => 'Authored', 'items' => ['bulletList']],
        ],
        'bubble' => ['enabled' => false, 'items' => []],
    ]);

    expect($service->getConfig($id)['toolbar'])->toBe(['bold']);

    $service->removeConfig($id);
});

it('retires the `more` overflow token without rejecting configs that still name it', function() {
    $service = Vizy::$plugin->getEditorConfigs();
    $id = 'more' . strtolower(StringHelper::randomString(8));

    // Refusing to load would brick an existing install over a token that never
    // carried meaning, so it is cleaned on the way through instead.
    $service->saveConfig($id, [
        'label' => 'Legacy Overflow',
        'capabilities' => ['nodes' => [], 'marks' => ['bold', 'italic']],
        'headings' => ['levels' => [2]],
        'toolbar' => ['bold', 'more', 'italic'],
        'bubble' => ['enabled' => true, 'items' => ['bold']],
    ]);

    expect($service->getConfig($id)['toolbar'])->toBe(['bold', 'italic'])
        ->and(EditorConfigPresentation::defaultToolbar())->not->toContain('more')
        ->and(EditorConfigPresentation::TOOLBAR_PRESENTATION_IDS)->not->toContain('more')
        ->and(array_column(EditorConfigPresentation::toolbarCatalog(), 'id'))->not->toContain('more');

    $service->removeConfig($id);
});

it('places a dropdown as one ID, and drops every shape that carried contents', function() {
    $service = Vizy::$plugin->getEditorConfigs();
    $id = 'grouped' . strtolower(StringHelper::randomString(8));

    $service->saveConfig($id, [
        'label' => 'Grouped',
        'capabilities' => [
            'nodes' => ['bulletList', 'orderedList', 'heading'],
            'marks' => ['bold'],
        ],
        'headings' => ['levels' => [2]],
        'toolbar' => ['bold', 'dropdown:formatting'],
        'bubble' => ['enabled' => false, 'items' => []],
    ]);

    // A flat list of IDs. There is no interior to validate, so the nesting rule, the
    // duplicate-member check, the refusal of a separator inside a menu and the refusal to save
    // an emptied one all went with the contents becoming fixed.
    expect($service->getConfig($id)['toolbar'])->toBe(['bold', 'dropdown:formatting']);

    $field = new VizyField([
        'uid' => StringHelper::UUID(),
        'name' => 'Grouped toolbar',
        'handle' => 'groupedToolbar' . StringHelper::randomString(5),
        'editorConfig' => $id,
    ]);
    $group = Vizy::$plugin->getEditorManifests()->build($field)['toolbar']['controls'][1];

    expect($group['kind'])->toBe('group')
        ->and($group['label'])->toBe('Formatting')
        ->and($group['icon'])->toStartWith('<svg')
        ->and(array_column($group['items'], 'id'))->toBe(['paragraph', 'heading2'])
        // Each member carries the action it would have carried as a button, back when it could
        // be one — a menu row is a control, not a label.
        ->and($group['items'][1]['action'])->toBe(['command' => 'setHeading', 'level' => 2]);

    $service->removeConfig($id);
});

it('keeps buttons whose capability is switched off, and simply does not render them', function() {
    $service = Vizy::$plugin->getEditorConfigs();
    $id = 'uncapable' . strtolower(StringHelper::randomString(8));

    // This used to be refused outright, on both the button and the dropdown member. The
    // toolbar and the capabilities are edited independently, so a mismatch is a normal
    // in-between state rather than a broken config — the editor renders what it can.
    $service->saveConfig($id, [
        'label' => 'Half Allowed',
        'capabilities' => ['nodes' => ['bulletList'], 'marks' => ['bold']],
        'headings' => ['levels' => []],
        'toolbar' => ['bold', 'image', 'bulletList', 'dropdown:align'],
        'bubble' => ['enabled' => true, 'items' => ['bold', 'underline']],
    ]);

    // Stored exactly as authored: nothing was pruned on the way in or out.
    expect($service->getConfig($id)['toolbar'][1])->toBe('image')
        ->and($service->getConfig($id)['bubble']['items'])->toBe(['bold', 'underline']);

    $field = new VizyField([
        'uid' => StringHelper::UUID(),
        'name' => 'Half allowed',
        'handle' => 'halfAllowed' . StringHelper::randomString(5),
        'editorConfig' => $id,
    ]);
    $manifest = Vizy::$plugin->getEditorManifests()->build($field);

    // Image is gone, the allowed list type stays, and Alignment — whose members are all actions
    // that stand for no capability — is unaffected. A dropdown left with nothing to offer would
    // be dropped rather than rendered as a trigger onto nothing.
    // `dropdown:align` was authored above and comes back as `dropdown:alignment`, the rename
    // being followed rather than treated as the dropdown having gone away.
    expect(array_column($manifest['toolbar']['controls'], 'id'))
        ->toBe(['bold', 'bulletList', 'dropdown:alignment'])
        // Bubble control IDs are namespaced, so the two menus' open state cannot collide.
        ->and(array_column($manifest['bubble']['controls'], 'id'))->toBe(['bubble:bold']);

    $service->removeConfig($id);
});

it('drops the bare Heading button while keeping the levelled ones', function() {
    $service = Vizy::$plugin->getEditorConfigs();
    $id = 'levels' . strtolower(StringHelper::randomString(8));

    // Headings used to be three things at once: `heading1`–`heading6` as loose buttons, a bare
    // `heading` button applying whatever a "Default level" setting said, and inside a dropdown
    // that same `heading` standing for every configured level. The bare button is what had to go
    // first: one button standing for six, with a second setting deciding which.
    //
    // The loose levelled buttons have since gone the same way, for a different reason — Formatting
    // owns them, and a control is offered once. So a levelled ID is dropped from a stored toolbar
    // now too, and `heading4` here is standing in for a Vizy 3 config that placed one.
    //
    // `heading` and `defaultLevel` are dropped on the way through, as `more` is, rather than
    // refusing to load a config that still carries them.
    $service->saveConfig($id, [
        'label' => 'Levels',
        'capabilities' => ['nodes' => ['heading'], 'marks' => []],
        'headings' => ['levels' => [3, 4], 'defaultLevel' => 4],
        'toolbar' => ['dropdown:formatting', 'heading', 'heading4'],
        'bubble' => ['enabled' => false, 'items' => []],
    ]);

    $loaded = $service->getConfig($id);
    expect($loaded['headings'])->toBe(['levels' => [3, 4]])
        ->and($loaded['toolbar'])->toBe(['dropdown:formatting']);

    $field = new VizyField([
        'uid' => StringHelper::UUID(),
        'name' => 'Level toolbar',
        'handle' => 'levelToolbar' . StringHelper::randomString(5),
        'editorConfig' => $id,
    ]);
    $controls = Vizy::$plugin->getEditorManifests()->build($field)['toolbar']['controls'];

    // No stored membership here, so the dropdown holds what its registration says, resolved
    // against the levels now rather than when it was placed — change the allowed levels and what
    // is in it changes, with nobody editing a toolbar.
    expect(array_column($controls[0]['items'], 'id'))->toBe(['paragraph', 'heading3', 'heading4'])
        ->and($controls[0]['items'][2]['action'])->toBe(['command' => 'setHeading', 'level' => 4]);

    // A level still resolves as a control, since a menu row is one — it is only the *toolbar*
    // that may not name it. The bare `heading` token stays retired outright: it applied whichever
    // level a "Default level" setting named, and made headings two things at once.
    expect(EditorConfigPresentation::controlFor('heading4', [], ['heading'], [3, 4]))->not->toBeNull()
        ->and(EditorConfigPresentation::controlFor('heading', [], ['heading'], [3, 4]))->toBeNull()
        ->and(EditorConfigPresentation::isMemberOnlyToolbarId('heading4'))->toBeTrue()
        ->and(EditorConfigPresentation::isMemberOnlyToolbarId('heading'))->toBeFalse();

    $service->removeConfig($id);
});

it('resolves Paragraph without a capability, and offers it as a button too', function() {
    // Prose always permits a paragraph, so it has no checkbox and needs no capability to
    // resolve — which is the point of special-casing it.
    expect(EditorConfigPresentation::controlFor('paragraph', [], []))
        ->toMatchArray(['id' => 'paragraph', 'action' => ['command' => 'setParagraph']]);

    // Offered in the palette as well as being a member of Formatting and Headings. Kept out
    // while the dropdowns owned their contents, and the cost showed here first: Paragraph ships
    // inside Formatting, so a toolbar with Formatting on it had no Paragraph button available —
    // including to put back into the very menu it had been taken out of.
    expect(array_column(EditorConfigPresentation::toolbarCatalog(), 'id'))->toContain('paragraph');
});

it('tells the builder how a block type previews, so a dropdown can be drawn as a menu', function() {
    // The Editor Config builder draws a selected dropdown as the menu it will be — the editor's
    // own `.dropdown`, rows and all — and styles each row by this token: 20px semibold for an H2,
    // italic for a quote, mono for code. It comes from the catalog because that is what the
    // builder has; the editor gets the same token from `controlFor`, which is what keeps the
    // preview honest.
    $catalog = collect(EditorConfigPresentation::toolbarCatalog())->keyBy('id');

    foreach (['paragraph', 'blockquote', 'codeBlock'] as $id) {
        expect($catalog->get($id)['preview'] ?? null)->toBe($id, "{$id} has no preview token");
        expect(EditorConfigPresentation::controlFor($id, [], [$id])['preview'] ?? null)->toBe($id);
    }

    // Only the block types. A mark has no shape a menu row could preview, and an action is not a
    // style at all — a row for one is its name, and styling it as anything would be a lie.
    expect($catalog->get('bold'))->not->toHaveKey('preview');
    expect($catalog->get('undo'))->not->toHaveKey('preview');
});

it('offers the table operations, gated on the one capability an action can need', function() {
    // Vizy 3's Table dropdown, whose members were operations rather than capabilities: there
    // is no such thing as allowing "delete row". They are actions like undo and alignment, with
    // one difference that matters — their commands arrive with the Table extension, so without
    // the capability there is nothing to run and the button would be dead rather than useless.
    $catalog = collect(EditorConfigPresentation::toolbarCatalog())->keyBy('id');
    $operations = [
        'tableAddRowBefore', 'tableAddRowAfter', 'tableDeleteRow',
        'tableAddColumnBefore', 'tableAddColumnAfter', 'tableDeleteColumn',
        'tableMergeCells', 'tableSplitCell',
        'tableToggleHeaderRow', 'tableToggleHeaderColumn', 'tableToggleHeaderCell',
        'tableDelete',
    ];

    // Placeable as loose buttons as well as being the Table dropdown's members. Twelve grid
    // variations is a lot of palette, and keeping them out of it was the reasonable-looking
    // version of the rule — until trimming a dropdown came back, at which point a table
    // operation dragged out of the Table menu had nowhere to come back from.
    foreach ($operations as $id) {
        expect($catalog->get($id))->not->toBeNull("{$id} is missing from the palette");

        $control = EditorConfigPresentation::controlFor($id, [], ['table']);
        expect($control)->not->toBeNull("{$id} does not resolve with Table enabled")
            ->and($control['icon'])->not->toBeNull("{$id} has no icon")
            // Gated the way a node button is, so nothing downstream has to know that an action
            // can be gated at all.
            ->and(EditorConfigPresentation::controlFor($id, [], []))
            ->toBeNull("{$id} resolves with Table disabled");
    }

    expect(EditorConfigPresentation::controlFor('tableMergeCells', [], ['table'])['action'])
        ->toBe(['command' => 'tableOperation', 'operation' => 'mergeCells']);

    // Menu member copy — not the dropdown trigger / capability name "Table".
    expect(EditorConfigPresentation::controlFor('table', [], ['table'])['label'])->toBe('Insert table')
        ->and($catalog->get('table')['label'])->toBe('Insert table');
});

it('lets a config say what a dropdown holds, without letting it own the roster', function() {
    // Vizy 3's `"formatting": ["h2", "h3", "p"]`, which was the one want the capability
    // checkboxes could not cover: fewer ways to apply a content type the editor should still
    // allow. Taking it away also cost every V3 JSON config its meaning.
    $service = Vizy::$plugin->getEditorConfigs();
    $id = 'members' . strtolower(StringHelper::randomString(8));

    expect($service->saveConfig($id, [
        'label' => 'Trimmed Formatting',
        'capabilities' => ['nodes' => ['heading', 'blockquote', 'codeBlock'], 'marks' => ['bold']],
        'headings' => ['levels' => [2, 3]],
        'toolbar' => ['dropdown:formatting', 'bold'],
        'dropdowns' => ['formatting' => ['paragraph', 'heading2', 'heading3']],
        'bubble' => ['enabled' => false, 'items' => []],
    ]))->toBeTrue();

    $field = new VizyField([
        'uid' => StringHelper::UUID(),
        'name' => 'Trimmed',
        'handle' => 'trimmed' . StringHelper::randomString(5),
        'editorConfig' => $id,
    ]);
    $manifests = Vizy::$plugin->getEditorManifests();
    $manifests->invalidate();
    $controls = $manifests->build($field)['toolbar']['controls'];

    expect(array_column($controls[0]['items'], 'id'))->toBe(['paragraph', 'heading2', 'heading3']);

    // The capabilities still prune what a config disallows, so membership can only ever render
    // less than it names. Both levers point the same way and neither can contradict the other.
    $service->saveConfig($id, [
        'label' => 'Trimmed Formatting',
        'capabilities' => ['nodes' => ['blockquote'], 'marks' => ['bold']],
        'headings' => ['levels' => []],
        'toolbar' => ['dropdown:formatting', 'bold'],
        'dropdowns' => ['formatting' => ['paragraph', 'heading2', 'heading3']],
        'bubble' => ['enabled' => false, 'items' => []],
    ]);
    $manifests->invalidate();
    expect(array_column($manifests->build($field)['toolbar']['controls'][0]['items'], 'id'))
        ->toBe(['paragraph']);

    $service->removeConfig($id);
});

it('keeps a dropdown following its registration until a config says otherwise', function() {
    $service = Vizy::$plugin->getEditorConfigs();
    $normalize = new ReflectionMethod($service, '_normalize');
    $normalized = fn(array $config) => $normalize->invoke($service, 'rosters', $config + [
        'label' => 'Rosters',
        'capabilities' => ['nodes' => ['heading'], 'marks' => []],
        'headings' => ['levels' => [2]],
    ], null);

    // Absent is not empty. Nothing stored means "whatever this dropdown ships with", which is
    // what keeps a hand-written config working and what lets an untouched dropdown pick up a
    // member a later release adds to it.
    expect($normalized(['toolbar' => ['dropdown:formatting']])['dropdowns'])->toBe([]);
    expect(array_column(
        EditorConfigPresentation::controlFor('dropdown:formatting', [], ['heading'], [2])['items'],
        'id',
    ))->toBe(['paragraph', 'heading2']);

    // Membership belongs to the placed dropdown, so membership for one the toolbar does not
    // place is dropped — which is what makes removing a dropdown and dragging it back a reset.
    expect($normalized([
        'toolbar' => ['bold'],
        'dropdowns' => ['formatting' => ['paragraph']],
    ])['dropdowns'])->toBe([]);

    // As is a dropdown whose registration went away with its plugin. Dropped rather than
    // refused, like the toolbar token for the same dropdown.
    expect($normalized([
        'toolbar' => ['dropdown:nosuch'],
        'dropdowns' => ['nosuch' => ['paragraph']],
    ])['dropdowns'])->toBe([]);

    // An explicitly emptied dropdown is refused, though: it is a trigger that opens onto
    // nothing, and the way to get rid of a dropdown is to take it out of the toolbar. The
    // builder holds the last member back, so nothing has ever stored one.
    expect(fn() => $normalized([
        'toolbar' => ['dropdown:formatting'],
        'dropdowns' => ['formatting' => []],
    ]))->toThrow(RuntimeException::class, 'must hold at least one member');

    // And a menu cannot hold a menu, however a config came to name one.
    expect(array_column(
        EditorConfigPresentation::controlFor(
            'dropdown:formatting',
            [],
            ['heading'],
            [2],
            ['formatting' => ['dropdown:lists', 'paragraph']],
        )['items'],
        'id',
    ))->toBe(['paragraph']);
});

it('lets a config subtract from a dropdown’s roster and reorder it, but not add to it', function() {
    $service = Vizy::$plugin->getEditorConfigs();
    $normalize = new ReflectionMethod($service, '_normalize');
    $normalized = fn(array $config) => $normalize->invoke($service, 'trims', $config + [
        'label' => 'Trims',
        'capabilities' => ['nodes' => ['heading', 'blockquote', 'codeBlock'], 'marks' => ['bold']],
        'headings' => ['levels' => [2, 3]],
    ], null)['dropdowns'];

    // Vizy 3's `"formatting": ["h2", "h3", "p"]`, in Vizy 4's vocabulary: a subset in the
    // author's order. Order is stored because a config that has bothered to reorder a menu has
    // said something, and there is nowhere else to say it.
    expect($normalized([
        'toolbar' => ['dropdown:formatting'],
        'dropdowns' => ['formatting' => ['heading2', 'heading3', 'paragraph']],
    ]))->toBe(['formatting' => ['heading2', 'heading3', 'paragraph']]);

    // Adding is not a thing a config may do. What a dropdown *may* hold is a design decision
    // belonging to whoever registered it — nobody wants a fifth item in a menu of four
    // alignments — so anything outside the roster is dropped rather than refused, the same as
    // an unknown button in the strip.
    expect($normalized([
        'toolbar' => ['dropdown:alignment'],
        'dropdowns' => ['alignment' => ['alignLeft', 'bold', 'underline']],
    ]))->toBe(['alignment' => ['alignLeft']]);

    // A membership naming nothing in the roster is not an author emptying a dropdown, so it
    // falls back to the registration rather than being refused as an empty one would be.
    expect($normalized([
        'toolbar' => ['dropdown:alignment'],
        'dropdowns' => ['alignment' => ['bold']],
    ]))->toBe([]);

    // The rename is followed here too, or a stored `align` membership would look like membership
    // for a dropdown this toolbar does not place — the toolbar having already been aliased.
    expect($normalized([
        'toolbar' => ['dropdown:align'],
        'dropdowns' => ['align' => ['alignLeft', 'alignCenter']],
    ]))->toBe(['alignment' => ['alignLeft', 'alignCenter']]);

    // And the registry's shorthand, which a hand-written config may well have copied from a
    // registration and which one build stored. Expanded in place rather than dropped, so the
    // order the author arranged survives — Paragraph stays last here.
    expect($normalized([
        'toolbar' => ['dropdown:formatting'],
        'dropdowns' => ['formatting' => ['headingLevels', 'paragraph']],
    ]))->toBe(['formatting' => [
        'heading1', 'heading2', 'heading3', 'heading4', 'heading5', 'heading6', 'paragraph',
    ]]);
});

it('ships Table and Alignment as registered dropdowns', function() {
    // Table is Vizy 3's; Alignment is not, and exists because four buttons is a lot of toolbar
    // to spend on one decision. The registration decides what a dropdown is called and what is
    // in it, and that is the end of it.
    $registry = Vizy::$plugin->getExtensions();
    $members = fn(string $name) => array_column(
        EditorConfigPresentation::controlFor("dropdown:{$name}", [], ['table'])['items'],
        'id',
    );

    expect($registry->getToolbarDropdown('table')['label'])->toBe('Table')
        // Insert leads, being the one operation that does not need a table already there.
        ->and($members('table')[0])->toBe('table')
        ->and($members('table'))->toContain('tableToggleHeaderRow')
        ->and($members('table'))->toHaveCount(13);

    expect($registry->getToolbarDropdown('alignment')['label'])->toBe('Alignment')
        ->and($members('alignment'))->toBe(['alignLeft', 'alignCenter', 'alignRight', 'alignJustify']);
});

it('registers dropdowns through an event, which is the only way to add one', function() {
    // Authoring them in the editor was tried and dropped: it put a label field and a glyph
    // picker in front of every author to serve the few who wanted a menu of their own, on a
    // screen whose job is laying out a toolbar. Extending the set is a developer act now, as
    // registering a custom button already was, so both arrive the same way.
    //
    // What it is no longer the answer to is "a Formatting without Blockquote". Registering a
    // second dropdown to serve that was the answer for a while, and it was a bad one: it put an
    // event in front of a thing an author should be able to drag, and it invented a name for
    // something that already had one. A config trims its own copy instead. See `dropdowns`.
    $registry = Vizy::$plugin->getExtensions();

    $handler = static function($event): void {
        $event->dropdowns[] = [
            'name' => 'testOnly',
            'label' => 'Test Only',
            'members' => ['bold'],
        ];
    };
    $registry->on(Extensions::EVENT_REGISTER_TOOLBAR_DROPDOWNS, $handler);
    $registry->reset();

    try {
        $registered = collect(EditorConfigPresentation::dropdownCatalog())
            ->firstWhere('id', 'dropdown:testOnly');

        expect($registered)->toMatchArray([
            // Prefixed as it will be stored, so a registration cannot collide with a button.
            'id' => 'dropdown:testOnly',
            'label' => 'Test Only',
            'kind' => 'dropdown',
            'group' => 'Dropdowns',
            // No glyph registered, so it wears the caret that stands for a menu.
            'icon' => ToolbarIcons::svgFor('dropdown'),
            // The roster it starts with, which a config may then trim.
            'members' => ['bold'],
        ]);

        // A plugin's dropdown has no place in a sequence that predates it, so it sorts after
        // everything `PALETTE_ORDER` names rather than being guessed at a position.
        $named = array_column(EditorConfigPresentation::dropdownCatalog(), 'paletteRank', 'id');
        expect($named['dropdown:testOnly'])->toBeGreaterThan($named['dropdown:table']);

        expect(array_column(
            EditorConfigPresentation::controlFor('dropdown:testOnly', ['bold'], [])['items'],
            'id',
        ))->toBe(['bold']);
    } finally {
        $registry->off(Extensions::EVENT_REGISTER_TOOLBAR_DROPDOWNS, $handler);
        $registry->reset();
    }

    expect(collect(EditorConfigPresentation::dropdownCatalog())->pluck('id'))
        ->not->toContain('dropdown:testOnly');
});

it('refuses a registered dropdown it could not draw a trigger for', function() {
    $registry = Vizy::$plugin->getExtensions();

    foreach ([
        'no label' => [['name' => 'noLabel', 'members' => ['bold']], 'must have a label'],
        'no members' => [['name' => 'noMembers', 'label' => 'Empty', 'members' => []], 'at least one member'],
        'bad name' => [['name' => 'not a name', 'label' => 'Odd', 'members' => ['bold']], 'Invalid'],
    ] as [$dropdown, $expected]) {
        $handler = static function($event) use ($dropdown): void {
            $event->dropdowns[] = $dropdown;
        };
        $registry->on(Extensions::EVENT_REGISTER_TOOLBAR_DROPDOWNS, $handler);
        $registry->reset();

        try {
            expect(fn() => $registry->getToolbarDropdowns())->toThrow(RuntimeException::class, $expected);
        } finally {
            $registry->off(Extensions::EVENT_REGISTER_TOOLBAR_DROPDOWNS, $handler);
            $registry->reset();
        }
    }
});

it('offers a line break, which no capability can be found under', function() {
    // Vizy 3's `line-break`. The node has always been installed and the client extension
    // always loaded, but it is always enabled and so has no checkbox — and the palette is
    // assembled from the capabilities, so it had nothing to be listed under and was missing.
    $lineBreak = collect(EditorConfigPresentation::toolbarCatalog())->firstWhere('id', 'hardBreak');

    expect($lineBreak)->not->toBeNull()
        ->and($lineBreak['kind'])->toBe('node')
        ->and($lineBreak['icon'])->not->toBeNull()
        // No capability keys, or the builder would look for one and hide the button.
        ->and($lineBreak)->not->toHaveKey('capabilityName');

    // Resolved with nothing allowed, like Paragraph.
    expect(EditorConfigPresentation::controlFor('hardBreak', [], []))
        ->toMatchArray(['id' => 'hardBreak', 'action' => ['command' => 'insertNode', 'nodeName' => 'hardBreak']]);
});

it('keeps Text style a capability without offering a button for it', function() {
    // It carries a colour or a font rather than toggling, so there is no state for a button
    // to switch and Vizy 3 offered none. It reached both palettes because they are built from
    // what a config may legally enable — so ticking Text style drew an inert button.
    expect(collect(EditorConfigPresentation::toolbarCatalog())->firstWhere('id', 'textStyle'))->toBeNull();
    expect(collect(EditorConfigPresentation::bubbleCatalog())->firstWhere('id', 'textStyle'))->toBeNull();
    // Refused as a control even where a stored toolbar names it, and even with the capability
    // enabled — which is the case that used to produce the button.
    expect(EditorConfigPresentation::controlFor('textStyle', ['textStyle'], []))->toBeNull();

    // Still a capability: it is what other features hang their attributes on.
    $marks = collect(EditorConfigPresentation::capabilityCatalog()['marks'] ?? [])->pluck('value');
    expect($marks)->toContain('textStyle');
});

it('offers the actions that stand for no capability at all', function() {
    // Undo, alignment and clearing formatting act on the selection. Vizy 3 had all of them
    // and the first cut of this builder had none: they fell through a palette assembled
    // entirely out of the registry, which knows only nodes and marks.
    $catalog = collect(EditorConfigPresentation::toolbarCatalog())->keyBy('id');

    foreach (['undo', 'redo', 'clearFormatting', 'addBlock'] as $id) {
        expect($catalog->get($id))->not->toBeNull("{$id} is missing from the palette")
            ->and($catalog->get($id)['kind'])->toBe('action')
            // An action with no glyph would render as its full name in a 36px box.
            ->and($catalog->get($id)['icon'])->not->toBeNull("{$id} has no icon");
    }

    // The four alignments are both: the Alignment dropdown's members, and buttons of their own,
    // as Vizy 3 offered them. Every member of that dropdown is a member, so while the palette
    // withheld them, emptying Alignment was a thing that could not be undone.
    foreach (['alignLeft', 'alignCenter', 'alignRight', 'alignJustify'] as $id) {
        expect($catalog->get($id))->not->toBeNull("{$id} is missing from the palette")
            ->and(EditorConfigPresentation::controlFor($id, [], [])['icon'])
            ->not->toBeNull("{$id} has no icon");
    }

    // Resolved with nothing whatsoever allowed, which is the whole point of the kind.
    expect(EditorConfigPresentation::controlFor('undo', [], []))
        ->toMatchArray(['id' => 'undo', 'kind' => 'action', 'action' => ['command' => 'undo']]);
    expect(EditorConfigPresentation::controlFor('alignCenter', [], [])['action'])
        ->toBe(['command' => 'setTextAlign', 'align' => 'center']);
    expect(EditorConfigPresentation::controlFor('clearFormatting', [], [])['action'])
        ->toBe(['command' => 'clearFormatting']);
    expect(EditorConfigPresentation::controlFor('addBlock', [], [])['action'])
        ->toBe(['command' => 'openAddBlock']);
    expect(EditorConfigPresentation::defaultToolbar())->toContain('addBlock');
    expect(EditorConfigPresentation::defaultToolbar())->not->toContain('separator');
});

it('resolves a heading level as a button a toolbar may also name', function() {
    // Six of them, as Vizy 3 drew them, and the whole of what the Headings dropdown is made of.
    // Vizy 3 drew its own H1-H6 rather than taking them from an icon set, which is why all six
    // have a glyph; the short text stand-in stays as the fallback.
    for ($level = 1; $level <= 6; $level++) {
        $control = EditorConfigPresentation::controlFor("heading{$level}", [], ['heading'], [$level]);

        expect($control)->not->toBeNull()
            ->and($control['abbr'])->toBe("H{$level}")
            ->and($control['icon'])->toStartWith('<svg')
            ->and($control['action'])->toBe(['command' => 'setHeading', 'level' => $level]);

        // Placeable on its own as well, so a toolbar can carry H2 directly, and a level dragged
        // out of Headings has somewhere to come back from. The palette gates each on the
        // config's levels, which `capabilityName` alone cannot express — see the builder's
        // `headingLevel`.
        expect(array_column(EditorConfigPresentation::toolbarCatalog(), 'id'))->toContain("heading{$level}");
        expect(collect(EditorConfigPresentation::toolbarCatalog())->firstWhere('id', "heading{$level}"))
            ->toMatchArray([
                'headingLevel' => $level,
                'capabilityName' => 'heading',
                'abbr' => "H{$level}",
                // The same token the control carries, because the builder draws a selected
                // dropdown as a real menu and styles each row by it. Without it every row in a
                // Formatting menu would be the same size, which is the one thing an author
                // trimming that menu is choosing between.
                'preview' => "heading{$level}",
            ]);
        expect($control['preview'])->toBe("heading{$level}");
    }

    // Gated on the Heading capability and on the level being one of the configured ones, so a
    // dropdown simply holds fewer options rather than offering one that would render nothing.
    expect(EditorConfigPresentation::controlFor('heading5', [], ['heading'], [2, 3]))->toBeNull()
        ->and(EditorConfigPresentation::controlFor('heading2', [], [], [2]))->toBeNull();
});

it('retires whole-document HTML source and keeps iframe / mediaEmbed live', function() {
    // Schema-bound HTML source editing was declined — retire the toolbar token so migrated
    // configs drop it quietly. Iframe / Media embed remain ordinary capability-gated nodes.
    $catalog = collect(EditorConfigPresentation::toolbarCatalog())->keyBy('id');

    expect($catalog->has('html'))->toBeFalse()
        ->and(EditorConfigPresentation::isPendingToolbarId('html'))->toBeFalse()
        ->and(EditorConfigPresentation::isPendingToolbarId('iframe'))->toBeFalse()
        ->and(EditorConfigPresentation::isPendingToolbarId('mediaEmbed'))->toBeFalse()
        ->and(EditorConfigPresentation::RETIRED_TOOLBAR_IDS)->toContain('html')
        ->and(EditorConfigPresentation::RETIRED_TOOLBAR_IDS)->not->toContain('iframe', 'mediaEmbed')
        ->and(EditorConfigPresentation::controlFor('html', [], []))->toBeNull();

    expect(EditorConfigPresentation::controlFor('iframe', [], ['iframe']))
        ->toMatchArray(['id' => 'iframe', 'action' => ['command' => 'insertNode', 'nodeName' => 'iframe']])
        ->and(EditorConfigPresentation::controlFor('mediaEmbed', [], ['mediaEmbed']))
        ->toMatchArray(['id' => 'mediaEmbed', 'action' => ['command' => 'insertNode', 'nodeName' => 'mediaEmbed']]);

    $service = Vizy::$plugin->getEditorConfigs();
    $configId = 'retiredhtml' . strtolower(StringHelper::randomString(8));
    $service->saveConfig($configId, [
        'label' => 'Retired HTML',
        'capabilities' => ['nodes' => ['iframe', 'mediaEmbed'], 'marks' => ['bold']],
        'headings' => ['levels' => []],
        'toolbar' => ['bold', 'html', 'iframe', 'mediaEmbed'],
        'bubble' => ['enabled' => false, 'items' => []],
    ]);

    // Retired token stripped on save; embeds kept.
    expect($service->getConfig($configId)['toolbar'])->toBe(['bold', 'iframe', 'mediaEmbed']);

    $field = new VizyField([
        'uid' => StringHelper::UUID(),
        'name' => 'Retired HTML toolbar',
        'handle' => 'retiredHtml' . StringHelper::randomString(5),
        'editorConfig' => $configId,
    ]);

    $manifest = Vizy::$plugin->getEditorManifests()->build($field);
    expect(array_column($manifest['toolbar']['controls'], 'id'))
        ->toBe(['bold', 'iframe', 'mediaEmbed']);

    $service->removeConfig($configId);
});

it('catalogs a dropdown’s members without offering them as buttons', function() {
    // One form per family: a control is a button or a menu member, never both. So the members are
    // in the catalog — a menu row needs a label, a glyph and a preview token — and marked, so the
    // palette leaves them out. See `MEMBER_ONLY_IDS` for what offering both cost.
    $catalog = collect(EditorConfigPresentation::toolbarCatalog())->keyBy('id')->all();

    // The list this is really asserting is that `MEMBER_ONLY_IDS` says the same thing the
    // registrations do. It is written out by hand so a plugin registering a dropdown over `bold`
    // cannot take Bold out of everyone's palette, which leaves the two free to drift.
    $registered = [];
    foreach (Vizy::$plugin->getExtensions()->getToolbarDropdowns() as $definition) {
        foreach ($definition['members'] as $member) {
            $registered = [...$registered, ...($member === EditorConfigPresentation::HEADING_LEVELS_TOKEN
                ? EditorConfigPresentation::HEADING_LEVEL_IDS
                : [$member])];
        }
    }

    expect(array_values(array_unique($registered)))
        ->toEqualCanonicalizing(EditorConfigPresentation::MEMBER_ONLY_IDS);

    foreach (EditorConfigPresentation::MEMBER_ONLY_IDS as $id) {
        expect($catalog)->toHaveKey($id)
            ->and($catalog[$id]['memberOnly'])->toBeTrue();
    }

    // What belongs to no dropdown is offered as it always was, unmarked. The two list types are
    // the interesting ones: a Lists dropdown held them until it was found to fail the test a
    // family has to pass to be a menu, and they are buttons again — as in Vizy 3, TinyMCE and
    // Craft's own CKEditor builder.
    foreach (['bold', 'link', 'image', 'horizontalRule', 'hardBreak', 'undo', 'layout', 'separator',
        'bulletList', 'orderedList'] as $id) {
        expect($catalog)->toHaveKey($id)
            ->and($catalog[$id])->not->toHaveKey('memberOnly');
    }

    // A dropdown is still placed by its prefixed ID, and is still the only way to get a menu. In
    // palette order, these sharing a row with the buttons now — see the sequencing test below.
    expect(array_column(EditorConfigPresentation::dropdownCatalog(), 'id'))
        ->toBe(['dropdown:formatting', 'dropdown:alignment', 'dropdown:table']);
});

it('sequences the palette by what goes together, not by how it was assembled', function() {
    $ids = array_values(array_filter(
        array_column(EditorConfigPresentation::toolbarCatalog(), 'id'),
        fn(string $id) => !EditorConfigPresentation::isMemberOnlyToolbarId($id),
    ));
    $at = fn(string $id) => array_search($id, $ids, true);

    // The pair that prompted this: assembly order left the marks in registration order and the
    // nodes alphabetical, so Bulleted list and Numbered list sat four squares apart with Image
    // and Layout in between.
    expect($at('orderedList'))->toBe($at('bulletList') + 1);

    // The sequence the editors agree on, less the three steps that are dropdowns here: marks first
    // and in the order CKEditor, TinyMCE and Craft's CKEditor builder all use them, then Link,
    // then the lists, then what can be inserted.
    expect(array_slice($ids, 0, 9))
        ->toBe(['bold', 'italic', 'underline', 'strike', 'subscript', 'superscript', 'code', 'highlight', 'link'])
        ->and($at('bulletList'))->toBeGreaterThan($at('link'))
        ->and($at('image'))->toBeGreaterThan($at('orderedList'));

    // A separator is last whatever else is true: it is the one control that never runs out, so it
    // is not one of the things an author has yet to spend.
    expect(array_key_last($ids))->toBe($at('separator'));

    // Sequence only: nothing travels to say where one *group* ends and the next begins, the
    // grouping being expressed by what sits beside what. `paletteRank` is not that — it is the
    // position itself, and it travels because the palette is one row assembled from two catalogs,
    // so neither can be sequenced by its own order alone.
    expect(EditorConfigPresentation::toolbarCatalog())
        ->each(fn($item) => $item->not->toHaveKey('paletteCluster'));
});

it('sequences the dropdowns into the same row as the buttons, not after them', function() {
    // One palette, so one sequence across both catalogs. The dropdowns used to be a shelf of their
    // own in registration order, which meant the palette could state only the part of the agreed
    // order that happened to be buttons — Formatting belongs in front of Bold, and a buttons-only
    // sort can never say so.
    $rank = fn(array $items) => array_column($items, 'paletteRank', 'id');
    $buttons = $rank(EditorConfigPresentation::toolbarCatalog());
    $dropdowns = $rank(EditorConfigPresentation::dropdownCatalog());

    // Formatting opens the row, Alignment sits with the lists, and Table joins the things you
    // insert. See `PALETTE_ORDER`.
    expect($dropdowns['dropdown:formatting'])->toBeLessThan($buttons['bold'])
        ->and($dropdowns['dropdown:alignment'])->toBeGreaterThan($buttons['link'])
        ->and($dropdowns['dropdown:alignment'])->toBeLessThan($buttons['bulletList'])
        ->and($dropdowns['dropdown:table'])->toBeGreaterThan($buttons['layout'])
        ->and($dropdowns['dropdown:table'])->toBeLessThan($buttons['horizontalRule']);

    // Every rank distinct across the two, or a merge has no way to break the tie.
    $all = array_merge(array_values($buttons), array_values($dropdowns));
    expect(count(array_unique($all)))->toBe(count($all));

    // And the catalog itself comes out in that order, so a client that ignores the rank still
    // gets a sensible list rather than registration order.
    expect(array_keys($dropdowns))->toBe(['dropdown:formatting', 'dropdown:alignment', 'dropdown:table']);
});

it('rewrites Vizy 3 toolbar spellings then drops member-only controls', function() {
    $service = Vizy::$plugin->getEditorConfigs();
    $id = 'v3shim' . strtolower(StringHelper::randomString(8));

    $service->saveConfig($id, [
        'label' => 'V3 shim',
        'capabilities' => ['nodes' => ['heading', 'blockquote'], 'marks' => ['bold']],
        'headings' => ['levels' => [2, 3]],
        'toolbar' => [
            'bold', 'h2', 'p', 'align-left', 'bullet-list', 'dropdown:formatting',
        ],
        'dropdowns' => [
            'formatting' => ['h2', 'h3', 'p'],
        ],
        'bubble' => ['enabled' => false, 'items' => []],
    ]);

    $loaded = $service->getConfig($id);
    expect($loaded['toolbar'])->toBe(['bold', 'bulletList', 'dropdown:formatting'])
        ->and($loaded['dropdowns']['formatting'])->toBe(['heading2', 'heading3', 'paragraph']);

    $service->removeConfig($id);
});

it('drops a control a dropdown owns from a stored toolbar, rather than refusing the config', function() {
    $service = Vizy::$plugin->getEditorConfigs();
    $id = 'memberonly' . strtolower(StringHelper::randomString(8));

    // Which is how a Vizy 3 toolbar arrives: it named `h2`, `paragraph` and `align-left` at the
    // top level, and three of the four families here have since taken ownership of their members.
    // Dropped rather than rejected, on the same grounds as a retired token — a config that will
    // not open is worse than one whose author re-places a dropdown.
    $service->saveConfig($id, [
        'label' => 'Member only',
        'capabilities' => ['nodes' => ['heading', 'blockquote', 'table'], 'marks' => ['bold']],
        'headings' => ['levels' => [2]],
        'toolbar' => [
            'bold', 'heading2', 'paragraph', 'alignLeft', 'table', 'tableDeleteRow', 'blockquote',
            'bulletList', 'dropdown:formatting',
        ],
        'bubble' => ['enabled' => false, 'items' => []],
    ]);

    expect($service->getConfig($id)['toolbar'])
        ->toBe(['bold', 'bulletList', 'dropdown:formatting']);

    $service->removeConfig($id);
});

it('draws every toolbar glyph Vizy 3 drew, from Vizy 3’s own artwork', function() {
    // Mapping the toolbar onto the Font Awesome catalog Vizy already bundles looked close, and
    // only close: a different major draws a different bold, and these are the buttons an author
    // sees every day. So the set is Vizy 3's, shipped as `src/inc/toolbar-icons.json`.
    $bundled = json_decode(file_get_contents(__DIR__ . '/../../src/inc/toolbar-icons.json'), true);

    expect($bundled)->toBeArray()
        ->and(ToolbarIcons::glyph('bold'))->toBe($bundled['bold'])
        // Present in the set, and not in the Font Awesome catalog under this name — so a glyph
        // resolving proves it came from Vizy 3's artwork rather than by coincidence of naming.
        ->and(Vizy::$plugin->getIcons()->getSvgForValue('brackets-curly'))->toBeNull()
        ->and(ToolbarIcons::svgFor('code'))->toBe($bundled['brackets-curly']);

    // Vizy 3's pairings, including the ones that are not the obvious match — which is the reason
    // the mapping is a table and not a naming convention.
    expect(ToolbarIcons::svgFor('paragraph'))->toBe($bundled['text'])
        ->and(ToolbarIcons::svgFor('codeBlock'))->toBe($bundled['code'])
        ->and(ToolbarIcons::svgFor('hardBreak'))->toBe($bundled['page-break'])
        ->and(ToolbarIcons::svgFor('clearFormatting'))->toBe($bundled['remove-format'])
        // The three Vizy 3 glyphs that once sat with pending/source tooling —
        // html is retired; mediaEmbed / iframe are live.
        ->and(ToolbarIcons::svgFor('html'))->toBe($bundled['file-code'])
        ->and(ToolbarIcons::svgFor('mediaEmbed'))->toBe($bundled['photo-film'])
        ->and(ToolbarIcons::svgFor('iframe'))->toBe($bundled['rectangle-code']);

    // The Formatting dropdown wears the pilcrow, as in Vizy 3, and the Paragraph button the
    // serif T. Two glyphs for two things: the menu of block types, and the one that is plain prose.
    $formatting = collect(EditorConfigPresentation::dropdownCatalog())->firstWhere('id', 'dropdown:formatting');
    expect($formatting['icon'])->toBe($bundled['paragraph'])
        ->and($formatting['icon'])->not->toBe(ToolbarIcons::svgFor('paragraph'));

    // Six distinct heading glyphs, which the icon catalog cannot offer — it has no H4 to H6, and
    // three levels sharing the generic heading glyph is what put a text stand-in here before.
    $levels = collect(range(1, 6))->map(fn(int $level) => ToolbarIcons::svgFor("heading{$level}"));
    expect($levels->filter()->unique()->count())->toBe(6);

    // Anything Vizy 3 had no button for still comes from the catalog, which is also where a
    // plugin's registered glyph is found.
    expect(ToolbarIcons::svgFor('tableMergeCells'))->toStartWith('<svg')
        ->and(ToolbarIcons::glyph('not-a-glyph-anywhere'))->toBeNull();
});

it('offers Layout, which wraps a selection rather than placing an empty one', function() {
    // Layout has been installed and author-configurable since it shipped, and was missing
    // from the palette only because it was left out of the node allowlist.
    $layout = collect(EditorConfigPresentation::toolbarCatalog())->firstWhere('id', 'layout');

    expect($layout)->not->toBeNull()
        ->and($layout['capabilityName'])->toBe('layout');

    // Its own command, not `insertNode`: an empty layout is invalid content, since its
    // columns are required and cannot be filled generically.
    expect(EditorConfigPresentation::controlFor('layout', [], ['layout'])['action'])
        ->toBe(['command' => 'wrapInLayout']);
});

it('builds deterministic manifest revisions with request-local correlation IDs', function() {
    $field = new VizyField([
        'uid' => '11111111-1111-4111-8111-111111111111',
        'name' => 'Manifest',
        'handle' => 'manifestField',
        'editorConfig' => 'standard',
        'rootContentType' => VizyField::ROOT_CONTENT_RICH,
        'blockTypePickerGroups' => [],
    ]);
    $service = Vizy::$plugin->getEditorManifests();
    $service->invalidate();
    $first = $service->build($field);
    $service->invalidate();
    $second = $service->build($field);

    expect($first)->toBeArray()
        ->and(json_encode($first, JSON_THROW_ON_ERROR))->toBeString()
        ->and($first['hash'])->toBe($second['hash'])
        ->and($first['revision'])->toBe($second['revision'])
        ->and($first['uid'])->not->toBe($second['uid'])
        ->and($first['field']['blockTypePickerGroups'])->toBe([])
        ->and($first['field']['fieldHandle'])->toBe('manifestField')
        ->and($first['internalNodes'])->toContain('doc', 'text', 'vizyBlock');
});

it('changes schema revision when field policy changes while preserving registry identity', function() {
    $field = new VizyField([
        'uid' => StringHelper::UUID(),
        'name' => 'Schema',
        'handle' => 'schemaField',
        'editorConfig' => 'standard',
        'rootContentType' => VizyField::ROOT_CONTENT_RICH,
    ]);
    $service = Vizy::$plugin->getEditorManifests();
    $first = $service->build($field);
    $field->rootContentType = VizyField::ROOT_CONTENT_BLOCKS;
    $service->invalidate();
    $second = $service->build($field);

    expect($first['schemaRevision'])->not->toBe($second['schemaRevision'])
        ->and($first['registryRevision'])->toBe($second['registryRevision']);
});

it('rejects newly disallowed content and preserves exact trusted baseline content', function() {
    $field = new VizyField([
        'uid' => StringHelper::UUID(),
        'name' => 'Vocabulary',
        'handle' => 'allowedContentField',
        'editorConfig' => 'standard',
    ]);
    $raw = [
        'type' => 'doc',
        'attrs' => ['schemaVersion' => 2],
        'content' => [[
            'type' => 'removedNode',
            'attrs' => ['opaque' => true],
            'content' => [['type' => 'text', 'text' => 'untouched']],
        ]],
    ];
    $parser = new DocumentParser();
    $baseline = $parser->parse($raw);
    $same = $parser->parse($raw);
    $changedRaw = $raw;
    $changedRaw['content'][0]['attrs']['opaque'] = false;
    $changed = $parser->parse($changedRaw);

    $service = Vizy::$plugin->getEditorManifests();
    expect($service->validateCapabilities($same, $field, $baseline))->toBe([])
        ->and($service->validateCapabilities($changed, $field, $baseline)[0]['code'])->toBe('disallowedNode');
});

it('enforces the heading levels as schema, not just as menu contents', function() {
    // The levels used to reach nothing but the toolbar: the client loaded TipTap's Heading with
    // its stock six levels and validation compared node *names*, so unticking H1 took the button
    // away and left a pasted `<h1>` perfectly saveable. "No H1 in body content" is a statement
    // about what a document may contain, so it is enforced where the rest of the schema is.
    $service = Vizy::$plugin->getEditorConfigs();
    $id = 'levels' . strtolower(StringHelper::randomString(8));
    $service->saveConfig($id, [
        'label' => 'Levels',
        'capabilities' => ['nodes' => ['paragraph', 'heading'], 'marks' => []],
        'headings' => ['levels' => [2, 3]],
    ]);

    $field = new VizyField([
        'uid' => StringHelper::UUID(),
        'name' => 'Levels',
        'handle' => 'levels' . StringHelper::randomString(5),
        'editorConfig' => $id,
    ]);
    $manifests = Vizy::$plugin->getEditorManifests();
    $manifests->invalidate();

    // Carried to the client, which builds Heading's parse rules from it.
    expect($manifests->build($field)['headingLevels'])->toBe([2, 3]);

    $parser = new DocumentParser();
    $document = fn(int $level) => $parser->parse([
        'type' => 'doc',
        'attrs' => ['schemaVersion' => 2],
        'content' => [[
            'type' => 'heading',
            'attrs' => ['level' => $level],
            'content' => [['type' => 'text', 'text' => 'Title']],
        ]],
    ]);

    $violation = $manifests->validateCapabilities($document(1), $field, null)[0] ?? null;
    expect($manifests->validateCapabilities($document(2), $field, null))->toBe([])
        ->and($violation['code'] ?? null)->toBe('disallowedHeadingLevel')
        ->and($violation['name'] ?? null)->toBe('heading1')
        // Judged like any other newly disallowed content, so tightening the levels never
        // invalidates an entry that already contained the heading.
        ->and($manifests->validateCapabilities($document(1), $field, $document(1)))->toBe([]);

    $service->removeConfig($id);
});

it('drops the heading node from the schema when a config allows no levels', function() {
    // The levels are the whole heading setting — the edit screen keeps the two in step, so this
    // is the hand-written and project-config case: heading ticked with nothing to tick it at.
    // Filtered out of the resolved schema rather than out of the selection, so `capabilities`
    // still round-trips what the author chose instead of quietly losing Heading on load.
    $service = Vizy::$plugin->getEditorConfigs();
    $normalize = new ReflectionMethod($service, '_normalize');
    $normalized = $normalize->invoke($service, 'levelless', [
        'label' => 'Levelless',
        'capabilities' => ['nodes' => ['paragraph', 'heading'], 'marks' => []],
        'headings' => ['levels' => []],
    ], null);

    expect($normalized['capabilities']['nodes'])->toContain('heading')
        ->and($normalized['schema']['nodes'])->not->toContain('heading');
});

it('keys preserved content violations by stable Block identity', function() {
    $field = new VizyField([
        'uid' => StringHelper::UUID(),
        'name' => 'Stable content',
        'handle' => 'stableVocabulary',
        'editorConfig' => 'standard',
    ]);
    $raw = [
        'type' => 'doc',
        'attrs' => ['schemaVersion' => 2],
        'content' => [[
            'type' => 'vizyBlock',
            'attrs' => [
                'blockUid' => 'stable-block',
                'blockTypeUid' => StringHelper::UUID(),
                'enabled' => true,
                'fieldSlots' => [
                    'placement-a' => ['type' => 'removedNode', 'attrs' => ['opaque' => true]],
                ],
            ],
            'content' => [],
        ]],
    ];
    $parser = new DocumentParser();
    // Hosted fieldSlots are opaque placements — capability validation walks TipTap only.
    // Leaf blocks with disallowed TipTap siblings still key by Block UID.
    $withDisallowed = $raw;
    $withDisallowed['content'][] = [
        'type' => 'removedNode',
        'attrs' => ['opaque' => true],
    ];
    $baseline = $parser->parse($raw);
    $inserted = $raw;
    array_unshift($inserted['content'], ['type' => 'paragraph', 'content' => [['type' => 'text', 'text' => 'unrelated']]]);
    $service = Vizy::$plugin->getEditorManifests();

    expect($service->validateCapabilities($parser->parse($inserted), $field, $baseline))->toBe([])
        ->and($service->validateCapabilities($parser->parse($withDisallowed), $field, $baseline)[0]['code'])->toBe('disallowedNode')
        ->and($service->validateCapabilities($parser->parse($withDisallowed), $field, $baseline)[0]['path'])->not->toMatch('/content\.\d/');
});

it('rejects reserved transport placeholders at the canonical parser boundary', function(string $type) {
    expect(fn() => (new DocumentParser())->parse([
        'type' => 'doc',
        'attrs' => ['schemaVersion' => 2],
        'content' => [['type' => $type]],
    ]))->toThrow(\verbb\vizy\document\InvalidDocumentException::class, 'placeholder');
})->with(['unsupportedNode', 'unsupportedInlineNode', 'unsupportedMark']);

it('validates field config references and renders named config options', function() {
    $valid = new VizyField([
        'name' => 'Valid Config',
        'handle' => 'validConfig',
        'editorConfig' => 'standard',
    ]);
    $missing = new VizyField([
        'name' => 'Missing Config',
        'handle' => 'missingConfig',
        'editorConfig' => 'does-not-exist',
    ]);

    expect($valid->validate())->toBeTrue()
        ->and($missing->validate())->toBeFalse()
        ->and($missing->getErrors('editorConfig'))->not->toBeEmpty()
        ->and($valid->getSettingsHtml())->toContain('<select')
        ->and($valid->getSettingsHtml())->toContain('standard');
});

it('preserves an unchanged missing field config reference from trusted Project Config', function() {
    $id = 'removed' . strtolower(StringHelper::randomString(8));
    $configs = Vizy::$plugin->getEditorConfigs();
    $configs->saveConfig($id, [
        'label' => 'Temporary',
        'capabilities' => ['nodes' => ['paragraph'], 'marks' => []],
        'headings' => ['levels' => [2]],
    ]);
    $field = new VizyField([
        'name' => 'Missing baseline',
        'handle' => 'missingBaseline' . StringHelper::randomString(6),
        'editorConfig' => $id,
    ]);
    expect(Craft::$app->getFields()->saveField($field))->toBeTrue();
    $configs->removeConfig($id);

    expect($field->validate())->toBeTrue()
        ->and($field->getEditorConfigDiagnostics())->toBe([[
            'code' => 'missingEditorConfig',
            'id' => $id,
        ]]);

    Craft::$app->getFields()->deleteField($field);
});

it('loads a config/vizy JSON file as a selectable editor config', function() {
    $service = Vizy::$plugin->getEditorConfigs();
    $dir = Craft::$app->getPath()->getConfigPath() . DIRECTORY_SEPARATOR . EditorConfigs::FILE_CONFIG_DIR;
    FileHelper::createDirectory($dir);
    $id = 'filecfg' . strtolower(StringHelper::randomString(6));
    $path = $dir . DIRECTORY_SEPARATOR . $id . '.json';

    // No label — derived from the filename. `dropdowns: []` is treated as absent.
    file_put_contents($path, Json::encode([
        'capabilities' => [
            'nodes' => ['heading', 'blockquote'],
            'marks' => ['bold', 'italic'],
        ],
        'headings' => ['levels' => [2, 3]],
        'toolbar' => ['dropdown:formatting', 'bold', 'italic'],
        'dropdowns' => [],
        'bubble' => ['enabled' => true, 'items' => ['bold']],
    ]));

    try {
        $service->invalidate();
        $config = $service->getConfig($id);

        expect($config)->not->toBeNull()
            ->and($config['source'])->toBe(EditorConfigs::SOURCE_FILE)
            ->and($config['filename'])->toBe($id . '.json')
            ->and($config['label'])->toBe(StringHelper::toTitleCase($id))
            ->and($service->isFileConfig($id))->toBeTrue()
            ->and(array_column($service->getOptions(), 'value'))->toContain($id)
            ->and(collect($service->getOptions())->firstWhere('value', $id)['label'])
            ->toContain('(file)');

        expect($service->fileContents($id))->toBe(file_get_contents($path));

        expect(fn() => $service->saveConfig($id, $service->authorablePayload($config)))
            ->toThrow(RuntimeException::class, 'owned by a file');
        expect(fn() => $service->removeConfig($id))
            ->toThrow(RuntimeException::class, 'lives in a file');
    } finally {
        @unlink($path);
        $service->invalidate();
    }
});

it('lets Project Config keep an ID when a colliding file appears', function() {
    $service = Vizy::$plugin->getEditorConfigs();
    $id = 'clash' . strtolower(StringHelper::randomString(6));
    $dir = Craft::$app->getPath()->getConfigPath() . DIRECTORY_SEPARATOR . EditorConfigs::FILE_CONFIG_DIR;
    FileHelper::createDirectory($dir);
    $path = $dir . DIRECTORY_SEPARATOR . $id . '.json';

    $service->saveConfig($id, [
        'label' => 'From Project Config',
        'capabilities' => [
            'nodes' => ['heading'],
            'marks' => ['bold'],
        ],
        'headings' => ['levels' => [2]],
        'toolbar' => ['bold'],
        'bubble' => ['enabled' => false, 'items' => []],
    ]);

    file_put_contents($path, Json::encode([
        'label' => 'From File',
        'capabilities' => [
            'nodes' => ['blockquote'],
            'marks' => ['italic'],
        ],
        'headings' => ['levels' => [3]],
        'toolbar' => ['italic'],
        'bubble' => ['enabled' => true, 'items' => ['italic']],
    ]));

    try {
        $service->invalidate();
        $config = $service->getConfig($id);

        expect($config['source'])->toBe(EditorConfigs::SOURCE_PROJECT_CONFIG)
            ->and($config['label'])->toBe('From Project Config')
            ->and($service->fileOwnsId($id))->toBeTrue();

        // Updating the existing Project Config entry remains allowed; creating would not.
        $payload = $service->authorablePayload($config);
        $payload['label'] = 'Still Project Config';
        $service->saveConfig($id, $payload);
        expect($service->getConfig($id)['label'])->toBe('Still Project Config');
    } finally {
        @unlink($path);
        $service->removeConfig($id);
        $service->invalidate();
    }
});
