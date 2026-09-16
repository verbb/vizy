<?php
namespace verbb\vizy\document;

final class UnsupportedDocumentVersionException extends InvalidDocumentException
{
    // Public Methods
    // =========================================================================

    public function __construct(
        public readonly int $detectedVersion,
        public readonly int $currentVersion,
    ) {
        parent::__construct("Vizy document schema version {$detectedVersion} is newer than supported version {$currentVersion}.");
    }
}
