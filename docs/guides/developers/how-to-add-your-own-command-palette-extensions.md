# How to add your own Command Palette extensions

The Command Palette provides quick and easy access for creating new nodes just by typing `/`. You'll see a popup window that's keyboard-accessible to pick new nodes.

![Vizy's Command Palette to return those seconds back in your day](https://assets.verbb.io/blog/how-to-add-your-own-command-palette-extensions/vizy-command-palette.png)

*Vizy's Command Palette to return those seconds back in your day*

If you're creating a custom [mark](/guides/developers/creating-a-custom-mark-from-scratch) or [node](/guides/developers/creating-a-custom-node-from-scratch) you might like to add support for the Command Palette.

:::tip
Note that not all nodes and marks are available in the Command Palette. This is to mostly not overwhelm users with choice, so be mindful on whether to include it.
:::

```js
document.addEventListener('onVizyConfigReady', (e) => {
    Craft.Vizy.Config.registerCommands((commands) => {
        return [{
            svg: '<svg ... />',
            title: Craft.t('vizy', 'Font Color'),
            commandInfo: { text: 'Primary brand color text.' },
            command: ({ editor, range }) => {
                editor.chain().focus().deleteRange(range).setColor('#958DF1').run();
            },
        }];
    });
});
```

Here, we're adding a "Font Color" command to the Command Palette.

For the `commandInfo` you can either supply a `text` value or a `shortcut` value, if your node supports keyboard shortcuts. For the shortcut value, you can provide the keyboard shortcut exactly as you'd use it in your extension (e.g. `Mod-Alt-c` would render as `⌘` `⌥` `c` on a Mac).

### Managing commands
Much like [buttons](/guides/developers/modifying-the-toolbar-buttons) you can modify or remove commands as required.

```js
Craft.Vizy.Config.registerCommands((commands) => {
    const h1Command = commands.find((command) => command.name === 'h1');

    if (h1Command) {
        h1Command.svg = '<svg ... />';
    }

    const indexOfH3 = commands.findIndex((command) => command.name === 'h3');

    if (indexOfH3 != -1) {
        commands.splice(indexOfH3, 1);
    }
});
```
