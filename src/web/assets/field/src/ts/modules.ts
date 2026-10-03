import { Node, type AnyExtension } from '@tiptap/core';
import { Placeholder } from '@tiptap/extensions/placeholder';
import Blockquote from '@tiptap/extension-blockquote';
import Bold from '@tiptap/extension-bold';
import Code from '@tiptap/extension-code';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Details, { DetailsContent, DetailsSummary } from '@tiptap/extension-details';
import HardBreak from '@tiptap/extension-hard-break';
import Heading from '@tiptap/extension-heading';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Italic from '@tiptap/extension-italic';
import { BulletList, ListItem, OrderedList, TaskItem, TaskList } from '@tiptap/extension-list';
import Paragraph from '@tiptap/extension-paragraph';
import Strike from '@tiptap/extension-strike';
import Text from '@tiptap/extension-text';
import Underline from '@tiptap/extension-underline';
import Typography from '@tiptap/extension-typography';
import FindAndReplace from '@tiptap/extension-find-and-replace';
import Highlight from '@tiptap/extension-highlight';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import RubyText from '@tiptap/extension-ruby-text';
import TableRow from '@tiptap/extension-table-row';
import { createSemanticImage } from './semantic/image';
import { createSemanticLink } from './semantic/link';
import { createSemanticTable, createSemanticTableCell, createSemanticTableHeader } from './semantic/table';
import { createVizyIframe } from './semantic/iframe';
import { createVizyMediaEmbed } from './semantic/media-embed';
import { createVizyEmoji } from './semantic/emoji';
import { createVizyCharacterCount } from './semantic/character-count';
import { FootnoteItem, FootnoteList, FootnoteReference } from './semantic/footnotes';
import {
    BackgroundColor,
    Color,
    FontFamily,
    FontSize,
    LineHeight,
    TextStyle,
} from '@tiptap/extension-text-style';
import type { NodeViewServices } from './extensions';
import { createVizyBlock } from './extensions';
import { createVizyLayout, createVizyColumn } from './layout/nodes';
import type { EditorManifest } from './types';
import { applyModuleReplacers, getExternalModuleFactory } from './external-registry';
import { common, createLowlight } from 'lowlight';

export interface TrustedModuleContext {
    manifest: EditorManifest;
    services: () => NodeViewServices;
}

export type TrustedModuleFactory = (context?: TrustedModuleContext) => AnyExtension | AnyExtension[];

/**
 * PHP may select only identifiers registered in this compile-time map. Values
 * are bundled imports; manifest strings are never passed to import() or a URL.
 */
const emptyManifest: EditorManifest = {
    manifestVersion: 1,
    uid: '',
    revision: '',
    hash: '',
    registryRevision: '',
    schemaRevision: '',
    enabledNodes: [],
    enabledMarks: [],
    internalNodes: ['doc', 'text', 'vizyBlock'],
    modules: [],
    field: {
        fieldUid: '',
        rootContentType: 'rich',
        blockTypePickerGroups: [],
        allowedBlockTypeUids: [],
        insertableBlockTypeUids: [],
        minBlocks: null,
        maxBlocks: null,
        confirmBlockDeletion: false,
        sameBlockTypeMaxDepth: 3,
    },
    blockTypes: {},
    insertionItems: [],
};

const CanonicalDocument = Node.create({
    name: 'doc',
    topNode: true,
    content: 'block*',
    addAttributes: () => ({ schemaVersion: { default: 2, rendered: false } }),
});

/** Every level, which is what TipTap's Heading ships with. */
const ALL_HEADING_LEVELS: Array<1 | 2 | 3 | 4 | 5 | 6> = [1, 2, 3, 4, 5, 6];
const codeLowlight = createLowlight(common);

/**
 * The levels to build Heading's schema from.
 *
 * Falls back to all six for a manifest that names none. Two cases reach that, and neither wants
 * an empty list: one cached before the manifest carried levels at all, and a factory called
 * with no context (the module map is exercised that way). An empty `levels` would leave Heading
 * with no parse rules and no valid level to render, which is a broken schema rather than a
 * strict one — the server drops the node entirely when a config allows no levels, so "heading
 * loaded with nothing allowed" is a state this build never produces.
 */
function headingLevels(manifest?: EditorManifest): Array<1 | 2 | 3 | 4 | 5 | 6> {
    const levels = (manifest?.headingLevels ?? [])
        .filter((level): level is 1 | 2 | 3 | 4 | 5 | 6 => ALL_HEADING_LEVELS.includes(level as 1));

    return levels.length ? levels : ALL_HEADING_LEVELS;
}

export const TRUSTED_MODULES: Readonly<Record<string, TrustedModuleFactory>> = Object.freeze(
    {
        'vizy/core/node/doc': () => CanonicalDocument,
        'vizy/core/node/text': () => Text,
        'vizy/core/node/vizyBlock': (context) => createVizyBlock(context?.services ?? (() => {
            throw new Error('vizyNodeViewServicesMissing');
        })),
        'vizy/core/node/layout': (context) => createVizyLayout(() => ({
            editor: context?.services?.().editor,
        })),
        'vizy/core/node/column': () => createVizyColumn(),
        'vizy/core/node/paragraph': () => Paragraph,
        // Configured, not stock. The levels are a schema decision — TipTap builds Heading's
        // parse rules from this list, so an `<h1>` pasted into a config that disallows H1
        // arrives as a paragraph instead of as a heading nobody offered a button for.
        'vizy/core/node/heading': (context) => Heading.configure({
            levels: headingLevels(context?.manifest),
        }),
        'vizy/core/node/blockquote': () => Blockquote,
        'vizy/core/node/codeBlock': () => CodeBlockLowlight.configure({ lowlight: codeLowlight }),
        'vizy/core/node/horizontalRule': () => HorizontalRule,
        'vizy/core/node/hardBreak': () => HardBreak,
        'vizy/core/node/bulletList': () => BulletList,
        'vizy/core/node/orderedList': () => OrderedList,
        'vizy/core/node/listItem': () => ListItem,
        'vizy/core/node/taskList': () => TaskList,
        'vizy/core/node/taskItem': () => TaskItem.configure({ nested: true }),
        'vizy/core/node/details': () => Details.configure({ persist: false }),
        'vizy/core/node/detailsSummary': () => DetailsSummary,
        'vizy/core/node/detailsContent': () => DetailsContent,
        'vizy/core/node/footnoteReference': () => FootnoteReference,
        'vizy/core/node/footnoteList': () => FootnoteList,
        'vizy/core/node/footnoteItem': () => FootnoteItem,
        'vizy/core/node/emoji': () => createVizyEmoji(),
        'vizy/core/node/image': () => createSemanticImage(),
        'vizy/core/node/iframe': () => createVizyIframe(),
        'vizy/core/node/mediaEmbed': () => createVizyMediaEmbed(),
        'vizy/core/node/table': () => createSemanticTable(),
        'vizy/core/node/tableRow': () => TableRow,
        'vizy/core/node/tableCell': () => createSemanticTableCell(),
        'vizy/core/node/tableHeader': () => createSemanticTableHeader(),
        'vizy/core/mark/bold': () => Bold,
        'vizy/core/mark/code': () => Code,
        'vizy/core/mark/highlight': () => Highlight,
        'vizy/core/mark/italic': () => Italic,
        'vizy/core/mark/link': (context) => createSemanticLink(context?.manifest.field.linkAttributes),
        'vizy/core/mark/strike': () => Strike,
        'vizy/core/mark/subscript': () => Subscript,
        'vizy/core/mark/superscript': () => Superscript,
        'vizy/core/mark/rubyText': () => RubyText,
        // One persisted mark owns the official value extensions. Keeping them behind the
        // Text style capability prevents five implementation details from cluttering the
        // schema picker while still loading each official TipTap command natively.
        'vizy/core/mark/textStyle': () => [
            TextStyle,
            Color,
            BackgroundColor,
            FontFamily,
            FontSize,
            LineHeight,
        ],
        'vizy/core/mark/underline': () => Underline,
        'vizy/core/extension/characterCount': (context) => createVizyCharacterCount({
            limit: context?.manifest.extensionOptions?.characterCount?.limit ?? null,
            autoTrim: false,
        }),
        'vizy/core/extension/placeholder': (context) => Placeholder.configure({
            placeholder: context?.manifest.extensionOptions?.placeholder?.text ?? 'Write something …',
        }),
        'vizy/core/extension/typography': () => Typography,
        'vizy/core/extension/findAndReplace': () => FindAndReplace.configure({
            injectCSS: false,
            searchDebounceMs: 0,
        }),
    },
);

export function resolveTrustedModules(ids: readonly string[], context?: TrustedModuleContext): AnyExtension[] {
    // Core compile-time map first; partner runtime map second. Manifest IDs that
    // match neither fail closed — PHP declared a module the CP never registered.
    const resolved = ids.flatMap((id) => {
        const factory = TRUSTED_MODULES[id] ?? getExternalModuleFactory(id);
        if (!factory) throw new Error(`untrustedEditorModule:${id}`);
        const extensions = factory(context);
        return Array.isArray(extensions) ? extensions : [extensions];
    });

    return applyModuleReplacers(resolved, context);
}

/** @deprecated Prefer {@link resolveTrustedModules} — same hybrid resolver. */
export function resolveEditorModules(ids: readonly string[], context?: TrustedModuleContext): AnyExtension[] {
    return resolveTrustedModules(ids, context);
}
