<?php
namespace verbb\vizy\document;

use verbb\vizy\models\BlockType;

use craft\errors\InvalidFieldException;

use OutOfBoundsException;

/**
 * Immutable view of one canonical vizyBlock node.
 *
 * TipTap leaf: nested composition lives in Hosted Vizy `fieldSlots`, not slot children.
 * ArrayAccess supports {@see VizyDocument::query()} (yii2mod ArrayQuery).
 */
final class VizyBlock implements \ArrayAccess
{
    // Static Methods
    // =========================================================================

    public static function fromCanonicalNode(VizyDocument $document, array $node, string $path): self
    {
        $attrs = $node['attrs'];
        return new self(
            $document,
            $attrs['blockUid'],
            $attrs['blockTypeUid'],
            $attrs['enabled'],
            $attrs['fieldSlots'],
            $node,
            $path,
        );
    }


    // Public Methods
    // =========================================================================

    public function document(): VizyDocument
    {
        return $this->document;
    }

    public function uid(): string
    {
        return $this->blockUid;
    }

    public function path(): string
    {
        return $this->path;
    }

    /**
     * MatrixAnchor UID when this Block grandfathers Matrix-in-Block content.
     */
    public function matrixAnchorUid(): ?string
    {
        $uid = $this->rawNode['attrs']['matrixAnchorUid'] ?? null;
        return is_string($uid) && $uid !== '' ? $uid : null;
    }

    public function blockTypeUid(): string
    {
        return $this->blockTypeUid;
    }

    public function isEnabled(): bool
    {
        return $this->enabled;
    }

    public function getType(): string
    {
        return 'vizyBlock';
    }

    public function getHandle(): ?string
    {
        $handle = $this->blockType()?->handle;

        return is_string($handle) && $handle !== '' ? $handle : null;
    }

    public function getEnabled(): bool
    {
        return $this->isEnabled();
    }

    public function blockType(): ?BlockType
    {
        return $this->document->resolveBlockType($this->blockTypeUid);
    }

    public function isResolved(): bool
    {
        return $this->blockType()?->getFieldLayout() !== null;
    }

    public function rawFieldValues(): array
    {
        return $this->fieldSlots;
    }

    public function hasRawFieldValue(string $fieldLayoutElementUid): bool
    {
        return array_key_exists($fieldLayoutElementUid, $this->fieldSlots);
    }

    public function rawFieldValue(string $fieldLayoutElementUid): mixed
    {
        if (!$this->hasRawFieldValue($fieldLayoutElementUid)) {
            throw new OutOfBoundsException("No raw value exists for FieldLayout placement {$fieldLayoutElementUid}.");
        }

        return $this->fieldSlots[$fieldLayoutElementUid];
    }

    public function hasField(string $handle): bool
    {
        $layout = $this->blockType()?->getFieldLayout();
        return $layout?->getFieldByHandle($handle) !== null;
    }

    public function fieldValue(string $handle): mixed
    {
        if (!$this->hasField($handle)) {
            throw new InvalidFieldException($handle, "Vizy Block {$this->blockUid} has no resolved field '{$handle}'.");
        }

        return $this->document->blockElement($this)->getFieldValue($handle);
    }

    public function __isset(string $name): bool
    {
        return $this->_isReservedQueryProperty($name) || $this->hasField($name);
    }

    public function __get(string $name): mixed
    {
        return match ($name) {
            'type' => $this->getType(),
            'handle' => $this->getHandle(),
            'enabled' => $this->getEnabled(),
            'uid' => $this->uid(),
            default => $this->fieldValue($name),
        };
    }

    public function offsetExists(mixed $offset): bool
    {
        return $this->__isset((string)$offset);
    }

    public function offsetGet(mixed $offset): mixed
    {
        return $this->__get((string)$offset);
    }

    public function offsetSet(mixed $offset, mixed $value): void
    {
        throw new \LogicException('VizyBlock is immutable.');
    }

    public function offsetUnset(mixed $offset): void
    {
        throw new \LogicException('VizyBlock is immutable.');
    }

    public function toArray(): array
    {
        return $this->rawNode;
    }


    // Private Methods
    // =========================================================================

    private function __construct(
        private VizyDocument $document,
        private string $blockUid,
        private string $blockTypeUid,
        private bool $enabled,
        private array $fieldSlots,
        private array $rawNode,
        private string $path,
    ) {
    }

    private function _isReservedQueryProperty(string $name): bool
    {
        return in_array($name, ['type', 'handle', 'enabled', 'uid'], true);
    }
}
