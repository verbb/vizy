import { Plugin, PluginKey } from 'prosemirror-state';
import { mergeAttributes } from '@tiptap/core';
import Link from '@tiptap/extension-link';

export default Link.extend({
    addOptions() {
        return {
            ...this.parent?.(),

            // Reset the default attributes to not assume `target="_blank"`
            HTMLAttributes: {
                target: null,
                rel: null,
                class: null,
            },
        };
    },
  
    renderHTML({ HTMLAttributes }) {
        const attrs = mergeAttributes(this.options.HTMLAttributes, HTMLAttributes);

        // Only output `rel` if setting a target
        if (attrs.target === '_blank') {
            attrs.rel = 'noopener noreferrer';
        }
        
        return ['a', attrs, 0];
    },
      
    addProseMirrorPlugins() {
        return [
            new Plugin({
                key: new PluginKey('handleClick'),
                props: {
                    handleClick: (view, pos, event) => {
                        const attrs = this.editor.getAttributes('link');

                        // Raise a custom event so we can action this elsewhere. Notably, opening
                        // up a menu bubble in a Vue component, for max convenience
                        if (attrs.href && event.target instanceof HTMLAnchorElement) {
                            // Give it a second to resolve the cursor before raising the event.
                            // Otherwise tippy can freak out with positioning.
                            setTimeout(() => {
                                this.editor.emit('vui:link-clicked');
                            }, 50);

                            return true;
                        }
                    },
                },
            }),
        ];
    },
});
