import '@verbb/plugin-kit-web/plugin-kit.css';
import '@verbb/plugin-kit-web/components/button';
import '@verbb/plugin-kit-web/components/alert';
import '@verbb/plugin-kit-web/components/checkbox';
import '@verbb/plugin-kit-web/components/dialog';
import '@verbb/plugin-kit-web/components/field';
import '@verbb/plugin-kit-web/components/select';
import '@verbb/plugin-kit-web/components/spinner';

import { requestMigrationWizard } from './migration-request';
import './migrations.css';

interface MigrationDialog extends HTMLElement {
    updateComplete: Promise<unknown>;
    show: () => Promise<void>;
    hide: () => Promise<void>;
}

class VizyMigrationWizard extends HTMLElement {
    private currentStep = 1;
    private dialog: MigrationDialog | null = null;
    private submitting = false;

    connectedCallback(): void {
        this.currentStep = Number.parseInt(this.getAttribute('initial-step') ?? '1', 10) || 1;
        this.dialog = this.querySelector<MigrationDialog>('pk-dialog');

        this.querySelectorAll<HTMLElement>('[data-vizy-go-to]').forEach((button) => {
            button.addEventListener('click', () => {
                this.showStep(Number.parseInt(button.dataset.vizyGoTo ?? '1', 10));
            });
        });

        this.querySelectorAll<HTMLElement>('[data-vizy-close]').forEach((button) => {
            button.addEventListener('click', () => void this.dialog?.hide());
        });

        this.querySelectorAll<HTMLFormElement>('form').forEach((form) => {
            form.addEventListener('submit', (event) => void this.submitForm(event, form));
        });

        this.showStep(this.currentStep);

        if (this.hasAttribute('auto-open')) {
            void customElements.whenDefined('pk-dialog').then(async () => {
                const dialog = this.dialog;

                if (!dialog) {
                    return;
                }

                await dialog.updateComplete;

                if (this.isConnected) {
                    await dialog.show();
                }
            });
        }
    }

    private showStep(step: number): void {
        this.currentStep = Math.min(4, Math.max(1, step));

        this.querySelectorAll<HTMLElement>('[data-vizy-step-panel]').forEach((panel) => {
            panel.hidden = Number.parseInt(panel.dataset.vizyStepPanel ?? '0', 10) !== this.currentStep;
        });

        this.querySelectorAll<HTMLElement>('[data-vizy-step]').forEach((item) => {
            const itemStep = Number.parseInt(item.dataset.vizyStep ?? '0', 10);
            item.classList.toggle('is-active', itemStep === this.currentStep);
            item.classList.toggle('is-complete', itemStep < this.currentStep);
            item.toggleAttribute('aria-current', itemStep === this.currentStep);
        });

        this.querySelectorAll<HTMLElement>('[data-vizy-footer-step]').forEach((button) => {
            button.hidden = Number.parseInt(button.dataset.vizyFooterStep ?? '0', 10) !== this.currentStep;
        });

        const loading = this.querySelector<HTMLElement>('[data-vizy-loading]');

        if (loading) {
            loading.hidden = true;
        }
    }

    private showLoading(step: number): void {
        this.currentStep = step;

        this.querySelectorAll<HTMLElement>('[data-vizy-step-panel], [data-vizy-footer-step]').forEach((element) => {
            element.hidden = true;
        });

        this.querySelectorAll<HTMLElement>('[data-vizy-step]').forEach((item) => {
            const itemStep = Number.parseInt(item.dataset.vizyStep ?? '0', 10);
            item.classList.toggle('is-active', itemStep === step);
            item.classList.toggle('is-complete', itemStep < step);
            item.toggleAttribute('aria-current', itemStep === step);
        });

        const loading = this.querySelector<HTMLElement>('[data-vizy-loading]');

        if (loading) {
            loading.hidden = false;
            loading.querySelector<HTMLElement>('[data-vizy-loading-analyze]')?.toggleAttribute('hidden', step !== 2);
            loading.querySelector<HTMLElement>('[data-vizy-loading-copy]')?.toggleAttribute('hidden', step !== 4);
        }
    }

    private async submitForm(event: SubmitEvent, form: HTMLFormElement): Promise<void> {
        event.preventDefault();

        if (this.submitting || !form.checkValidity()) {
            return;
        }

        const returnStep = this.currentStep;
        const loadingStep = Number.parseInt(form.dataset.vizyLoadingStep ?? '2', 10);
        const requestError = this.querySelector<HTMLElement>('[data-vizy-request-error]');

        this.submitting = true;
        requestError?.toggleAttribute('hidden', true);
        this.showLoading(loadingStep);

        try {
            const replacement = await requestMigrationWizard(form);
            this.replaceWith(replacement);
        } catch (error) {
            console.error('[Vizy] Migration request failed', error);
            this.submitting = false;
            this.showStep(returnStep);
            requestError?.toggleAttribute('hidden', false);
        }
    }
}

if (!customElements.get('vizy-migration-wizard')) {
    customElements.define('vizy-migration-wizard', VizyMigrationWizard);
}
