<?php
namespace verbb\vizy\models;

final readonly class BlockSummary
{
    // Public Methods
    // =========================================================================

    public function __construct(
        public string $blockUid,
        public string $blockTypeUid,
        public string $title,
        public ?string $subtitle,
        public ?BlockSummaryMedia $media,
        public bool $enabled,
        public bool $resolved,
        public int $errorCount,
        public int $descendantErrorCount,
    ) {
    }

    public function toArray(): array
    {
        return [
            'blockUid' => $this->blockUid,
            'blockTypeUid' => $this->blockTypeUid,
            'title' => $this->title,
            'subtitle' => $this->subtitle,
            'media' => $this->media?->toArray(),
            'enabled' => $this->enabled,
            'resolved' => $this->resolved,
            'errorCount' => $this->errorCount,
            'descendantErrorCount' => $this->descendantErrorCount,
        ];
    }
}
