<?php
namespace verbb\vizy\events;

use verbb\vizy\base\Mark;

use yii\base\Event;

class ModifyMarkTagEvent extends Event
{
    // Properties
    // =========================================================================

    public ?array $tag = [];
    public ?Mark $mark = null;
    public ?string $opening = null;
    public ?string $closing = null;
}
