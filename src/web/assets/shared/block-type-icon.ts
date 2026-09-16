import type { PkIcon } from '@verbb/plugin-kit-icons';
import { registerIcons } from '@verbb/plugin-kit-icons';

/** `<pk-icon>` name for block types with no configured icon. Matches `Icons::BLOCK_TYPE_FALLBACK_ICON`. */
export const BLOCK_TYPE_FALLBACK_ICON = 'vizy-block-fallback';

/** Hex block glyph — keep path data in sync if the fallback artwork changes. */
export const blockTypeFallbackIcon: PkIcon = {
    width: 512,
    height: 512,
    path: 'M224.3-2.5c19.8-11.4 44.2-11.4 64 0L464.2 99c19.8 11.4 32 32.6 32 55.4l0 203c0 22.9-12.2 44-32 55.4L288.3 514.5c-19.8 11.4-44.2 11.4-64 0L48.5 413c-19.8-11.4-32-32.6-32-55.4l0-203c0-22.9 12.2-44 32-55.4L224.3-2.5zm207.8 360l0-166.1-143.8 83 0 166.1 143.8-83z',
};

let registered = false;

/** Idempotent — safe when both field-settings and authoring bundles load. */
export function registerBlockTypeFallbackIcon(): void {
    if (registered) return;
    registerIcons({ [BLOCK_TYPE_FALLBACK_ICON]: blockTypeFallbackIcon });
    registered = true;
}
