<?php
namespace verbb\vizy\events;

use yii\base\Event;

/**
 * @deprecated Use EditorManifests::EVENT_MODIFY_EDITOR_CONFIG with the Vizy 4 config shape.
 * {@see \verbb\vizy\fields\VizyField::EVENT_DEFINE_VIZY_CONFIG} is never triggered. Removed in Vizy 5.
 */
class ModifyVizyConfigEvent extends Event
{
    // Properties
    // =========================================================================

    public ?array $config = null;
    public mixed $field = null;
}
