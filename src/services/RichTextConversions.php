<?php
namespace verbb\vizy\services;

use verbb\vizy\Vizy;
use verbb\vizy\content\Change;
use verbb\vizy\fields\VizyField;
use verbb\vizy\helpers\FieldPlacements;
use verbb\vizy\importers\HtmlImportDiagnostic;
use verbb\vizy\importers\HtmlImportOptions;

use Craft;
use craft\base\Component;
use craft\base\ElementInterface;
use craft\base\FieldInterface;
use craft\fields\MissingField;
use craft\helpers\FileHelper;
use craft\helpers\Json;
use craft\helpers\ProjectConfig as ProjectConfigHelper;
use craft\helpers\StringHelper;

use InvalidArgumentException;
use RuntimeException;
use Throwable;

/**
 * Builds read-only plans for converting CKEditor and Redactor fields to Vizy.
 */
final class RichTextConversions extends Component
{
    // Constants
    // =========================================================================

    public const CKEDITOR_FIELD = 'craft\\ckeditor\\Field';
    public const REDACTOR_FIELD = 'craft\\redactor\\Field';


    // Public Methods
    // =========================================================================

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


    // Private Methods
    // =========================================================================

    private function _field(string $selector): FieldInterface
    {
        $selector = trim($selector);

        if ($selector === '') {
            throw new InvalidArgumentException('A CKEditor or Redactor field handle or UID is required.');
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

        if ($owner && !$rootField && $context['rootFieldUid'] === $targetField->uid) {
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
