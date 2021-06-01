<script>
import FloatingMenu from './FloatingMenu';

export default {
    props: {
        editor: {
            type: Object,
            default: null,
        },
    },

    data() {
        return {
            menu: {
                isActive: false,
                left: 0,
                bottom: 0,
            },
        };
    },

    watch: {
        editor: {
            immediate: true,
            handler(editor) {
                if (editor) {
                    this.$nextTick(() => {
                        editor.registerPlugin(FloatingMenu({
                            editor,
                            element: this.$el,
                            onUpdate: menu => {
                                // the second check ensures event is fired only once
                                if (menu.isActive && this.menu.isActive === false) {
                                    this.$emit('show', menu);
                                } else if (!menu.isActive && this.menu.isActive === true) {
                                    this.$emit('hide', menu);
                                }
                                
                                this.menu = menu;
                            },
                        }));
                    });
                }
            },
        },
    },

    beforeDestroy() {
        // this.editor.unregisterPlugin('floatingMenu');
    },

    render() {
        if (!this.editor) {
            return null;
        }

        return this.$scopedSlots.default({
            focused: this.editor.view.focused,
            focus: this.editor.focus,
            commands: this.editor.commands,
            isActive: this.editor.isActive,
            getMarkAttrs: this.editor.getAttributes.bind(this.editor),
            getNodeAttrs: this.editor.getNodeAttributes.bind(this.editor),
            menu: this.menu,
        });
    },

};

</script>
