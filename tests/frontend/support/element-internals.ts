/**
 * Minimal `attachInternals()` shim for happy-dom.
 *
 * happy-dom 20 does not implement `ElementInternals`, but Plugin Kit's
 * form-associated components (`pk-input`, `pk-lightswitch`, `pk-combobox`)
 * call `attachInternals()` in their constructor, so instantiating any of them
 * throws before our own component code runs.
 *
 * This covers only the surface `PkFormAssociatedElement` actually touches.
 * Form submission and constraint validation are browser concerns and are not
 * asserted here — the Vizy configurator posts plain hidden inputs, which
 * happy-dom models correctly.
 */
export function installElementInternalsShim(): void {
    if (typeof HTMLElement.prototype.attachInternals === 'function') {
        return;
    }

    const emptyValidity = {
        badInput: false,
        customError: false,
        patternMismatch: false,
        rangeOverflow: false,
        rangeUnderflow: false,
        stepMismatch: false,
        tooLong: false,
        tooShort: false,
        typeMismatch: false,
        valid: true,
        valueMissing: false,
    } as ValidityState;

    HTMLElement.prototype.attachInternals = function attachInternals(this: HTMLElement): ElementInternals {
        return {
            form: this.closest('form'),
            labels: [] as unknown as NodeList,
            validationMessage: '',
            validity: emptyValidity,
            willValidate: true,
            checkValidity: () => true,
            reportValidity: () => true,
            setFormValue: () => undefined,
            setValidity: () => undefined,
        } as unknown as ElementInternals;
    };
}

/**
 * Minimal `Element.getAnimations()` shim for happy-dom.
 *
 * Plugin Kit's overlay components (`pk-dialog`) wait for a CSS transition to finish before
 * settling their open state, and ask the element what it is animating. happy-dom has no Web
 * Animations API, so the call throws from a `setImmediate` — outside any test's stack, which
 * surfaces as an unhandled error that fails the whole file rather than one assertion.
 *
 * Returning nothing is the right answer here: no animations are running under happy-dom, so
 * the components resolve immediately, which is what a test wants anyway.
 */
export function installAnimationsShim(): void {
    if (typeof Element.prototype.getAnimations === 'function') {
        return;
    }

    Element.prototype.getAnimations = function getAnimations(): Animation[] {
        return [];
    };
}
