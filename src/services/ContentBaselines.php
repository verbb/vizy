<?php
namespace verbb\vizy\services;

use verbb\vizy\document\VizyDocument;
use verbb\vizy\fields\VizyField;
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
