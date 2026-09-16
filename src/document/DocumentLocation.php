<?php
namespace verbb\vizy\document;

/**
 * UID-addressed canonical insertion destination (root fragment only).
 *
 * Content Area destinations were retired with Hosted Vizy as sole nesting.
 *
 * @internal Public location/reference types are not part of the stable API yet.
 */
final readonly class DocumentLocation
{
    // Static Methods
    // =========================================================================

    public static function root(int $index): self
    {
        return new self($index);
    }


    // Public Methods
    // =========================================================================

    public function isRoot(): bool
    {
        return true;
    }


    // Private Methods
    // =========================================================================

    private function __construct(
        public int $index,
    ) {
        if ($index < 0) {
            throw new \InvalidArgumentException('A document destination index cannot be negative.');
        }
    }
}
