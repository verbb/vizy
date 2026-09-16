<?php
namespace verbb\vizy\deprecations;

use Craft;

/**
 * Legacy Node/Mark class registration — NodeCollection has been removed.
 *
 * Events still exist so old listeners fail loudly via deprecation rather than
 * a missing constant. Prefer {@see \verbb\vizy\services\Extensions}
 * `$event->nodes[]` / `$event->marks[]`. Removed in Vizy 5.
 */
trait VizyNodesRegistryDeprecations
{
    // Constants
    // =========================================================================

    /**
     * @deprecated Prefer Extensions `$event->nodes[]`. Removed in Vizy 5.
     */
    public const EVENT_REGISTER_NODES = 'registerNodes';

    /**
     * @deprecated Prefer Extensions `$event->marks[]`. Removed in Vizy 5.
     */
    public const EVENT_REGISTER_MARKS = 'registerMarks';


    // Protected Methods
    // =========================================================================

    protected function warnNodesRegistry(string $method, string $message): void
    {
        Craft::$app->getDeprecator()->log("verbb\\vizy\\services\\Nodes::{$method}", $message);
    }
}
