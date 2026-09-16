<?php

declare(strict_types=1);

namespace Tests\Support\Performance;

use craft\helpers\Json;
use RuntimeException;

/**
 * Structural Hosted Vizy metrics stay deterministic in CI. Wall-clock and
 * browser-memory figures remain profiling outputs because machine load and the
 * installed Craft field catalog make absolute thresholds misleading.
 */
final class HostedVizyBudgetMetrics
{
    /**
     * @return array{
     *   bytes:int,
     *   hostedEditors:int,
     *   bootstrapTemplates:int,
     *   bootstrapEditorCalls:int,
     *   manifestHashes:list<string>
     * }
     */
    public static function fromHtml(string $html): array
    {
        preg_match_all(
            '/<vizy-editor\b[^>]*\bdata-vizy-hosted(?:\s|=|>)/',
            $html,
            $hostedMatches,
        );
        preg_match_all(
            '/<template\b[^>]*\bdata-vizy-bootstrap(?:="[^"]*")?[^>]*>(.*?)<\/template>/s',
            $html,
            $matches,
        );

        $manifestHashes = [];
        foreach ($matches[1] ?? [] as $encoded) {
            $bootstrap = Json::decode((string)$encoded);
            $hash = $bootstrap['manifest']['hash'] ?? null;
            if (!is_string($hash) || $hash === '') {
                throw new RuntimeException('Hosted bootstrap is missing manifest.hash.');
            }
            $manifestHashes[] = $hash;
        }

        return [
            'bytes' => strlen($html),
            'hostedEditors' => count($hostedMatches[0] ?? []),
            'bootstrapTemplates' => count($matches[1] ?? []),
            'bootstrapEditorCalls' => substr_count($html, 'bootstrapEditor('),
            'manifestHashes' => $manifestHashes,
        ];
    }
}
