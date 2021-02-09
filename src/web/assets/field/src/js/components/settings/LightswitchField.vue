<template>
    <div
        :id="id"
        ref="container"
        tabindex="0"
        role="checkbox"
        class="lightswitch"
        :class="[{
            on: toBoolean(proxyValue),
            indeterminate: indeterminate,
            dragging: dragging,
            small: small,
            'extra-small': extraSmall,
        }]"
        :aria-labelledby="`${id}-label`"
        :aria-checked="proxyValue ? 'true' : (indeterminate ? 'mixed' : 'false')"
        v-on="$listeners"
        @mouseup="onMouseUp"
        @keydown="onKeyDown"
    >
        <div ref="innerContainer" class="lightswitch-container">
            <div class="handle"></div>
        </div>

        <input v-model="proxyValue" type="hidden">
    </div>
</template>

<script>
import { toBoolean } from '@utils/bool';

// import FormulateInputMixin from '@braid/vue-formulate/src/FormulateInputMixin';

export default {
    name: 'LightswitchField',

    // mixins: [FormulateInputMixin],

    props: {
        small: {
            type: Boolean,
            default: false,
        },
        
        extraSmall: {
            type: Boolean,
            default: false,
        },

        indeterminate: {
            type: Boolean,
            default: false,
        },

        value: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            id: `lightswitch-${Craft.randomString(10)}`,
            dragger: null,
            dragging: false,
            innerStyle: {},
            proxyValue: false,
        };
    },

    computed: {
        // localClasses() {
        //     return this.context.attributes.classes;
        // },

        offMargin() {
            if (this.small) {
                return -10;
            }

            return -12;
        },
    },
  
    watch: {
        proxyValue(newValue) {
            this.$emit('input', newValue);
        },
    },

    created() {
        this.proxyValue = this.value;
    },

    mounted() {
        const { container } = this.$refs;

        this.$nextTick(() => {
            const lightswitch = $(container).data('lightswitch');
            if (lightswitch) {
                lightswitch.destroy();
            }

            this.dragger = new Garnish.BaseDrag(container, {
                axis: Garnish.X_AXIS,
                ignoreHandleSelector: null,
                onDragStart: this.onDragStart.bind(this),
                onDrag: this.onDrag.bind(this),
                onDragStop: this.onDragStop.bind(this),
            });
        });
    },

    beforeDestroy() {
        if (this.dragger) {
            this.dragger.destroy();
        }
    },

    methods: {
        turnOn() {
            this.proxyValue = true;
            this.indeterminate = false;
            this.dragging = true;

            const { innerContainer } = this.$refs;
            const animateCss = {
                [`margin-${Craft.left}`]: 0,
            };

            $(innerContainer).velocity('stop').velocity(animateCss, Craft.LightSwitch.animationDuration, this.onSettle.bind(this));
        },

        turnOff() {
            this.proxyValue = false;
            this.indeterminate = false;
            this.dragging = true;

            const { innerContainer } = this.$refs;
            const animateCss = {
                [`margin-${Craft.left}`]: this.offMargin,
            };

            $(innerContainer).velocity('stop').velocity(animateCss, Craft.LightSwitch.animationDuration, this.onSettle.bind(this));
        },

        toggle() {
            if (this.indeterminate || !this.proxyValue) {
                this.turnOn();
            } else {
                this.turnOff();
            }
        },

        onMouseUp() {
            // Was this a click?
            if (!this.dragger.dragging) {
                this.toggle();
            }
        },

        onKeyDown(event) {
            switch (event.keyCode) {
            case Garnish.SPACE_KEY: {
                this.toggle();
                event.preventDefault();
                break;
            }
            case Garnish.RIGHT_KEY: {
                if (Craft.orientation === 'ltr') {
                    this.turnOn();
                }
                else {
                    this.turnOff();
                }

                event.preventDefault();
                break;
            }
            case Garnish.LEFT_KEY: {
                if (Craft.orientation === 'ltr') {
                    this.turnOff();
                }
                else {
                    this.turnOn();
                }

                event.preventDefault();
                break;
            }
            }
        },

        onDragStart() {
            this.dragging = true;
            this.dragStartMargin = this.getMargin();
        },

        onDrag() {
            let margin;

            if (Craft.orientation === 'ltr') {
                margin = this.dragStartMargin + this.dragger.mouseDistX;
            } else {
                margin = this.dragStartMargin - this.dragger.mouseDistX;
            }

            if (margin < this.offMargin) {
                margin = this.offMargin;
            } else if (margin > 0) {
                margin = 0;
            }

            const { innerContainer } = this.$refs;
            $(innerContainer).css(`margin-${Craft.left}`, margin);
        },

        onDragStop() {
            const margin = this.getMargin();

            if (margin > (this.offMargin / 2)) {
                this.turnOn();
            } else {
                this.turnOff();
            }
        },

        onSettle() {
            this.dragging = false;
        },

        getMargin() {
            const { innerContainer } = this.$refs;
            const style = innerContainer.currentStyle || window.getComputedStyle(innerContainer);

            return parseInt(style.marginLeft);
        },

        toBoolean(value) {
            return toBoolean(value);
        },
    },

};

</script>


<style lang="scss">

//
// Extra Small Lightswitch
//

.lightswitch.extra-small {
    border-radius: 7px;
    width: 24px;
    height: 14px;
}

.lightswitch.extra-small .lightswitch-container {
    width: 34px;
}

.lightswitch.extra-small .lightswitch-container .handle {
    border-radius: 8px;
    width: 12px;
    height: 12px;
    left: calc(50% - 4px);
}

.lightswitch.extra-small.on .lightswitch-container .handle {
    left: calc(50% - 6px);
}
</style>
