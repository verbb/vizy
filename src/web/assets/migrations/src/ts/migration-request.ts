/**
 * Posts one wizard form and extracts the server-rendered replacement without
 * navigating the surrounding Craft control-panel page.
 */
export async function requestMigrationWizard(form: HTMLFormElement): Promise<HTMLElement> {
    const response = await fetch(form.action || window.location.href, {
        method: form.method || 'post',
        body: new FormData(form),
        credentials: 'same-origin',
        headers: {
            Accept: 'text/html',
            'X-Requested-With': 'XMLHttpRequest',
        },
    });
    const html = await response.text();

    if (!response.ok) {
        throw new Error(`migrationRequestFailed:${response.status}`);
    }

    const replacement = new DOMParser()
        .parseFromString(html, 'text/html')
        .querySelector<HTMLElement>('vizy-migration-wizard');

    if (!replacement) {
        throw new Error('migrationWizardMissing');
    }

    return replacement;
}
