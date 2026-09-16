<?php
namespace verbb\vizy\events;

use yii\base\Event;

/**
 * @deprecated Named Editor Configs replace runtime config mutation.
 * {@see \verbb\vizy\fields\VizyField::EVENT_DEFINE_VIZY_CONFIG} is never triggered. Removed in Vizy 5.
 */
class ModifyVizyConfigEvent extends Event
{
    // Properties
    // =========================================================================

    public ?array $config = null;
    public mixed $field = null;
}
