<?php

declare(strict_types=1);

/**
 * Spike B — Craft FieldLayout conditions on an ephemeral Vizy Block Element.
 *
 * Confirms Craft-native visibility conditions can evaluate against a Block with
 * id = null and a real FieldLayout, without a Vizy-native conditions engine.
 */

use Craft;
use craft\elements\Entry;
use craft\fieldlayoutelements\CustomField;
use craft\fields\Lightswitch;
use craft\fields\PlainText;
use craft\fields\conditions\LightswitchFieldConditionRule;
use craft\models\FieldLayout;
use craft\models\FieldLayoutTab;
use Tests\Support\Fixtures\VizyFixtureFactory;
use verbb\vizy\elements\Block as VizyBlockElement;

it('evaluates sibling FieldLayout element conditions on an ephemeral Block', function() {
    $suffix = (string)mt_rand(100000, 999999);
    $toggleHandle = 'showDetailsSpike' . $suffix;
    $detailsHandle = 'detailsSpike' . $suffix;

    $toggle = new Lightswitch([
        'name' => 'Show Details',
        'handle' => $toggleHandle,
    ]);
    expect(Craft::$app->getFields()->saveField($toggle))->toBeTrue(json_encode($toggle->getErrors()));

    $details = new PlainText([
        'name' => 'Details',
        'handle' => $detailsHandle,
    ]);
    expect(Craft::$app->getFields()->saveField($details))->toBeTrue(json_encode($details->getErrors()));

    $layout = new FieldLayout(['type' => VizyBlockElement::class]);

    $detailsElement = new CustomField();
    $detailsElement->setFieldUid($details->uid);

    // Show Details when the sibling lightswitch is on.
    // Craft only applies conditions to layout elements that have UIDs
    // (FieldLayout::createForm — $isConditional = isset($tab->uid, $layoutElement->uid)).
    $condition = VizyBlockElement::createCondition();
    $rule = new LightswitchFieldConditionRule();
    $rule->setFieldUid($toggle->uid);
    $rule->value = true;
    $condition->setConditionRules([$rule]);
    $detailsElement->setElementCondition($condition);

    $layout->setTabs([
        new FieldLayoutTab([
            'layout' => $layout,
            'name' => 'Content',
            'elements' => [
                [
                    'type' => CustomField::class,
                    'fieldUid' => $toggle->uid,
                ],
                $detailsElement,
            ],
        ]),
    ]);
    expect(Craft::$app->getFields()->saveLayout($layout))->toBeTrue();

    $layout = Craft::$app->getFields()->getLayoutById($layout->id);
    expect($layout)->not->toBeNull();

    $owner = VizyFixtureFactory::entry('Condition owner');
    $block = new VizyBlockElement();
    $block->id = null;
    $block->setOwner($owner);
    $block->setFieldLayout($layout);

    $detailsLayoutElement = null;
    foreach ($layout->getCustomFieldElements() as $layoutElement) {
        if ($layoutElement->getField()->handle === $detailsHandle) {
            $detailsLayoutElement = $layoutElement;
            break;
        }
    }

    expect($detailsLayoutElement)->not->toBeNull();
    expect($detailsLayoutElement->uid)->not->toBeNull();
    expect($detailsLayoutElement->getElementCondition())->not->toBeNull();

    $block->setFieldValue($toggleHandle, false);
    expect($detailsLayoutElement->showInForm($block))->toBeFalse();

    $hiddenHtml = $layout->createForm($block, false)->render();
    expect($block->id)->toBeNull();
    expect($hiddenHtml)->not->toContain($detailsHandle);

    $block->setFieldValue($toggleHandle, true);
    expect($detailsLayoutElement->showInForm($block))->toBeTrue();

    $visibleHtml = $layout->createForm($block, false)->render();
    expect($visibleHtml)->toContain($detailsHandle);
})->group('slow');

it('preserves field values even when a conditional layout element is hidden', function() {
    // Canonical Vizy 4: conditions are visibility/editing semantics, not destructive cleanup.
    $suffix = (string)mt_rand(100000, 999999);

    $toggle = new Lightswitch([
        'name' => 'Reveal',
        'handle' => 'revealSpike' . $suffix,
    ]);
    expect(Craft::$app->getFields()->saveField($toggle))->toBeTrue(json_encode($toggle->getErrors()));

    $secret = new PlainText([
        'name' => 'Secret',
        'handle' => 'secretSpike' . $suffix,
    ]);
    expect(Craft::$app->getFields()->saveField($secret))->toBeTrue(json_encode($secret->getErrors()));

    $layout = new FieldLayout(['type' => VizyBlockElement::class]);
    $layout->setTabs([
        new FieldLayoutTab([
            'layout' => $layout,
            'name' => 'Content',
            'elements' => [
                [
                    'type' => CustomField::class,
                    'fieldUid' => $toggle->uid,
                ],
                [
                    'type' => CustomField::class,
                    'fieldUid' => $secret->uid,
                ],
            ],
        ]),
    ]);
    expect(Craft::$app->getFields()->saveLayout($layout))->toBeTrue();

    $block = new VizyBlockElement();
    $block->id = null;
    $block->setOwner(new Entry(['title' => 'Preserve owner']));
    $block->setFieldLayout($layout);
    $block->setFieldValue('revealSpike' . $suffix, false);
    $block->setFieldValue('secretSpike' . $suffix, 'keep-me');

    expect($block->getFieldValue('secretSpike' . $suffix))->toBe('keep-me');
});
