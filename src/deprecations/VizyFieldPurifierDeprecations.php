<?php
namespace verbb\vizy\deprecations;

/**
 * Vizy 3 HTML Purifier hooks — kept only so existing listeners keep resolving.
 *
 * Purifier was removed from Vizy (performance + nested-content stripping). Vizy 4
 * does not trigger this event. XSS is handled via schema allowlists, encode-on-
 * render, and URL/embed policy — revisit in a dedicated security pass. Removed
 * in Vizy 5.
 */
trait VizyFieldPurifierDeprecations
{
    // Constants
    // =========================================================================

    /**
     * @deprecated HTML Purifier is not used. This event is never triggered. Removed in Vizy 5.
     */
    public const EVENT_MODIFY_PURIFIER_CONFIG = 'modifyPurifierConfig';
}
