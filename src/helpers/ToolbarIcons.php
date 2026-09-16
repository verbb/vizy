<?php
namespace verbb\vizy\helpers;

use verbb\vizy\Vizy;

/**
 * Glyphs for toolbar and Bubble Menu controls.
 *
 * The set is Vizy 3's, verbatim. `src/inc/toolbar-icons.json` holds the SVGs that
 * Vizy 3 inlined in `SvgIcon.vue`, plus the seven it took straight from Font Awesome,
 * lifted from its own bundle so those are the same artwork too. Mapping the toolbar
 * onto the Font Awesome catalog Vizy already ships for the Block Type icon picker was
 * tried first and looked close, but only close: a different major of Font Awesome draws
 * a different bold, and an editor's buttons are the part of an upgrade every author sees
 * every day. Vizy 3 also drew all six heading levels, which the catalog does not.
 *
 * Anything Vizy 3 had no button for — table operations, layout, the dropdown triggers —
 * falls back to that catalog, which is also where a plugin's registered glyph is found.
 */
final class ToolbarIcons
{
    // Static Methods
    // =========================================================================

    /**
     * Inline SVG for a control, or null when it has no mapped glyph.
     */
    public static function svgFor(string $controlId): ?string
    {
        $name = self::ICONS[$controlId] ?? null;

        return $name === null ? null : self::glyph($name);
    }

    /**
     * Inline SVG for a glyph by name: Vizy 3's set first, then the bundled catalog.
     *
     * This is the seam a registered dropdown's icon comes through, so a plugin can name
     * either — the glyph a Vizy 3 toolbar wore, or anything the icon picker offers.
     */
    public static function glyph(string $name): ?string
    {
        self::$bundled ??= self::_loadBundled();

        if (isset(self::$bundled[$name])) {
            return self::$bundled[$name];
        }

        // The catalog holds ~2,000 icons and scans linearly per lookup, so the whole
        // toolbar's worth is resolved in one indexed pass the first time any of it is asked
        // for, rather than once per control.
        self::$catalog ??= Vizy::$plugin->getIcons()->getSvgsForValues(
            array_values(array_unique(self::ICONS)),
        );

        return self::$catalog[$name] ?? Vizy::$plugin->getIcons()->getSvgForValue($name);
    }

    public static function reset(): void
    {
        self::$bundled = null;
        self::$catalog = null;
    }

    private static function _loadBundled(): array
    {
        $json = @file_get_contents(__DIR__ . '/../inc/toolbar-icons.json');
        $icons = $json === false ? null : json_decode($json, true);

        return is_array($icons) ? $icons : [];
    }


    // Constants
    // =========================================================================

    /**
     * Control ID => glyph name.
     *
     * Keys are toolbar/bubble control IDs, which for capabilities are the capability name
     * and for actions the action name. Values are Vizy 3's glyph names, and the pairing is
     * Vizy 3's `Buttons.js` — including the ones that are not the obvious match, which are
     * the reason this is a table and not a naming convention: `paragraph` is a serif T
     * rather than a pilcrow, the inline `code` mark is curly brackets while the `codeBlock`
     * node gets the angle brackets, and a line break is the page-break glyph.
     */
    private const ICONS = [
        // Marks
        'bold' => 'bold',
        'code' => 'brackets-curly',
        'highlight' => 'highlighter',
        'italic' => 'italic',
        'link' => 'link',
        'strike' => 'strikethrough',
        'subscript' => 'subscript',
        'superscript' => 'superscript',
        'underline' => 'underline',

        // Nodes
        'blockquote' => 'quote-right',
        'bulletList' => 'list-ul',
        'codeBlock' => 'code',
        'hardBreak' => 'page-break',
        'horizontalRule' => 'horizontal-rule',
        'image' => 'image',
        'orderedList' => 'list-ol',
        'paragraph' => 'text',
        'table' => 'table',

        // `html` is retired (whole-document source view); glyph kept for stale references.
        // mediaEmbed / iframe are live Media toolbar buttons.
        'html' => 'file-code',
        'mediaEmbed' => 'photo-film',
        'iframe' => 'rectangle-code',

        // One glyph per heading level. Vizy 3 drew these itself rather than taking them
        // from an icon set, which is why all six exist and read as a series.
        'heading1' => 'h1',
        'heading2' => 'h2',
        'heading3' => 'h3',
        'heading4' => 'h4',
        'heading5' => 'h5',
        'heading6' => 'h6',

        // Actions, which apply to whatever is selected rather than being a capability of
        // their own. See `EditorConfigPresentation::ACTIONS`.
        'undo' => 'undo',
        'redo' => 'redo',
        'clearFormatting' => 'remove-format',
        // FA catalog plus — same insert intent as slot / gutter `pk-icon` "plus".
        'addBlock' => 'plus-solid',
        'alignLeft' => 'align-left',
        'alignCenter' => 'align-center',
        'alignRight' => 'align-right',
        'alignJustify' => 'align-justify',

        // Controls Vizy 3 had no button for, so these come from the Font Awesome catalog.
        //
        // `heading` is the generic capability, which a toolbar cannot name — it is here for
        // the Headings dropdown's trigger.
        'heading' => 'heading-solid',
        'layout' => 'table-columns-solid',
        'textStyle' => 'font-solid',

        // Table operations. No icon set has a distinct glyph for twelve variations on a grid,
        // and Vizy 3 drew these as labelled menu items rather than as buttons — which is how
        // they are met here too, inside the Table dropdown, where the label carries the
        // meaning. So these say which *kind* of operation it is, and pair up: arrows for the
        // direction a row or column is inserted, a minus for taking one away, group and ungroup
        // for merging and splitting cells, and a grid for the header toggles.
        'tableAddRowBefore' => 'arrow-up-solid',
        'tableAddRowAfter' => 'arrow-down-solid',
        'tableDeleteRow' => 'square-minus-solid',
        'tableAddColumnBefore' => 'arrow-left-solid',
        'tableAddColumnAfter' => 'arrow-right-solid',
        'tableDeleteColumn' => 'circle-minus-solid',
        'tableMergeCells' => 'object-group-solid',
        'tableSplitCell' => 'object-ungroup-solid',
        'tableToggleHeaderRow' => 'table-list-solid',
        'tableToggleHeaderColumn' => 'table-cells-large-solid',
        'tableToggleHeaderCell' => 'border-all-solid',
        'tableDelete' => 'trash-can-solid',
    ];


    // Properties
    // =========================================================================

    private static ?array $bundled = null;
    private static ?array $catalog = null;
}
