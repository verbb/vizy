<?php

declare(strict_types=1);

use craft\behaviors\CustomFieldBehavior;
use craft\elements\Asset;
use craft\fieldlayoutelements\CustomField;
use craft\fields\Assets as AssetsField;
use craft\fields\PlainText;
use craft\fs\Local;
use craft\helpers\FileHelper;
use craft\helpers\StringHelper;
use craft\models\FieldLayout;
use craft\models\FieldLayoutTab;
use craft\models\Volume;
use Tests\Support\Fixtures\AssetSpikeFixture;
use verbb\vizy\document\VizyDocument;
use verbb\vizy\elements\Block;
use verbb\vizy\events\RegisterBlockSummaryProvidersEvent;
use verbb\vizy\fields\VizyField;
use verbb\vizy\models\BlockSummaryTexts;
use verbb\vizy\models\BlockType;
use verbb\vizy\services\BlockSummaryProjection;
use verbb\vizy\services\BlockSummaries;
use verbb\vizy\Vizy;
use yii\base\Event;

beforeEach(function() {
    Vizy::$plugin->getBlockSummaries()->reset();
});

function blockSummaryFixture(): array
{
    $suffix = StringHelper::randomString(5);
    $title = new PlainText(['name' => 'Title', 'handle' => 'title' . $suffix]);
    $subtitle = new PlainText(['name' => 'Subtitle', 'handle' => 'subtitle' . $suffix]);
    expect(Craft::$app->getFields()->saveField($title))->toBeTrue();
    expect(Craft::$app->getFields()->saveField($subtitle))->toBeTrue();
    CustomFieldBehavior::$fieldHandles[$title->handle] = true;
    CustomFieldBehavior::$fieldHandles[$subtitle->handle] = true;

    $layout = new FieldLayout(['uid' => StringHelper::UUID(), 'type' => Block::class]);
    $titleElement = ['type' => CustomField::class, 'fieldUid' => $title->uid];
    $subtitleElement = ['type' => CustomField::class, 'fieldUid' => $subtitle->uid];
    $layout->setTabs([new FieldLayoutTab([
        'layout' => $layout,
        'name' => 'Content',
        'elements' => [$titleElement, $subtitleElement],
    ])]);

    $type = new BlockType([
        'uid' => StringHelper::UUID(),
        'name' => 'Hero',
        'handle' => 'hero' . $suffix,
        'summary' => [
            'titlePlacementUid' => null,
            'subtitlePlacementUid' => null,
        ],
    ]);
    $type->setFieldLayout($layout);
    expect(Vizy::$plugin->getBlockTypes()->saveBlockType($type))->toBeTrue();
    $type = Vizy::$plugin->getBlockTypes()->getBlockTypeByUid($type->uid);
    $placements = $type->getFieldLayout()?->getCustomFieldElements() ?? [];
    expect($placements)->toHaveCount(2);
    $type->summary = [
        'titlePlacementUid' => (string)$placements[0]->uid,
        'subtitlePlacementUid' => (string)$placements[1]->uid,
    ];
    expect(Vizy::$plugin->getBlockTypes()->saveBlockType($type))->toBeTrue();
    $type = Vizy::$plugin->getBlockTypes()->getBlockTypeByUid($type->uid);

    return [
        'type' => $type,
        'titlePlacementUid' => (string)$placements[0]->uid,
        'subtitlePlacementUid' => (string)$placements[1]->uid,
    ];
}

function blockNode(string $blockUid, BlockType $type, array $fieldSlots): array
{
    return [
        'type' => 'vizyBlock',
        'attrs' => [
            'blockUid' => $blockUid,
            'blockTypeUid' => (string)$type->uid,
            'enabled' => true,
            'fieldSlots' => $fieldSlots,
        ],
        'content' => [],
    ];
}

it('derives title and subtitle from explicit placement UIDs', function() {
    $fixture = blockSummaryFixture();
    $document = VizyDocument::fromCanonicalData([
        'type' => 'doc',
        'attrs' => ['schemaVersion' => 2],
        'content' => [
            blockNode('block-a', $fixture['type'], [
                $fixture['titlePlacementUid'] => 'Main headline',
                $fixture['subtitlePlacementUid'] => 'Supporting copy',
            ]),
        ],
    ]);

    $summary = Vizy::$plugin->getBlockSummaries()->getSummary($document->blocks()[0]);
    expect($summary->title)->toBe('Main headline');
    expect($summary->subtitle)->toBe('Supporting copy');
    expect($summary->resolved)->toBeTrue();
});

it('falls back to Block Type name and infers the first textual placement', function() {
    $fixture = blockSummaryFixture();
    $document = VizyDocument::fromCanonicalData([
        'type' => 'doc',
        'attrs' => ['schemaVersion' => 2],
        'content' => [
            blockNode('block-a', $fixture['type'], [
                $fixture['titlePlacementUid'] => 'Inferred title',
            ]),
        ],
    ]);

    $summary = Vizy::$plugin->getBlockSummaries()->getSummary($document->blocks()[0]);
    expect($summary->title)->toBe('Inferred title');
    expect($summary->subtitle)->toBeNull();
});

it('infers Hosted Vizy in FieldLayout order and projects only its direct rich text', function() {
    $nested = new VizyField([
        'name' => 'Nested body',
        'handle' => 'nestedBody' . StringHelper::randomString(5),
        'editorMode' => VizyField::MODE_RICH_TEXT,
    ]);
    $plain = new PlainText([
        'name' => 'Supporting copy',
        'handle' => 'supportingCopy' . StringHelper::randomString(5),
    ]);
    $nestedPlacement = new CustomField($nested);
    $nestedPlacement->uid = StringHelper::UUID();
    $plainPlacement = new CustomField($plain);
    $plainPlacement->uid = StringHelper::UUID();
    $layout = new FieldLayout(['uid' => StringHelper::UUID(), 'type' => Block::class]);
    $layout->setTabs([new FieldLayoutTab([
        'layout' => $layout,
        'name' => 'Content',
        'elements' => [$nestedPlacement, $plainPlacement],
    ])]);
    $type = new BlockType([
        'uid' => StringHelper::UUID(),
        'name' => 'Rich card',
        'handle' => 'richCard' . StringHelper::randomString(5),
    ]);
    $type->setFieldLayout($layout);
    $projection = new BlockSummaryProjection();
    $inference = $projection->inferenceFor($type);
    $hosted = [
        'type' => 'doc',
        'attrs' => ['schemaVersion' => 2],
        'content' => [
            ['type' => 'heading', 'attrs' => ['level' => 2], 'content' => [
                ['type' => 'text', 'text' => 'Nested heading'],
            ]],
            ['type' => 'paragraph', 'content' => [
                ['type' => 'text', 'text' => 'and supporting copy'],
            ]],
            ['type' => 'vizyBlock', 'attrs' => [
                'blockUid' => StringHelper::UUID(),
                'blockTypeUid' => StringHelper::UUID(),
                'enabled' => true,
                'fieldSlots' => [],
            ], 'content' => [
                ['type' => 'text', 'text' => 'must not leak from a nested Block'],
            ]],
        ],
    ];

    expect($inference->titleCandidates)->toBe([$nestedPlacement->uid])
        ->and($inference->subtitleCandidates)->toBe([$plainPlacement->uid])
        ->and($projection->titleFromSlots($type, [
            $nestedPlacement->uid => $hosted,
        ], null, $inference))->toBe('Nested heading and supporting copy')
        ->and($projection->subtitleFromSlots([
            $plainPlacement->uid => 'Plain subtitle',
        ], null, $inference))->toBe('Plain subtitle');
});

it('returns a safe summary for unresolved Block Types', function() {
    $document = VizyDocument::fromCanonicalData([
        'type' => 'doc',
        'attrs' => ['schemaVersion' => 2],
        'content' => [
            blockNode('block-a', new BlockType([
                'uid' => StringHelper::UUID(),
                'name' => 'Ghost',
                'handle' => 'ghost',
            ]), []),
        ],
    ]);

    $summary = Vizy::$plugin->getBlockSummaries()->getSummary($document->blocks()[0]);
    expect($summary->title)->toBe(BlockSummaryTexts::missingBlockTypeTitle());
    expect($summary->resolved)->toBeFalse();
});

it('overlays validation counts without changing authored enabled state', function() {
    $fixture = blockSummaryFixture();
    $document = VizyDocument::fromCanonicalData([
        'type' => 'doc',
        'attrs' => ['schemaVersion' => 2],
        'content' => [blockNode('block-a', $fixture['type'], [])],
    ]);

    $summary = Vizy::$plugin->getBlockSummaries()->getSummary($document->blocks()[0], [
        'revision' => 'v1',
        'blocks' => [
            'block-a' => ['errorCount' => 2, 'descendantErrorCount' => 5],
        ],
    ]);

    expect($summary->enabled)->toBeTrue();
    expect($summary->errorCount)->toBe(2);
    expect($summary->descendantErrorCount)->toBe(5);
});

it('resolves media metadata for Blocks with an asset in an Assets field', function() {
    AssetSpikeFixture::ensureAdminUser();
    $suffix = StringHelper::randomString(6);
    $root = sys_get_temp_dir() . '/vizy-summary-media/' . $suffix;
    FileHelper::createDirectory($root);
    $fs = new Local([
        'name' => 'Summary media ' . $suffix, 'handle' => 'summaryMedia' . $suffix,
        'path' => $root, 'hasUrls' => true, 'url' => 'https://example.test/summary-media/',
    ]);
    expect(Craft::$app->getFs()->saveFilesystem($fs))->toBeTrue();
    $volume = new Volume(['name' => 'Summary media ' . $suffix, 'handle' => 'summaryMedia' . $suffix, 'fsHandle' => $fs->handle]);
    expect(Craft::$app->getVolumes()->saveVolume($volume))->toBeTrue();

    // A real 1x1 PNG, so the thumbnail goes through Craft's image path rather than the file icon fallback.
    $temp = Craft::$app->getPath()->getTempPath() . '/' . $suffix . '.png';
    file_put_contents($temp, base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='));
    $asset = new Asset([
        'tempFilePath' => $temp, 'filename' => $suffix . '.png', 'title' => 'Summary image',
        'newFolderId' => Craft::$app->getAssets()->getRootFolderByVolumeId($volume->id)->id,
        'scenario' => Asset::SCENARIO_CREATE,
    ]);
    expect(Craft::$app->getElements()->saveElement($asset))->toBeTrue();

    $heading = new PlainText(['name' => 'Heading', 'handle' => 'heading' . $suffix]);
    $image = new AssetsField(['name' => 'Image', 'handle' => 'image' . $suffix]);
    expect(Craft::$app->getFields()->saveField($heading))->toBeTrue();
    expect(Craft::$app->getFields()->saveField($image))->toBeTrue();
    CustomFieldBehavior::$fieldHandles[$heading->handle] = true;
    CustomFieldBehavior::$fieldHandles[$image->handle] = true;
    $layout = new FieldLayout(['uid' => StringHelper::UUID(), 'type' => Block::class]);
    $layout->setTabs([new FieldLayoutTab([
        'layout' => $layout,
        'name' => 'Content',
        'elements' => [
            ['type' => CustomField::class, 'fieldUid' => $heading->uid],
            ['type' => CustomField::class, 'fieldUid' => $image->uid],
        ],
    ])]);
    $type = new BlockType(['uid' => StringHelper::UUID(), 'name' => 'Card', 'handle' => 'card' . $suffix]);
    $type->setFieldLayout($layout);
    expect(Vizy::$plugin->getBlockTypes()->saveBlockType($type))->toBeTrue();
    $type = Vizy::$plugin->getBlockTypes()->getBlockTypeByUid($type->uid);
    [$headingElement, $imageElement] = $type->getFieldLayout()?->getCustomFieldElements() ?? [null, null];

    $document = VizyDocument::fromCanonicalData([
        'type' => 'doc',
        'attrs' => ['schemaVersion' => 2],
        'content' => [
            blockNode('block-a', $type, [
                (string)$headingElement->uid => 'Card heading',
                (string)$imageElement->uid => [$asset->id],
            ]),
        ],
    ]);

    $summary = Vizy::$plugin->getBlockSummaries()->getSummary($document->blocks()[0]);
    expect($summary->title)->toBe('Card heading')
        ->and($summary->media?->reference)->toBe($asset->id)
        ->and($summary->media?->alt)->toBe('Summary image')
        ->and($summary->media?->thumbnailUrl)->toBeString()->not->toBe('');
});

it('batches summaries for large documents without creating Block Elements', function(int $count) {
    $fixture = blockSummaryFixture();
    $content = [];
    for ($i = 0; $i < $count; $i++) {
        $content[] = blockNode("block-{$i}", $fixture['type'], [
            $fixture['titlePlacementUid'] => "Title {$i}",
        ]);
    }
    $document = VizyDocument::fromCanonicalData([
        'type' => 'doc',
        'attrs' => ['schemaVersion' => 2],
        'content' => $content,
    ]);

    $before = $document->blockElementCreationCount();
    $summaries = Vizy::$plugin->getBlockSummaries()->getSummaries($document->blocks());
    expect($summaries)->toHaveCount($count);
    expect($document->blockElementCreationCount())->toBe($before);
    expect(Vizy::$plugin->getBlockSummaries()->assetMetadataQueryCount())->toBe(0);
})->with([100, 500]);

it('falls back when a provider throws', function() {
    $fixture = blockSummaryFixture();
    $type = $fixture['type'];
    $type->summary = ['provider' => 'exploding'];
    expect(Vizy::$plugin->getBlockTypes()->saveBlockType($type))->toBeTrue();
    $type = Vizy::$plugin->getBlockTypes()->getBlockTypeByUid($type->uid);

    Event::on(
        BlockSummaries::class,
        BlockSummaries::EVENT_REGISTER_PROVIDERS,
        function(RegisterBlockSummaryProvidersEvent $event) {
            $event->providers['exploding'] = [
                'callable' => static fn() => throw new RuntimeException('boom'),
            ];
        },
    );

    $document = VizyDocument::fromCanonicalData([
        'type' => 'doc',
        'attrs' => ['schemaVersion' => 2],
        'content' => [
            blockNode('block-a', $type, [$fixture['titlePlacementUid'] => 'Safe title']),
        ],
    ]);

    $summary = Vizy::$plugin->getBlockSummaries()->getSummary($document->blocks()[0]);
    expect($summary->title)->toBe('Safe title');
});

it('exposes Block Type presentation metadata for Browse All', function() {
    $fixture = blockSummaryFixture();
    $presentation = Vizy::$plugin->getBlockSummaries()->getTypePresentation($fixture['type']);
    expect($presentation->title)->toBe('Hero');
    expect($presentation->blockTypeUid)->toBe($fixture['type']->uid);
});
