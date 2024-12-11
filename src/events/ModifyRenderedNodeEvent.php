<?php
namespace verbb\vizy\events;

use verbb\vizy\base\Node;

use yii\base\Event;

class ModifyRenderedNodeEvent extends Event
{
    // Properties
    // =========================================================================

    public ?string $renderedNode = null;
}
