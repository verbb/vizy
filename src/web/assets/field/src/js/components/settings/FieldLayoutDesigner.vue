<template>
    <div ref="fld-container" class="vui-block-editor-layout">
        <div class="vui-workspace">
            <div v-if="loading" class="vui-loading-pane">
                <div class="vui-loading fui-loading-lg"></div>
            </div>

            <div v-if="error" class="vui-error-pane error">
                <div class="vui-error-content">
                    <span data-icon="alert"></span>

                    <span class="error" v-html="errorMessage"></span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'FieldLayoutDesigner',

    props: {
        layoutUid: {
            type: String,
            default: null,
        },

        fieldId: {
            type: [String, Number],
            default: null,
        },

        blockTypeId: {
            type: [String, Number],
            default: null,
        },

        modelValue: {
            type: [Object, Array, String],
            default: () => {},
        },
    },

    emits: ['update:modelValue'],

    data() {
        return {
            error: false,
            errorMessage: '',
            loading: false,
            mounted: false,
            proxyValue: {},
        };
    },

    watch: {
        proxyValue(newValue) {
            this.$emit('update:modelValue', newValue);
        },
    },

    created() {
        this.proxyValue = this.modelValue;
    },

    mounted() {
        this.loading = true;

        const fieldIds = [];

        if (this.fieldId) {
            fieldIds.push(this.fieldId);
        }

        // When being used in Matrix
        const regex = /fields\/edit\/(\d*)$/g;
        const result = regex.exec(window.location.href);

        if (result && result[1]) {
            fieldIds.push(result[1]);
        }

        const data = {
            fieldIds,
            layoutUid: this.layoutUid,
            blockTypeId: this.blockTypeId,
            layout: this.proxyValue,
        };

        Craft.sendActionRequest('POST', 'vizy/field/layout-designer', { data })
            .then((response) => {
                if (response.data.html) {
                    this.$el.innerHTML = response.data.html;
                    Craft.appendBodyHtml(response.data.footHtml);

                    this.watchForChanges();

                    this.mounted = true;
                } else {
                    throw new Error(response.data);
                }
            })
            .catch((error) => {
                this.error = true;
                this.errorMessage = error;
                this.loading = false;
            });
    },

    methods: {
        watchForChanges() {
            // Watch the hidden input for value changes, we should update on our end too
            const target = this.$el.querySelector('input[name="fieldLayout"]');

            const observer = new MutationObserver((mutationsList, observer) => {
                for (const mutation of mutationsList) {
                    // Check if the value of the input has changed
                    if (mutation.type === 'attributes' && mutation.attributeName === 'value') {
                        this.proxyValue = mutation.target.value;
                    }
                }
            });

            observer.observe(target, { attributes: true, attributeFilter: ['value'] });
        },
    },
};

</script>
