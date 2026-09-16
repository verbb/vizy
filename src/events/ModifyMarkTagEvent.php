<?php
namespace verbb\vizy\events;

use verbb\vizy\base\Mark;
use verbb\vizy\base\RenderContext;

use yii\base\Event;

/**
 * Fired at class level for default render; $mark is null unless an instance path.
 */
class ModifyMarkTagEvent extends Event
{
    // Properties
    // =========================================================================

    public ?array $tag = [];
    public ?Mark $mark = null;
    public array $attrs = [];
    public ?string $typeId = null;
    public ?RenderContext $context = null;
    public ?string $opening = null;
    public ?string $closing = null;
}
