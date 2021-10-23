<script>
import debounce from 'lodash/debounce';

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

    mounted() {
        this.$nextTick(() => {
            // Ensure any Craft fields are prepped.
            Craft.initUiElements(this.$el);

            this.$nextTick(() => {
                // Watch all field content for changes to serialize them to our text inputs that are stored in JSON blocks.
                this.watchFieldChanges();

                // Special fix for Redactor. For some reason, when clicking on formatting buttons, we lose
                // focus on ProseMirror. One day, we'll figure out what's really going on here
                this.applyRedactorFix();
            });
        });
    },

    methods: {
        watchFieldChanges() {
            var updateFunction = debounce(this.emitUpdate, 250);

            // Use MutationObserver to detect _any_ change in the block, and be sure to debounce
            // calls as there are a lot of changes. Far more effective than all the hundreds of different
            // plugins, edge-cases and dynamic DOM elements we have to deal with to get this to work
            // "normally" and more efficiently by say checking input events. Notably, dealing with hidden
            // input change events, tag fields, ST/Matrix fields, and lots more.
            var observer = new MutationObserver(( mutations ) => {
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

            //
            // Deprecated
            //
            // Using jQuery to handle dynamically-added DOM content.
            // For some reason, doesn't lightswitch fields behave differently...
            // $(this.$el).on('input change', 'input, textarea, select, .lightswitch', (e) => {
            //     this.emitUpdate();
            // });

            // // Handle hidden inputs, which are a bit special
            // $(this.$el).find('input[type=hidden]').each((index, element) => {
            //     var self = this;
            //     var { value } = element;

            //     Object.defineProperty(element, 'value', {
            //         set(newValue) {
            //             self.emitUpdate();

            //             value = newValue;
            //         },
            //         get(){
            //             return value;
            //         },
            //     });
            // });

            // // Handle element selects
            // $(this.$el).find('.elementselect').each((index, element) => {
            //     var elementSelect = $(element).data('elementSelect');

            //     if (elementSelect) {
            //         elementSelect.on('selectElements removeElements', () => {
            //             this.emitUpdate();
            //         });
            //     }
            // });

            // // Handle tag select - a little different
            // $(this.$el).find('.elementselect.tagselect .elements').each((index, element) => {
            //     const observer = new MutationObserver((mutationsList, observer) => {
            //         // Use traditional 'for loops' for IE 11
            //         for (const mutation of mutationsList) {
            //             if (mutation.type === 'childList' && (mutation.target.classList.contains('elements'))) {
            //                 // We need to subscribe to the input's value and trigger an update when that changes.
            //                 // This is because a hidden input is created when an element is selected, but for
            //                 // new tags, there's an Ajax call to create it. We need to listen for that,
            //                 $(mutation.target).find('input[type=hidden]').each((index, input) => {
            //                     this.waitForInputValue($(input), () => {
            //                         this.emitUpdate();
            //                     });
            //                 });
            //             }
            //         }
            //     });

            //     observer.observe(element, { childList: true, subtree: true });
            // });

            // // Handle asset element select fields, where they 

            // // Special case for Matrix blocks.
            // $(this.$el).find('.matrix').each((index, element) => {
            //     // Watch for all the different types of change events from Matrix. Too difficult to listen to all events
            //     // and not to mention, unreliable
            //     const observer = new MutationObserver((mutationsList, observer) => {
            //         // Use traditional 'for loops' for IE 11
            //         for (const mutation of mutationsList) {
            //             if (mutation.type === 'childList' && (mutation.target.classList.contains('blocks') || mutation.target.classList.contains('preview'))) {
            //                 this.emitUpdate();
            //             }
            //         }
            //     });

            //     observer.observe(element, { childList: true, subtree: true });
            // });

            // // Special case for Super Table blocks.
            // $(this.$el).find('.superTableContainer').each((index, element) => {
            //     // Watch for all the different types of change events from Super Table. Too difficult to listen to all events
            //     // and not to mention, unreliable
            //     const observer = new MutationObserver((mutationsList, observer) => {
            //         // Use traditional 'for loops' for IE 11
            //         for (const mutation of mutationsList) {
            //             if (mutation.type === 'childList' && (mutation.target.classList.contains('rowLayoutContainer') || mutation.target.classList.contains('matrixLayoutContainer') || mutation.target.classList.contains('preview') || mutation.target instanceof HTMLTableSectionElement)) {
            //                 this.emitUpdate();
            //             }
            //         }
            //     });

            //     observer.observe(element, { childList: true, subtree: true });
            // });

            // // Special case for Redactor
            // $(this.$el).find('.redactor .redactor-in').on('keyup', () => {
            //     // Redactor needs even more time to wait for it to be updated
            //     setTimeout(() => {
            //         this.emitUpdate();
            //     }, 500);
            // });
        },

        applyRedactorFix() {
            var $redactorToolbar = this.$el.querySelector('.redactor-toolbar');

            if ($redactorToolbar) {
                // This prevents focus being taken off the Redactor editor
                $redactorToolbar.addEventListener('mousedown', (e) => {
                    e.preventDefault();
                });
            }
        },

        emitUpdate() {
            // Give it a second for the DOM to update, as we rely on DOM values to serialize
            setTimeout(() => {
                this.$emit('update');
            }, 50);
        },

        onInputInit(input) {
            // This is fired whenever a block contains a nested Vizy field, and is initialised.
            // Here we watch for nested Vizy field content updates to fire an event back to the
            // block to serialize its content, so other Vizy field parents get notified.
            input.$on('content-update', (value) => {
                this.emitUpdate();
            });
        },
    },

    render(h) {
        // Apply our dynamically provided template, rendered via Craft.
        return h('div', {
            domProps: {
                innerHTML: this.template,
            },
        });
    },
};

</script>
