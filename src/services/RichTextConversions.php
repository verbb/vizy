<?php
namespace verbb\vizy\services;

use verbb\vizy\Vizy;
use verbb\vizy\content\Change;
use verbb\vizy\document\VizyDocument;
use verbb\vizy\fields\VizyField;
use verbb\vizy\helpers\FieldPlacements;
use verbb\vizy\importers\HtmlImportDiagnostic;
use verbb\vizy\importers\HtmlImportOptions;

use Craft;
use craft\base\Component;
use craft\base\ElementInterface;
use craft\base\FieldInterface;
use craft\fields\MissingField;
use craft\fields\PlainText;
use craft\helpers\FileHelper;
use craft\helpers\Json;
use craft\helpers\ProjectConfig as ProjectConfigHelper;
use craft\helpers\StringHelper;
use craft\models\FieldLayout;

use InvalidArgumentException;
use RuntimeException;
use Throwable;

/**
 * Plans verified rich-text field conversions both to and from Vizy.
 */
final class RichTextConversions extends Component
{
    // Constants
    // =========================================================================

    public const CKEDITOR_FIELD = 'craft\\ckeditor\\Field';
    public const REDACTOR_FIELD = 'craft\\redactor\\Field';
    public const TARGET_PLAIN_TEXT = 'plain-text';
    public const TARGET_CKEDITOR = 'ckeditor';
    public const TARGET_REDACTOR = 'redactor';


    // Public Methods
    // =========================================================================

    /**
     * Returns the supported source editors and the fields currently using each one.
     */
    public function getSources(): array
    {
        $sources = [
            'ckeditor' => [
                'id' => 'ckeditor',
                'label' => 'CKEditor',
                'type' => self::CKEDITOR_FIELD,
                'fields' => [],
            ],
            'redactor' => [
                'id' => 'redactor',
                'label' => 'Redactor',
                'type' => self::REDACTOR_FIELD,
                'fields' => [],
            ],
        ];

        foreach (Craft::$app->getFields()->getAllFields() as $field) {
            $sourceType = $field instanceof MissingField ? $field->expectedType : $field::class;

            foreach ($sources as &$source) {
                if ($source['type'] !== $sourceType) {
                    continue;
                }
                $source['fields'][] = [
                    'uid' => $field->uid,
                    'handle' => $field->handle,
                    'name' => $field->name,
                    'label' => sprintf('%s (%s)', $field->name, $field->handle),
                ];
                break;
            }
            unset($source);
        }

        foreach ($sources as &$source) {
            usort(
                $source['fields'],
                static fn(array $a, array $b): int => strnatcasecmp($a['label'], $b['label']),
            );
            $source['fieldOptions'] = array_map(
                static fn(array $field): array => [
                    'label' => $field['label'],
                    'value' => $field['uid'],
                ],
                $source['fields'],
            );
            $source['fieldCount'] = count($source['fields']);
        }
        unset($source);

        return $sources;
    }

    /**
     * Returns Vizy fields which can be migrated to a portable destination.
     */
    public function getVizySources(): array
    {
        $fields = [];

        foreach (Craft::$app->getFields()->getAllFields() as $field) {
            if (!$field instanceof VizyField) {
                continue;
            }

            $fields[] = [
                'uid' => $field->uid,
                'handle' => $field->handle,
                'name' => $field->name,
                'label' => sprintf('%s (%s)', $field->name, $field->handle),
            ];
        }

        usort($fields, static fn(array $a, array $b): int => strnatcasecmp($a['label'], $b['label']));

        return [
            'fields' => $fields,
            'fieldOptions' => array_map(
                static fn(array $field): array => [
                    'label' => $field['label'],
                    'value' => $field['uid'],
                ],
                $fields,
            ),
            'fieldCount' => count($fields),
        ];
    }

    /**
     * Returns installed destination field types supported by outbound conversion.
     */
    public function getOutboundTargets(): array
    {
        $targets = [
            self::TARGET_PLAIN_TEXT => [
                'id' => self::TARGET_PLAIN_TEXT,
                'label' => Craft::t('vizy', 'Plain Text'),
                'type' => PlainText::class,
            ],
        ];

        foreach ([
            self::TARGET_CKEDITOR => ['label' => 'CKEditor', 'type' => self::CKEDITOR_FIELD, 'plugin' => 'ckeditor'],
            self::TARGET_REDACTOR => ['label' => 'Redactor', 'type' => self::REDACTOR_FIELD, 'plugin' => 'redactor'],
        ] as $id => $target) {
            if (!class_exists($target['type']) || !Craft::$app->getPlugins()->isPluginEnabled($target['plugin'])) {
                continue;
            }

            $targets[$id] = [
                'id' => $id,
                'label' => $target['label'],
                'type' => $target['type'],
            ];
        }

        return $targets;
    }

    /** Returns existing fields that can receive converted Vizy content. */
    public function getOutboundDestinations(): array
    {
        $targets = $this->getOutboundTargets();
        $fields = [];

        foreach (Craft::$app->getFields()->getAllFields() as $field) {
            foreach ($targets as $target) {
                if ($field::class !== $target['type']) {
                    continue;
                }

                $fields[] = [
                    'uid' => $field->uid,
                    'handle' => $field->handle,
                    'name' => $field->name,
                    'targetId' => $target['id'],
                    'type' => $target['type'],
                    'typeLabel' => $target['label'],
                    'label' => sprintf('%s — %s (%s)', $target['label'], $field->name, $field->handle),
                ];
                break;
            }
        }

        usort($fields, static fn(array $a, array $b): int => strnatcasecmp($a['label'], $b['label']));

        return [
            'fields' => $fields,
            'fieldOptions' => array_map(
                static fn(array $field): array => [
                    'label' => $field['label'],
                    'value' => $field['uid'],
                ],
                $fields,
            ),
            'fieldCount' => count($fields),
        ];
    }

    /**
     * Analyses a Vizy field without changing Project Config or content.
     */
    public function analyzeFromVizy(
        string $sourceSelector,
        string $destinationSelector,
        int $sampleLimit = 25,
    ): array {
        if ($sampleLimit < 0 || $sampleLimit > 1000) {
            throw new InvalidArgumentException('sampleLimit must be between 0 and 1000.');
        }

        $field = $this->_field($sourceSelector);

        if (!$field instanceof VizyField) {
            throw new InvalidArgumentException("Field '{$field->handle}' is not a Vizy field.");
        }

        $targetField = $this->_field($destinationSelector);

        if ($field->uid === $targetField->uid) {
            throw new InvalidArgumentException('Choose separate source and destination fields.');
        }

        $target = $this->_outboundTargetForField($targetField);
        $pairing = $this->_pairFieldLayouts($field, $targetField);
        $map = $this->_filterLocationMap(
            Vizy::$plugin->getContent()->captureFieldLocations($field->uid),
            $pairing['placementMap'],
        );
        $samples = [];
        $rowIds = [];
        $elementIds = [];
        $siteIds = [];
        $groups = [];
        $diagnosticCounts = [];
        $blockTypeCounts = [];
        $populated = 0;
        $empty = 0;
        $lossless = 0;
        $lossy = 0;
        $failures = 0;
        $scan = Vizy::$plugin->getContent()->modifyFieldValues($map, function(mixed $value, array $context) use (
            $field,
            $target,
            $targetField,
            &$samples,
            &$rowIds,
            &$elementIds,
            &$siteIds,
            &$groups,
            &$diagnosticCounts,
            &$blockTypeCounts,
            &$populated,
            &$empty,
            &$lossless,
            &$lossy,
            &$failures,
            $sampleLimit,
        ): array {
            $rowIds[(int)$context['rowId']] = true;
            $elementIds[(int)$context['elementId']] = true;
            $siteIds[(int)$context['siteId']] = true;
            $schemaPath = $this->_schemaPath($context);
            $groupKey = hash('sha256', Json::encode($schemaPath));

            if (!isset($groups[$groupKey])) {
                $groups[$groupKey] = ['path' => $schemaPath, 'occurrences' => 0];
            }
            $groups[$groupKey]['occurrences']++;

            if ($value === null || $value === '') {
                $empty++;
                return Change::unchanged();
            }

            $populated++;
            $sample = $this->_sample($context, $value);

            try {
                [$document, $owner] = $this->_outboundDocument($value, $context, $field);
                $assessment = $this->_outboundAssessment($document->toArray(), $target['id']);
                $destinationValue = $this->_outboundValue($document, $owner, $targetField, $target['id']);
                $sample['lossless'] = $assessment['diagnostics'] === [];
                $sample['diagnostics'] = $assessment['diagnostics'];
                $sample['sourcePreview'] = Vizy::$plugin->getRenderer()->renderPortableDocument($document);
                $sample['destinationPreview'] = $destinationValue;

                foreach ($assessment['diagnostics'] as $diagnostic) {
                    $code = $diagnostic['code'];
                    $diagnosticCounts[$code] = ($diagnosticCounts[$code] ?? 0) + 1;
                }

                foreach ($assessment['blockTypes'] as $uid => $count) {
                    $blockTypeCounts[$uid] = ($blockTypeCounts[$uid] ?? 0) + $count;
                }

                if ($sample['lossless']) {
                    $lossless++;
                } else {
                    $lossy++;
                }
            } catch (Throwable $exception) {
                $failures++;
                $sample['error'] = $exception->getMessage();
            }

            if (count($samples) < $sampleLimit) {
                $samples[] = $sample;
            }

            return Change::unchanged();
        }, ['dryRun' => true]);

        ksort($diagnosticCounts);
        ksort($groups);
        ksort($blockTypeCounts);
        $siteIds = array_map('intval', array_keys($siteIds));
        sort($siteIds);
        $blocked = $pairing['placementMap'] === [] || $pairing['ambiguous'] !== [] || $failures > 0;
        $status = $blocked ? 'blocked' : ($lossy > 0 ? 'changes' : 'ready');
        $sourceSettings = $field->getSettings();
        $targetSettings = $targetField->getSettings();
        $plan = [
            'version' => 1,
            'direction' => 'from-vizy',
            'status' => $status,
            'safeToApply' => false,
            'safeToCopy' => !$blocked,
            'sourcePreserved' => true,
            'source' => [
                'fieldUid' => $field->uid,
                'handle' => $field->handle,
                'name' => $field->name,
                'type' => VizyField::class,
                'settings' => $sourceSettings,
                'settingsHash' => $this->_settingsHash($sourceSettings),
            ],
            'target' => [
                'id' => $target['id'],
                'label' => $target['label'],
                'type' => $target['type'],
                'fieldUid' => $targetField->uid,
                'name' => $targetField->name,
                'handle' => $targetField->handle,
                'settings' => $targetSettings,
                'settingsHash' => $this->_settingsHash($targetSettings),
            ],
            'scope' => [
                'includedLayouts' => $pairing['included'],
                'skippedLayouts' => $pairing['skipped'],
                'ambiguousLayouts' => $pairing['ambiguous'],
                'placementMap' => $pairing['placementMap'],
            ],
            'content' => [
                'occurrences' => $scan['matched'],
                'populated' => $populated,
                'empty' => $empty,
                'lossless' => $lossless,
                'lossy' => $lossy,
                'failures' => $failures,
                'rows' => count($rowIds),
                'elements' => count($elementIds),
                'siteIds' => $siteIds,
                'locationGroups' => array_values($groups),
                'diagnosticCounts' => $diagnosticCounts,
                'blockTypeCounts' => $this->_blockTypeLabels($blockTypeCounts),
                'samples' => $samples,
                'samplesTruncated' => $populated > count($samples),
            ],
            'locationMapHash' => hash('sha256', Json::encode($map)),
            'locationMap' => $map,
            'nextStep' => match ($status) {
                'blocked' => 'Resolve the layout or conversion problems and run the analysis again. No field or content has been changed.',
                'changes' => 'Review what the destination cannot represent, then confirm the copy. The source Vizy field and its content will remain unchanged.',
                default => 'Analysis is complete. Confirm the copy to populate the existing destination field without changing the source Vizy field.',
            },
        ];
        $plan['planHash'] = hash('sha256', Json::encode($plan));

        return $plan;
    }

    public function analyze(string $fieldSelector, string $editorConfig = 'standard', int $sampleLimit = 25): array
    {
        if ($sampleLimit < 0 || $sampleLimit > 1000) {
            throw new InvalidArgumentException('sampleLimit must be between 0 and 1000.');
        }
        $field = $this->_field($fieldSelector);
        $sourceType = $field instanceof MissingField ? $field->expectedType : $field::class;

        if (!in_array($sourceType, [self::CKEDITOR_FIELD, self::REDACTOR_FIELD], true)) {
            throw new InvalidArgumentException("Field '{$field->handle}' is not a CKEditor or Redactor field.");
        }
        $editorConfigData = Vizy::$plugin->getEditorConfigs()->getConfig($editorConfig);

        if ($editorConfigData === null) {
            throw new InvalidArgumentException("Unknown Vizy Editor Config: {$editorConfig}.");
        }
        $targetField = new VizyField([
            'uid' => $field->uid,
            'name' => $field->name,
            'handle' => $field->handle,
            'editorConfig' => $editorConfig,
            'editorMode' => VizyField::MODE_RICH_TEXT,
        ]);
        $map = Vizy::$plugin->getContent()->captureFieldLocations($field->uid);
        $samples = [];
        $rowIds = [];
        $elementIds = [];
        $siteIds = [];
        $groups = [];
        $diagnosticCounts = [];
        $populated = 0;
        $empty = 0;
        $lossless = 0;
        $lossy = 0;
        $failures = 0;
        $scan = Vizy::$plugin->getContent()->modifyFieldValues($map, function(mixed $value, array $context) use (
            $targetField,
            &$samples,
            &$rowIds,
            &$elementIds,
            &$siteIds,
            &$groups,
            &$diagnosticCounts,
            &$populated,
            &$empty,
            &$lossless,
            &$lossy,
            &$failures,
            $sampleLimit,
        ): array {
            $rowIds[(int)$context['rowId']] = true;
            $elementIds[(int)$context['elementId']] = true;
            $siteIds[(int)$context['siteId']] = true;
            $schemaPath = $this->_schemaPath($context);
            $groupKey = hash('sha256', Json::encode($schemaPath));

            if (!isset($groups[$groupKey])) {
                $groups[$groupKey] = ['path' => $schemaPath, 'occurrences' => 0];
            }
            $groups[$groupKey]['occurrences']++;

            if ($value === null || (is_string($value) && trim($value) === '')) {
                $empty++;
                return Change::unchanged();
            }
            $populated++;
            $sample = $this->_sample($context, $value);

            if (!is_string($value)) {
                $failures++;
                $sample['error'] = 'The stored rich-text value is not a string.';

                if (count($samples) < $sampleLimit) {
                    $samples[] = $sample;
                }
                return Change::unchanged();
            }

            try {
                $result = Vizy::$plugin->getHtmlImporter()->convert($value, $targetField);
                $sample['lossless'] = $result->isLossless();
                $sample['diagnostics'] = array_map(
                    static fn(HtmlImportDiagnostic $diagnostic): array => $diagnostic->toArray(),
                    $result->diagnostics(),
                );

                foreach ($result->diagnostics() as $diagnostic) {
                    if ($diagnostic instanceof HtmlImportDiagnostic) {
                        $diagnosticCounts[$diagnostic->code] = ($diagnosticCounts[$diagnostic->code] ?? 0) + 1;
                    }
                }

                if ($result->isLossless()) {
                    $lossless++;
                } else {
                    $lossy++;
                }
            } catch (Throwable $exception) {
                $failures++;
                $sample['error'] = $exception->getMessage();
            }

            if (count($samples) < $sampleLimit && (isset($sample['error']) || !$sample['lossless'])) {
                $samples[] = $sample;
            }
            return Change::unchanged();
        }, ['dryRun' => true]);

        ksort($diagnosticCounts);
        ksort($groups);
        $siteIds = array_map('intval', array_keys($siteIds));
        sort($siteIds);
        $status = $failures > 0 ? 'blocked' : ($lossy > 0 ? 'requires-review' : 'ready');
        $plan = [
            'version' => 1,
            'status' => $status,
            'safeToApply' => false,
            'source' => [
                'fieldUid' => $field->uid,
                'handle' => $field->handle,
                'name' => $field->name,
                'type' => $sourceType,
                'editor' => $sourceType === self::CKEDITOR_FIELD ? 'CKEditor' : 'Redactor',
            ],
            'target' => [
                'type' => VizyField::class,
                'editorConfig' => $editorConfig,
                'editorConfigHash' => $this->_editorConfigHash($editorConfigData),
                'editorMode' => VizyField::MODE_RICH_TEXT,
            ],
            'content' => [
                'occurrences' => $scan['matched'],
                'populated' => $populated,
                'empty' => $empty,
                'lossless' => $lossless,
                'lossy' => $lossy,
                'failures' => $failures,
                'rows' => count($rowIds),
                'elements' => count($elementIds),
                'siteIds' => $siteIds,
                'locationGroups' => array_values($groups),
                'diagnosticCounts' => $diagnosticCounts,
                'samples' => $samples,
                'samplesTruncated' => ($lossy + $failures) > count($samples),
            ],
            'locationMapHash' => hash('sha256', Json::encode($map)),
            'locationMap' => $map,
            'nextStep' => match ($status) {
                'blocked' => 'Resolve every conversion error and run the analysis again. No field or content has been changed.',
                'requires-review' => 'Review every lossy diagnostic before choosing an explicit conversion policy. No field or content has been changed.',
                default => "Analysis is complete. No field or content has been changed; run 'php craft vizy/convert/field {$field->handle}' to checkpoint, convert, and verify it.",
            },
        ];
        $plan['planHash'] = hash('sha256', Json::encode($plan));

        return $plan;
    }

    /**
     * Applies a generated, environment-independent plan inside its content migration transaction.
     */
    public function apply(array $plan): array
    {
        $this->_validateApplyPlan($plan);
        $field = Craft::$app->getFields()->getFieldByUid($plan['fieldUid']);

        if (!$field instanceof VizyField) {
            throw new RuntimeException('Apply Project Config so the source field is a Vizy field before running its content migration.');
        }

        if ($field->editorConfig !== $plan['editorConfig']) {
            throw new RuntimeException("The Vizy field does not use the planned Editor Config '{$plan['editorConfig']}'.");
        }
        $currentLocationMapHash = hash('sha256', Json::encode(Vizy::$plugin->getContent()->captureFieldLocations($plan['fieldUid'])));

        if (!hash_equals($plan['locationMapHash'], $currentLocationMapHash)) {
            throw new RuntimeException('The planned field placements have changed. Restore the reviewed Project Config or generate a new conversion plan.');
        }
        $config = Vizy::$plugin->getEditorConfigs()->getConfig($field->editorConfig);

        if ($config === null || !hash_equals($plan['editorConfigHash'], $this->_editorConfigHash($config))) {
            throw new RuntimeException('The planned Vizy Editor Config has changed. Generate a new conversion plan before applying it.');
        }
        $db = Craft::$app->getDb();

        if (!$db->getTransaction()?->getIsActive()) {
            throw new RuntimeException('Rich-text conversion writes require an active content migration transaction.');
        }
        $checkpoints = [];
        $alreadyCanonical = 0;
        $converted = 0;
        $lossy = 0;
        $diagnosticCounts = [];
        $write = Vizy::$plugin->getContent()->modifyFieldValues($plan['locationMap'], function(mixed $value, array $context) use (
            $field,
            $plan,
            &$checkpoints,
            &$alreadyCanonical,
            &$converted,
            &$lossy,
            &$diagnosticCounts,
        ): array {
            if ($value === null) {
                return Change::unchanged();
            }

            try {
                Vizy::$plugin->getDocuments()->normalizeDetached($value);
                $alreadyCanonical++;
                return Change::unchanged();
            } catch (Throwable) {
                // Source HTML is expected until this exact occurrence is converted.
            }

            if (!is_string($value)) {
                throw new RuntimeException('A planned rich-text value is neither source HTML nor a canonical Vizy document.');
            }
            $this->_checkpoint($context, $field, $plan['planHash'], $checkpoints);
            $result = Vizy::$plugin->getHtmlImporter()->convert(
                $value,
                $field,
                new HtmlImportOptions(strict: $plan['strict']),
            );

            if (!$result->isLossless()) {
                $lossy++;
            }

            foreach ($result->diagnostics() as $diagnostic) {
                if ($diagnostic instanceof HtmlImportDiagnostic) {
                    $diagnosticCounts[$diagnostic->code] = ($diagnosticCounts[$diagnostic->code] ?? 0) + 1;
                }
            }
            $canonical = Vizy::$plugin->getDocuments()->serializeValue($result->document());
            Vizy::$plugin->getDocuments()->normalizeDetached($canonical);
            $converted++;

            return Change::replace($canonical);
        }, ['db' => $db]);
        $verification = ['occurrences' => 0, 'canonical' => 0, 'empty' => 0];
        Vizy::$plugin->getContent()->modifyFieldValues($plan['locationMap'], function(mixed $value) use (&$verification): array {
            $verification['occurrences']++;

            if ($value === null) {
                $verification['empty']++;
                return Change::unchanged();
            }
            Vizy::$plugin->getDocuments()->normalizeDetached($value);
            $verification['canonical']++;
            return Change::unchanged();
        }, ['db' => $db, 'dryRun' => true]);
        ksort($diagnosticCounts);

        if ($verification['occurrences'] !== $write['matched']) {
            throw new RuntimeException('Rich-text conversion verification found a different number of field occurrences.');
        }
        return [
            'planHash' => $plan['planHash'],
            'fieldUid' => $plan['fieldUid'],
            'checkpoints' => count($checkpoints),
            'converted' => $converted,
            'alreadyCanonical' => $alreadyCanonical,
            'lossy' => $lossy,
            'diagnosticCounts' => $diagnosticCounts,
            'write' => $write,
            'verification' => $verification,
        ];
    }

    /**
     * Generates, applies, and verifies a deployable content migration.
     */
    public function convert(
        string $fieldSelector,
        string $editorConfig = 'standard',
        int $sampleLimit = 25,
        bool $allowLossy = false,
    ): array {
        $analysis = $this->analyze($fieldSelector, $editorConfig, $sampleLimit);

        if ($analysis['status'] === 'blocked') {
            throw new RuntimeException('The rich-text conversion analysis is blocked. Resolve its failures before converting the field.');
        }

        if ($analysis['status'] === 'requires-review' && !$allowLossy) {
            throw new RuntimeException('The rich-text conversion would be lossy. Review the analysis and rerun with --allowLossy only if those diagnostics are acceptable.');
        }
        $applyPlan = [
            'version' => 1,
            'fieldUid' => $analysis['source']['fieldUid'],
            'sourceType' => $analysis['source']['type'],
            'editorConfig' => $analysis['target']['editorConfig'],
            'editorConfigHash' => $analysis['target']['editorConfigHash'],
            'locationMapHash' => $analysis['locationMapHash'],
            'locationMap' => $analysis['locationMap'],
            'planHash' => $analysis['planHash'],
            'strict' => !$allowLossy,
        ];
        $contentMigrator = Craft::$app->getContentMigrator();
        $migrationName = sprintf(
            'm%s_convert_%s_to_vizy',
            gmdate('ymd_His'),
            StringHelper::toSnakeCase($analysis['source']['handle']),
        );
        $migrationPath = $contentMigrator->migrationPath . DIRECTORY_SEPARATOR . $migrationName . '.php';

        if (is_file($migrationPath)) {
            throw new RuntimeException("Content migration already exists: {$migrationPath}");
        }
        FileHelper::createDirectory($contentMigrator->migrationPath);
        FileHelper::writeToFile($migrationPath, $this->migrationCode(
            $contentMigrator->migrationNamespace,
            $migrationName,
            $applyPlan,
        ));
        $projectConfig = Craft::$app->getProjectConfig();
        $fieldPath = 'fields.' . $applyPlan['fieldUid'];
        $sourceConfig = $projectConfig->get($fieldPath);

        if (!is_array($sourceConfig)) {
            FileHelper::unlink($migrationPath);
            throw new RuntimeException('The source field does not have a Project Config definition.');
        }
        $targetField = new VizyField([
            'uid' => $applyPlan['fieldUid'],
            'name' => $analysis['source']['name'],
            'handle' => $analysis['source']['handle'],
            'editorConfig' => $editorConfig,
            'editorMode' => VizyField::MODE_RICH_TEXT,
        ]);
        $targetConfig = $sourceConfig;
        $targetConfig['type'] = VizyField::class;
        $targetConfig['settings'] = ProjectConfigHelper::packAssociativeArrays($targetField->getSettings());

        try {
            $projectConfig->set($fieldPath, $targetConfig);
            $convertedField = Craft::$app->getFields()->getFieldByUid($applyPlan['fieldUid']);

            if (!$convertedField instanceof VizyField) {
                throw new RuntimeException('Project Config did not replace the source field with a Vizy field.');
            }
            $contentMigrator->migrateUp($migrationName);
        } catch (Throwable $exception) {
            $projectConfig->set($fieldPath, $sourceConfig);
            FileHelper::unlink($migrationPath);
            throw $exception;
        }
        return [
            'analysis' => $analysis,
            'migrationName' => $migrationName,
            'migrationPath' => FileHelper::relativePath($migrationPath),
            'projectConfigPath' => $fieldPath,
            'strict' => $applyPlan['strict'],
            'nextStep' => 'Commit the generated content migration and Project Config changes together. Other environments will apply Project Config before replaying the content migration through craft up.',
        ];
    }

    public function migrationCode(string $namespace, string $className, array $plan): string
    {
        $properties = [
            'fieldUid' => $plan['fieldUid'],
            'sourceType' => $plan['sourceType'],
            'editorConfig' => $plan['editorConfig'],
            'editorConfigHash' => $plan['editorConfigHash'],
            'locationMapHash' => $plan['locationMapHash'],
            'planHash' => $plan['planHash'],
        ];
        $lines = [];

        foreach ($properties as $name => $value) {
            $lines[] = '    public string $' . $name . ' = ' . var_export($value, true) . ';';
        }
        $lines[] = '    public array $locationMap = ' . preg_replace('/^/m', '    ', var_export($plan['locationMap'], true)) . ';';
        $lines[] = '    public bool $strict = ' . ($plan['strict'] ? 'true' : 'false') . ';';

        return "<?php\n\nnamespace {$namespace};\n\n"
            . "use verbb\\vizy\\migrations\\BaseRichTextFieldConversionMigration;\n\n"
            . "/**\n * Converts {$plan['sourceType']} field content to canonical Vizy documents.\n */\n"
            . "final class {$className} extends BaseRichTextFieldConversionMigration\n{\n"
            . implode("\n", $lines)
            . "\n}\n";
    }

    /**
     * Applies a generated outbound plan inside its content migration transaction.
     */
    public function applyFromVizy(array $plan): array
    {
        $this->_validateOutboundApplyPlan($plan);
        $sourceField = Craft::$app->getFields()->getFieldByUid($plan['sourceFieldUid']);
        $targetField = Craft::$app->getFields()->getFieldByUid($plan['destinationFieldUid']);

        if (!$sourceField instanceof VizyField) {
            throw new RuntimeException('The source Vizy field must remain installed while the destination is populated.');
        }

        if (!hash_equals($plan['sourceSettingsHash'], $this->_settingsHash($sourceField->getSettings()))) {
            throw new RuntimeException('The source Vizy field settings have changed. Generate a new content migration before copying content.');
        }

        if (!$targetField || $targetField::class !== $plan['targetType']) {
            throw new RuntimeException('Apply Project Config so the planned destination field exists before running its content migration.');
        }

        if (!hash_equals($plan['targetSettingsHash'], $this->_settingsHash($targetField->getSettings()))) {
            throw new RuntimeException('The destination field settings have changed. Restore the reviewed Project Config or generate a new conversion plan.');
        }

        $pairing = $this->_pairFieldLayouts($sourceField, $targetField);

        if ($pairing['placementMap'] !== $plan['placementMap']) {
            throw new RuntimeException('The shared source and destination field layouts have changed. Restore the reviewed Project Config or generate a new content migration.');
        }

        $currentSourceMap = $this->_filterLocationMap(
            Vizy::$plugin->getContent()->captureFieldLocations($plan['sourceFieldUid']),
            $plan['placementMap'],
        );
        $currentSourceMapHash = hash('sha256', Json::encode($currentSourceMap));
        $currentDestinationMap = $this->_filterLocationMap(
            Vizy::$plugin->getContent()->captureFieldLocations($plan['destinationFieldUid']),
            array_flip($plan['placementMap']),
        );
        $currentDestinationMapHash = hash('sha256', Json::encode($currentDestinationMap));

        if (!hash_equals($plan['sourceLocationMapHash'], $currentSourceMapHash)
            || !hash_equals($plan['destinationLocationMapHash'], $currentDestinationMapHash)) {
            throw new RuntimeException('The source or destination field placements have changed. Restore the reviewed Project Config or generate a new content migration.');
        }

        $this->_validatePlacementMap($currentSourceMap, $currentDestinationMap, $plan['placementMap']);

        $db = Craft::$app->getDb();

        if (!$db->getTransaction()?->getIsActive()) {
            throw new RuntimeException('Outbound Vizy copies require an active content migration transaction.');
        }

        $lossy = 0;
        $diagnosticCounts = [];
        $convert = function(mixed $value, array $context) use (
            $sourceField,
            $targetField,
            $plan,
            &$lossy,
            &$diagnosticCounts,
        ): string {
            if ($value === null || $value === '') {
                return '';
            }

            [$document, $owner] = $this->_outboundDocument($value, $context, $sourceField);
            $assessment = $this->_outboundAssessment($document->toArray(), $plan['targetId']);

            if ($plan['strict'] && $assessment['diagnostics'] !== []) {
                throw new RuntimeException('The Vizy value now contains content that was not accepted by the reviewed lossless plan.');
            }

            $replacement = $this->_outboundValue($document, $owner, $targetField, $plan['targetId']);

            if ($assessment['diagnostics'] !== []) {
                $lossy++;
            }

            foreach ($assessment['diagnostics'] as $diagnostic) {
                $code = $diagnostic['code'];
                $diagnosticCounts[$code] = ($diagnosticCounts[$code] ?? 0) + 1;
            }

            return $replacement;
        };
        $write = Vizy::$plugin->getContent()->copyFieldValues(
            $plan['sourceLocationMap'],
            $plan['placementMap'],
            $convert,
            ['db' => $db],
        );
        $writeLossy = $lossy;
        $writeDiagnosticCounts = $diagnosticCounts;
        $verification = Vizy::$plugin->getContent()->copyFieldValues(
            $plan['sourceLocationMap'],
            $plan['placementMap'],
            $convert,
            ['db' => $db, 'dryRun' => true],
        );
        ksort($writeDiagnosticCounts);

        if ($verification['matched'] !== $write['matched'] || $verification['copied'] !== 0) {
            throw new RuntimeException('Outbound copy verification did not find every converted destination value.');
        }

        return [
            'planHash' => $plan['planHash'],
            'sourceFieldUid' => $plan['sourceFieldUid'],
            'destinationFieldUid' => $plan['destinationFieldUid'],
            'targetId' => $plan['targetId'],
            'sourcePreserved' => true,
            'lossy' => $writeLossy,
            'diagnosticCounts' => $writeDiagnosticCounts,
            'write' => $write,
            'verification' => $verification,
        ];
    }

    /**
     * Converts a Vizy field to Plain Text, CKEditor, or Redactor.
     */
    public function convertFromVizy(
        string $sourceSelector,
        string $destinationSelector,
        int $sampleLimit = 25,
        bool $allowLossy = false,
    ): array {
        $analysis = $this->analyzeFromVizy(
            $sourceSelector,
            $destinationSelector,
            $sampleLimit,
        );

        if ($analysis['status'] === 'blocked') {
            throw new RuntimeException('The outbound Vizy conversion analysis is blocked. Resolve its failures before converting the field.');
        }

        if ($analysis['status'] === 'changes' && !$allowLossy) {
            throw new RuntimeException('The outbound Vizy conversion would discard or flatten content. Review the analysis and explicitly accept the listed loss before continuing.');
        }

        $sourceField = $this->_field($analysis['source']['fieldUid']);

        if (!$sourceField instanceof VizyField) {
            throw new RuntimeException('The source field is no longer a Vizy field.');
        }

        $targetField = $this->_field($analysis['target']['fieldUid']);

        $this->_outboundTargetForField($targetField);

        $migrationPath = null;

        try {
            $placementMap = $analysis['scope']['placementMap'];
            $sourceLocationMap = $this->_filterLocationMap(
                Vizy::$plugin->getContent()->captureFieldLocations($sourceField->uid),
                $placementMap,
            );
            $destinationLocationMap = $this->_filterLocationMap(
                Vizy::$plugin->getContent()->captureFieldLocations($targetField->uid),
                array_flip($placementMap),
            );
            $this->_validatePlacementMap($sourceLocationMap, $destinationLocationMap, $placementMap);
            $applyPlan = [
                'version' => 3,
                'sourceFieldUid' => $sourceField->uid,
                'destinationFieldUid' => $targetField->uid,
                'sourceSettings' => $analysis['source']['settings'],
                'sourceSettingsHash' => $analysis['source']['settingsHash'],
                'targetId' => $analysis['target']['id'],
                'targetType' => $analysis['target']['type'],
                'targetSettings' => $targetField->getSettings(),
                'targetSettingsHash' => $this->_settingsHash($targetField->getSettings()),
                'sourceLocationMapHash' => hash('sha256', Json::encode($sourceLocationMap)),
                'destinationLocationMapHash' => hash('sha256', Json::encode($destinationLocationMap)),
                'sourceLocationMap' => $sourceLocationMap,
                'placementMap' => $placementMap,
                'strict' => !$allowLossy,
            ];
            $applyPlan['planHash'] = hash('sha256', Json::encode($applyPlan));
            $contentMigrator = Craft::$app->getContentMigrator();
            $migrationName = sprintf(
                'm%s_copy_vizy_%s_to_%s',
                gmdate('ymd_His'),
                StringHelper::toSnakeCase($analysis['source']['handle']),
                StringHelper::toSnakeCase($analysis['target']['handle']),
            );
            $migrationPath = $contentMigrator->migrationPath . DIRECTORY_SEPARATOR . $migrationName . '.php';

            if (is_file($migrationPath)) {
                throw new RuntimeException("Content migration already exists: {$migrationPath}");
            }

            FileHelper::createDirectory($contentMigrator->migrationPath);
            FileHelper::writeToFile($migrationPath, $this->outboundMigrationCode(
                $contentMigrator->migrationNamespace,
                $migrationName,
                $applyPlan,
            ));
            $contentMigrator->migrateUp($migrationName);
        } catch (Throwable $exception) {
            if ($migrationPath !== null && is_file($migrationPath)) {
                FileHelper::unlink($migrationPath);
            }

            throw $exception;
        }

        return [
            'analysis' => $analysis,
            'migrationName' => $migrationName,
            'migrationPath' => FileHelper::relativePath($migrationPath),
            'sourceFieldUid' => $sourceField->uid,
            'destinationFieldUid' => $targetField->uid,
            'destinationFieldName' => $targetField->name,
            'destinationFieldHandle' => $targetField->handle,
            'strict' => $applyPlan['strict'],
            'sourcePreserved' => true,
            'nextStep' => 'Verify the destination field while the original Vizy field remains unchanged. Commit the generated content migration, deploy the already-prepared field layout Project Config first, and cut over only after every environment has applied and verified the copy.',
        ];
    }

    public function outboundMigrationCode(string $namespace, string $className, array $plan): string
    {
        $lines = [
            '    public string $sourceFieldUid = ' . var_export($plan['sourceFieldUid'], true) . ';',
            '    public string $destinationFieldUid = ' . var_export($plan['destinationFieldUid'], true) . ';',
            '    public string $sourceSettingsHash = ' . var_export($plan['sourceSettingsHash'], true) . ';',
            '    public string $targetId = ' . var_export($plan['targetId'], true) . ';',
            '    public string $targetType = ' . var_export($plan['targetType'], true) . ';',
            '    public string $targetSettingsHash = ' . var_export($plan['targetSettingsHash'], true) . ';',
            '    public string $sourceLocationMapHash = ' . var_export($plan['sourceLocationMapHash'], true) . ';',
            '    public string $destinationLocationMapHash = ' . var_export($plan['destinationLocationMapHash'], true) . ';',
            '    public string $planHash = ' . var_export($plan['planHash'], true) . ';',
            '    public array $sourceSettings = ' . preg_replace('/^/m', '    ', var_export($plan['sourceSettings'], true)) . ';',
            '    public array $targetSettings = ' . preg_replace('/^/m', '    ', var_export($plan['targetSettings'], true)) . ';',
            '    public array $sourceLocationMap = ' . preg_replace('/^/m', '    ', var_export($plan['sourceLocationMap'], true)) . ';',
            '    public array $placementMap = ' . preg_replace('/^/m', '    ', var_export($plan['placementMap'], true)) . ';',
            '    public bool $strict = ' . ($plan['strict'] ? 'true' : 'false') . ';',
        ];

        return "<?php\n\nnamespace {$namespace};\n\n"
            . "use verbb\\vizy\\migrations\\BaseVizyFieldConversionMigration;\n\n"
            . "/**\n * Copies Vizy field content to {$plan['targetType']} without changing the source field.\n */\n"
            . "final class {$className} extends BaseVizyFieldConversionMigration\n{\n"
            . implode("\n", $lines)
            . "\n}\n";
    }


    // Private Methods
    // =========================================================================

    /**
     * Pairs existing source and destination placements by field layout.
     *
     * A single placement of each field is intentionally required. Guessing between
     * repeated placements could copy content to the wrong authoring control.
     */
    private function _pairFieldLayouts(VizyField $sourceField, FieldInterface $targetField): array
    {
        $placementMap = [];
        $included = [];
        $skipped = [];
        $ambiguous = [];

        foreach ($this->_fieldLayoutsWithProviders() as $layout) {
            $sourcePlacements = [];
            $destinationPlacements = [];

            foreach ($layout->getCustomFieldElements() as $placement) {
                if ($placement->getFieldUid() === $sourceField->uid) {
                    $sourcePlacements[] = $placement->uid;
                }

                if ($placement->getFieldUid() === $targetField->uid) {
                    $destinationPlacements[] = $placement->uid;
                }
            }

            if ($sourcePlacements === []) {
                continue;
            }

            $details = $this->_fieldLayoutDetails($layout);

            if ($destinationPlacements === []) {
                $skipped[] = $details + [
                    'reason' => Craft::t('vizy', 'The destination field is not attached to this layout.'),
                ];
                continue;
            }

            if (count($sourcePlacements) !== 1 || count($destinationPlacements) !== 1) {
                $ambiguous[] = $details + [
                    'reason' => Craft::t('vizy', 'This layout contains repeated source or destination placements, so Vizy cannot safely choose a pair.'),
                ];
                continue;
            }

            $placementMap[$sourcePlacements[0]] = $destinationPlacements[0];
            $included[] = $details;
        }

        ksort($placementMap);

        return compact('placementMap', 'included', 'skipped', 'ambiguous');
    }

    /** Returns saved layouts with their owning Entry Type or other provider attached where possible. */
    private function _fieldLayoutsWithProviders(): array
    {
        $layouts = [];
        $types = [];

        foreach (Craft::$app->getFields()->getAllLayouts() as $layout) {
            $layouts[$layout->uid] = $layout;

            if (is_string($layout->type) && is_subclass_of($layout->type, ElementInterface::class)) {
                $types[$layout->type] = true;
            }
        }

        foreach (array_keys($types) as $type) {
            try {
                foreach ($type::fieldLayouts(null) as $layout) {
                    if (isset($layouts[$layout->uid])) {
                        $layouts[$layout->uid] = $layout;
                    }
                }
            } catch (Throwable) {
                // Some third-party element types cannot enumerate layouts outside their CP source context.
            }
        }

        return array_values($layouts);
    }

    private function _fieldLayoutDetails(FieldLayout $layout): array
    {
        $provider = $layout->provider;
        $providerLabel = $provider && method_exists($provider, 'getUiLabel')
            ? (string)$provider->getUiLabel()
            : null;
        $providerHandle = $provider && method_exists($provider, 'getHandle')
            ? (string)$provider->getHandle()
            : null;
        $elementTypeLabel = $layout->type && method_exists($layout->type, 'displayName')
            ? (string)$layout->type::displayName()
            : Craft::t('vizy', 'Content');

        if ($providerLabel !== null && $providerLabel !== '') {
            $label = Craft::t('vizy', '{provider} ({type})', [
                'provider' => $providerLabel,
                'type' => $elementTypeLabel,
            ]);
        } elseif ($providerHandle !== null && $providerHandle !== '') {
            $label = Craft::t('vizy', '{provider} ({type})', [
                'provider' => $providerHandle,
                'type' => $elementTypeLabel,
            ]);
        } else {
            $label = Craft::t('vizy', '{type} field layout', ['type' => $elementTypeLabel]);
        }

        return [
            'uid' => $layout->uid,
            'label' => $label,
            'providerHandle' => $providerHandle,
            'elementType' => $layout->type,
            'elementTypeLabel' => $elementTypeLabel,
        ];
    }

    /** Restricts a location map to the selected field placement identities. */
    private function _filterLocationMap(array $map, array $placementMap): array
    {
        $allowed = array_fill_keys(array_keys($placementMap), true);

        foreach ($map['roots'] as $placementUid => $root) {
            if (($root['direct'] ?? false)
                && ($root['fieldUid'] ?? null) === $map['fieldUid']
                && !isset($allowed[$placementUid])) {
                unset($map['roots'][$placementUid]);
            }
        }

        foreach ($map['schemas'] as &$definition) {
            foreach ($definition['schema']['types'] ?? [] as &$placements) {
                foreach ($placements as $key => $placement) {
                    if (($placement['fieldUid'] ?? null) === $map['fieldUid']
                        && !isset($allowed[$placement['placementUid'] ?? ''])) {
                        unset($placements[$key]);
                    }
                }
            }
            unset($placements);
        }
        unset($definition);

        return $map;
    }

    private function _validatePlacementMap(array $sourceLocationMap, array $destinationLocationMap, array $placementMap): void
    {
        $sourcePlacements = $this->_locationMapPlacements($sourceLocationMap, $sourceLocationMap['fieldUid']);
        $destinationPlacements = $this->_locationMapPlacements($destinationLocationMap, $destinationLocationMap['fieldUid']);

        if ($placementMap === []) {
            throw new RuntimeException('The source and destination fields do not share an eligible field layout. No content was copied.');
        }

        if (count(array_unique($placementMap)) !== count($placementMap)) {
            throw new RuntimeException('The destination field placement map contains duplicate identities. No content was copied.');
        }

        foreach ($placementMap as $sourcePlacementUid => $destinationPlacementUid) {
            $source = $sourcePlacements[$sourcePlacementUid] ?? null;
            $destination = $destinationPlacements[$destinationPlacementUid] ?? null;

            if (!$source || !$destination || $source['layoutUid'] !== $destination['layoutUid']) {
                throw new RuntimeException('A source and destination field placement are no longer paired on the same field layout. No content was copied.');
            }
        }
    }

    private function _locationMapPlacements(array $map, string $fieldUid): array
    {
        $placements = [];

        foreach ($map['roots'] as $placementUid => $root) {
            if (($root['direct'] ?? false) && ($root['fieldUid'] ?? null) === $fieldUid) {
                $placements[$placementUid] = [
                    'placementUid' => $placementUid,
                    'layoutUid' => $root['layoutUid'],
                ];
            }
        }

        foreach ($map['schemas'] as $definition) {
            foreach ($definition['schema']['types'] ?? [] as $schemaPlacements) {
                foreach ($schemaPlacements as $placement) {
                    if (($placement['fieldUid'] ?? null) === $fieldUid) {
                        $placements[$placement['placementUid']] = $placement;
                    }
                }
            }
        }

        return $placements;
    }

    private function _outboundTargetForField(FieldInterface $field): array
    {
        foreach ($this->getOutboundTargets() as $target) {
            if ($field::class === $target['type']) {
                return $target;
            }
        }

        throw new InvalidArgumentException("Field '{$field->handle}' is not a supported Plain Text, CKEditor, or Redactor destination.");
    }

    private function _outboundDocument(mixed $value, array $context, VizyField $field): array
    {
        $owner = Craft::$app->getElements()->getElementById(
            (int)$context['elementId'],
            $context['elementType'],
            (int)$context['siteId'],
            ['trashed' => null],
        );

        if (!$owner instanceof ElementInterface) {
            throw new RuntimeException("Unable to load element {$context['elementId']} for outbound conversion.");
        }

        return [
            Vizy::$plugin->getDocuments()->normalizeValue($value, $owner, $field),
            $owner,
        ];
    }

    private function _outboundAssessment(array $document, string $targetId): array
    {
        $diagnostics = [];
        $blockTypes = [];
        $extensions = Vizy::$plugin->getExtensions();
        $nonTextNodes = ['horizontalRule', 'iframe', 'image', 'mediaEmbed'];
        $plainStructuralNodes = [
            'blockquote',
            'bulletList',
            'codeBlock',
            'column',
            'details',
            'detailsContent',
            'detailsSummary',
            'footnoteItem',
            'footnoteList',
            'footnoteReference',
            'heading',
            'layout',
            'listItem',
            'orderedList',
            'table',
            'tableCell',
            'tableHeader',
            'tableRow',
            'taskItem',
            'taskList',
        ];
        $walk = function(array $nodes) use (
            &$walk,
            &$diagnostics,
            &$blockTypes,
            $extensions,
            $targetId,
            $nonTextNodes,
            $plainStructuralNodes,
        ): void {
            foreach ($nodes as $node) {
                if (!is_array($node)) {
                    continue;
                }

                $type = $node['type'] ?? null;

                if (!is_string($type) || $type === '') {
                    $diagnostics['invalid-node-discarded'] = [
                        'code' => 'invalid-node-discarded',
                        'message' => 'An invalid Vizy node will be discarded.',
                    ];
                    continue;
                }

                if ($type === 'vizyBlock') {
                    $uid = (string)($node['attrs']['blockTypeUid'] ?? 'unknown');
                    $blockTypes[$uid] = ($blockTypes[$uid] ?? 0) + 1;
                    $diagnostics['vizy-blocks-discarded'] = [
                        'code' => 'vizy-blocks-discarded',
                        'message' => 'Vizy Blocks and all of their custom-field data will be discarded.',
                    ];
                    continue;
                }

                foreach ($node['marks'] ?? [] as $mark) {
                    if (!is_array($mark) || !is_string($mark['type'] ?? null)) {
                        continue;
                    }

                    if ($targetId === self::TARGET_PLAIN_TEXT) {
                        $diagnostics['formatting-discarded'] = [
                            'code' => 'formatting-discarded',
                            'message' => 'Inline formatting will be removed for Plain Text.',
                        ];
                    } elseif (($extensions->getRender('mark', $mark['type'])['strategy'] ?? 'omit') === 'omit') {
                        $diagnostics['unsupported-mark-discarded'] = [
                            'code' => 'unsupported-mark-discarded',
                            'message' => 'One or more marks cannot be represented in portable HTML.',
                        ];
                    }
                }

                if ($targetId === self::TARGET_PLAIN_TEXT) {
                    if (in_array($type, $nonTextNodes, true)) {
                        $diagnostics['non-text-content-discarded'] = [
                            'code' => 'non-text-content-discarded',
                            'message' => 'Images, embeds, rules, and other non-text content will be discarded.',
                        ];
                    } elseif (in_array($type, $plainStructuralNodes, true)) {
                        $diagnostics['structure-flattened'] = [
                            'code' => 'structure-flattened',
                            'message' => 'Rich-text structure will be flattened into lines of plain text.',
                        ];
                    }
                } else {
                    $render = $extensions->getRender('node', $type);

                    if ($render === null || (($render['strategy'] ?? null) === 'omit' && !in_array($type, ['doc', 'text'], true))) {
                        $diagnostics['unsupported-node-discarded'] = [
                            'code' => 'unsupported-node-discarded',
                            'message' => 'One or more nodes cannot be represented in portable HTML.',
                        ];
                    }
                }

                if (is_array($node['content'] ?? null)) {
                    $walk($node['content']);
                }
            }
        };
        $walk($document['content'] ?? []);

        ksort($diagnostics);
        ksort($blockTypes);

        return [
            'diagnostics' => array_values($diagnostics),
            'blockTypes' => $blockTypes,
        ];
    }

    private function _outboundValue(
        VizyDocument $document,
        ElementInterface $owner,
        FieldInterface $targetField,
        string $targetId,
    ): string {
        $value = $targetId === self::TARGET_PLAIN_TEXT
            ? $this->_plainText($document->toArray()['content'] ?? [])
            : Vizy::$plugin->getRenderer()->renderPortableDocument($document);
        $normalized = $targetField->normalizeValue($value, $owner);
        $serialized = $targetField->serializeValue($normalized, $owner);

        if ($serialized === null) {
            return '';
        }

        if (!is_string($serialized)) {
            if (is_object($serialized) && method_exists($serialized, '__toString')) {
                return (string)$serialized;
            }

            throw new RuntimeException('The destination field did not serialize the converted content to text.');
        }

        return $serialized;
    }

    private function _plainText(array $nodes): string
    {
        $text = '';
        $lineNodes = [
            'blockquote',
            'codeBlock',
            'detailsSummary',
            'footnoteItem',
            'heading',
            'listItem',
            'paragraph',
            'tableRow',
            'taskItem',
        ];

        foreach ($nodes as $node) {
            if (!is_array($node)) {
                continue;
            }

            $type = $node['type'] ?? null;

            if ($type === 'vizyBlock' || in_array($type, ['horizontalRule', 'iframe', 'image', 'mediaEmbed'], true)) {
                continue;
            }

            if ($type === 'text') {
                $text .= (string)($node['text'] ?? '');
                continue;
            }

            if ($type === 'hardBreak') {
                $text .= "\n";
                continue;
            }

            if ($type === 'emoji') {
                $emoji = (string)($node['attrs']['emoji'] ?? '');
                $name = (string)($node['attrs']['name'] ?? '');
                $text .= $emoji !== '' ? $emoji : ($name !== '' ? ":{$name}:" : '');
                continue;
            }

            if ($type === 'footnoteReference') {
                $text .= (string)($node['attrs']['fallbackText'] ?? '');
                continue;
            }

            if (is_array($node['content'] ?? null)) {
                $text .= $this->_plainText($node['content']);
            }

            if (in_array($type, $lineNodes, true) && !str_ends_with($text, "\n")) {
                $text .= "\n";
            }
        }

        return rtrim($text, "\n");
    }

    private function _blockTypeLabels(array $counts): array
    {
        $rows = [];

        foreach ($counts as $uid => $count) {
            $type = $uid !== 'unknown' ? Vizy::$plugin->getBlockTypes()->getBlockTypeByUid($uid) : null;
            $rows[] = [
                'uid' => $uid,
                'label' => $type?->name ?? Craft::t('vizy', 'Unknown Block Type'),
                'count' => $count,
            ];
        }

        usort($rows, static fn(array $a, array $b): int => strnatcasecmp($a['label'], $b['label']));
        return $rows;
    }

    private function _settingsHash(array $settings): string
    {
        return hash('sha256', Json::encode($settings));
    }

    private function _field(string $selector): FieldInterface
    {
        $selector = trim($selector);

        if ($selector === '') {
            throw new InvalidArgumentException('A field handle or UID is required.');
        }
        $field = Craft::$app->getFields()->getFieldByHandle($selector)
            ?? Craft::$app->getFields()->getFieldByUid($selector);

        if (!$field) {
            throw new InvalidArgumentException("Field '{$selector}' was not found.");
        }
        return $field;
    }

    private function _editorConfigHash(array $config): string
    {
        $editorConfigs = Vizy::$plugin->getEditorConfigs();
        return $editorConfigs->fingerprintAuthorable($editorConfigs->authorablePayload($config));
    }

    private function _schemaPath(array $context): array
    {
        $segments = [];

        foreach ($context['path'] as $segment) {
            if (is_string($segment)) {
                $segments[] = ['placementUid' => $segment];
                continue;
            }

            if (is_array($segment)) {
                $segments[] = array_intersect_key($segment, array_flip(['containerFieldUid', 'fieldUid', 'placementUid', 'layoutUid']));
            }
        }
        return [
            'rootFieldUid' => $context['rootFieldUid'],
            'rootPlacementUid' => $context['rootPlacementUid'],
            'rootLayoutUid' => $context['rootLayoutUid'],
            'segments' => $segments,
        ];
    }

    private function _sample(array $context, mixed $value): array
    {
        $preview = is_string($value) ? trim(preg_replace('/\s+/u', ' ', $value) ?? $value) : get_debug_type($value);

        if (mb_strlen($preview) > 500) {
            $preview = mb_substr($preview, 0, 497) . '...';
        }
        return [
            'rowId' => (int)$context['rowId'],
            'elementId' => (int)$context['elementId'],
            'siteId' => (int)$context['siteId'],
            'path' => $this->_schemaPath($context),
            'preview' => $preview,
        ];
    }

    private function _validateApplyPlan(array $plan): void
    {
        foreach (['fieldUid', 'sourceType', 'editorConfig', 'editorConfigHash', 'locationMapHash', 'planHash'] as $key) {
            if (!is_string($plan[$key] ?? null) || $plan[$key] === '') {
                throw new InvalidArgumentException("The rich-text conversion plan has no valid {$key}.");
            }
        }

        if (($plan['version'] ?? null) !== 1 || !is_array($plan['locationMap'] ?? null) || !is_bool($plan['strict'] ?? null)) {
            throw new InvalidArgumentException('The rich-text conversion plan is incomplete or uses an unsupported version.');
        }

        if (!in_array($plan['sourceType'], [self::CKEDITOR_FIELD, self::REDACTOR_FIELD], true)) {
            throw new InvalidArgumentException('The rich-text conversion plan does not identify a supported source field type.');
        }

        if (($plan['locationMap']['fieldUid'] ?? null) !== $plan['fieldUid']
            || !hash_equals($plan['locationMapHash'], hash('sha256', Json::encode($plan['locationMap'])))) {
            throw new InvalidArgumentException('The rich-text conversion location map does not match its plan.');
        }
    }

    private function _validateOutboundApplyPlan(array $plan): void
    {
        foreach ([
            'sourceFieldUid',
            'destinationFieldUid',
            'sourceSettingsHash',
            'targetId',
            'targetType',
            'targetSettingsHash',
            'sourceLocationMapHash',
            'destinationLocationMapHash',
            'planHash',
        ] as $key) {
            if (!is_string($plan[$key] ?? null) || $plan[$key] === '') {
                throw new InvalidArgumentException("The outbound conversion plan has no valid {$key}.");
            }
        }

        if (($plan['version'] ?? null) !== 3
            || !is_array($plan['sourceSettings'] ?? null)
            || !is_array($plan['targetSettings'] ?? null)
            || !is_array($plan['sourceLocationMap'] ?? null)
            || !is_array($plan['placementMap'] ?? null)
            || !is_bool($plan['strict'] ?? null)) {
            throw new InvalidArgumentException('The outbound conversion plan is incomplete or uses an unsupported version.');
        }

        $targetTypes = [
            self::TARGET_PLAIN_TEXT => PlainText::class,
            self::TARGET_CKEDITOR => self::CKEDITOR_FIELD,
            self::TARGET_REDACTOR => self::REDACTOR_FIELD,
        ];

        if (($targetTypes[$plan['targetId']] ?? null) !== $plan['targetType']) {
            throw new InvalidArgumentException('The outbound conversion plan does not identify a supported destination field type.');
        }

        if (!hash_equals($plan['sourceSettingsHash'], $this->_settingsHash($plan['sourceSettings']))
            || !hash_equals($plan['targetSettingsHash'], $this->_settingsHash($plan['targetSettings']))) {
            throw new InvalidArgumentException('The outbound field settings do not match their plan.');
        }

        if ($plan['sourceFieldUid'] === $plan['destinationFieldUid']) {
            throw new InvalidArgumentException('The outbound copy requires separate source and destination fields.');
        }

        if (($plan['sourceLocationMap']['fieldUid'] ?? null) !== $plan['sourceFieldUid']
            || !hash_equals($plan['sourceLocationMapHash'], hash('sha256', Json::encode($plan['sourceLocationMap'])))) {
            throw new InvalidArgumentException('The outbound source location map does not match its plan.');
        }

        foreach ($plan['placementMap'] as $sourcePlacementUid => $destinationPlacementUid) {
            if (!is_string($sourcePlacementUid) || $sourcePlacementUid === ''
                || !is_string($destinationPlacementUid) || $destinationPlacementUid === '') {
                throw new InvalidArgumentException('The outbound conversion plan contains an invalid placement pair.');
            }
        }
    }

    private function _checkpoint(array $context, VizyField $targetField, string $planHash, array &$checkpoints): void
    {
        $key = $context['elementId'] . ':' . $context['rootFieldUid'] . ':' . $context['rootPlacementUid'];

        if (isset($checkpoints[$key])) {
            return;
        }
        $owner = Craft::$app->getElements()->getElementById(
            (int)$context['elementId'],
            $context['elementType'],
            (int)$context['siteId'],
        );
        $rootField = $owner instanceof ElementInterface
            ? FieldPlacements::field($owner, $context['rootFieldUid'], $context['rootPlacementUid'])
            : null;

        if ($owner && !($rootField instanceof VizyField) && $context['rootFieldUid'] === $targetField->uid) {
            foreach ($owner->getFieldLayout()?->getCustomFieldElements() ?? [] as $placement) {
                if ($placement->uid === $context['rootPlacementUid'] && $placement->getFieldUid() === $targetField->uid) {
                    $rootField = clone $targetField;
                    $rootField->layoutElement = $placement;
                    break;
                }
            }
        }

        if (!$owner || !$rootField) {
            throw new RuntimeException("Unable to capture a recovery checkpoint for element {$context['elementId']}.");
        }
        $id = Vizy::$plugin->getContentRecovery()->capture($owner, $rootField, 'rich-text-conversion:' . $planHash);

        if ($id === null) {
            throw new RuntimeException("Unable to persist a recovery checkpoint for element {$context['elementId']}.");
        }
        $checkpoints[$key] = $id;
    }
}
