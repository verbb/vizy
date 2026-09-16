<?php
namespace verbb\vizy\services;

use verbb\vizy\db\Table;
use verbb\vizy\elements\Block;
use verbb\vizy\models\BlockType;
use verbb\vizy\records\BlockType as BlockTypeRecord;

use Craft;
use craft\base\Component;
use craft\events\ConfigEvent;
use craft\helpers\Json;
use craft\helpers\ProjectConfig as ProjectConfigHelper;
use craft\helpers\StringHelper;
use craft\models\FieldLayout;

use RuntimeException;

final class BlockTypes extends Component
{
    // Static Methods
    // =========================================================================

    /**
     * Depth of `$blockTypeUid` if placed under the given ancestor type chain
     * (root → … → parent). A different type in the chain resets the counter.
     */
    public static function consecutiveSameTypeDepth(array $ancestorTypeUids, string $blockTypeUid): int
    {
        $depth = 1;
        for ($i = count($ancestorTypeUids) - 1; $i >= 0; $i--) {
            if ($ancestorTypeUids[$i] === $blockTypeUid) {
                $depth++;
            } else {
                break;
            }
        }

        return $depth;
    }


    // Constants
    // =========================================================================

    public const PROJECT_CONFIG_PATH = 'plugins.vizy.blockTypes';

    /**
     * Max consecutive same Block Type UID along a parent chain.
     * Self-edges were schema-legal under Content Areas; Hosted nesting may still use this
     * depth cap at insert/drag/save.
     */
    public const SAME_BLOCK_TYPE_MAX_DEPTH = 3;


    // Properties
    // =========================================================================

    private ?array $all = null;
    private array $byId = [];
    private array $byUid = [];
    private array $byHandle = [];
    private array $diagnostics = [];
    private bool $externalPreflightComplete = false;


    // Public Methods
    // =========================================================================

    public function getAllBlockTypes(): array
    {
        if ($this->all !== null) {
            return $this->all;
        }

        $configs = Craft::$app->getProjectConfig()->get(self::PROJECT_CONFIG_PATH) ?? [];
        $records = [];
        if (Craft::$app->getDb()->tableExists(Table::BLOCK_TYPES)) {
            foreach (BlockTypeRecord::find()->all() as $record) {
                $records[$record->uid] = $record;
            }
        }

        $this->all = [];
        foreach ($configs as $uid => $config) {
            if (!is_string($uid) || !is_array($config)) {
                continue;
            }
            $model = BlockType::fromConfig($uid, ProjectConfigHelper::unpackAssociativeArrays($config));
            if (isset($records[$uid])) {
                $model->id = (int)$records[$uid]->id;
                if ($model->getFieldLayout() && $records[$uid]->fieldLayoutId) {
                    $model->getFieldLayout()->id = (int)$records[$uid]->fieldLayoutId;
                }
            }
            $this->all[] = $model;
            if ($model->id) {
                $this->byId[$model->id] = $model;
            }
            $this->byUid[$uid] = $model;
            $this->byHandle[strtolower($model->handle)] = $model;
        }

        usort($this->all, static fn(BlockType $a, BlockType $b) => [$a->name, $a->uid] <=> [$b->name, $b->uid]);
        return $this->all;
    }

    public function getBlockTypeById(?int $id): ?BlockType
    {
        if (!$id) {
            return null;
        }
        $this->getAllBlockTypes();
        return $this->byId[$id] ?? null;
    }

    public function getBlockTypeByUid(?string $uid): ?BlockType
    {
        if (!$uid) {
            return null;
        }
        if (!array_key_exists($uid, $this->byUid)) {
            $this->getAllBlockTypes();
            $this->byUid[$uid] ??= null;
        }
        return $this->byUid[$uid];
    }

    public function getBlockTypeByHandle(?string $handle): ?BlockType
    {
        if (!$handle) {
            return null;
        }
        $key = strtolower($handle);
        if (!array_key_exists($key, $this->byHandle)) {
            $this->getAllBlockTypes();
            $this->byHandle[$key] ??= null;
        }
        return $this->byHandle[$key];
    }

    public function validateBlockType(BlockType $blockType): bool
    {
        $valid = $blockType->validate();
        $candidate = [];
        foreach ($this->getAllBlockTypes() as $existing) {
            $candidate[$existing->uid] = $existing;
        }
        $candidate[$blockType->uid] = $blockType;
        return $this->_validateSchema($candidate, $this->_indexByUid($this->getAllBlockTypes()), $blockType) && $valid;
    }

    public function saveBlockType(BlockType $blockType): bool
    {
        $blockType->uid ??= StringHelper::UUID();
        if ($blockType->handle === '') {
            $blockType->handle = StringHelper::toHandle($blockType->name);
        }
        $layout = $blockType->getFieldLayout();
        if (!$layout) {
            $layout = new FieldLayout(['type' => Block::class, 'uid' => StringHelper::UUID()]);
            $layout->setTabs([]);
            $blockType->setFieldLayout($layout);
        }
        $layout->type = Block::class;
        $layout->uid ??= StringHelper::UUID();

        if (!$this->validateBlockType($blockType)) {
            return false;
        }

        Craft::$app->getProjectConfig()->set(
            self::PROJECT_CONFIG_PATH . '.' . $blockType->uid,
            ProjectConfigHelper::packAssociativeArrays($blockType->toConfig()),
        );
        $this->_resetCache();
        $saved = $this->getBlockTypeByUid($blockType->uid);
        $blockType->id = $saved?->id;
        return true;
    }

    public function duplicateBlockType(BlockType $source, ?string $name = null): BlockType
    {
        $duplicateUid = StringHelper::UUID();
        $config = $source->toConfig();
        $layout = FieldLayout::createFromConfig($config['fieldLayout']);
        $layout->resetUids();

        $duplicate = new BlockType([
            'uid' => $duplicateUid,
            'name' => $name ?: $source->name . ' Copy',
            'handle' => $this->_uniqueHandle($source->handle . 'Copy'),
            'icon' => $source->icon,
            'template' => $source->template,
            'previewImage' => $source->previewImage,
            'color' => $source->color,
        ]);
        $duplicate->setFieldLayout($layout);

        if (!$this->saveBlockType($duplicate)) {
            throw new RuntimeException('Unable to duplicate Vizy Block Type: ' . Json::encode($duplicate->getErrors()));
        }
        return $this->getBlockTypeByUid($duplicateUid) ?? $duplicate;
    }

    public function deleteBlockType(BlockType $blockType, bool $force = false): bool
    {
        $usages = $this->getBlockTypeSchemaUsages((string)$blockType->uid);
        if ($usages !== []) {
            $blockType->addError('uid', 'Block Type is referenced by project schema and cannot be deleted.');
            return false;
        }

        Craft::$app->getProjectConfig()->remove(self::PROJECT_CONFIG_PATH . '.' . $blockType->uid);
        $this->_resetCache();
        return true;
    }

    public function handleChangedBlockType(ConfigEvent $event): void
    {
        $this->_ensureExternalPreflight();
        $uid = $event->tokenMatches[0] ?? null;
        if (!is_string($uid) || !is_array($event->newValue)) {
            return;
        }
        $model = BlockType::fromConfig($uid, ProjectConfigHelper::unpackAssociativeArrays($event->newValue));
        $layout = $model->getFieldLayout();
        if (!$layout) {
            throw new RuntimeException("Block Type {$uid} has no FieldLayout.");
        }
        $layout->type = Block::class;

        $transaction = Craft::$app->getDb()->beginTransaction();
        try {
            if (!Craft::$app->getFields()->saveLayout($layout)) {
                throw new RuntimeException("Unable to synchronize FieldLayout for Block Type {$uid}.");
            }
            $record = BlockTypeRecord::findOne(['uid' => $uid]) ?? new BlockTypeRecord(['uid' => $uid]);
            $record->fieldLayoutId = $layout->id;
            $record->name = $model->name;
            $record->handle = $model->handle;
            $record->icon = Json::encode($model->icon);
            $record->template = $model->template;
            $record->save(false);
            $transaction->commit();
        } catch (\Throwable $exception) {
            $transaction->rollBack();
            throw $exception;
        }
        $this->_resetCache();
    }

    public function handleDeletedBlockType(ConfigEvent $event): void
    {
        $this->_ensureExternalPreflight();
        $uid = $event->tokenMatches[0] ?? null;
        if (!is_string($uid)) {
            return;
        }
        $record = BlockTypeRecord::findOne(['uid' => $uid]);
        if ($record) {
            $layout = Craft::$app->getFields()->getLayoutById((int)$record->fieldLayoutId);
            $record->delete();
            if ($layout) {
                Craft::$app->getFields()->deleteLayout($layout, true);
            }
        }
        $this->_resetCache();
    }

    public function getSchemaDiagnostics(): array
    {
        $this->diagnostics = [];
        $this->_validateSchema($this->_indexByUid($this->getAllBlockTypes()), $this->_indexByUid($this->getAllBlockTypes()));
        return $this->diagnostics;
    }

    /**
     * Schema usages are Vizy field picker groups only (Content Area allowlists retired).
     */
    public function getBlockTypeSchemaUsages(string $blockTypeUid): array
    {
        $usages = [];
        $fieldConfigs = Craft::$app->getProjectConfig()->get('fields') ?? [];
        foreach ($fieldConfigs as $fieldUid => $config) {
            // Craft packs associative picker groups in Project Config. Inspect
            // their unpacked values so saved schema references prevent deletion.
            $config = ProjectConfigHelper::unpackAssociativeArrays($config);
            foreach (($config['settings']['blockTypePickerGroups'] ?? []) as $groupIndex => $group) {
                if (in_array($blockTypeUid, $group['blockTypeUids'] ?? [], true)) {
                    $usages[] = ['fieldUid' => $fieldUid, 'group' => $groupIndex];
                }
            }
        }
        return $usages;
    }

    public function preflightExternalSchema(array $incomingBlockTypes, bool $allowMatrixGrandfatherImport = false): void
    {
        $baseline = $this->_indexByUid($this->getAllBlockTypes());
        $models = [];
        foreach ($incomingBlockTypes as $uid => $config) {
            if (is_string($uid) && is_array($config)) {
                if (isset($config['uid']) && $config['uid'] !== $uid) {
                    throw new RuntimeException("Incoming Block Type map key {$uid} does not match payload UID {$config['uid']}.");
                }
                $models[$uid] = BlockType::fromConfig($uid, ProjectConfigHelper::unpackAssociativeArrays($config));
            }
        }
        if (!$this->_validateSchema($models, $baseline, null, false, $allowMatrixGrandfatherImport)) {
            $errors = [];
            foreach ($models as $uid => $model) {
                if ($model->hasErrors()) {
                    $errors[$uid] = $model->getErrors();
                }
            }
            throw new RuntimeException(
                'Incoming Vizy Block Type schema contains duplicate identities, handles, or invalid layouts: '
                . Json::encode($errors)
            );
        }
    }


    // Private Methods
    // =========================================================================

    private function _validateSchema(
        array $candidate,
        array $baseline,
        ?BlockType $focus = null,
        bool $rejectMissing = true,
        bool $allowMatrixGrandfatherImport = false,
    ): bool
    {
        $valid = true;
        $handles = [];
        $schemaUids = [];
        // Claim every authoritative Block Type map key first. This makes
        // collisions with nested owned UIDs independent of iteration order.
        foreach ($candidate as $uid => $type) {
            $schemaUids[$uid] = "Block Type {$uid}";
            if ($type->uid !== $uid) {
                $type->addError('uid', "Block Type map key {$uid} does not match model UID {$type->uid}.");
                $valid = false;
            }
        }

        foreach ($candidate as $uid => $type) {
            if (!$type->validate()) {
                $valid = false;
            }
            $baselineType = $baseline[$uid] ?? null;
            foreach ($type->getFieldLayout()?->getCustomFieldElements() ?? [] as $placement) {
                $field = $placement->getField();
                $fieldClass = $field::class;
                $lifecycle = \verbb\vizy\Vizy::$plugin->getFieldLifecycle();
                $inventory = $lifecycle->classify($field);
                // New placements follow permitsNewPlacement (MatrixAnchor + nested
                // owners stay out of the library). Unchanged Project Config baselines
                // may keep Matrix (runtime grandfather) and other legacy placements.
                // Vizy 3 → 4 schema promotion also imports Matrix onto brand-new global
                // Block Types (empty baseline) — that is grandfather, not a new authoring placement.
                if (!$lifecycle->permitsNewPlacement($field)) {
                    $grandfatherImport = $allowMatrixGrandfatherImport
                        && ($inventory['capability'] ?? null) === \verbb\vizy\services\FieldLifecycle::MATRIX_ANCHOR;
                    if (!$this->_isUnchangedUnsafePlacement($baselineType, $placement->uid, $field->uid, $fieldClass) && !$grandfatherImport) {
                        // Author-facing copy first; class/reason stay in diagnostics for support.
                        $type->addError('fieldLayout', $lifecycle->placementRejectionMessage($field));
                        $valid = false;
                    } else {
                        $this->diagnostics[] = [
                            'code' => $grandfatherImport ? 'matrixAnchorGrandfatherImport' : 'existingUnsafeFieldPlacement',
                            'blockTypeUid' => $uid,
                            'placementUid' => $placement->uid,
                            ...$inventory,
                        ];
                    }
                }
                if (!$lifecycle->customTranslationKeyIsSupported($field)) {
                    if (!$this->_isUnchangedUnsafePlacement($baselineType, $placement->uid, $field->uid, $fieldClass)) {
                        $type->addError(
                            'fieldLayout',
                            "Field placement {$placement->uid} has a custom translation key that requires persisted Block identity."
                        );
                        $valid = false;
                    } else {
                        $this->diagnostics[] = [
                            'code' => 'existingUnsupportedCustomTranslationKey',
                            'blockTypeUid' => $uid,
                            'placementUid' => $placement->uid,
                        ];
                    }
                }
            }
            foreach ($this->_ownedLayoutUids($type) as [$ownedUid, $attribute]) {
                if (isset($schemaUids[$ownedUid])) {
                    $type->addError(
                        'fieldLayout',
                        "Duplicate Vizy-owned schemUID {$ownedUid}: {$attribute} conflicts with {$schemaUids[$ownedUid]}."
                    );
                    $valid = false;
                }
                $schemaUids[$ownedUid] = "{$attribute} owned by Block Type {$uid}";
            }
            $handle = strtolower($type->handle);
            if (isset($handles[$handle]) && $handles[$handle] !== $uid) {
                $type->addError('handle', 'Block Type handles must be globally unique.');
                $valid = false;
            }
            $handles[$handle] = $uid;
        }

        return $valid;
    }

    private function _indexByUid(array $types): array
    {
        $indexed = [];
        foreach ($types as $type) {
            $indexed[(string)$type->uid] = $type;
        }
        return $indexed;
    }

    private function _isUnchangedUnsafePlacement(
        ?BlockType $baseline,
        ?string $placementUid,
        ?string $fieldUid,
        string $fieldClass,
    ): bool {
        if (!$baseline || !$placementUid || !$fieldUid) {
            return false;
        }

        foreach ($baseline->getFieldLayout()?->getCustomFieldElements() ?? [] as $placement) {
            $field = $placement->getField();
            if ($placement->uid === $placementUid && $field->uid === $fieldUid && $field::class === $fieldClass) {
                return true;
            }
        }

        return false;
    }

    private function _uniqueHandle(string $base): string
    {
        $handle = StringHelper::toHandle($base);
        $candidate = $handle;
        $suffix = 2;
        while ($this->getBlockTypeByHandle($candidate)) {
            $candidate = $handle . $suffix++;
        }
        return $candidate;
    }

    private function _resetCache(): void
    {
        $this->all = null;
        $this->byId = [];
        $this->byUid = [];
        $this->byHandle = [];
        if (\verbb\vizy\Vizy::$plugin?->has('editorManifests')) {
            \verbb\vizy\Vizy::$plugin->getEditorManifests()->invalidate();
        }
    }

    /**
     * Craft exposes the complete incoming config independently from its partially
     * applied working config, so hard graph validation can precede side effects.
     */
    private function _ensureExternalPreflight(): void
    {
        $projectConfig = Craft::$app->getProjectConfig();
        if ($this->externalPreflightComplete || !$projectConfig->getIsApplyingExternalChanges()) {
            return;
        }

        $incoming = $projectConfig->get(self::PROJECT_CONFIG_PATH, true) ?? [];
        if (!is_array($incoming)) {
            $incoming = [];
        }
        $this->preflightExternalSchema($incoming);
        $this->externalPreflightComplete = true;
    }

    private function _ownedLayoutUids(BlockType $type): array
    {
        $layout = $type->getFieldLayout();
        if (!$layout) {
            return [];
        }

        $uids = [[$layout->uid, 'layout']];
        foreach ($layout->getTabs() as $tab) {
            $uids[] = [$tab->uid, 'tab'];
            foreach ($tab->getElements() as $element) {
                $uids[] = [$element->uid, 'placement'];
            }
        }
        return array_values(array_filter($uids, static fn(array $item) => is_string($item[0]) && $item[0] !== ''));
    }
}
