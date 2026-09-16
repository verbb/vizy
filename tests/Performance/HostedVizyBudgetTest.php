<?php

declare(strict_types=1);

use craft\fieldlayoutelements\CustomField;
use craft\helpers\StringHelper;
use craft\models\FieldLayout;
use craft\models\FieldLayoutTab;
use Tests\Support\Fixtures\VizyFixtureFactory;
use Tests\Support\Performance\HostedVizyBudgetMetrics;
use Tests\Support\Performance\QueryProfiler;
use verbb\vizy\elements\Block;
use verbb\vizy\fields\VizyField;
use verbb\vizy\services\HostedVizy;

it('keeps ten sibling hosted bootstraps structurally linear', function() {
    $entryField = VizyFixtureFactory::vizyField();
    $owner = VizyFixtureFactory::entry('Hosted branching budget');
    $nestedField = new VizyField([
        'uid' => StringHelper::UUID(),
        'name' => 'Hosted branch',
        'handle' => 'hostedBranch' . StringHelper::randomString(5),
        'editorConfig' => 'standard',
    ]);
    expect(Craft::$app->getFields()->saveField($nestedField))->toBeTrue();

    $layout = new FieldLayout(['uid' => StringHelper::UUID(), 'type' => Block::class]);
    $tab = new FieldLayoutTab(['uid' => StringHelper::UUID(), 'name' => 'Content', 'layout' => $layout]);
    $placement = new CustomField($nestedField);
    $placement->uid = StringHelper::UUID();
    $tab->setElements([$placement]);
    $layout->setTabs([$tab]);

    $expectedDocument = json_decode(VizyFixtureFactory::paragraphDocument('Hosted content survives bootstrap'), true);
    $render = new ReflectionMethod($nestedField, '_hostedInputHtml');
    $renderOne = static function() use (
        $entryField,
        $layout,
        $nestedField,
        $owner,
        $render,
        $expectedDocument,
    ): string {
        $block = new Block();
        $block->setOwner($owner);
        $block->setField($entryField);
        $block->setFieldLayout($layout);
        $block->setType(new \verbb\vizy\models\BlockType(['uid' => StringHelper::UUID()]));
        $block->setBlockUid(StringHelper::UUID());
        $value = $nestedField->normalizeValue($expectedDocument, $block);

        return $render->invoke($nestedField, $value, $block);
    };

    $previousDepth = HostedVizy::renderingDepth();
    $previousEntryFieldUid = HostedVizy::entryFieldUid();
    HostedVizy::setRenderingDepth(0);
    HostedVizy::setEntryFieldUid($entryField->uid);
    try {
        $singleProfile = QueryProfiler::profile($renderOne);
        $singleHtml = $renderOne();
        $branchHtml = '';
        $branchProfile = QueryProfiler::profile(function() use (&$branchHtml, $renderOne): string {
            for ($index = 0; $index < 10; $index++) {
                $branchHtml .= $renderOne();
            }

            return $branchHtml;
        });
    } finally {
        HostedVizy::setRenderingDepth($previousDepth);
        HostedVizy::setEntryFieldUid($previousEntryFieldUid);
    }

    $single = HostedVizyBudgetMetrics::fromHtml($singleHtml);
    $branch = HostedVizyBudgetMetrics::fromHtml($branchHtml);

    expect($single['hostedEditors'])->toBe(1)
        ->and($single['bootstrapTemplates'])->toBe(1)
        ->and($single['bootstrapEditorCalls'])->toBe(0)
        ->and($branch['hostedEditors'])->toBe(10)
        ->and($branch['bootstrapTemplates'])->toBe(10)
        ->and($branch['bootstrapEditorCalls'])->toBe(0)
        ->and(array_values(array_unique($branch['manifestHashes'])))->toHaveCount(1)
        // IDs/tokens vary by a fixed amount; sibling growth must remain linear.
        ->and($branch['bytes'])->toBeLessThanOrEqual((int)ceil($single['bytes'] * 10 * 1.02));

    preg_match_all('/<template\b[^>]*data-vizy-bootstrap[^>]*>(.*?)<\/template>/s', $branchHtml, $payloads);
    expect($payloads[1])->toHaveCount(10);
    foreach ($payloads[1] as $payload) {
        expect(json_decode($payload, true, flags: JSON_THROW_ON_ERROR)['document'])->toBe($expectedDocument);
    }
    expect($branchProfile['queries'])->toBeLessThanOrEqual(max(10, $singleProfile['queries'] * 10));

    fwrite(STDERR, "\nHosted Vizy branch profile: " . json_encode([
        'single' => [...$singleProfile, 'htmlBytes' => $single['bytes']],
        'siblings10' => [...$branchProfile, 'htmlBytes' => $branch['bytes']],
    ], JSON_PRETTY_PRINT) . "\n");
})->group('perf');
