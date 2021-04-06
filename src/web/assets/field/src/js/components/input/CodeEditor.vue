<template>
    <codemirror v-if="visible" v-model="proxyValue" class="vui-code-editor" :options="options" />
</template>

<script>
import { codemirror } from 'vue-codemirror-lite';
import beautify from 'js-beautify';

import 'codemirror/mode/vue/vue';
import 'codemirror/theme/material.css';

export default {
    name: 'CodeEditor',

    components: {
        codemirror,
    },

    props: {
        field: {
            type: Object,
            default: null,
        },

        editor: {
            type: Object,
            default: null,
        },

        visible: {
            type: Boolean,
            default: false,
        },

        value: {
            type: String,
            default: '',
        },
    },

    data() {
        return {
            proxyValue: '',
            options: {
                theme: 'material',
                mode: 'htmlmixed',
                htmlMode: true,
                lineNumbers: true,
                lineWrapping: true,
                indentUnit: 4,
            },
        };
    },

    watch: {
        visible(newValue) {
            if (newValue) {
                // eslint-disable-next-line
                this.proxyValue = beautify.html(this.value, { indent_size: 4 });
            }

            this.resizeHandler();
        },

        proxyValue(newValue) {
            this.$emit('input', newValue);
        },
    },

    created() {
        this.editor.on('resize', this.resizeHandler.bind(this));
    },

    methods: {
        resizeHandler() {
            // Sync the height of the code editor with the editor
            if (this.visible) {
                this.$nextTick(() => {
                    const { width, height } = this.editor.view.dom.getBoundingClientRect();

                    this.$el.style.width = width + 'px';
                    this.$el.style.height = height + 'px';
                });
            }
        },
    },
};

</script>

<style lang="scss">

.vui-code-editor {
    position: absolute;
    font-size: 12px;
    line-height: 1.5;
    width: 100%;
    box-sizing: border-box;

    .CodeMirror {
        height: 100%;
    }
}

</style>
