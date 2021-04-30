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

        return $view->renderTemplate('vizy/field/settings', [
            'idPrefix' => $idPrefix,
            'field' => $this,
            'vizyConfigOptions' => $this->_getCustomConfigOptions('vizy'),
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
        if (!$element instanceof BlockElement) {
            $view->registerAssetBundle(VizyAsset::class);
            $view->registerJs('new Craft.Vizy.Input(' .
                '"' . $view->namespaceInputId($id) . '", ' .
                '"' . $view->namespaceInputName($this->handle) . '"' .
            ');');
        }

        return $view->renderTemplate('vizy/field/input', [
            'id' => $id,
            'name' => $this->handle,
            'field' => $this,
            'value' => Json::encode($value->getRawNodes(), JSON_UNESCAPED_UNICODE),
            'settings' => Json::encode($settings, JSON_UNESCAPED_UNICODE),
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

        // Convert serialized data to a collection of nodes
        $value = new NodeCollection($this, $value);

        return $value;
    }

    public function serializeValue($value, ElementInterface $element = null)
    {
        if ($value instanceof NodeCollection) {
            // For any nested Vizy fields, we want to deserialie the JSON from the front-end and expand
            // it to a normal array. This helps with particularly character encoding and htmlentities.
            $values = $value->getRawNodes() ?? [];

            foreach ($values as $valueKey => $value) {
                $type = $value['type'] ?? null;

                if ($type === 'vizyBlock') {
                    $fields = $value['attrs']['values']['content']['fields'] ?? [];

                    foreach ($fields as $fieldKey => $field) {
                        if (is_string($field)) {
                            if (substr($field, 0, 2) === '[{') {
                                $field = Json::decodeIfJson($field);
                            }

                            $values[$valueKey]['attrs']['values']['content']['fields'][$fieldKey] = $field;
                        }
                    }
                }
            }

            return $values;
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

        // For some reason, the field's settings are empty here, despite having values...
        $currentFieldData = $this->_getCurrentFieldData();

        // Prepare the setting data to be saved
        if ($fieldData = $request->getParam('fieldData')) {
            $this->fieldData = Json::decode($fieldData);

            foreach ($this->fieldData as $groupKey => $group) {
                foreach ($group['blockTypes'] as $blockTypeKey => $blockType) {
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

                        // Don't save anything if there's no data
                        if ($elementPlacements && $elementConfigs) {
                            $fieldLayout = $this->assembleLayout($elementPlacements, $elementConfigs, $layoutUid);
                            $fieldLayout->type = BlockType::class;
                            Craft::$app->getFields()->saveLayout($fieldLayout);

                            $blockType->layoutUid = $fieldLayout->uid;
                        }

                        if (!$blockType->validate()) {
                            foreach ($blockType->getErrors() as $key => $error) {
                                $errors[$blockType->id . ':' . $key] = $error;
                            }

                            continue;
                        }

                        // Override with our cleaned model data
                        $this->fieldData[$groupKey]['blockTypes'][$blockTypeKey] = $blockType->serializeArray();
                    } catch (\Throwable $e) {
                        // Craft::dd($e->getMessage());

                        return false;
                    }
                }
            }
        }

        if ($errors) {
            $this->addErrors($errors);

            return false;
        }

        // Have we deleted any blocks? Ensure we clean up any field layouts
        $layoutsToDelete = [];

        foreach ($currentFieldData as $group) {
            // Is this a deleted group?
            $hasGroup = ArrayHelper::firstWhere($this->fieldData, 'id', $group['id']);

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

        // Delete any layouts we need to delete for deleted blocks/groups
        if ($layoutsToDelete) {
            foreach ($layoutsToDelete as $fieldLayoutUid) {
                if ($layout = Vizy::$plugin->getService()->getFieldLayoutByUid($fieldLayoutUid)) {
                    Craft::$app->getFields()->deleteLayout($layout);
                }
            }
        }

        // Prevent any empty blocks. Throws an error in `unpackAssociativeArray`.
        foreach ($this->fieldData as $groupKey => $group) {
            $blocks = $group['blockTypes'] ?? [];

            if (!$blocks) {
                unset($this->fieldData[$groupKey]['blockTypes']);
            }
        }

        return true;
    }

    public function beforeElementSave(ElementInterface $element, bool $isNew): bool
    {
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

                            $fieldData = $block->attrs['values']['content']['fields'][$field->handle] ?? [];

                            // If this is a nested Vizy block?
                            if ($field instanceof $this) {
                                // Prep the collection so we can run this again for the nested field
                                $fieldData = new NodeCollection($field, $fieldData);
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

    public function getContentGqlType()
    {
        return NodeCollectionType::getType($this);
    }


    // Private Methods
    // =========================================================================

    private function _getCurrentFieldData()
    {
        $data = [];

        if ($this->id) {
            $settings = (new Query())
                ->select(['settings',])
                ->from(Table::FIELDS)
                ->where(['id' => $this->id])
                ->scalar();

            $data = Json::decodeIfJson($settings)['fieldData'] ?? [];
        }

        return $data;
    }

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
                $blockType = new BlockType($blockTypeData);
                $blockTypeArray = $blockType->toArray();

                // Watch for Vue's reactivity with arrays/objects. Easier to just implement here.
                // Never actually stored in the DB, but needed for field layout designer
                $blockTypeArray['layout'] = [];

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
        }

        return $data;
    }

    private function _getBlocksForInput($value, $placeholderKey, ElementInterface $element = null)
    {
        $view = Craft::$app->getView();

        $blocks = [];

        if ($value && $value instanceof NodeCollection) {
            foreach ($value->getNodes() as $key => $block) {
                if ($block instanceof VizyBlock) {
                    $blockId = $block->attrs['id'];
                    $fieldData = $block->attrs['values']['content']['fields'] ?? [];

                    $fieldLayout = $block->getFieldLayout();

                    if (!$fieldLayout) {
                        continue;
                    }

                    $view->startJsBuffer();

                    // Create a fake element with the same fieldtype as our block
                    $blockElement = new BlockElement();
                    $blockElement->setFieldLayout($fieldLayout);
                    $blockElement->setFieldValues($fieldData);

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
