<?php
namespace verbb\vizy\integrations\feedme;

use verbb\vizy\document\DocumentParser;
use verbb\vizy\document\VizyDocument;
use verbb\vizy\legacy\LegacyDocumentConversionException;

use craft\helpers\Json;

use Throwable;

/**
 * Focused untrusted ingress boundary for Feed Me payloads.
 */
final class FeedMeDocumentAdapter
{
    // Public Methods
    // =========================================================================

    public function canonicalize(mixed $value): string
    {
        if (is_string($value) && $value !== '') {
            try {
                $decoded = Json::decode($value);
                if (is_array($decoded)) {
                    $value = $decoded;
                }
            } catch (Throwable) {
                // Non-JSON strings continue through TipTap's prose parser.
            }
        }

        if (is_array($value)) {
            if (
                ($value['type'] ?? null) === 'doc'
                && isset($value['attrs']['schemaVersion'])
            ) {
                try {
                    return (new DocumentParser())->parse($value)->toJson();
                } catch (Throwable $exception) {
                    throw new LegacyDocumentConversionException(
                        'Feed Me canonical document is invalid: ' . $exception->getMessage(),
                        0,
                        $exception,
                    );
                }
            }

            $content = array_is_list($value)
                ? $value
                : (($value['type'] ?? null) === 'doc' && is_array($value['content'] ?? null)
                    ? $value['content']
                    : null);
            if ($content !== null) {
                return $this->validateEnvelope($content);
            }
        }

        return '';
    }

    public function validateEnvelope(array $content): string
    {
        $envelope = [
            'type' => 'doc',
            'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
            'content' => $content,
        ];

        try {
            return (new DocumentParser())->parse($envelope)->toJson();
        } catch (Throwable $exception) {
            throw new LegacyDocumentConversionException(
                'Feed Me import must be structurally current canonical content: ' . $exception->getMessage(),
                0,
                $exception,
            );
        }
    }
}
