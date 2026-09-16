<?php
namespace verbb\vizy\models;

final readonly class BlockSummaryContext
{
    // Public Methods
    // =========================================================================

    public function __construct(
        public string $documentRevision,
        public string $schemaRevision,
        public ?int $siteId,
    ) {
    }
}
