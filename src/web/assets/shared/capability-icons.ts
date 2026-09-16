import { registerIcons, type PkIcon } from '@verbb/plugin-kit-icons';
import {
    alignLeft,
    arrowDown,
    arrowUp,
    bold,
    bracketsCurly,
    chevronDown,
    chevronRight,
    code,
    ellipsis,
    gripMove,
    heading,
    highlighter,
    italic,
    link,
    listOl,
    listUl,
    minus,
    paragraph,
    plus,
    quoteRight,
    strikethrough,
    subscript,
    superscript,
    table,
    textSlash,
    underline,
    xmark,
} from '@verbb/plugin-kit-icons';

/**
 * Plugin Kit's set has no image, columns or embed glyph, so those three are
 * Vizy-owned.
 *
 * They follow the package's own conventions: a `PkIcon` is `{width, height,
 * path}` with edge-cropped path data — no viewBox, no `<svg>` wrapper — and
 * `iconViewBox()` centres it into a square at render. Frames are cut as a hole
 * by giving the inner rectangle the opposite winding to the outer one, so a
 * single non-zero-filled path draws an outline without needing a stroke.
 */
const vizyImage: PkIcon = {
    width: 416,
    height: 320,
    path: 'M0 0h416v320H0z M32 32v256h352V32z M64 256l88-112 56 68 52-60 92 104z M84 80a28 28 0 1 1 56 0 28 28 0 1 1-56 0z',
};

const vizyColumns: PkIcon = {
    width: 384,
    height: 320,
    path: 'M0 0h176v320H0z M208 0h176v320H208z',
};

const vizyEmbed: PkIcon = {
    width: 448,
    height: 320,
    path: 'M0 0h448v320H0z M32 32v256h384V32z M176 96l128 64-128 64z',
};

/**
 * Registers every icon the Editor Config screen can render, keyed by the names
 * `EditorConfigPresentation::ICONS` emits. Registration is additive and keyed,
 * so calling this alongside another screen's `registerIcons()` is safe.
 */
export function registerCapabilityIcons(): void {
    registerIcons({
        'align-left': alignLeft,
        'arrow-down': arrowDown,
        'arrow-up': arrowUp,
        'bold': bold,
        'brackets-curly': bracketsCurly,
        'chevron-down': chevronDown,
        'chevron-right': chevronRight,
        'code': code,
        'ellipsis': ellipsis,
        'grip-move': gripMove,
        'heading': heading,
        'highlighter': highlighter,
        'italic': italic,
        'link': link,
        'list-ol': listOl,
        'list-ul': listUl,
        'minus': minus,
        'paragraph': paragraph,
        'plus': plus,
        'quote-right': quoteRight,
        'strikethrough': strikethrough,
        'subscript': subscript,
        'superscript': superscript,
        'table': table,
        'text-slash': textSlash,
        'underline': underline,
        'xmark': xmark,
        'vizy-image': vizyImage,
        'vizy-columns': vizyColumns,
        'vizy-embed': vizyEmbed,
    });
}
