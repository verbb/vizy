// TipTap - Marks
import Bold from '@tiptap/extension-bold';
import Code from '@tiptap/extension-code';
import Highlight from '@tiptap/extension-highlight';
import Italic from '@tiptap/extension-italic';
import Strike from '@tiptap/extension-strike';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Underline from '@tiptap/extension-underline';

// TipTap - Nodes
import Blockquote from '@tiptap/extension-blockquote';
import BulletList from '@tiptap/extension-bullet-list';
import CodeBlock from '@tiptap/extension-code-block';
import Document from '@tiptap/extension-document';
import HardBreak from '@tiptap/extension-hard-break';
import Heading from '@tiptap/extension-heading';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import ListItem from '@tiptap/extension-list-item';
import OrderedList from '@tiptap/extension-ordered-list';
import Paragraph from '@tiptap/extension-paragraph';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import Text from '@tiptap/extension-text';

// TipTap - Extensions
import Dropcursor from '@tiptap/extension-dropcursor';
import Focus from '@tiptap/extension-focus';
import Gapcursor from '@tiptap/extension-gapcursor';
import History from '@tiptap/extension-history';
import TextAlign from '@tiptap/extension-text-align';

// TipTap - Custom
import Link from '../components/input/link/Link';
import Image from '../components/input/image/Image';
import Iframe from '../components/input/iframe/Iframe';
import MediaEmbed from '../components/input/media-embed/MediaEmbed';

export default [
    // Optional Marks
    Bold,
    Code,
    Highlight,
    Italic,
    Strike,
    Subscript,
    Superscript,
    Underline,

    // Optional Nodes
    Blockquote,
    BulletList,
    CodeBlock,
    Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
    HorizontalRule,
    ListItem,
    OrderedList,
    Table.configure({
        resizable: true,
    }),
    TableRow,
    TableHeader,
    TableCell,

    // Optional Extensions
    History,
    TextAlign.configure({
        types: ['heading', 'paragraph'],
        defaultAlignment: 'start',
    }),

    // Optional Custom
    Link.configure({ openOnClick: false }),
    Image,
    Iframe,
    MediaEmbed,
];
