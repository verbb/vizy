<?php
namespace verbb\vizy\services;

use verbb\vizy\document\VizyDocument;
use verbb\vizy\elements\Block;
use verbb\vizy\fields\VizyField;
use verbb\vizy\helpers\AnchorDocuments;
use verbb\vizy\helpers\FieldPlacements;

use craft\base\Component;
use craft\base\ElementInterface;
use craft\db\Query;
use craft\helpers\Json;

use Throwable;

/**
 * Loads immutable persisted owner content for preserve-existing decisions.
 */
final class ContentBaselines extends Component
{
    // Properties
    // =========================================================================

    private array $documents = [];


    // Public Methods
    // =========================================================================

    public function clear(): void
    {
        $this->documents = [];
    }

    public function trust(ElementInterface $owner, VizyField $field, VizyDocument $document): void
    {
        if ($key = $this->_key($owner, $field)) {
            $this->documents[$key] = $document;
        }
    }

    public function forget(ElementInterface $owner, VizyField $field): void
    {
        if ($key = $this->_key($owner, $field)) {
            unset($this->documents[$key]);
        }
    }

    public function document(ElementInterface $owner, VizyField $field): ?VizyDocument
    {
        $embedded = \verbb\vizy\helpers\EmbeddedOwners::scope($owner);

        if ($embedded) {
            $root = $embedded['owner'];
            $root = (!$root->id && $root->duplicateOf) ? $root->duplicateOf : $root;
            $content = (new Query())->select('content')->from('{{%elements_sites}}')
                ->where(['elementId' => $root->id, 'siteId' => $root->siteId])->scalar();
            $placement = FieldPlacements::uid($owner, $field);
            $raw = $content && $placement
                ? \verbb\vizy\helpers\EmbeddedOwners::storedValue($content, $embedded['path'], $placement, $field->handle)
                : null;
            return $raw === null ? null : \verbb\vizy\Vizy::$plugin->getDocuments()->normalizeValue($raw, $owner, $field);
        }
        $key = $this->_key($owner, $field);

        if ($key === null) {
            return null;
        }

        if (array_key_exists($key, $this->documents)) {
            return $this->documents[$key];
        }

        $ownerId = $owner->id;
        $siteId = $owner->siteId;

        if ((!$ownerId || !$siteId) && $owner->duplicateOf instanceof ElementInterface) {
            $ownerId = $owner->duplicateOf->id;
            $siteId = $owner->duplicateOf->siteId;
        }

        if (!$ownerId || !$siteId || !$field->uid) {
            return null;
        }

        $placementUid = FieldPlacements::uid($owner, $field);

        if ($placementUid === null) {
            return $this->documents[$key] = null;
        }

        $content = (new Query())
            ->select(['content'])
            ->from('{{%elements_sites}}')
            ->where(['elementId' => $ownerId, 'siteId' => $siteId])
            ->scalar();

        if ($content === false || $content === null) {
            return $this->documents[$key] = null;
        }

        try {
            $content = is_string($content) ? Json::decode($content) : $content;

            if (!is_array($content) || !array_key_exists($placementUid, $content)) {
                return $this->documents[$key] = null;
            }
            // Persisted DB state, not a posted hidden value, is the sole trust
            // source for preserving disabled or removed capabilities.
            return $this->documents[$key] = \verbb\vizy\Vizy::$plugin
                ->getDocuments()
                ->normalizeValue($content[$placementUid], $owner, $field);
        } catch (Throwable) {
            return $this->documents[$key] = null;
        }
    }


    // Private Methods
    // =========================================================================

    private function _key(ElementInterface $owner, VizyField $field): ?string
    {
        if (!$field->uid) {
            return null;
        }

        // Hosted Vizy lives in a parent Block's fieldSlots, so its projected
        // Block is deliberately not a persisted element. Give preloaded Hosted
        // baselines a stable key rooted in the durable owner and the full
        // parent-field/block/nested-placement identity instead of attempting an
        // elements_sites lookup with a null or borrowed Matrix anchor ID.
        if ($owner instanceof Block) {
            $documentKey = AnchorDocuments::key($owner, $field);

            if ($documentKey === null) {
                return null;
            }
            $durableOwner = $owner;

            while ($durableOwner instanceof Block) {
                try {
                    $nextOwner = $durableOwner->getOwner();
                } catch (\LogicException) {
                    // Some validation-only Block projections intentionally omit
                    // field or owner context. They cannot address a baseline.
                    return null;
                }
                $durableOwner = $nextOwner;
            }
            $ownerId = $durableOwner->id;
            $siteId = $durableOwner->siteId;

            if ((!$ownerId || !$siteId) && $durableOwner->duplicateOf instanceof ElementInterface) {
                $ownerId = $durableOwner->duplicateOf->id;
                $siteId = $durableOwner->duplicateOf->siteId;
            }

            if (!$ownerId || !$siteId) {
                return null;
            }

            return implode(':', [
                'hosted',
                $durableOwner::class,
                $ownerId,
                $siteId,
                $documentKey,
            ]);
        }

        $ownerId = $owner->id;
        $siteId = $owner->siteId;

        // Craft validates duplicate clones before IDs are assigned. Fall back to
        // the source owner so migration/checkpoint trust survives duplicateElement().
        if ((!$ownerId || !$siteId) && $owner->duplicateOf instanceof ElementInterface) {
            $ownerId = $owner->duplicateOf->id;
            $siteId = $owner->duplicateOf->siteId;
        }

        if (!$ownerId || !$siteId) {
            return null;
        }

        $placementUid = FieldPlacements::uid($owner, $field);
        return $placementUid === null ? null : implode(':', [$owner::class, $ownerId, $siteId, $field->uid, $placementUid]);
    }
}
