<?php

declare(strict_types=1);

namespace Tests\Support;

use craft\elements\User as UserElement;

/**
 * Console User with the web-only methods CP FieldLayout HTML forms call.
 */
final class WebCapableConsoleUser extends \craft\console\User
{
    public function getRemainingSessionTime(): int
    {
        return -1;
    }

    public function getImpersonator(): ?UserElement
    {
        return null;
    }

    public function getImpersonatorId(): ?int
    {
        return null;
    }

    public function getHasElevatedSession(): bool
    {
        return true;
    }
}
