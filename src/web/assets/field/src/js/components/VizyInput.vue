<template>
    <div>
        <div v-if="editor" class="vui-rich-text" :class="{ 'has-focus': isFocused() }" :style="{ '--rows': settings.initialRows }">
            <menu-bar v-if="buttons.length" ref="toolbar" :buttons="buttons" :editor="editor" :field="this" />
            <code-editor v-model="codeEditorHtml" :visible="showCodeEditor" :editor="editor" :field="this" />
            <editor-content :class="{ 'code-view': showCodeEditor }" class="vui-editor" :editor="editor" />
            <block-picker :editor="editor" :field="this" :block-groups="settings.blockGroups" />
        </div>

        <div v-if="$isDebug" class="input text" style="margin-top: 20px;">{{ jsonContent }}</div>
        <input type="hidden" :name="name" :value="jsonContent">
    </div>
</template>

<script>
import { find } from 'lodash-es';

import { Editor, EditorContent } from '@tiptap/vue-3';

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
import Text from '@tiptap/extension-text';

// TipTap - Extensions
import Dropcursor from '@tiptap/extension-dropcursor';
import Focus from '@tiptap/extension-focus';
import Gapcursor from '@tiptap/extension-gapcursor';
import History from '@tiptap/extension-history';
import TextAlign from '@tiptap/extension-text-align';

// TipTap - Custom
import VizyBlock from './input/VizyBlock';
import Link from './input/link/Link';
import Image from './input/image/Image';

import MenuBar from './input/MenuBar.vue';
import BlockPicker from './input/BlockPicker.vue';
import CodeEditor from './input/CodeEditor.vue';

export default {
    name: 'VizyInput',

    components: {
        EditorContent,
        MenuBar,
        BlockPicker,
        CodeEditor,
    },

    props: {
        name: {
            type: String,
            required: true,
            default: '',
        },

        settings: {
            type: Object,
            default: () => {},
        },

        value: {
            type: [String, Array],
            required: true,
            default: '',
        },
    },

    data() {
        return {
            isLivePreview: false,
            mounted: false,
            buttons: ['bold', 'italic'],
            showCodeEditor: false,
            codeEditorHtml: '',
            editor: null,
            json: null,
            html: null,
            parentToolbarOffset: 0,
            cachedFieldHtml: {},
            cachedFieldJs: {},
            renderedJsCache: {},
        };
    },

    computed: {
        jsonContent() {
            return this.contentToValue(this.json);
        },

        toolbarFixed() {
            return this.settings.vizyConfig.toolbarFixed;
        },

        isRoot() {
            return this.settings.isRoot;
        },
    },

    watch: {
        codeEditorHtml(newValue) {
            this.editor.chain().setContent(newValue, true).run();
        },
    },

    mounted() {
        // Setup config for editor, from field config
        this.editor = new Editor({
            extensions: this.getExtensions(),
            content: this.valueToContent(this.clone(this.value)),
            autofocus: false,
            onUpdate: () => {
                this.json = this.editor.getJSON().content;
                this.html = this.editor.getHTML();
            },
        });

        // Store this input against the editor for each access everywhere.
        // Maybe watch this in the future as it's setting a non-standard prop.
        this.editor.vizyField = this;

        this.json = this.editor.getJSON().content;
        this.html = this.editor.getHTML();

        // Prepare all vizy blocks be caching their HTML/JS
        this.json.forEach((block) => {
            if (block.type === 'vizyBlock') {
                const { id } = block.attrs;
                const value = find(this.settings.blocks, { id });

                if (value) {
                    this.setCachedFieldHtml(id, value.fieldsHtml);
                    this.setCachedFieldJs(id, value.footHtml);
                }
            }
        });

        this.$nextTick(() => {
            this.mounted = true;

            // Setup listeners for fixed toolbar option
            if (this.toolbarFixed) {
                window.addEventListener('scroll', this.updateFixedToolbar);
                window.addEventListener('resize', this.updateFixedToolbar);

                // Handle the element editor slideout
                const $slideout = document.querySelector('.slideout[data-element-editor].so-visible .so-body');

                if ($slideout) {
                    $slideout.addEventListener('scroll', this.updateFixedToolbarEditor);
                    $slideout.addEventListener('resize', this.updateFixedToolbarEditor);
                }

                Garnish.on(Craft.Preview, 'open', this.openLivePreviewCallback);
                Garnish.on(Craft.LivePreview, 'enter', this.openLivePreviewCallback);

                Garnish.on(Craft.Preview, 'close', this.closeLivePreviewCallback);
                Garnish.on(Craft.LivePreview, 'exit', this.closeLivePreviewCallback);
            }

            // Setup listener for when toggling the code editor
            this.editor.on('vui:code-editor-toggle', this.setCodeEditor);
        });

        // Keep track of any parent fields (at least their toolbars) so we can align them
        this.getParentInputs(this.$el).forEach((parentInput) => {
            if (parentInput.$refs.toolbar) {
                this.parentToolbarOffset += parentInput.$refs.toolbar.$el.offsetHeight;
            }
        });

        // For nested Vizy fields, the field will be serialized again on-load, but will produce content
        // change warnings. So wait until ready, then re-serialize it.
        this.refreshUnloadData();
    },

    created() {
        // Populate the buttons from config - allow an empty array to remove buttons
        if (this.settings.vizyConfig.buttons) {
            this.buttons = this.settings.vizyConfig.buttons;
        }
    },

    beforeUnmount() {
        this.editor.destroy();
    },

    methods: {
        getFormattingOptions() {
            let options = ['paragraph', 'code-block', 'blockquote', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

            if (this.settings.vizyConfig.formatting && this.settings.vizyConfig.formatting.length) {
                options = this.settings.vizyConfig.formatting;
            }

            return options;
        },

        getExtensions() {
            const extensions = [
                // Core Extensions
                Document,
                Dropcursor,
                Gapcursor,
                HardBreak,
                Paragraph,
                Text,
                VizyBlock,

                // Remove due to strange behaviour with nested Vizy fields and gapcursor focusing
                // Focus.configure({ className: 'has-focus', mode: 'deepest' }),

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

                // Optional Extensions
                History,
                TextAlign.configure({
                    types: ['heading', 'paragraph'],
                    defaultAlignment: 'start',
                }),

                // Optional Custom
                Link.configure({ openOnClick: false }),
                Image,
            ];

            return extensions;
        },

        setCodeEditor() {
            if (this.showCodeEditor) {
                this.editor.chain().setContent(this.codeEditorHtml, true).run();
            } else {
                this.codeEditorHtml = this.editor.getHTML();
            }

            this.showCodeEditor = !this.showCodeEditor;
        },

        valueToContent(value) {
            if (!value) {
                return null;
            }

            // If already an array, easy.
            if (!Array.isArray(value)) {
                try {
                    value = JSON.parse(value);
                } catch (e) {
                    console.log(e);
                }
            }

            // Un-escape any HTML tags used in the text. Maybe we're writing HTML in text?
            // This will have been serialized when saving.
            value = this.decodeHtml(value);

            return value.length ? { type: 'doc', content: value } : null;
        },

        decodeHtml(html) {
            if (Array.isArray(html)) {
                html = JSON.stringify(html);
            }

            // The most easiest/efficient way to convert htmlentities...
            const txt = document.createElement('textarea');
            txt.innerHTML = html;

            return JSON.parse(txt.value);
        },

        contentToValue(content) {
            // Prevent a single empty paragraph from being generated when the field is empty
            if (content && Array.isArray(content) && content.length === 1) {
                if (content[0].type === 'paragraph' && !content[0].content) {
                    return null;
                }
            }

            return JSON.stringify(content);
        },

        getParsedBlockHtml(html, id) {
            if (typeof html === 'string') {
                return html.replace(new RegExp(`__VIZY_BLOCK_${this.settings.placeholderKey}__`, 'g'), id);
            }
            return '';

        },

        getCachedFieldHtml(blockId) {
            let html = this.cachedFieldHtml[blockId];

            // When serialized, htmlentities are used, so decode them
            if (typeof html === 'string') {
                html = html.replace(/&#(\d+);/g, (match, dec) => {
                    return String.fromCharCode(dec);
                });
            }

            return this.getParsedBlockHtml(html, blockId);
        },

        setCachedFieldHtml(blockId, value) {
            this.cachedFieldHtml[blockId] = value;
        },

        getCachedFieldJs(blockId) {
            let html = this.cachedFieldJs[blockId];

            // When serialized, htmlentities are used, so decode them
            if (typeof html === 'string') {
                html = html.replace(/&#(\d+);/g, (match, dec) => {
                    return String.fromCharCode(dec);
                });
            }

            let fieldJs = this.getParsedBlockHtml(html, blockId);

            // When re-rendering the block, we'll want to remove some things that are initialized
            // multiple times. This will likely grow as we find more incompatible fields...
            if (this.renderedJsCache[blockId]) {
                // Static Super Table fields contain JS to auto-add a row when the field is initialised
                // and un-saved. Unfortunately, this messes up Vizy which re-renders the block when moving.
                // This only effect un-saved, brand-new ST rows which still rely on this JS to auto-add a row.
                fieldJs = fieldJs.replace(/(superTableInput.addRow.*?;)/g, 'null');
            }

            // Save this to our internal cache for next time
            this.renderedJsCache[blockId] = fieldJs;

            return fieldJs;
        },

        setCachedFieldJs(blockId, value) {
            this.cachedFieldJs[blockId] = value;
        },

        // updateCachedFieldHtml() {
        //     var blockFields = this.editor.view.dom.querySelectorAll('.vizyblock-fields');

        //     blockFields.forEach(blockField => {
        //         var blockId = blockField.getAttribute('data-id');
        //         var html = $(blockField).htmlize();

        //         // console.log(id);
        //         // console.log(html);

        //         this.cachedFieldHtml[blockId] = html;
        //     });
        // },

        openLivePreviewCallback() {
            this.isLivePreview = true;

            // Handle the Live Preview scroll
            const $livePreview = document.querySelector('.lp-editor-container .lp-editor');

            if ($livePreview) {
                $livePreview.addEventListener('scroll', this.updateFixedToolbar);
                $livePreview.addEventListener('resize', this.updateFixedToolbar);
            }
        },

        closeLivePreviewCallback() {
            this.isLivePreview = false;
        },

        updateFixedToolbar(event) {
            let headerBuffer = document.querySelector('body.fixed-header #header') ? document.querySelector('body.fixed-header #header').offsetHeight : 0;

            if (this.isLivePreview) {
                headerBuffer = document.querySelector('.lp-editor-container header.flex') ? document.querySelector('.lp-editor-container header.flex').offsetHeight - parseFloat(window.getComputedStyle(document.querySelector('.lp-editor-container .lp-editor'), null).getPropertyValue('padding-top')) : 0;
            }

            // Apply any parent Vizy fields toolbars, otherwise we get multiple toolbar overlaps
            headerBuffer = headerBuffer + this.parentToolbarOffset;

            this.$refs.toolbar.$el.style.position = 'sticky';
            this.$refs.toolbar.$el.style.top = `${this.$el.scrollTop + headerBuffer}px`;
        },

        updateFixedToolbarEditor(event) {
            let headerBuffer = -24;

            // Apply any parent Vizy fields toolbars, otherwise we get multiple toolbar overlaps
            headerBuffer = headerBuffer + this.parentToolbarOffset;

            this.$refs.toolbar.$el.style.position = 'sticky';
            this.$refs.toolbar.$el.style.top = `${this.$el.scrollTop + headerBuffer}px`;
        },

        getParentInputs() {
            const parents = [];
            let node = this;

            while (node) {
                if (node.$options.name === 'VizyInput') {
                    parents.push(node);
                }

                node = node.$parent;
            }

            return parents;
        },

        refreshUnloadData() {
            // Give it a second for everything to be ready
            setTimeout(() => {
                const $forms = $('form[data-confirm-unload]');

                // Re-serialize the form data, to prevent unload warnings for nested Vizy fields
                for (let i = 0; i < $forms.length; i++) {
                    const $form = $($forms[i]);
                    const data = $form.data('initialSerializedValue');

                    if (data) {
                        let serialized = data;

                        if (typeof $form.data('serializer') === 'function') {
                            serialized = $form.data('serializer')();
                        } else {
                            serialized = $form.serialize();
                        }

                        $form.data('initialSerializedValue', serialized);
                    }
                }
            }, 500);
        },

        isFocused() {
            return this.editor.isFocused && !this.editor.isActive('vizyBlock');
        },
    },

};

</script>

<style lang="scss">
@import 'craftcms-sass/mixins';

// ==========================================================================
// Editor
// ==========================================================================

.vui-rich-text {
    --rows: 7;

    position: relative;
    border-radius: 3px;
    border: 1px solid rgba(96, 125, 159, 0.25);
    z-index: 2;

    &.has-focus {
        box-shadow: 0 0 0 1px #127fbf, 0 0 0 3px rgb(18 127 191 / 50%);
    }

    // Override tiptap
    .ProseMirror {
        outline: none;
        word-wrap: normal;
        padding: 16px;
        min-height: calc(2rem + (var(--rows) * 1rem));
        background-color: #fbfcfe;
        background-clip: padding-box;

        // Won't work with nested Vizy fields and toolbar fixed
        // overflow: hidden;

        [data-is-showing-errors="true"] & {
            border-color: $errorColor;
        }

        &:focus {
            box-shadow: none;
        }
    }
}

.vui-editor {
    &,
    & * {
        box-sizing: border-box;
    }

    .ProseMirror > ul,
    .ProseMirror > ol {
        padding-left: 0 !important;
        margin-left: 24px;

        ul, ol {
            padding-left: 0 !important;
            margin-left: 24px;
        }

        p {
            margin: 0;
        }
    }

    .ProseMirror > ul {
        list-style-type: disc;

        ul {
            list-style-type: disc;
        }
    }

    .ProseMirror > blockquote {
        border-left: 5px solid #edf2fc;
        border-radius: 2px;
        color: #606266;
        margin: 10px 0;
        padding-left: 1em;
    }

    .ProseMirror > pre {
        background: #0d0d0d;
        color: #fff;
        font-family: JetBrainsMono,monospace;
        padding: .75rem 1rem;
        border-radius: .5rem;
    }

    .ProseMirror > p > a {
        color: #3397ff;
        text-decoration: underline;
    }

    .h1, .h2, .h3, .h4, h1, h2, h3, h4 {
        font-weight: 700;
        line-height: 1.2;
        margin: 14px 0;
    }

    &.code-view {
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
    }
}

.vui-editor-img-wrap {
    display: block;
    outline: 0;

    img {
        outline: 2px solid transparent !important;
        transition: 0.3s outline ease;
        max-width: 100%;
        pointer-events: none;
    }

    &.ProseMirror-selectednode,
    &.has-focus {
        img {
            outline: 2px solid #3397ff !important;
        }
    }
}

// Fix fixed toolbar + position: sticky
#main-content {
    overflow-x: visible !important;
}

// Fix Vizy block fields and modified indicator
.vizyblock-fields .field::before {
    display: none !important;
}

.vizyblock-fields .field .status-badge {
    display: none !important;
}

// Fix Redactor incompatibility with ProseMirror style
.ProseMirror [contenteditable="false"] .redactor [contenteditable="true"] {
    white-space: normal;
}

// Fix Live Preview overlapping
.lp-editor-container > header {
    z-index: 100;
}

</style>
