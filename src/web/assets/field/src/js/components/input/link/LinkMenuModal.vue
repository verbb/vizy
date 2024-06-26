<template>
    <menu-bar-modal
        v-model="proxyShow"
        :confirm-button="$attrs['confirm-button']"
        @confirm="confirmModal"
        @cancel="cancelModal"
    >
        <template #title>{{ t('vizy', $attrs['modal-title']) }}</template>

        <!-- eslint-disable vue/no-mutating-props -->
        <div id="url-field" class="field" :class="{ 'has-errors': errors.includes('url') }">
            <div class="heading">
                <label id="url-label" class="required" for="url">{{ t('vizy', 'URL') }}</label>
            </div>

            <div class="input ltr" :class="{ 'errors': errors.includes('url') }">
                <input
                    id="url"
                    v-model="modelValue.url"
                    type="text"
                    class="text fullwidth"
                    autofocus=""
                    autocomplete="off"
                    required
                >
            </div>

            <ul v-if="errors.includes('url')" class="errors">
                <li>{{ t('vizy', 'URL cannot be blank.') }}</li>
            </ul>
        </div>

        <div id="text-field" class="field">
            <div class="heading">
                <label id="text-label" for="text">{{ t('vizy', 'Text') }}</label>
            </div>

            <div class="input ltr">
                <input
                    id="text"
                    v-model="modelValue.text"
                    type="text"
                    class="text fullwidth"
                    autofocus=""
                    autocomplete="off"
                >
            </div>
        </div>

        <div id="target-field" class="checkboxfield field">
            <div class="input ltr">
                <input
                    :id="targetId"
                    v-model="newWindow"
                    type="checkbox"
                    class="checkbox"
                >
                <label :for="targetId">
                    {{ t('vizy', 'Open link in new tab') }}
                </label>
            </div>
        </div>

        <div v-if="hasSiteSelect" id="site-field" class="field">
            <div class="heading">
                <label id="site-label" for="site">{{ t('vizy', 'Site') }}</label>
            </div>

            <div class="input ltr">
                <div class="select">
                    <select
                        id="site"
                        v-model="modelValue.site"
                    >
                        <option v-for="(option, index) in allSiteOptions" :key="index" :value="option.value">{{ option.label }}</option>
                    </select>
                </div>
            </div>
        </div>

        <a :class="['fieldtoggle', { 'expanded': advancedPane }]" data-target="advanced" @click.prevent="toggleAdvanced">{{ t('app', 'Advanced') }}</a>

        <div :class="{ 'hidden': !advancedPane }">
            <div id="title-field" class="field">
                <div class="heading">
                    <label id="title-label" for="title">{{ t('vizy', 'Title') }}</label>
                </div>

                <div class="input ltr">
                    <input
                        id="title"
                        v-model="modelValue.title"
                        type="text"
                        class="text fullwidth"
                        autofocus=""
                        autocomplete="off"
                    >
                </div>
            </div>

            <div id="classes-field" class="field">
                <div class="heading">
                    <label id="classes-label" for="classes">{{ t('vizy', 'Classes') }}</label>
                </div>

                <div class="input ltr">
                    <input
                        id="classes"
                        v-model="modelValue.class"
                        type="text"
                        class="text fullwidth"
                        autofocus=""
                        autocomplete="off"
                    >
                </div>
            </div>
        </div>

        <!-- eslint-enable vue/no-mutating-props -->
    </menu-bar-modal>
</template>

<script>
import { TextSelection } from 'prosemirror-state';

import { getMarkRange } from '@utils/tiptap/marks';
import MenuBarModal from '../MenuBarModal.vue';

export default {
    name: 'LinkMenuModal',

    components: {
        MenuBarModal,
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

        show: {
            type: Boolean,
            default: false,
        },

        modelValue: {
            type: Object,
            default: () => {
                return this.proxyValue;
            },
        },
    },

    emits: ['update:modelValue', 'close'],

    data() {
        return {
            targetId: `target-${Craft.randomString(10)}`,
            proxyShow: false,
            proxyValue: {
                url: null,
                text: null,
                target: null,
                class: null,
                title: null,
                site: '',
            },
            errors: [],
            advancedPane: false,
        };
    },

    computed: {
        elementSiteId() {
            return this.field.settings.elementSiteId;
        },

        allSiteOptions() {
            return this.field.settings.allSiteOptions;
        },

        newWindow: {
            get() {
                return (this.modelValue.target === '_blank');
            },
            set(value) {
                // eslint-disable-next-line vue/no-mutating-props
                this.modelValue.target = (value ? '_blank' : '');
            },
        },

        hasSiteSelect() {
            // Only add site selector if it looks like an element reference link
            if (this.modelValue && this.modelValue.url) {
                const refHandlesRegex = Craft.Vizy.localizedRefHandles.join('|');

                return this.modelValue.url.match(new RegExp(`(#(?:${refHandlesRegex}):\\d+)(?:@(\\d+))?`));
            }

            return false;
        },
    },

    watch: {
        show(newValue) {
            this.proxyShow = newValue;
        },

        proxyShow(newValue) {
            if (newValue === false) {
                this.$emit('close');
            }
        },

        proxyValue: {
            handler(newValue, oldValue) {
                this.$emit('update:modelValue', newValue);
            },
            deep: true,
        },

        'modelValue.site': function(newValue) {
            const refHandlesRegex = Craft.Vizy.localizedRefHandles.join('|');
            const match = this.modelValue.url.match(new RegExp(`(#(?:${refHandlesRegex}):\\d+)(?:@(\\d+))?`));

            const selectedSiteId = parseInt(this.modelValue.site, 10);
            let ref = match[1];

            if (selectedSiteId) {
                ref += `@${selectedSiteId}`;
            }

            this.proxyValue.url = this.modelValue.url.replace(match[0], ref);
        },
    },

    created() {
        this.proxyValue = this.modelValue;
    },

    methods: {
        cancelModal() {
            this.proxyShow = false;
        },

        toggleAdvanced() {
            this.advancedPane = !this.advancedPane;
        },

        confirmModal() {
            this.errors = [];

            if (!this.modelValue.url) {
                this.errors.push('url');

                return;
            }

            const data = {
                href: this.modelValue.url,
                target: this.modelValue.target ? '_blank' : '',
                class: this.modelValue.class,
                title: this.modelValue.title,
                site: this.modelValue.site,
            };

            // Save the cursor position so we can restore it afterwards
            const { selection } = this.editor.state.tr;
            const cursorPos = selection.$cursor ? selection.$cursor.pos : selection.from;

            // Update the text attributes. Text is a little tricky for the moment
            this.editor.chain().focus().command(({
                commands, tr, state, dispatch,
            }) => {
                // From the focused link, (cursor or highlighted text) get the full mark position range.
                // We need this to properly update the text and attributes.
                let range = getMarkRange(state.doc.resolve(tr.selection.anchor), state.schema.marks.link);

                // Here, we can't find the range, probably because we're adding a new link on a text node.
                // That's much easier to deal with, as it'll always be the selected range
                if (!range) {
                    range = { from: tr.selection.from, to: tr.selection.to };
                }

                if (this.modelValue.text) {
                    // Cast as string, just in case.
                    const text = this.modelValue.text.toString();

                    // Insert the new text, replacing the old range
                    tr.insertText(text, range.from, range.to);

                    // Now the selection length has likely changed, get it again
                    const $start = tr.doc.resolve(range.from);
                    const $end = tr.doc.resolve(range.from + text.length);

                    // And re-select it so our attribute-update actually works.
                    tr.setSelection(new TextSelection($start, $end));
                }
            }).setLink(data).command(({
                commands, tr, state, dispatch,
            }) => {
                // Restore the cursor once the mark updates have been done
                if (cursorPos) {
                    tr.setSelection(TextSelection.create(tr.doc, cursorPos));
                }
            }).run();

            this.proxyShow = false;
        },
    },
};

</script>
