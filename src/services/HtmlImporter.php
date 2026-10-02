<?php
namespace verbb\vizy\services;

use verbb\vizy\Vizy;
use verbb\vizy\events\RegisterHtmlImportRulesEvent;
use verbb\vizy\fields\VizyField;
use verbb\vizy\importers\HtmlImportConverter;
use verbb\vizy\importers\HtmlImportException;
use verbb\vizy\importers\HtmlImportOptions;
use verbb\vizy\importers\HtmlImportResult;
use verbb\vizy\importers\HtmlImportRule;

use craft\base\Component;

use RuntimeException;

/**
 * Public, read-only boundary for schema-aware HTML-to-document conversion.
 */
final class HtmlImporter extends Component
{
    // Constants
    // =========================================================================

    public const EVENT_REGISTER_RULES = 'registerRules';


    // Public Methods
    // =========================================================================

    public function convert(
        string $html,
        VizyField $field,
        ?HtmlImportOptions $options = null,
    ): HtmlImportResult {
        $options ??= new HtmlImportOptions();
        $event = new RegisterHtmlImportRulesEvent(['field' => $field]);
        $this->trigger(self::EVENT_REGISTER_RULES, $event);

        if (!array_is_list($event->rules)) {
            throw new RuntimeException('RegisterHtmlImportRulesEvent::rules must be a list.');
        }

        foreach ($event->rules as $index => $rule) {
            if (!$rule instanceof HtmlImportRule) {
                throw new RuntimeException("HTML import rule {$index} must be an HtmlImportRule.");
            }
        }

        $manifest = Vizy::$plugin->getEditorManifests()->build($field);
        $result = (new HtmlImportConverter($field, $manifest, $options, $event->rules))->convert($html);

        if ($options->strict && !$result->isLossless()) {
            throw new HtmlImportException('Strict HTML import refused a lossy conversion.', $result);
        }

        return $result;
    }
}
