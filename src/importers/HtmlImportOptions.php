<?php
namespace verbb\vizy\importers;

use Closure;

/**
 * Bounds and caller-owned reference resolution for one HTML conversion.
 */
final class HtmlImportOptions
{
    // Properties
    // =========================================================================

    public bool $strict;
    public int $maxHtmlBytes;
    public int $maxNodes;
    public int $maxDepth;
    public ?Closure $assetResolver;


    // Public Methods
    // =========================================================================

    public function __construct(
        bool $strict = false,
        ?Closure $assetResolver = null,
        int $maxHtmlBytes = 1000000,
        int $maxNodes = 10000,
        int $maxDepth = 64,
    ) {
        $this->strict = $strict;
        $this->assetResolver = $assetResolver;
        $this->maxHtmlBytes = max(1, $maxHtmlBytes);
        $this->maxNodes = max(1, $maxNodes);
        $this->maxDepth = max(1, $maxDepth);
    }
}
