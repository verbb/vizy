<?php
namespace verbb\vizy\services;

use verbb\vizy\Vizy;
use verbb\vizy\fields\VizyField;
use verbb\vizy\models\BlockType;

use Craft;
use craft\base\Component;
use craft\db\Query;
use craft\db\Table;
use craft\events\ConfigEvent;
use craft\helpers\ArrayHelper;
use craft\helpers\Json;
use craft\helpers\ProjectConfig as ProjectConfigHelper;
use craft\models\FieldLayout;

class Service extends Component
{
    // Public Methods
    // =========================================================================

    public function getFieldLayoutByUid($layoutUid)
    {
        $result = (new Query)
            ->select([
                'id',
                'type',
                'uid'
            ])
            ->from([Table::FIELDLAYOUTS])
            ->where(['uid' => $layoutUid])
            ->one();

        return $result ? new FieldLayout($result) : null;
    }

    public function getAllBlockTypes()
    {
        $blockTypes = [];

        foreach (Craft::$app->getFields()->getAllFields(false) as $field) {
            if ($field instanceof VizyField) {
                $blockTypes = array_merge($blockTypes, $field->getBlockTypes());
            }
        }

        return $blockTypes;
    }

    public function handleChangedField(ConfigEvent $event)
    {
        $data = $event->newValue ?? [];

        if (!is_array($data)) {
            return;
        }

        // This handler fires on every field-change, so we need to ensure this field is a Vizy field.
        // We want to watch for Vizy field changes to update each block type's field layout.
        if ($data['type'] !== VizyField::class) {
            return;
        }

        $fieldData = $data['settings']['fieldData'] ?? [];
        $fieldData = ProjectConfigHelper::unpackAssociativeArrays($fieldData);
        $this->saveField($fieldData, $event);
    }

    public function saveField($fieldData, $event = null)
    {
        $fieldsService = Craft::$app->getFields();
        $projectConfigService = Craft::$app->getProjectConfig();

        // Ensure we update all field layouts, for each blocktype
        foreach ($fieldData as $groupKey => $group) {
            $blockTypes = $group['blockTypes'] ?? [];

            foreach ($blockTypes as $blockTypeKey => $blockType) {
                $layoutUid = $blockType['layoutUid'] ?? '';
                $layoutConfig = $blockType['layoutConfig'] ?? [];

                if (!$layoutUid || !$layoutConfig) {
                    continue;
                }

                if ($layoutConfig !== null) {
                    $fieldLayout = FieldLayout::createFromConfig($layoutConfig);
                    // $fieldLayout->id = $record->fieldLayoutId;
                    $fieldLayout->type = BlockType::class;
                    $fieldLayout->uid = $layoutUid;

                    $fieldsService->saveLayout($fieldLayout);
                }
            }
        }

        // Have we deleted any blocks types? Ensure we clean up any field layouts.
        // First, check if there's any existing (old) data for the field. No need to check for a brand-new field.
        $oldFieldData = $event->oldValue['settings']['fieldData'] ?? [];

        if (!$oldFieldData) {
            return;
        }

        $oldFieldData = ProjectConfigHelper::unpackAssociativeArrays($oldFieldData);

        $layoutsToDelete = [];

        // Check if any block types or groups have been deleted.
        foreach ($oldFieldData as $group) {
            // Is this a deleted group?
            $hasGroup = ArrayHelper::firstWhere($fieldData, 'id', $group['id']);

            if ($hasGroup) {
                $blocks = $group['blockTypes'] ?? [];

                foreach ($blocks as $block) {
                    // Is this a deleted block?
                    $hasBlock = ArrayHelper::firstWhere($hasGroup['blockTypes'], 'id', $block['id']);

                    if (!$hasBlock) {
                        // This block was deleted. Remove any fieldLayout
                        $layoutsToDelete[] = $block['layoutUid'] ?? null;
                    }
                }
            } else {
                // We've deleted an entire group. Delete each block's layout.
                $blocks = $group['blockTypes'] ?? [];

                foreach ($blocks as $block) {
                    $layoutsToDelete[] = $block['layoutUid'] ?? null;
                }
            }
        }

        $layoutsToDelete = array_filter($layoutsToDelete);

        foreach ($layoutsToDelete as $fieldLayoutUid) {
            // Add an extra check in here to ensure the layout exists, before deleting it. Deleting via ID may throw an error
            // if the field layout doesn't exist.
            if ($layout = $this->getFieldLayoutByUid($fieldLayoutUid)) {
                $fieldsService->deleteLayout($layout);
            }
        }
    }

    public function handleDeletedField(ConfigEvent $event)
    {
        $data = $event->oldValue ?? [];

        $fieldsService = Craft::$app->getFields();
        $projectConfigService = Craft::$app->getProjectConfig();

        if (!is_array($data)) {
            return;
        }

        // This handler fires on every field-change, so we need to ensure this field is a Vizy field.
        // We want eo watch for Vizy field changes to update each block type's field layout.
        if ($data['type'] !== VizyField::class) {
            return;
        }

        $fieldData = $data['settings']['fieldData'] ?? [];
        $fieldData = ProjectConfigHelper::unpackAssociativeArrays($fieldData);

        foreach ($fieldData as $groupKey => $group) {
            $blockTypes = $group['blockTypes'] ?? [];

            foreach ($blockTypes as $blockTypeKey => $blockType) {
                $layoutUid = $blockType['layoutUid'] ?? '';
                
                // Add an extra check in here to ensure the layout exists, before deleting it. Deleting via ID may throw an error
                // if the field layout doesn't exist.
                if ($layout = $this->getFieldLayoutByUid($layoutUid)) {
                    $fieldsService->deleteLayout($layout);
                }
            }
        }
    }

    public function handleChangedBlockType(ConfigEvent $event)
    {
        $fields = $event->newValue['fields'] ?? [];

        foreach ($fields as $field) {
            if ($field['type'] === VizyField::class) {
                $configEvent = new ConfigEvent([
                    'newValue' => $field,
                ]);

                // Call the regular event handler with a fake event to prevent duplicate code
                $this->handleChangedField($configEvent);
            }
        }
    }

    public function handleDeletedBlockType(ConfigEvent $event)
    {
        $fields = $event->oldValue['fields'] ?? [];

        foreach ($fields as $field) {
            if ($field['type'] === VizyField::class) {
                $configEvent = new ConfigEvent([
                    'oldValue' => $field,
                ]);

                // Call the regular event handler with a fake event to prevent duplicate code
                $this->handleDeletedField($configEvent);
            }
        }
    }

}
