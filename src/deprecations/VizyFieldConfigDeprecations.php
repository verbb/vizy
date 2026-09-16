<?php
namespace verbb\vizy\deprecations;

/**
 * Vizy 3 runtime editor-config mutation — never triggered in Vizy 4.
 *
 * Named Editor Configs (Project Config / `config/vizy/*.json`) replace
 * `EVENT_DEFINE_VIZY_CONFIG`. Removed in Vizy 5.
 */
trait VizyFieldConfigDeprecations
{
    // Constants
    // =========================================================================

    /**
     * @deprecated Named Editor Configs replace runtime config mutation. This event is never triggered. Removed in Vizy 5.
     */
    public const EVENT_DEFINE_VIZY_CONFIG = 'defineVizyConfig';
}
