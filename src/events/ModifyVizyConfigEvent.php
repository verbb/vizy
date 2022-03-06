<?php
namespace verbb\vizy\events;

use yii\base\Event;

class ModifyVizyConfigEvent extends Event
{
    // Properties
    // =========================================================================

    public ?array $config = null;
    public mixed $field = null;
}
