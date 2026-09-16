<?php
namespace verbb\vizy\document;

/**
 * Thin query/Twig view of a root TipTap node that is not a Vizy Block.
 *
 * Built for {@see VizyDocument::query()} — no TipTap class hydration.
 * Unknown types are preserved as-is in {@see toArray()}.
 *
 * Implements ArrayAccess so yii2mod ArrayQuery can read `type` / `enabled` / …
 */
final class VizyContentNode implements \ArrayAccess
{
    // Public Methods
    // =========================================================================

    public function __construct(
    private VizyDocument $document,
    private array $node,
    private string $path,
    ) {
    }

    public function document(): VizyDocument
    {
        return $this->document;
    }

    public function path(): string
    {
        return $this->path;
    }

    public function getType(): string
    {
        return (string)($this->node['type'] ?? '');
    }

    public function getAttrs(): array
    {
        return is_array($this->node['attrs'] ?? null) ? $this->node['attrs'] : [];
    }

    public function getContent(): array
    {
        return is_array($this->node['content'] ?? null) ? $this->node['content'] : [];
    }

    public function getMarks(): array
    {
        return is_array($this->node['marks'] ?? null) ? $this->node['marks'] : [];
    }

    public function getText(): ?string
    {
        $text = $this->node['text'] ?? null;

        return is_string($text) ? $text : null;
    }

    public function getEnabled(): bool
    {
        return true;
    }

    public function getHandle(): ?string
    {
        return null;
    }

    public function __isset(string $name): bool
    {
        return in_array($name, ['type', 'attrs', 'content', 'marks', 'text', 'enabled', 'handle'], true)
            || array_key_exists($name, $this->node);
    }

    public function __get(string $name): mixed
    {
        return match ($name) {
            'type' => $this->getType(),
            'attrs' => $this->getAttrs(),
            'content' => $this->getContent(),
            'marks' => $this->getMarks(),
            'text' => $this->getText(),
            'enabled' => $this->getEnabled(),
            'handle' => $this->getHandle(),
            default => $this->node[$name] ?? null,
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
        throw new \LogicException('VizyContentNode is immutable.');
    }

    public function offsetUnset(mixed $offset): void
    {
        throw new \LogicException('VizyContentNode is immutable.');
    }

    public function toArray(): array
    {
        return $this->node;
    }
}
