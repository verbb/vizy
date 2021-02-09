<template>
    <textarea v-if="visible" v-model="proxyValue" class="vui-code-editor"></textarea>
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
        },

        proxyValue(newValue) {
            this.$emit('input', newValue);
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
}
 
</style>
