import { afterEach, describe, expect, it } from 'vitest';
import { Editor, Node } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { BlockUiStateRegistry, FieldHostRegistry } from '../../src/web/assets/field/src/ts/registries';
import {
    adaptCanonicalForEditor,
    DEFAULT_LIMITS,
    validateOpaqueSlice,
    restoreCanonicalFromEditor,
    TransportIntegrityError,
    UnsupportedInlineNode,
    UnsupportedNode,
} from '../../src/web/assets/field/src/ts/transport/opaque';
import { getFieldAdapter } from '../../src/web/assets/field/src/ts/transport/adapters';
import type { CanonicalNode } from '../../src/web/assets/field/src/ts/types';

const editors: Editor[] = [];
const schema = () => {
    const editor = new Editor({
        extensions: [
            StarterKit,
            UnsupportedNode,
            UnsupportedInlineNode,
            Node.create({ name: 'inlineAtom', group: 'inline', inline: true, atom: true }),
        ],
    });
    editors.push(editor);
    return editor.schema;
};

afterEach(() => editors.splice(0).forEach((editor) => editor.destroy()));

describe('opaque canonical transport', () => {
    it('leaves null attributes out of storage, whatever the schema declares', () => {
        // ProseMirror serialises every attribute a type declares, default included, so
        // loading TextAlign for the alignment buttons wrote `"textAlign": null` onto every
        // paragraph in every document. An absent attribute and a null one mean the same
        // thing on the way back in, and the canonical parser reads several of its defaults
        // with `?? 'current'`, which an explicit null does not satisfy.
        const input = {
            type: 'doc',
            content: [
                { type: 'paragraph', attrs: { textAlign: null }, content: [{ type: 'text', text: 'x' }] },
                { type: 'paragraph', attrs: { textAlign: 'center', level: null } },
            ],
        } as CanonicalNode;

        const stored = restoreCanonicalFromEditor(input);

        // Emptied entirely, so the key goes rather than being left as `{}`.
        expect(stored.content?.[0]).not.toHaveProperty('attrs');
        // A real value stays, and only its null neighbour goes.
        expect(stored.content?.[1].attrs).toEqual({ textAlign: 'center' });
    });

    it('replaces and exactly restores an unknown subtree', () => {
        const input: CanonicalNode = {
            type: 'doc',
            content: [{
                type: 'futureBlock',
                attrs: { html: '<script>never</script>' },
                content: [{ type: 'text', text: 'opaque' }],
            }],
        };
        const adapted = adaptCanonicalForEditor(input, schema(), {
            nodes: ['doc', 'paragraph', 'text'],
            marks: [],
        });
        expect(adapted.content?.[0].type).toBe('unsupportedNode');
        expect(restoreCanonicalFromEditor(adapted)).toEqual(input);
    });

    it('makes an unknown mark leaf opaque', () => {
        const input: CanonicalNode = {
            type: 'doc',
            content: [{ type: 'paragraph', content: [{ type: 'text', text: 'x', marks: [{ type: 'futureMark' }] }] }],
        };
        const adapted = adaptCanonicalForEditor(input, schema(), {
            nodes: ['doc', 'paragraph', 'text'],
            marks: [],
        });
        expect(adapted.content?.[0].content?.[0].type).toBe('unsupportedInlineNode');
        expect(restoreCanonicalFromEditor(adapted)).toEqual(input);
    });

    it('rejects reserved canonical content', () => {
        const input = { type: 'doc', content: [{ type: 'unsupportedNode' }] } as CanonicalNode;
        expect(() => adaptCanonicalForEditor(input, schema(), { nodes: ['doc'], marks: [] }))
            .toThrowError(TransportIntegrityError);
    });

    it('rejects malformed placeholder versions', () => {
        const input = {
            type: 'doc',
            content: [{
                type: 'unsupportedNode',
                attrs: { transportVersion: 99, reason: 'unknownNode', originalType: 'x', rawNode: { type: 'x' } },
            }],
        } as CanonicalNode;
        expect(() => restoreCanonicalFromEditor(input)).toThrowError(/unsupportedTransportVersion/);
    });

    it('does not mutate the transport projection while restoring', () => {
        const input: CanonicalNode = { type: 'doc', content: [{ type: 'future' }] };
        const adapted = adaptCanonicalForEditor(input, schema(), { nodes: ['doc'], marks: [] });
        const before = structuredClone(adapted);
        restoreCanonicalFromEditor(adapted);
        expect(adapted).toEqual(before);
    });

    it('normalizes ProseMirror’s omitted empty content into an explicit list', () => {
        // ProseMirror Node.toJSON() drops empty content arrays. Vizy’s doc allows
        // `block*`, so a fully cleared field serialises as `{type:'doc', attrs}` —
        // which DocumentParser rejects unless we restore the canonical empty list.
        const raw = { type: 'doc', attrs: { schemaVersion: 2 } } as CanonicalNode;
        expect(raw).not.toHaveProperty('content');

        expect(restoreCanonicalFromEditor(raw)).toEqual({
            type: 'doc',
            attrs: { schemaVersion: 2 },
            content: [],
        });
    });
});

describe('UID registries', () => {
    it('preserves UI state by UID and reconciles removals', () => {
        const registry = new BlockUiStateRegistry();
        registry.update('a', { collapsed: true });
        expect(registry.get('a').collapsed).toBe(true);
        registry.reconcile(new Set());
        expect(registry.get('a').collapsed).toBe(false);
    });

    it('reacquires the same field-host DOM through a NodeView move', () => {
        const registry = new FieldHostRegistry();
        const first = registry.acquire('a');
        registry.releaseView('a');
        const second = registry.acquire('a');
        expect(second.root).toBe(first.root);
    });

    it('disposes a removed field host exactly once', () => {
        const registry = new FieldHostRegistry();
        const record = registry.acquire('a');
        let count = 0;
        record.disposals.push(() => count++);
        registry.reconcile(new Set());
        registry.dispose('a');
        expect(count).toBe(1);
    });
});

describe('typed field adapters', () => {
    it('reads Plain Text synchronously', () => {
        const root = document.createElement('div');
        root.innerHTML = '<textarea>hello</textarea>';
        expect(getFieldAdapter('craft.plainText').read(root)).toBe('hello');
    });

    it('preserves ordered relation values', () => {
        const root = document.createElement('div');
        root.innerHTML = '<input type="hidden" name="x[]" value="2"><input type="hidden" name="x[]" value="1">';
        expect(getFieldAdapter('craft.entries').read(root)).toEqual(['2', '1']);
    });

    it('reads generic Craft fields from namespaced form controls', () => {
        const root = document.createElement('div');
        root.innerHTML = `
            <select name="vizyHost[n][b][fields][fields][dropdown]">
                <option value="one" selected>One</option>
                <option value="two">Two</option>
            </select>
        `;
        expect(getFieldAdapter('craft.generic').read(root)).toBe('one');

        root.innerHTML = `
            <input type="text" name="vizyHost[n][b][fields][fields][date][date]" value="2026-09-04">
            <input type="text" name="vizyHost[n][b][fields][fields][date][timezone]" value="Australia/Sydney">
        `;
        expect(getFieldAdapter('craft.generic').read(root)).toEqual({
            date: '2026-09-04',
            timezone: 'Australia/Sydney',
        });

        // Date+Time: Craft posts locale from both date.twig and time.twig.
        // Duplicate names must last-win (PHP), not become string[] (getLocaleById).
        root.innerHTML = `
            <input type="text" name="vizyHost[n][b][fields][fields][date][date]" value="9/4/2026">
            <input type="hidden" name="vizyHost[n][b][fields][fields][date][locale]" value="en">
            <input type="text" name="vizyHost[n][b][fields][fields][date][time]" value="3:00 PM">
            <input type="hidden" name="vizyHost[n][b][fields][fields][date][locale]" value="en">
            <input type="hidden" name="vizyHost[n][b][fields][fields][date][timezone]" value="America/Los_Angeles">
        `;
        expect(getFieldAdapter('craft.generic').read(root)).toEqual({
            date: '9/4/2026',
            time: '3:00 PM',
            locale: 'en',
            timezone: 'America/Los_Angeles',
        });

        root.innerHTML = `
            <input type="checkbox" name="vizyHost[n][b][fields][fields][boxes][]" value="a" checked>
            <input type="checkbox" name="vizyHost[n][b][fields][fields][boxes][]" value="b">
            <input type="checkbox" name="vizyHost[n][b][fields][fields][boxes][]" value="c" checked>
        `;
        expect(getFieldAdapter('craft.generic').read(root)).toEqual(['a', 'c']);
    });

    it('preserves singleton structured values after removing the field namespace', () => {
        const root = document.createElement('div');
        root.innerHTML = '<input name="vizyHost[n][b][fields][fields][choice][value]" value="kept">';
        expect(getFieldAdapter('craft.generic').read(root)).toEqual({ value: 'kept' });

        root.innerHTML = '<input name="vizyHost[n][b][fields][fields][coordinates][latitude][value]" value="0">';
        expect(getFieldAdapter('craft.generic').read(root)).toEqual({ latitude: { value: '0' } });

        // A field or value key named fields must not be mistaken for a namespace.
        root.innerHTML = '<input name="vizyHost[n][b][fields][fields][fields][fields][value]" value="kept">';
        expect(getFieldAdapter('craft.generic').read(root)).toEqual({ fields: { value: 'kept' } });

        root.innerHTML = '<input name="fields[choice][value]" value="kept">';
        expect(getFieldAdapter('craft.generic').read(root)).toEqual({ value: 'kept' });

        root.innerHTML = '<input name="vizyHost[n][b][fields][fields][matrix][entries][new1][enabled]" value="1">';
        expect(getFieldAdapter('craft.matrix').read(root)).toEqual({ entries: { new1: { enabled: '1' } } });
    });

    it('captures nested Hyper stores without their temporary authoring inputs', () => {
        const root = document.createElement('div');
        const prefix = 'vizyHost[n][b][fields][fields][matrix]';
        root.innerHTML = `
            <input name="${prefix}[entries][new1][type]" value="row">
            <input data-hyper-store name="${prefix}[entries][new1][fields][links]" value='[{"linkTypeHandle":"url","linkValue":"https://example.test/current"}]'>
            <div data-hyper-input>
                <input name="${prefix}[entries][new1][fields][hyperData][1000000000][linkValue]" value="authoring">
            </div>
        `;
        const value = getFieldAdapter('craft.matrix').read(root) as any;
        // Assert the key first: formatting a billion-slot sparse array can itself fail.
        expect(Object.hasOwn(value.entries.new1.fields, 'hyperData')).toBe(false);
        expect(value.entries.new1.fields.links).toBe('[{"linkTypeHandle":"url","linkValue":"https://example.test/current"}]');
        expect(JSON.stringify(value).length).toBeLessThan(250);

        // A Matrix hosted inside Hyper still owns its native fields and child stores.
        const outerHyper = document.createElement('div');
        outerHyper.dataset.hyperInput = '';
        outerHyper.append(root);
        expect(getFieldAdapter('craft.matrix').read(root)).toEqual(value);
    });

    it('parses Craft JSON field textareas into structured values', () => {
        const root = document.createElement('div');
        root.innerHTML = '<textarea name="fields[jsonField]">{"test":"www"}</textarea>';
        expect(getFieldAdapter('craft.json').read(root)).toEqual({ test: 'www' });

        root.innerHTML = '<textarea name="fields[jsonField]">  </textarea>';
        expect(getFieldAdapter('craft.json').read(root)).toBeNull();

        root.innerHTML = '<textarea name="fields[jsonField]">{broken</textarea>';
        expect(getFieldAdapter('craft.json').read(root)).toEqual({
            __ERROR__: expect.any(String),
            __VALUE__: '{broken',
        });
    });

    it('reads Craft Link fields as {type,value} and ignores ElementSelect name=null chips', () => {
        const root = document.createElement('div');
        root.innerHTML = `
            <select name="vizyHost[n][b][fields][fields][linkField][type]">
                <option value="entry" selected>Entry</option>
                <option value="url">URL</option>
            </select>
            <div data-link-type="entry">
                <div class="elementselect">
                    <ul class="elements"><li><div class="element" data-id="158"></div>
                    <input type="hidden" name="null" value="158"></li></ul>
                </div>
                <input type="hidden" name="vizyHost[n][b][fields][fields][linkField][entry][value]" value="{entry:158@1:url}">
            </div>
            <div data-link-type="url" class="hidden">
                <input type="hidden" name="vizyHost[n][b][fields][fields][linkField][url][value]" value="">
            </div>
        `;
        expect(getFieldAdapter('craft.link').read(root)).toEqual({
            type: 'entry',
            value: '{entry:158@1:url}',
        });

        // Generic must not keep name="null" (blocks unwrap → PHP clears Link).
        expect(getFieldAdapter('craft.generic').read(root)).toEqual({
            type: 'entry',
            entry: { value: '{entry:158@1:url}' },
            url: { value: '' },
        });

        root.innerHTML = `
            <input type="hidden" name="fields[linkField][type]" value="url">
            <div data-link-type="url">
                <input type="hidden" name="fields[linkField][url][value]" value="">
            </div>
        `;
        expect(getFieldAdapter('craft.link').read(root)).toBeNull();
    });

    it('falls back to craft.generic for unknown adapter ids', () => {
        const root = document.createElement('div');
        root.innerHTML = '<input name="fields[x]" value="y">';
        expect(getFieldAdapter('third.party').read(root)).toBe('y');
    });

    it('reads Hosted Vizy from the document input before TipTap is ready', () => {
        const root = document.createElement('div');
        const doc = { type: 'doc', attrs: { schemaVersion: 2 }, content: [{ type: 'paragraph' }] };
        root.innerHTML = `<input type="hidden" data-vizy-document value='${JSON.stringify(doc)}'>`;
        expect(getFieldAdapter('vizy.hosted').read(root)).toEqual(doc);
    });

    it('prefers nested vizy-editor.flush once TipTap is ready, and bind notifies parent', () => {
        const root = document.createElement('div');
        const input = document.createElement('input');
        input.type = 'hidden';
        input.dataset.vizyDocument = '';
        input.value = JSON.stringify({ type: 'doc', attrs: { schemaVersion: 2 }, content: [] });

        const flushed = {
            type: 'doc',
            attrs: { schemaVersion: 2 },
            content: [{ type: 'paragraph', content: [{ type: 'text', text: 'nested' }] }],
        };
        const hosted = document.createElement('vizy-editor') as HTMLElement & {
            editor?: object;
            flush?: (reason: string) => string;
        };
        hosted.editor = {};
        hosted.flush = () => JSON.stringify(flushed);

        root.append(input, hosted);
        expect(getFieldAdapter('vizy.hosted').read(root)).toEqual(flushed);

        let changed = 0;
        const unbind = getFieldAdapter('vizy.hosted').bind?.(root, () => {
            changed += 1;
        });
        hosted.dispatchEvent(new Event('input', { bubbles: true }));
        hosted.dispatchEvent(new Event('change', { bubbles: true }));
        expect(changed).toBe(2);
        unbind?.();
    });

    it('falls back to the input when nested flush throws mid-boot', () => {
        const root = document.createElement('div');
        const doc = { type: 'doc', attrs: { schemaVersion: 2 }, content: [] };
        const input = document.createElement('input');
        input.type = 'hidden';
        input.dataset.vizyDocument = '';
        input.value = JSON.stringify(doc);
        const hosted = document.createElement('vizy-editor') as HTMLElement & {
            editor?: object;
            flush?: (reason: string) => string;
        };
        hosted.editor = {};
        hosted.flush = () => {
            throw new Error('stillBooting');
        };
        root.append(input, hosted);
        expect(getFieldAdapter('vizy.hosted').read(root)).toEqual(doc);
    });
});


describe('document capacity versus clipboard budgets', () => {
    it('allows supported Hosted nesting while retaining a bounded private clipboard depth', () => {
        let nested: any = { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Deep content' }] }] };
        for (let depth = 0; depth < 5; depth++) {
            nested = { type: 'doc', content: [{ type: 'vizyBlock', attrs: {
                blockUid: `depth-${depth}`, blockTypeUid: 'type', fieldSlots: { hosted: nested },
            } }] };
        }
        expect(validateOpaqueSlice({ content: nested.content, openStart: 0, openEnd: 0 })).toMatchObject({ content: nested.content });

        let excessive: unknown = 'end';
        for (let depth = 0; depth <= DEFAULT_LIMITS.maxObjectDepth; depth++) excessive = { nested: excessive };
        expect(() => validateOpaqueSlice({ content: [{ type: 'vizyBlock', attrs: { fieldSlots: { excessive } } }], openStart: 0, openEnd: 0 }))
            .toThrowError(/objectDepthExceeded/);
    });

    it('opens and restores large ordinary documents beyond clipboard size and node limits', () => {
        const input: CanonicalNode = {
            type: 'doc', content: Array.from({ length: 4000 }, (_, index) => ({
                type: 'paragraph', content: [{ type: 'text', text: `Paragraph ${index}: ${'Text '.repeat(20)}` }],
            })),
        };
        expect(JSON.stringify(input).length).toBeGreaterThan(256_000);
        const before = structuredClone(input);
        const adapted = adaptCanonicalForEditor(input, schema(), { nodes: ['doc', 'paragraph', 'text'], marks: [] });
        expect(restoreCanonicalFromEditor(adapted)).toEqual(input);
        expect(input).toEqual(before);
        expect(() => validateOpaqueSlice({ content: input.content, openStart: 0, openEnd: 0 }))
            .toThrowError(/documentBytesExceeded/);
    });

    it('still rejects oversized private clipboard slices by node count', () => {
        const content = Array.from({ length: 1100 }, () => ({
            type: 'paragraph', content: [{ type: 'text', text: 'x' }],
        }));
        expect(() => validateOpaqueSlice({ content, openStart: 0, openEnd: 0 }))
            .toThrowError(/nodeCountExceeded/);
    });
});
