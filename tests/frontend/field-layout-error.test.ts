import { describe, expect, it } from 'vitest';
import {
    FieldLayoutMountError,
    formatFieldLayoutError,
    formatFieldLayoutErrorDetail,
} from '../../src/web/assets/field/src/ts/field-layout-error';

describe('FieldLayout error presentation', () => {
    it('separates an author message from server diagnostics', () => {
        const error = new FieldLayoutMountError(
            'fieldLayoutRenderFailed',
            'This Block’s fields failed to render.',
            'RuntimeException: renderer failed',
        );

        expect(formatFieldLayoutError(error)).toBe('This Block’s fields failed to render.');
        expect(formatFieldLayoutErrorDetail(error)).toBe([
            'Code: fieldLayoutRenderFailed',
            'Detail: RuntimeException: renderer failed',
        ].join('\n'));
    });

    it('unwraps Craft request failures without exposing diagnostics in the main message', () => {
        const error = Object.assign(new Error('Request failed with status code 409'), {
            response: {
                status: 409,
                data: {
                    error: 'invalidContext',
                    detail: 'The signed editor context has expired.',
                },
            },
        });

        expect(formatFieldLayoutError(error)).toBe(
            'This Block could not load its fields (invalidContext).',
        );
        expect(formatFieldLayoutErrorDetail(error)).toBe([
            'HTTP: 409',
            'Code: invalidContext',
            'Detail: The signed editor context has expired.',
        ].join('\n'));
    });
});
