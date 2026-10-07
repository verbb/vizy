<?php

namespace craft\ckeditor {
    use craft\fields\PlainText;

    if (!class_exists(Field::class)) {
        class Field extends PlainText
        {
        }
    }
}

namespace craft\redactor {
    use craft\fields\PlainText;

    if (!class_exists(Field::class)) {
        class Field extends PlainText
        {
        }
    }
}

namespace {
    use craft\db\Query;
    use craft\fieldlayoutelements\CustomField;
    use craft\fields\PlainText;
    use craft\helpers\FileHelper;
    use craft\helpers\Json;
    use craft\helpers\StringHelper;
    use craft\models\FieldLayout;
    use craft\models\FieldLayoutTab;
    use Tests\Support\Fixtures\VizyFixtureFactory;
    use verbb\vizy\Vizy;
    use verbb\vizy\db\Table as VizyTable;
    use verbb\vizy\fields\VizyField;

    function richTextConversionFixture(string $html, string $fieldClass = craft\ckeditor\Field::class): array
    {
        $suffix = StringHelper::randomString(8);
        $field = new $fieldClass(['name' => 'Legacy body', 'handle' => 'legacyBody' . $suffix]);
        expect(Craft::$app->fields->saveField($field))->toBeTrue();
        $owner = VizyFixtureFactory::entry('Rich-text conversion');
        $layout = $owner->getFieldLayout();
        $tab = $layout->getTabs()[0];
        $placement = new CustomField($field, ['uid' => StringHelper::UUID()]);
        $tab->setElements([...$tab->getElements(), $placement]);
        expect(Craft::$app->fields->saveLayout($layout))->toBeTrue();
        $where = ['elementId' => $owner->id, 'siteId' => $owner->siteId];
        $content = (new Query())->select('content')->from('{{%elements_sites}}')->where($where)->scalar();
        $content = is_string($content) ? Json::decode($content) : (array)$content;
        $content[$placement->uid] = $html;
        Craft::$app->db->createCommand()->update('{{%elements_sites}}', [
            'content' => new yii\db\JsonExpression($content),
        ], $where)->execute();

        return compact('field', 'owner', 'layout', 'placement');
    }

    function outboundVizyConversionFixture(string $html, bool $withBlock = false, bool $withDestination = true): array
    {
        $suffix = StringHelper::randomString(8);
        $field = new VizyField([
            'name' => 'Vizy body',
            'handle' => 'vizyBody' . $suffix,
            'editorMode' => VizyField::MODE_RICH_TEXT,
        ]);
        expect(Craft::$app->fields->saveField($field))->toBeTrue();
        $owner = VizyFixtureFactory::entry('Outbound Vizy conversion');
        $layout = $owner->getFieldLayout();
        $tab = $layout->getTabs()[0];
        $placement = new CustomField($field, ['uid' => StringHelper::UUID()]);
        $destinationField = null;
        $destinationPlacement = null;
        $elements = [...$tab->getElements(), $placement];

        if ($withDestination) {
            $destinationField = new PlainText([
                'name' => 'Converted body',
                'handle' => 'convertedBody' . $suffix,
                'multiline' => true,
            ]);
            expect(Craft::$app->getFields()->saveField($destinationField))->toBeTrue();
            $destinationPlacement = new CustomField($destinationField, ['uid' => StringHelper::UUID()]);
            $elements[] = $destinationPlacement;
        }

        $tab->setElements($elements);
        expect(Craft::$app->fields->saveLayout($layout))->toBeTrue();
        $document = Vizy::$plugin->getHtmlImporter()->convert($html, $field)->document()->toArray();

        if ($withBlock) {
            $document['content'][] = [
                'type' => 'vizyBlock',
                'attrs' => [
                    'blockUid' => StringHelper::UUID(),
                    'blockTypeUid' => StringHelper::UUID(),
                    'enabled' => true,
                    'fieldSlots' => ['discarded' => 'Block data'],
                ],
            ];
        }

        $where = ['elementId' => $owner->id, 'siteId' => $owner->siteId];
        $content = (new Query())->select('content')->from('{{%elements_sites}}')->where($where)->scalar();
        $content = is_string($content) ? Json::decode($content) : (array)$content;
        $content[$placement->uid] = Json::encode($document);
        Craft::$app->db->createCommand()->update('{{%elements_sites}}', [
            'content' => new yii\db\JsonExpression($content),
        ], $where)->execute();

        return compact('field', 'owner', 'layout', 'placement', 'document', 'destinationField', 'destinationPlacement');
    }

    it('builds a read-only CKEditor conversion plan from persisted field placements', function() {
        $fixture = richTextConversionFixture('<p>Hello <strong>world</strong>.</p>');
        $before = (new Query())->select('content')->from('{{%elements_sites}}')->where([
            'elementId' => $fixture['owner']->id,
            'siteId' => $fixture['owner']->siteId,
        ])->scalar();

        $plan = Vizy::$plugin->getRichTextConversions()->analyze($fixture['field']->handle);

        expect($plan['status'])->toBe('ready')
            ->and($plan['safeToApply'])->toBeFalse()
            ->and($plan['source']['type'])->toBe('craft\\ckeditor\\Field')
            ->and($plan['target']['editorConfig'])->toBe('standard')
            ->and($plan['content']['occurrences'])->toBe(1)
            ->and($plan['content']['populated'])->toBe(1)
            ->and($plan['content']['lossless'])->toBe(1)
            ->and($plan['content']['lossy'])->toBe(0)
            ->and($plan['content']['siteIds'])->toBe([$fixture['owner']->siteId])
            ->and($plan['locationMap']['roots'][$fixture['placement']->uid]['direct'])->toBeTrue()
            ->and($plan['planHash'])->toHaveLength(64);

        $after = (new Query())->select('content')->from('{{%elements_sites}}')->where([
            'elementId' => $fixture['owner']->id,
            'siteId' => $fixture['owner']->siteId,
        ])->scalar();
        expect($after)->toBe($before);
    });

    it('reports representative lossy HTML without changing source content', function() {
        $fixture = richTextConversionFixture('<marquee class="legacy">Keep this text</marquee>');
        $plan = Vizy::$plugin->getRichTextConversions()->analyze($fixture['field']->uid);

        expect($plan['status'])->toBe('requires-review')
            ->and($plan['content']['lossy'])->toBe(1)
            ->and($plan['content']['diagnosticCounts'])->not->toBeEmpty()
            ->and($plan['content']['samples'])->toHaveCount(1)
            ->and($plan['content']['samples'][0]['preview'])->toContain('Keep this text')
            ->and($plan['content']['samples'][0]['lossless'])->toBeFalse();
    });

    it('recognises Redactor fields through the same conversion plan', function() {
        $fixture = richTextConversionFixture('<p>Redactor content</p>', craft\redactor\Field::class);
        $plan = Vizy::$plugin->getRichTextConversions()->analyze($fixture['field']->handle);

        expect($plan['status'])->toBe('ready')
            ->and($plan['source']['type'])->toBe('craft\\redactor\\Field')
            ->and($plan['source']['editor'])->toBe('Redactor')
            ->and($plan['content']['lossless'])->toBe(1);
    });

    it('groups available source fields for the control-panel migration workflow', function() {
        $ckeditor = richTextConversionFixture('<p>CKEditor content</p>');
        $redactor = richTextConversionFixture('<p>Redactor content</p>', craft\redactor\Field::class);

        $sources = Vizy::$plugin->getRichTextConversions()->getSources();
        $ckeditorUids = array_column($sources['ckeditor']['fields'], 'uid');
        $redactorUids = array_column($sources['redactor']['fields'], 'uid');

        expect($sources['ckeditor']['type'])->toBe('craft\\ckeditor\\Field')
            ->and($sources['redactor']['type'])->toBe('craft\\redactor\\Field')
            ->and($ckeditorUids)->toContain($ckeditor['field']->uid)
            ->and($redactorUids)->toContain($redactor['field']->uid)
            ->and($sources['ckeditor']['fieldOptions'])->toContain([
                'label' => $ckeditor['field']->name . ' (' . $ckeditor['field']->handle . ')',
                'value' => $ckeditor['field']->uid,
            ])
            ->and($sources['redactor']['fieldOptions'])->toContain([
                'label' => $redactor['field']->name . ' (' . $redactor['field']->handle . ')',
                'value' => $redactor['field']->uid,
            ]);
    });

    it('compiles both control-panel migration screens', function() {
        $view = Craft::$app->getView();
        $templateMode = $view->getTemplateMode();
        $view->setTemplateMode(craft\web\View::TEMPLATE_MODE_CP);

        try {
            $toVizy = $view->getTwig()->load('vizy/settings/migrations/to-vizy');
            $fromVizy = $view->getTwig()->load('vizy/settings/migrations/from-vizy');
        } finally {
            $view->setTemplateMode($templateMode);
        }

        expect($toVizy)->not->toBeNull()
            ->and($fromVizy)->not->toBeNull();
    });

    it('converts content, checkpoints source HTML, and generates a deployable migration', function() {
        $sourceHtml = '<p>Deployable <strong>content</strong>.</p>';
        $fixture = richTextConversionFixture($sourceHtml);
        $migrator = Craft::$app->getContentMigrator();
        $originalMigrationPath = $migrator->migrationPath;
        $migrationPath = Craft::$app->getPath()->getTempPath() . DIRECTORY_SEPARATOR . 'vizy-rich-text-' . StringHelper::randomString(12);
        FileHelper::createDirectory($migrationPath);
        $migrator->migrationPath = $migrationPath;

        try {
            $result = Vizy::$plugin->getRichTextConversions()->convert($fixture['field']->handle);
            $generatedPath = $migrationPath . DIRECTORY_SEPARATOR . $result['migrationName'] . '.php';
            $generated = file_get_contents($generatedPath);
        } finally {
            $migrator->migrationPath = $originalMigrationPath;
            FileHelper::removeDirectory($migrationPath);
        }

        $convertedField = Craft::$app->getFields()->getFieldByUid($fixture['field']->uid);
        $rawContent = (new Query())->select('content')->from('{{%elements_sites}}')->where([
            'elementId' => $fixture['owner']->id,
            'siteId' => $fixture['owner']->siteId,
        ])->scalar();
        $rawContent = is_string($rawContent) ? Json::decode($rawContent) : (array)$rawContent;
        $canonical = $rawContent[$fixture['placement']->uid];
        $checkpoint = (new Query())->from(VizyTable::CONTENT_RECOVERY)->where([
            'ownerId' => $fixture['owner']->id,
            'fieldUid' => $fixture['field']->uid,
        ])->one();
        $checkpointSnapshot = $checkpoint ? Json::decode($checkpoint['snapshotJson']) : null;
        $analysis = $result['analysis'];
        $replay = Craft::$app->db->transaction(fn(): array => Vizy::$plugin->getRichTextConversions()->apply([
            'version' => 1,
            'fieldUid' => $analysis['source']['fieldUid'],
            'sourceType' => $analysis['source']['type'],
            'editorConfig' => $analysis['target']['editorConfig'],
            'editorConfigHash' => $analysis['target']['editorConfigHash'],
            'locationMapHash' => $analysis['locationMapHash'],
            'locationMap' => $analysis['locationMap'],
            'planHash' => $analysis['planHash'],
            'strict' => true,
        ]));

        expect($convertedField)->toBeInstanceOf(VizyField::class)
            ->and($result['strict'])->toBeTrue()
            ->and($generated)->toContain('BaseRichTextFieldConversionMigration')
            ->and($generated)->toContain($result['analysis']['planHash'])
            ->and($generated)->not->toContain($sourceHtml)
            ->and(Vizy::$plugin->getDocuments()->normalizeDetached($canonical)->toArray()['type'])->toBe('doc')
            ->and($checkpoint)->not->toBeFalse()
            ->and($checkpoint['reason'])->toBe('rich-text-conversion:' . $result['analysis']['planHash'])
            ->and($checkpointSnapshot['sites'][0]['value'])->toBe($sourceHtml)
            ->and($replay['converted'])->toBe(0)
            ->and($replay['alreadyCanonical'])->toBe(1)
            ->and($replay['checkpoints'])->toBe(0);
    });

    it('requires explicit acceptance before generating a lossy migration', function() {
        $fixture = richTextConversionFixture('<marquee>Legacy</marquee>');

        expect(fn() => Vizy::$plugin->getRichTextConversions()->convert($fixture['field']->handle))
            ->toThrow(RuntimeException::class, 'rerun with --allowLossy');
        expect(Craft::$app->getFields()->getFieldByUid($fixture['field']->uid))->toBeInstanceOf(craft\ckeditor\Field::class);
    });

    it('refuses non-rich-text fields and unknown editor configs', function() {
        $field = new PlainText(['name' => 'Plain', 'handle' => 'plain' . StringHelper::randomString(8)]);
        expect(Craft::$app->fields->saveField($field))->toBeTrue();
        expect(fn() => Vizy::$plugin->getRichTextConversions()->analyze($field->handle))
            ->toThrow(InvalidArgumentException::class, 'not a CKEditor or Redactor field');

        $fixture = richTextConversionFixture('<p>Valid</p>');
        expect(fn() => Vizy::$plugin->getRichTextConversions()->analyze($fixture['field']->handle, 'missing'))
            ->toThrow(InvalidArgumentException::class, 'Unknown Vizy Editor Config');
    });

    it('analyses outbound plain text conversion and reports discarded formatting and Blocks', function() {
        $fixture = outboundVizyConversionFixture('<p>Hello <strong>world</strong>.</p>', true);
        $plan = Vizy::$plugin->getRichTextConversions()->analyzeFromVizy(
            $fixture['field']->handle,
            $fixture['destinationField']->handle,
        );

        expect($plan['direction'])->toBe('from-vizy')
            ->and($plan['status'])->toBe('changes')
            ->and($plan['sourcePreserved'])->toBeTrue()
            ->and($plan['target']['type'])->toBe(PlainText::class)
            ->and($plan['target']['fieldUid'])->toBe($fixture['destinationField']->uid)
            ->and($plan['scope']['includedLayouts'])->toHaveCount(1)
            ->and($plan['scope']['placementMap'])->toBe([
                $fixture['placement']->uid => $fixture['destinationPlacement']->uid,
            ])
            ->and($plan['content']['lossy'])->toBe(1)
            ->and($plan['content']['diagnosticCounts'])->toHaveKeys([
                'formatting-discarded',
                'vizy-blocks-discarded',
            ])
            ->and($plan['content']['blockTypeCounts'])->toHaveCount(1)
            ->and($plan['content']['blockTypeCounts'][0]['count'])->toBe(1);
    });

    it('includes soft-deleted owners in outbound analysis', function() {
        $fixture = outboundVizyConversionFixture('<p>Retained trashed content.</p>');
        expect(Craft::$app->getElements()->deleteElement($fixture['owner']))->toBeTrue();

        $plan = Vizy::$plugin->getRichTextConversions()->analyzeFromVizy(
            $fixture['field']->handle,
            $fixture['destinationField']->handle,
        );

        expect($plan['status'])->toBe('ready')
            ->and($plan['content']['populated'])->toBe(1)
            ->and($plan['content']['failures'])->toBe(0)
            ->and($plan['content']['samples'][0]['destinationPreview'])->toBe('Retained trashed content.');
    });

    it('copies Vizy content to a separate multiline Plain Text field and preserves the source', function() {
        $fixture = outboundVizyConversionFixture('<p>Hello <strong>world</strong>.</p>');
        $migrator = Craft::$app->getContentMigrator();
        $originalMigrationPath = $migrator->migrationPath;
        $migrationPath = Craft::$app->getPath()->getTempPath() . DIRECTORY_SEPARATOR . 'vizy-outbound-' . StringHelper::randomString(12);
        FileHelper::createDirectory($migrationPath);
        $migrator->migrationPath = $migrationPath;

        try {
            $result = Vizy::$plugin->getRichTextConversions()->convertFromVizy(
                $fixture['field']->handle,
                $fixture['destinationField']->handle,
                25,
                true,
            );
            $generatedPath = $migrationPath . DIRECTORY_SEPARATOR . $result['migrationName'] . '.php';
            $generated = file_get_contents($generatedPath);
        } finally {
            $migrator->migrationPath = $originalMigrationPath;
            FileHelper::removeDirectory($migrationPath);
        }

        $sourceField = Craft::$app->getFields()->getFieldByUid($fixture['field']->uid);
        $destinationField = Craft::$app->getFields()->getFieldByUid($result['destinationFieldUid']);
        $layout = Craft::$app->getFields()->getLayoutById($fixture['layout']->id);
        $destinationPlacement = null;

        foreach ($layout->getCustomFieldElements() as $placement) {
            if ($placement->getFieldUid() === $result['destinationFieldUid']) {
                $destinationPlacement = $placement;
                break;
            }
        }

        $rawContent = (new Query())->select('content')->from('{{%elements_sites}}')->where([
            'elementId' => $fixture['owner']->id,
            'siteId' => $fixture['owner']->siteId,
        ])->scalar();
        $rawContent = is_string($rawContent) ? Json::decode($rawContent) : (array)$rawContent;
        $checkpoint = (new Query())->from(VizyTable::CONTENT_RECOVERY)->where([
            'ownerId' => $fixture['owner']->id,
            'fieldUid' => $fixture['field']->uid,
        ])->one();

        expect($sourceField)->toBeInstanceOf(VizyField::class)
            ->and($destinationField)->toBeInstanceOf(PlainText::class)
            ->and($destinationField->uid)->toBe($fixture['destinationField']->uid)
            ->and($destinationField->multiline)->toBeTrue()
            ->and($destinationPlacement)->not->toBeNull()
            ->and($rawContent[$fixture['placement']->uid])->toBe(Json::encode($fixture['document']))
            ->and($rawContent[$destinationPlacement->uid])->toBe('Hello world.')
            ->and($generated)->toContain('BaseVizyFieldConversionMigration')
            ->and($generated)->toContain($fixture['field']->uid)
            ->and($generated)->toContain($destinationField->uid)
            ->and($generated)->not->toContain('Hello world.')
            ->and($checkpoint)->toBeNull()
            ->and($result['sourcePreserved'])->toBeTrue();
    });

    it('refuses to overwrite divergent destination content during an outbound copy', function() {
        $fixture = outboundVizyConversionFixture('<p>Original Vizy content.</p>');
        $destinationField = new PlainText([
            'name' => 'Existing destination',
            'handle' => 'existingDestination' . StringHelper::randomString(8),
            'multiline' => true,
        ]);
        expect(Craft::$app->getFields()->saveField($destinationField))->toBeTrue();

        $layout = Craft::$app->getFields()->getLayoutById($fixture['layout']->id);
        $tab = $layout->getTabs()[0];
        $destinationPlacement = new CustomField($destinationField, ['uid' => StringHelper::UUID()]);
        $tab->setElements([...$tab->getElements(), $destinationPlacement]);
        expect(Craft::$app->getFields()->saveLayout($layout))->toBeTrue();

        $where = [
            'elementId' => $fixture['owner']->id,
            'siteId' => $fixture['owner']->siteId,
        ];
        $before = (new Query())->select('content')->from('{{%elements_sites}}')->where($where)->scalar();
        $content = is_string($before) ? Json::decode($before) : (array)$before;
        $content[$destinationPlacement->uid] = 'Existing destination content';
        Craft::$app->db->createCommand()->update('{{%elements_sites}}', [
            'content' => new yii\db\JsonExpression($content),
        ], $where)->execute();
        $sourceMap = Vizy::$plugin->getContent()->captureFieldLocations($fixture['field']->uid);

        expect(fn() => Craft::$app->db->transaction(fn(): array => Vizy::$plugin->getContent()->copyFieldValues(
            $sourceMap,
            [$fixture['placement']->uid => $destinationPlacement->uid],
            static fn(): string => 'Converted destination content',
            ['db' => Craft::$app->db],
        )))->toThrow(RuntimeException::class, 'destination field contains content that differs');

        $after = (new Query())->select('content')->from('{{%elements_sites}}')->where($where)->scalar();
        $after = is_string($after) ? Json::decode($after) : (array)$after;

        expect($after[$fixture['placement']->uid])->toBe(Json::encode($fixture['document']))
            ->and($after[$destinationPlacement->uid])->toBe('Existing destination content');
    });

    it('populates an empty destination value during an outbound copy', function() {
        $fixture = outboundVizyConversionFixture('<p>Original Vizy content.</p>');
        $destinationField = new PlainText([
            'name' => 'Empty destination',
            'handle' => 'emptyDestination' . StringHelper::randomString(8),
            'multiline' => true,
        ]);
        expect(Craft::$app->getFields()->saveField($destinationField))->toBeTrue();

        $layout = Craft::$app->getFields()->getLayoutById($fixture['layout']->id);
        $tab = $layout->getTabs()[0];
        $destinationPlacement = new CustomField($destinationField, ['uid' => StringHelper::UUID()]);
        $tab->setElements([...$tab->getElements(), $destinationPlacement]);
        expect(Craft::$app->getFields()->saveLayout($layout))->toBeTrue();

        $where = [
            'elementId' => $fixture['owner']->id,
            'siteId' => $fixture['owner']->siteId,
        ];
        $content = (new Query())->select('content')->from('{{%elements_sites}}')->where($where)->scalar();
        $content = is_string($content) ? Json::decode($content) : (array)$content;
        $content[$destinationPlacement->uid] = '';
        Craft::$app->db->createCommand()->update('{{%elements_sites}}', [
            'content' => new yii\db\JsonExpression($content),
        ], $where)->execute();
        $sourceMap = Vizy::$plugin->getContent()->captureFieldLocations($fixture['field']->uid);

        $result = Craft::$app->db->transaction(fn(): array => Vizy::$plugin->getContent()->copyFieldValues(
            $sourceMap,
            [$fixture['placement']->uid => $destinationPlacement->uid],
            static fn(): string => 'Converted destination content',
            ['db' => Craft::$app->db],
        ));
        $after = (new Query())->select('content')->from('{{%elements_sites}}')->where($where)->scalar();
        $after = is_string($after) ? Json::decode($after) : (array)$after;

        expect($result['copied'])->toBe(1)
            ->and($after[$fixture['placement']->uid])->toBe(Json::encode($fixture['document']))
            ->and($after[$destinationPlacement->uid])->toBe('Converted destination content');
    });

    it('requires explicit acceptance for lossy outbound conversion', function() {
        $fixture = outboundVizyConversionFixture('<p><strong>Formatted</strong></p>');

        expect(fn() => Vizy::$plugin->getRichTextConversions()->convertFromVizy(
            $fixture['field']->handle,
            $fixture['destinationField']->handle,
        ))
            ->toThrow(RuntimeException::class, 'explicitly accept');
        expect(Craft::$app->getFields()->getFieldByUid($fixture['field']->uid))->toBeInstanceOf(VizyField::class);
    });

    it('skips source-only layouts and blocks when no paired layout remains', function() {
        $fixture = outboundVizyConversionFixture('<p>Unpaired content.</p>', false, false);
        $destinationField = new PlainText([
            'name' => 'Unplaced destination',
            'handle' => 'unplacedDestination' . StringHelper::randomString(8),
            'multiline' => true,
        ]);
        expect(Craft::$app->getFields()->saveField($destinationField))->toBeTrue();

        $plan = Vizy::$plugin->getRichTextConversions()->analyzeFromVizy(
            $fixture['field']->handle,
            $destinationField->handle,
        );

        expect($plan['status'])->toBe('blocked')
            ->and($plan['safeToCopy'])->toBeFalse()
            ->and($plan['scope']['includedLayouts'])->toBeEmpty()
            ->and($plan['scope']['skippedLayouts'])->not->toBeEmpty()
            ->and($plan['content']['occurrences'])->toBe(0);
    });

    it('reports additional source-only layouts without expanding the copy scope', function() {
        $fixture = outboundVizyConversionFixture('<p>Paired content.</p>');
        $sourceOnlyLayout = new FieldLayout(['type' => craft\elements\Entry::class]);
        $sourceOnlyLayout->setTabs([
            new FieldLayoutTab([
                'layout' => $sourceOnlyLayout,
                'name' => 'Content',
                'elements' => [
                    new CustomField($fixture['field'], ['uid' => StringHelper::UUID()]),
                ],
            ]),
        ]);
        expect(Craft::$app->getFields()->saveLayout($sourceOnlyLayout))->toBeTrue();

        $plan = Vizy::$plugin->getRichTextConversions()->analyzeFromVizy(
            $fixture['field']->handle,
            $fixture['destinationField']->handle,
        );

        expect($plan['status'])->toBe('ready')
            ->and($plan['scope']['includedLayouts'])->toHaveCount(1)
            ->and($plan['scope']['skippedLayouts'])->not->toBeEmpty()
            ->and($plan['content']['occurrences'])->toBe(1);
    });
}
