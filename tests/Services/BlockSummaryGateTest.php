<?php

declare(strict_types=1);

use craft\behaviors\CustomFieldBehavior;
use craft\fieldlayoutelements\CustomField;
use craft\fields\PlainText;
use craft\helpers\StringHelper;
use craft\models\FieldLayout;
use craft\models\FieldLayoutTab;
use verbb\vizy\document\VizyDocument;
use verbb\vizy\elements\Block;
use verbb\vizy\events\RegisterBlockSummaryProvidersEvent;
use verbb\vizy\models\BlockSummaryTexts;
use verbb\vizy\models\BlockType;
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
