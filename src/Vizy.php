<?php
namespace verbb\vizy;

use verbb\vizy\base\PluginTrait;
use verbb\vizy\base\Routes;
use verbb\vizy\fields\VizyField;
use verbb\vizy\models\Settings;

use Craft;
use craft\base\Plugin;
use craft\events\RegisterComponentTypesEvent;
use craft\helpers\UrlHelper;
use craft\services\Fields;

use yii\base\Event;

class Vizy extends Plugin
{
    // Public Properties
    // =========================================================================

    public $schemaVersion = '0.9.0';
    public $hasCpSettings = true;
    public $hasCpSection = false;


    // Traits
    // =========================================================================

    use PluginTrait;
    use Routes;


    // Public Methods
    // =========================================================================

    public function init()
    {
        parent::init();

        self::$plugin = $this;

        $this->_setPluginComponents();
        $this->_setLogging();
        $this->_registerCpRoutes();
        $this->_registerFieldTypes();
        $this->_registerProjectConfigEventListeners();
    }

    public function getSettingsResponse()
    {
        Craft::$app->getResponse()->redirect(UrlHelper::cpUrl('vizy/settings'));
    }

    // Protected Methods
    // =========================================================================

    protected function createSettingsModel(): Settings
    {
        return new Settings();
    }


    // Private Methods
    // =========================================================================

    private function _registerFieldTypes()
    {
        Event::on(Fields::class, Fields::EVENT_REGISTER_FIELD_TYPES, function(RegisterComponentTypesEvent $event) {
            $event->types[] = VizyField::class;
        });
    }

    private function _registerProjectConfigEventListeners()
    {
        Craft::$app->projectConfig
            ->onAdd(Fields::CONFIG_FIELDS_KEY . '.{uid}', [$this->getService(), 'handleChangedField'])
            ->onUpdate(Fields::CONFIG_FIELDS_KEY . '.{uid}', [$this->getService(), 'handleChangedField'])
            ->onRemove(Fields::CONFIG_FIELDS_KEY . '.{uid}', [$this->getService(), 'handleDeletedField']);
    }
 
}
