<?php
namespace verbb\vizy\events;

use yii\base\Event;

final class RegisterBlockSummaryProvidersEvent extends Event
{
    // Properties
    // =========================================================================

    /**

     *   callable: callable,
     *   requiresTargetMetadata?: bool
     * }>
     */
    public array $providers = [];
}
