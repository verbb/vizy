<template>
    <textarea v-if="visible" ref="textarea" v-model="proxyValue" class="vui-code-editor"></textarea>
</template>

<script>

export default {
    name: 'CodeEditor',

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
        };
    },

    watch: {
        visible(newValue) {
            if (newValue) {
                this.proxyValue = this.value;
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

                    if (this.$refs.textarea) {
                        this.$refs.textarea.style.width = width + 'px';
                        this.$refs.textarea.style.height = height + 'px';
                    }
                });
            }
        },
    },
};

</script>

<style lang="scss">

.vui-code-editor {
    position: absolute;
    width: 100%;
    height: 100%;
    background: #252525;
    color: #ccc;
    font-family: SFMono-Regular,Consolas,"Liberation Mono",Menlo,Courier,monospace;
    font-size: .9em!important;
    padding: 20px;
    display: block;
    margin: 0;
    border: none;
    box-shadow: none;
    border-radius: 0;
    outline: 0;
    line-height: 1.5;
    resize: vertical;
    box-sizing: border-box;
}
 
</style>
