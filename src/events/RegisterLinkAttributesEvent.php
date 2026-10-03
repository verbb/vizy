<?php
namespace verbb\vizy\events;

use yii\base\Event;

class RegisterLinkAttributesEvent extends Event
{
    // Properties
    // =========================================================================

    public array $attributes = [];
}
