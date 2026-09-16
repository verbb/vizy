<?php
namespace verbb\vizy\services;

use verbb\vizy\fields\VizyField;
use verbb\vizy\helpers\FieldPlacements;

use Craft;
use craft\base\Component;
use craft\base\ElementInterface;
use craft\elements\Entry;
use craft\helpers\Json;
use craft\helpers\StringHelper;

use RuntimeException;

final class EditorContexts extends Component
{
    // Constants
    // =========================================================================

    private const PURPOSE = 'vizy-editor-context';
    // Earlier tokens could identify the first of several same-field placements.
    private const VERSION = 4;


    // Public Methods
    // =========================================================================

    public function issue(ElementInterface $owner, VizyField $field): array
    {
        return $this->_issuePayload($owner, $field, $field->uid, null);
    }

    /**
     * Hosted Vizy Editor context: Entry auth uses the Entry-placed Vizy field;
     * FieldLayout rendering uses the nested field UID. Immediate parent may be
     * another hosted Vizy (depth 2+). The signed path preserves every placement
     * so later requests can recheck the complete chain against current settings.
     */
    public function issueHosted(
        ElementInterface $owner,
        VizyField $entryField,
        VizyField $nestedField,
        array $hosted,
    ): array {
        $immediateParentUid = is_string($hosted['parentFieldUid'] ?? null)
            ? (string)$hosted['parentFieldUid']
            : $entryField->uid;

        return $this->_issuePayload(
            $owner,
            $entryField,
            $nestedField->uid,
            [
                'entryFieldUid' => $entryField->uid,
                'parentFieldUid' => $immediateParentUid,
                'hostedDepth' => (int)$hosted['depth'],
                'hostedBlockUid' => (string)$hosted['blockUid'],
                'hostedPlacementUid' => (string)$hosted['placementUid'],
                'hostedPath' => $hosted['path'],
            ],
        );
    }

    public function verify(string $token): array
    {
        $encoded = strtr($token, '-_', '+/');
        $encoded .= str_repeat('=', (4 - strlen($encoded) % 4) % 4);
        $signed = base64_decode($encoded, true);
        $json = $signed === false ? false : Craft::$app->getSecurity()->validateData($signed);
        if (!is_string($json)) {
            throw new RuntimeException('invalidContext');
        }
        $payload = Json::decode($json);
        if (
            !is_array($payload)
            || ($payload['version'] ?? null) !== self::VERSION
            || ($payload['purpose'] ?? null) !== self::PURPOSE
        ) {
            throw new RuntimeException('invalidContext');
        }
        // Craft owns login expiry and reauthentication. This metadata stays
        // usable by the same authenticated user; callers reauthorize the owner.
        $userId = (int)Craft::$app->getUser()->getId();
        if ($userId <= 0 || (int)($payload['userId'] ?? 0) !== $userId) {
            throw new RuntimeException('wrongUser');
        }
        return $payload;
    }


    // Private Methods
    // =========================================================================

    private function _issuePayload(
        ElementInterface $owner,
        VizyField $placementField,
        string $renderFieldUid,
        ?array $hosted,
    ): array {
        $layout = $owner->getFieldLayout();
        $placementUid = FieldPlacements::uid($owner, $placementField);
        $payload = [
            'version' => self::VERSION,
            'purpose' => self::PURPOSE,
            'userId' => Craft::$app->getUser()->getId(),
            'nonce' => StringHelper::UUID(),
            'ownerClass' => $owner::class,
            'ownerId' => $owner->id,
            'ownerUid' => $owner->uid,
            'draftId' => $owner->draftId ?? null,
            'revisionId' => $owner->revisionId ?? null,
            'siteId' => $owner->siteId,
            'scenario' => $owner->getScenario(),
            'definingAttributes' => $this->_definingAttributes($owner),
            'ownerLayoutUid' => $layout?->uid,
            // Entry layout placement of the parent (or sole) Vizy field.
            'ownerPlacementUid' => $placementUid,
            // Field whose Block allowlists / manifests drive FieldLayout rendering.
            'fieldUid' => $renderFieldUid,
            'issuedAt' => time(),
        ];
        if ($hosted !== null) {
            $payload = [...$payload, ...$hosted];
        }
        $json = Json::encode($payload);
        $payload['token'] = rtrim(strtr(base64_encode(Craft::$app->getSecurity()->hashData($json)), '+/', '-_'), '=');
        return $payload;
    }

    private function _definingAttributes(ElementInterface $owner): array
    {
        if ($owner instanceof Entry) {
            $typeId = null;
            if ($owner->sectionId || ($owner->fieldId && $owner->ownerId)) {
                $typeId = $owner->getTypeId();
            }
            return array_filter([
                'sectionId' => $owner->sectionId,
                'typeId' => $typeId,
                'fieldId' => $owner->fieldId,
                'ownerId' => $owner->ownerId,
                'primaryOwnerId' => $owner->primaryOwnerId,
            ], static fn(mixed $value): bool => $value !== null);
        }
        return [];
    }
}
