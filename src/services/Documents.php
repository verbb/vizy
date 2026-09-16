<?php
namespace verbb\vizy\services;

use verbb\vizy\document\DocumentParser;
use verbb\vizy\document\DocumentSerializer;
use verbb\vizy\document\InvalidDocumentException;
use verbb\vizy\document\RawDocument;
use verbb\vizy\document\VizyDocument;
use verbb\vizy\fields\VizyField;
use verbb\vizy\legacy\Vizy3DocumentAdapter;

use craft\base\Component;
use craft\base\ElementInterface;
use craft\helpers\Json;

use Throwable;

/**
 * Sole persisted-representation edge for canonical Vizy documents.
 */
final class Documents extends Component
{
    // Properties
    // =========================================================================

    private DocumentParser $parser;
    private DocumentSerializer $serializer;
    private Vizy3DocumentAdapter $legacyAdapter;


    // Public Methods
    // =========================================================================

    public function init(): void
    {
        parent::init();
        $this->parser = new DocumentParser();
        $this->serializer = new DocumentSerializer();
        $this->legacyAdapter = new Vizy3DocumentAdapter();
    }

    /** Raw migration edge: captured schema, no current field interpretation or save lifecycle. */
    public function transformRawValue(mixed $value, array $schema, callable $visit): mixed
    {
        return (new RawDocument())->transform($value, $schema, $visit);
    }

    public function normalizeValue(
        mixed $value,
        ElementInterface $owner,
        VizyField $field,
    ): VizyDocument {
        if ($value instanceof VizyDocument) {
            return $value->owner() === $owner && $value->field() === $field
                ? $value
                : $value->recontextualize($owner, $field);
        }

        return $this->_normalizeDecoded($value, $owner, $field, $field->getLegacySchemaMap());
    }

    public function serializeValue(VizyDocument $document): string
    {
        // Pure projection — Asset fingerprint/retry must not write Matrix.
        return Json::encode($this->serializer->serialize($document, false));
    }

    /**
     * Owner-save path: MatrixAnchor sync then pure canonical JSON.
     */
    public function serializeForPersistence(VizyDocument $document): string
    {
        return Json::encode($this->serializer->serialize($document, true));
    }

    /**
     * @internal Migration, tests, and future Builder only.
     */
    public function normalizeDetached(mixed $value, ?array $legacySchemaMap = null): VizyDocument
    {
        return $this->_normalizeDecoded($value, null, null, $legacySchemaMap);
    }


    // Private Methods
    // =========================================================================

    private function _normalizeDecoded(
        mixed $value,
        ?ElementInterface $owner,
        ?VizyField $field,
        ?array $legacySchemaMap,
    ): VizyDocument {
        if ($value === null || $value === '') {
            return VizyDocument::empty($owner, $field);
        }

        if (is_string($value)) {
            try {
                $value = Json::decode($value);
            } catch (Throwable $exception) {
                throw new InvalidDocumentException('Malformed persisted Vizy JSON.', 0, $exception);
            }
        }

        if (!is_array($value)) {
            throw new InvalidDocumentException('Vizy field values must decode to an object or node list.');
        }

        if (($value['type'] ?? null) === 'doc') {
            return $this->parser->parse($value, $owner, $field);
        }

        if (!array_is_list($value)) {
            throw new InvalidDocumentException('Unrecognized persisted Vizy representation.');
        }
        if ($legacySchemaMap === null) {
            throw new InvalidDocumentException(
                $field
                    ? 'This Vizy field still has Vizy 3 content, but it has not been upgraded to Vizy 4 yet.'
                        . ' Run the Vizy 3 → 4 upgrade for field “' . ($field->handle ?: $field->name) . '” first.'
                    : 'Cannot convert Vizy 3 content here without an upgrade schema map for that field.'
            );
        }

        $canonical = $this->legacyAdapter->convert($value, $legacySchemaMap);
        return $this->parser->parse($canonical, $owner, $field);
    }
}
