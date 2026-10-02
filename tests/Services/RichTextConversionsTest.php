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
}
