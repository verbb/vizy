<?php

declare(strict_types=1);

use PHPUnit\Framework\TestCase;

/**
 * Source-level regression guards for Matrix recovery ownership traversal.
 */
final class MatrixRecoveryInvariantsTest extends TestCase
{
    private string $recovery;

    protected function setUp(): void
    {
        $this->recovery = file_get_contents(dirname(__DIR__) . '/src/services/MatrixRecovery.php');

        $this->assertNotFalse($this->recovery);
    }

    public function testUnresolvedOwnersDoNotBreakUnrelatedNestedElementSaves(): void
    {
        foreach (['captureNestedChange', '_hasActiveAncestor'] as $method) {
            $body = $this->_methodBody($this->recovery, $method);

            $this->assertMatchesRegularExpression(
                '/try\s*\{\s*\$element = \$element->getPrimaryOwner\(\);\s*\}\s*catch\s*\(InvalidConfigException\)/s',
                $body,
                "$method must ignore temporarily unresolved owners from other nested-element providers.",
            );
        }
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
