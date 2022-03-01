<?php
namespace verbb\vizy\fields;

use verbb\vizy\Vizy;
use verbb\vizy\elements\Block as BlockElement;
use verbb\vizy\events\ModifyPurifierConfigEvent;
use verbb\vizy\events\ModifyVizyConfigEvent;
use verbb\vizy\events\RegisterLinkOptionsEvent;
use verbb\vizy\gql\types\NodeCollectionType;
use verbb\vizy\models\BlockType;
use verbb\vizy\models\NodeCollection;
use verbb\vizy\nodes\VizyBlock;
use verbb\vizy\web\assets\field\VizyAsset;

use Craft;
use craft\base\Element;
use craft\base\ElementInterface;
use craft\base\Field;
use craft\base\FieldInterface;
use craft\base\PreviewableFieldInterface;
use craft\base\Volume;
use craft\db\Query;
use craft\db\Table;
use craft\elements\Asset;
use craft\elements\Category;
use craft\elements\Entry;
use craft\events\DefineFieldLayoutFieldsEvent;
use craft\fieldlayoutelements\CustomField;
use craft\helpers\ArrayHelper;
use craft\helpers\Db;
use craft\helpers\FileHelper;
use craft\helpers\Html;
use craft\helpers\HtmlPurifier;
use craft\helpers\Json;
use craft\helpers\StringHelper;
use craft\helpers\UrlHelper;
use craft\models\FieldLayout;
use craft\models\FieldLayoutTab;
use craft\models\Section;
use craft\web\twig\variables\Cp;

use yii\base\InvalidArgumentException;
use yii\db\Schema;
use yii\web\BadRequestHttpException;

use GraphQL\Type\Definition\Type;

class VizyField extends Field
{
    // Constants
    // =========================================================================

    const EVENT_REGISTER_LINK_OPTIONS = 'registerLinkOptions';
    const EVENT_MODIFY_PURIFIER_CONFIG = 'modifyPurifierConfig';
    const EVENT_DEFINE_VIZY_CONFIG = 'defineVizyConfig';


    // Properties
    // =========================================================================

    public $fieldData = [];
    public $vizyConfig;
    public $configSelectionMode = 'choose';
    public $manualConfig = '';
    public $availableVolumes = '*';
    public $availableTransforms = '*';
    public $showUnpermittedVolumes = false;
    public $showUnpermittedFiles = false;
    public $defaultTransform = '';
    public $trimEmptyParagraphs = true;
    public $columnType = Schema::TYPE_TEXT;

    private $_blockTypesById = [];


    // Static Methods
    // =========================================================================

    public static function displayName(): string
    {
        return Craft::t('vizy', 'Vizy');
    }

    public static function valueType(): string
    {
        return 'string|null';
    }


    // Public Methods
    // =========================================================================

    public function getContentColumnType(): string
    {
        return $this->columnType;
    }

    public function isValueEmpty($value, ElementInterface $element): bool
    {
        $isValueEmpty = parent::isValueEmpty($value, $element);

        // Check for an empty paragraph
        if ($value instanceof NodeCollection) {
            $isValueEmpty = $isValueEmpty || $value->isEmpty();
        }

        return $isValueEmpty;
    }

    public function getSettingsHtml()
    {
        $view = Craft::$app->getView();

        $fieldData = $this->_getBlockGroupsForSettings();

        $settings = [
            'fieldId' => $this->id,
            'suggestions' => (new Cp())->getTemplateSuggestions(),
        ];

        $idPrefix = StringHelper::randomString(10);

        $view->registerAssetBundle(VizyAsset::class);
        $view->registerJs('new Craft.Vizy.Settings(' .
            Json::encode($idPrefix, JSON_UNESCAPED_UNICODE) . ', ' .
            Json::encode($fieldData, JSON_UNESCAPED_UNICODE) . ', ' .
            Json::encode($settings, JSON_UNESCAPED_UNICODE) .
        ');');

        $volumeOptions = [];

        foreach (Craft::$app->getVolumes()->getPublicVolumes() as $volume) {
            if ($volume->hasUrls) {
                $volumeOptions[] = [
                    'label' => Html::encode($volume->name),
                    'value' => $volume->uid
                ];
            }
        }

        $transformOptions = [];

        foreach (Craft::$app->getAssetTransforms()->getAllTransforms() as $transform) {
            $transformOptions[] = [
                'label' => Html::encode($transform->name),
                'value' => $transform->uid
            ];
        }

        return $view->renderTemplate('vizy/field/settings', [
            'idPrefix' => $idPrefix,
            'field' => $this,
            'vizyConfigOptions' => $this->_getCustomConfigOptions('vizy'),
            'volumeOptions' => $volumeOptions,
            'transformOptions' => $transformOptions,
            'defaultTransformOptions' => array_merge([
                [
                    'label' => Craft::t('vizy', 'No transform'),
                    'value' => null
                ]
            ], $transformOptions),
        ]);
    }

    public function getInputHtml($value, ElementInterface $element = null): string
    {
        $view = Craft::$app->getView();
        $id = Html::id($this->handle);

        $site = ($element ? $element->getSite() : Craft::$app->getSites()->getCurrentSite());

        $defaultTransform = '';

        if (!empty($this->defaultTransform) && $transform = Craft::$app->getAssetTransforms()->getTransformByUid($this->defaultTransform)) {
            $defaultTransform = $transform->handle;
        }

        $placeholderKey = StringHelper::randomString(10);

        $settings = [
            'blockGroups' => $this->_getBlockGroupsForInput($value, $placeholderKey, $element),
            'blocks' => $this->_getBlocksForInput($value, $placeholderKey, $element),
            'vizyConfig' => $this->_getVizyConfig(),
            'linkOptions' => $this->_getLinkOptions($element),
            'volumes' => $this->_getVolumeKeys(),
            'transforms' => $this->_getTransforms(),
            'defaultTransform' => $defaultTransform,
            'elementSiteId' => $site->id,
            'showAllUploaders' => $this->showUnpermittedFiles,
            'placeholderKey' => $placeholderKey,
            'fieldHandle' => $this->handle,
        ];

        // No need to output JS for any nested fields, all settings are rendered in the template
        // as Vue takes over and processes the props.
        // if (!$element instanceof BlockElement) {
        //     $view->registerAssetBundle(VizyAsset::class);
        //     $view->registerJs('new Craft.Vizy.Input(' .
        //         '"' . $view->namespaceInputId($id) . '", ' .
        //         '"' . $view->namespaceInputName($this->handle) . '"' .
        //     ');');
        // }

        $view->registerAssetBundle(VizyAsset::class);
        $view->registerJs('new Craft.Vizy.Input(' .
            '"' . $view->namespaceInputId($id) . '", ' .
            '"' . $view->namespaceInputName($this->handle) . '"' .
        ');');

        return $view->renderTemplate('vizy/field/input', [
            'id' => $id,
            'name' => $this->handle,
            'field' => $this,
            'value' => Json::encode($value->getRawNodes(), JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_QUOT),
            'settings' => Json::encode($settings, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_QUOT),
        ]);
    }

    public function normalizeValue($value, ElementInterface $element = null)
    {
        if ($value instanceof NodeCollection) {
            return $value;
        }

        if (is_string($value) && !empty($value)) {
            $value = Json::decodeIfJson($value);
        }

        if (!is_array($value)) {
            $value = [];
        }

        // Convert serialized data to a collection of nodes.
        // Prevent auto-rendering for the control panel, where it's not needed.
        $value = new NodeCollection($this, $value, $element, !Craft::$app->getRequest()->getIsCpRequest());

        return $value;
    }

    public function serializeValue($value, ElementInterface $element = null)
    {
        if ($value instanceof NodeCollection) {
            return $value->serializeValues($element);
        }

        return $value;
    }

    public function getStaticHtml($value, ElementInterface $element): string
    {
        $view = Craft::$app->getView();

        $view->registerAssetBundle(VizyAsset::class);

        return Html::tag('div', $value->renderStaticHtml() ?: '&nbsp;', [
            'class' => 'text vizy-static',
        ]);
    }

    public function beforeSave(bool $isNew): bool
    {
        if (!parent::beforeSave($isNew)) {
            return false;
        }

        $request = Craft::$app->getRequest();
        $errors = [];

        // Prepare the setting data to be saved
        $this->fieldData = Json::decodeIfJson($this->fieldData) ?? [];

        foreach ($this->fieldData as $groupKey => $group) {
            $blockTypes = $group['blockTypes'] ?? [];

            foreach ($blockTypes as $blockTypeKey => $blockType) {
                // Ensure we catch errors to prevent data loss
                try {
                    // Remove this before populating the model
                    $layout = ArrayHelper::remove($blockType, 'layout');

                    // Create a model so we can properly validate
                    $blockType = new BlockType($blockType);

                    // Setup the field layout from field layout designer
                    $elementPlacements = $layout['elementPlacements'] ?? [];
                    $elementConfigs = $layout['elementConfigs'] ?? [];
                    $layoutUid = $blockType->layoutUid ?? null;

                    // Prevent potential issues when tab names aren't a string (`123` for example).
                    $elementPlacements = array_filter($elementPlacements);

                    if (!$blockType->validate()) {
                        foreach ($blockType->getErrors() as $key => $error) {
                            $errors[$blockType->id . ':' . $key] = $error;
                        }

                        continue;
                    }

                    // Don't save anything if there's no data
                    if ($elementPlacements && $elementConfigs) {
                        $fieldLayout = $this->assembleLayout($elementPlacements, $elementConfigs, $layoutUid);
                        $fieldLayout->type = BlockType::class;

                        // Set the layout here, saving takes place in PC event handlers, straight after this
                        $blockType->setFieldLayout($fieldLayout);
                    }

                    // Override with our cleaned model data
                    $this->fieldData[$groupKey]['blockTypes'][$blockTypeKey] = $blockType->serializeArray();
                } catch (\Throwable $e) {
                    $this->addErrors([$blockType->id . ':general' => $e->getMessage()]);

                    return false;
                }
            }
        }

        if ($errors) {
            $this->addErrors($errors);

            return false;
        }

        // Prevent any empty groups.
        foreach ($this->fieldData as $groupKey => $group) {
            $blocks = $group['blockTypes'] ?? [];

            if (!$blocks) {
                unset($this->fieldData[$groupKey]);
            }
        }

        // Be sure to reset the array keys, in case empty blocks have been deleted.
        // Can cause PC issues with `unpackAssociativeArray`.
        $this->fieldData = array_values($this->fieldData);

        // Any fields not in the global scope won't trigger a PC change event. Go manual.
        if ($this->context !== 'global') {
            Vizy::$plugin->getService()->saveField($this->fieldData);
        }

        return true;
    }

    public function beforeElementSave(ElementInterface $element, bool $isNew): bool
    {
        // If we're propagating the element (entry), we need to perform some additional checks in a specific scenario
        // If the Vizy field is set to un-translatable but the inner fields are, Craft's `_propagateElement()` will copy
        // values across all elements, which we don't want. As such, check each field and remove the duplicated content,
        // restoring the content that was there. This is tricky that Vizy fields don't use elements for their content
        // unlike Matrix, so we need to do a deep-dive into the content to re-jig it.
        //
        // We can also skip over this entirely if the Vizy field is translatable - that works as expected.
        if ($element->propagating && $this->translationMethod === Field::TRANSLATION_METHOD_NONE) {
            $translatableFields = [];

            // Before going any further, are there any inner fields in _any_ block type for this field
            // that are translatable? No need to go further if there aren't, and saves a lot of time.
            foreach ($this->getBlockTypes() as $blockType) {
                if (($fieldLayout = $blockType->getFieldLayout()) !== null) {
                    foreach ($fieldLayout->getFields() as $field) {
                        if ($field->translationMethod !== Field::TRANSLATION_METHOD_NONE) {
                            $translatableFields[$blockType->id][] = $field->handle;
                        }
                    }
                }
            }

            if ($translatableFields) {
                // Fetch the current element, so we can get it's content before saving.
                $siteElement = Craft::$app->getElements()->getElementById($element->id, get_class($element), $element->siteId);
                
                if ($siteElement) {
                    $hasUpdatedContent = false;
                    $newNodes = $element->getFieldValue($this->handle)->getRawNodes();

                    // Extract the raw content for _just_ the translatable fields
                    foreach ($siteElement->getFieldValue($this->handle)->getRawNodes() as $rawNode) {
                        if ($rawNode['type'] === 'vizyBlock') {
                            $blockId = $rawNode['attrs']['id'] ?? '';
                            $blockTypeId = $rawNode['attrs']['values']['type'] ?? '';
                            $fields = $translatableFields[$blockTypeId] ?? [];

                            foreach ($fields as $field) {
                                // Ensure we find the right block to update
                                foreach ($newNodes as $key => $newNode) {
                                    $newBlockId = $newNode['attrs']['id'] ?? '';

                                    if ($newBlockId === $blockId) {
                                        $hasUpdatedContent = true;

                                        $newNodes[$key]['attrs']['values']['content']['fields'][$field] = $rawNode['attrs']['values']['content']['fields'][$field] ?? '';
                                    }
                                }
                            }
                        }
                    }

                    if ($hasUpdatedContent) {
                        // Rebuild the node collection - if it's changed
                        $nodeCollection = new NodeCollection($this, $newNodes, $element);
                        
                        $element->setFieldValue($this->handle, $nodeCollection);
                    }
                }
            }
        }

        return parent::beforeElementSave($element, $isNew);
    }

    public function getBlockTypeById($blockTypeId)
    {
        if (isset($this->_blockTypesById[$blockTypeId])) {
            return $this->_blockTypesById[$blockTypeId];
        }

        foreach ($this->fieldData as $groupKey => $group) {
            foreach ($group['blockTypes'] as $blockTypeKey => $block) {
                if ($block['id'] === $blockTypeId) {
                    return $this->_blockTypesById[$blockTypeId] = new BlockType($block);
                }
            }
        }

        return null;
    }

    protected function searchKeywords($value, ElementInterface $element): string
    {
        $keywords = parent::searchKeywords($value, $element);

        if ($value instanceof NodeCollection) {
            $nodes = $value->getRawNodes();

            // Any actual editor text
            $keywords = $this->_getNestedValues($nodes, 'text');

            // Fields are different, and we need to check on their searchability
            foreach ($value->getNodes() as $key => $block) {
                if ($block instanceof VizyBlock) {
                    if ($fieldLayout = $block->getFieldLayout()) {
                        foreach ($fieldLayout->getFields() as $field) {
                            if (!$field->searchable) {
                                continue;
                            }

                            $fieldData = $block->getFieldValue($field->handle);

                            // If this is a nested Vizy block?
                            if ($field instanceof $this) {
                                // Prep the collection so we can run this again for the nested field
                                $fieldData = new NodeCollection($field, $fieldData, $element);
                            }

                            $keywords[] = $field->searchKeywords($fieldData, $element);
                        }
                    }
                }
            }
        }

        if (is_array($keywords)) {
            $keywords = trim(implode(' ', array_unique($keywords)));
        }

        return $keywords;
    }

    public function getBlockTypes()
    {
        $blockTypes = [];

        foreach ($this->fieldData as $groupKey => $group) {
            $blocks = $group['blockTypes'] ?? [];

            foreach ($blocks as $blockTypeKey => $blockTypeData) {
                // Remove this before populating the model
                $layout = ArrayHelper::remove($blockTypeData, 'layout');

                $blockType = new BlockType($blockTypeData);
                $blockType->fieldId = $this->id;

                $blockTypes[] = $blockType;
            }
        }

        return $blockTypes;
    }

    public function getContentGqlType()
    {
        return NodeCollectionType::getType($this);
    }

    public function getElementValidationRules(): array
    {
        return [
            [
                'validateBlocks',
                'on' => [Element::SCENARIO_ESSENTIALS, Element::SCENARIO_DEFAULT, Element::SCENARIO_LIVE],
                'skipOnEmpty' => false,
            ],
        ];
    }

    public function validateBlocks(ElementInterface $element)
    {
        $value = $element->getFieldValue($this->handle);
        $blocks = $value->query()->where(['type' => 'vizyBlock'])->all();
        $scenario = $element->getScenario();

        foreach ($blocks as $i => $block) {
            $blockElement = $block->getBlockElement($element);
            $blockElement->setScenario($scenario);

            if (!$blockElement->validate()) {
                $element->addModelErrors($blockElement, "{$this->handle}[{$i}]");
            }
        }
    }


    // Private Methods
    // =========================================================================

    private function _getNestedValues($value, $key, &$items = [])
    {
        foreach ($value as $k => $v) {
            if ((string)$k === $key) {
                $items[] = $v;
            }

            if (is_array($v)) {
                $this->_getNestedValues($v, $key, $items);
            }
        }

        return $items;
    }

    private function _getBlockGroupsForSettings()
    {
        $data = $this->fieldData;

        foreach ($data as $groupKey => $group) {
            $blocks = $group['blockTypes'] ?? [];

            foreach ($blocks as $blockTypeKey => $blockTypeData) {
                // Remove this before populating the model
                $layout = ArrayHelper::remove($blockTypeData, 'layout');

                $blockType = new BlockType($blockTypeData);
                $blockTypeArray = $blockType->toArray();

                // Watch for Vue's reactivity with arrays/objects. Easier to just implement here.
                // Never actually stored in the DB, but needed for field layout designer
                $blockTypeArray['layout'] = $layout;

                // Override with prepped data for Vue
                $data[$groupKey]['blockTypes'][$blockTypeKey] = $blockTypeArray;
            }
        }

        return $data;
    }

    private function _getBlockGroupsForInput($value, $placeholderKey, ElementInterface $element = null)
    {
        $view = Craft::$app->getView();

        $data = $this->fieldData;

        foreach ($data as $groupKey => $group) {
            $blocks = $group['blockTypes'] ?? [];

            foreach ($blocks as $blockTypeKey => $blockTypeData) {
                $blockType = new BlockType($blockTypeData);

                $fieldLayout = $blockType->getFieldLayout();

                if (!$fieldLayout) {
                    // Discard the blocktype
                    unset($data[$groupKey]['blockTypes'][$blockTypeKey]);

                    continue;
                }

                $blockTypeArray = $blockType->toArray();

                $view->startJsBuffer();

                // Create a fake element with the same fieldtype as our block
                $blockElement = new BlockElement();
                $blockElement->setFieldLayout($fieldLayout);
                $blockElement->setOwner($element);

                $originalNamespace = $view->getNamespace();
                $namespace = $view->namespaceInputName($this->handle . "[blocks][__BLOCK_TYPE_{$placeholderKey}__]", $originalNamespace);
                $view->setNamespace($namespace);

                $form = $fieldLayout->createForm($blockElement);
                $blockTypeArray['tabs'] = $form->getTabMenu();
                $blockTypeArray['fieldsHtml'] = $view->namespaceInputs($form->render());

                $footHtml = $view->clearJsBuffer(false);

                $view->setNamespace($originalNamespace);

                if ($footHtml) {
                    $footHtml = '<script id="script-__BLOCK_TYPE_' . $placeholderKey . '__">' . $footHtml . '</script>';
                }

                $blockTypeArray['footHtml'] = $footHtml;

                $data[$groupKey]['blockTypes'][$blockTypeKey] = $blockTypeArray;
            }

            // Ensure we reset array indexes to play nicely with JS
            $data[$groupKey]['blockTypes'] = array_values($data[$groupKey]['blockTypes']);
        }
        
        return $data;
    }

    private function _getBlocksForInput($value, $placeholderKey, ElementInterface $element = null)
    {
        $view = Craft::$app->getView();

        $blocks = [];

        if ($value && $value instanceof NodeCollection) {
            foreach ($value->getNodes() as $i => $block) {
                if ($block instanceof VizyBlock) {
                    $blockId = $block->attrs['id'];
                    $fieldLayout = $block->getFieldLayout();

                    if (!$fieldLayout) {
                        continue;
                    }

                    $view->startJsBuffer();

                    // Create a fake element with the same fieldtype as our block
                    $blockElement = $block->getBlockElement($element);

                    $originalNamespace = $view->getNamespace();
                    $namespace = $view->namespaceInputName($this->handle . "[blocks][{$blockId}]", $originalNamespace);
                    $view->setNamespace($namespace);

                    $fieldsHtml = $view->namespaceInputs($fieldLayout->createForm($blockElement)->render());
                    $footHtml = $view->clearJsBuffer(false);

                    $view->setNamespace($originalNamespace);

                    if ($footHtml) {
                        $footHtml = '<script id="script-' . $blockId . '">' . $footHtml . '</script>';
                    }

                    $blocks[] = [
                        'id' => $blockId,
                        'fieldsHtml' => $fieldsHtml,
                        'footHtml' => $footHtml,
                    ];
                }
            }
        }

        return $blocks;
    }

    // Copied from Craft, but refactored due to unable to rely on POST params
    private function assembleLayout($elementPlacements, $elementConfigs, $layoutUid = null): FieldLayout
    {
        $layout = new FieldLayout();

        // Try to find an existing layout, in case the field has a layout uid stored, but it's been deleted
        if ($layoutUid) {
            if (!$layout = Vizy::$plugin->getService()->getFieldLayoutByUid($layoutUid)) {
                $layout = new FieldLayout();
            }
        }

        $tabs = [];
        $fields = [];
        $tabSortOrder = 0;

        $fieldsService = Craft::$app->getFields();

        foreach ($elementPlacements as $tabName => $elementKeys) {
            $tab = $tabs[] = new FieldLayoutTab();
            $tab->name = urldecode($tabName);
            $tab->sortOrder = ++$tabSortOrder;
            $tab->elements = [];

            foreach ($elementKeys as $i => $elementKey) {
                $elementConfig = Json::decode($elementConfigs[$elementKey]);

                try {
                    $element = $fieldsService->createLayoutElement($elementConfig);
                } catch (InvalidArgumentException $e) {
                    throw new BadRequestHttpException($e->getMessage(), 0, $e);
                }

                $tab->elements[] = $element;

                if ($element instanceof CustomField) {
                    $fieldUid = $element->getFieldUid();
                    $field = $fieldsService->getFieldByUid($fieldUid);
                    if (!$field) {
                        throw new BadRequestHttpException("Invalid field UUID: $fieldUid");
                    }
                    $field->required = (bool)($elementConfig['required'] ?? false);
                    $field->sortOrder = ($i + 1);
                    $fields[] = $field;
                }
            }
        }

        $layout->setTabs($tabs);
        $layout->setFields($fields);

        return $layout;
    }

    private function _getVizyConfig(): array
    {
        if ($this->configSelectionMode === 'manual') {
            $config = Json::decode($this->manualConfig);
        } else {
            $config = $this->_getConfig('vizy', $this->vizyConfig) ?: [];
        }

        // Give plugins a chance to modify the config
        $event = new ModifyVizyConfigEvent([
            'config' => $config,
            'field' => $this
        ]);

        $this->trigger(self::EVENT_DEFINE_VIZY_CONFIG, $event);

        return $event->config;
    }

    private function _getConfig(string $dir, string $file = null)
    {
        if (!$file) {
            $file = 'Default.json';
        }

        $path = Craft::$app->getPath()->getConfigPath() . DIRECTORY_SEPARATOR . $dir . DIRECTORY_SEPARATOR . $file;

        if (!is_file($path)) {
            if ($file !== 'Default.json') {
                // Try again with Default
                return $this->_getConfig($dir);
            }
            return false;
        }

        return Json::decode(file_get_contents($path));
    }

    private function _getCustomConfigOptions(string $dir): array
    {
        $options = ['' => Craft::t('vizy', 'Default')];
        $path = Craft::$app->getPath()->getConfigPath() . DIRECTORY_SEPARATOR . $dir;

        if (is_dir($path)) {
            $files = FileHelper::findFiles($path, [
                'only' => ['*.json'],
                'recursive' => false
            ]);

            foreach ($files as $file) {
                $filename = basename($file);

                if ($filename !== 'Default.json') {
                    $options[$filename] = pathinfo($file, PATHINFO_FILENAME);
                }
            }
        }

        return $options;
    }

    private function _getLinkOptions(Element $element = null): array
    {
        $linkOptions = [];

        $sectionSources = $this->_getSectionSources($element);
        $categorySources = $this->_getCategorySources($element);

        if (!empty($sectionSources)) {
            $linkOptions[] = [
                'optionTitle' => Craft::t('vizy', 'Link to an entry'),
                'elementType' => Entry::class,
                'refHandle' => Entry::refHandle(),
                'sources' => $sectionSources,
                'criteria' => ['uri' => ':notempty:']
            ];
        }

        if (!empty($this->_getVolumeKeys())) {
            $linkOptions[] = [
                'optionTitle' => Craft::t('vizy', 'Link to an asset'),
                'elementType' => Asset::class,
                'refHandle' => Asset::refHandle(),
                'sources' => $this->_getVolumeKeys(),
            ];
        }

        if (!empty($categorySources)) {
            $linkOptions[] = [
                'optionTitle' => Craft::t('vizy', 'Link to a category'),
                'elementType' => Category::class,
                'refHandle' => Category::refHandle(),
                'sources' => $categorySources,
            ];
        }

        // Give plugins a chance to add their own
        $event = new RegisterLinkOptionsEvent([
            'linkOptions' => $linkOptions
        ]);
        $this->trigger(self::EVENT_REGISTER_LINK_OPTIONS, $event);
        $linkOptions = $event->linkOptions;

        // Fill in any missing ref handles
        foreach ($linkOptions as &$linkOption) {
            if (!isset($linkOption['refHandle'])) {
                /** @var ElementInterface|string $class */
                $class = $linkOption['elementType'];
                $linkOption['refHandle'] = $class::refHandle() ?? $class;
            }
        }

        return $linkOptions;
    }

    private function _getSectionSources(Element $element = null): array
    {
        $sources = [];
        $sections = Craft::$app->getSections()->getAllSections();
        $showSingles = false;

        // Get all sites
        $sites = Craft::$app->getSites()->getAllSites();

        foreach ($sections as $section) {
            if ($section->type === Section::TYPE_SINGLE) {
                $showSingles = true;
            } else if ($element) {
                $sectionSiteSettings = $section->getSiteSettings();

                foreach ($sites as $site) {
                    if (isset($sectionSiteSettings[$site->id]) && $sectionSiteSettings[$site->id]->hasUrls) {
                        $sources[] = 'section:' . $section->uid;
                    }
                }
            }
        }

        if ($showSingles) {
            array_unshift($sources, 'singles');
        }

        if (!empty($sources)) {
            array_unshift($sources, '*');
        }

        return $sources;
    }

    private function _getCategorySources(Element $element = null): array
    {
        $sources = [];

        if ($element) {
            $categoryGroups = Craft::$app->getCategories()->getAllGroups();

            foreach ($categoryGroups as $categoryGroup) {
                // Does the category group have URLs in the same site as the element we're editing?
                $categoryGroupSiteSettings = $categoryGroup->getSiteSettings();

                if (isset($categoryGroupSiteSettings[$element->siteId]) && $categoryGroupSiteSettings[$element->siteId]->hasUrls) {
                    $sources[] = 'group:' . $categoryGroup->uid;
                }
            }
        }

        return $sources;
    }

    private function _getVolumeKeys(): array
    {
        if (!$this->availableVolumes) {
            return [];
        }

        $criteria = ['parentId' => ':empty:'];

        $allVolumes = Craft::$app->getVolumes()->getAllVolumes();
        $allowedVolumes = [];
        $userService = Craft::$app->getUser();

        foreach ($allVolumes as $volume) {
            $allowedBySettings = $this->availableVolumes === '*' || (is_array($this->availableVolumes) && in_array($volume->uid, $this->availableVolumes));
            
            if ($allowedBySettings && ($this->showUnpermittedVolumes || $userService->checkPermission("viewVolume:{$volume->uid}"))) {
                $allowedVolumes[] = $volume->uid;
            }
        }

        $criteria['volumeId'] = Db::idsByUids('{{%volumes}}', $allowedVolumes);

        $folders = Craft::$app->getAssets()->findFolders($criteria);

        // Sort volumes in the same order as they are sorted in the CP
        $sortedVolumeIds = Craft::$app->getVolumes()->getAllVolumeIds();
        $sortedVolumeIds = array_flip($sortedVolumeIds);

        $volumeKeys = [];

        usort($folders, function($a, $b) use ($sortedVolumeIds) {
            // In case Temporary volumes ever make an appearance in RTF modals, sort them to the end of the list.
            $aOrder = $sortedVolumeIds[$a->volumeId] ?? PHP_INT_MAX;
            $bOrder = $sortedVolumeIds[$b->volumeId] ?? PHP_INT_MAX;

            return $aOrder - $bOrder;
        });

        foreach ($folders as $folder) {
            $volumeKeys[] = 'folder:' . $folder->uid;
        }

        return $volumeKeys;
    }

    private function _getTransforms(): array
    {
        if (!$this->availableTransforms) {
            return [];
        }

        $allTransforms = Craft::$app->getAssetTransforms()->getAllTransforms();
        $transformList = [];

        foreach ($allTransforms as $transform) {
            if (!is_array($this->availableTransforms) || in_array($transform->uid, $this->availableTransforms, false)) {
                $transformList[] = [
                    'handle' => Html::encode($transform->handle),
                    'name' => Html::encode($transform->name)
                ];
            }
        }

        return $transformList;
    }
}
