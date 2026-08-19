<?php
namespace verbb\vizy\console\controllers;

use verbb\vizy\fields\VizyField;
use verbb\vizy\Vizy;

use Craft;
use craft\base\Element;
use craft\base\ElementInterface;
use craft\base\FieldInterface;
use craft\base\NestedElementInterface;
use craft\console\Controller;
use craft\elements\Entry;
use craft\errors\InvalidFieldException;
use craft\helpers\Console;
use craft\models\Section;

use Throwable;
use yii\console\ExitCode;

/**
 * Manages Vizy matrix anchors.
 */
class AnchorsController extends Controller
{
    // Properties
    // =========================================================================

    public ?int $elementId = null;
    public ?int $limit = null;
    public int $batchSize = 100;
    public bool $verbose = false;
    public bool $dryRun = false;

    private array $_pluginOrigins = [];


    // Public Methods
    // =========================================================================

    public function options($actionID): array
    {
        $options = parent::options($actionID);
        $options[] = 'elementId';
        $options[] = 'limit';
        $options[] = 'batchSize';
        $options[] = 'verbose';
        $options[] = 'dryRun';

        return $options;
    }

    public function optionAliases(): array
    {
        return array_merge(parent::optionAliases(), [
            'v' => 'verbose',
        ]);
    }

    /**
     * Creates matrix anchors for Vizy blocks that still rely on JSON matrix content.
     *
     * Use --verbose for per-element owner/field context, and --dry-run to inspect without saving.
     */
    public function actionBackfill(): int
    {
        $vizyFields = Craft::$app->getFields()->getFieldsByType(VizyField::class);

        if (!$vizyFields) {
            $this->stdout("No Vizy fields found.\n");

            return ExitCode::OK;
        }

        $this->_printEnvironment();
        $this->_printVizyFieldInventory($vizyFields);

        $query = Entry::find()
            ->status(null)
            ->drafts(null)
            ->trashed(false);

        if ($this->elementId) {
            $query->id($this->elementId);
        }

        if ($this->limit) {
            $query->limit($this->limit);
        }

        $total = (clone $query)->count();
        $elementsService = Craft::$app->getElements();
        $anchors = Vizy::$plugin->getAnchors();
        $saved = 0;
        $skipped = 0;
        $failed = 0;
        $position = 0;

        $verb = $this->dryRun ? 'Inspecting' : 'Checking';
        $this->stdout("$verb $total elements for Vizy matrix anchor migration...\n\n");

        foreach ($query->each($this->batchSize) as $element) {
            $position++;
            $started = false;

            try {
                $reports = $anchors->describeMatrixAnchorBackfill($element);
                $dirtyHandles = array_column($reports, 'handle');

                if (!$dirtyHandles) {
                    $skipped++;
                    continue;
                }

                $action = $this->dryRun ? 'Would save' : 'Saving';
                $this->stdout("  [$position/$total] $action {$element->id} ... ");
                $started = true;

                if ($this->verbose || $this->dryRun) {
                    $this->stdout("\n");
                    $this->_printIndented($this->_elementContext($element), 4);
                    $this->_printBackfillReport($reports, 4);
                }

                if ($this->dryRun) {
                    $saved++;
                    $this->stdout("    skipped write (--dry-run)\n", Console::FG_YELLOW);
                    continue;
                }

                $element->setScenario(Element::SCENARIO_ESSENTIALS);
                $element->resaving = true;
                $element->setDirtyFields($dirtyHandles);

                if ($elementsService->saveElement($element)) {
                    $saved++;
                    $this->stdout($this->verbose ? "    done\n" : "done\n", Console::FG_GREEN);
                } else {
                    $failed++;
                    $this->stdout($this->verbose ? "    failed\n" : "failed\n", Console::FG_RED);
                    $this->_printIndented($this->_elementContext($element), 4, Console::FG_RED);

                    foreach ($element->getErrorSummary(true) as $error) {
                        $this->stdout("    - $error\n", Console::FG_RED);
                    }
                }
            } catch (Throwable $e) {
                $failed++;

                if (!$started) {
                    $this->stdout("  [$position/$total] Saving {$element->id} ... ");
                }

                $this->stdout("error\n", Console::FG_RED);
                $this->_printFailureContext($element, $e);
            }
        }

        $savedLabel = $this->dryRun ? 'Would save' : 'Saved';
        $this->stdout("\n$savedLabel: $saved, Skipped: $skipped, Failed: $failed\n");

        if ($failed) {
            $this->stdout("Re-run with --verbose for owner/layout context, or --dry-run to inspect without saving.\n", Console::FG_YELLOW);
        }

        return $failed ? ExitCode::UNSPECIFIED_ERROR : ExitCode::OK;
    }


    // Private Methods
    // =========================================================================

    private function _printEnvironment(): void
    {
        $this->stdout('Vizy ' . Vizy::$plugin->getVersion() . ', Craft ' . Craft::$app->getVersion() . ', PHP ' . PHP_VERSION . "\n");

        $related = [];

        foreach (['hyper', 'super-table', 'neo', 'typedlink', 'typedlinkfield', 'ckeditor'] as $handle) {
            if (Craft::$app->getPlugins()->isPluginEnabled($handle)) {
                $plugin = Craft::$app->getPlugins()->getPlugin($handle);
                $related[] = $plugin->name . ' ' . $plugin->getVersion();
            }
        }

        if ($related) {
            $this->stdout('Related plugins: ' . implode(', ', $related) . "\n");
        }

        $this->stdout("\n");
    }

    /**
     * @param VizyField[] $vizyFields
     */
    private function _printVizyFieldInventory(array $vizyFields): void
    {
        $this->stdout("Vizy fields:\n", Console::FG_YELLOW);

        foreach ($vizyFields as $vizyField) {
            $this->stdout(sprintf(
                "  `%s` (#%s, %s)\n",
                $vizyField->handle,
                $vizyField->id,
                $vizyField->name,
            ));

            foreach ($this->_vizyFieldUsages($vizyField) as $usage) {
                $this->stdout("    used on: $usage\n");
            }

            $innerOrigins = [];

            foreach ($vizyField->getBlockTypes() as $blockType) {
                $layout = $blockType->getFieldLayout();

                if (!$layout) {
                    continue;
                }

                $inner = [];

                try {
                    $fields = $layout->getCustomFields();
                } catch (Throwable $e) {
                    $this->stdout("    block `{$blockType->handle}`: unable to load fields — {$e->getMessage()}\n", Console::FG_RED);
                    continue;
                }

                foreach ($fields as $field) {
                    $origin = $this->_fieldOrigin($field);
                    $inner[] = sprintf('`%s` %s [%s]', $field->handle, $field::displayName(), $origin);
                    $innerOrigins[$origin] = true;
                }

                if ($inner) {
                    $this->stdout(sprintf(
                        "    block `%s`: %s\n",
                        $blockType->handle,
                        implode(', ', $inner),
                    ));
                }
            }

            unset($innerOrigins['Craft']);

            if ($innerOrigins) {
                $this->stdout('    third-party fields from: ' . implode(', ', array_keys($innerOrigins)) . "\n");
            }
        }

        $this->stdout("\n");
    }

    private function _vizyFieldUsages(VizyField $vizyField): array
    {
        $usages = [];

        try {
            $entryTypes = Craft::$app->getEntries()->getAllEntryTypes();
        } catch (Throwable) {
            $entryTypes = [];
        }

        foreach ($entryTypes as $entryType) {
            if (!$this->_layoutContainsField($entryType->getFieldLayout(), $vizyField)) {
                continue;
            }

            $places = [];

            try {
                foreach ($entryType->findUsages() as $usage) {
                    if ($usage instanceof Section) {
                        $places[] = sprintf('section `%s`', $usage->handle);
                    } elseif ($usage instanceof FieldInterface) {
                        $places[] = sprintf(
                            'nested in %s `%s` [%s]',
                            $usage::displayName(),
                            $usage->handle,
                            $this->_fieldOrigin($usage),
                        );
                    }
                }
            } catch (Throwable $e) {
                $places[] = 'usage lookup failed: ' . $e->getMessage();
            }

            $usages[] = sprintf(
                'entry type `%s` (%s)%s',
                $entryType->handle,
                $entryType->name,
                $places ? ' — ' . implode(', ', $places) : '',
            );
        }

        if ($usages) {
            return $usages;
        }

        try {
            foreach (Craft::$app->getFields()->getAllLayouts() as $layout) {
                if ($this->_layoutContainsField($layout, $vizyField)) {
                    $usages[] = sprintf('layout #%s (%s)', $layout->id, $layout->type ?: 'unknown');
                }
            }
        } catch (Throwable $e) {
            $usages[] = 'layout scan failed: ' . $e->getMessage();
        }

        return $usages ?: ['not found on any entry type layout'];
    }

    private function _layoutContainsField($layout, VizyField $vizyField): bool
    {
        if (!$layout) {
            return false;
        }

        try {
            foreach ($layout->getCustomFields() as $field) {
                if ($field instanceof VizyField && (int)$field->id === (int)$vizyField->id) {
                    return true;
                }
            }
        } catch (Throwable) {
            return false;
        }

        return false;
    }

    /**
     * @return string[]
     */
    private function _elementContext(ElementInterface $element): array
    {
        $lines = [
            sprintf(
                '%s #%s "%s"',
                $element::displayName(),
                $element->id,
                $element->getUiLabel() ?: '(untitled)',
            ),
            sprintf(
                'site: %s (#%s), status: %s%s%s',
                $element->getSite()->handle,
                $element->siteId,
                $element->getStatus(),
                $element->getIsDraft() ? ', draft' : '',
                $element->getIsRevision() ? ', revision' : '',
            ),
        ];

        if ($element instanceof Entry) {
            try {
                $type = $element->getType();
                $lines[] = sprintf('entry type: `%s` (%s)', $type->handle, $type->name);
            } catch (Throwable $e) {
                $lines[] = 'entry type: unavailable — ' . $e->getMessage();
            }

            try {
                $section = $element->getSection();
                $lines[] = $section
                    ? sprintf('section: `%s` (%s)', $section->handle, $section->name)
                    : 'section: none (nested entry)';
            } catch (Throwable $e) {
                $lines[] = 'section: unavailable — ' . $e->getMessage();
            }
        }

        if ($element instanceof NestedElementInterface) {
            try {
                $field = $element->getField();
                $lines[] = $field
                    ? sprintf(
                        'nested in: %s `%s` [%s]',
                        $field::displayName(),
                        $field->handle,
                        $this->_fieldOrigin($field),
                    )
                    : 'nested in: unknown field';
            } catch (Throwable $e) {
                $lines[] = 'nested in: unavailable — ' . $e->getMessage();
            }

            $chain = $this->_ownerChain($element);

            if ($chain) {
                $lines[] = 'owner chain: ' . implode(' ← ', $chain);
            }
        } else {
            $lines[] = 'nested: no';
        }

        $layoutFields = $this->_layoutFieldSummary($element);

        if ($layoutFields) {
            $lines[] = 'layout fields: ' . implode(', ', $layoutFields);
        } else {
            $lines[] = 'layout fields: none / unavailable';
        }

        return $lines;
    }

    /**
     * @return string[]
     */
    private function _ownerChain(NestedElementInterface $element): array
    {
        $chain = [];
        $current = $element;
        $guard = 0;

        while ($current instanceof NestedElementInterface && $guard++ < 10) {
            try {
                $owner = $current->getOwner() ?? $current->getPrimaryOwner();
            } catch (Throwable) {
                break;
            }

            if (!$owner) {
                break;
            }

            $via = '?';

            try {
                $field = $current->getField();
                $via = $field ? sprintf('`%s` [%s]', $field->handle, $this->_fieldOrigin($field)) : '?';
            } catch (Throwable) {
            }

            $chain[] = sprintf(
                '%s #%s "%s" via %s',
                $owner::displayName(),
                $owner->id,
                $owner->getUiLabel() ?: '(untitled)',
                $via,
            );

            $current = $owner;
        }

        return $chain;
    }

    /**
     * @return string[]
     */
    private function _layoutFieldSummary(ElementInterface $element): array
    {
        $layout = $element->getFieldLayout();

        if (!$layout) {
            return [];
        }

        try {
            $fields = $layout->getCustomFields();
        } catch (Throwable $e) {
            return ['unable to load (' . $e->getMessage() . ')'];
        }

        $summary = [];

        foreach ($fields as $field) {
            $summary[] = sprintf('`%s` %s [%s]', $field->handle, $field::displayName(), $this->_fieldOrigin($field));
        }

        return $summary;
    }

    private function _printBackfillReport(array $reports, int $indent = 4): void
    {
        foreach ($reports as $report) {
            $this->stdout(str_repeat(' ', $indent) . sprintf(
                "vizy `%s` (#%s, %s)\n",
                $report['handle'],
                $report['fieldId'],
                $report['fieldName'],
            ));

            foreach ($report['blocks'] as $block) {
                $this->stdout(str_repeat(' ', $indent + 2) . sprintf(
                    "block `%s` (%s): %s%s%s\n",
                    $block['blockType'] ?: 'unknown',
                    $block['id'] ?: 'no-id',
                    $block['reason'],
                    $block['matrixFields'] ? ' matrix fields: `' . implode('`, `', $block['matrixFields']) . '`' : '',
                    $block['matrixAnchorUid'] ? ' anchor uid: ' . $block['matrixAnchorUid'] : '',
                ));
            }
        }
    }

    private function _printFailureContext(ElementInterface $element, Throwable $e): void
    {
        $this->stdout(sprintf(
            "    %s: %s\n",
            $e::class,
            $e->getMessage(),
        ), Console::FG_RED);
        $this->stdout(sprintf("    at %s:%s\n", $e->getFile(), $e->getLine()), Console::FG_RED);

        $this->_printIndented($this->_elementContext($element), 4, Console::FG_RED);

        if ($e instanceof InvalidFieldException) {
            $this->_printInvalidFieldDetails($element, $e);
        }

        if ($this->verbose) {
            $this->stdout("    trace:\n", Console::FG_RED);

            foreach (explode("\n", $e->getTraceAsString()) as $line) {
                if ($line !== '') {
                    $this->stdout("      $line\n", Console::FG_RED);
                }
            }
        }

        Vizy::error(sprintf(
            "vizy/anchors/backfill failed for %s #%s: %s in %s:%s",
            $element::class,
            $element->id,
            $e->getMessage(),
            $e->getFile(),
            $e->getLine(),
        ), __METHOD__);
    }

    private function _printInvalidFieldDetails(ElementInterface $element, InvalidFieldException $e): void
    {
        $handle = $this->_invalidFieldHandle($e);

        if (!$handle) {
            return;
        }

        $field = Craft::$app->getFields()->getFieldByHandle($handle);

        if (!$field) {
            $this->stdout("    `$handle` is not a registered field handle.\n", Console::FG_RED);
            return;
        }

        $this->stdout(sprintf(
            "    `%s` exists globally as %s [#%s, %s]\n",
            $handle,
            $field::displayName(),
            $field->id,
            $this->_fieldOrigin($field),
        ), Console::FG_RED);

        $onLayout = false;

        foreach ($this->_layoutFieldSummary($element) as $summary) {
            if (str_starts_with($summary, "`$handle` ")) {
                $onLayout = true;
                break;
            }
        }

        $this->stdout(
            $onLayout
                ? "    `$handle` is on this element's layout, so the exception came from nested content or another plugin.\n"
                : "    `$handle` is not on this element's layout — likely a different entry type, or nested elsewhere.\n",
            Console::FG_RED,
        );

        if ($field instanceof VizyField) {
            foreach ($this->_vizyFieldUsages($field) as $usage) {
                $this->stdout("    `$handle` used on: $usage\n", Console::FG_RED);
            }
        }
    }

    private function _invalidFieldHandle(InvalidFieldException $e): ?string
    {
        try {
            if (!empty($e->handle)) {
                return $e->handle;
            }
        } catch (Throwable) {
        }

        if (preg_match('/Invalid field handle:\s*(.+)$/', $e->getMessage(), $match)) {
            return trim($match[1]);
        }

        return null;
    }

    private function _fieldOrigin(FieldInterface $field): string
    {
        $class = $field::class;

        if (isset($this->_pluginOrigins[$class])) {
            return $this->_pluginOrigins[$class];
        }

        if (str_starts_with($class, 'craft\\')) {
            return $this->_pluginOrigins[$class] = 'Craft';
        }

        foreach (Craft::$app->getPlugins()->getAllPlugins() as $plugin) {
            $ns = substr($plugin::class, 0, (int)strrpos($plugin::class, '\\'));

            if ($ns && str_starts_with($class, $ns . '\\')) {
                return $this->_pluginOrigins[$class] = $plugin->name . ' ' . $plugin->getVersion();
            }
        }

        return $this->_pluginOrigins[$class] = $class;
    }

    /**
     * @param string[] $lines
     */
    private function _printIndented(array $lines, int $indent = 4, ?int $color = null): void
    {
        $prefix = str_repeat(' ', $indent);

        foreach ($lines as $line) {
            $this->stdout($prefix . $line . "\n", $color);
        }
    }
}
