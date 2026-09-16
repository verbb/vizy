<?php
namespace verbb\vizy\document;

/**
 * Lazy read wrapper for canonical layout nodes.
 */
final class VizyLayout
{
    // Public Methods
    // =========================================================================

    public function __construct(
        private VizyDocument $document,
        private string $uid,
        private string $stack,
        private array $columns,
    ) {
    }

    public function document(): VizyDocument
    {
        return $this->document;
    }

    public function uid(): string
    {
        return $this->uid;
    }

    public function stack(): string
    {
        return $this->stack;
    }

    public function columns(): array
    {
        return $this->columns;
    }

    public function toArray(): array
    {
        return [
            'type' => 'layout',
            'attrs' => ['layoutUid' => $this->uid, 'stack' => $this->stack],
            'content' => array_map(static fn(VizyColumn $column): array => $column->toArray(), $this->columns),
        ];
    }
}
