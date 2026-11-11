import { expect, it } from 'vitest';
import { getSchema } from '@tiptap/core';
import cases from '../Fixtures/vizy3-normalization.json';
import { resolveTrustedModules } from '../../src/web/assets/field/src/ts/modules';
import { adaptCanonicalForEditor, restoreCanonicalFromEditor, UnsupportedNode, UnsupportedInlineNode } from '../../src/web/assets/field/src/ts/transport/opaque';
import type { CanonicalNode } from '../../src/web/assets/field/src/ts/types';

const nodes = ['doc', 'text', 'paragraph', 'blockquote', 'bulletList', 'orderedList', 'listItem', 'table', 'tableRow', 'tableCell', 'tableHeader', 'mediaEmbed'];
const marks = ['bold', 'link'];
const schema = getSchema([
    ...resolveTrustedModules([
        ...nodes.map(name => `vizy/core/node/${name}`),
        ...marks.map(name => `vizy/core/mark/${name}`),
    ]),
    UnsupportedNode, UnsupportedInlineNode,
]);

it.each(cases)('loads normalized legacy content: $name', ({ expected, preserved }) => {
    // PHP verifies these same expectations against conversion of the legacy input.
    const document = { type: 'doc', attrs: { schemaVersion: 2 }, content: expected } as CanonicalNode;
    const adapted = adaptCanonicalForEditor(document, schema, { nodes, marks });
    schema.nodeFromJSON(adapted).check();
    // Preserved cases intentionally load as unsupported placeholders and restore exactly.
    if (!preserved) {
        expect(JSON.stringify(adapted)).not.toContain('unsupportedInlineNode');
        expect(JSON.stringify(adapted)).not.toContain('unsupportedNode');
    }
    expect(restoreCanonicalFromEditor(adapted)).toEqual(document);
});
