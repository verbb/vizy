import type { NodeViewServices } from '../../../src/web/assets/field/src/ts/extensions';

type RequiredServices = Pick<NodeViewServices, 'editor' | 'manifest' | 'ui' | 'hosts' | 'insertion'>;

/**
 * Builds a complete NodeViewServices for a test editor.
 *
 * Each suite only cares about two or three members, but the node views call the
 * rest during construction, so the defaults live here rather than being copied
 * into every suite. Without this, adding a service method means editing a
 * literal in half a dozen files and silently breaking whichever ones get missed.
 */
export function nodeViewServices(overrides: RequiredServices & Partial<NodeViewServices>): NodeViewServices {
    return {
        openFields: () => undefined,
        observeFieldViewport: () => () => undefined,
        refreshSummaries: () => undefined,
        blockRevision: () => 0,
        duplicateBlock: async () => false,
        ...overrides,
    };
}
