<?php
namespace verbb\vizy\services;

use RuntimeException;

final class AssetFinalizationException extends RuntimeException
{
    // Public Methods
    // =========================================================================

    public function __construct(
        public readonly array $results,
    ) {
        parent::__construct('Vizy Asset finalization failed after the owner transaction committed.');
    }
}
