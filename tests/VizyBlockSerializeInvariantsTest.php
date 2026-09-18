<?php

declare(strict_types=1);

use PHPUnit\Framework\TestCase;

/**
 * Source-level regression guards for VizyBlock::serializeValue nested field saves.
 */
final class VizyBlockSerializeInvariantsTest extends TestCase
{
    private string $vizyBlock;
    private string $anchorsController;

    protected function setUp(): void
    {
        $root = dirname(__DIR__);
        $this->vizyBlock = file_get_contents($root . '/src/nodes/VizyBlock.php');
        $this->anchorsController = file_get_contents($root . '/src/console/controllers/AnchorsController.php');

        $this->assertNotFalse($this->vizyBlock);
        $this->assertNotFalse($this->anchorsController);
    }

    public function testNestedAfterElementSaveSwallowsFkFailuresWithoutMatrixAnchor(): void
    {
        $body = $this->_methodBody($this->vizyBlock, 'serializeValue');

        $this->assertMatchesRegularExpression(
            '/try\s*\{[^}]*\$field->afterElementSave\(\$block,\s*true\);[^}]*\}\s*catch\s*\(Throwable\s*\$e\)\s*\{[^}]*\$block->getMatrixAnchor\(\)[^}]*throw\s*\$e;/s',
            $body,
            'Top-level nested afterElementSave must catch FK failures on synthetic Blocks (#377), and rethrow when a MatrixAnchor provides a real element id.',
        );
    }

    public function testVizyLoggingUsesCurrentBaseSignature(): void
    {
        foreach ([$this->vizyBlock, $this->anchorsController] as $source) {
            $this->assertDoesNotMatchRegularExpression(
                '/Vizy::(?:error|warning|info)\s*\(.*?__METHOD__\s*\);/s',
                $source,
                'Vizy logging accepts an array of translation parameters, not a legacy category string.',
            );
        }
    }

    public function testNormalizeValueSanitizesMatrixSortOrderBeforeRendering(): void
    {
        $body = $this->_methodBody($this->vizyBlock, 'normalizeValue');

        $this->assertStringContainsString('Matrix::duplicateSortOrderIds($fieldValue)', $body);
        $this->assertStringContainsString('Matrix::sanitizeMatrixContent($field, $fieldValue)', $body);
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
