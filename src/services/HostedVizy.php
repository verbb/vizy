<?php
namespace verbb\vizy\services;

use craft\base\Component;

/**
 * Hosted Vizy Editors — nested Vizy fields inside Block FieldLayouts.
 *
 * Rendering depth is tracked while FieldLayoutForms builds Block HTML so a
 * nested Vizy field can compute its hosted depth and refuse past MAX_DEPTH.
 * Depth 0 = Entry (or other non-Block) Vizy field. Depth 1 = Vizy on a Block
 * belonging to a depth-0 editor.
 *
 * `entryFieldUid` is the Vizy field placed on the Entry layout — every deeper
 * hosted editor must auth FieldLayout requests against that placement, not the
 * immediate parent (which may itself be Block-hosted).
 */
final class HostedVizy extends Component
{
    // Static Methods
    // =========================================================================

    public static function renderingDepth(): int
    {
        return self::$renderingDepth;
    }

    public static function setRenderingDepth(int $depth): void
    {
        self::$renderingDepth = max(0, $depth);
    }

    public static function entryFieldUid(): ?string
    {
        return self::$entryFieldUid;
    }

    public static function setEntryFieldUid(?string $uid): void
    {
        self::$entryFieldUid = $uid !== null && $uid !== '' ? $uid : null;
    }

    public static function renderingPath(): array
    {
        return self::$renderingPath;
    }

    public static function setRenderingPath(array $path): void
    {
        self::$renderingPath = $path;
    }

    /**
     * Depth of a Vizy field being rendered inside the current FieldLayout pass.
     * Parent rendering depth 0 → this hosted editor is depth 1.
     */
    public static function nextDepth(): int
    {
        return self::$renderingDepth + 1;
    }

    public static function allowsDepth(int $depth): bool
    {
        return $depth >= 1 && $depth <= self::MAX_DEPTH;
    }


    // Constants
    // =========================================================================

    /**
     * Max Vizy-in-Vizy field depth (Entry → Block → nested Vizy → …).
     * Depth 0 = Entry field; each hosted Vizy inside a Block increments by 1.
     */
    public const MAX_DEPTH = 5;


    // Properties
    // =========================================================================

    private static int $renderingDepth = 0;
    private static ?string $entryFieldUid = null;
    private static array $renderingPath = [];
}
