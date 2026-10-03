<?php
namespace verbb\vizy\services;

use verbb\vizy\document\DocumentWalk;
use verbb\vizy\document\InvalidDocumentException;
use verbb\vizy\document\VizyDocument;
use verbb\vizy\fields\VizyField;
use verbb\vizy\marks\Link;

use Craft;
use craft\base\Component;
use craft\base\ElementInterface;
use craft\elements\Asset;
use craft\elements\Category;
use craft\elements\Entry;
use craft\elements\User;
use craft\helpers\StringHelper;

use Throwable;

/**
 * Authorizes new element references before canonical documents are persisted.
 *
 * Counted persisted references are grandfathered so permission or field-policy
 * changes do not destroy historical content, while copies and changed targets
 * must satisfy the current authoring policy.
 */
final class SemanticReferences extends Component
{
    // Public Methods
    // =========================================================================

    public function violations(VizyDocument $candidate, ?VizyDocument $baseline): array
    {
        $trusted = $baseline ? $this->_inventory($baseline) : [];
        $used = [];
        $decisions = [];
        $violations = [];

        foreach ($this->_references($candidate) as $reference) {
            $key = $this->_key($reference);
            $occurrence = $used[$key] ?? 0;
            $used[$key] = $occurrence + 1;

            if ($occurrence < ($trusted[$key] ?? 0)) {
                continue;
            }

            if (!array_key_exists($key, $decisions)) {
                $decisions[$key] = $this->_allows($reference);
            }

            if (!$decisions[$key]) {
                $violations[] = "A new or changed Vizy {$reference['usage']} references an element that is unavailable for this field or user.";
            }
        }

        return array_values(array_unique($violations));
    }

    public function assertAuthorized(VizyDocument $candidate, ?VizyDocument $baseline): void
    {
        $violations = $this->violations($candidate, $baseline);

        if ($violations !== []) {
            throw new InvalidDocumentException($violations[0]);
        }
    }


    // Private Methods
    // =========================================================================

    private function _inventory(VizyDocument $document): array
    {
        $inventory = [];

        foreach ($this->_references($document) as $reference) {
            $key = $this->_key($reference);
            $inventory[$key] = ($inventory[$key] ?? 0) + 1;
        }

        return $inventory;
    }

    private function _references(VizyDocument $document): iterable
    {
        foreach (DocumentWalk::tipTapNodes($document, true) as $visit) {
            $node = $visit['node'];
            $owningDocument = $visit['document'];
            $field = $owningDocument->field();

            if (!$field instanceof VizyField) {
                continue;
            }

            if (($node['type'] ?? null) === 'image') {
                $attrs = is_array($node['attrs'] ?? null) ? $node['attrs'] : [];
                $assetUid = $attrs['assetUid'] ?? null;

                if (is_string($assetUid) && $assetUid !== '') {
                    yield $this->_uidReference(
                        $field,
                        $owningDocument,
                        $attrs,
                        Asset::class,
                        $assetUid,
                        'image',
                    );
                }

                if (is_array($attrs['link'] ?? null)) {
                    yield from $this->_linkReferences($field, $owningDocument, $attrs['link']);
                }

                if (is_string($attrs['url'] ?? null)) {
                    yield from $this->_legacyReferences($field, $owningDocument, $attrs['url'], 'link');
                }
            }

            foreach ($node['marks'] ?? [] as $mark) {
                if (is_array($mark) && ($mark['type'] ?? null) === 'link' && is_array($mark['attrs'] ?? null)) {
                    yield from $this->_linkReferences($field, $owningDocument, $mark['attrs']);
                }
            }
        }
    }

    private function _linkReferences(VizyField $field, VizyDocument $document, array $attrs): iterable
    {
        $elementType = match ($attrs['type'] ?? null) {
            'asset' => Asset::class,
            'category' => Category::class,
            'entry' => Entry::class,
            default => null,
        };
        $targetUid = $attrs['targetUid'] ?? null;

        if ($elementType !== null && is_string($targetUid) && $targetUid !== '') {
            yield $this->_uidReference($field, $document, $attrs, $elementType, $targetUid, 'link');
        }

        foreach (['href', 'value'] as $attribute) {
            if (is_string($attrs[$attribute] ?? null)) {
                yield from $this->_legacyReferences($field, $document, $attrs[$attribute], 'link');
            }
        }
    }

    private function _legacyReferences(
        VizyField $field,
        VizyDocument $document,
        string $value,
        string $usage,
    ): iterable {
        preg_match_all(
            '/(?:#|%23)(entry|asset|category):(\d+)(?:@(\d+))?/i',
            $value,
            $legacyMatches,
            PREG_SET_ORDER,
        );

        foreach ($legacyMatches as $match) {
            $elementType = match (strtolower($match[1])) {
                'asset' => Asset::class,
                'category' => Category::class,
                'entry' => Entry::class,
            };
            $siteId = isset($match[3]) && $match[3] !== ''
                ? (int)$match[3]
                : $this->_siteId([], $document);

            yield [
                'field' => $field,
                'elementType' => $elementType,
                'lookup' => 'id',
                'target' => (string)$match[2],
                'siteId' => $siteId,
                'usage' => $usage,
            ];
        }

        preg_match_all(
            '/\{(?P<elementType>[\w\\\\]+):(?P<ref>[^@:\}\|]+)(?:@(?P<site>[^:\}\|]+))?(?::(?P<attr>[^\}\| ]+))?(?:\s*\|\|\s*(?P<fallback>[^\}]+))?\}/',
            $value,
            $refTagMatches,
            PREG_SET_ORDER,
        );

        foreach ($refTagMatches as $match) {
            $elementType = Craft::$app->getElements()->getElementTypeByRefHandle($match['elementType']);

            if (!in_array($elementType, [Asset::class, Category::class, Entry::class], true)) {
                continue;
            }

            yield [
                'field' => $field,
                'elementType' => $elementType,
                'lookup' => is_numeric($match['ref']) ? 'id' : 'ref',
                'target' => (string)$match['ref'],
                'siteId' => $this->_refSiteId($match['site'] ?? null, $document),
                'usage' => $usage,
            ];
        }
    }

    private function _uidReference(
        VizyField $field,
        VizyDocument $document,
        array $attrs,
        string $elementType,
        string $uid,
        string $usage,
    ): array {
        return [
            'field' => $field,
            'elementType' => $elementType,
            'lookup' => 'uid',
            'target' => $uid,
            'siteId' => $this->_siteId($attrs, $document),
            'usage' => $usage,
        ];
    }

    private function _siteId(array $attrs, VizyDocument $document): int
    {
        return Link::resolveSiteId($attrs, $document->siteId())
            ?? (int)Craft::$app->getSites()->getCurrentSite()->id;
    }

    private function _refSiteId(?string $siteReference, VizyDocument $document): int
    {
        if ($siteReference === null || $siteReference === '') {
            return $this->_siteId([], $document);
        }

        if (is_numeric($siteReference)) {
            return (int)$siteReference;
        }

        try {
            $sites = Craft::$app->getSites();
            $site = StringHelper::isUUID($siteReference)
                ? $sites->getSiteByUid($siteReference)
                : $sites->getSiteByHandle($siteReference);
        } catch (Throwable) {
            return 0;
        }

        return $site ? (int)$site->id : 0;
    }

    private function _key(array $reference): string
    {
        $field = $reference['field'];
        $fieldIdentity = $field->uid ?: ($field->handle ?: 'object:' . spl_object_id($field));

        return implode('|', [
            $fieldIdentity,
            $reference['usage'],
            $reference['elementType'],
            $reference['lookup'],
            $reference['target'],
            (string)$reference['siteId'],
        ]);
    }

    private function _allows(array $reference): bool
    {
        try {
            $element = $this->_resolve($reference);
            $elementType = $reference['elementType'];

            if (!$element instanceof $elementType) {
                return false;
            }

            if ($element instanceof Asset) {
                return $this->_allowsAsset($element, $reference['field'], $this->_actor());
            }

            $actor = $this->_actor();

            return !$actor || Craft::$app->getElements()->canView($element, $actor);
        } catch (Throwable) {
            return false;
        }
    }

    private function _resolve(array $reference): ?ElementInterface
    {
        if ($reference['lookup'] === 'id') {
            return Craft::$app->getElements()->getElementById(
                (int)$reference['target'],
                $reference['elementType'],
                $reference['siteId'],
            );
        }

        if ($reference['lookup'] === 'ref') {
            return Craft::$app->getElements()->createElementQuery($reference['elementType'])
                ->siteId($reference['siteId'])
                ->status(null)
                ->ref($reference['target'])
                ->one();
        }

        return Craft::$app->getElements()->getElementByUid(
            $reference['target'],
            $reference['elementType'],
            $reference['siteId'],
        );
    }

    private function _allowsAsset(Asset $asset, VizyField $field, ?User $actor): bool
    {
        if (!$field->availableVolumes) {
            return false;
        }
        $volume = $asset->getVolume();

        if (is_array($field->availableVolumes) && !in_array($volume->uid, $field->availableVolumes, true)) {
            return false;
        }

        if (!$actor) {
            return true;
        }

        if (!$field->showUnpermittedVolumes && !$actor->can("viewAssets:$volume->uid")) {
            return false;
        }

        return $field->showUnpermittedFiles || Craft::$app->getElements()->canView($asset, $actor);
    }

    private function _actor(): ?User
    {
        if (!Craft::$app->has('user')) {
            return null;
        }
        $identity = Craft::$app->getUser()->getIdentity();

        return $identity instanceof User ? $identity : null;
    }
}
