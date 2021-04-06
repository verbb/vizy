<?php
namespace verbb\vizy\events;

use yii\base\Event;

class ModifyNodeTagEvent extends Event
{
    // Properties
    // =========================================================================

    public $tag;
    public $node;
    public $opening;
    public $closing;
}
