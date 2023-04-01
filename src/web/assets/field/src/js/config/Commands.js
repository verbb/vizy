export default [
    {
        svg: 'h1',
        title: Craft.t('vizy', 'Heading 1'),
        commandInfo: { shortcut: 'Mod-Alt-1' },
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run();
        },
    },
    {
        svg: 'h2',
        title: Craft.t('vizy', 'Heading 2'),
        commandInfo: { shortcut: 'Mod-Alt-2' },
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run();
        },
    },
    {
        svg: 'h3',
        title: Craft.t('vizy', 'Heading 3'),
        commandInfo: { shortcut: 'Mod-Alt-3' },
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run();
        },
    },
    {
        svg: 'list-ul',
        title: Craft.t('vizy', 'Bullet List'),
        commandInfo: { shortcut: 'Mod-Shift-8' },
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleBulletList().run();
        },
    },
    {
        svg: 'list-ol',
        title: Craft.t('vizy', 'Ordered List'),
        commandInfo: { shortcut: 'Mod-Shift-7' },
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleOrderedList().run();
        },
    },
    {
        svg: 'photo-film',
        title: Craft.t('vizy', 'Media Embed'),
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).run();

            editor.emit('vui:media-embed-modal-open');
        },
    },
    {
        svg: 'link',
        title: Craft.t('vizy', 'Link'),
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).run();

            editor.emit('vui:link-modal-open');
        },
    },
    {
        icon: 'image',
        title: Craft.t('vizy', 'Image'),
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).run();

            editor.emit('vui:image-modal-open');
        },
    },
    {
        svg: 'code',
        title: Craft.t('vizy', 'Code Block'),
        commandInfo: { shortcut: 'Mod-Alt-c' },
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
        },
    },
    {
        svg: 'quote-right',
        title: Craft.t('vizy', 'Blockquote'),
        commandInfo: { shortcut: 'Mod-Shift-b' },
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleBlockquote().run();
        },
    },
    {
        svg: 'horizontal-rule',
        title: Craft.t('vizy', 'Horizontal Rule'),
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).setHorizontalRule().run();
        },
    },
];
