<?php
namespace verbb\vizy\services;

use verbb\vizy\Vizy;
use verbb\vizy\exceptions\ContentConflictException;
use verbb\vizy\fields\VizyField;
use verbb\vizy\helpers\EmbeddedOwners;

use Craft;
use craft\base\Component;
use craft\base\ElementInterface;
use craft\db\Table;
use craft\helpers\Json;

use RuntimeException;
use WeakMap;

/** Signed optimistic versions for editor submissions and explicit API writes. */
final class ContentVersions extends Component
{
    // Properties
    // =========================================================================

    private ?WeakMap $_checked = null;


    // Public Methods
    // =========================================================================

    public function clear(): void
    {
        $this->_checked = new WeakMap();
    }

    public function issue(ElementInterface $owner, VizyField $field): string
    {
        $embedded = EmbeddedOwners::scope($owner);
        $owner = $embedded['owner'] ?? $owner;
        $snapshot = $embedded ? $this->_embeddedSnapshot($owner, $embedded['path'][0]['placementUid']) : Vizy::$plugin->getContentRecovery()->snapshot($owner, $field);
        $payload = ['purpose' => 'vizy-content-version', 'ownerId' => (int)$owner->id,
            'siteId' => (int)$owner->siteId, 'ownerClass' => $owner::class,
            'fieldUid' => $field->uid, 'placementUid' => $snapshot['placementUid'],
            'hash' => Vizy::$plugin->getContentRecovery()->hash($snapshot),
            'embeddedPlacementUid' => $embedded ? $embedded['path'][0]['placementUid'] : null];
        return rtrim(strtr(base64_encode(Craft::$app->getSecurity()->hashData(Json::encode($payload))), '+/', '-_'), '=');
    }

    public function check(ElementInterface $owner, VizyField $field, ?string $token): void
    {
        if (!$token) {
            return;
        }
        $embedded = EmbeddedOwners::scope($owner);
        $owner = $embedded['owner'] ?? $owner;
        $decoded = base64_decode(strtr($token, '-_', '+/'), true);
        $json = $decoded === false ? false : Craft::$app->getSecurity()->validateData($decoded);
        $version = is_string($json) ? Json::decode($json) : null;

        if (!is_array($version) || ($version['purpose'] ?? null) !== 'vizy-content-version'
            || $version['fieldUid'] !== $field->uid || $version['ownerClass'] !== $owner::class) {
            throw new RuntimeException('The Vizy content version is invalid. Your edits have been retained; reload the editor before retrying.');
        }

        if (($version['embeddedPlacementUid'] ?? null) !== ($embedded ? $embedded['path'][0]['placementUid'] : null)) {
            throw new RuntimeException('The Vizy content version belongs to another embedded placement.');
        }
        $sourceId = (int)$version['ownerId'];

        if ($sourceId === 0 && $owner->firstSave) {
            return;
        }

        if ($sourceId !== (int)$owner->id && $sourceId !== (int)$owner->getCanonicalId()
            && $sourceId !== (int)($owner->duplicateOf?->id)) {
            throw new RuntimeException('The Vizy content version belongs to another owner.');
        }
        $db = Craft::$app->getDb();
        $transaction = $db->getTransaction();

        if (!$transaction?->getIsActive()) {
            throw new RuntimeException('Vizy version checks require the owner save transaction.');
        }
        $this->_checked ??= new WeakMap();
        $checked = $this->_checked[$transaction] ?? [];

        // A containing Vizy save already validates the entire persisted JSON.
        // Unchanged embedded editors may retain older tokens after a sibling
        // autosave, so use that enclosing check within this transaction.
        $scopeKey = 'scope:' . $owner::class . ':' . $owner->id . ':' . $owner->siteId . ':'
            . ($embedded ? $embedded['path'][0]['placementUid'] : \verbb\vizy\helpers\FieldPlacements::uid($owner, $field));

        if ($embedded && isset($checked[$scopeKey])) {
            return;
        }

        if (isset($checked[$token])) {
            if (!$embedded) {
                $checked[$scopeKey] = true;
                $this->_checked[$transaction] = $checked;
            }
            return;
        }
        $db->createCommand('SELECT [[id]] FROM ' . Table::ELEMENTS . ' WHERE [[id]] = :id FOR UPDATE', [':id' => $sourceId])->queryScalar();
        $source = $sourceId === (int)$owner->id ? $owner
            : Craft::$app->getElements()->getElementById($sourceId, $owner::class, $version['siteId']);

        if (!$source) {
            throw new RuntimeException('The original Vizy owner is no longer available. No submitted content has been discarded.');
        }
        $snapshot = $embedded ? $this->_embeddedSnapshot($source, $embedded['path'][0]['placementUid'], true) : Vizy::$plugin->getContentRecovery()->snapshot($source, $field, true);

        if (!hash_equals($version['hash'], Vizy::$plugin->getContentRecovery()->hash($snapshot))) {
            throw new ContentConflictException($source);
        }
        $checked[$token] = true;

        if (!$embedded) {
            $checked[$scopeKey] = true;
        }
        $this->_checked[$transaction] = $checked;
    }

    // Private Methods
    // =========================================================================

    private function _embeddedSnapshot(ElementInterface $owner, string $placement, bool $lock = false): array
    {
        $values = [];

        $command = (new \craft\db\Query())->select(['siteId', 'content'])->from(Table::ELEMENTS_SITES)
            ->where(['elementId' => $owner->id])->orderBy('siteId')->createCommand();
        // A locking read sees the latest committed JSON even when Craft's save
        // transaction already established a repeatable-read snapshot.
        $rows = $lock ? Craft::$app->getDb()->createCommand($command->getRawSql() . ' FOR UPDATE')->queryAll() : $command->queryAll();

        foreach ($rows as $row) {
            $content = is_string($row['content']) ? Json::decode($row['content']) : $row['content'];
            $values[] = ['siteId' => (int)$row['siteId'], 'value' => $content[$placement] ?? null];
        }
        return ['placementUid' => $placement, 'values' => $values];
    }

}
