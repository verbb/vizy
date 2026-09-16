<?php
namespace verbb\vizy\models;

final readonly class BlockSummaryDefinition
{
    // Static Methods
    // =========================================================================

    public static function fromConfig(?array $config): self
    {
        if (!is_array($config)) {
            return new self();
        }

        return new self(
            titlePlacementUid: self::_nullableUid($config['titlePlacementUid'] ?? null),
            subtitlePlacementUid: self::_nullableUid($config['subtitlePlacementUid'] ?? null),
            mediaPlacementUid: self::_nullableUid($config['mediaPlacementUid'] ?? null),
            provider: is_string($config['provider'] ?? null) && $config['provider'] !== ''
                ? $config['provider']
                : null,
        );
    }

    private static function _nullableUid(mixed $value): ?string
    {
        return is_string($value) && $value !== '' ? $value : null;
    }


    // Public Methods
    // =========================================================================

    public function __construct(
        public ?string $titlePlacementUid = null,
        public ?string $subtitlePlacementUid = null,
        public ?string $mediaPlacementUid = null,
        public ?string $provider = null,
    ) {
    }

    public function toConfig(): array
    {
        return array_filter([
            'titlePlacementUid' => $this->titlePlacementUid,
            'subtitlePlacementUid' => $this->subtitlePlacementUid,
            'mediaPlacementUid' => $this->mediaPlacementUid,
            'provider' => $this->provider,
        ], static fn(mixed $value) => $value !== null && $value !== '');
    }
}
