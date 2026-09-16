<?php

declare(strict_types=1);

use craft\behaviors\CustomFieldBehavior;
use craft\elements\Entry;
use craft\fieldlayoutelements\CustomField;
use craft\fields\PlainText;
use craft\helpers\StringHelper;
use craft\models\FieldLayout;
use craft\models\FieldLayoutTab;
use verbb\vizy\document\DocumentParser;
use verbb\vizy\document\VizyDocument;
use verbb\vizy\elements\Block;
use verbb\vizy\fields\VizyField;
use verbb\vizy\models\BlockType;
use verbb\vizy\Vizy;

it('projects one id-null Block lazily on first field access', function() {
    $suffix = StringHelper::randomString(6);
    $plainText = new PlainText([
        'name' => 'Lazy heading',
        'handle' => 'lazyHeading' . $suffix,
    ]);
    expect(Craft::$app->getFields()->saveField($plainText))->toBeTrue();
    CustomFieldBehavior::$fieldHandles[$plainText->handle] = true;

    $layout = new FieldLayout(['uid' => StringHelper::UUID(), 'type' => Block::class]);
    $layout->setTabs([new FieldLayoutTab([
        'layout' => $layout,
        'name' => 'Content',
        'elements' => [[
            'type' => CustomField::class,
            'fieldUid' => $plainText->uid,
        ]],
    ])]);
    $type = new BlockType([
        'uid' => StringHelper::UUID(),
        'name' => 'Lazy Block',
        'handle' => 'lazyBlock' . $suffix,
    ]);
    $type->setFieldLayout($layout);
    expect(Vizy::$plugin->getBlockTypes()->saveBlockType($type))->toBeTrue();
    $type = Vizy::$plugin->getBlockTypes()->getBlockTypeByUid($type->uid);
    $placementUid = $type->getFieldLayout()->getCustomFieldElements()[0]->uid;

    $field = new VizyField([
        'name' => 'Body',
        'handle' => 'body' . $suffix,
        'blockTypePickerGroups' => [[
            'name' => 'Blocks',
            'blockTypeUids' => [$type->uid],
        ]],
    ]);
    $owner = new Entry(['title' => 'Owner']);
    $document = (new DocumentParser())->parse([
        'type' => 'doc',
        'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
        'content' => [[
            'type' => 'vizyBlock',
            'attrs' => [
                'blockUid' => 'lazy-block-instance',
                'blockTypeUid' => $type->uid,
                'enabled' => true,
                'fieldSlots' => [$placementUid => 'Projected'],
            ],
        ]],
    ], $owner, $field);
    $block = $document->blocks()[0];

    expect($block->blockType())->toBe($type)
        ->and($block->hasField($plainText->handle))->toBeTrue()
        ->and($document->blockElementCreationCount())->toBe(0)
        ->and($block->fieldValue($plainText->handle))->toBe('Projected')
        ->and($document->blockElementCreationCount())->toBe(1)
        ->and($block->fieldValue($plainText->handle))->toBe('Projected')
        ->and($document->blockElementCreationCount())->toBe(1);

    $element = $document->blockElement($block);
    expect($element->id)->toBeNull()
        ->and($element->getOwner())->toBe($owner)
        ->and($element->getField())->toBe($field)
        ->and($element->getBlockUid())->toBe('lazy-block-instance');

    $duplicateDocument = (new DocumentParser())->parse([
        'type' => 'doc',
        'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
        'content' => [
            [
                'type' => 'vizyBlock',
                'attrs' => [
                    'blockUid' => 'ambiguous',
                    'blockTypeUid' => $type->uid,
                    'enabled' => true,
                    'fieldSlots' => [$placementUid => 'First'],
                ],
            ],
            [
                'type' => 'vizyBlock',
                'attrs' => [
                    'blockUid' => 'ambiguous',
                    'blockTypeUid' => $type->uid,
                    'enabled' => true,
                    'fieldSlots' => [$placementUid => 'Second'],
                ],
            ],
        ],
    ], $owner, $field);

    expect(fn() => $duplicateDocument->blocks()[0]->fieldValue($plainText->handle))
        ->toThrow(UnexpectedValueException::class, 'Duplicate Vizy Block UID makes lookup ambiguous')
        ->and($duplicateDocument->blockElementCreationCount())->toBe(0);
});
