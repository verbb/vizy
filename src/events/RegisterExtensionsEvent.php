<?php
namespace verbb\vizy\events;

use yii\base\Event;

/**
 * TipTap-shaped registration: class lists per kind.
 *
 * Prefer ::class at boot — do not require new Type() (avoids field/element coupling).
 */
final class RegisterExtensionsEvent extends Event
{
    // Properties
    // =========================================================================

    public array $marks = [];
    public array $nodes = [];
    public array $extensions = [];
}
