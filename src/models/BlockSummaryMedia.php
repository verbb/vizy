<?php
namespace verbb\vizy\models;

final readonly class BlockSummaryMedia
{
    // Public Methods
    // =========================================================================

    public function __construct(
        public string $kind,
        public string|int|null $reference,
        public ?string $alt,
        public ?string $thumbnailUrl,
    ) {
    }

    public function toArray(): array
    {
        return [
            'kind' => $this->kind,
            'reference' => $this->reference,
            'alt' => $this->alt,
            'thumbnailUrl' => $this->thumbnailUrl,
        ];
    }
}
