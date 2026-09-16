<?php
namespace verbb\vizy\helpers;

use verbb\vizy\fields\VizyField;

use craft\base\ElementInterface;
use craft\base\FieldInterface;
use craft\fields\BaseRelationField;
use craft\fields\Checkboxes;
use craft\fields\Date;
use craft\fields\Json as JsonField;
use craft\fields\Link;
use craft\fields\MultiSelect;
use craft\fields\Table;
use craft\helpers\Json;

/**
 * Prepares Block fieldSlots values before Element::setFieldValue.
 *
 * Client transport and legacy stored shapes sometimes differ from what Craft
 * field normalizeValue expects on an ephemeral Block.
 */
final class FieldSlotValues
{
    // Static Methods
    // =========================================================================

    /**
     * Shape a raw fieldSlots value for Element::setFieldValue.
     *
     * `$raw` is the value from Block `attrs.fieldSlots[placementUid]`.
     */
    public static function forSetFieldValue(
        FieldInterface $field,
        mixed $raw,
        ?ElementInterface $element = null,
    ): mixed {
        // Hosted Vizy: convert V3 bare lists/strings via the nested field's
        // provenance before the Block form / serializer touch the value.
        // Element::setFieldValue will normalize again; VizyDocument is idempotent.
        if ($field instanceof VizyField && $element !== null) {
            return $field->normalizeValue($raw, $element);
        }

        // Craft Json only JSON-decodes on normalizeValueFromRequest. Leftover
        // textarea strings (pre-craft.json adapter) would display double-encoded.
        if ($field instanceof JsonField && is_string($raw) && $element !== null) {
            return $field->normalizeValueFromRequest($raw, $element);
        }

        // Vizy 3 nested some Craft values as JSON text inside TipTap fieldSlots
        // (Link objects, Checkboxes arrays, relation id lists, Tables). Only
        // those structured field types decode — never Plain Text / other text,
        // or legitimate `["red","blue"]` content becomes an array and throws.
        if (self::_needsLegacyJsonTextDecode($field) && is_string($raw) && $raw !== '' && ($raw[0] === '{' || $raw[0] === '[')) {
            $decoded = Json::decodeIfJson($raw);
            if ($decoded !== $raw) {
                $raw = $decoded;
            }
        }

        if ($field instanceof Date && is_array($raw)) {
            return self::collapseDateRequestScalars($raw);
        }

        return $raw;
    }

    /**
     * Craft Date+Time inputHtml emits locale (and sometimes timezone) from both
     * date.twig and time.twig. PHP form POST last-wins; poisoned fieldSlots may
     * still hold string[] from an older craft.generic that promoted duplicates.
     * DateTimeHelper::getLocaleById() requires a string.
     */
    public static function collapseDateRequestScalars(array $value): array
    {
        foreach (['locale', 'timezone'] as $key) {
            if (!array_key_exists($key, $value) || !is_array($value[$key])) {
                continue;
            }

            // Same as PHP last-wins for duplicate form names.
            $last = null;
            foreach ($value[$key] as $item) {
                if (is_string($item) || is_int($item) || is_float($item)) {
                    $last = (string)$item;
                }
            }

            if ($last !== null) {
                $value[$key] = $last;
            } else {
                unset($value[$key]);
            }
        }

        return $value;
    }

    /**
     * Field types whose Vizy 3 TipTap storage used JSON text for structured
     * values. Text-like fields must never infer format from the first character.
     */
    private static function _needsLegacyJsonTextDecode(FieldInterface $field): bool
    {
        return $field instanceof Link
            || $field instanceof Checkboxes
            || $field instanceof MultiSelect
            || $field instanceof Table
            || $field instanceof BaseRelationField;
    }
}
