<?php

declare(strict_types=1);

/**
 * Spike A — Ephemeral Block Element lifecycle (id = null).
 *
 * Proves what Craft APIs accept for a Vizy Block Element that is never persisted
 * and never assigned a fake Element ID. These tests protect the Vizy 4 invariant;
 * they do not freeze Vizy 3's rand()/MatrixAnchor ID behaviour.
 */

use Craft;
use craft\base\Element;
use craft\elements\Entry;
use craft\fieldlayoutelements\CustomField;
use craft\fields\PlainText;
use craft\models\FieldLayout;
use craft\models\FieldLayoutTab;
use Tests\Support\Fixtures\VizyFixtureFactory;
use verbb\vizy\elements\Block as VizyBlockElement;

it('creates an ephemeral Vizy Block Element with null Craft element id', function() {
    $owner = VizyFixtureFactory::entry('Ephemeral owner');
    $block = new VizyBlockElement();
    $block->setOwner($owner);

    expect($block->id)->toBeNull();
    expect($block->siteId)->toBe($owner->siteId);
    expect($block->getOwner()->id)->toBe($owner->id);
});

it('does not require a fake Block Element id for FieldLayout form rendering', function() {
    $suffix = (string)mt_rand(100000, 999999);
    $plainText = new PlainText([
        'name' => 'Heading',
        'handle' => 'headingSpike' . $suffix,
    ]);
    expect(Craft::$app->getFields()->saveField($plainText))->toBeTrue(
        json_encode($plainText->getErrors())
    );

    $layout = new FieldLayout(['type' => VizyBlockElement::class]);
    $layout->setTabs([
        new FieldLayoutTab([
            'layout' => $layout,
            'name' => 'Content',
            'elements' => [
                [
                    'type' => CustomField::class,
                    'fieldUid' => $plainText->uid,
                    'required' => true,
                ],
            ],
        ]),
    ]);
    expect(Craft::$app->getFields()->saveLayout($layout))->toBeTrue();

    $owner = VizyFixtureFactory::entry('Form owner');
    $block = new VizyBlockElement();
    $block->id = null;
    $block->setOwner($owner);
    $block->setFieldLayout($layout);

    $form = $layout->createForm($block, false);
    $html = $form->render();

    expect($block->id)->toBeNull();
    expect($html)->toBeString()->not->toBeEmpty();
    expect($html)->toContain('headingSpike' . $suffix);
});

it('runs Craft required-field validation on an ephemeral Block with null id', function() {
    $suffix = (string)mt_rand(100000, 999999);
    $handle = 'requiredHeadingSpike' . $suffix;
    $plainText = new PlainText([
        'name' => 'Required Heading',
        'handle' => $handle,
    ]);
    expect(Craft::$app->getFields()->saveField($plainText))->toBeTrue(
        json_encode($plainText->getErrors())
    );

    $layout = new FieldLayout(['type' => VizyBlockElement::class]);
    $layout->setTabs([
        new FieldLayoutTab([
            'layout' => $layout,
            'name' => 'Content',
            'elements' => [
                [
                    'type' => CustomField::class,
                    'fieldUid' => $plainText->uid,
                    'required' => true,
                ],
            ],
        ]),
    ]);
    expect(Craft::$app->getFields()->saveLayout($layout))->toBeTrue();

    $owner = new Entry(['title' => 'Validation owner']);
    $block = new VizyBlockElement();
    $block->id = null;
    $block->setOwner($owner);
    $block->setFieldLayout($layout);
    // Craft only enforces FieldLayout `required` under SCENARIO_LIVE (Element::afterValidate).
    $block->setScenario(Element::SCENARIO_LIVE);
    $block->setFieldValue($handle, '');

    $block->validate();

    expect($block->id)->toBeNull();
    // Craft stores custom-field validation errors under the field handle (not `field:{handle}`).
    expect($block->hasErrors($handle))->toBeTrue();

    $block->setFieldValue($handle, 'Filled');
    $block->clearErrors();
    $block->validate();

    expect($block->hasErrors($handle))->toBeFalse();
})->group('slow');

it('never assigns a fake Craft Element id on ephemeral Vizy Block Elements', function() {
    // Vizy 4 invariant — replace obsolete Vizy 3 `$block->id = rand()` characterization.
    $owner = VizyFixtureFactory::entry('No fake Block id');
    $block = new VizyBlockElement();
    $block->setOwner($owner);

    expect($block->id)->toBeNull();

    $elementSource = dirname(__DIR__, 2) . '/src/elements/Block.php';
    $documentSource = dirname(__DIR__, 2) . '/src/document/VizyDocument.php';
    expect(file_get_contents($elementSource))->not->toMatch('/\$\w+->id\s*=\s*rand\s*\(/')
        ->and(file_get_contents($documentSource))->not->toMatch('/\$\w+->id\s*=\s*rand\s*\(/');
});
