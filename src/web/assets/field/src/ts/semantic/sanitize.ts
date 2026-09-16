import type { CanonicalNode, JsonValue } from '../types';
import { columnWidthTotal, isUuid } from './attrs';

const FORBIDDEN_LINK_ATTRS = new Set(['href', 'target']);
const FORBIDDEN_IMAGE_ATTRS = new Set(['src', 'width', 'height']);
const FORBIDDEN_CELL_ATTRS = new Set(['colwidth']);

function stripAttrs(attrs: Record<string, JsonValue>, forbidden: Set<string>): Record<string, JsonValue> {
    const output: Record<string, JsonValue> = {};
    for (const [key, value] of Object.entries(attrs)) {
        if (!forbidden.has(key)) output[key] = value;
    }
    return output;
}

function sanitizeMarks(marks: CanonicalNode['marks']): CanonicalNode['marks'] {
    if (!marks) return marks;
    return marks.map((mark) => {
        if (mark.type !== 'link' || !mark.attrs) return mark;
        return { ...mark, attrs: stripAttrs(mark.attrs as Record<string, JsonValue>, FORBIDDEN_LINK_ATTRS) };
    });
}

function sanitizeNode(node: CanonicalNode, path: string): CanonicalNode {
    const output: CanonicalNode = { ...node };
    if (output.marks) output.marks = sanitizeMarks(output.marks);

    if (output.type === 'image') {
        const attrs = (output.attrs ?? {}) as Record<string, JsonValue>;
        const cleaned = stripAttrs(attrs, FORBIDDEN_IMAGE_ATTRS);
        const assetUid = cleaned.assetUid;
        if (typeof assetUid !== 'string' || !isUuid(assetUid)) {
            throw new Error(`semanticImageMissingAssetUid at ${path}`);
        }
        output.attrs = cleaned;
    }

    if (output.type === 'table') {
        const attrs = (output.attrs ?? {}) as Record<string, JsonValue>;
        const widths = attrs.columnWidths;
        if (widths !== undefined && widths !== null) {
            if (!Array.isArray(widths)) throw new Error(`semanticTableInvalidColumnWidths at ${path}`);
            const numeric = widths.map((value) => Number.parseInt(String(value), 10));
            if (numeric.some((value) => !Number.isInteger(value) || value < 1)) {
                throw new Error(`semanticTableInvalidColumnWidths at ${path}`);
            }
            if (columnWidthTotal(numeric) !== 1000) {
                throw new Error(`semanticTableColumnWidthTotal at ${path}`);
            }
            output.attrs = { ...attrs, columnWidths: numeric };
        }
    }

    if (output.type === 'tableCell' || output.type === 'tableHeader') {
        if (output.attrs) {
            output.attrs = stripAttrs(output.attrs as Record<string, JsonValue>, FORBIDDEN_CELL_ATTRS);
        }
    }

    if (output.content) {
        output.content = output.content.map((child, index) => sanitizeNode(child, `${path}.content[${index}]`));
    }
    return output;
}

/** Strip editor-only attrs and enforce semantic invariants before persistence. */
export function sanitizeSemanticNodes(input: CanonicalNode): CanonicalNode {
    return sanitizeNode(structuredClone(input), '$');
}
