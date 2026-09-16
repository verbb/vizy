<?php
namespace verbb\vizy\document;

/**
 * Replayable UUID allocation for migrations and canonical subtree copies.
 *
 * @internal Public Builder identity policy is not part of the stable API yet.
 */
final class DeterministicUidFactory
{
    // Properties
    // =========================================================================

    private array $mapping;


    // Public Methods
    // =========================================================================

    public function __construct(
        private readonly string $seed,
        array $mapping = [],
    ) {
        if ($seed === '') {
            throw new \InvalidArgumentException('A deterministic UID seed is required.');
        }

        $this->mapping = $mapping;
    }

    public function uid(string $key): string
    {
        if ($key === '') {
            throw new \InvalidArgumentException('A deterministic UID key is required.');
        }

        if (isset($this->mapping[$key])) {
            return $this->mapping[$key];
        }

        $hex = substr(hash('sha256', $this->seed . "\0" . $key), 0, 32);
        // RFC 4122 variant with a deterministic v5-shaped version nibble.
        $hex[12] = '5';
        $hex[16] = dechex((hexdec($hex[16]) & 0x3) | 0x8);

        return $this->mapping[$key] = sprintf(
            '%s-%s-%s-%s-%s',
            substr($hex, 0, 8),
            substr($hex, 8, 4),
            substr($hex, 12, 4),
            substr($hex, 16, 4),
            substr($hex, 20, 12),
        );
    }

    public function mapping(): array
    {
        ksort($this->mapping);
        return $this->mapping;
    }
}
