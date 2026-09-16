import { css } from 'lit';

/**
 * Shared styling for custom elements that render as ProseMirror node views.
 *
 * ProseMirror sets `white-space: break-spaces` on its editable surface so typed
 * whitespace survives a round trip. That value inherits across shadow
 * boundaries, so without a reset every node view renders the indentation of its
 * own Lit template as literal blank lines — inflating headers and toolbars to
 * several times their intended height.
 *
 * The reset is deliberately scoped to `[contenteditable=false]`, which is how
 * these components already mark their non-editable shell. Slotted document
 * content is left alone so it keeps the whitespace behaviour ProseMirror needs.
 *
 * Containers that mix shell with a `<slot>` cannot use the reset (it would
 * inherit into the slotted content), so they lay their children out as a flex
 * column instead: whitespace-only anonymous flex items are never rendered.
 */
export const nodeViewShellStyles = css`
    [contenteditable='false'] {
        white-space: normal;
    }
`;
