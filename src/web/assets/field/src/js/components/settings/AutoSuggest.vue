<template>
    <vue-autosuggest
        :suggestions="filteredOptions"
        :get-suggestion-value="getSuggestionValue"
        :input-props="inputProps"
        :limit="limit"
        :component-attr-id-autosuggest="id"
        @input="onInput"
        @selected="onSelected"
        @focus="updateFilteredOptions"
        @blur="onBlur"
    >
        <template slot-scope="{suggestion}">
            {{ suggestion.item.name || suggestion.item }}
            <span v-if="suggestion.item.hint" class="light">– {{ suggestion.item.hint }}</span>
        </template>
    </vue-autosuggest>
</template>

<script>
import { VueAutosuggest } from 'vue-autosuggest';

export default {
    name: 'AutoSuggest',

    components: {
        VueAutosuggest,
    },

    props: {
        id: {
            type: String,
            default: '',
        },

        suggestions: {
            type: [Object, Array],
            default: () => [],
        },

        value: {
            type: String,
            default: '',
        },
    },

    data() {
        return {
            query: '',
            selected: '',
            filteredOptions: [],
            inputProps: {
                class: 'text fullwidth',
                onInputChange: this.onInputChange,
                initialValue: this.value,
                style: '',
                id: this.id,
                name: this.id,
                size: '',
                maxlength: '',
                autofocus: false,
                disabled: false,
                title: '',
                placeholder: '',
            },
            limit: 5,
        };
    },

    methods: {
        onInputChange(q) {
            this.query = (q || '').toLowerCase();
            this.updateFilteredOptions();
        },

        onInput(e) {
            // Allow blank input to trigger an update
            if (!e.target.value) {
                this.$emit('input', '');
            }
        },

        updateFilteredOptions() {
            if (this.query === '') {
                this.filteredOptions = this.suggestions;
                return;
            }

            var filtered = [];
            var i, j, sectionFilter, item, name;

            for (i = 0; i < this.suggestions.length; i++) {
                sectionFilter = [];

                for (j = 0; j < this.suggestions[i].data.length; j++) {
                    item = this.suggestions[i].data[j];

                    if (
                        (item.name || item).toLowerCase().indexOf(this.query) !== -1 ||
                        (item.hint && item.hint.toLowerCase().indexOf(this.query) !== -1)
                    ) {
                        sectionFilter.push(item.name ? item : { name: item });
                    }
                }

                if (sectionFilter.length) {
                    sectionFilter.sort((a, b) => {
                        var scoreA = this.scoreItem(a, this.query);
                        var scoreB = this.scoreItem(b, this.query);

                        if (scoreA === scoreB) {
                            return 0;
                        }

                        return scoreA < scoreB ? 1 : -1;
                    });

                    filtered.push({
                        label: this.suggestions[i].label || null,
                        data: sectionFilter.slice(0, this.limit),
                    });
                }
            }

            this.filteredOptions = filtered;
        },

        scoreItem(item) {
            var score = 0;

            if (item.name.toLowerCase().indexOf(this.query) !== -1) {
                score += 100 + this.query.length / item.name.length;
            }

            if (item.hint && item.hint.toLowerCase().indexOf(this.query) !== -1) {
                score += this.query.length / item.hint.length;
            }

            return score;
        },

        onSelected(option) {
            this.selected = option.item;
            this.$emit('input', option.item.name);

            // Bring focus back to the input if they selected an alias
            if (option.item.name[0] == '@') {
                var input = this.$el.querySelector('input');

                input.focus();
                input.selectionStart = input.selectionEnd = input.value.length;
            }
        },

        getSuggestionValue(suggestion) {
            return suggestion.item.name || suggestion.item;
        },

        onBlur(e) {
            // Clear out the autosuggestions if the focus has shifted to a new element
            if (e.relatedTarget) {
                this.filteredOptions = [];
            }
        },
    },
};

</script>
