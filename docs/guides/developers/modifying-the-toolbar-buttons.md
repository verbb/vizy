# Modifying the Toolbar Buttons

What appears on a Vizy field’s toolbar — and in what order — comes from that
field’s **Editor Config**. Change the config, and the toolbar follows.

Open **Settings → Vizy → Editor Configs**, or edit a file under
`config/vizy/{id}.json`. Add or remove control ids in `toolbar` and in
dropdowns such as `dropdowns.formatting`, and make sure the matching
capabilities are enabled so those controls are allowed for the field. See
[Configuration](docs:get-started/configuration) and
[Editor Configs](docs:feature-tour/editor-configs).

A typical file fragment looks like this:

```json
{
    "toolbar": [
        "dropdown:formatting",
        "bold",
        "italic",
        "link"
    ],
    "dropdowns": {
        "formatting": ["heading2", "heading3", "paragraph", "blockquote"]
    }
}
```

After saving the config, open an entry using a field assigned to it. Check that Formatting, Bold, Italic, and Link appear in that order, and that Formatting contains the choices shown above. If a control is missing, confirm that its corresponding content capability is enabled in the config. The JSON above is a fragment; keep the other settings already in your config.

## Going Further Than Placement

If you need a brand-new TipTap mark or node (and a button for it), follow
[Creating a Custom Mark from Scratch](docs:guides/developers/creating-a-custom-mark-from-scratch)
or
[Creating a Custom Node from Scratch](docs:guides/developers/creating-a-custom-node-from-scratch).

When a control already exists but should run custom behaviour — a dialog,
multi-step flow, and similar — register a runner:

```js
Craft.Vizy.registerControl('abbr', {
    run: (editor) => editor.chain().focus().toggleMark('abbr').run(),
    isActive: (editor) => editor.isActive('abbr'),
});
```

To tweak a core TipTap extension the field already loaded, use
`Craft.Vizy.replaceModule('heading', ({ extension }) => …)`. To add another named
dropdown of existing controls, listen for
`Extensions::EVENT_REGISTER_TOOLBAR_DROPDOWNS`.

Use the named Editor Config to choose which controls editors see. Register a custom control when its action needs different behaviour, then place that control’s ID in the config.

## Removing a Built-in Button

Leave it out of every Editor Config’s `toolbar` and dropdown members. A plugin
can’t silently strip a core control from all fields without touching those
configs — though you can still replace how a control behaves with
`registerControl` if you only need different behaviour.
