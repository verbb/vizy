<?php
namespace verbb\vizy;

use verbb\vizy\base\PluginTrait;
use verbb\vizy\base\Routes;
use verbb\vizy\elements\Block as BlockElement;
use verbb\vizy\elements\MatrixAnchor;
use verbb\vizy\fields\VizyField;
use verbb\vizy\gql\types\ArrayType;
use verbb\vizy\gql\types\VizyDocumentType;
use verbb\vizy\integrations\feedme\fields\Vizy as FeedMeVizyField;
use verbb\vizy\models\Settings;
use verbb\vizy\services\BlockTypes;
use verbb\vizy\services\EditorConfigs;

use Craft;
use craft\base\Element;
use craft\base\Plugin;
use craft\elements\ContentBlock;
use craft\elements\Entry;
use craft\events\CreateFieldLayoutFormEvent;
use craft\events\DefineFieldLayoutCustomFieldsEvent;
use craft\events\InvalidateElementCachesEvent;
use craft\events\ModelEvent;
use craft\events\RegisterComponentTypesEvent;
use craft\events\RegisterGqlTypesEvent;
use craft\events\SetEagerLoadedElementsEvent;
use craft\fieldlayoutelements\CustomField;
use craft\helpers\UrlHelper;
use craft\models\FieldLayout;
use craft\services\Elements;
use craft\services\Fields;
use craft\services\Gql;
use craft\services\ProjectConfig;
use craft\web\Controller;
use craft\web\Response;

use yii\base\ActionEvent;
use yii\base\Event;
use yii\db\Connection;

use craft\feedme\events\RegisterFeedMeFieldsEvent;
use craft\feedme\services\Fields as FeedMeFields;

class Vizy extends Plugin
{
    // Traits
    // =========================================================================

    use PluginTrait;
    use Routes;


    // Properties
    // =========================================================================

    public bool $hasCpSettings = true;
    public string $schemaVersion = '1.0.0';


    // Public Methods
    // =========================================================================

    public function init(): void
    {
        parent::init();

        self::$plugin = $this;

        $this->_registerFieldTypes();
        $this->_registerElementTypes();
        $this->_registerProjectConfigEventHandlers();
        $this->_registerGraphQl();
        $this->_registerEventHandlers();
        Craft::$app->getView()->registerCpTwigExtension(new web\twig\VizyCpExtension());

        if (Craft::$app->getRequest()->getIsCpRequest()) {
            $this->_registerCpRoutes();
        }
    }

    public function getSettingsResponse(): mixed
    {
        return Craft::$app->getResponse()->redirect(UrlHelper::cpUrl('vizy/settings'));
    }


    // Protected Methods
    // =========================================================================

    protected function createSettingsModel(): Settings
    {
        return new Settings();
    }


    // Private Methods
    // =========================================================================

    private function _registerFieldTypes(): void
    {
        Event::on(Fields::class, Fields::EVENT_REGISTER_FIELD_TYPES, function(RegisterComponentTypesEvent $event) {
            $event->types[] = VizyField::class;
        });
    }

    private function _registerElementTypes(): void
    {
        Event::on(Elements::class, Elements::EVENT_REGISTER_ELEMENT_TYPES, function(RegisterComponentTypesEvent $event) {
            $event->types[] = MatrixAnchor::class;
        });
    }

    private function _registerProjectConfigEventHandlers(): void
    {
        Craft::$app->getProjectConfig()
            ->onAdd(BlockTypes::PROJECT_CONFIG_PATH . '.{uid}', [$this->getBlockTypes(), 'handleChangedBlockType'])
            ->onUpdate(BlockTypes::PROJECT_CONFIG_PATH . '.{uid}', [$this->getBlockTypes(), 'handleChangedBlockType'])
            ->onRemove(BlockTypes::PROJECT_CONFIG_PATH . '.{uid}', [$this->getBlockTypes(), 'handleDeletedBlockType'])
            ->onAdd(EditorConfigs::PROJECT_CONFIG_PATH . '.{id}', [$this->getEditorConfigs(), 'handleChangedConfig'])
            ->onUpdate(EditorConfigs::PROJECT_CONFIG_PATH . '.{id}', [$this->getEditorConfigs(), 'handleChangedConfig'])
            ->onRemove(EditorConfigs::PROJECT_CONFIG_PATH . '.{id}', [$this->getEditorConfigs(), 'handleDeletedConfig']);
    }

    private function _registerGraphQl(): void
    {
        Event::on(Gql::class, Gql::EVENT_REGISTER_GQL_TYPES, function(RegisterGqlTypesEvent $event) {
            $event->types[] = VizyDocumentType::class;
            $event->types[] = ArrayType::class;
            $event->types[] = \verbb\vizy\gql\interfaces\VizyNodeInterface::class;
            $event->types[] = \verbb\vizy\gql\interfaces\VizyMarkInterface::class;
            $event->types[] = \verbb\vizy\gql\interfaces\VizyBlockInterface::class;
        });
    }

    private function _registerEventHandlers(): void
    {
        Event::on(Elements::class, Elements::EVENT_INVALIDATE_CACHES, function(InvalidateElementCachesEvent $event) {
            // Raw migrations invalidate all element caches after their outer
            // commit. Reload persisted validation state in long-lived callers.
            if (in_array('element', $event->tags, true)) {
                $this->getContentBaselines()->clear();
            }
        });
        Event::on(Elements::class, Elements::EVENT_AFTER_SAVE_ELEMENT, [$this->getAssetUploads(), 'handleAfterSave']);
        Event::on(Response::class, Response::EVENT_BEFORE_SEND, [$this->getEditorAcknowledgements(), 'augmentResponse']);
        $db = Craft::$app->getDb();
        $db->on(Connection::EVENT_COMMIT_TRANSACTION, [$this->getAssetUploads(), 'handleTransactionCommit']);
        $db->on(Connection::EVENT_ROLLBACK_TRANSACTION, [$this->getAssetUploads(), 'handleTransactionRollback']);

        // Nested fields inside Vizy blocks should never render as static/read-only.
        Event::on(FieldLayout::class, FieldLayout::EVENT_CREATE_FORM, function(CreateFieldLayoutFormEvent $event) {
            $element = $event->element;

            if ($element instanceof BlockElement) {
                $event->static = false;
                return;
            }

            if ($element instanceof MatrixAnchor) {
                $event->static = false;
                return;
            }

            if ($element instanceof Entry && $element->getOwner() instanceof BlockElement) {
                $event->static = false;
            }

            if ($element instanceof Entry && $element->getOwner() instanceof MatrixAnchor) {
                $event->static = false;
            }
        });

        // Block Type FLD: hide nested-owner fields from the existing-field library.
        // (New-field type menus are gated separately via vizyBlockTypeLayout + JS.)
        Event::on(FieldLayout::class, FieldLayout::EVENT_DEFINE_CUSTOM_FIELDS, function(DefineFieldLayoutCustomFieldsEvent $event) {
            $layout = $event->sender;
            if (!$layout instanceof FieldLayout || $layout->type !== BlockElement::class) {
                return;
            }

            $lifecycle = self::getInstance()?->getFieldLifecycle();
            if (!$lifecycle) {
                return;
            }

            foreach ($event->fields as $groupName => &$fields) {
                $fields = array_values(array_filter(
                    $fields,
                    static function(mixed $element) use ($lifecycle): bool {
                        if (!$element instanceof CustomField) {
                            return true;
                        }
                        $field = $element->getField();
                        return $field !== null && $lifecycle->permitsNewPlacement($field);
                    },
                ));
            }
            unset($fields);
        });

        // Block Type FLD “New field” / edit-field slideout: strip nested-owner types
        // from Craft’s field-type menu when the designer passes vizyBlockTypeLayout=1.
        Event::on(Fields::class, Fields::EVENT_REGISTER_FIELD_TYPES, function(RegisterComponentTypesEvent $event) {
            $request = Craft::$app->getRequest();
            if ($request->getIsConsoleRequest() || !$request->getParam('vizyBlockTypeLayout')) {
                return;
            }

            $lifecycle = self::getInstance()?->getFieldLifecycle();
            if (!$lifecycle) {
                return;
            }

            $event->types = array_values(array_filter(
                $event->types,
                static fn(string $class): bool => $lifecycle->permitsNewPlacementClass($class),
            ));
        });

        // Hijack requests to `actions/matrix/create-entry` to handle non-saved-element owners.
        Event::on(Controller::class, Controller::EVENT_BEFORE_ACTION, function(ActionEvent $event) {
            if ($event->action->id == 'create-entry' && $event->sender->id == 'matrix') {
                $ownerElementType = $event->sender->request->getParam('ownerElementType');

                // Only override things if this is coming from a Vizy field
                if ($ownerElementType === BlockElement::class) {
                    Craft::$app->runAction('vizy/field/create-matrix-entry')->send();
                }
            }
        });

        // Content Blocks within Vizy Blocks will try and save immediately, so we need to prevent that.
        Event::on(ContentBlock::class, ContentBlock::EVENT_BEFORE_SAVE, function(ModelEvent $event) {
            $contentBlock = $event->sender;

            if ($contentBlock->getOwner() instanceof BlockElement) {
                $event->isValid = false;
            }
        });

        Event::on(Element::class, Element::EVENT_BEFORE_DELETE, function(ModelEvent $event) {
            Vizy::$plugin->getAnchors()->prepareOwnerDeletion($event->sender);
        });

        Event::on(Element::class, Element::EVENT_AFTER_RESTORE, function(Event $event) {
            Vizy::$plugin->getAnchors()->restoreAnchorsForOwner($event->sender);
        });

        // Handle an issue with Matrix fields in Vizy blocks, that have relation fields that are also eager-loaded. More noticable in GQL.
        // We need to essentially turn off eager-loading for relational fields in the Matrix field, because we can't figure out a way for
        // a Vizy Block Type to be a field layout provider, and to set the correct eager loading field handle.
        // https://www.loom.com/share/857e3b55a67e449286fd8cb2ee245e2e
        Event::on(Entry::class, Entry::EVENT_SET_EAGER_LOADED_ELEMENTS, function(SetEagerLoadedElementsEvent $event) {
            // Check first if we're rendering any Matrix fields in a Vizy block
            $vizyMatrixFields = Vizy::$plugin->getNestedMatrixFields();

            // Check if this entry is being rendered in the Vizy Block's Matrix field, and disable eager-loading
            if ($vizyMatrixFields && $field = $event->sender->getField()) {
                if (in_array($field->handle, $vizyMatrixFields)) {
                    $event->handled = true;
                }
            }
        });

        if (class_exists(FeedMeFields::class)) {
            Event::on(FeedMeFields::class, FeedMeFields::EVENT_REGISTER_FEED_ME_FIELDS, function(RegisterFeedMeFieldsEvent $event) {
                $event->fields[] = FeedMeVizyField::class;
            });
        }
    }
}
