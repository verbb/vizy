<template>
    <node-view-wrapper class="vui-media-embed" :class="{ 'selected': selected }">
        <div v-if="error" class="vui-media-wrap">
            <div class="vui-media-wrap-error">
                <span class="error" v-html="errorMessage"></span>
            </div>
        </div>

        <div v-else class="vui-media-wrap vui-loading vui-loading-lg" v-html="html"></div>
    </node-view-wrapper>
</template>

<script>
import { extract } from '@extractus/oembed-extractor';
import { NodeViewWrapper } from '@tiptap/vue-3';

import { getErrorMessage } from '@utils/forms';

export default {
    name: 'MediaEmbedView',

    components: {
        NodeViewWrapper,
    },

    props: {
        editor: {
            type: Object,
            default: () => {},
        },

        node: {
            type: Object,
            default: () => {},
        },

        decorations: {
            type: Array,
            default: () => { return []; },
        },

        selected: {
            type: Boolean,
            default: false,
        },

        extension: {
            type: Object,
            default: () => {},
        },

        getPos: {
            type: Function,
            default: () => {},
        },

        updateAttributes: {
            type: Function,
            default: () => {},
        },
    },

    data() {
        return {
            error: false,
            errorMessage: '',
        };
    },

    computed: {
        html() {
            if (this.node.attrs.url) {
                return this.data?.html;
            }

            return '';
        },

        data: {
            get() {
                return this.node.attrs.data;
            },
            set(data) {
                return this.updateAttributes({ data });
            },
        },
    },

    watch: {
        'node.attrs.url': function(newValue, oldValue) {
            this.initEmbed();
        },
    },

    created() {
        // Will need to be reloaded when toggling the code editor
        this.editor.on('vui:code-editor-toggle', () => {
            this.initEmbed();
        });
    },

    mounted() {
        this.$nextTick(() => {
            if (!this.html) {
                this.initEmbed();
            }
        });
    },

    methods: {
        async initEmbed() {
            this.error = false;
            this.errorMessage = '';

            if (this.node.attrs.url) {
                try {
                    let { url } = this.node.attrs;

                    // YouTube live video's weirdly aren't supported. Probably put a PR to https://github.com/extractus/oembed-extractor
                    // Change `https://www.youtube.com/live/xxxxxxxxx?si=ccccccccc` to `https://www.youtube.com/watch?v=xxxxxxxxx``
                    const match = url.match(/youtube\.com\/live\/(\w+)/);

                    if (match) {
                        url = `https://www.youtube.com/watch?v=${match[1]}`;
                    }

                    const result = await extract(url);

                    this.data = result;
                } catch (error) {
                    console.error(error);

                    this.data = null;
                    this.error = true;

                    const info = getErrorMessage(error);
                    this.errorMessage = `<strong>${info.heading}</strong><br><small>${info.text}<br>${info.trace}</small>`;
                }
            }
        },
    },
};

</script>

<style lang="scss">

.vui-media-embed {
    outline: transparent 3px solid;
    margin: 0.9em 0;
    transition: outline-color 0.2s ease;

    &.selected {
        outline-color: #3778eb;
    }
}

.vui-media-wrap {
    pointer-events: none;
    position: relative;
    padding-bottom: 100%;
    height: 0;
    padding-bottom: 56.2493%;
    background: #e4ecf5;
}

.vui-media-wrap iframe {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 2;
}

.vui-media-wrap-error {
    text-align: center;
    color: #dc2626 !important;
    padding: 2rem;
}

</style>
