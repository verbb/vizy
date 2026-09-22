<?php
namespace verbb\vizy\console\controllers;

use verbb\vizy\Vizy;
use verbb\vizy\fields\VizyField;

use Craft;
use craft\console\Controller;
use craft\helpers\Console;

use yii\console\ExitCode;

use Throwable;

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
    public ?string $site = null;
    public bool $drafts = false;
    public bool $dryRun = false;


    // Public Methods
    // =========================================================================

    public function options($actionID): array
    {
        $options = parent::options($actionID);
        $options[] = 'elementId';
        $options[] = 'limit';
        $options[] = 'batchSize';
        $options[] = 'site';
        $options[] = 'drafts';
        $options[] = 'dryRun';

        return $options;
    }

    /**
     * Creates matrix anchors for Vizy blocks that still rely on JSON matrix content.
     */
    public function actionBackfill(): int
    {
        $vizyFields = Craft::$app->getFields()->getFieldsByType(VizyField::class);

        if (!$vizyFields) {
            $this->stdout("No Vizy fields found.\n");

            return ExitCode::OK;
        }

        $elementsService = Craft::$app->getElements();
        $anchors = Vizy::$plugin->getAnchors();
        $saved = 0;
        $skipped = 0;
        $failed = 0;
        $position = 0;

        $this->stdout('Site scope: ' . ($this->site ?: 'all sites') . ". Counts refer to element/site rows.\n");
        $this->stdout('Drafts: ' . ($this->drafts ? 'included' : 'excluded') . ($this->dryRun ? " · Dry run\n" : "\n"));

        // Enumerate installed content owners, including global sets and nested
        // plugin elements, rather than assuming Vizy is only placed on entries.
        foreach ($elementsService->getAllElementTypes() as $elementType) {
            $query = $elementType::find()->site($this->site ?: '*')->unique(false)
                ->status(null)->drafts($this->drafts ? null : false)
                ->provisionalDrafts(false)->revisions(false)->trashed(false)
                ->orderBy(['elements.id' => SORT_ASC, 'elements_sites.siteId' => SORT_ASC]);
            if ($this->elementId) {
                $query->id($this->elementId);
            }
            foreach ($query->each($this->batchSize) as $element) {
                if ($this->limit !== null && $position >= $this->limit) {
                    break 2;
                }
                $position++;
                try {
                    $needsBackfill = false;
                    foreach ($element->getFieldLayout()?->getCustomFields() ?? [] as $field) {
                        if ($field instanceof VizyField && $anchors->elementNeedsMatrixAnchorBackfill($element, $field)) {
                            $needsBackfill = true;
                            break;
                        }
                    }
                    if (!$needsBackfill) {
                        $skipped++;
                        continue;
                    }
                    $this->stdout("  {$elementType} #{$element->id}, site {$element->siteId}: ");
                    if ($this->dryRun) {
                        $saved++;
                        $this->stdout("would save\n");
                        continue;
                    }
                    // Each locale is processed independently. Resave semantics
                    // preserve editorial dates and avoid search-index work.
                    $element->resaving = true;
                    if (!$elementsService->saveElement($element, true, false, false)) {
                        throw new \RuntimeException(implode(', ', $element->getErrorSummary(true)));
                    }
                    $saved++;
                    $this->stdout("done\n", Console::FG_GREEN);
                } catch (Throwable $e) {
                    $failed++;
                    $this->stdout("failed: {$e->getMessage()}\n", Console::FG_RED);
                }
            }
        }

        $label = $this->dryRun ? 'Would save' : 'Saved';
        $this->stdout("\n$label: $saved, Skipped: $skipped, Failed: $failed\n");

        return $failed ? ExitCode::UNSPECIFIED_ERROR : ExitCode::OK;
    }
}
