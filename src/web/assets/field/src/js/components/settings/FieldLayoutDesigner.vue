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
import Vue from 'vue';

/* eslint-disable */
Craft.VizyFieldLayoutDesigner = Craft.FieldLayoutDesigner.extend({
    init: function(container, settings) {
        this.$container = $(container);
        this.setSettings(settings, Craft.FieldLayoutDesigner.defaults);

        let $workspace = this.$container.children('.fld-workspace');
        this.$tabContainer = $workspace.children('.fld-tabs');
        this.$newTabBtn = $workspace.children('.fld-new-tab-btn');
        this.$sidebar = this.$container.children('.fld-sidebar');

        this.$fieldLibrary = this.$selectedLibrary = this.$sidebar.children('.fld-field-library');
        let $fieldSearchContainer = this.$fieldLibrary.children('.search');
        this.$fieldSearch = $fieldSearchContainer.children('input');
        this.$clearFieldSearchBtn = $fieldSearchContainer.children('.clear');
        this.$fieldGroups = this.$sidebar.find('.fld-field-group');
        this.$fields = this.$fieldGroups.children('.fld-element');
        this.$uiLibrary = this.$sidebar.children('.fld-ui-library');
        this.$uiLibraryElements = this.$uiLibrary.children();

        // Set up the layout grids
        this.tabGrid = new Craft.Grid(this.$tabContainer, {
            itemSelector: '.fld-tab',
            minColWidth: 24 * 11,
            fillMode: 'grid',
            snapToGrid: 24
        });

        let $tabs = this.$tabContainer.children();
        for (let i = 0; i < $tabs.length; i++) {
            this.initTab($($tabs[i]));
        }

        // create a placeholder input so *something* gets posted even if there are no tabs/elements
        // CHANGE
        // $('<input/>', {
        //     type: 'hidden',
        //     name: this.settings.elementPlacementInputName.replace('[__TAB_NAME__][]', ''),
        //     value: '',
        // }).insertBefore(this.$container);

        // CHANGE
        this.elementDrag = new Craft.VizyFieldLayoutDesigner.ElementDrag(this);

        if (this.settings.customizableTabs) {
            // CHANGE
            this.tabDrag = new Craft.VizyFieldLayoutDesigner.TabDrag(this);

            this.addListener(this.$newTabBtn, 'activate', 'addTab');
        }

        // Set up the sidebar
        if (this.settings.customizableUi) {
            let $libraryPicker = this.$sidebar.children('.btngroup');
            new Craft.Listbox($libraryPicker, {
                onChange: $selectedOption => {
                    this.$selectedLibrary.addClass('hidden');
                    this.$selectedLibrary = this[`$${$selectedOption.data('library')}Library`]
                        .removeClass('hidden');
                },
            });
        }

        this.addListener(this.$fieldSearch, 'input', () => {
            let val = this.$fieldSearch.val().toLowerCase().replace(/['"]/g, '');
            if (!val) {
                this.$fieldLibrary.find('.filtered').removeClass('filtered');
                this.$clearFieldSearchBtn.addClass('hidden');
                return;
            }

            this.$clearFieldSearchBtn.removeClass('hidden');
            let $matches = this.$fields.filter(`[data-keywords*="${val}"]`)
                .add(this.$fieldGroups.filter(`[data-name*="${val}"]`).children('.fld-element'))
                .removeClass('filtered');
            this.$fields.not($matches).addClass('filtered');

            // hide any groups that don't have any results
            for (let i = 0; i < this.$fieldGroups.length; i++) {
                let $group = this.$fieldGroups.eq(i);
                if ($group.find('.fld-element:not(.hidden):not(.filtered)').length) {
                    $group.removeClass('filtered');
                } else {
                    $group.addClass('filtered');
                }
            }
        });

        this.addListener(this.$fieldSearch, 'keydown', ev => {
            if (ev.keyCode === Garnish.ESC_KEY) {
                this.$fieldSearch.val('').trigger('input');
            }
        });

        // Clear the search when the X button is clicked
        this.addListener(this.$clearFieldSearchBtn, 'click', () => {
            this.$fieldSearch.val('').trigger('input');
        });
    },

    initElement: function($element) {
        new Craft.VizyFieldLayoutDesigner.Element(this, $element);
    },

    renameTab: function($tab) {
        this.base($tab);

        Vue.prototype.$events.$emit('vizy:fldUpdate');
    },

    removeTab: function($tab) {
        this.base($tab);

        Vue.prototype.$events.$emit('vizy:fldUpdate');
    },
});

Craft.VizyFieldLayoutDesigner.TabDrag = Craft.FieldLayoutDesigner.TabDrag.extend({
    onDragStop: function() {
        this.base();

        Vue.prototype.$events.$emit('vizy:fldUpdate');
    },
});

Craft.VizyFieldLayoutDesigner.ElementDrag = Craft.FieldLayoutDesigner.ElementDrag.extend({
    onDragStop: function() {
        this.base();

        Vue.prototype.$events.$emit('vizy:fldUpdate');
    },
});

Craft.VizyFieldLayoutDesigner.Element = Craft.FieldLayoutDesigner.Element.extend({
    initUi: function() {
        // CHANGE
        this.$placementInput = $('<div/>', {
            class: 'placement-input',
            type: 'hidden',
            ref: 'placement-input',
            name: '',
            'data-value': this.key,
        }).appendTo(this.$container);

        this.updatePlacementInput();

        // CHANGE
        this.$configInput = $('<div/>', {
            type: 'hidden',
            ref: 'config-input',
            name: this.designer.settings.elementConfigInputName.replace(/\b__ELEMENT_KEY__\b/g, this.key),
        }).appendTo(this.$container);

        this.updateConfigInput();

        if (this.hasCustomWidth) {
            let widthSlider = new Craft.SlidePicker(this.config.width || 100, {
                min: 25,
                max: 100,
                step: 25,
                valueLabel: width => {
                    return Craft.t('app', '{pct} width', {pct: `${width}%`});
                },
                onChange: width => {
                    this.config.width = width;
                    this.updateConfigInput();
                }
            });
            widthSlider.$container.appendTo(this.$container);
        }

        if (this.hasSettings) {
            this.$editBtn.appendTo(this.$container);
        }
    },

    updatePlacementInput: function() {
        this.base();

        Vue.prototype.$events.$emit('vizy:fldUpdate');
    },

    updateConfigInput: function() {
        this.$configInput.attr('data-value', JSON.stringify(this.config));

        Vue.prototype.$events.$emit('vizy:fldUpdate');
    },
});
/* eslint-enable */

export default {
    name: 'FieldLayoutDesigner',

    props: {
        layoutUid: {
            type: String,
            default: null,
        },

        fieldId: {
            type: String,
            default: null,
        },

        blockTypeId: {
            type: String,
            default: null,
        },

        value: {
            type: [Object, Array],
            default: () => {},
        },
    },

    data() {
        return {
            error: false,
            errorMessage: '',
            loading: false,
            mounted: false,
            proxyValue: {
                elementConfigs: {},
                elementPlacements: {},
            },
        };
    },
  
    watch: {
        proxyValue(newValue) {
            this.$emit('input', newValue);
        },
    },

    created() {
        this.$events.$on('vizy:fldUpdate', this.serializeLayout);

        this.proxyValue = this.value;
    },

    mounted() {
        this.loading = true;

        var fieldIds = [];

        if (this.fieldId) {
            fieldIds.push(this.fieldId);
        }

        // When being used in Matrix
        const regex = /fields\/edit\/(\d*)$/g;
        const result = regex.exec(window.location.href);

        if (result && result[1]) {
            fieldIds.push(result[1]);
        }

        var data = {
            fieldIds,
            layoutUid: this.layoutUid,
            blockTypeId: this.blockTypeId,
            ...this.proxyValue,
        };

        this.$axios.post(Craft.getActionUrl('vizy/field/layout-designer'), data).then((response) => {
            if (response.data.html) {
                this.$el.innerHTML = response.data.html;
                Craft.appendFootHtml(response.data.footHtml);

                this.mounted = true;
            } else {
                throw new Error(response.data);
            }
        }).catch(error => {
            this.error = true;
            this.errorMessage = error;
            this.loading = false;
        });
    },

    methods: {
        getPostData(container) {
            var postData = {},
                arrayInputCounters = {},
                $inputs = $(container).find('[ref]');

            var inputName;

            for (var i = 0; i < $inputs.length; i++) {
                var $input = $inputs.eq(i);

                inputName = $input.attr('name');
                var inputVal = $input.attr('data-value');

                var isArrayInput = (inputName.substr(-2) === '[]');

                if (isArrayInput) {
                    // Get the cropped input name
                    var croppedName = inputName.substring(0, inputName.length - 2);

                    // Prep the input counter
                    if (typeof arrayInputCounters[croppedName] === 'undefined') {
                        arrayInputCounters[croppedName] = 0;
                    }
                }

                if (!Garnish.isArray(inputVal)) {
                    inputVal = [inputVal];
                }

                for (var j = 0; j < inputVal.length; j++) {
                    if (isArrayInput) {
                        inputName = croppedName + '[' + arrayInputCounters[croppedName] + ']';
                        arrayInputCounters[croppedName]++;
                    }

                    postData[inputName] = inputVal[j];
                }
            }

            return postData;
        },

        serializeLayout() {
            // Prevent firing immediately on first render
            if (!this.mounted) {
                return;
            }

            var postData = this.getPostData(this.$el);
            postData = Craft.expandPostArray(postData);

            // The first index will be the blockTypeId to ensure FLD are unique, 
            // we just want the inner info
            this.proxyValue = postData[Object.keys(postData)[0]];
        },
    },
};

</script>
