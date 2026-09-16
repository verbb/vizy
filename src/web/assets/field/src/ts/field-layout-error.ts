/**
 * Author-facing FieldLayout mount failures on a Vizy Block.
 *
 * Empty white Block cards are not an acceptable failure mode — same rule as
 * field boot failures. PHP returns `error` + `message`; JS mount/init throws
 * are formatted here so the Block body can paint a role=alert panel.
 */

export class FieldLayoutMountError extends Error {
    readonly code: string;
    readonly authorMessage: string;

    constructor(code: string, message?: string | null) {
        const authorMessage = (message ?? '').trim() || humanizeFieldLayoutErrorCode(code);
        super(authorMessage);
        this.name = 'FieldLayoutMountError';
        this.code = code;
        this.authorMessage = authorMessage;
    }
}

export function humanizeFieldLayoutErrorCode(code: string): string {
    switch (code) {
        case 'unsupportedFieldCapability':
            return 'This Block includes a field type Vizy cannot render inside Blocks yet.';
        case 'fieldLayoutRenderFailed':
            return 'This Block’s fields failed to render.';
        case 'unknownBlockType':
            return 'This Block’s type is missing or no longer allowed on this field.';
        case 'staleLayout':
            return 'This Block’s field layout is missing. Re-save the Block Type.';
        case 'staleFieldLayoutResponse':
            return 'This Block’s fields went out of date while loading. Try Retry.';
        case 'fieldLayoutRejected':
        case 'missingBatchResult':
        case 'invalidBlock':
        case 'invalidDestination':
        case 'staleBlockHash':
            return 'This Block could not load its fields. Reload the page and try again.';
        case 'fieldHostDisconnected':
            return 'This Block’s fields could not initialize. Reload the page and try again.';
        case 'loaderDestroyed':
        case 'blockRemoved':
            return 'This Block was removed before its fields finished loading.';
        default:
            if (code.startsWith('fieldLayoutRequest:')) {
                return `This Block could not load its fields (HTTP ${code.slice('fieldLayoutRequest:'.length)}).`;
            }
            return `This Block could not load its fields (${code}).`;
    }
}

export function formatFieldLayoutError(error: unknown): string {
    if (error instanceof FieldLayoutMountError) {
        return error.authorMessage;
    }
    if (error instanceof Error) {
        const message = error.message.trim();
        if (!message) return humanizeFieldLayoutErrorCode('fieldLayoutRejected');
        // Server codes often arrive as bare Error(message=code).
        if (/^[a-zA-Z][a-zA-Z0-9]+$/.test(message) || message.startsWith('fieldLayoutRequest:')) {
            return humanizeFieldLayoutErrorCode(message);
        }
        return message;
    }
    return String(error);
}
