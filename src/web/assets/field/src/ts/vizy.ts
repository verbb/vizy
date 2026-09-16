import '@verbb/plugin-kit-web/plugin-kit.css';
import '@verbb/plugin-kit-web/components/tooltip';
import '@verbb/plugin-kit-web/components/dropdown-menu';
import '@verbb/plugin-kit-web/components/popup';
import '@verbb/plugin-kit-web/components/spinner';
import '@verbb/plugin-kit-web/components/icon/pk-icon.js';
import {
    arrowDown,
    arrowUp,
    check,
    clone,
    code,
    ellipsis,
    eye,
    fileDashedLine,
    gripMove,
    heading,
    lightbulb,
    list,
    listOl,
    listUl,
    magnifyingGlass,
    minus,
    paragraph,
    plus,
    quoteRight,
    registerIcons,
    table,
    xmark,
} from '@verbb/plugin-kit-icons';
import { registerBlockTypeFallbackIcon } from '../../../shared/block-type-icon';
import {
    ban,
    downLeftAndUpRightToCenter,
    grid2,
    upRightAndDownLeftFromCenter,
} from './icons/fa-block-menu';
import { bootstrapEditorWhenReady } from './bootstrap-queue';
import { reportFieldBootFailure } from './field-boot-failure';
import type { EditorBootstrap } from './types';
import './vizy.css';
import { installToolbarStickyOffsetBridge } from './toolbar/toolbar-sticky-offset';
import * as tiptapCore from '@tiptap/core';
import * as pmState from '@tiptap/pm/state';
import * as pmModel from '@tiptap/pm/model';
import * as pmView from '@tiptap/pm/view';
import {
    registerControl,
    registerModule,
    replaceModule,
} from './external-registry';
import { registerInsertion } from './insertion/partner-registry';

// Insertion list + Block header glyphs (FA-derived Plugin Kit set + local FA fills).
registerBlockTypeFallbackIcon();
registerIcons({
    'arrow-down': arrowDown,
    'arrow-up': arrowUp,
    ban,
    check,
    clone,
    code,
    'down-left-and-up-right-to-center': downLeftAndUpRightToCenter,
    ellipsis,
    eye,
    'file-dashed-line': fileDashedLine,
    'grid-2': grid2,
    'grip-move': gripMove,
    heading,
    lightbulb,
    list,
    'list-ol': listOl,
    'list-ul': listUl,
    'magnifying-glass': magnifyingGlass,
    minus,
    paragraph,
    plus,
    'quote-right': quoteRight,
    table,
    'up-right-and-down-left-from-center': upRightAndDownLeftFromCenter,
    xmark,
});

window.Craft ??= {};
window.Craft.Vizy ??= {};

Object.assign(window.Craft.Vizy, {
    bootstrapEditor(id: string, bootstrap: EditorBootstrap): void {
        bootstrapEditorWhenReady(id, bootstrap);
    },
    // Third-party TipTap install (PHP Extensions module ID ↔ factory). See
    // docs/template-guides/extending-vizy.md and the §8.1 design audit.
    registerModule,
    replaceModule,
    registerControl,
    // Slash / gutter / browse palette — Vizy 3 registerCommands replacement.
    registerInsertion,
    // Shared TipTap / ProseMirror — do not bundle a second copy in third-party JS.
    tiptap: {
        core: tiptapCore,
        pm: {
            state: pmState,
            model: pmModel,
            view: pmView,
        },
    },
});

// Partners that load after this file can still call registerModule directly.
// The event lets scripts that booted earlier wait until the API exists.
document.dispatchEvent(new CustomEvent('vizy:register', { bubbles: true }));

// Sticky toolbar pin under Live Preview / slideout scrollports (not entry #header).
installToolbarStickyOffsetBridge();

// Craft's ElementEditor owns the request lifecycle. Observe its public request
// helper once and route only structured Vizy acknowledgements back to editors.
const craft = window.Craft as typeof window.Craft & { __vizyRequestBridge?: boolean };
if (craft?.sendActionRequest && !craft.__vizyRequestBridge) {
    const original = craft.sendActionRequest.bind(craft);
    craft.sendActionRequest = (async (...args: Parameters<typeof original>) => {
        const response = await original(...args);
        if (response?.data && typeof response.data === 'object' && 'vizy' in response.data) {
            document.dispatchEvent(new CustomEvent('vizy:server-response', { detail: response.data }));
        }
        return response;
    }) as typeof craft.sendActionRequest;
    craft.__vizyRequestBridge = true;
}

// Load Block/editor UI in a separate module graph so a definition-time
// throw still lets us register a failure shell instead of a blank field.
void import('./editor-runtime')
    .catch((error: unknown) => {
        reportFieldBootFailure(error);
    });

if (import.meta.hot) import.meta.hot.accept();
