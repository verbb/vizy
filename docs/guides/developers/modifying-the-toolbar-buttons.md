# Modifying the toolbar buttons

As a refresher, you can [register](/craft-plugins/vizy/user-guides/creating-a-custom-node-from-scratch) your own buttons using `Craft.Vizy.Config.registerButtons()`

```js
document.addEventListener('onVizyConfigReady', (e) => {
    Craft.Vizy.Config.registerButtons((buttons) => {
        return [{
            name: 'my-button',
            svg: '<svg ... />',
            title: Craft.t('vizy', 'My Button'),
            action: (editor) => {  },
            isActive: (editor) => {  },
        }];
    });
});
```

Which is great when you want to add new extensions to do things to Vizy content that doesn't exist at the moment. But did you know you can also modify or remove existing buttons?

### Modifying buttons
Let's say you want to modify the icon of the default "Bold" button, because you've got a better one. You can use the `buttons` parameter to access any of the already-registered buttons.

```js
Craft.Vizy.Config.registerButtons((buttons) => {
    const boldButton = buttons.find((button) => button.name === 'bold');

    if (boldButton) {
        boldButton.svg = '<svg ... />';
    }
});
```

You can also modify anything else about the button, including the label, what action it performs, and more.

You can also do the same thing for dropdown buttons.

```js
Craft.Vizy.Config.registerButtons((buttons) => {
    const formattingButton = buttons.find((button) => button.name === 'formatting');

    if (formattingButton) {
        formattingButton.options.unshift({
            name: 'primary',
            title: Craft.t('vizy', 'Primary'),
            action: (editor) => { return editor.chain().focus().toggleColor('#5A67D8').run(); },
            isActive: (editor) => { return editor.isActive('fontColor', { color: '#5A67D8' }); },
        });
    }
});
```

Here, we're prepending a new button to the formatting dropdown

### Removing buttons
It'd be far easier to remove a button using the editor config - but what if you're writing a plugin to override the default button and you'd like it done automatically? Maybe you have a "Better Bold" button that you want to swap in with the regular "Bold" button.

```js
Craft.Vizy.Config.registerButtons((buttons) => {
    const indexOfBold = buttons.findIndex((button) => button.name === 'bold');

    if (indexOfBold != -1) {
        buttons.splice(indexOfBold, 1);
    }
    
    return [{
        name: 'better-bold',
        svg: '<svg ... />',
        title: Craft.t('vizy', 'Better Bold'),
        action: (editor) => { return editor.chain().focus().toggleBold().run(); },
        isActive: (editor) => { return editor.isActive('better-bold'); },
    }];
});
```
