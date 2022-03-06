<?php
namespace verbb\vizy\events;

use yii\base\Event;

class RegisterLinkOptionsEvent extends Event
{
    // Properties
    // =========================================================================

    public array $linkOptions = [];
}
