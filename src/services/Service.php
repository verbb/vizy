<?php
namespace verbb\vizy\services;

use verbb\vizy\fields\VizyField;
use verbb\vizy\models\BlockType;

use Craft;
use craft\base\Component;
use craft\db\Query;
use craft\db\Table;
use craft\events\ConfigEvent;
use craft\helpers\ArrayHelper;
use craft\helpers\ProjectConfig as ProjectConfigHelper;
use craft\models\FieldLayout;

class Service extends Component
{
    // Properties
    // =========================================================================

    private array $_layoutsByUid = [];


    // Public Methods
    // =========================================================================

    public function getFieldLayoutByUid($layoutUid): ?FieldLayout
    {
        if ($this->_layoutsByUid !== null && array_key_exists($layoutUid, $this->_layoutsByUid)) {
            return $this->_layoutsByUid[$layoutUid];
        }

        $result = (new Query)
            ->select([
                'id',
                'type',
                'uid',
            ])
            ->from([Table::FIELDLAYOUTS])
            ->where(['dateDeleted' => null, 'uid' => $layoutUid])
            ->one();

        return $this->_layoutsByUid[$layoutUid] = $result ? new FieldLayout($result) : null;
    }

    public function getAllBlockTypes(): array
    {
        $blockTypes = [];

        foreach (Craft::$app->getFields()->getAllFields(false) as $field) {
            if ($field instanceof VizyField) {
                // Create multidimensional array for performance
                $blockTypes[] = $field->getBlockTypes();
            }
        }

        // Flatten multidimensional array
        return array_merge(...$blockTypes);
    }

    public function handleChangedField(ConfigEvent $event): void
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

    public function saveField($fieldData, $event = null): void
    {
        $fieldsService = Craft::$app->getFields();

        // Make sure the fields have been synced
        ProjectConfigHelper::ensureAllFieldsProcessed();

        // Ensure we update all field layouts, for each blocktype
        foreach ($fieldData as $group) {
            $blockTypes = $group['blockTypes'] ?? [];

            foreach ($blockTypes as $blockType) {
                $layoutUid = $blockType['layoutUid'] ?? '';
                $layoutConfig = $blockType['layoutConfig'] ?? [];

                if (!$layoutUid || !$layoutConfig) {
                    continue;
                }

                $fieldLayout = FieldLayout::createFromConfig($layoutConfig);
                // $fieldLayout->id = $record->fieldLayoutId;
                $fieldLayout->type = BlockType::class;
                $fieldLayout->uid = $layoutUid;

                $fieldsService->saveLayout($fieldLayout);
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
            $blocks = $group['blockTypes'] ?? [];

            if ($hasGroup) {
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

    public function handleDeletedField(ConfigEvent $event): void
    {
        $data = $event->oldValue ?? [];

        $fieldsService = Craft::$app->getFields();

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

        foreach ($fieldData as $group) {
            $blockTypes = $group['blockTypes'] ?? [];

            foreach ($blockTypes as $blockType) {
                $layoutUid = $blockType['layoutUid'] ?? '';

                // Add an extra check in here to ensure the layout exists, before deleting it. Deleting via ID may throw an error
                // if the field layout doesn't exist.
                if ($layout = $this->getFieldLayoutByUid($layoutUid)) {
                    $fieldsService->deleteLayout($layout);
                }
            }
        }
    }

    public function handleChangedBlockType(ConfigEvent $event): void
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

    public function handleDeletedBlockType(ConfigEvent $event): void
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
