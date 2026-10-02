<?php
namespace verbb\vizy\importers;

use Closure;

/**
 * Request-local bounds, reference resolution, and declarative rules for one conversion.
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
    public array $rules;


    // Public Methods
    // =========================================================================

    public function __construct(
        bool $strict = false,
        ?Closure $assetResolver = null,
        int $maxHtmlBytes = 1000000,
        int $maxNodes = 10000,
        int $maxDepth = 64,
        array $rules = [],
    ) {
        $this->strict = $strict;
        $this->assetResolver = $assetResolver;
        $this->maxHtmlBytes = max(1, $maxHtmlBytes);
        $this->maxNodes = max(1, $maxNodes);
        $this->maxDepth = max(1, $maxDepth);
        $this->rules = $rules;
    }
}
