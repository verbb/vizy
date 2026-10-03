import { emojis, type EmojiItem } from '@tiptap/extension-emoji';

const POPULAR_EMOJI_NAMES = [
    'grinning', 'smiley', 'smile', 'joy', 'laughing', 'wink', 'heart_eyes', 'sunglasses',
    'thinking', 'sob', 'angry', 'tada', 'sparkles', 'fire', 'heart', 'thumbsup', 'clap', 'pray',
    'wave', 'ok_hand', 'muscle', 'eyes', 'rocket', 'white_check_mark',
] as const;

const SEARCH_RESULT_LIMIT = 96;
const searchableEmojis = emojis.filter((item): item is EmojiItem & { emoji: string } => (
    typeof item.emoji === 'string' && item.emoji !== ''
));
const emojiByName = new Map(searchableEmojis.map((item) => [item.name, item]));
const popularEmojis = POPULAR_EMOJI_NAMES
    .map((name) => emojiByName.get(name))
    .filter((item): item is EmojiItem & { emoji: string } => !!item);

/** Popular choices for an empty query, or a bounded search of TipTap's official dataset. */
export function searchEmojiOptions(queryText: string): EmojiItem[] {
    const query = queryText.trim().toLowerCase();
    if (!query) return popularEmojis;

    return searchableEmojis.filter((item) => [item.name, ...item.shortcodes, ...item.tags]
        .some((value) => value.toLowerCase().includes(query))).slice(0, SEARCH_RESULT_LIMIT);
}
