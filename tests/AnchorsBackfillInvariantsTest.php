<?php

declare(strict_types=1);

use PHPUnit\Framework\TestCase;

/**
 * Source-level regression guards for vizy/anchors/backfill.
 *
 * These do not boot Craft. They catch the class of incomplete multi-site /
 * draft / propagate fixes that keep slipping through (#364 follow-ups).
 */
final class AnchorsBackfillInvariantsTest extends TestCase
{
    private string $controller;

    private string $anchors;

    protected function setUp(): void
    {
        $root = dirname(__DIR__);
        $this->controller = file_get_contents($root . '/src/console/controllers/AnchorsController.php');
        $this->anchors = file_get_contents($root . '/src/services/Anchors.php');

        $this->assertNotFalse($this->controller);
        $this->assertNotFalse($this->anchors);
    }

    public function testBackfillDefaultsToAllSitesIndependentlyOfElementId(): void
    {
        $configure = $this->_methodBody($this->controller, '_configureBackfillQuery');

        $this->assertMatchesRegularExpression(
            '/if \(\$this->site\) \{\s*\$query->site\(\$this->site\);\s*\} else \{\s*\$query->site\(\'\*\'\);/s',
            $configure,
            'Full-sweep backfill must default to site(\'*\') when --site is omitted.',
        );

        $this->assertDoesNotMatchRegularExpression(
            '/elementId\s*\)\s*\{[^}]*site\(\'\*\'\)/s',
            $configure,
            'site(\'*\') must not be gated only behind the --elementId branch (3.2.6 regression).',
        );
    }

    public function testBackfillPrintsSiteScope(): void
    {
        $this->assertStringContainsString(
            'Site scope:',
            $this->controller,
            'CLI must print which site scope is inspected so “0 to save” cannot mean all sites.',
        );
    }

    public function testBackfillExcludesDraftsByDefault(): void
    {
        $this->assertStringContainsString('public bool $drafts = false;', $this->controller);
        $this->assertStringContainsString(
            'drafts($this->drafts ? null : false)',
            $this->controller,
            'Drafts must be excluded by default; anchors are canonical-keyed.',
        );
    }

    public function testBackfillDoesNotPropagateWhileSweepingSites(): void
    {
        $this->assertStringContainsString(
            'saveElement($element, true, false, false)',
            $this->controller,
            'Backfill must save with propagate=false when iterating site rows.',
        );
    }

    public function testBackfillIncludesGlobalSetsAndOptionalNeo(): void
    {
        $this->assertStringContainsString('GlobalSet::find()', $this->controller);
        $this->assertStringContainsString('benf\\neo\\elements\\Block', $this->controller);
    }

    public function testBackfillDetectionWalksNestedVizy(): void
    {
        $this->assertStringContainsString('_describeNestedVizyBackfill', $this->anchors);
        $this->assertStringContainsString('_describeBlocksNeedingBackfill', $this->anchors);
    }

    public function testGcStillSkipsDraftsAndPropagating(): void
    {
        $this->assertStringContainsString('getIsDraft()', $this->anchors);
        $this->assertStringContainsString('propagating', $this->anchors);
        $this->assertStringContainsString('_collectBlockInstanceIdsAcrossSites', $this->anchors);
    }

    private function _methodBody(string $source, string $method): string
    {
        if (!preg_match('/function ' . preg_quote($method, '/') . '\([^)]*\)[^{]*\{/', $source, $match, PREG_OFFSET_CAPTURE)) {
            $this->fail("Method $method not found");
        }

        $start = $match[0][1] + strlen($match[0][0]);
        $depth = 1;
        $length = strlen($source);

        for ($i = $start; $i < $length; $i++) {
            $char = $source[$i];

            if ($char === '{') {
                $depth++;
            } elseif ($char === '}') {
                $depth--;

                if ($depth === 0) {
                    return substr($source, $start, $i - $start);
                }
            }
        }

        $this->fail("Could not parse method body for $method");
    }
}
