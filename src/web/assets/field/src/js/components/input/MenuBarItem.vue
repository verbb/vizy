<template>
    <button v-tooltip="{ content: title, theme: 'vui-tooltip' }" class="btn vui-toolbar-btn" :class="{ 'active': active }" @click.prevent="runAction(action)" @mousedown="onMouseDown">
        <svg-icon :content="{ icon, svg }" />

        <div v-if="hasDropdown()" class="vui-toolbar-dropdown-container" :class="'vui-toolbar-dropdown-' + name" style="display: none;">
            <div class="vui-toolbar-dropdown-wrap">
                <button v-for="(option, i) in options" :key="i" class="vui-toolbar-dropdown" :class="['vui-toolbar-dropdown-item-' + option.name, { 'active': optionActive(option) }]" @click.prevent="runAction(option.action)">
                    {{ option.title }}
                </button>
            </div>
        </div>
    </button>
</template>

<script>
import tippy from 'tippy.js';
import 'tippy.js/themes/light-border.css';

import SvgIcon from './SvgIcon.vue';

export default {
    name: 'MenuBarItem',

    components: {
        SvgIcon,
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

        icon: {
            type: String,
            default: null,
        },

        svg: {
            type: String,
            default: null,
        },

        name: {
            type: String,
            default: null,
        },

        title: {
            type: String,
            default: null,
        },

        action: {
            type: Function,
            default: () => {},
        },

        isActive: {
            type: Function,
            default: () => {},
        },

        options: {
            type: Array,
            default: () => { return []; },
        },
    },

    data() {
        return {
            tippy: null,
        };
    },

    computed: {
        active() {
            return this.isActive && this.isActive();
        },
    },

    mounted() {
        this.$nextTick(() => {
            if (this.hasDropdown) {
                const $template = this.$el.querySelector(`.vui-toolbar-dropdown-${this.name}`);
                const $button = this.$el;

                if ($template && $button) {
                    $template.style.display = 'block';

                    this.tippy = tippy($button, {
                        content: $template,
                        trigger: 'click',
                        allowHTML: true,
                        arrow: false,
                        interactive: true,
                        placement: 'bottom-start',
                        theme: 'light-border toolbar-dropdown',
                        duration: 200,
                        zIndex: 1000,
                        hideOnClick: true,
                        offset: [0, 1],
                    });
                }
            }
        });
    },

    methods: {
        hasDropdown() {
            return (this.options && this.options.length) ? true : false;
        },

        optionActive(option) {
            return option.isActive && option.isActive();
        },

        runAction(action) {
            if (this.tippy) {
                this.tippy.hide();
            }

            if (action) {
                action();
            }
        },

        onMouseDown(e) {
            e.preventDefault();
        },
    },
};

</script>

<style lang="scss">

.vui-toolbar-btn {
    background: transparent;
    color: #1c2e36;
    border-radius: 3px;
    padding-left: 4px;
    padding-right: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    text-align: center;
    height: 32px;
    width: 32px;
    margin: 0 2px;

    [data-icon] {
        margin: 0 !important;
    }

    &:focus,
    &:hover {
        background-color: #edf3fa !important;
    }

    &.active {
        background-color: rgba(96, 125, 159, 0.25) !important;
    }
}

.vui-toolbar-dropdown {
    display: block;
    width: 100%;
    padding: 10px;
    margin: 0;
    text-align: left;
    text-decoration: none;
    white-space: nowrap;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    outline: 0;

    &:hover,
    &.active {
        cursor: pointer;
        background: rgb(243 245 249);
    }
}

.vui-toolbar-dropdown-wrap {
    max-height: 300px;
    overflow: auto;
}

.tippy-box[data-theme~="toolbar-dropdown"] {
    min-width: 250px;

    .tippy-content {
        padding: 0;
    }
}

.vui-toolbar-dropdown-heading,
.vui-toolbar-dropdown-formatting {
    .vui-toolbar-dropdown-item-quote {
        color: rgba(0,0,0,.4);
        font-style: italic;
    }

    .vui-toolbar-dropdown-item-code {
        font-family: SFMono-Regular,Consolas,"Liberation Mono",Menlo,Courier,monospace;
        font-size: .9em!important;
    }

    .vui-toolbar-dropdown-item-h1 {
        font-size: 22px;
        font-weight: 600;
    }

    .vui-toolbar-dropdown-item-h2 {
        font-size: 20px;
        font-weight: 600;
    }

    .vui-toolbar-dropdown-item-h3 {
        font-size: 18px;
        font-weight: 600;
    }

    .vui-toolbar-dropdown-item-h4 {
        font-size: 16px;
        font-weight: 600;
    }

    .vui-toolbar-dropdown-item-h5 {
        font-size: 14px;
        font-weight: 600;
    }

    .vui-toolbar-dropdown-item-h6 {
        font-size: 13.6px;
        color: #7b8793;
        font-weight: 600;
    }
}

.vui-toolbar-dropdown-link {
    .vui-toolbar-dropdown-item-unlink {
        color: rgba(0, 0, 0, 0.4);
    }
}

</style>
