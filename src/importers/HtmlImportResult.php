<?php
namespace verbb\vizy\importers;

use verbb\vizy\document\VizyDocument;

/**
 * Canonical output plus the complete loss report for one conversion.
 */
final class HtmlImportResult
{
    // Public Methods
    // =========================================================================

    public function __construct(
        private readonly VizyDocument $document,
        private readonly array $diagnostics,
    ) {
    }

    public function document(): VizyDocument
    {
        return $this->document;
    }

    public function diagnostics(): array
    {
        return $this->diagnostics;
    }

    public function isLossless(): bool
    {
        foreach ($this->diagnostics as $diagnostic) {
            if ($diagnostic instanceof HtmlImportDiagnostic && $diagnostic->lossy) {
                return false;
            }
        }

        return true;
    }
}
