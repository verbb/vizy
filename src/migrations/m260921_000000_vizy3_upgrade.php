<?php
namespace verbb\vizy\migrations;

use verbb\vizy\Vizy;

use craft\db\Migration;
use craft\helpers\Json;

use RuntimeException;

/**
 * Automatically converts Vizy 3 field schema after the prerequisite tables commit.
 *
 * The actual work runs from afterUp() so the orchestrator's checkpoints are not
 * trapped in the migration transaction. If a stage fails, Craft leaves this
 * migration pending and the next migration run resumes from the durable stage.
 */
final class m260921_000000_vizy3_upgrade extends Migration
{
    // Public Methods
    // =========================================================================

    public function safeUp(): bool
    {
        return true;
    }

    public function safeDown(): bool
    {
        // Project Config and owner content cannot be safely downgraded.
        return false;
    }


    // Protected Methods
    // =========================================================================

    protected function afterUp(): void
    {
        $orchestrator = Vizy::$plugin->getPromotionOrchestrator();
        $incomplete = array_values(array_filter(
            $orchestrator->status(),
            static fn(array $run): bool => ($run['status'] ?? null) !== 'complete',
        ));

        if (count($incomplete) > 1) {
            throw new RuntimeException('Multiple incomplete Vizy 3 upgrades need attention. Inspect them with: php craft vizy/migrations/upgrade-status');
        }

        if ($incomplete !== []) {
            $result = $orchestrator->resume((string)$incomplete[0]['runUid']);
            $this->_assertComplete($result);
            parent::afterUp();
            return;
        }

        $plan = $orchestrator->analyze();
        if (($plan['status'] ?? null) !== 'ready') {
            throw new RuntimeException('The automatic Vizy 3 upgrade is blocked: ' . Json::encode($plan['diagnostics'] ?? []));
        }

        if (($plan['fields'] ?? []) !== []) {
            $this->_assertComplete($orchestrator->apply($plan, [
                'complete' => true,
                'jobs' => [],
            ]));
        }

        parent::afterUp();
    }


    // Private Methods
    // =========================================================================

    private function _assertComplete(array $result): void
    {
        if (($result['status'] ?? null) !== 'complete') {
            throw new RuntimeException((string)($result['lastError'] ?? 'The automatic Vizy 3 upgrade did not complete.'));
        }
    }
}
