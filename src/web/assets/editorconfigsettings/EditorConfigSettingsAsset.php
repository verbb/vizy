<?php
namespace verbb\vizy\web\assets\editorconfigsettings;

use verbb\vizy\helpers\ViteManifest;
use verbb\vizy\web\assets\cp\VizyCpAsset;

use craft\web\AssetBundle;
use craft\web\View;

class EditorConfigSettingsAsset extends AssetBundle
{
    // Public Methods
    // =========================================================================

    public function init(): void
    {
        $this->sourcePath = dirname(__DIR__) . '/field/dist/';

        $assets = ViteManifest::assets(
            $this->sourcePath . 'manifest.json',
            'editorconfigsettings/src/ts/editor-config-settings.ts',
        );

        $this->js = [$assets['js']];
        $this->css = $assets['css'];
        $this->jsOptions = ['type' => 'module'];

        $this->depends = [
            VizyCpAsset::class,
        ];

        parent::init();
    }

    public function registerAssetFiles($view): void
    {
        parent::registerAssetFiles($view);

        if ($view instanceof View) {
            // Kept in step with the `t('vizy', …)` calls in the builder's TypeScript;
            // a string missing here reaches the browser untranslated.
            $view->registerTranslations('vizy', [
                'A small toolbar that appears over selected text, for formatting without reaching for the toolbar.',
                'Advanced',
                'Additional Behaviours',
                'Add controls to the Toolbar or Bubble Menu to customise their icons.',
                'All',
                'Available buttons',
                'Available items',
                'Block Insertion',
                'Blocks and objects',
                'Bubble Menu',
                'Bubble Menu preview',
                'Configuration JSON',
                'Content Schema',
                'Controls',
                'Choose a control to replace its icon. Clear the icon to restore Vizy’s default.',
                'Choose an icon for {label}',
                'Character limit',
                'Custom',
                'Default',
                'Default font',
                'Drag items here.',
                'Drag or click toolbar items to add them to the editor.',
                'Edit the Editor Config directly as JSON, or copy it into config/vizy/{id}.json to create a file-based config.',
                'Editor Experience',
                'Enable Slash Command',
                'Everything is in the Bubble Menu.',
                'Everything is in the toolbar.',
                'Extensions that change editing behaviour without adding content or a toolbar control.',
                'Heading levels',
                'Inline formatting',
                'Icon for {label}',
                'Icons',
                '{count} custom icon',
                '{count} custom icons',
                'Invalid JSON',
                'Leave blank to show the character and word counts without setting a limit.',
                'Nothing in this dropdown can render, so it won’t appear.',
                'No icons match your query.',
                'Search icons',
                'Placeholder text',
                'Replace straight quotes, three dots, and double hyphens with typographic characters as authors type.',
                'Show Bubble Menu',
                'Show Character Count',
                'Show Gutter Button',
                'Show live character and word totals below the editor.',
                'Show Placeholder',
                'Show prompt text while the editor is empty.',
                'Smart Typography',
                'Whether to show a + button in the gutter (to the side) of each block to open the Add Block palette.',
                'The nodes and marks this editor understands. It governs pasted and imported content as well as the toolbar, so a content type can be allowed without being given a button — which is how existing formatting is preserved without authors being offered more of it.',
                'Toolbar',
                'Toolbar preview',
                'Whether to enable the / shortcut on a blank line to open the Add Block palette.',
                'Use default icon',
                'Uses Vizy’s icon catalogue and SVG files from the configured icons path.',
                'Visual',
                '{allowed} of {total} content types allowed',
                '{label} (not allowed by this config)',
                '{label} (not available yet)',
                '{label} (switched off)',
                // 'Available dropdowns' and 'Every dropdown is in the toolbar.' went when the two
                // palettes became one row. 'Available buttons' stays: the Bubble Menu's palette
                // really does hold nothing but buttons.
                //
                // 'Remove from toolbar' and 'Remove from Bubble Menu' went with the selection panel
                // that hosted them, and the paragraph of rules that replaced the panel has since
                // come back down to one line. Removal is a drag out or the Delete key; neither is
                // named on screen now, the first needing no telling and the second belonging in the
                // docs rather than above a panel meant to be experimented with.
            ]);
        }
    }
}
