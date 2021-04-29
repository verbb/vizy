import { isNodeEmpty } from '@tiptap/core';
import { Plugin, PluginKey } from 'prosemirror-state';

class Menu {
    constructor({ options, editorView }) {
        this.options = {
            ...{
                element: null,
                onUpdate: () => false,
            },
            ...options,
        };

        this.preventHide = false;
        this.editorView = editorView;
        this.isActive = false;
        this.top = 0;

        this.options.element.addEventListener('mousedown', this.mousedownHandler.bind(this), { capture: true });
        this.options.editor.on('focus', this.focusHandler.bind(this));
        this.options.editor.on('blur', this.blurHandler.bind(this));
        this.options.editor.on('resize', this.resizeHandler.bind(this));
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
        const isDefaultNodeEmpty = isNodeEmpty(selection.$anchor.parent);
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
        this.options.element.removeEventListener('mousedown', this.mousedownHandler);
        this.options.editor.off('focus', this.focusHandler);
        this.options.editor.off('blur', this.blurHandler);
        this.options.editor.off('resize', this.resizeHandler);
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
