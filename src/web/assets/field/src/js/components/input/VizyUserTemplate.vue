<script>
import { h, compile } from 'vue';

export default {
    name: 'VizyUserTemplate',

    props: {
        template: {
            type: String,
            default: '',
        },

        vizyField: {
            type: Object,
            default: () => {},
        },
    },

    render() {
        try {
            // Apply our dynamically provided template, rendered via Craft.
            return h(compile(`<div>${this.template}</div>`), {
                editor: this.vizyField.editor,
                vizyField: this.vizyField,
            });
        } catch (e) {
            console.error(e);
            console.log('Vue template compile error: %o', { template: this.template });

            // Fallback whenever there are fatal issues rendering
            const message = this.t('vizy', 'Unable to parse custom template.');

            return h(compile(`<div class="vizyblock-invalid"><p class="error">${message}</p></div>`));
        }

    },
};

</script>
