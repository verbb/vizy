import { isNodeEmpty } from '@tiptap/core';
import { Plugin, PluginKey } from 'prosemirror-state';

class Menu {
    constructor({ options, editorView }) {
        this.options = {
            ...{
                element: null,
                onUpdate: () => { return false; },
            },
            ...options,
        };

        this.preventHide = false;
        this.editorView = editorView;
        this.isActive = false;
        this.top = 0;
        this.behaviour = this.options.editor.vizyField.settings.blockTypeBehaviour;

        if (this.behaviour === 'click') {
            this.options.element.addEventListener('mousedown', this.mousedownHandler.bind(this), { capture: true });
            this.options.editor.on('focus', this.focusHandler.bind(this));
            this.options.editor.on('blur', this.blurHandler.bind(this));
            this.options.editor.on('resize', this.resizeHandler.bind(this));
        }

        if (this.behaviour === 'hover') {
            this.options.editor.view.dom.addEventListener('mousemove', this.mouseenterHandler.bind(this));
            this.options.editor.view.dom.addEventListener('mouseleave', this.mouseleaveHandler.bind(this));
        }
    }

    mouseenterHandler(e) {
        const { view } = this.options.editor;
        const pos = view.posAtCoords({ left: e.clientX, top: e.clientY });

        if (pos.pos && pos.inside > -1) {
            const position = pos.pos;
            const node = view.state.doc.resolve(position).parent;

            if (isNodeEmpty(node)) {
                setTimeout(() => {
                    const parent = this.options.element.offsetParent;

                    if (parent) {
                        const parentBox = parent.getBoundingClientRect();
                        const cursorCoords = view.coordsAtPos(position);
                        const top = cursorCoords.top - parentBox.top;

                        this.isActive = true;
                        this.top = top;

                        this.sendUpdate();
                    }
                }, 10);
            } else {
                this.hide();
            }
        }
    }

    mouseleaveHandler(event) {
        // Don't close when hovering over the button (technically "out")
        if (event.relatedTarget && event.relatedTarget.classList.contains('vui-editor-insert-btn')) {
            return;
        }

        this.hide();
    }

    mousedownHandler() {
        this.preventHide = true;
    }

    focusHandler() {
        this.update(this.options.editor.view);
    }

    blurHandler(event) {
        if (this.preventHide) {
            this.preventHide = false;
            return;
        }

        this.hide(event);
    }

    resizeHandler() {
        if (this.isActive) {
            this.update(this.options.editor.view);
        }
    }

    isNodeEmpty($node) {
        const nodeJson = $node.toJSON();

        // Roll our own version of `isNodeEmpty` to handle text alignment and a few other cases.
        // We just check if the current node has no inner content.
        if (!nodeJson.content) {
            return true;
        }

        return false;
    }

    update(view, oldState) {
        const { state, composing } = view;
        const { doc, selection } = state;
        const isSame = oldState && oldState.doc.eq(doc) && oldState.selection.eq(selection);

        if (composing || isSame) {
            return;
        }

        const { $anchor, anchor, empty } = selection;
        const parent = this.options.element.offsetParent;
        const isRootDepth = $anchor.depth === 1;
        const isDefaultNodeType = $anchor.parent.type === state.doc.type.contentMatch.defaultType;
        const isDefaultNodeEmpty = this.isNodeEmpty(selection.$anchor.parent);
        const isActive = isRootDepth && isDefaultNodeType && isDefaultNodeEmpty;

        if (!empty || !parent || !isActive) {
            this.hide();

            return;
        }

        // Give it a sec for the UI to catch up with newly added blocks
        setTimeout(() => {
            const parentBox = parent.getBoundingClientRect();
            const cursorCoords = view.coordsAtPos(anchor);
            const top = cursorCoords.top - parentBox.top;

            this.isActive = true;
            this.top = top;

            this.sendUpdate();
        }, 10);
    }

    sendUpdate() {
        this.options.onUpdate({
            isActive: this.isActive,
            top: this.top,
        });
    }

    hide(event) {
        if (event && event.relatedTarget && this.options.element.parentNode && this.options.element.parentNode.contains(event.relatedTarget)) {
            return;
        }

        this.isActive = false;
        this.sendUpdate();
    }

    destroy() {
        if (this.behaviour === 'click') {
            this.options.element.removeEventListener('mousedown', this.mousedownHandler);
            this.options.editor.off('focus', this.focusHandler);
            this.options.editor.off('blur', this.blurHandler);
            this.options.editor.off('resize', this.resizeHandler);
        }

        if (this.behaviour === 'hover') {
            this.options.editor.view.dom.removeEventListener('mousemove', this.mouseenterHandler);
            this.options.editor.view.dom.removeEventListener('mouseleave', this.mouseleaveHandler);
        }
    }

}

export default function(options) {
    return new Plugin({
        key: new PluginKey('floatingMenu'),
        view(editorView) {
            return new Menu({ editorView, options });
        },
    });
}
