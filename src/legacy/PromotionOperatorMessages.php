<?php
namespace verbb\vizy\legacy;

use Craft;

/**
 * Operator-facing copy for Vizy 3 → 4 schema promotion and owner migration.
 *
 * Machine JSON remains the source of truth; these strings are for console/CP
 * humans reading status, confirmation, and resume guidance.
 */
final class PromotionOperatorMessages
{
    // Static Methods
    // =========================================================================

    public static function confirmationPhrase(): string
    {
        return Vizy3PromotionOrchestrator::CONFIRMATION;
    }

    public static function confirmationRequiredMessage(): string
    {
        return Craft::t(
            'vizy',
            'Write confirmation required. Pass --confirm="{phrase}" (exact match), or run interactively and type that phrase when prompted.',
            ['phrase' => self::confirmationPhrase()],
        );
    }

    public static function confirmationMismatchMessage(): string
    {
        return Craft::t(
            'vizy',
            'Write confirmation must exactly equal: {phrase}',
            ['phrase' => self::confirmationPhrase()],
        );
    }

    public static function stageLabels(): array
    {
        return [
            'planned' => Craft::t('vizy', 'Plan recorded'),
            'globalSchema' => Craft::t('vizy', 'Global Block Types written'),
            'provenance' => Craft::t('vizy', 'Promotion provenance saved'),
            'editorConfigs' => Craft::t('vizy', 'Inline Editor Configs minted'),
            'canonicalFields' => Craft::t('vizy', 'Canonical field settings applied'),
            'owners' => Craft::t('vizy', 'Owner content converted'),
            'verified' => Craft::t('vizy', 'Promotion verified'),
        ];
    }

    public static function stageLabel(string $stage): string
    {
        return self::stageLabels()[$stage] ?? $stage;
    }

    public static function nextStepForPromotion(array $recordResult): string
    {
        $status = (string)($recordResult['status'] ?? '');
        $stage = (string)($recordResult['stage'] ?? '');
        $runUid = (string)($recordResult['runUid'] ?? '');

        if ($status === 'complete' && $stage === 'verified') {
            return Craft::t(
                'vizy',
                'Promotion is complete. Open entries with Vizy fields and confirm editors load. Source fieldData retirement is a separate optional step.',
            );
        }

        if ($status === 'failed') {
            return Craft::t(
                'vizy',
                'Promotion failed at stage “{stage}” ({label}). Fix the error, then resume with: php craft vizy/migrations/promotion-resume {runUid} --confirm="{phrase}"',
                [
                    'stage' => $stage,
                    'label' => self::stageLabel($stage),
                    'runUid' => $runUid !== '' ? $runUid : '{runUid}',
                    'phrase' => self::confirmationPhrase(),
                ],
            );
        }

        if ($status === 'pending' || $status === 'running') {
            return Craft::t(
                'vizy',
                'Promotion is incomplete (stage “{stage}” — {label}). Resume with: php craft vizy/migrations/promotion-resume {runUid} --confirm="{phrase}"',
                [
                    'stage' => $stage,
                    'label' => self::stageLabel($stage),
                    'runUid' => $runUid !== '' ? $runUid : '{runUid}',
                    'phrase' => self::confirmationPhrase(),
                ],
            );
        }

        return Craft::t('vizy', 'Check promotion status with: php craft vizy/migrations/promotion-status');
    }

    public static function nextStepForAnalyze(array $plan): string
    {
        $status = (string)($plan['status'] ?? '');
        if ($status === 'blocked') {
            return Craft::t(
                'vizy',
                'Analyze is blocked. Resolve every error diagnostic, then re-run promotion-analyze. Info/warning diagnostics (for example Matrix grandfather) do not block.',
            );
        }

        if ($status === 'ready') {
            return Craft::t(
                'vizy',
                'Analyze is ready. Save this plan JSON, prepare an owner-scope file with "complete": true and jobs[], then run: php craft vizy/migrations/promotion-apply path/to/plan.json path/to/owners.json --confirm="{phrase}"',
                ['phrase' => self::confirmationPhrase()],
            );
        }

        return Craft::t('vizy', 'Unexpected analyze status “{status}”. Inspect the JSON payload.', [
            'status' => $status,
        ]);
    }

    public static function nextStepForOwner(array $checkpoint, bool $applied): string
    {
        $state = (string)($checkpoint['state'] ?? '');
        $id = (int)($checkpoint['id'] ?? 0);

        return match ($state) {
            'verified' => Craft::t(
                'vizy',
                'Owner content is verified canonical. No further action for this checkpoint.',
            ),
            'persisted' => Craft::t(
                'vizy',
                'Owner content is persisted but not yet verified. Resume with: php craft vizy/migrations/resume {id}',
                ['id' => $id > 0 ? $id : '{checkpointId}'],
            ),
            'ready' => $applied
                ? Craft::t(
                    'vizy',
                    'Owner migration stopped before verify. Inspect errors, then resume checkpoint {id}.',
                    ['id' => $id > 0 ? $id : '{checkpointId}'],
                )
                : Craft::t(
                    'vizy',
                    'Analyze ready (no writes yet). Re-run with --apply=1 to persist: php craft vizy/migrations/owner … --apply=1',
                ),
            'analyzed' => Craft::t(
                'vizy',
                'Owner analyze incomplete. Inspect errors in the JSON payload before applying.',
            ),
            'failed' => Craft::t(
                'vizy',
                'Owner migration failed. Fix the listed errors, then: php craft vizy/migrations/resume {id}',
                ['id' => $id > 0 ? $id : '{checkpointId}'],
            ),
            default => Craft::t(
                'vizy',
                'Owner migration state is “{state}”. Check status: php craft vizy/migrations/status',
                ['state' => $state],
            ),
        };
    }

    /**
     * Attach operator-facing fields onto a promotion status row.
     */
    public static function enrichPromotionResult(array $result): array
    {
        $result['stageLabel'] = self::stageLabel((string)($result['stage'] ?? ''));
        $result['confirmationPhrase'] = self::confirmationPhrase();
        $result['nextStep'] = self::nextStepForPromotion($result);
        return $result;
    }
}
