<template>
    <div>
        <div class="vui-icon-input" :class="{ 'tippy-visible': tippyVisible }">
            <div v-if="selected && !tippyVisible" class="vui-icon-input-item">
                <div class="vui-icon-input-svg" v-html="selected.svg"></div>
                <span class="vui-icon-input-label">{{ selected.label }}</span>
            </div>

            <input
                :id="id"
                v-model="search"
                type="text"
                autocomplete="off"
                autocorrect="off"
                autocapitalize="off"
                :class="inputClasses"
            >

            <button v-if="selected" type="button" class="vui-icon-input-delete" @click.prevent="deleteIcon">
                <!-- eslint-disable-next-line -->
                <svg aria-hidden="true" focusable="false" data-prefix="fal" data-icon="times" class="svg-inline--fa fa-times fa-w-10" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M193.94 256L296.5 153.44l21.15-21.15c3.12-3.12 3.12-8.19 0-11.31l-22.63-22.63c-3.12-3.12-8.19-3.12-11.31 0L160 222.06 36.29 98.34c-3.12-3.12-8.19-3.12-11.31 0L2.34 120.97c-3.12 3.12-3.12 8.19 0 11.31L126.06 256 2.34 379.71c-3.12 3.12-3.12 8.19 0 11.31l22.63 22.63c3.12 3.12 8.19 3.12 11.31 0L160 289.94 262.56 392.5l21.15 21.15c3.12 3.12 8.19 3.12 11.31 0l22.63-22.63c3.12-3.12 3.12-8.19 0-11.31L193.94 256z" /></svg>
            </button>
        </div>

        <div class="vui-icons-pane js-vui-tippy-template" style="display: none;">
            <div v-if="isFetching" class="vui-no-icons">
                <span class="vui-loading"></span>
            </div>

            <div v-else-if="Object.keys(iconsFiltered).length" class="vui-icons-groups">
                <div v-for="(group, j) in iconsFiltered" :key="j" class="vui-icons-group">
                    <span class="vui-icons-group-name">{{ group.name }}</span>

                    <div class="vui-icons">
                        <div v-for="(icon, i) in group.icons" :key="i" class="vui-icon-wrap" :title="`${icon.label} (${group.name})`" @click.prevent="select(icon)">
                            <div class="vui-icon-svg" v-html="icon.svg"></div>
                            <span class="vui-icon-label">{{ icon.label }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else class="vui-no-icons">
                {{ 'No icons match your query.' | t('vizy') }}
            </div>
        </div>
    </div>
</template>

<script>
import isEmpty from 'lodash/isEmpty';

import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light-border.css';

export default {
    name: 'VizyIconPicker',

    props: {
        inputClasses: {
            type: Object,
            default: () => {},
        },

        value: {
            type: Object,
            default: () => {},
        },
    },

    data() {
        return {
            tippy: null,
            id: `icon-picker-${Craft.randomString(10)}`,
            icons: [],
            search: '',
            selected: null,
            isFetching: false,
            tippyVisible: false,
        };
    },

    computed: {
        iconsFiltered() {
            if (isEmpty(this.icons)) {
                return [];
            }

            return this.icons.reduce((acc, iconGroup) => {
                const icons = iconGroup.icons.filter(icon => {
                    return icon.label.toLowerCase().includes(this.search.toLowerCase());
                });

                return !icons.length ? acc : acc.concat(Object.assign({}, iconGroup, { icons }));
            }, []);
        },
    },
  
    watch: {
        selected(newValue) {
            this.$emit('input', newValue);
        },
    },

    created() {
        if (this.value) {
            this.selected = this.value;
        }  
    },

    mounted() {
        const self = this;

        const template = this.$el.querySelector('.js-vui-tippy-template');
        template.style.display = 'block';

        this.tippy = tippy(`#${this.id}`, {
            content: template,
            trigger: 'focus',
            allowHTML: true,
            arrow: true,
            interactive: true,
            placement: 'bottom-start',
            theme: 'light-border icon-picker',
            maxWidth: 'none',
            zIndex: 10,
            hideOnClick: false,

            onCreate(instance) {
                self.isFetching = false;

                instance.popper.style.width = '100%';
            },

            onShow(instance) {
                self.tippyVisible = true;

                // Have we cached already, or fetching?
                if (self.isFetching || self.icons.length) {
                    return;
                }

                self.isFetching = true;

                fetch(Craft.getActionUrl('vizy/icons'))
                    .then((response) => response.json())
                    .then((json) => {
                        self.icons = json;
                    })
                    .catch((error) => {
                        instance.setContent(`Request failed. ${error}`);
                    })
                    .finally(() => {
                        self.isFetching = false;
                    });
            },

            onHide(instance) {
                self.isFetching = false;
                self.tippyVisible = false;
            },

            onHidden(instance) {
                // Always clear the search, but after transition. Otherwise, jumpy...
                self.search = '';
            },
        });
    },

    methods: {
        select(icon) {
            // Set the selected icon
            this.selected = icon;

            // Close the popover
            this.tippy[0].hide();
        },

        deleteIcon() {
            this.selected = null;
        },
    },
};

</script>

<style lang="scss">

// ==========================================================================
// Input
// ==========================================================================

.vui-icon-input {
    display: flex;
    align-items: center;

    position: relative;
    width: 100%;
    height: 34px;
    border-radius: 3px;
    border: 1px solid rgba(96, 125, 159, 0.25);
    background-color: #fbfcfe;
    box-shadow: inset 0 1px 4px -1px rgba(96, 125, 159, 0.25);
    color: #3f4d5a;
    box-sizing: border-box;
    padding: 6px;
    cursor: text;
}

.vui-icon-input input {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: calc(100% - 18px);
    background: transparent;
    padding: 0;
    margin: 0;
    border: 0;
    appearance: none;
    padding: 0 9px;
    border-radius: 5px;

    // Helps with existing search text when transitioning closed
    color: transparent;

    &:focus {
        outline: none;
    }

    &.error {
        border: 1px solid #CF1124 !important
    }
}

.vui-icon-input.tippy-visible input {
    color: inherit;
}

.vui-icon-input-item {
    display: flex;
    align-items: center;
}

.vui-icon-input-label {
    margin-right: 3px;
}

.vui-icon-input-svg {
    width: 18px;
    height: 18px;
    margin-right: 8px;
    align-items: center;

    svg {
        width: 100%;
        height: 100%;
        display: block;
        fill: currentColor;
    }
}

.vui-icon-input-delete {
    position: absolute;
    right: 8px;
    top: 50%;
    width: 20px;
    height: 20px;
    cursor: pointer;
    transform: translateY(-50%);
    z-index: 1;
    border-radius: 100%;
    border: 0;
    background: transparent;
    transition: all 0.2s ease;
    outline: none;

    &:hover {
        background: #596673;
        color: #fff;
    }

    svg {
        width: 100%;
        height: 100%;
        display: block;
        fill: currentColor;
    }
}


// ==========================================================================
// Dropdown
// ==========================================================================

.tippy-box[data-theme~='icon-picker'] >.tippy-content {
    overflow-y: auto;
    overflow-x: hidden;
    max-height: 50vh;
    min-height: 100px;
}

.vui-no-icons {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #596673;
}

.vui-icons-group-name {
    font-size: 11px;
    color: #606d7b;
    text-transform: uppercase;
    font-weight: bold;
    display: flex;
    margin: 5px;
}

.vui-icon-wrap {
    width: 56px;
    height: 56px;
    color: #3f4d5a;
    cursor: pointer;
    overflow: hidden;
    display: inline-flex;
    flex-wrap: wrap;

    &:hover {
        background-color: #f3f7fc;
    }
}

.vui-icon-label {
    display: none;
}

.vui-icon-svg {
    width: 32px;
    height: 32px;
    margin: auto;

    svg {
        width: 100%;
        height: 100%;
        display: block;
        fill: currentColor;
    }
}



// ==========================================================================
// Loading
// ==========================================================================

@keyframes loading {
    0% {
        transform: rotate(0)
    } 100% {
        transform: rotate(360deg)
    }
}

.vui-loading {
    position: relative;
    pointer-events: none;
    color: transparent !important;
    min-height: 1rem;

    &::after {
        position: absolute;
        display: block;
        height: 1rem;
        width: 1rem;
        margin-top: -0.65rem;
        margin-left: -0.65rem;
        border-width: 2px;
        border-style: solid;
        border-radius: 9999px;
        border-color: #E5422B;
        animation: loading 0.5s infinite linear;
        border-right-color: transparent;
        border-top-color: transparent;
        content: "";
        left: 50%;
        top: 50%;
        z-index: 1;
    }
}

.vui-loading.vui-loading-lg {
    min-height: 2rem;

    &::after {
        height: 2rem;
        width: 2rem;
        margin-top: -1rem;
        margin-left: -1rem;
    }
}

.vui-loading.vui-loading-sm {
    min-height: 0.75rem;

    &::after {
        height: 0.75rem;
        width: 0.75rem;
        margin-top: -0.5rem;
        margin-left: -0.375rem;
    }
}

.vui-loading.vui-loading-tiny {
    min-height: 0.5rem;

    &::after {
        height: 0.5rem;
        width: 0.5rem;
        margin-top: -6px;
        margin-left: -6px;
    }
}

.btn.submit.vui-loading {
    color: transparent !important;
}

.btn.submit.vui-loading::after {
    border-bottom-color: #fff;
    border-left-color: #fff;
}

.btn.vui-loading {
    color: transparent !important;
}

</style>

