(function () {
    function register() {
        const { Mark, mergeAttributes } = Craft.Vizy.tiptap.core;

        const Abbr = Mark.create({
            name: 'abbr',
            parseHTML() {
                return [{ tag: 'abbr' }];
            },
            renderHTML({ HTMLAttributes }) {
                return ['abbr', mergeAttributes(HTMLAttributes), 0];
            },
        });

        Craft.Vizy.registerModule('acme/mark/abbr', () => Abbr);
    }

    if (window.Craft?.Vizy?.registerModule) {
        register();
    } else {
        document.addEventListener('vizy:register', register, { once: true });
    }
})();
