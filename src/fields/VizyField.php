<?php
namespace verbb\vizy\fields;

use verbb\vizy\Vizy;
use verbb\vizy\deprecations\VizyFieldConfigDeprecations;
use verbb\vizy\deprecations\VizyFieldLegacySettingsDeprecations;
use verbb\vizy\deprecations\VizyFieldPluginDeprecations;
use verbb\vizy\deprecations\VizyFieldPurifierDeprecations;
use verbb\vizy\document\VizyDocument as CanonicalVizyDocument;
use verbb\vizy\elements\Block;
use verbb\vizy\gql\types\VizyDocumentType;
use verbb\vizy\helpers\FieldImageOptions;
use verbb\vizy\helpers\FieldImagePreviews;
use verbb\vizy\helpers\FieldLinkOptions;
use verbb\vizy\models\BlockType;
use verbb\vizy\services\BlockTypes;
use verbb\vizy\services\HostedVizy;
use verbb\vizy\web\assets\field\VizyAsset;
use verbb\vizy\web\assets\fieldsettings\FieldSettingsAsset;

use Craft;
use craft\base\Element;
use craft\base\ElementInterface;
use craft\base\Field;
use craft\elements\Asset;
use craft\fields\conditions\EmptyFieldConditionRule;
use craft\helpers\Html;
use craft\helpers\Json;
use craft\helpers\StringHelper;
use craft\validators\ArrayValidator;

use yii\base\InvalidConfigException;

use GraphQL\Type\Definition\Type;

class VizyField extends Field
{
    // Static Methods
    // =========================================================================

    public static function displayName(): string
    {
        return Craft::t('vizy', 'Vizy');
    }

    public static function icon(): string
    {
        return '@verbb/vizy/icon-mask.svg';
    }

    public static function phpType(): string
    {
        return CanonicalVizyDocument::class;
    }

    private static function _recursiveImplode(array $array, string $glue = ',', bool $include_keys = false, bool $trim_all = false): string
    {
        $glued_string = '';

        // Recursively iterates array and adds key/value to glued string
        array_walk_recursive($array, function($value, $key) use ($glue, $include_keys, &$glued_string) {
            $include_keys && $glued_string .= $key . $glue;
            $glued_string .= $value . $glue;
        });

        // Removes last $glue from string
        $glue !== '' && $glued_string = substr($glued_string, 0, -strlen($glue));

        // Trim ALL whitespace
        $trim_all && $glued_string = preg_replace("/(\s)/ixsm", '', $glued_string);

        return (string)$glued_string;
    }


    // Constants
    // =========================================================================

    public const EVENT_REGISTER_LINK_OPTIONS = 'registerLinkOptions';

    public const MODE_COMBINED = 'combined';
    public const MODE_BLOCKS = 'blocks';
    public const MODE_RICH_TEXT = 'richText';
    public const ROOT_CONTENT_RICH = 'rich';
    public const ROOT_CONTENT_BLOCKS = 'blocks';


    // Traits
    // =========================================================================

    use VizyFieldConfigDeprecations;
    use VizyFieldLegacySettingsDeprecations;
    use VizyFieldPluginDeprecations;
    use VizyFieldPurifierDeprecations;


    // Properties
    // =========================================================================

    public string|array|null $availableVolumes = '*';
    public string|array|null $availableTransforms = '*';
    public bool $showUnpermittedVolumes = false;
    public bool $showUnpermittedFiles = false;
    public string $defaultTransform = '';
    public ?string $defaultUploadLocationSource = null;
    public bool $trimEmptyParagraphs = true;
    public bool $pasteAsPlainText = false;
    public int $initialRows = 7;
    public ?int $minBlocks = null;
    public ?int $maxBlocks = null;
    /**
     * When true, Block ⋯ → Delete asks for confirmation. Off by default —
     * Delete is already an explicit menu action; a second prompt is opt-in.
     */
    public bool $confirmBlockDeletion = false;
    /**
     * Suppresses root Block insertion without discarding allowances, so the
     * "Rich Text Only" editor mode round-trips losslessly. See getEditorMode().
     */
    public bool $richTextOnly = false;
    public array $linkSettings = ['text', 'newWindow', 'site', 'title', 'classes'];
    /**
     * Ordered field-local presentation groups referencing global Block Type UIDs.
     *
     * `blockTypeUids` is the full ordered membership. `disabledBlockTypeUids` is a
     * subset that authors may not insert; membership is kept separate from
     * availability so toggling a Block Type off never loses its group placement or
     * ordering, and never invalidates existing authored content of that type.
     */
    public array $blockTypePickerGroups = [];
    public string $editorConfig = 'standard';
    public string $rootContentType = self::ROOT_CONTENT_RICH;


    // Public Methods
    // =========================================================================

    /**
     * Presentation projection over the stored root policy.
     *
     * `rootContentType` is locked to `rich` or `blocks`, so "Rich Text
     * Only" is not a third stored policy — it is `rich` plus `richTextOnly`,
     * which suppresses root Block insertion while leaving the configured
     * allowances untouched so switching modes is lossless.
     */
    public function getEditorMode(): string
    {
        if ($this->rootContentType === self::ROOT_CONTENT_BLOCKS) {
            return self::MODE_BLOCKS;
        }

        return $this->richTextOnly ? self::MODE_RICH_TEXT : self::MODE_COMBINED;
    }

    public function setEditorMode(string $value): void
    {
        // Also the Vizy 3 promotion path: a legacy `editorMode` setting maps
        // straight onto the canonical pair.
        match ($value) {
            self::MODE_BLOCKS => [$this->rootContentType, $this->richTextOnly] = [self::ROOT_CONTENT_BLOCKS, false],
            self::MODE_RICH_TEXT => [$this->rootContentType, $this->richTextOnly] = [self::ROOT_CONTENT_RICH, true],
            default => [$this->rootContentType, $this->richTextOnly] = [self::ROOT_CONTENT_RICH, false],
        };
    }

    public function __construct($config = [])
    {
        // Remove unused settings
        unset($config['columnType']);
        // Transient field-settings POST payload for global Block Types; not a field attribute.
        unset($config['vizyBlockTypes']);
        // Vizy 3 Block picker hover/click behaviour — unused in Vizy 4 UI.
        unset($config['blockTypeBehaviour']);

        parent::__construct($config);
    }

    public function isValueEmpty(mixed $value, ElementInterface $element): bool
    {
        $isValueEmpty = parent::isValueEmpty($value, $element);

        // Empty / blank-paragraph documents count as empty for Craft’s isValueEmpty.
        if ($value instanceof CanonicalVizyDocument) {
            $isValueEmpty = $isValueEmpty || $value->isEmpty();
        }

        return $isValueEmpty;
    }

    public function getSettingsHtml(): ?string
    {
        $view = Craft::$app->getView();
        $view->registerAssetBundle(FieldSettingsAsset::class);

        $volumeOptions = [];

        foreach (Craft::$app->getVolumes()->getAllVolumes() as $volume) {
            if ($volume->getFs()->hasUrls) {
                $volumeOptions[] = [
                    'label' => Html::encode($volume->name),
                    'value' => $volume->uid,
                ];
            }
        }

        $transformOptions = [];

        foreach (Craft::$app->getImageTransforms()->getAllTransforms() as $transform) {
            $transformOptions[] = [
                'label' => Html::encode($transform->name),
                'value' => $transform->uid,
            ];
        }

        $sourceOptions = $this->_getSourceOptions();

        $uploadLocationWarning = $sourceOptions === []
            ? Craft::t('app', 'No volumes exist yet.')
            : null;

        $volumeOptionsWarning = null;
        if ($volumeOptions === []) {
            $volumeOptionsWarning = Craft::$app->getVolumes()->getAllVolumes() === []
                ? Craft::t('app', 'No volumes exist yet.')
                : Craft::t(
                    'vizy',
                    'No volumes have public URLs. Image and file picking requires at least one volume whose filesystem has public URLs.',
                );
        }

        $transformOptionsWarning = $transformOptions === []
            ? Craft::t('app', 'No image transforms exist yet.')
            : null;

        $pickerGroups = $this->_getBlockGroupsForSettings();
        $blockTypeOptions = array_map(
            static fn(BlockType $type) => [
                'label' => "{$type->name} ({$type->handle})",
                'value' => $type->uid,
            ],
            Vizy::$plugin->getBlockTypes()->getAllBlockTypes(),
        );
        $knownOptionUids = array_column($blockTypeOptions, 'value');
        foreach ($pickerGroups as $group) {
            foreach ($group['blockTypeUids'] as $uid) {
                if (!in_array($uid, $knownOptionUids, true)) {
                    $blockTypeOptions[] = ['label' => "Missing: {$uid}", 'value' => $uid];
                    $knownOptionUids[] = $uid;
                }
            }
        }
        $editorConfigOptions = Vizy::$plugin->getEditorConfigs()->getOptions();
        if ($this->editorConfig !== '' && !in_array($this->editorConfig, array_column($editorConfigOptions, 'value'), true)) {
            $editorConfigOptions[] = [
                'label' => Craft::t('vizy', 'Missing: {id}', ['id' => $this->editorConfig]),
                'value' => $this->editorConfig,
            ];
        }

        $referencedUids = [];
        foreach ($pickerGroups as $group) {
            foreach ($group['blockTypeUids'] as $uid) {
                $referencedUids[$uid] = true;
            }
        }

        // The configurator only ever presents summaries. Global Block Type
        // editing happens in a slideout against vizy/block-types/edit, so the
        // field settings form never embeds or submits global schema.
        $summarize = static fn(BlockType $type): array => [
            'uid' => $type->uid,
            'name' => $type->name,
            'handle' => $type->handle,
            'icon' => is_string($type->icon) ? $type->icon : null,
            'iconSvg' => Vizy::$plugin->getIcons()->blockTypeIconSvg($type->icon),
            'color' => $type->color,
            'template' => $type->template,
        ];

        $availableBlockTypes = [];
        $blockTypeSummaries = [];
        foreach (Vizy::$plugin->getBlockTypes()->getAllBlockTypes() as $type) {
            $availableBlockTypes[] = $summarize($type);
            if (isset($referencedUids[$type->uid])) {
                $blockTypeSummaries[$type->uid] = $summarize($type);
            }
        }

        // Unchanged missing references stay visible and submit as-is.
        foreach (array_keys($referencedUids) as $uid) {
            if (!isset($blockTypeSummaries[$uid])) {
                $blockTypeSummaries[$uid] = [
                    'uid' => $uid,
                    'name' => Craft::t('vizy', 'Missing: {uid}', ['uid' => $uid]),
                    'handle' => '',
                    'icon' => null,
                    'iconSvg' => null,
                    'color' => null,
                    'template' => null,
                    'missing' => true,
                ];
            }
        }

        return $view->renderTemplate('vizy/field/settings', [
            'field' => $this,
            'editorMode' => $this->getEditorMode(),
            'editorConfigOptions' => $editorConfigOptions,
            'pickerGroupsInputName' => $view->namespaceInputName('blockTypePickerGroups'),
            'configuratorInitial' => [
                'groups' => $pickerGroups,
                'blockTypes' => $blockTypeSummaries,
                'availableBlockTypes' => $availableBlockTypes,
            ],
            'volumeOptions' => $volumeOptions,
            'sourceOptions' => $sourceOptions,
            'transformOptions' => $transformOptions,
            'uploadLocationWarning' => $uploadLocationWarning,
            'volumeOptionsWarning' => $volumeOptionsWarning,
            'transformOptionsWarning' => $transformOptionsWarning,
            'defaultTransformOptions' => [
                ...[
                    [
                        'label' => Craft::t('vizy', 'No transform'),
                        'value' => null,
                    ],
                ], ...$transformOptions,
            ],
        ]);
    }

    public function normalizeValue(mixed $value, ElementInterface $element = null): CanonicalVizyDocument
    {
        return $element
            ? Vizy::$plugin->getDocuments()->normalizeValue($value, $element, $this)
            : Vizy::$plugin->getDocuments()->normalizeDetached($value);
    }

    public function serializeValue(mixed $value, ElementInterface $element = null): mixed
    {
        if ($value instanceof CanonicalVizyDocument) {
            return Vizy::$plugin->getDocuments()->serializeValue($value);
        }

        return $value;
    }

    public function serializeValueForDb(mixed $value, ElementInterface $element): mixed
    {
        if ($value instanceof CanonicalVizyDocument) {
            // Craft calls general serialization during reads and copies too.
            // Only this hook runs while persisting the owner's content row.
            $value = $value->recontextualize($element, $this);
            $serialized = Vizy::$plugin->getDocuments()->serializeForPersistence($value);
            // After-save acknowledgements and upload finalization must observe
            // the exact snapshot written to the content row, including anchor UIDs.
            $element->setFieldValue($this->handle, Vizy::$plugin->getDocuments()->normalizeValue($serialized, $element, $this));
            return $serialized;
        }

        return parent::serializeValueForDb($value, $element);
    }

    public function getElementConditionRuleType(): array|string|null
    {
        return EmptyFieldConditionRule::class;
    }

    public function getStaticHtml(mixed $value, ElementInterface $element): string
    {
        $view = Craft::$app->getView();

        $view->registerAssetBundle(VizyAsset::class);

        if (!$value instanceof CanonicalVizyDocument) {
            $value = $this->normalizeValue($value, $element);
        }

        return Html::tag('div', (string)$value->render() ?: '&nbsp;', [
            'class' => 'text vizy-static',
        ]);
    }

    public function beforeSave(bool $isNew): bool
    {
        if (!parent::beforeSave($isNew)) {
            return false;
        }
        // Canonical fields only store UID references. Global Block Type schema is
        // saved exclusively through services\BlockTypes via the CP screen, so a
        // field save can never mutate global schema as a side effect.
        $groups = [];
        foreach ($this->blockTypePickerGroups as $group) {
            $uids = array_values(array_filter(
                array_map('strval', $group['blockTypeUids'] ?? []),
                static fn(string $uid) => $uid !== '',
            ));
            if ($uids !== []) {
                // Disabled entries are only meaningful as a subset of membership, so
                // drop any that no longer reference UID in this group.
                $disabled = array_values(array_intersect(
                    array_map('strval', $group['disabledBlockTypeUids'] ?? []),
                    $uids,
                ));
                $groups[] = [
                    'name' => (string)($group['name'] ?? ''),
                    'blockTypeUids' => $uids,
                    'disabledBlockTypeUids' => $disabled,
                ];
            }
        }
        $this->blockTypePickerGroups = $groups;
        return true;
    }

    public function beforeElementSave(ElementInterface $element, bool $isNew): bool
    {
        // Craft uses duplication internally for drafts, revisions, and restores.
        // Only a true canonical-owner duplicate receives new document identity.
        if (
            $element->duplicateOf
            && !$element->duplicateOf->getIsDerivative()
            && $element->getIsCanonical()
            && !$element->updatingFromDerivative
        ) {
            $document = $element->getFieldValue($this->handle);
            if ($document instanceof CanonicalVizyDocument) {
                $element->setFieldValue(
                    $this->handle,
                    Vizy::$plugin->getMultisiteDocuments()->duplicateForCraftOwner($document, $element),
                );
            }
        }

        return parent::beforeElementSave($element, $isNew);
    }

    public function afterElementSave(ElementInterface $element, bool $isNew): void
    {
        parent::afterElementSave($element, $isNew);

        $document = $element->getFieldValue($this->handle);
        if ($document instanceof CanonicalVizyDocument) {
            // Field hooks run inside Craft's owner transaction. Register the
            // exact immutable scope; the public outermost DB commit event is
            // the only seam allowed to execute file moves.
            Vizy::$plugin->getAssetUploads()->defer($element, $this, $document);
            Vizy::$plugin->getEditorAcknowledgements()->collect($element, $this, $document);
        }
    }

    public function propagateValue(ElementInterface $from, ElementInterface $to): void
    {
        $source = $from->getFieldValue($this->handle);
        if (!$source instanceof CanonicalVizyDocument) {
            $source = $this->normalizeValue($source, $from);
        }

        // Craft clones the source over the target when propagateAll is active.
        // Reload through the public Elements API before applying localized slots.
        $targetOwner = $to;
        if ($from->propagateAll && $to->id) {
            $criteria = [];
            if ($to->getIsDraft()) {
                $criteria['draftId'] = $to->draftId;
            } elseif ($to->getIsRevision()) {
                $criteria['revisionId'] = $to->revisionId;
            }
            $targetOwner = Craft::$app->getElements()->getElementById(
                (int)$to->id,
                $to::class,
                $to->siteId,
                $criteria,
            ) ?? $to;
        }

        $target = $targetOwner->getFieldValue($this->handle);
        if (!$target instanceof CanonicalVizyDocument) {
            $target = $this->normalizeValue($target, $targetOwner);
        }
        if ($target->owner() !== $to) {
            $target = $target->recontextualize($to, $this);
        }

        $to->setFieldValue(
            $this->handle,
            Vizy::$plugin->getMultisiteDocuments()->mergeForCraftPropagation($source, $target),
        );
    }

    public function getBlockTypeById($blockTypeId)
    {
        return is_numeric($blockTypeId)
            ? Vizy::$plugin->getBlockTypes()->getBlockTypeById((int)$blockTypeId)
            : null;
    }

    public function getBlockTypeByIdOrHandle(string|int $blockTypeId): ?BlockType
    {
        $type = is_int($blockTypeId) || ctype_digit((string)$blockTypeId)
            ? Vizy::$plugin->getBlockTypes()->getBlockTypeById((int)$blockTypeId)
            : Vizy::$plugin->getBlockTypes()->getBlockTypeByUid((string)$blockTypeId)
                ?? Vizy::$plugin->getBlockTypes()->getBlockTypeByHandle((string)$blockTypeId);

        return $type && $this->allowsBlockTypeUid((string)$type->uid) ? $type : null;
    }

    public function getBlockTypes(): array
    {
        return $this->getAllowedBlockTypes();
    }

    /**
     * Every Block Type UID this field references, including field-locally disabled
     * ones. This is the permission/validation surface: an author who disables a
     * Block Type must still be able to open and validate Blocks already authored
     * with it.
     */
    public function getAllowedBlockTypeUids(): array
    {
        $uids = [];
        foreach ($this->blockTypePickerGroups as $group) {
            foreach ($group['blockTypeUids'] ?? [] as $uid) {
                $uids[] = (string)$uid;
            }
        }
        return $uids;
    }

    /**
     * The subset authors may actually insert. Insertion surfaces use this;
     * permission and validation use `getAllowedBlockTypeUids()`.
     */
    public function getInsertableBlockTypeUids(): array
    {
        if ($this->richTextOnly) {
            return [];
        }

        $disabled = $this->getDisabledBlockTypeUids();

        return array_values(array_filter(
            $this->getAllowedBlockTypeUids(),
            static fn(string $uid) => !in_array($uid, $disabled, true),
        ));
    }

    public function getDisabledBlockTypeUids(): array
    {
        $uids = [];
        foreach ($this->blockTypePickerGroups as $group) {
            foreach ($group['disabledBlockTypeUids'] ?? [] as $uid) {
                $uids[] = (string)$uid;
            }
        }
        return $uids;
    }

    public function getAllowedBlockTypes(): array
    {
        $types = [];
        foreach ($this->getAllowedBlockTypeUids() as $uid) {
            if ($type = Vizy::$plugin->getBlockTypes()->getBlockTypeByUid($uid)) {
                $types[] = $type;
            }
        }
        return $types;
    }

    public function allowsBlockTypeUid(string $uid): bool
    {
        return in_array($uid, $this->getAllowedBlockTypeUids(), true);
    }

    public function getBlockTypeDiagnostics(): array
    {
        $diagnostics = [];
        foreach ($this->getAllowedBlockTypeUids() as $uid) {
            if (!Vizy::$plugin->getBlockTypes()->getBlockTypeByUid($uid)) {
                $diagnostics[] = ['code' => 'missingAllowedBlockType', 'uid' => $uid];
            }
        }
        return $diagnostics;
    }

    public function getEditorConfigDiagnostics(): array
    {
        return Vizy::$plugin->getEditorConfigs()->getFieldDiagnostics($this);
    }

    /**
     * @internal Migration provenance supplies this immutable map.
     */
    public function getLegacySchemaMap(): ?array
    {
        return is_string($this->uid) && $this->uid !== ''
            ? Vizy::$plugin->getLegacySchemaMaps()->getSchemaMap($this->uid)
            : null;
    }

    public function getContentGqlType(): Type|array
    {
        // Field-scoped so Block Type unions match this field’s allowances.
        return VizyDocumentType::getType($this);
    }

    public function getElementValidationRules(): array
    {
        // Intentionally omit SCENARIO_ESSENTIALS: Craft uses that scenario when
        // duplicating for revisions/drafts, and Editor Config / schema checks must
        // not reject preserve-existing capabilities (or trusted migration candidates)
        // during snapshot duplication.
        return [
            [
                'validateBlocks',
                'on' => [Element::SCENARIO_DEFAULT, Element::SCENARIO_LIVE],
                'skipOnEmpty' => false,
            ],
        ];
    }

    public function validateBlocks(ElementInterface $element, ?CanonicalVizyDocument $trustedBaseline = null): void
    {
        $scenario = $element->getScenario();
        $value = $element->getFieldValue($this->handle);
        if (!$value instanceof CanonicalVizyDocument) {
            return;
        }

        $baseline = $trustedBaseline ?? Vizy::$plugin->getContentBaselines()->document($element, $this);
        foreach (Vizy::$plugin->getEditorManifests()->validateCapabilities($value, $this, $baseline) as $violation) {
            $element->addError(
                $this->handle,
                "New or changed {$violation['kind']} {$violation['name']} is not enabled by Editor Config {$this->editorConfig}.",
            );
        }

        // Root-only policy (min/max, rootContentType). Type allowance + Craft
        // field validation must cover every TipTap-located Block — including
        // layout → column children — not only the document root.
        $rootBlocks = $value->content()->blocks(false, null);
        $allBlocks = $value->content()->blocks(true, null);

        if ($this->rootContentType === self::ROOT_CONTENT_BLOCKS) {
            foreach ($value->content()->nodes() as $node) {
                if (($node['type'] ?? null) !== 'vizyBlock') {
                    $element->addError($this->handle, 'This Vizy field only permits Blocks at its root.');
                    break;
                }
            }
        }

        $seen = [];
        foreach ($allBlocks as $block) {
            if (isset($seen[$block->uid()])) {
                $element->addError($this->handle, "Duplicate Vizy Block UID: {$block->uid()}.");
            }
            $seen[$block->uid()] = true;
        }

        foreach ($allBlocks as $block) {
            if (!$this->allowsBlockTypeUid($block->blockTypeUid())) {
                $element->addError(
                    $this->handle,
                    "Block Type {$block->blockTypeUid()} is not allowed in this Vizy field.",
                );
            }
        }

        if ($this->minBlocks !== null || $this->maxBlocks !== null) {
            $arrayValidator = new ArrayValidator([
                'min' => $this->minBlocks,
                'max' => $this->maxBlocks,
                'tooFew' => $this->minBlocks ? Craft::t('app', '{attribute} should contain at least {min, number} {min, plural, one{block} other{blocks}}.', [
                    'attribute' => Craft::t('site', $this->name),
                    'min' => $this->minBlocks, // Need to pass this in now
                ]) : null,
                'tooMany' => $this->maxBlocks ? Craft::t('app', '{attribute} should contain at most {max, number} {max, plural, one{block} other{blocks}}.', [
                    'attribute' => Craft::t('site', $this->name),
                    'max' => $this->maxBlocks, // Need to pass this in now
                ]) : null,
                'skipOnEmpty' => false,
            ]);

            if (!$arrayValidator->validate($rootBlocks, $error)) {
                $element->addError($this->handle, $error);
            }
        }

        $validate = function(
            \verbb\vizy\document\VizyBlock $block,
            bool $ancestorEnabled = true,
            array $ancestorTypeUids = [],
        ) use ($element, $scenario): void {
            $enabled = $ancestorEnabled && $block->isEnabled();
            $type = $block->blockType();
            $layout = $type?->getFieldLayout();
            $typeUid = $block->blockTypeUid();

            // Consecutive same-type nesting; a different type resets.
            if (BlockTypes::consecutiveSameTypeDepth($ancestorTypeUids, $typeUid) > BlockTypes::SAME_BLOCK_TYPE_MAX_DEPTH) {
                $element->addError(
                    $this->handle,
                    "Block Type {$typeUid} exceeds the maximum same-type nesting depth of "
                    . BlockTypes::SAME_BLOCK_TYPE_MAX_DEPTH . '.',
                );
            }

            if ($enabled && $layout) {
                $blockElement = $block->document()->blockElement($block);
                $blockElement->setScenario($scenario);
                if (!$blockElement->validate()) {
                    $placements = [];
                    foreach ($layout->getCustomFieldElements() as $placement) {
                        $placements[$placement->getField()->handle] = $placement->uid;
                    }
                    foreach ($blockElement->getErrors() as $attribute => $messages) {
                        $handle = str_starts_with($attribute, 'field:') ? substr($attribute, 6) : $attribute;
                        $placementUid = $placements[$handle] ?? '__block';
                        foreach ($messages as $message) {
                            $element->addError("{$this->handle}.{$block->uid()}.{$placementUid}", $message);
                        }
                    }
                }
            }
            // TipTap leaf: nested composition is Hosted Vizy in fieldSlots (Craft field validate above).
        };

        // TipTap layout/column wrappers are not Block ancestors for same-type
        // depth — Hosted Vizy nesting advances ancestry via nested field validate.
        foreach ($allBlocks as $block) {
            $validate($block);
        }
    }


    // Protected Methods
    // =========================================================================

    protected function defineRules(): array
    {
        $rules = parent::defineRules();

        $rules[] = [['initialRows', 'minBlocks', 'maxBlocks'], 'integer', 'min' => 0];
        $rules[] = [['rootContentType'], 'in', 'range' => [self::ROOT_CONTENT_RICH, self::ROOT_CONTENT_BLOCKS]];
        $rules[] = [['editorConfig'], 'match', 'pattern' => '/^[a-z][a-z0-9_-]*$/'];
        $rules[] = [['editorConfig'], function(): void {
            Vizy::$plugin->getEditorConfigs()->validateFieldReference($this);
        }];
        $rules[] = [['maxBlocks'], 'compare', 'compareAttribute' => 'minBlocks', 'operator' => '>=', 'when' => fn() => $this->minBlocks !== null && $this->maxBlocks !== null];
        $rules[] = [['blockTypePickerGroups'], function(): void {
            $seen = [];
            foreach ($this->blockTypePickerGroups as $group) {
                if (trim((string)($group['name'] ?? '')) === '') {
                    $this->addError('blockTypePickerGroups', 'Picker group names are required.');
                }
                foreach ($group['blockTypeUids'] ?? [] as $uid) {
                    if (!is_string($uid) || !preg_match('/^[0-9a-f-]{36}$/i', $uid)) {
                        $this->addError('blockTypePickerGroups', 'Picker groups may contain only Block Type UIDs.');
                    } elseif (isset($seen[$uid])) {
                        $this->addError('blockTypePickerGroups', "Block Type UID {$uid} appears more than once.");
                    }
                    $seen[$uid] = true;
                }
                $membership = array_map('strval', $group['blockTypeUids'] ?? []);
                foreach ($group['disabledBlockTypeUids'] ?? [] as $uid) {
                    if (!in_array((string)$uid, $membership, true)) {
                        $this->addError('blockTypePickerGroups', "Disabled Block Type UID {$uid} is not a member of its group.");
                    }
                }
            }
        }];

        return $rules;
    }

    protected function inputHtml(mixed $value, ?ElementInterface $element, bool $inline): string
    {
        if (!$value instanceof CanonicalVizyDocument) {
            $value = $element
                ? $this->normalizeValue($value, $element)
                : Vizy::$plugin->getDocuments()->normalizeDetached($value);
        }

        if (!$element) {
            throw new InvalidConfigException('The canonical Vizy editor requires an owner context.');
        }

        // Block host → Hosted Vizy Editor (nested field), not Entry-owned root.
        if ($element instanceof Block) {
            return $this->_hostedInputHtml($value, $element);
        }

        return $this->_rootInputHtml($value, $element);
    }

    protected function searchKeywords(mixed $value, ElementInterface $element): string
    {
        $keywords = parent::searchKeywords($value, $element);

        if ($value instanceof CanonicalVizyDocument) {
            $parts = [];
            // Prose text + Image alt / Link labels / Asset titles from TipTap JSON.
            $this->_collectDocumentSearchParts($value->content()->nodes(), $parts, (int)$element->siteId);

            // Searchable Block FieldLayout fields (Hosted Vizy recurses here when
            // the nested field is searchable — same path as Vizy 3 nested Vizy).
            foreach ($value->blocks(null) as $block) {
                if ($fieldLayout = $block->blockType()?->getFieldLayout()) {
                    foreach ($fieldLayout->getCustomFields() as $field) {
                        if ($field->searchable) {
                            $parts[] = $field->searchKeywords($block->fieldValue($field->handle), $element);
                        }
                    }
                }
            }

            $keywords = $parts;
        }

        if (is_array($keywords)) {
            $keywords = trim(self::_recursiveImplode($keywords, ' '));
        }

        return $keywords;
    }


    // Private Methods
    // =========================================================================

    /**
     * Entry (or other non-Block) Vizy field — owns ElementEditor dirty/save.
     */
    private function _rootInputHtml(CanonicalVizyDocument $value, ElementInterface $element): string
    {
        $view = Craft::$app->getView();
        $view->registerAssetBundle(VizyAsset::class);
        $editorId = 'vizy-editor-' . StringHelper::randomString(12);
        $inputId = $editorId . '-document';
        $manifest = Vizy::$plugin->getEditorManifests()->build($this);
        $context = Vizy::$plugin->getEditorContexts()->issue($element, $this);
        $document = $value->toArray();
        $bootstrap = [
            'document' => $document,
            'manifest' => $manifest,
            'editorContextToken' => $context['token'],
            'finalization' => Vizy::$plugin->getEditorAcknowledgements()->initialFinalization($value, $editorId),
            // Real FieldLayout forms for Blocks already in the document arrive with
            // the CP response. The browser adopts them before first paint; later
            // Blocks retain the request-driven viewport path.
            'initialFieldLayouts' => Vizy::$plugin->getInitialFieldLayouts()->build(
                $document,
                $context,
                $element,
                $this,
            ),
            // Per-owner Craft element link pickers — not cached with the manifest.
            'linkOptions' => FieldLinkOptions::forField($this, $element),
            'elementSiteId' => (int)$element->siteId,
            // Image asset picker (volumes / transforms) — same owner scope.
            'imageAuthoring' => FieldImageOptions::forField($this),
            // Session thumbs for Image nodes (canonical never stores src).
            'imagePreviews' => FieldImagePreviews::forDocument($document, (int)$element->siteId),
        ];
        // Embed bootstrap on the element (same path as Hosted). Slideouts /
        // CpScreen AJAX often miss registerJs + getElementById after namespace
        // rewrite; <template> survives HTML insertion and boots on connect.
        $bootstrapJson = Json::encode($bootstrap, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS);

        // One hidden control is the complete persisted field value. FieldLayout
        // widget controls use isolated vizyHost names and are stripped client-side.
        return Html::tag('vizy-editor',
            Html::hiddenInput($this->handle, $value->toJson(), [
                'id' => $inputId,
                'data-vizy-document' => true,
            ])
            . Html::tag('template', $bootstrapJson, [
                'data-vizy-bootstrap' => true,
            ]),
            [
                'id' => $editorId,
                'data-vizy-editor' => true,
            ],
        );
    }

    /**
     * Nested Vizy on a Block FieldLayout — Hosted Vizy Editor.
     * Own Editor Config; fragment lives in parent Block fieldSlots; no Entry POST.
     */
    private function _hostedInputHtml(CanonicalVizyDocument $value, Block $block): string
    {
        $depth = HostedVizy::nextDepth();
        if (!HostedVizy::allowsDepth($depth)) {
            return Html::tag('p', Craft::t('vizy', 'This Vizy field cannot nest further (max depth {max}).', [
                'max' => HostedVizy::MAX_DEPTH,
            ]), ['class' => 'warning']);
        }

        $owner = $block->getOwner();
        $parentField = $block->getField();
        $placementUid = null;
        foreach ($block->getFieldLayout()?->getCustomFieldElements() ?? [] as $placement) {
            if ($placement->getField()?->uid === $this->uid) {
                $placementUid = $placement->uid;
                break;
            }
        }
        if ($placementUid === null) {
            return Html::tag('p', Craft::t('vizy', 'Hosted Vizy field is missing its FieldLayout placement.'), [
                'class' => 'error',
            ]);
        }

        // Auth root = Entry-placed Vizy. Immediate parent may be another hosted
        // Vizy (Nested 2 → Nested 3); that field is not on the Entry layout.
        $entryFieldUid = HostedVizy::entryFieldUid() ?? $parentField->uid;
        $entryField = Craft::$app->getFields()->getFieldByUid($entryFieldUid);
        if (!$entryField instanceof VizyField) {
            $entryField = $parentField;
        }

        $view = Craft::$app->getView();
        $view->registerAssetBundle(VizyAsset::class);
        $editorId = 'vizy-editor-hosted-' . StringHelper::randomString(12);
        $inputId = $editorId . '-document';
        $manifest = Vizy::$plugin->getEditorManifests()->build($this);
        $context = Vizy::$plugin->getEditorContexts()->issueHosted($owner, $entryField, $this, [
            'depth' => $depth,
            'blockUid' => $block->getBlockUid(),
            'placementUid' => $placementUid,
            'parentFieldUid' => $parentField->uid,
            'path' => [...HostedVizy::renderingPath(), [
                'blockTypeUid' => $block->getType()->uid,
                'layoutUid' => $block->getFieldLayout()->uid,
                'placementUid' => $placementUid,
                'fieldUid' => $this->uid,
            ]],
        ]);
        $document = $value->toArray();
        $bootstrap = [
            'document' => $document,
            'manifest' => $manifest,
            'editorContextToken' => $context['token'],
            'hosted' => [
                'depth' => $depth,
                'entryFieldUid' => $entryField->uid,
                'parentFieldUid' => $parentField->uid,
                'blockUid' => $block->getBlockUid(),
                'placementUid' => $placementUid,
                'nestedFieldUid' => $this->uid,
            ],
            'initialFieldLayouts' => Vizy::$plugin->getInitialFieldLayouts()->build(
                $document,
                $context,
                $owner,
                $this,
            ),
            'linkOptions' => FieldLinkOptions::forField($this, $owner),
            'elementSiteId' => (int)$owner->siteId,
            'imageAuthoring' => FieldImageOptions::forField($this),
            'imagePreviews' => FieldImagePreviews::forDocument($document, (int)$owner->siteId),
        ];
        // Embed bootstrap on the element so FieldLayout mount does not depend on
        // appendBodyHtml + getElementById (easy to miss after fragment distribution).
        // Same sole payload as root Entry Vizy (slideout-safe). Use <template> —
        // survives host.innerHTML; <script> is unreliable there.
        $bootstrapJson = Json::encode($bootstrap, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS);

        // Namespaced under vizyHost by FieldLayoutForms — stripped from Entry POST.
        // data-vizy-document still holds the fragment the hosted adapter reads.
        return Html::tag('vizy-editor',
            Html::hiddenInput($this->handle, $value->toJson(), [
                'id' => $inputId,
                'data-vizy-document' => true,
            ])
            . Html::tag('template', $bootstrapJson, [
                'data-vizy-bootstrap' => true,
            ]),
            [
                'id' => $editorId,
                'data-vizy-editor' => true,
                'data-vizy-hosted' => true,
                'data-vizy-hosted-depth' => (string)$depth,
                'data-vizy-hosted-placement' => $placementUid,
            ],
        );
    }

    /**
     * Walk TipTap nodes for Craft element search keywords.
     *
     * Collects leaf `text`, Image `alt` + Asset title/filename, and Link mark
     * string values (url/email/tel/sms). Does not invent Craft relations.
     */
    private function _collectDocumentSearchParts(array $nodes, array &$parts, int $siteId): void
    {
        foreach ($nodes as $node) {
            if (!is_array($node)) {
                continue;
            }

            if (is_string($node['text'] ?? null) && $node['text'] !== '') {
                $parts[] = $node['text'];
            }

            foreach ($node['marks'] ?? [] as $mark) {
                if (!is_array($mark) || ($mark['type'] ?? null) !== 'link') {
                    continue;
                }
                $attrs = is_array($mark['attrs'] ?? null) ? $mark['attrs'] : [];
                $kind = $attrs['type'] ?? null;
                $value = $attrs['value'] ?? null;
                if (in_array($kind, ['url', 'email', 'tel', 'sms'], true) && is_string($value) && $value !== '') {
                    $parts[] = $value;
                }
            }

            if (($node['type'] ?? null) === 'image') {
                $attrs = is_array($node['attrs'] ?? null) ? $node['attrs'] : [];
                $alt = $attrs['alt'] ?? null;
                if (is_string($alt) && $alt !== '') {
                    $parts[] = $alt;
                }
                $assetUid = $attrs['assetUid'] ?? null;
                if (is_string($assetUid) && $assetUid !== '') {
                    $asset = Craft::$app->getElements()->getElementByUid($assetUid, Asset::class, $siteId);
                    if ($asset instanceof Asset) {
                        if ($asset->title !== '') {
                            $parts[] = $asset->title;
                        }
                        if ($asset->filename !== '') {
                            $parts[] = $asset->filename;
                        }
                    }
                }
            }

            $content = $node['content'] ?? null;
            if (is_array($content)) {
                $this->_collectDocumentSearchParts($content, $parts, $siteId);
            }
        }
    }

    private function _getBlockGroupsForSettings(): array
    {
        $groups = $this->blockTypePickerGroups;

        // Missing references remain visible and submit unchanged; this method
        // never expands UID into field-local schema or a copied FieldLayout.
        return array_map(static fn(array $group, int $index) => [
            'id' => 'group-' . $index,
            'name' => (string)($group['name'] ?? ''),
            'blockTypeUids' => array_values(array_map('strval', $group['blockTypeUids'] ?? [])),
            'disabledBlockTypeUids' => array_values(array_map('strval', $group['disabledBlockTypeUids'] ?? [])),
        ], $groups, array_keys($groups));
    }

    private function _getSourceOptions(): array
    {
        $sourceOptions = [];

        foreach (Asset::sources('settings') as $volume) {
            if (!isset($volume['heading'])) {
                $sourceOptions[] = [
                    'label' => $volume['label'],
                    'value' => $volume['key'],
                ];
            }
        }

        return $sourceOptions;
    }
}
