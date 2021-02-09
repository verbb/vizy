<script>

export default {
    name: 'VizyBlockFields',

    components: {
        // Seems to be the only way to resolve issues!
        VizyInput: () => import('../VizyInput.vue'),
    },

    props: {
        template: {
            type: String,
            default: '',
        },
    },

    created() {
        // Apply our dynamically provided template, rendered via Craft.
        this.$options.template = '<div>' + this.template + '</div>';
    },

    mounted() {
        this.$nextTick(() => {
            // Watch all field content for changes to serialize them to our text inputs that are stored in JSON blocks.
            this.watchFieldChanges();

            // Ensure any Craft fields are prepped.
            Craft.initUiElements(this.$el);
        });
    },

    methods: {
        watchFieldChanges() {
            // Using jQuery to handle dynamically-added DOM content.
            // For some reason, doesn't lightswitch fields behave differently...
            $(this.$el).on('input change', 'input, textarea, select, .lightswitch', () => {
                this.emitUpdate();
            });

            $(this.$el).find('.elementselect').each((index, element) => {
                var elementSelect = $(element).data('elementSelect');

                if (elementSelect) {
                    elementSelect.on('selectElements removeElements', () => {
                        this.emitUpdate();
                    });
                }
            });

            // Special case for Matrix blocks.
            $(this.$el).find('.matrix').each((index, element) => {
                // Watch for all the different types of change events from Matrix. Too difficult to listen to all events
                // and not to mention, unreliable
                const observer = new MutationObserver((mutationsList, observer) => {
                    // Use traditional 'for loops' for IE 11
                    for (const mutation of mutationsList) {
                        if (mutation.type === 'childList' && (mutation.target.classList.contains('blocks') || mutation.target.classList.contains('preview'))) {
                            this.emitUpdate();
                        }
                    }
                });

                observer.observe(element, { childList: true, subtree: true });
            });

            // Special case for Super Table blocks.
            $(this.$el).find('.superTableContainer').each((index, element) => {
                // Watch for all the different types of change events from Super Table. Too difficult to listen to all events
                // and not to mention, unreliable
                const observer = new MutationObserver((mutationsList, observer) => {
                    // Use traditional 'for loops' for IE 11
                    for (const mutation of mutationsList) {
                        if (mutation.type === 'childList' && (mutation.target.classList.contains('rowLayoutContainer') || mutation.target.classList.contains('matrixLayoutContainer') || mutation.target.classList.contains('preview') || mutation.target instanceof HTMLTableSectionElement)) {
                            this.emitUpdate();
                        }
                    }
                });

                observer.observe(element, { childList: true, subtree: true });
            });
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
};

</script>
