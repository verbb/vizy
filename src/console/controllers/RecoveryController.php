<?php
namespace verbb\vizy\console\controllers;

use verbb\vizy\Vizy;

use craft\console\Controller;
use craft\helpers\Json;

use yii\console\ExitCode;

final class RecoveryController extends Controller
{
    // Public Methods
    // =========================================================================

    /** Lists immutable content snapshots, optionally for one owner. */
    public function actionIndex(?int $ownerId = null): int
    {
        $this->stdout(Json::encode(Vizy::$plugin->getContentRecovery()->records($ownerId), JSON_PRETTY_PRINT) . "\n");
        return ExitCode::OK;
    }

    /** Restores one field and its nested content; unrelated owner fields remain unchanged. */
    public function actionRestore(int $id): int
    {
        Vizy::$plugin->getContentRecovery()->restore($id);
        $this->stdout("Restored Vizy recovery record {$id}.\n");
        return ExitCode::OK;
    }
}
