<?php
namespace verbb\vizy\services;

use verbb\vizy\Vizy;
use verbb\vizy\fields\VizyField;

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
        $snapshot = Vizy::$plugin->getContentRecovery()->snapshot($owner, $field);
        $payload = ['purpose' => 'vizy-content-version', 'ownerId' => (int)$owner->id,
            'siteId' => (int)$owner->siteId, 'ownerClass' => $owner::class,
            'fieldUid' => $field->uid, 'placementUid' => $snapshot['placementUid'],
            'hash' => Vizy::$plugin->getContentRecovery()->hash($snapshot)];
        return rtrim(strtr(base64_encode(Craft::$app->getSecurity()->hashData(Json::encode($payload))), '+/', '-_'), '=');
    }

    public function check(ElementInterface $owner, VizyField $field, ?string $token): void
    {
        if (!$token) {
            return;
        }
        $decoded = base64_decode(strtr($token, '-_', '+/'), true);
        $json = $decoded === false ? false : Craft::$app->getSecurity()->validateData($decoded);
        $version = is_string($json) ? Json::decode($json) : null;
        if (!is_array($version) || ($version['purpose'] ?? null) !== 'vizy-content-version'
            || $version['fieldUid'] !== $field->uid || $version['ownerClass'] !== $owner::class) {
            throw new RuntimeException('The Vizy content version is invalid. Your edits have been retained; reload the editor before retrying.');
        }
        $sourceId = (int)$version['ownerId'];
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
        if (isset($checked[$token])) {
            return;
        }
        $db->createCommand('SELECT [[id]] FROM ' . Table::ELEMENTS . ' WHERE [[id]] = :id FOR UPDATE', [':id' => $sourceId])->queryScalar();
        $source = $sourceId === (int)$owner->id ? $owner
            : Craft::$app->getElements()->getElementById($sourceId, $owner::class, $version['siteId']);
        if (!$source) {
            throw new RuntimeException('The original Vizy owner is no longer available. No submitted content has been discarded.');
        }
        $snapshot = Vizy::$plugin->getContentRecovery()->snapshot($source, $field, true);
        if (!hash_equals($version['hash'], Vizy::$plugin->getContentRecovery()->hash($snapshot))) {
            throw new RuntimeException('This Vizy content changed after it was opened. Your submitted edits have been retained. Reload and reconcile the newer content before saving again.');
        }
        $checked[$token] = true;
        $this->_checked[$transaction] = $checked;
    }
}
