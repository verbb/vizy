<?php
namespace verbb\vizy\base;

/**
 * Where a type may appear as a toolbar / Bubble Menu button.
 *
 * Stored Editor Config item ids still equal {@see MarkInterface::id()} /
 * {@see NodeInterface::id()} when surfaces are non-empty.
 */
final class EditorSurface
{
    // Constants
    // =========================================================================

    public const Toolbar = 'toolbar';
    public const Bubble = 'bubble';
}
