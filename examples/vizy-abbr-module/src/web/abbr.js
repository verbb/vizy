/**
 * Sample TipTap mark — Abbreviation.
 * Module id must match PHP Extensions `module` => acme/mark/abbr
 */
(function () {
    function register() {
        if (!window.Craft || !Craft.Vizy || !Craft.Vizy.registerModule) {
            return;
        }

        var core = Craft.Vizy.tiptap.core;
        var Mark = core.Mark;
        var mergeAttributes = core.mergeAttributes;

        var Abbr = Mark.create({
            name: 'abbr',
            parseHTML: function () {
                return [{ tag: 'abbr' }];
            },
            renderHTML: function (_ref) {
                var HTMLAttributes = _ref.HTMLAttributes;
                return ['abbr', mergeAttributes(HTMLAttributes), 0];
            },
            addCommands: function () {
                var self = this;
                return {
                    toggleAbbr: function () {
                        return function (_ref2) {
                            var commands = _ref2.commands;
                            return commands.toggleMark(self.name);
                        };
                    },
                };
            },
        });

        Craft.Vizy.registerModule('acme/mark/abbr', function () {
            return Abbr;
        });
    }

    if (window.Craft && Craft.Vizy && Craft.Vizy.registerModule) {
        register();
    } else {
        document.addEventListener('vizy:register', register);
    }
})();
