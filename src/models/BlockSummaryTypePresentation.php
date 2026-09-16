<?php
namespace verbb\vizy\models;

final readonly class BlockSummaryTypePresentation
{
    // Static Methods
    // =========================================================================

    public static function fromBlockType(BlockType $type): self
    {
        return new self(
            blockTypeUid: (string)$type->uid,
            title: $type->name,
            subtitle: null,
            icon: $type->icon,
        );
    }


    // Public Methods
    // =========================================================================

    public function __construct(
        public string $blockTypeUid,
        public string $title,
        public ?string $subtitle,
        public mixed $icon,
    ) {
    }

    public function toArray(): array
    {
        return [
            'blockTypeUid' => $this->blockTypeUid,
            'title' => $this->title,
            'subtitle' => $this->subtitle,
            'icon' => $this->icon,
        ];
    }
}
