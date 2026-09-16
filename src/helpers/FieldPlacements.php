<?php
namespace verbb\vizy\helpers;

use verbb\vizy\fields\VizyField;

use craft\base\ElementInterface;

final class FieldPlacements
{
    // Static Methods
    // =========================================================================

    public static function uid(ElementInterface $owner, VizyField $field): ?string
    {
        $uid = isset($field->layoutElement) ? $field->layoutElement?->uid : null;
        $matches = [];
        foreach ($owner->getFieldLayout()?->getCustomFieldElements() ?? [] as $placement) {
            $placed = $placement->getField();
            if ($placed->uid !== $field->uid) {
                continue;
            }
            if ($uid !== null) {
                if ($placement->uid === $uid) {
                    return $uid;
                }
            } elseif ($placed->handle === $field->handle) {
                $matches[] = $placement->uid;
            }
        }
        return count($matches) === 1 ? $matches[0] : null;
    }

    public static function field(ElementInterface $owner, string $fieldUid, ?string $placementUid): ?VizyField
    {
        $matches = [];
        foreach ($owner->getFieldLayout()?->getCustomFieldElements() ?? [] as $placement) {
            $field = $placement->getField();
            if ($field instanceof VizyField && $field->uid === $fieldUid) {
                if ($placementUid !== null && $placement->uid === $placementUid) {
                    return $field;
                }
                $matches[] = $field;
            }
        }
        // Older persisted work has no placement identity. It is safe to resume
        // only when the current owner still has a single matching placement.
        return $placementUid === null && count($matches) === 1 ? $matches[0] : null;
    }
}
