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

    public function testLegacyContentUsesCraftUidDeltaFormat(): void
    {
        $field = new class {
            public array $entryTypes;

            public function __construct()
            {
                $this->entryTypes = [new class {
                    public string $handle = 'card';

                    public function getCustomFields(): array
                    {
                        return [];
                    }
                }];
            }
        };

        $result = Matrix::sanitizeMatrixContent($field, [
            'new1' => ['type' => 'card', 'fields' => []],
            'new2' => ['type' => 'card', 'fields' => []],
        ]);

        self::assertSame(['uid:new1', 'uid:new2'], array_keys($result['entries']));
        self::assertSame(['new1', 'new2'], $result['sortOrder']);
    }

    public function testNestedEntriesAreDeduplicatedByUidUsingNewestRow(): void
    {
        $entries = [
            (object)['id' => 10, 'uid' => 'first'],
            (object)['id' => 11, 'uid' => 'second'],
            (object)['id' => 20, 'uid' => 'first'],
        ];

        $result = Matrix::deduplicateEntriesByUid($entries);

        self::assertSame([20, 11], array_map(fn(object $entry) => $entry->id, $result));
    }
}
