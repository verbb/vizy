import { afterEach, describe, expect, it } from 'vitest';
import { registerVizyFormSerializer } from '../../src/web/assets/field/src/ts/craft-form-serializer';
import { encodeCraftQueryPair } from '../../src/web/assets/field/src/ts/serialize-form-capture';

type FormSerializer = () => string;

function installCraftFormMock(initial: string, serialize: () => string) {
    const data = new Map<string, unknown>([['initialSerializedValue', initial]]);
    const previous = window.$;
    window.$ = (() => ({
        data(key: string, value?: unknown) {
            if (arguments.length === 2) {
                data.set(key, value);
                return value;
            }
            return data.get(key);
        },
        removeData(key: string) {
            data.delete(key);
        },
        serialize,
        on() {},
        off() {},
    })) as typeof window.$;
    return {
        data,
        restore: () => {
            window.$ = previous;
        },
    };
}

describe('registerVizyFormSerializer', () => {
    const disposals: Array<() => void> = [];
    afterEach(() => {
        while (disposals.length) disposals.pop()?.();
        document.body.replaceChildren();
    });

    it('keeps an untouched Global Set clean after Vizy upgrades its stored value', () => {
        const form = document.createElement('form');
        document.body.append(form);
        const fieldName = 'fields[body]';
        const loaded = '{"type":"doc","attrs":{"schemaVersion":2}}';
        const canonical = '{"type":"doc","attrs":{"_editorId":"fields-vizy","schemaVersion":2}}';
        const raw = [
            'title=Global%20content',
            encodeCraftQueryPair(fieldName, loaded),
            encodeCraftQueryPair('vizyHost[block][fields][heading]', 'Mounted value'),
        ].join('&');
        const craft = installCraftFormMock(raw, () => [
            'title=Global%20content',
            encodeCraftQueryPair(fieldName, canonical),
            encodeCraftQueryPair('vizyHost[block][fields][heading]', 'Mounted value'),
        ].join('&'));
        disposals.push(craft.restore);

        disposals.push(registerVizyFormSerializer(form, {
            fieldName,
            initialCanonical: canonical,
            serialize: () => canonical,
        }));

        const serializer = craft.data.get('serializer') as FormSerializer;
        expect(serializer()).toBe(craft.data.get('initialSerializedValue'));
        expect(serializer()).not.toContain('vizyHost');
    });

    it('does not accept unrelated edits made before Vizy finishes loading', () => {
        const form = document.createElement('form');
        document.body.append(form);
        const fieldName = 'fields[body]';
        const canonical = '{"type":"doc","attrs":{"_editorId":"fields-vizy"}}';
        const craft = installCraftFormMock(
            `title=Saved&${encodeCraftQueryPair(fieldName, 'stored')}`,
            () => `title=Early%20edit&${encodeCraftQueryPair(fieldName, canonical)}`,
        );
        disposals.push(craft.restore);

        disposals.push(registerVizyFormSerializer(form, {
            fieldName,
            initialCanonical: canonical,
            serialize: () => canonical,
        }));

        const serializer = craft.data.get('serializer') as FormSerializer;
        expect(new URLSearchParams(String(craft.data.get('initialSerializedValue'))).get('title')).toBe('Saved');
        expect(new URLSearchParams(serializer()).get('title')).toBe('Early edit');
        expect(serializer()).not.toBe(craft.data.get('initialSerializedValue'));
    });

    it('composes with an existing field serializer', () => {
        const form = document.createElement('form');
        document.body.append(form);
        const fieldName = 'fields[body]';
        const canonical = '{"type":"doc"}';
        const craft = installCraftFormMock('', () => 'raw=ignored');
        const hostSerializer = () => 'title=Keep&hyperData%5Brow%5D=discard';
        craft.data.set('serializer', hostSerializer);
        disposals.push(craft.restore);

        disposals.push(registerVizyFormSerializer(form, {
            fieldName,
            initialCanonical: canonical,
            serialize: () => canonical,
        }));

        const serializer = craft.data.get('serializer') as FormSerializer;
        expect(serializer()).toContain('title=Keep');
        expect(new URLSearchParams(serializer()).get(fieldName)).toBe(canonical);
    });

    it('leaves ElementEditor forms on their dedicated serialization path', () => {
        const form = document.createElement('form');
        document.body.append(form);
        const craft = installCraftFormMock('title=Saved', () => 'title=Saved');
        craft.data.set('elementEditor', {});
        disposals.push(craft.restore);

        disposals.push(registerVizyFormSerializer(form, {
            fieldName: 'fields[body]',
            initialCanonical: '{"type":"doc"}',
            serialize: () => '{"type":"doc"}',
        }));

        expect(craft.data.has('serializer')).toBe(false);
        expect(craft.data.get('initialSerializedValue')).toBe('title=Saved');
    });

    it('restores a host serializer when a late ElementEditor takes ownership', () => {
        const form = document.createElement('form');
        document.body.append(form);
        const craft = installCraftFormMock('title=Saved', () => 'title=Saved');
        const hostSerializer = () => 'title=Saved';
        craft.data.set('serializer', hostSerializer);
        disposals.push(craft.restore);

        const detach = registerVizyFormSerializer(form, {
            fieldName: 'fields[body]',
            initialCanonical: '{"type":"doc"}',
            serialize: () => '{"type":"doc"}',
        });
        expect(craft.data.get('serializer')).not.toBe(hostSerializer);

        detach();
        expect(craft.data.get('serializer')).toBe(hostSerializer);
    });
});
