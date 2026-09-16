/**
 * Ensure Plugin Kit `pk-dialog` is defined once.
 *
 * Craft CP pages may already have registered it (another Verbb plugin), and our
 * vizy ↔ editor-runtime split can also evaluate the decorator module twice if
 * it is eagerly imported from the entry. Only import when missing.
 */
let loading: Promise<void> | null = null;

export async function ensurePkDialog(): Promise<void> {
    if (typeof customElements !== 'undefined' && customElements.get('pk-dialog')) {
        return;
    }
    if (!loading) {
        loading = import('@verbb/plugin-kit-web/components/dialog/pk-dialog.js')
            .then(() => undefined)
            .catch((error: unknown) => {
                // Race: another bundle defined it while we were importing.
                if (customElements.get('pk-dialog')) return;
                throw error;
            })
            .finally(() => {
                loading = null;
            });
    }
    await loading;
}
