<template>
    <div v-if="items.length" class="vui-command-items" style="max-height: 216px;">
        <div class="vui-command-items-wrap">
            <div v-for="(column, index) in columns" :key="index" class="vui-command-column">
                <button
                    v-for="(item, itemIndex) in column"
                    :key="itemIndex"
                    class="vui-command-item"
                    :class="{ 'is-selected': selectedIndex === getItemIndex(itemIndex, index) }"
                    @click="selectItem(getItemIndex(itemIndex, index))"
                >
                    <svg-icon :content="item" class="vui-command-item-icon" />

                    <span class="vui-command-item-label">
                        {{ item.title }}
                    </span>
                </button>
            </div>
        </div>

        <div class="vui-command-info" style="min-height: 32px;">
            <div class="vui-command-info-left">
                <div class="vui-command-info-shortcut">
                    <div v-if="shortcutInfo.label" class="vui-command-info-shortcut-label">{{ shortcutInfo.label }}</div>

                    <div v-for="(icon, index) in shortcutInfo.icons" :key="index" class="vui-command-info-shortcut-img">{{ icon }}</div>
                </div>
            </div>
        </div>
    </div>

    <div v-else class="vui-command-items-empty">
        {{ t('vizy', 'No items found.') }}
    </div>
</template>

<script>
import { get } from 'lodash-es';

import SvgIcon from '../SvgIcon.vue';

export default {
    components: {
        SvgIcon,
    },

    props: {
        items: {
            type: Array,
            required: true,
        },

        command: {
            type: Function,
            required: true,
        },
    },

    data() {
        return {
            selectedIndex: 0,
        };
    },

    computed: {
        columns() {
            const numColumns = 3;
            const columnLength = Math.ceil(this.items.length / numColumns);
            const columns = [];

            for (let i = 0; i < numColumns; i++) {
                columns.push(this.items.slice(i * columnLength, (i + 1) * columnLength));
            }

            return columns;
        },

        shortcutInfo() {
            const item = this.items[this.selectedIndex];
            const shortcut = get(item, 'commandInfo.shortcut');
            const text = get(item, 'commandInfo.text');

            if (shortcut) {
                // Swap out textual shortcut for OS-specific ones
                return {
                    label: Craft.t('vizy', 'Shortcut:'),
                    icons: this.formatKeyboardShortcuts(shortcut),
                };
            }

            if (text) {
                return {
                    label: text,
                };
            }

            return {};
        },
    },

    methods: {
        onKeyDown({ event }) {
            if (event.key === 'ArrowUp') {
                this.moveSelectionUp();
                return true;
            }

            if (event.key === 'ArrowDown') {
                this.moveSelectionDown();
                return true;
            }

            if (event.key === 'ArrowLeft') {
                this.moveSelectionLeft();
                return true;
            }

            if (event.key === 'ArrowRight') {
                this.moveSelectionRight();
                return true;
            }

            if (event.key === 'Enter') {
                this.enterHandler();
                return true;
            }

            return false;
        },

        getItemIndex(itemIndex, columnIndex) {
            return itemIndex + columnIndex * Math.ceil(this.items.length / 3);
        },

        moveSelectionUp() {
            if (this.selectedIndex > 0) {
                this.selectedIndex--;
            }
        },

        moveSelectionDown() {
            if (this.selectedIndex < this.items.length - 1) {
                this.selectedIndex++;
            }
        },

        moveSelectionLeft() {
            if (this.selectedIndex >= 0) {
                const currentColumnIndex = Math.floor(this.selectedIndex / Math.ceil(this.items.length / 3));

                if (currentColumnIndex > 0) {
                    const newIndex = this.selectedIndex - Math.ceil(this.items.length / 3);

                    this.selectedIndex = newIndex;
                }
            }
        },

        moveSelectionRight() {
            if (this.selectedIndex >= 0) {
                const currentColumnIndex = Math.floor(this.selectedIndex / Math.ceil(this.items.length / 3));

                if (currentColumnIndex < 2) {
                    const newIndex = this.selectedIndex + Math.ceil(this.items.length / 3);

                    if (newIndex < this.items.length) {
                        this.selectedIndex = newIndex;
                    }
                }
            }
        },

        enterHandler() {
            this.selectItem(this.selectedIndex);
        },

        selectItem(index) {
            const item = this.items[index];

            if (item) {
                this.command(item);
            }
        },

        formatKeyboardShortcuts(shortcuts) {
            const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

            const modifierKeys = {
                Mod: isMac ? '⌘' : 'Ctrl',
                Alt: isMac ? '⌥' : 'Alt',
                Shift: isMac ? '⇧' : 'Shift',
                Ctrl: isMac ? '⌃' : 'Ctrl',
            };

            return shortcuts.split('-').map((shortcut) => {
                return modifierKeys[shortcut] || shortcut;
            });
        },
    },
};

</script>

<style lang="scss">

[data-theme~="vui-command-dropdown"] .tippy-content {
    padding: 0;
    width: 600px;
}

.vui-command-items {
    position: relative;
    overflow: hidden;
    flex-direction: column;
    display: flex;
}

.vui-command-items-empty {
    padding: 8px;
}

.vui-command-items-wrap {
    padding: 4px;
    overflow: auto;
    flex-grow: 1;
    min-height: 1px;
    display: flex;
}

.vui-command-column {
    flex-grow: 1;
    min-height: 1px;
    flex-basis: 100%;
    height: 100%;
}

.vui-command-item {
    display: block;
    width: 100%;
    border-radius: 4px;
    padding: 6px;
    text-align: left;
    transition: background 0.2s ease;
    align-items: center;
    display: flex;

    &:hover,
    &.is-selected {
        background: #e8ecf2;
    }
}

.vui-command-item-icon {
    color: #a1afc4;
    margin-right: 8px;
    align-items: center;
    display: flex;
    width: 16px;
    height: 16px;

    svg {
        fill: currentColor;
        width: 100%;
        height: 100%;
    }
}

.vui-command-item-label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #5e646e;
}

.vui-command-info {
    min-height: 32px;
    padding-left: 4px;
    padding-right: 4px;
    box-shadow: 0 4px 16px #00000003, 0 4px 16px #0000000a, 0 2px 12px #0000000f, 0 1px 4px #00000014;
    align-items: center;
    display: flex;
}

.vui-command-info-left {
    padding: 4px 8px;
    flex-grow: 1;
    min-height: 1px;
    flex-basis: 100%;
    font-size: 12px;
}

.vui-command-info-shortcut {
    align-items: center;
    display: flex;
    user-select: none;
}

.vui-command-info-shortcut-label {
    color: #acb1b9;
    margin-right: 4px;
}

.vui-command-info-shortcut-img {
    line-height: 16px;
    min-width: 24px;
    margin-left: 4px;
    padding: 4px;
    border-radius: 4px;
    text-align: center;
    background: #ebf0f5;
}


</style>
