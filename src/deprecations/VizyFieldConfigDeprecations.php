<?php
namespace verbb\vizy\deprecations;

/**
 * Vizy 3 runtime editor-config mutation — never triggered in Vizy 4.
 *
 * Use `EditorManifests::EVENT_MODIFY_EDITOR_CONFIG` with the Vizy 4 config shape.
 * `EVENT_DEFINE_VIZY_CONFIG` remains inert because its listeners expect Vizy 3 keys.
 */
trait VizyFieldConfigDeprecations
{
    // Constants
    // =========================================================================

    /**
     * @deprecated Use EditorManifests::EVENT_MODIFY_EDITOR_CONFIG. This event is never triggered. Removed in Vizy 5.
     */
    public const EVENT_DEFINE_VIZY_CONFIG = 'defineVizyConfig';
}
