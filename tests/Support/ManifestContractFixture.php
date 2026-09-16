<?php

namespace Tests\Support;

use Craft;
use ReflectionProperty;
use verbb\vizy\fields\VizyField;
use verbb\vizy\services\BlockTypes;
use verbb\vizy\Vizy;

final class ManifestContractFixture
{
    public static function build(): array
    {
        $plugin = Vizy::$plugin;
        $originalTypes = $plugin->getBlockTypes();
        $types = new BlockTypes();
        // Supply an empty catalogue as the fixture input. Do not remove global
        // Project Config or let unrelated tests' Block Types enter this contract.
        (new ReflectionProperty($types, 'all'))->setValue($types, []);
        $plugin->set('blockTypes', $types);
        $configs = $plugin->getEditorConfigs();
        $id = 'test-contract';
        $configs->saveConfig($id, [
            'label' => 'Contract',
            'capabilities' => ['nodes' => ['heading', 'bulletList'], 'marks' => ['bold', 'italic']],
            'headings' => ['levels' => [2, 3]],
            'toolbar' => ['bold', 'italic'],
            'bubble' => ['enabled' => true, 'items' => ['bold']],
        ]);
        try {
            $plugin->getExtensions()->reset();
            $plugin->getEditorManifests()->invalidate();
            $manifest = $plugin->getEditorManifests()->build(new VizyField([
                'uid' => '11111111-1111-4111-8111-111111111111',
                'name' => 'Contract', 'handle' => 'contractBody',
                'editorConfig' => $id, 'blockTypePickerGroups' => [],
            ]));
            // Only the correlation token is request-local. All content hashes,
            // controls, modules and schema properties must match the fixture.
            $manifest['uid'] = '<request-local-uuid>';
            return $manifest;
        } finally {
            $plugin->set('blockTypes', $originalTypes);
            $configs->removeConfig($id);
            $plugin->getEditorManifests()->invalidate();
        }
    }
}
