import { describe, expect, it } from 'vitest';
import {
    encodeCraftQueryPair,
    rewriteCraftSerializedForm,
} from '../../src/web/assets/field/src/ts/serialize-form-capture';

describe('rewriteCraftSerializedForm', () => {
    it('replaces duplicate values in nested namespaces while preserving other editors and encoded text', () => {
        const fieldName = 'fields[parent][fields][body]';
        const canonical = JSON.stringify({ type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Café & tea + 日本語 😀' }] }] });
        // Literal wire input is independent of the encoder under test.
        const neighbour = 'title=Caf%C3%A9%20%26%20tea%20%2B%20%E6%97%A5%E6%9C%AC%E8%AA%9E';
        const input = [
            'fields%5Bparent%5D%5Bfields%5D%5Bbody%5D=old',
            'fields%5Bparent%5D%5Bfields%5D%5Bbody%5D=older',
            'fields%5Bparent%5D%5BvizyHost%5D%5Bb%5D=discard',
            'vizyHost%5Bn%5D%5Bb%5D=discard',
            'fields%5Bother%5D=keep',
            'vizyTransport%5Bother%5D%5Bgeneration%5D=4',
            neighbour,
        ].join('&');
        const rewritten = rewriteCraftSerializedForm(input, {
            fieldName, canonical, editorId: 'nested', metadata: { generation: '2' },
        });
        const decoded = new URLSearchParams(rewritten);
        expect(decoded.getAll(fieldName)).toEqual([canonical]);
        expect([...decoded.keys()].filter((key) => key.includes('vizyHost'))).toEqual([]);
        expect(decoded.get('fields[other]')).toBe('keep');
        expect(decoded.get('vizyTransport[other][generation]')).toBe('4');
        expect(decoded.getAll('vizyTransport[nested][generation]')).toEqual(['2']);
        expect(rewritten.split('&')).toContain(neighbour);
        expect(JSON.parse(decoded.get(fieldName)!)).toEqual(JSON.parse(canonical));
    });
    it('encodes spaces as %20 like jQuery.param, not + like URLSearchParams', () => {
        const fieldName = 'fields[myVizy]';
        const canonical = JSON.stringify({
            type: 'doc',
            content: [{ type: 'text', text: 'Testing something' }],
        });

        // Craft/jQuery leaves neighbouring fields with %20; do not re-encode them.
        const titlePair = encodeCraftQueryPair('title', 'Hello World');
        const serialized = [
            encodeCraftQueryPair(fieldName, 'stale'),
            encodeCraftQueryPair('vizyHost[n][b][fields][heading]', 'widget'),
            titlePair,
        ].join('&');

        const rewritten = rewriteCraftSerializedForm(serialized, {
            fieldName,
            canonical,
            editorId: 'vizy-1',
            metadata: { requestKind: 'autosave', generation: '3' },
        });

        expect(rewritten).toContain(titlePair);
        const decoded = new URLSearchParams(rewritten);
        expect([...decoded.keys()].filter((key) => key.startsWith('vizyHost[') || key.includes('[vizyHost]'))).toEqual([]);
        expect(decoded.getAll(fieldName)).toEqual([canonical]);
        expect(rewritten).toContain(encodeCraftQueryPair(fieldName, canonical));
        expect(rewritten).toContain('Testing%20something');
        expect(rewritten).not.toContain('Testing+something');
        expect(rewritten).toContain(
            encodeCraftQueryPair('vizyTransport[vizy-1][requestKind]', 'autosave'),
        );

        // Regression: URLSearchParams would have corrupted the title too.
        const broken = new URLSearchParams(serialized);
        broken.delete(fieldName);
        broken.append(fieldName, canonical);
        expect(broken.toString()).toContain('Testing+something');
        expect(broken.toString()).toContain('Hello+World');
    });

    it('replaces prior transport pairs for the same editor without duplicating', () => {
        const fieldName = 'fields[myVizy]';
        const first = rewriteCraftSerializedForm('title=Keep', {
            fieldName,
            canonical: '{}',
            editorId: 'vizy-1',
            metadata: { generation: '1' },
        });
        const second = rewriteCraftSerializedForm(first, {
            fieldName,
            canonical: '{"ok":true}',
            editorId: 'vizy-1',
            metadata: { generation: '2' },
        });

        expect(second.match(/vizyTransport%5Bvizy-1%5D%5Bgeneration%5D=/g)?.length).toBe(1);
        expect(second).toContain(encodeCraftQueryPair('vizyTransport[vizy-1][generation]', '2'));
        expect(second).toContain('title=Keep');
    });
});
