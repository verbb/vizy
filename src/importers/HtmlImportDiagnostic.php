<?php
namespace verbb\vizy\importers;

/**
 * One deterministic explanation of representation lost or rejected during import.
 */
final class HtmlImportDiagnostic
{
    // Public Methods
    // =========================================================================

    public function __construct(
        public readonly string $code,
        public readonly string $message,
        public readonly string $path,
        public readonly bool $lossy = true,
        public readonly array $details = [],
    ) {
    }

    public function toArray(): array
    {
        return [
            'code' => $this->code,
            'message' => $this->message,
            'path' => $this->path,
            'lossy' => $this->lossy,
            'details' => $this->details,
        ];
    }
}
