<?php
namespace verbb\vizy\services;

use verbb\vizy\Vizy;
use verbb\vizy\document\DocumentWalk;
use verbb\vizy\document\VizyBlock;
use verbb\vizy\document\VizyDocument;
use verbb\vizy\elements\Block;
use verbb\vizy\fields\VizyField;
use verbb\vizy\helpers\Matrix as MatrixHelper;

use craft\base\Component;
use craft\fields\Matrix;
use craft\helpers\Json;

use RuntimeException;

/**
 * Matrix-in-Block grandfather persistence — explicit write boundary.
 *
 * Canonical serialize/fingerprint stay pure. Owner-save serialization calls
 * {@see syncCanonicalTree()} so Matrix Entries land on MatrixAnchor before the
 * JSON snapshot is stored.
 */
final class MatrixPersistence extends Component
{
    // Public Methods
    // =========================================================================

    /**
     * Ensure anchors and sync Matrix fieldSlots onto them for every Block
     * (including Hosted). Mutates `$canonical` content tree in place with
     * `matrixAnchorUid` and stripped Matrix blobs.
     */
    public function syncCanonicalTree(VizyDocument $document, array &$canonical): void
    {
        if (!isset($canonical['content']) || !is_array($canonical['content'])) {
            return;
        }
        $canonical['content'] = $this->_syncNodes($document, $canonical['content'], 'content');
    }

    /**
     * Sync one Block's Matrix placements into `$node` attrs (by reference).
     */
    public function syncBlockNode(VizyDocument $document, VizyBlock $block, array &$node): void
    {
        $layout = $block->blockType()?->getFieldLayout();
        if (!$layout) {
            return;
        }

        foreach ($layout->getCustomFieldElements() as $placement) {
            $field = $placement->getField();
            if (!$field instanceof Matrix) {
                continue;
            }
            $this->_syncMatrixPlacement(
                $document,
                $block,
                $node,
                $field,
                $placement->uid,
                $block->hasRawFieldValue($placement->uid),
            );
        }
    }


    // Private Methods
    // =========================================================================

    private function _syncNodes(VizyDocument $document, array $nodes, string $basePath): array
    {
        foreach ($nodes as $index => $node) {
            if (!is_array($node)) {
                continue;
            }
            $path = "{$basePath}.{$index}";
            if (($node['type'] ?? null) === 'vizyBlock') {
                $block = $document->blockFromNode($node, $path);
                $this->syncBlockNode($document, $block, $node);

                // Hosted Vizy: sync nested documents before embedding them.
                $layout = $block->blockType()?->getFieldLayout();
                if ($layout) {
                    foreach ($layout->getCustomFieldElements() as $placement) {
                        $field = $placement->getField();
                        if (!$field instanceof VizyField) {
                            continue;
                        }
                        $raw = $node['attrs']['fieldSlots'][$placement->uid] ?? null;
                        if (!DocumentWalk::isHostedEnvelope($raw)) {
                            continue;
                        }
                        $nested = Vizy::$plugin->getDocuments()->normalizeValue(
                            $raw,
                            $document->owner(),
                            $field,
                        );
                        $nestedCanonical = $nested->toArray();
                        $this->syncCanonicalTree($nested, $nestedCanonical);
                        $node['attrs']['fieldSlots'][$placement->uid] = $nestedCanonical;
                    }
                }
            }

            if (is_array($node['content'] ?? null)) {
                $node['content'] = $this->_syncNodes($document, $node['content'], "{$path}.content");
            }
            $nodes[$index] = $node;
        }

        return $nodes;
    }

    private function _syncMatrixPlacement(
        VizyDocument $document,
        VizyBlock $block,
        array &$node,
        Matrix $field,
        string $placementUid,
        bool $hasRawValue,
    ): void {
        $owner = $document->owner();
        $vizyField = $document->field();
        while ($owner instanceof Block) {
            $owner = $owner->getOwner();
        }
        if (!$owner || !$vizyField || !$owner->id) {
            throw new RuntimeException('Matrix persistence requires a saved Vizy owner.');
        }
        $priorAnchor = Vizy::$plugin->getAnchors()->getAnchor($owner, $vizyField, $block->uid());

        $layout = $block->blockType()?->getFieldLayout();
        $anchor = Vizy::$plugin->getAnchors()->ensureAnchor(
            $owner,
            $vizyField,
            $block->uid(),
            $layout,
            null,
        );
        if (!$anchor) {
            throw new RuntimeException('Unable to persist the Vizy Matrix anchor.');
        }

        $node['attrs']['matrixAnchorUid'] = $anchor->uid;

        if (!$hasRawValue) {
            // Publishing a persisted draft/revision must copy its snapshot over
            // the existing canonical anchor, even when no Matrix POST is present.
            $sourceOwner = $owner->duplicateOf;
            if ($priorAnchor && $sourceOwner && $sourceOwner->id !== $owner->id) {
                $source = Vizy::$plugin->getAnchors()->getAnchor($sourceOwner, $vizyField, $block->uid());
                if ($source) {
                    $source->setFieldLayout($layout);
                    Vizy::$plugin->getAnchors()->copyMatrixField($field, $source, $anchor);
                }
            }
            return;
        }

        $content = $block->rawFieldValue($placementUid) ?? '';
        if (is_string($content) && Json::isJsonObject($content)) {
            $content = Json::decode($content);
        }

        if (MatrixHelper::isCraft5MatrixContent($content)) {
            $content = MatrixHelper::ensureSortOrder($content);
            $fieldValue = $field->normalizeValueFromRequest($content, $anchor);
        } else {
            $content = MatrixHelper::sanitizeMatrixContent($field, $content);
            $fieldValue = $field->normalizeValue($content, $anchor);
        }

        Vizy::$plugin->getAnchors()->saveMatrixField($field, $anchor, $fieldValue, false);

        // Craft's nested-element manager already runs the real Entry lifecycle.
        // Replaying field callbacks would duplicate side effects and hide failures.
        unset($node['attrs']['fieldSlots'][$placementUid]);
    }
}
