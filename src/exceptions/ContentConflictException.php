<?php
namespace verbb\vizy\exceptions;

use craft\base\ElementInterface;

use RuntimeException;

/** A stale write, distinct from an invalid token or an unexpected save failure. */
final class ContentConflictException extends RuntimeException
{
    // Properties
    // =========================================================================

    public readonly ElementInterface $owner;


    // Public Methods
    // =========================================================================

    public function __construct(ElementInterface $owner)
    {
        $this->owner = $owner;
        parent::__construct('This Vizy content changed after it was opened. Your changes have not been saved.');
    }
}
