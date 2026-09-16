<?php
namespace verbb\vizy\events;

use craft\base\FieldInterface;

use yii\base\Event;

/**
 * Fired from {@see \verbb\vizy\services\FieldLifecycle::classify()} after the
 * built-in capability is chosen. Plugins may override capability/reason for
 * custom adapters without expanding Vizy's nested-owner blocklist.
 */
class ClassifyFieldEvent extends Event
{
    // Properties
    // =========================================================================

    public FieldInterface $field;
    public string $capability;
    public string $reason;
}
