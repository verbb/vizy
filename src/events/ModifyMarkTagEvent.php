<?php
namespace verbb\vizy\events;

use yii\base\Event;

class ModifyMarkTagEvent extends Event
{
    // Properties
    // =========================================================================

    public $tag;
    public $mark;
    public $opening;
    public $closing;
}
