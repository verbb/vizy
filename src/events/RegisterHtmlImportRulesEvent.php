<?php
namespace verbb\vizy\events;

use verbb\vizy\fields\VizyField;

use yii\base\Event;

/**
 * Adds declarative HTML rules for custom nodes and marks enabled on one field.
 */
final class RegisterHtmlImportRulesEvent extends Event
{
    // Properties
    // =========================================================================

    public array $rules = [];
    public ?VizyField $field = null;
}
