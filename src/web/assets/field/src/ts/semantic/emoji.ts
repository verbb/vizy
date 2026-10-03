import Emoji, { emojis } from '@tiptap/extension-emoji';
import { Plugin } from '@tiptap/pm/state';

const emojiByName = new Map(
    emojis
        .filter((item): item is typeof item & { emoji: string } => typeof item.emoji === 'string' && item.emoji !== '')
        .map((item) => [item.name, item.emoji]),
);

/**
 * Official Emoji plus one canonical Unicode attribute for PHP rendering.
 *
 * TipTap stores only the emoji name because its JavaScript dataset is available at render time.
 * Vizy renders canonical JSON in PHP too, so a small append transaction records the resolved
 * character on every emoji node without changing TipTap's picker, shortcode, or paste behaviour.
 */
export function createVizyEmoji() {
    return Emoji.extend({
        addAttributes() {
            return {
                ...this.parent?.(),
                emoji: {
                    default: null,
                    parseHTML: (element: HTMLElement) => element.dataset.emoji ?? element.textContent?.trim() ?? null,
                    renderHTML: (attributes: Record<string, unknown>) => (
                        typeof attributes.emoji === 'string' && attributes.emoji !== ''
                            ? { 'data-emoji': attributes.emoji }
                            : {}
                    ),
                },
            };
        },

        addProseMirrorPlugins() {
            return [
                ...(this.parent?.() ?? []),
                new Plugin({
                    appendTransaction: (transactions, _oldState, newState) => {
                        if (!transactions.some((transaction) => transaction.docChanged)) return null;
                        let transaction = newState.tr;

                        newState.doc.descendants((node, position) => {
                            if (node.type.name !== this.name || node.attrs.emoji) return;
                            const character = emojiByName.get(String(node.attrs.name ?? ''));
                            if (!character) return;
                            transaction = transaction.setNodeMarkup(position, undefined, {
                                ...node.attrs,
                                emoji: character,
                            });
                        });

                        return transaction.docChanged ? transaction : null;
                    },
                }),
            ];
        },
    });
}
