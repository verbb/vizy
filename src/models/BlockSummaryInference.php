<?php
namespace verbb\vizy\models;

final readonly class BlockSummaryInference
{
    // Public Methods
    // =========================================================================

    public function __construct(
        public array $titleCandidates,
        public array $subtitleCandidates,
        public array $mediaCandidates,
    ) {
    }
}
