<?php

declare(strict_types=1);

/**
 * Spike B — Craft FieldLayout conditions on an ephemeral Vizy Block Element.
 *
 * Confirms Craft-native visibility conditions can evaluate against a Block with
 * id = null and a real FieldLayout, without a Vizy-native conditions engine.
 */

use craft\elements\Entry;
use craft\elements\conditions\TitleConditionRule;
use craft\elements\conditions\entries\SectionConditionRule;
use craft\elements\conditions\entries\TypeConditionRule;
use craft\fieldlayoutelements\CustomField;
use craft\fields\Lightswitch;
use craft\fields\PlainText;
use craft\fields\conditions\LightswitchFieldConditionRule;
use craft\models\FieldLayout;
use craft\models\FieldLayoutTab;
use Tests\Support\Fixtures\VizyFixtureFactory;
use verbb\vizy\elements\Block as VizyBlockElement;

it('offers Entry rules on Block layouts and evaluates them against the owner', function() {
    $condition = VizyBlockElement::createCondition();
    $selectable = array_map('get_class', $condition->getSelectableConditionRules());

    expect($selectable)->toContain(SectionConditionRule::class)
        ->and($selectable)->toContain(TypeConditionRule::class);

    $rule = new TitleConditionRule();
    $rule->value = 'Matching owner';
    $condition->setConditionRules([$rule]);

    $block = new VizyBlockElement();
    $block->setOwner(new Entry(['title' => 'Matching owner']));
    expect($condition->matchElement($block))->toBeTrue();

    $block->setOwner(new Entry(['title' => 'Other owner']));
    expect($condition->matchElement($block))->toBeFalse();
});

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
    // Show Details when the sibling lightswitch is on.
    // Craft only applies conditions to layout elements that have UIDs
    // (FieldLayout::createForm — $isConditional = isset($tab->uid, $layoutElement->uid)).
    $condition = VizyBlockElement::createCondition();
    $rule = new LightswitchFieldConditionRule();
    $rule->setFieldUid($toggle->uid);
    $rule->value = true;
    $condition->setFieldLayouts([$layout]);
    $condition->setConditionRules([$rule]);
    $detailsElement->setElementCondition($condition);

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

it('evaluates owner rules against the durable owner for Blocks in nested Vizy fields', function() {
    $entry = VizyFixtureFactory::entry();
    // The fixture entry type generates its title, so set one for the Title rule.
    $entry->title = 'Nested condition owner';
    $title = new TitleConditionRule();
    $title->value = 'Nested condition owner';
    $type = new TypeConditionRule();
    $type->setValues([$entry->getType()->uid]);
    $otherType = new TypeConditionRule();
    $otherType->operator = 'ni';
    $otherType->setValues([craft\helpers\StringHelper::UUID()]);
    $condition = VizyBlockElement::createCondition();
    $condition->setConditionRules([$title, $type, $otherType]);

    // A Block in a Hosted Vizy field is owned by its parent Block projection.
    $parent = new VizyBlockElement();
    $parent->setOwner($entry);
    $nested = new VizyBlockElement();
    $nested->setOwner($parent);
    $deeper = new VizyBlockElement();
    $deeper->setOwner($nested);

    expect($condition->matchElement($parent))->toBeTrue()
        ->and($condition->matchElement($nested))->toBeTrue()
        ->and($condition->matchElement($deeper))->toBeTrue();

    $entry->title = 'Other owner';
    expect($condition->matchElement($nested))->toBeFalse()
        ->and($condition->matchElement($deeper))->toBeFalse();
});

it('validates Entry-conditioned required fields on Blocks in nested Vizy fields', function() {
    $suffix = (string)mt_rand(100000, 999999);
    $text = new PlainText(['name' => 'CTA label', 'handle' => 'ctaLabelSpike' . $suffix]);
    expect(Craft::$app->getFields()->saveField($text))->toBeTrue(json_encode($text->getErrors()));
    craft\behaviors\CustomFieldBehavior::$fieldHandles[$text->handle] = true;

    $entry = VizyFixtureFactory::entry('Nested validation owner');
    $rule = new TypeConditionRule();
    $rule->setValues([$entry->getType()->uid]);
    $condition = VizyBlockElement::createCondition();
    $condition->setConditionRules([$rule]);
    $placement = new CustomField($text, ['required' => true]);
    $placement->setElementCondition($condition);
    $layout = new FieldLayout(['type' => VizyBlockElement::class]);
    $layout->setTabs([new FieldLayoutTab(['layout' => $layout, 'name' => 'Content', 'elements' => [$placement]])]);
    expect(Craft::$app->getFields()->saveLayout($layout))->toBeTrue();
    $layout = Craft::$app->getFields()->getLayoutById($layout->id);

    $block = static function(craft\base\ElementInterface $owner) use ($layout, $entry): VizyBlockElement {
        $block = new VizyBlockElement(['siteId' => $entry->siteId]);
        $block->setOwner($owner);
        $block->setField(VizyFixtureFactory::vizyField());
        $block->setFieldLayout($layout);
        $block->setScenario(Entry::SCENARIO_LIVE);

        return $block;
    };
    $root = $block($entry);
    $nested = $block($block($entry));

    expect($root->validate())->toBeFalse()
        ->and($root->getErrors($text->handle))->not->toBeEmpty();
    expect($nested->validate())->toBeFalse()
        ->and($nested->getErrors($text->handle))->not->toBeEmpty();
});
