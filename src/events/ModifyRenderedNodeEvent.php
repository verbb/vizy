<?php
namespace verbb\vizy\events;

use verbb\vizy\base\Node;
use verbb\vizy\base\RenderContext;

use yii\base\Event;

class ModifyRenderedNodeEvent extends Event
{
    // Properties
    // =========================================================================

    public ?string $renderedNode = null;
    public ?Node $node = null;
    public ?string $typeId = null;
    public ?RenderContext $context = null;
}
