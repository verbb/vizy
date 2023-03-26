<template>
    <node-view-wrapper class="vui-iframe" :class="{ 'selected': selected }">
        <div class="vui-iframe-wrap">
            <iframe v-bind="node.attrs" :src="node.attrs.url"></iframe>
        </div>
    </node-view-wrapper>
</template>

<script>
import { NodeViewWrapper } from '@tiptap/vue-3';

export default {
    name: 'IframeView',

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
};

</script>

<style lang="scss">

.vui-iframe {
    outline: transparent 3px solid;
    margin: 0.9em 0;
    transition: outline-color 0.2s ease;

    &.selected {
        outline-color: #3778eb;
    }
}

.vui-iframe-wrap {
    pointer-events: none;
    position: relative;
    padding-bottom: 100%;
    height: 0;
    padding-bottom: 56.2493%;
    background: #e4ecf5;
}

.vui-iframe-wrap iframe {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 2;
}

</style>
