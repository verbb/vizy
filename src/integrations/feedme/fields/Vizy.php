<?php
namespace verbb\vizy\integrations\feedme\fields;

use verbb\vizy\Vizy as VizyPlugin;
use verbb\vizy\fields\VizyField;
use verbb\vizy\importers\HtmlImportException;
use verbb\vizy\importers\HtmlImportOptions;
use verbb\vizy\importers\HtmlImportResult;
use verbb\vizy\integrations\feedme\FeedMeDocumentAdapter;

use Cake\Utility\Hash;
use craft\feedme\base\Field;
use craft\feedme\base\FieldInterface;
use craft\feedme\Plugin as FeedMe;

class Vizy extends Field implements FieldInterface
{
    // Properties
    // =========================================================================

    public static $name = 'Vizy';
    public static $class = VizyField::class;


    // Public Methods
    // =========================================================================

    // Templates

    public function getMappingTemplate(): string
    {
        return 'vizy/_integrations/feed-me/fields/vizy';
    }

    public function parseField(): string
    {
        $value = $this->fetchValue() ?? null;

        $adapter = new FeedMeDocumentAdapter();

        if ($canonical = $adapter->canonicalize($value)) {
            return $canonical;
        }

        $options = new HtmlImportOptions(
            strict: (bool)Hash::get($this->fieldInfo, 'options.strictHtml', false),
        );

        try {
            $result = VizyPlugin::$plugin->getHtmlImporter()->convert(
                $adapter->html($value),
                $this->field,
                $options,
            );
        } catch (HtmlImportException $exception) {
            if ($exception->result()) {
                $this->_logDiagnostics($exception->result(), true);
            }

            throw $exception;
        }

        $this->_logDiagnostics($result, false);

        return $result->document()->toJson();
    }

    // Private Methods
    // =========================================================================

    private function _logDiagnostics(HtmlImportResult $result, bool $error): void
    {
        foreach ($result->diagnostics() as $diagnostic) {
            $message = 'Vizy HTML import for {field} reported {code} at {path}: {message}';
            $params = [
                'field' => $this->fieldHandle,
                'code' => $diagnostic->code,
                'path' => $diagnostic->path,
                'message' => $diagnostic->message,
            ];

            if ($error) {
                FeedMe::error($message, $params);
            } else {
                FeedMe::info($message, $params);
            }
        }
    }
}
