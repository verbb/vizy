<?php
namespace verbb\vizy\content;

use verbb\vizy\Vizy;
use verbb\vizy\fields\VizyField;

use craft\base\FieldInterface;

/** Vizy owns canonical and provenance-backed legacy container grammar. */
final class RawContentAdapter
{
    // Public Methods
    // =========================================================================

    public function fieldClass(): string
    {
        return VizyField::class;
    }

    public function captureSchema(FieldInterface $field): array
    {
        $types = [];
        // Stored content may use types no longer offered in the field's picker.
        foreach (Vizy::$plugin->getBlockTypes()->getAllBlockTypes() as $type) {
            $placements = [];
            $layout = $type->getFieldLayout();
            foreach ($layout?->getCustomFieldElements() ?? [] as $placement) {
                $placements[$placement->uid] = ['placementUid' => $placement->uid, 'fieldUid' => $placement->getFieldUid(), 'layoutUid' => $layout->uid];
            }
            $types[$type->uid] = $placements;
        }
        return ['types' => $types, 'legacy' => $field->getLegacySchemaMap()];
    }

    public function transform(mixed $value, array $schema, callable $visit): mixed
    {
        return Vizy::$plugin->getDocuments()->transformRawValue($value, $schema, $visit);
    }
}
