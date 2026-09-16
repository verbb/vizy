<?php
namespace verbb\vizy\events;

use verbb\vizy\base\Node;
use verbb\vizy\base\RenderContext;

use yii\base\Event;

/**
 * Fired at class level for default render; $node is null unless an instance path.
 */
class ModifyNodeTagEvent extends Event
{
    // Properties
    // =========================================================================

    public ?array $tag = [];
    public ?Node $node = null;
    public array $attrs = [];
    public ?string $typeId = null;
    public ?RenderContext $context = null;
    public ?string $opening = null;
    public ?string $closing = null;
}
