<?php
namespace verbb\vizy\importers;

use RuntimeException;

final class HtmlImportException extends RuntimeException
{
    // Public Methods
    // =========================================================================

    public function __construct(
        string $message,
        private readonly ?HtmlImportResult $result = null,
    ) {
        parent::__construct($message);
    }

    public function result(): ?HtmlImportResult
    {
        return $this->result;
    }
}
