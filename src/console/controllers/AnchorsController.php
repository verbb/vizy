<?php
namespace verbb\vizy\console\controllers;

use verbb\vizy\fields\VizyField;
use verbb\vizy\Vizy;

use Craft;
use craft\console\Controller;
use craft\elements\Entry;
use craft\helpers\Console;

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


    // Public Methods
    // =========================================================================

    public function options($actionID): array
    {
        $options = parent::options($actionID);
        $options[] = 'elementId';
        $options[] = 'limit';
        $options[] = 'batchSize';

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

        $this->stdout("Checking $total elements for Vizy matrix anchor migration...\n\n");

        foreach ($query->each($this->batchSize) as $element) {
            $position++;

            $needsBackfill = false;

            foreach ($vizyFields as $field) {
                if ($anchors->elementNeedsMatrixAnchorBackfill($element, $field)) {
                    $needsBackfill = true;
                    break;
                }
            }

            if (!$needsBackfill) {
                $skipped++;
                continue;
            }

            $this->stdout("  [$position/$total] Saving {$element->id} ... ");

            if ($elementsService->saveElement($element)) {
                $saved++;
                $this->stdout("done\n", Console::FG_GREEN);
            } else {
                $failed++;
                $this->stdout("failed\n", Console::FG_RED);

                foreach ($element->getErrorSummary(true) as $error) {
                    $this->stdout("    - $error\n", Console::FG_RED);
                }
            }
        }

        $this->stdout("\nSaved: $saved, Skipped: $skipped, Failed: $failed\n");

        return $failed ? ExitCode::UNSPECIFIED_ERROR : ExitCode::OK;
    }
}
