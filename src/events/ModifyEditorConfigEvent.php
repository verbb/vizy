<?php
namespace verbb\vizy\events;

use verbb\vizy\fields\VizyField;

use yii\base\Event;

/**
 * Allows a named Editor Config to be adjusted for one Vizy field at runtime.
 *
 * The config contains only authorable keys. Vizy normalizes and resolves it after the event,
 * before building, hashing, caching, or validating against the editor manifest.
 */
class ModifyEditorConfigEvent extends Event
{
    // Properties
    // =========================================================================

    public array $config = [];
    public ?VizyField $field = null;
    public string $configId = '';
}
