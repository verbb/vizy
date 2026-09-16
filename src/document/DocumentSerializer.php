<?php
namespace verbb\vizy\document;

use verbb\vizy\Vizy;
use verbb\vizy\fields\VizyField;

use craft\fields\Matrix;
use craft\helpers\Json;
use craft\helpers\StringHelper;

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
    private function _serializeNodes(VizyDocument $document, array $nodes, string $basePath, ?string $parentType = null): array
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

                        // V3 can omit an empty Matrix anchor UID on one site even
                        // though the ownership row exists. Resolve it read-only so
                        // migration fingerprints match the subsequent owner save.
                        if ($field instanceof Matrix) {
                            unset($node['attrs']['fieldSlots'][$placementUid]);
                            $existingUid = is_string($node['attrs']['matrixAnchorUid'] ?? null)
                                ? $node['attrs']['matrixAnchorUid']
                                : $blockElement->getMatrixAnchor()?->uid;
                            if ($existingUid) {
                                $node['attrs']['matrixAnchorUid'] = $existingUid;
                            }
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
                $node['content'] = $this->_serializeNodes($document, $node['content'], "{$path}.content", $node['type'] ?? null);
            }

            $requiredParagraph = $index === 0 && in_array($parentType, ['listItem', 'blockquote', 'column', 'tableCell', 'tableHeader'], true);
            $shaped = $this->_shapeSerializedNode($document, $node, $requiredParagraph);
            if ($shaped !== null) {
                $out[] = $shaped;
            }
        }

        return $out;
    }

    private function _shapeSerializedNode(VizyDocument $document, array $node, bool $requiredParagraph = false): ?array
    {
        $type = $node['type'] ?? null;

        // Structural containers need a child even when their leading paragraph is empty.
        if ($type === 'paragraph' && !$requiredParagraph && ($document->field()?->trimEmptyParagraphs ?? false)) {
            $firstType = $node['content'][0]['type'] ?? null;
            if (!$firstType) {
                $text = StringHelper::trim((string)($node['content'][0]['text'] ?? ''));
                if ($text === '') {
                    return null;
                }
            }
        }

        if (in_array($type, ['listItem', 'tableCell', 'tableHeader'], true)) {
            $content = array_values(array_filter($node['content'] ?? []));
            if ($content === []) {
                $content = [['type' => 'paragraph']];
            }
            if ($type === 'listItem') {
                $firstType = $content[0]['type'] ?? null;
                if ($firstType !== 'paragraph') {
                    array_unshift($content, ['type' => 'paragraph']);
                }
            }
            $node['content'] = $content;
        }

        if ($type === 'mediaEmbed') {
            $node = Json::decode(Json::encode($node));
        }

        return $node;
    }
}
