<?php

declare(strict_types=1);

use PHPUnit\Framework\TestCase;
use verbb\vizy\helpers\Matrix;

require_once dirname(__DIR__) . '/src/helpers/Matrix.php';

final class MatrixHelperTest extends TestCase
{
    public function testEnsureSortOrderDeduplicatesEntryIdsAndAddsMissingEntries(): void
    {
        $content = [
            'entries' => [
                'uid:first' => [],
                'uid:second' => [],
                'uid:missing' => [],
                123 => [],
            ],
            'sortOrder' => [
                'first',
                'first',
                'uid:second',
                'second',
                123,
                '123',
            ],
        ];

        $result = Matrix::ensureSortOrder($content);

        self::assertSame(['first', 'uid:second', 123, 'missing'], $result['sortOrder']);
        self::assertSame(['first', 'second', '123'], Matrix::duplicateSortOrderIds($content));
    }
}
