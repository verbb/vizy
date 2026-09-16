<?php
namespace verbb\vizy\services;

use verbb\vizy\Vizy;
use verbb\vizy\document\DeterministicUidFactory;
use verbb\vizy\document\DocumentParser;
use verbb\vizy\document\DocumentWalk;
use verbb\vizy\document\InternalDocumentBuilder;
use verbb\vizy\document\VizyBlock;
use verbb\vizy\document\VizyDocument;
use verbb\vizy\fields\VizyField;

use craft\base\Component;
use craft\base\ElementInterface;

use RuntimeException;

final class MultisiteDocuments extends Component
{
    // Properties
    // =========================================================================

    private array $ownerDuplicateUidMaps = [];
    private array $activePropagations = [];
    private mixed $propagationProbe = null;


    // Public Methods
    // =========================================================================

    public function setPropagationProbeForTesting(?callable $probe): void
    {
        $this->propagationProbe = $probe;
    }

    public function mergeForCraftPropagation(VizyDocument $source, VizyDocument $target): VizyDocument
    {
        $sourceOwner = $source->owner();
        $targetOwner = $target->owner();
        $field = $source->field();
        if (!$sourceOwner || !$targetOwner || !$field) {
            throw new RuntimeException('Craft propagation guard requires exact source, target, and field context.');
        }
        $key = implode(':', [
            $sourceOwner::class,
            (string)$sourceOwner->id,
            (string)$sourceOwner->siteId,
            (string)$targetOwner->siteId,
            (string)$field->uid,
        ]);
        if (isset($this->activePropagations[$key])) {
            throw new RuntimeException("Recursive Vizy propagation was prevented for {$key}.");
        }

        $this->activePropagations[$key] = true;
        try {
            if ($this->propagationProbe) {
                ($this->propagationProbe)($source, $target);
            }
            return $this->mergeForPropagation($source, $target);
        } finally {
            unset($this->activePropagations[$key]);
        }
    }

    public function mergeForPropagation(VizyDocument $source, VizyDocument $target): VizyDocument
    {
        $sourceOwner = $source->owner();
        $targetOwner = $target->owner();
        $field = $source->field();
        if (!$sourceOwner || !$targetOwner || !$field || $target->field() !== $field) {
            throw new RuntimeException('Multisite merge requires source and target documents for the same field with exact owner context.');
        }

        if ($field->getTranslationKey($sourceOwner) !== $field->getTranslationKey($targetOwner)) {
            return $target;
        }

        $sourceBlocks = $this->_indexBlocks($source);
        $targetBlocks = $this->_indexBlocks($target);
        $canonical = $source->toArray();
        $canonical['content'] = $this->_mergeNodes(
            $canonical['content'],
            $sourceBlocks,
            $targetBlocks,
        );

        return (new DocumentParser())->parse($canonical, $targetOwner, $field);
    }

    public function duplicateForOwner(
        VizyDocument $source,
        ElementInterface $newOwner,
        array &$blockUidMap,
    ): VizyDocument {
        $seed = (string)($newOwner->uid ?: $newOwner->id ?: spl_object_id($newOwner));
        $builder = new InternalDocumentBuilder(
            $source,
            static fn() => true,
            new DeterministicUidFactory("owner-duplicate:{$seed}"),
        );
        return $builder->regenerateOwnerDuplicateIdentities($blockUidMap)
            ->commit()
            ->recontextualize($newOwner, $source->field());
    }

    /**
     * Craft duplicates each localized owner separately. Keep one recursive map
     * for the new logical owner so every localized copy receives identical UIDs.
     */
    public function duplicateForCraftOwner(VizyDocument $source, ElementInterface $newOwner): VizyDocument
    {
        $field = $source->field();
        if (!$field || !$newOwner->uid) {
            throw new RuntimeException('Craft owner duplication requires field context and the new owner UID.');
        }

        $key = $newOwner::class . ':' . $newOwner->uid . ':' . ($field->uid ?? $field->handle);
        $map = $this->ownerDuplicateUidMaps[$key] ?? [];
        $duplicate = $this->duplicateForOwner($source, $newOwner, $map);
        $this->ownerDuplicateUidMaps[$key] = $map;

        return $duplicate;
    }


    // Private Methods
    // =========================================================================

    private function _indexBlocks(VizyDocument $document): array
    {
        $indexed = [];
        foreach ($document->blocks(null) as $block) {
            if (isset($indexed[$block->uid()])) {
                throw new RuntimeException("Duplicate Vizy Block UID {$block->uid()} prevents multisite merge.");
            }
            $indexed[$block->uid()] = $block;
        }
        return $indexed;
    }

    private function _mergeNodes(array $nodes, array $sourceBlocks, array $targetBlocks): array
    {
        foreach ($nodes as $index => $node) {
            if (($node['type'] ?? null) === 'vizyBlock') {
                $uid = $node['attrs']['blockUid'];
                $sourceBlock = $sourceBlocks[$uid];
                $targetBlock = $targetBlocks[$uid] ?? null;
                if ($targetBlock) {
                    $node['attrs']['fieldSlots'] = $this->_mergeFieldSlots($sourceBlock, $targetBlock);
                }
            }

            // Source structure remains authoritative at every Content Area depth.
            if (is_array($node['content'] ?? null)) {
                $node['content'] = $this->_mergeNodes($node['content'], $sourceBlocks, $targetBlocks);
            }
            $nodes[$index] = $node;
        }
        return $nodes;
    }

    private function _mergeFieldSlots(VizyBlock $source, VizyBlock $target): array
    {
        $merged = $source->rawFieldValues();
        $layout = $source->blockType()?->getFieldLayout();
        if (!$layout) {
            // Unresolved source schema cannot reinterpret either side; target raw
            // slots win for the surviving logical Block.
            return $target->rawFieldValues() + $merged;
        }

        $resolved = [];
        foreach ($layout->getCustomFieldElements() as $placement) {
            $uid = $placement->uid;
            $resolved[$uid] = true;
            $field = $placement->getField();
            $sourceKey = $field->getTranslationKey($source->document()->blockElement($source));
            $targetKey = $field->getTranslationKey($target->document()->blockElement($target));

            // Differing translation keys: the target site owns this placement.
            if ($sourceKey !== $targetKey && $target->hasRawFieldValue($uid)) {
                $merged[$uid] = $target->rawFieldValue($uid);
                continue;
            }

            // Same key + Hosted Vizy: recurse so *inner* field translation still
            // applies (nontranslated Hosted wrapping translated Plain Text, etc.).
            if (
                $field instanceof VizyField
                && $target->hasRawFieldValue($uid)
                && DocumentWalk::isHostedEnvelope($merged[$uid] ?? null)
                && DocumentWalk::isHostedEnvelope($target->rawFieldValue($uid))
            ) {
                $merged[$uid] = $this->_mergeHostedEnvelopes(
                    $merged[$uid],
                    $target->rawFieldValue($uid),
                    $source,
                    $target,
                    $field,
                );
            }
        }

        // Orphan slots have no current interpreter. Preserve the target side for
        // surviving Blocks rather than claiming or deleting it.
        foreach ($target->rawFieldValues() as $uid => $value) {
            if (!isset($resolved[$uid])) {
                $merged[$uid] = $value;
            }
        }

        return $merged;
    }

    /**
     * Merge two Hosted Vizy document envelopes: source structure, target-local
     * translated placements (same rules as the outer document merge).
     */
    private function _mergeHostedEnvelopes(
        array $sourceEnvelope,
        array $targetEnvelope,
        VizyBlock $sourceBlock,
        VizyBlock $targetBlock,
        VizyField $hostedField,
    ): array {
        $sourceOwner = $sourceBlock->document()->owner();
        $targetOwner = $targetBlock->document()->owner();
        if (!$sourceOwner || !$targetOwner) {
            return $sourceEnvelope;
        }

        $sourceDoc = Vizy::$plugin->getDocuments()->normalizeValue(
            $sourceEnvelope,
            $sourceOwner,
            $hostedField,
        );
        $targetDoc = Vizy::$plugin->getDocuments()->normalizeValue(
            $targetEnvelope,
            $targetOwner,
            $hostedField,
        );

        // Outer Hosted placement already matched translation keys; merge nested
        // TipTap structure without re-checking the Hosted field itself.
        $canonical = $sourceDoc->toArray();
        $canonical['content'] = $this->_mergeNodes(
            $canonical['content'],
            $this->_indexBlocks($sourceDoc),
            $this->_indexBlocks($targetDoc),
        );

        return $canonical;
    }
}
