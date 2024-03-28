<?php
namespace verbb\vizy;

use verbb\vizy\base\PluginTrait;
use verbb\vizy\base\Routes;
use verbb\vizy\elements\Block as BlockElement;
use verbb\vizy\fields\VizyField;
use verbb\vizy\gql\interfaces\VizyNodeInterface;
use verbb\vizy\gql\interfaces\VizyBlockInterface;
use verbb\vizy\integrations\feedme\fields\Vizy as FeedMeVizyField;
use verbb\vizy\models\Settings;

use Craft;
use craft\base\Plugin;
use craft\events\RegisterComponentTypesEvent;
use craft\events\RegisterGqlTypesEvent;
use craft\helpers\UrlHelper;
use craft\services\Fields;
use craft\services\Gql;
use craft\services\ProjectConfig;
use craft\web\Controller;

use yii\base\ActionEvent;
use yii\base\Event;

use craft\feedme\events\RegisterFeedMeFieldsEvent;
use craft\feedme\services\Fields as FeedMeFields;

class Vizy extends Plugin
{
    // Properties
    // =========================================================================

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

        $this->_registerFieldTypes();
        $this->_registerProjectConfigEventHandlers();
        $this->_registerGraphQl();
        $this->_registerEventHandlers();

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

    private function _registerProjectConfigEventHandlers(): void
    {
        Craft::$app->getProjectConfig()
            ->onAdd(ProjectConfig::PATH_FIELDS . '.{uid}', [$this->getService(), 'handleChangedField'])
            ->onUpdate(ProjectConfig::PATH_FIELDS . '.{uid}', [$this->getService(), 'handleChangedField'])
            ->onRemove(ProjectConfig::PATH_FIELDS . '.{uid}', [$this->getService(), 'handleDeletedField']);
    }

    private function _registerGraphQl(): void
    {
        Event::on(Gql::class, Gql::EVENT_REGISTER_GQL_TYPES, function(RegisterGqlTypesEvent $event) {
            $event->types[] = VizyNodeInterface::class;
            $event->types[] = VizyBlockInterface::class;
        });
    }

    private function _registerEventHandlers(): void
    {
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

        if (class_exists(FeedMeFields::class)) {
            Event::on(FeedMeFields::class, FeedMeFields::EVENT_REGISTER_FEED_ME_FIELDS, function(RegisterFeedMeFieldsEvent $event) {
                $event->fields[] = FeedMeVizyField::class;
            });
        }
    }
}
