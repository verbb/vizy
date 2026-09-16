/**
 * Plugin Kit animate-with-class calls Element.getAnimations(); happy-dom lacks it.
 * Resolve immediately so open/close animations finish in tests.
 */
if (typeof Element !== 'undefined' && !Element.prototype.getAnimations) {
    Element.prototype.getAnimations = () => [];
}

// Vitest 4 exposes Happy DOM's missing prompt API rather than supplying a stub.
// Individual tests spy on this boundary and provide their intended user response.
if (typeof window.prompt !== 'function') {
    window.prompt = () => null;
}
