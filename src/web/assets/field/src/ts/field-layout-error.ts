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
    readonly technicalDetail: string | null;

    constructor(code: string, message?: string | null, detail?: string | null) {
        const authorMessage = (message ?? '').trim() || humanizeFieldLayoutErrorCode(code);
        super(authorMessage);
        this.name = 'FieldLayoutMountError';
        this.code = code;
        this.authorMessage = authorMessage;
        this.technicalDetail = (detail ?? '').trim() || null;
    }
}

interface FieldLayoutHttpFailure {
    status: number | null;
    code: string | null;
    message: string | null;
    detail: string | null;
}

function httpFailure(error: unknown): FieldLayoutHttpFailure | null {
    if (!error || typeof error !== 'object' || !('response' in error)) return null;
    const response = (error as {
        response?: { status?: unknown; data?: unknown };
    }).response;
    if (!response || typeof response !== 'object') return null;
    const data = response.data && typeof response.data === 'object'
        ? response.data as Record<string, unknown>
        : {};
    return {
        status: typeof response.status === 'number' ? response.status : null,
        code: typeof data.error === 'string' ? data.error : null,
        message: typeof data.message === 'string' ? data.message : null,
        detail: typeof data.detail === 'string' ? data.detail : null,
    };
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
    const failure = httpFailure(error);
    if (failure?.message?.trim()) return failure.message.trim();
    if (failure?.code) return humanizeFieldLayoutErrorCode(failure.code);
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

/** Diagnostic detail for the collapsed, copyable failure disclosure. */
export function formatFieldLayoutErrorDetail(error: unknown): string {
    if (error instanceof FieldLayoutMountError) {
        return [
            `Code: ${error.code}`,
            error.technicalDetail ? `Detail: ${error.technicalDetail}` : null,
        ].filter(Boolean).join('\n');
    }
    const failure = httpFailure(error);
    if (failure) {
        const detail = [
            failure.status !== null ? `HTTP: ${failure.status}` : null,
            failure.code ? `Code: ${failure.code}` : null,
            failure.detail ? `Detail: ${failure.detail}` : null,
        ].filter(Boolean).join('\n');
        if (detail) return detail;
    }
    if (error instanceof Error) {
        return error.stack?.trim() || `${error.name}: ${error.message}`;
    }
    return String(error);
}
