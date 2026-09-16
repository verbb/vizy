import { afterEach, describe, expect, it, vi } from 'vitest';
import {
    formatBootFailureDetail,
    paintFieldBootFailure,
    reportFieldBootFailure,
} from '../../src/web/assets/field/src/ts/field-boot-failure';

afterEach(() => {
    document.body.replaceChildren();
    // customElements.define cannot be undone; use unique tag tests only via paint.
});

describe('field boot failure UI', () => {
    it('formats Error stacks for the detail panel', () => {
        const error = new Error('focused is not defined');
        expect(formatBootFailureDetail(error)).toContain('focused is not defined');
    });

    it('paints an alert beside the preserved document input', () => {
        const host = document.createElement('vizy-editor');
        const input = document.createElement('input');
        input.type = 'hidden';
        input.dataset.vizyDocument = '';
        input.value = '{"type":"doc","content":[]}';
        host.append(input);
        document.body.append(host);

        paintFieldBootFailure(host, new Error('focused is not defined'));

        const alert = host.querySelector('[data-vizy-boot-failure]');
        expect(alert).not.toBeNull();
        expect(alert?.getAttribute('role')).toBe('alert');
        expect(alert?.textContent).toContain('Vizy failed to load');
        expect(alert?.textContent).toContain('focused is not defined');
        expect((host.querySelector('input[data-vizy-document]') as HTMLInputElement | null)?.value).toBe(
            '{"type":"doc","content":[]}',
        );
        expect(host.getAttribute('data-vizy-failed')).not.toBeNull();
    });

    it('reportFieldBootFailure defines a stub vizy-editor when missing', () => {
        // Only assert when the real editor has not been imported in this file.
        if (customElements.get('vizy-editor')) {
            // Runtime already registered — paint path still works on hosts.
            const host = document.createElement('vizy-editor');
            document.body.append(host);
            const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
            reportFieldBootFailure(new Error('boot failed'));
            expect(host.querySelector('[data-vizy-boot-failure]')).not.toBeNull();
            spy.mockRestore();
            return;
        }

        const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
        reportFieldBootFailure(new Error('boot failed'));
        expect(customElements.get('vizy-editor')).toBeTypeOf('function');
        spy.mockRestore();
    });
});
