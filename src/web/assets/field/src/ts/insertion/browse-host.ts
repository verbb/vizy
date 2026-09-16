import '../components/VizyBlockBrowseDialogElement';
import { VizyBlockBrowseDialogElement } from '../components/VizyBlockBrowseDialogElement';
import type { NodeViewServices } from '../extensions';
import type { AvailableInsertion, InsertionContext, InsertionKind } from './types';
import { executeInsertion } from './surface-helpers';
import type { BlockInsertView } from './insert-view-storage';

/**
 * Production Blocks grid browse — `pk-dialog` + `vizy-block-browse-dialog`.
 * Complements the compact list popover.
 */
export class BlockBrowseHost {
    #panel: VizyBlockBrowseDialogElement | null = null;

    get isOpen(): boolean {
        return Boolean(this.#panel?.isOpen);
    }

    open(
        services: NodeViewServices,
        context: InsertionContext,
        items: readonly AvailableInsertion[],
        options: {
            query?: string;
            kinds?: readonly InsertionKind[];
            onView: (view: BlockInsertView) => void;
            onClose?: () => void;
            onSelect?: (id: string) => Promise<boolean> | boolean;
        },
    ): void {
        this.close();
        const panel = document.createElement('vizy-block-browse-dialog') as VizyBlockBrowseDialogElement;
        this.#panel = panel;
        panel.open({
            items,
            query: options.query,
            onSelect: (id) => {
                const handler = options.onSelect
                    ?? ((itemId: string) => executeInsertion(services, context, itemId));
                services.suspendInsertionSideEffects?.();
                const pending = handler(id);
                this.close();
                void Promise.resolve(pending).finally(() => {
                    services.resumeInsertionSideEffects?.();
                });
            },
            onView: (view) => {
                options.onView(view);
            },
            onClose: () => {
                if (this.#panel === panel) this.#panel = null;
                options.onClose?.();
            },
        });
    }

    close(): void {
        this.#panel?.close();
        this.#panel = null;
    }
}
