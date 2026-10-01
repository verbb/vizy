<?php
namespace verbb\vizy\helpers;

use verbb\vizy\elements\Block;
use verbb\vizy\fields\VizyField;

use craft\base\ElementInterface;
use craft\helpers\Json;

/**
 * Stable identity for the Vizy document that owns a Matrix-bearing block.
 *
 * Block UIDs are unique within a document, not across every placement of a
 * field on an owner. The placement path therefore forms part of anchor
 * ownership so repeated and Hosted Vizy documents cannot share Matrix rows.
 */
final class AnchorDocuments
{
    public static function key(ElementInterface $owner, VizyField $field): ?string
    {
        $placementUid = FieldPlacements::uid($owner, $field);

        if ($placementUid === null) {
            return null;
        }

        if (!$owner instanceof Block) {
            return hash('sha256', Json::encode([
                'placementUid' => $placementUid,
                'fieldUid' => $field->uid,
            ]));
        }

        $parentKey = self::key($owner->getOwner(), $owner->getField());
        return $parentKey === null
            ? null
            : self::nestedKey($parentKey, $owner->getBlockUid(), $placementUid, $field->uid);
    }

    public static function nestedKey(
        string $parentKey,
        string $blockUid,
        string $placementUid,
        string $fieldUid,
    ): string {
        return hash('sha256', Json::encode([
            'parentKey' => $parentKey,
            'blockUid' => $blockUid,
            'placementUid' => $placementUid,
            'fieldUid' => $fieldUid,
        ]));
    }

    public static function keyFromEditorContext(array $context): ?string
    {
        $rootPlacementUid = $context['ownerPlacementUid'] ?? null;
        $rootFieldUid = $context['entryFieldUid'] ?? $context['fieldUid'] ?? null;

        if (!is_string($rootPlacementUid) || $rootPlacementUid === '' || !is_string($rootFieldUid) || $rootFieldUid === '') {
            return null;
        }

        $key = hash('sha256', Json::encode([
            'placementUid' => $rootPlacementUid,
            'fieldUid' => $rootFieldUid,
        ]));

        foreach ($context['hostedPath'] ?? [] as $step) {
            if (
                !is_array($step)
                || !is_string($step['blockUid'] ?? null)
                || $step['blockUid'] === ''
                || !is_string($step['placementUid'] ?? null)
                || $step['placementUid'] === ''
                || !is_string($step['fieldUid'] ?? null)
                || $step['fieldUid'] === ''
            ) {
                // Older open editor contexts did not carry the full path. They
                // may read legacy anchors but cannot invent a placement key.
                return null;
            }
            $key = self::nestedKey($key, $step['blockUid'], $step['placementUid'], $step['fieldUid']);
        }

        return $key;
    }
}
