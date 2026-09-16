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
                'Advanced configuration JSON',
                'All',
                'Available buttons',
                'Available items',
                'Behaviour extensions',
                'Block insertion',
                'Blocks and objects',
                'Bubble Menu',
                'Bubble Menu preview',
                'Content schema',
                'Drag items here.',
                'Drag toolbar items into the editor.',
                'Enable slash Add shortcut',
                'Everything is in the Bubble Menu.',
                'Everything is in the toolbar.',
                'Heading levels',
                'Inline formatting',
                'Invalid JSON',
                'Nothing in this dropdown can render, so it won’t appear.',
                'Show a Bubble Menu on selection',
                'Show gutter Add button',
                'The + chip beside each block. Independent of the toolbar Add Block control.',
                'The nodes, marks, and behaviour extensions this editor understands. It governs pasted and imported content as well as the toolbar, so a content type can be allowed without being given a button — which is how existing formatting is preserved without authors being offered more of it.',
                'TipTap modules that change editing behaviour without adding a document type. Enable them here so their JavaScript loads with this config.',
                'Toolbar',
                'Toolbar preview',
                'Typing / on a blank line opens the same Add Block palette as the gutter.',
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
