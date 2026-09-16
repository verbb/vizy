<?php
namespace verbb\vizy\legacy;

use verbb\vizy\Vizy;
use verbb\vizy\fields\VizyField;
use verbb\vizy\services\FieldLifecycle;

use craft\base\ElementInterface;
use craft\fields\Matrix;
use craft\models\FieldLayout;

final class MatrixMigrationAnalyzer
{
    // Public Methods
    // =========================================================================

    /**
     * Resolve one exact live MatrixAnchor source without mutating it.
     */
    public function analyzeOwner(
        ElementInterface $owner,
        VizyField $field,
        array $legacyDocument,
        array $mapping,
    ): array {
        $rows = (new MatrixAnchorRows())->load($owner, $field, $legacyDocument, $mapping);
        return [
            'status' => 'ready',
            'source' => 'matrixAnchor',
            'anchorUid' => $this->_anchorUid($legacyDocument, (string)$mapping['parentBlockUid']),
            'rowCount' => count($rows),
            'order' => array_column($rows, 'uid'),
            'enabled' => array_column($rows, 'enabled'),
            'rows' => $rows,
            'sourceMutationAuthorized' => false,
        ];
    }

    public function analyzeVizyField(VizyField $field): array
    {
        $placements = [];
        foreach ($field->getFieldData() as $group) {
            foreach ($group['blockTypes'] ?? [] as $legacyType) {
                $layoutConfig = $legacyType['layoutConfig'] ?? null;
                if (!is_array($layoutConfig)) {
                    continue;
                }
                $layout = FieldLayout::createFromConfig($layoutConfig);
                foreach ($layout->getCustomFieldElements() as $placement) {
                    $matrix = $placement->getField();
                    if (!$matrix instanceof Matrix) {
                        continue;
                    }
                    $placements[] = $this->_analyzePlacement($field, $legacyType, $placement->uid, $matrix);
                }
            }
        }
        return [
            'fieldUid' => $field->uid,
            'status' => array_reduce($placements, static fn(string $status, array $item) => $item['tier'] === 4 ? 'blocked' : $status, 'ready'),
            'placements' => $placements,
        ];
    }


    // Private Methods
    // =========================================================================

    private function _analyzePlacement(VizyField $vizyField, array $legacyType, string $placementUid, Matrix $matrix): array
    {
        $tier = count($matrix->getEntryTypes()) > 1 ? 2 : 1;
        $reasons = [];
        $entryTypes = [];
        foreach ($matrix->getEntryTypes() as $entryType) {
            $entryReport = [
                'uid' => $entryType->uid,
                'handle' => $entryType->handle,
                'placements' => [],
            ];
            if ($entryType->showSlugField) {
                $tier = max($tier, 3);
                $reasons[] = 'entrySlugSemanticsChange';
            } elseif ($entryType->hasTitleField) {
                $tier = max($tier, 2);
                $reasons[] = 'entryTitleMappingRequired';
            }
            foreach ($entryType->getFieldLayout()->getCustomFieldElements() as $entryPlacement) {
                $inner = $entryPlacement->getField();
                $capability = Vizy::$plugin->getFieldLifecycle()->classify($inner);
                $entryReport['placements'][] = [
                    'uid' => $entryPlacement->uid,
                    'fieldUid' => $inner->uid,
                    ...$capability,
                ];
                if ($capability['capability'] === FieldLifecycle::MIGRATION_ONLY) {
                    $tier = max($tier, 2);
                    $reasons[] = 'nestedStructuredField';
                } elseif ($capability['capability'] === FieldLifecycle::UNSUPPORTED) {
                    $tier = max($tier, 3);
                    $reasons[] = 'approvedFieldMappingRequired';
                }
            }
            $entryTypes[] = $entryReport;
        }

        return [
            'vizyFieldUid' => $vizyField->uid,
            'legacyBlockTypeId' => $legacyType['id'] ?? null,
            'placementUid' => $placementUid,
            'matrixFieldUid' => $matrix->uid,
            'tier' => $tier,
            'reasonCodes' => array_values(array_unique($reasons)),
            'minBlocks' => $matrix->minEntries,
            'maxBlocks' => $matrix->maxEntries,
            'propagationMethod' => $matrix->propagationMethod,
            'entryTypes' => $entryTypes,
            'sourceCoverage' => ['json' => 'inspectOwnerValues', 'matrixAnchor' => 'inspectLegacyAnchors'],
        ];
    }

    private function _anchorUid(array $nodes, string $blockUid): string
    {
        foreach ($nodes as $node) {
            if (!is_array($node)) {
                continue;
            }
            if (($node['type'] ?? null) === 'vizyBlock' && ($node['attrs']['id'] ?? null) === $blockUid) {
                return (string)($node['attrs']['values']['matrixAnchorUid'] ?? '');
            }
            if (is_array($node['content'] ?? null)) {
                $uid = $this->_anchorUid($node['content'], $blockUid);
                if ($uid !== '') {
                    return $uid;
                }
            }
        }
        return '';
    }
}
