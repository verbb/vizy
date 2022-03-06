<?php
namespace verbb\vizy\events;

use verbb\vizy\base\Node;

use yii\base\Event;

class ModifyNodeTagEvent extends Event
{
    // Properties
    // =========================================================================

    public ?array $tag = [];
    public ?Node $node = null;
    public ?string $opening = null;
    public ?string $closing = null;
}
