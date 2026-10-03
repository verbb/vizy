import { CharacterCount, type CharacterCountOptions } from '@tiptap/extensions/character-count';
import { Plugin } from '@tiptap/pm/state';
import { ACCEPTED_CANONICAL_TRANSACTION_META } from '../reconcile-document';

/**
 * TipTap's official limit correctly permits reducing an already-oversized
 * document, but rejects the transaction Vizy uses to hydrate that document
 * from its empty bootstrap state. Trusted canonical reconciliation is content
 * Vizy already owns, so let it establish the baseline without weakening the
 * extension's enforcement for subsequent author transactions.
 */
export function createVizyCharacterCount(options: Partial<CharacterCountOptions>) {
    return CharacterCount.extend({
        addProseMirrorPlugins() {
            return (this.parent?.() ?? []).map((plugin) => {
                const filterTransaction = plugin.spec.filterTransaction;
                if (!filterTransaction) return plugin;

                return new Plugin({
                    ...plugin.spec,
                    filterTransaction(transaction, state) {
                        if (transaction.getMeta(ACCEPTED_CANONICAL_TRANSACTION_META) === true) return true;
                        return filterTransaction.call(plugin, transaction, state);
                    },
                });
            });
        },
    }).configure(options);
}
