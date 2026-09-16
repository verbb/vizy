<?php
namespace verbb\vizy\legacy;

use verbb\vizy\Vizy;
use verbb\vizy\fields\VizyField;

use Craft;
use craft\base\ElementInterface;
use craft\elements\Entry;
use craft\fields\Matrix;
use craft\models\FieldLayout;

use RuntimeException;

/**
 * Read-only bridge from the live Vizy 3 MatrixAnchor subsystem into the focused
 * Matrix transformer. Canonical code never sees or retains an anchor.
 */
final class MatrixAnchorRows
{
    // Public Methods
    // =========================================================================

    public function load(
        ElementInterface $owner,
        VizyField $vizyField,
        array $legacyDocument,
        array $mapping,
    ): array {
        $parentBlockUid = (string)($mapping['parentBlockUid'] ?? '');
        $legacyPlacementUid = (string)($mapping['legacyMatrixPlacementUid'] ?? '');
        if ($parentBlockUid === '' || $legacyPlacementUid === '') {
            throw new RuntimeException('MatrixAnchor migration requires explicit parent Block and legacy Matrix placement UIDs.');
        }

        $node = $this->_findLegacyBlock($legacyDocument, $parentBlockUid);
        $attrs = $node['attrs'] ?? [];
        $anchorUid = $attrs['values']['matrixAnchorUid'] ?? null;
        $legacyTypeId = $attrs['values']['type'] ?? null;
        if (!is_string($anchorUid) || $anchorUid === '' || !is_string($legacyTypeId) || $legacyTypeId === '') {
            throw new RuntimeException("Legacy Block {$parentBlockUid} has no valid MatrixAnchor/type identity.");
        }

        [$layout, $matrix] = $this->_legacyMatrixField($vizyField, $legacyTypeId, $legacyPlacementUid);
        $anchor = Vizy::$plugin->getAnchors()->getAnchor(
            $owner,
            $vizyField,
            $parentBlockUid,
            $anchorUid,
        );
        if (!$anchor || $anchor->uid !== $anchorUid) {
            throw new RuntimeException("MatrixAnchor {$anchorUid} is missing or does not match the persisted legacy Block.");
        }
        if (
            $anchor->parentOwnerId !== (int)$owner->getCanonicalId()
            || $anchor->vizyFieldId !== $vizyField->id
            || $anchor->blockInstanceId !== $parentBlockUid
        ) {
            throw new RuntimeException("MatrixAnchor {$anchorUid} ownership metadata is corrupt.");
        }
        $anchor->setFieldLayout($layout);

        $value = $anchor->getFieldValue($matrix->handle);
        $entries = $value instanceof \craft\elements\db\EntryQuery ? $value->status(null)->all() : [];
        $allowedTypes = array_fill_keys(
            array_map(static fn($type) => (string)$type->uid, $matrix->getEntryTypes()),
            true,
        );
        $rows = [];
        foreach ($entries as $index => $entry) {
            if (
                !$entry instanceof Entry
                || $entry->getOwner()?->id !== $anchor->id
                || $entry->fieldId !== $matrix->id
                || !isset($allowedTypes[(string)$entry->getType()->uid])
            ) {
                throw new RuntimeException("MatrixAnchor {$anchorUid} contains corrupt nested Entry ownership at row {$index}.");
            }

            $fields = [];
            foreach ($entry->getFieldLayout()?->getCustomFieldElements() ?? [] as $placement) {
                $field = $placement->getField();
                $capability = Vizy::$plugin->getFieldLifecycle()->classify($field);
                if ($capability['capability'] === \verbb\vizy\services\FieldLifecycle::UNSUPPORTED) {
                    throw new RuntimeException("Matrix Entry {$entry->uid} contains unsupported field " . $field::class . '.');
                }
                $fields[$placement->uid] = $field->serializeValue($entry->getFieldValue($field->handle), $entry);
            }
            $rows[] = [
                'uid' => $entry->uid,
                'id' => $entry->id,
                'entryTypeUid' => $entry->getType()->uid,
                'enabled' => $entry->enabled && $entry->enabledForSite,
                'fields' => $fields,
            ];
        }
        return $rows;
    }


    // Private Methods
    // =========================================================================

    private function _legacyMatrixField(
        VizyField $field,
        string $legacyTypeId,
        string $placementUid,
    ): array {
        foreach ($field->getFieldData() as $group) {
            foreach ($group['blockTypes'] ?? [] as $legacyType) {
                if (($legacyType['id'] ?? null) !== $legacyTypeId || !is_array($legacyType['layoutConfig'] ?? null)) {
                    continue;
                }
                $layout = FieldLayout::createFromConfig($legacyType['layoutConfig']);
                foreach ($layout->getCustomFieldElements() as $placement) {
                    if ($placement->uid === $placementUid && $placement->getField() instanceof Matrix) {
                        return [$layout, $placement->getField()];
                    }
                }
                throw new RuntimeException("Legacy Matrix placement {$placementUid} is missing from Block Type {$legacyTypeId}.");
            }
        }
        throw new RuntimeException("Legacy Block Type {$legacyTypeId} is missing from the Vizy field migration input.");
    }

    private function _findLegacyBlock(array $nodes, string $uid): array
    {
        foreach ($nodes as $node) {
            if (!is_array($node)) {
                continue;
            }
            if (($node['type'] ?? null) === 'vizyBlock' && ($node['attrs']['id'] ?? null) === $uid) {
                return $node;
            }
            if (is_array($node['content'] ?? null)) {
                try {
                    return $this->_findLegacyBlock($node['content'], $uid);
                } catch (RuntimeException) {
                    // Continue searching sibling branches.
                }
            }
        }
        throw new RuntimeException("Legacy parent Block {$uid} is missing from the persisted Vizy source.");
    }
}
