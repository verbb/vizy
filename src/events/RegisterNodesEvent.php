<?php
namespace verbb\vizy\events;

use yii\base\Event;

class RegisterNodesEvent extends Event
{
    // Properties
    // =========================================================================

    public $nodes = [];
}
