<?php

declare(strict_types=1);

use craft\fields\Matrix;
use craft\helpers\StringHelper;
use Tests\Support\Fixtures\MatrixSupportFixture;
use Tests\Support\WebControllerHarness;
use verbb\vizy\Vizy;

it('renders Matrix inline without changing a shared field or layout configuration', function(string $mode) {
    $f = new MatrixSupportFixture();
    $f->matrix->viewMode = $mode;
    $f->matrix->showCardsInGrid = $mode === Matrix::VIEW_MODE_CARDS_GRID;
    expect(Craft::$app->getFields()->saveField($f->matrix))->toBeTrue();
    $placement = $f->blockType->getFieldLayout()->getCustomFieldElements()[0];
    $placement->setField($f->matrix);
    expect(Vizy::$plugin->getBlockTypes()->saveBlockType($f->blockType))->toBeTrue();
    $uid = StringHelper::UUID();
    $owner = $f->save([$f->block($uid, $f->payload(['Keep this row']))]);
    $document = $owner->getFieldValue($f->field->handle);
    $layoutBefore = $f->blockType->getFieldLayout()->getConfig();
    WebControllerHarness::beginWebRequest();
    try {
        $context = Vizy::$plugin->getEditorContexts()->issue($owner, $f->field);
        $forms = Vizy::$plugin->getFieldLayoutForms();
        $block = $document->toArray()['content'][0];
        $initial = $forms->renderInitial($context, $owner, $f->field, $block, ['kind' => 'root']);
        $object = json_decode(json_encode($block));
        $lazy = $forms->renderRequestItem($context, $owner, $f->field, (object)[
            'block' => $object, 'blockHash' => $forms->blockHash($object),
            'destination' => (object)['kind' => 'root'],
        ]);
        foreach ([$initial, $lazy] as $result) {
            expect($result['ok'])->toBeTrue(json_encode($result));
            expect($result['data']['html'])->toContain('Keep this row')->toContain('matrixblock')->not->toContain('nested-element-cards');
        }
    } finally {
        WebControllerHarness::endWebRequest();
    }
    expect($f->blockType->getFieldLayout()->getConfig())->toBe($layoutBefore);
    expect($placement->getField()->viewMode)->toBe($mode);
    expect(Craft::$app->getFields()->getFieldById($f->matrix->id)->viewMode)->toBe($mode);
    Craft::$app->getFields()->refreshFields();
    expect(Craft::$app->getFields()->getFieldById($f->matrix->id)->viewMode)->toBe($mode);
    expect($f->rows($uid)[0]->getFieldValue($f->text->handle))->toBe('Keep this row');
})->with(['cards', 'cards-grid', 'index']);
