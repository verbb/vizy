<?php
namespace verbb\vizy\document;

use verbb\vizy\Vizy;
use verbb\vizy\fields\VizyField;
use verbb\vizy\helpers\Matrix as MatrixHelper;

use craft\fields\Matrix;

/**
 * Small migration-grade mutation core over a private canonical array.
 *
 * @internal Deliberately not a public Builder API.
 */
final class InternalDocumentBuilder
{
    // Properties
    // =========================================================================

    private array $working;
    private \Closure $schemaValidator;
    private int $copySequence = 0;


    // Public Methods
    // =========================================================================

    public function __construct(
        private readonly VizyDocument $source,
        callable $schemaValidator,
        private readonly DeterministicUidFactory $uidFactory,
    ) {
        $this->working = $source->toArray();
        $this->schemaValidator = \Closure::fromCallable($schemaValidator);
    }

    public function insert(DocumentLocation $destination, array $content): self
    {
        $nodes = array_is_list($content) ? $content : [$content];
        return $this->_atomic('insert', $destination, function() use ($destination, $nodes): void {
            $path = $this->_resolveDestinationPath($destination);
            $list = $this->_valueAt($path);
            if (!is_array($list) || !array_is_list($list) || $destination->index > count($list)) {
                throw new DocumentMutationException('The insertion destination index is unresolved.');
            }
            array_splice($list, $destination->index, 0, $nodes);
            $this->_setAt($path, $list);
        });
    }

    public function moveBlock(string $blockUid, DocumentLocation $destination): self
    {
        return $this->_atomic('moveBlock', $destination, function() use ($blockUid, $destination): void {
            $sourcePath = $this->_uniqueBlockPath($blockUid);
            $sourceListPath = array_slice($sourcePath, 0, -1);
            $sourceIndex = (int)$sourcePath[array_key_last($sourcePath)];
            $sourceList = $this->_valueAt($sourceListPath);
            $node = $sourceList[$sourceIndex];
            array_splice($sourceList, $sourceIndex, 1);
            $this->_setAt($sourceListPath, $sourceList);

            // Resolve after removal so moving into the source subtree fails closed.
            $destinationPath = $this->_resolveDestinationPath($destination);
            $destinationList = $this->_valueAt($destinationPath);
            $index = $destination->index;
            if ($destinationPath === $sourceListPath && $sourceIndex < $index) {
                $index--;
            }
            if (!is_array($destinationList) || !array_is_list($destinationList) || $index > count($destinationList)) {
                throw new DocumentMutationException('The move destination is unresolved.');
            }
            array_splice($destinationList, $index, 0, [$node]);
            $this->_setAt($destinationPath, $destinationList);
        });
    }

    public function copyBlock(string $blockUid, DocumentLocation $destination): string
    {
        $newRootUid = '';
        $this->_atomic('copyBlock', $destination, function() use ($blockUid, $destination, &$newRootUid): void {
            $node = $this->_valueAt($this->_uniqueBlockPath($blockUid));
            $sequence = ++$this->copySequence;
            $copy = $this->_regenerateBlockUids($node, "copy.{$sequence}", $newRootUid);
            $this->_insertAtDestination($destination, $copy);
        });
        return $newRootUid;
    }

    public function removeBlock(string $blockUid): self
    {
        return $this->_atomic('removeBlock', null, function() use ($blockUid): void {
            $path = $this->_uniqueBlockPath($blockUid);
            $listPath = array_slice($path, 0, -1);
            $list = $this->_valueAt($listPath);
            array_splice($list, (int)$path[array_key_last($path)], 1);
            $this->_setAt($listPath, $list);
        });
    }

    public function setRawPlacement(string $blockUid, string $placementUid, mixed $value): self
    {
        if ($placementUid === '') {
            throw new DocumentMutationException('Raw placement writes require a canonical placement UID.');
        }

        return $this->_atomic('setRawPlacement', null, function() use ($blockUid, $placementUid, $value): void {
            $path = [...$this->_uniqueBlockPath($blockUid), 'attrs', 'fieldSlots'];
            $slots = $this->_valueAt($path);
            if (!is_array($slots)) {
                throw new DocumentMutationException("Block {$blockUid} has no canonical fieldSlots map.");
            }
            $slots[$placementUid] = $value;
            $this->_setAt($path, $slots);
        });
    }

    public function unsetRawPlacement(string $blockUid, string $placementUid): self
    {
        return $this->_atomic('unsetRawPlacement', null, function() use ($blockUid, $placementUid): void {
            $path = [...$this->_uniqueBlockPath($blockUid), 'attrs', 'fieldSlots'];
            $slots = $this->_valueAt($path);
            if (!is_array($slots)) {
                throw new DocumentMutationException("Block {$blockUid} has no canonical fieldSlots map.");
            }
            unset($slots[$placementUid]);
            $this->_setAt($path, $slots);
        });
    }

    public function commit(): VizyDocument
    {
        return $this->_validateWorking('commit', null);
    }

    public function source(): VizyDocument
    {
        return $this->source;
    }

    /**
     * Regenerate every authored Block identity with one caller-owned map.
     *
     * @internal Owner duplication only; drafts/revisions/restores must not call this.
     */
    public function regenerateOwnerDuplicateIdentities(array &$blockUidMap): self
    {
        return $this->_atomic('regenerateOwnerDuplicateIdentities', null, function() use (&$blockUidMap): void {
            foreach ($this->working['content'] as $index => $node) {
                if (is_array($node)) {
                    $rootUid = '';
                    $this->working['content'][$index] = $this->_regenerateBlockUids(
                        $node,
                        "ownerDuplicate.content.{$index}",
                        $rootUid,
                        $blockUidMap,
                    );
                }
            }
        });
    }

    public function workingArray(): array
    {
        return $this->working;
    }


    // Private Methods
    // =========================================================================

    private function _atomic(string $operation, ?DocumentLocation $location, callable $mutation): self
    {
        $before = $this->working;
        $copySequence = $this->copySequence;
        try {
            $mutation();
            $this->_validateWorking($operation, $location);
        } catch (\Throwable $exception) {
            $this->working = $before;
            $this->copySequence = $copySequence;
            if ($exception instanceof DocumentMutationException) {
                throw $exception;
            }
            throw new DocumentMutationException($exception->getMessage(), 0, $exception);
        }
        return $this;
    }

    private function _validateWorking(string $operation, ?DocumentLocation $location): VizyDocument
    {
        $document = (new DocumentParser())->parse(
            $this->working,
            $this->source->owner(),
            $this->source->field(),
        );
        $seen = [];
        foreach ($document->blocks(null) as $block) {
            if (isset($seen[$block->uid()])) {
                throw new DocumentMutationException("Duplicate Block UID {$block->uid()}.");
            }
            $seen[$block->uid()] = true;
        }

        $result = ($this->schemaValidator)($document, $operation, $location);
        if ($result === false) {
            throw new DocumentMutationException("Schema validation rejected {$operation}.");
        }
        return $document;
    }

    private function _resolveDestinationPath(DocumentLocation $location): array
    {
        // Root fragment only — Content Area destinations retired with Hosted nesting.
        return ['content'];
    }

    private function _uniqueBlockPath(string $blockUid): array
    {
        $matches = [];
        $this->_collectBlockPaths($this->working['content'], ['content'], $blockUid, $matches);
        if (count($matches) !== 1) {
            throw new DocumentMutationException(
                count($matches) === 0
                    ? "Block {$blockUid} is unresolved."
                    : "Block {$blockUid} is ambiguous."
            );
        }
        return $matches[0];
    }

    private function _collectBlockPaths(array $nodes, array $base, string $uid, array &$matches): void
    {
        foreach ($nodes as $index => $node) {
            if (!is_array($node)) {
                continue;
            }
            $path = [...$base, $index];
            if (($node['type'] ?? null) === 'vizyBlock' && ($node['attrs']['blockUid'] ?? null) === $uid) {
                $matches[] = $path;
            }
            // Walk layout/column subtrees; vizyBlock is a leaf (no TipTap children).
            if (($node['type'] ?? null) !== 'vizyBlock' && is_array($node['content'] ?? null)) {
                $this->_collectBlockPaths($node['content'], [...$path, 'content'], $uid, $matches);
            }
        }
    }

    private function _insertAtDestination(DocumentLocation $destination, array $node): void
    {
        $path = $this->_resolveDestinationPath($destination);
        $list = $this->_valueAt($path);
        if (!is_array($list) || !array_is_list($list) || $destination->index > count($list)) {
            throw new DocumentMutationException('The copy destination index is unresolved.');
        }
        array_splice($list, $destination->index, 0, [$node]);
        $this->_setAt($path, $list);
    }

    private function _regenerateBlockUids(
        array $node,
        string $key,
        string &$rootUid,
        ?array &$sharedMap = null,
        ?VizyField $contextField = null,
    ): array
    {
        $contextField ??= $this->source->field();
        $type = $node['type'] ?? null;

        // TipTap structure UIDs (layout/column) — not opaque field payloads.
        if ($type === 'layout' && is_string($node['attrs']['layoutUid'] ?? null)) {
            $old = (string)$node['attrs']['layoutUid'];
            $node['attrs']['layoutUid'] = $sharedMap === null
                ? $this->uidFactory->uid("{$key}.layout.{$old}")
                : ($sharedMap[$old] ??= $this->uidFactory->uid("ownerDuplicate.layout.{$old}"));
        }
        if ($type === 'column' && is_string($node['attrs']['columnUid'] ?? null)) {
            $old = (string)$node['attrs']['columnUid'];
            $node['attrs']['columnUid'] = $sharedMap === null
                ? $this->uidFactory->uid("{$key}.column.{$old}")
                : ($sharedMap[$old] ??= $this->uidFactory->uid("ownerDuplicate.column.{$old}"));
        }

        if ($type === 'vizyBlock') {
            $oldUid = (string)($node['attrs']['blockUid'] ?? '');
            // Materialize Matrix blobs before clearing ownership so the copy can
            // persist independent nested Entries on a new MatrixAnchor.
            $this->_materializeMatrixForIndependentCopy($node, $oldUid, $contextField);

            $newUid = $sharedMap === null
                ? $this->uidFactory->uid("{$key}.block.{$oldUid}")
                : ($sharedMap[$oldUid] ??= $this->uidFactory->uid("ownerDuplicate.block.{$oldUid}"));
            $node['attrs']['blockUid'] = $newUid;
            if ($rootUid === '') {
                $rootUid = $newUid;
            }
            // Copies must not share MatrixAnchor ownership with the source.
            unset($node['attrs']['matrixAnchorUid']);

            // Hosted Vizy envelopes only — never rewrite opaque Craft field JSON.
            $slots = $node['attrs']['fieldSlots'] ?? null;
            if (is_array($slots)) {
                $layout = Vizy::$plugin->getBlockTypes()->getBlockTypeByUid((string)($node['attrs']['blockTypeUid'] ?? ''))?->getFieldLayout();
                foreach ($layout?->getCustomFieldElements() ?? [] as $placement) {
                    $nestedField = $placement->getField();
                    $placementUid = $placement->uid;
                    $raw = $slots[$placementUid] ?? null;
                    if (!$nestedField instanceof VizyField || !DocumentWalk::isHostedEnvelope($raw)) {
                        continue;
                    }
                    $nestedRoot = '';
                    $raw['content'] = is_array($raw['content'] ?? null) ? $raw['content'] : [];
                    foreach ($raw['content'] as $nestedIndex => $nestedNode) {
                        if (is_array($nestedNode)) {
                            $raw['content'][$nestedIndex] = $this->_regenerateBlockUids(
                                $nestedNode,
                                "{$key}.hosted.{$placementUid}.{$nestedIndex}",
                                $nestedRoot,
                                $sharedMap,
                                $nestedField,
                            );
                        }
                    }
                    $slots[$placementUid] = $raw;
                }
                $node['attrs']['fieldSlots'] = $slots;
            }

            return $node;
        }

        // Other authored TipTap UIDs on known attr keys (image/link/table).
        foreach (['linkUid', 'imageUid', 'tableUid', 'rowUid', 'cellUid'] as $attrKey) {
            if (is_string($node['attrs'][$attrKey] ?? null) && $node['attrs'][$attrKey] !== '') {
                $old = (string)$node['attrs'][$attrKey];
                $node['attrs'][$attrKey] = $sharedMap === null
                    ? $this->uidFactory->uid("{$key}.{$attrKey}.{$old}")
                    : ($sharedMap[$old] ??= $this->uidFactory->uid("ownerDuplicate.{$attrKey}.{$old}"));
            }
        }

        foreach (($node['content'] ?? []) as $index => $child) {
            if (is_array($child)) {
                $node['content'][$index] = $this->_regenerateBlockUids($child, "{$key}.content.{$index}", $rootUid, $sharedMap, $contextField);
            }
        }
        return $node;
    }

    /**
     * Embed independent Matrix payloads into fieldSlots before detaching
     * matrixAnchorUid. Without this, copies of already-serialized Blocks keep
     * empty Matrix slots and lose nested Entries after the next owner save.
     */
    private function _materializeMatrixForIndependentCopy(array &$node, string $oldBlockUid, ?VizyField $vizyField): void
    {
        $typeUid = (string)($node['attrs']['blockTypeUid'] ?? '');
        if ($typeUid === '') {
            return;
        }

        $layout = Vizy::$plugin->getBlockTypes()->getBlockTypeByUid($typeUid)?->getFieldLayout();
        if (!$layout || !Vizy::$plugin->getAnchors()->blockHasMatrixFields($layout)) {
            return;
        }

        if (!isset($node['attrs']['fieldSlots']) || !is_array($node['attrs']['fieldSlots'])) {
            $node['attrs']['fieldSlots'] = [];
        }

        $owner = $this->source->owner();
        $oldAnchorUid = is_string($node['attrs']['matrixAnchorUid'] ?? null)
            ? $node['attrs']['matrixAnchorUid']
            : null;

        $anchor = null;
        if ($owner && $vizyField && $oldBlockUid !== '') {
            $anchor = Vizy::$plugin->getAnchors()->getAnchor(
                $owner,
                $vizyField,
                $oldBlockUid,
                $oldAnchorUid,
            );
        }

        foreach ($layout->getCustomFieldElements() as $placement) {
            $field = $placement->getField();
            if (!$field instanceof Matrix) {
                continue;
            }

            $existing = $node['attrs']['fieldSlots'][$placement->uid] ?? null;
            if (array_key_exists($placement->uid, $node['attrs']['fieldSlots'])) {
                $node['attrs']['fieldSlots'][$placement->uid] = MatrixHelper::payloadForIndependentCopy($existing);
                continue;
            }

            if (!$anchor) {
                continue;
            }

            $anchor->setFieldLayout($layout);
            $serialized = $field->serializeValue(
                MatrixHelper::nestedEntryQuery($field, $anchor),
                $anchor,
            );

            $node['attrs']['fieldSlots'][$placement->uid] = MatrixHelper::payloadForIndependentCopy($serialized);
        }
    }

    private function _valueAt(array $path): mixed
    {
        $value = $this->working;
        foreach ($path as $segment) {
            if (!is_array($value) || !array_key_exists($segment, $value)) {
                throw new DocumentMutationException('A canonical working location became unresolved.');
            }
            $value = $value[$segment];
        }
        return $value;
    }

    private function _setAt(array $path, mixed $value): void
    {
        $cursor =& $this->working;
        foreach ($path as $segment) {
            if (!is_array($cursor) || !array_key_exists($segment, $cursor)) {
                throw new DocumentMutationException('A canonical working location became unresolved.');
            }
            $cursor =& $cursor[$segment];
        }
        $cursor = $value;
    }
}
