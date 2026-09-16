<?php
namespace verbb\vizy\events;

use yii\base\Event;

/**
 * @deprecated HTML Purifier is not used in Vizy 4. {@see \verbb\vizy\fields\VizyField::EVENT_MODIFY_PURIFIER_CONFIG}
 * is never triggered. Removed in Vizy 5.
 */
class ModifyPurifierConfigEvent extends Event
{
    // Properties
    // =========================================================================

    public ?array $config = [];
}
