<?php
namespace verbb\vizy\events;

use yii\base\Event;

class RegisterMarksEvent extends Event
{
    // Properties
    // =========================================================================

    public array $marks = [];
}
