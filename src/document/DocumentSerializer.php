<?php
namespace verbb\vizy\document;

use verbb\vizy\Vizy;
use verbb\vizy\fields\VizyField;

use craft\fields\Matrix;
use craft\helpers\Json;

/**
 * Projects canonical arrays, optionally synchronizing Matrix for persistence.
 *
 * MatrixAnchor grandfather writes run through {@see \verbb\vizy\services\MatrixPersistence}
 * before owner-save serialization — never during fingerprint/retry projection.
 */
final class DocumentSerializer
{
    // Public Methods
    // =========================================================================

    /**
     * When persisting an owner, sync Matrix anchors before projection. Pure
     * fingerprint and retry projections only strip Matrix blobs and retain the
     * existing matrixAnchorUid without writing.
     */
    public function serialize(VizyDocument $document, bool $persistMatrix = false): array
    {
        if ($document->schemaVersion() !== VizyDocument::CURRENT_SCHEMA_VERSION) {
            throw new InvalidDocumentException('Only current canonical Vizy documents can be serialized.');
        }

        $canonical = $document->toArray();
        unset($canonical['attrs']['_storageToken']);

        if ($persistMatrix) {
            Vizy::$plugin->getMatrixPersistence()->syncCanonicalTree($document, $canonical);
            // Re-bind so nested Hosted sync mutations are visible to projection.
            $document = (new DocumentParser())->parse(
                $canonical,
                $document->owner(),
                $document->field(),
            );
            $canonical = $document->toArray();
        }

        $canonical['content'] = $this->_serializeNodes($document, $canonical['content'], 'content');
        return $canonical;
    }


    // Private Methods
    // =========================================================================

    /**
     * Preserve the raw map and overlay only placements whose current field
     * interpreter has an evidence-backed pure serialization contract.
     */
    private function _serializeNodes(VizyDocument $document, array $nodes, string $basePath): array
    {
        $out = [];

        foreach ($nodes as $index => $node) {
            if (!is_array($node)) {
                continue;
            }

            $path = "{$basePath}.{$index}";

            if (($node['type'] ?? null) === 'vizyBlock') {
                $block = $document->blockFromNode($node, $path);
                $layout = $block->blockType()?->getFieldLayout();

                if ($layout) {
                    $blockElement = null;

                    foreach ($layout->getCustomFieldElements() as $placement) {
                        $placementUid = $placement->uid;
                        $field = $placement->getField();

                        if (!Vizy::$plugin->getFieldLifecycle()->canSerialize($field)) {
                            continue;
                        }

                        // Only the persistence pass may resolve or replace an
                        // anchor reference, or consume its submitted payload.
                        if ($field instanceof Matrix) {
                            continue;
                        }
                        $blockElement ??= $document->blockElement($block);
                        $hasRawValue = $block->hasRawFieldValue($placementUid);

                        if (!$hasRawValue && !$placement->showInForm($blockElement) && !$field instanceof Matrix) {
                            continue;
                        }

                        if ($field instanceof VizyField) {
                            $nested = $blockElement->getFieldValue($field->handle);

                            if (!$nested instanceof VizyDocument) {
                                if (!$hasRawValue) {
                                    continue;
                                }
                                throw new InvalidDocumentException(
                                    "Hosted Vizy field slot {$placementUid} did not normalize to a VizyDocument.",
                                );
                            }
                            // Nested serialize is always pure here — Matrix sync
                            // already ran across the tree when persistMatrix was set.
                            $node['attrs']['fieldSlots'][$placementUid] = $this->serialize($nested, false);
                            continue;
                        }

                        $serialized = $field->serializeValue(
                            $blockElement->getFieldValue($field->handle),
                            $blockElement,
                        );

                        if (!$hasRawValue) {
                            $node['attrs']['fieldSlots'][$placementUid] = $serialized;
                            continue;
                        }

                        $raw = $block->rawFieldValue($placementUid);
                        $node['attrs']['fieldSlots'][$placementUid] = ($raw === null || $raw === '' || $raw === [])
                            ? $raw
                            : $serialized;
                    }
                }
            }

            if (is_array($node['content'] ?? null)) {
                $node['content'] = $this->_serializeNodes($document, $node['content'], "{$path}.content");
            }

            $out[] = $this->_shapeSerializedNode($node);
        }

        return $out;
    }

    private function _shapeSerializedNode(array $node): array
    {
        $type = $node['type'] ?? null;

        if (in_array($type, ['listItem', 'taskItem', 'tableCell', 'tableHeader'], true)) {
            $content = array_values(array_filter($node['content'] ?? []));

            if ($content === []) {
                $content = [['type' => 'paragraph']];
            }

            if (in_array($type, ['listItem', 'taskItem'], true)) {
                $firstType = $content[0]['type'] ?? null;

                if ($firstType !== 'paragraph') {
                    array_unshift($content, ['type' => 'paragraph']);
                }
            }
            $node['content'] = $content;
        }

        if ($type === 'detailsContent' && array_values(array_filter($node['content'] ?? [])) === []) {
            $node['content'] = [['type' => 'paragraph']];
        }

        if ($type === 'mediaEmbed') {
            $node = Json::decode(Json::encode($node));
        }

        return $node;
    }
}
