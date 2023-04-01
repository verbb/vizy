<?php
namespace verbb\vizy;

use verbb\vizy\base\PluginTrait;
use verbb\vizy\base\Routes;
use verbb\vizy\fields\VizyField;
use verbb\vizy\gql\interfaces\VizyNodeInterface;
use verbb\vizy\gql\interfaces\VizyBlockInterface;
use verbb\vizy\integrations\feedme\fields\Vizy as FeedMeVizyField;
use verbb\vizy\models\Settings;

use Craft;
use craft\base\Model;
use craft\base\Plugin;
use craft\events\RegisterComponentTypesEvent;
use craft\events\RegisterGqlTypesEvent;
use craft\helpers\UrlHelper;
use craft\services\Fields;
use craft\services\Gql;
use craft\services\ProjectConfig;

use yii\base\Event;

use verbb\supertable\services\Service as SuperTableService;

use craft\feedme\events\RegisterFeedMeFieldsEvent;
use craft\feedme\services\Fields as FeedMeFields;

class Vizy extends Plugin
{
    // Properties
    // =========================================================================

    public bool $hasCpSection = false;
    public bool $hasCpSettings = true;
    public string $schemaVersion = '0.9.0';


    // Traits
    // =========================================================================

    use PluginTrait;
    use Routes;


    // Public Methods
    // =========================================================================

    public function init(): void
    {
        parent::init();

        self::$plugin = $this;

        $this->_registerComponents();
        $this->_registerLogTarget();
        $this->_registerFieldTypes();
        $this->_registerProjectConfigEventListeners();
        $this->_registerGraphQl();
        $this->_registerThirdPartyEventListeners();

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

    private function _registerProjectConfigEventListeners(): void
    {
        Craft::$app->projectConfig
            ->onAdd(ProjectConfig::PATH_FIELDS . '.{uid}', [$this->getService(), 'handleChangedField'])
            ->onUpdate(ProjectConfig::PATH_FIELDS . '.{uid}', [$this->getService(), 'handleChangedField'])
            ->onRemove(ProjectConfig::PATH_FIELDS . '.{uid}', [$this->getService(), 'handleDeletedField']);

        // Special case for some fields like Matrix, that don't emit the change event for nested fields.
        Craft::$app->projectConfig
            ->onAdd(ProjectConfig::PATH_MATRIX_BLOCK_TYPES . '.{uid}', [$this->getService(), 'handleChangedBlockType'])
            ->onUpdate(ProjectConfig::PATH_MATRIX_BLOCK_TYPES . '.{uid}', [$this->getService(), 'handleChangedBlockType'])
            ->onRemove(ProjectConfig::PATH_MATRIX_BLOCK_TYPES . '.{uid}', [$this->getService(), 'handleDeletedBlockType']);

        if (class_exists(SuperTableService::class)) {
            Craft::$app->projectConfig
                ->onAdd(SuperTableService::CONFIG_BLOCKTYPE_KEY . '.{uid}', [$this->getService(), 'handleChangedBlockType'])
                ->onUpdate(SuperTableService::CONFIG_BLOCKTYPE_KEY . '.{uid}', [$this->getService(), 'handleChangedBlockType'])
                ->onRemove(SuperTableService::CONFIG_BLOCKTYPE_KEY . '.{uid}', [$this->getService(), 'handleDeletedBlockType']);
        }
    }

    private function _registerGraphQl(): void
    {
        Event::on(Gql::class, Gql::EVENT_REGISTER_GQL_TYPES, function(RegisterGqlTypesEvent $event) {
            $event->types[] = VizyNodeInterface::class;
            $event->types[] = VizyBlockInterface::class;
        });
    }

    private function _registerThirdPartyEventListeners(): void
    {
        if (class_exists(FeedMeFields::class)) {
            Event::on(FeedMeFields::class, FeedMeFields::EVENT_REGISTER_FEED_ME_FIELDS, function(RegisterFeedMeFieldsEvent $event) {
                $event->fields[] = FeedMeVizyField::class;
            });
        }
    }
}
