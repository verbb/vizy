<?php
namespace verbb\vizy\base;

/**
 * Catalogue / insertion labelling buckets (display strings).
 *
 * Does not drive toolbar palette order today — that uses PALETTE_ORDER.
 */
final class EditorGroup
{
    // Constants
    // =========================================================================

    public const Marks = 'Marks';
    public const Text = 'Text';
    public const Headings = 'Headings';
    public const Lists = 'Lists';
    public const Media = 'Media';
    public const Layout = 'Layout';
    public const Extensions = 'Extensions';
}
