<?php
namespace verbb\vizy\events;

use yii\base\Event;

class RegisterPluginEvent extends Event
{
    // Properties
    // =========================================================================

    public array $plugins = [];
}
