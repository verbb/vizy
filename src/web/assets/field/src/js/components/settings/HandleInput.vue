<template>
    <input
        id="id"
        v-model="proxyValue"
        type="text"
        class="text fullwidth code"
        autocomplete="off"
        autocorrect="off"
        autocapitalize="off"
    >
</template>

<script>
import { generateHandle, getNextAvailableHandle } from '@utils/string';

export default {
    name: 'HandleInput',

    props: {
        id: {
            type: String,
            default: '',
        },

        sourceValue: {
            type: String,
            default: '',
        },

        collection: {
            type: Array,
            default: () => [],
        },

        value: {
            type: String,
            default: '',
        },
    },

    data() {
        return {
            savedValue: '',
            proxyValue: '',
        };
    },

    watch: {
        sourceValue(newValue) {
            // We only care when there's not a handle set
            if (this.savedValue === '') {
                this.generateHandle();
            }
        },

        proxyValue(newValue) {
            this.$emit('input', newValue);
        },
    },

    created() {
        // Save the original, persisted value for the handle, so we can see if we should
        // be updating with a generating handle or not
        this.savedValue = this.value;
        this.proxyValue = this.value;
    },

    methods: {
        generateHandle(e) {
            var generatedHandle = generateHandle(this.sourceValue);

            if (this.collection.length) {
                generatedHandle = getNextAvailableHandle(this.collection, generatedHandle, 0);
            }

            this.proxyValue = generatedHandle;
        },
    },
};

</script>
