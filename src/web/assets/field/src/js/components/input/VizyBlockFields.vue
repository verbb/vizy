<script>
import { h, compile } from 'vue';
import { debounce } from 'lodash-es';

export default {
    name: 'VizyBlockFields',

    // Add nonsense as we don't want any Vue templating included in this template
    // Otherwise including Twig in field content will throw an error.
    delimiters: ['$!{', '}!$'],

    props: {
        template: {
            type: String,
            default: '',
        },
    },

    emits: ['update'],

    mounted() {
        this.$nextTick(() => {
            // If there was a fatal Vue error when rendering fields, there will be no `$el`.
            if (this.$el) {
                // Ensure any Craft fields are prepped.
                Craft.initUiElements(this.$el);

                // For any nested Vizy fields, mark them as Vue-rendered. This prevents us double-binding.
                this.$el.querySelectorAll('.vizy-input-component').forEach((item) => {
                    item.parentElement.__vueInit = true;
                });

                this.$nextTick(() => {
                    // Watch all field content for changes to serialize them to our text inputs that are stored in JSON blocks.
                    this.watchFieldChanges();

                    // Special fix for Redactor. For some reason, when clicking on formatting buttons, we lose
                    // focus on ProseMirror. One day, we'll figure out what's really going on here
                    this.applyRedactorFix();

                    // Special fix for the removal of `tabindex` on fields causing an issue only after blocks have moved
                    // https://github.com/verbb/vizy/issues/267
                    this.applyTabIndexFix();

                    this.applyNeoFix();
                });
            }
        });
    },

    methods: {
        vizyBlock() {
            return this.$parent.$parent.$parent.$parent;
        },

        watchFieldChanges() {
            const updateFunction = debounce(this.emitUpdate, 50);

            // Use MutationObserver to detect _any_ change in the block, and be sure to debounce
            // calls as there are a lot of changes. Far more effective than all the hundreds of different
            // plugins, edge-cases and dynamic DOM elements we have to deal with to get this to work
            // "normally" and more efficiently by say checking input events. Notably, dealing with hidden
            // input change events, tag fields, ST/Matrix fields, and lots more.
            const observer = new MutationObserver((mutations) => {
                updateFunction();
            });

            observer.observe(this.$el, {
                childList: true,
                attributes: true,
                subtree: true,
                characterData: true,
            });

            // MutationObserver doesn't listen to value changes, so add handling for input events
            $(this.$el).on('input change', 'input, textarea, select', (e) => {
                this.emitUpdate();
            });
        },

        applyRedactorFix() {
            const $redactorToolbars = this.$el.querySelectorAll('.redactor-toolbar');

            if ($redactorToolbars.length) {
                $redactorToolbars.forEach(($redactorToolbar) => {
                    // This prevents focus being taken off the Redactor editor
                    $redactorToolbar.addEventListener('mousedown', (e) => {
                        e.preventDefault();
                    });
                });
            }
        },

        applyNeoFix() {
            if (!this.$el.querySelector('[data-type="benf\\\\neo\\\\Field"]')) {
                return;
            }

            // When Neo fields are initialized, they trigger `initialSerializedValue` on the main form. This is fine normally, but when moving blocks
            // and the field is re-rendered and its JS re-initialized, the form is re-serialized with content now. This resets any Vizy changes
            // which have just happened due to a move. It's a bit icky, but remove the Vizy field (top-level) serialized data, so that it's actually saved
            // See https://github.com/verbb/vizy/issues/272
            const $mainForm = $('form#main-form');
            const actionName = encodeURIComponent(this.vizyBlock().vizyField.name);

            let data = $mainForm.data('initialSerializedValue');
            data = data.replace(new RegExp(`${Craft.escapeRegex(actionName)}[^&]*&?`), '');
            $mainForm.data('initialSerializedValue', data);

            // There's also a duplicated buttons rows on re-initialization
            this.$el.querySelectorAll('[data-type="benf\\\\neo\\\\Field"]').forEach(($neoField) => {
                const $buttons = $neoField.querySelectorAll('.ni_buttons');

                if ($buttons.length > 1) {
                    // Keep only the last occurrence
                    $buttons.forEach(($button, index) => {
                        if (index != ($buttons.length - 1)) {
                            $button.remove();
                        }
                    });
                }
            });
        },

        applyTabIndexFix() {
            this.$el.querySelectorAll('.field').forEach(($field) => {
                $field.setAttribute('tabindex', -1);
            });
        },

        emitUpdate() {
            // Give it a second for the DOM to update, as we rely on DOM values to serialize.
            setTimeout(() => {
                this.$emit('update');
            }, 50);

            // Also, run this again at a longer timeout _just_ in case we've acted too quickly (Redactor).
            setTimeout(() => {
                this.$emit('update');
            }, 200);
        },
    },

    render() {
        try {
            // Apply our dynamically provided template, rendered via Craft.
            return h(compile(`<div>${this.template}</div>`));
        } catch (e) {
            console.error(e);
            console.log('Vue template compile error: %o', { template: this.template });

            // Fallback whenever there are fatal issues rendering
            const message = this.t('vizy', 'Unable to parse block definition.');

            return h(compile(`<div class="vizyblock-invalid"><p class="error">${message}</p></div>`));
        }

    },
};

</script>
