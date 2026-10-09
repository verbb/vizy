<?php
namespace verbb\vizy\helpers;

use verbb\vizy\Vizy;
use verbb\vizy\elements\Block;
use verbb\vizy\fields\VizyField;

use Craft;
use craft\base\ElementInterface;
use craft\base\FieldInterface;
use craft\elements\Entry;
use craft\fields\Matrix;
use craft\helpers\Json;

use RuntimeException;

/** Hyper owns its complete value as JSON; its projected children are not database owners. */
final class EmbeddedOwners
{
    // Static Methods
    // =========================================================================

    public static function scope(?ElementInterface $owner): ?array
    {
        if (!self::_isEmbedded($owner)) {
            return null;
        }
        $path = [];
        $embedded = false;
        $seen = [];

        while ($owner && !isset($seen[spl_object_id($owner)])) {
            $seen[spl_object_id($owner)] = true;
            $kind = null;
            $field = null;
            $type = null;

            if (is_a($owner, 'verbb\\hyper\\base\\Link')) {
                $kind = 'hyper';
                $field = $owner->field;
                $type = $owner->handle;
                $embedded = true;
            } elseif ($owner instanceof Block) {
                $kind = 'vizy';
                $field = $owner->getField();
                $type = $owner->getType()->uid;
            } elseif (($owner instanceof Entry || is_a($owner, 'benf\\neo\\elements\\Block')) && !$owner->id && $owner->fieldId) {
                $kind = $owner instanceof Entry ? 'matrix' : 'neo';
                $field = $owner->getField();
                $type = $owner->getType()->uid;
            } else {
                break;
            }
            $parent = $owner->getOwner();

            if (!$parent || !$field) {
                return null;
            }
            $placement = self::placement($parent, $field);

            if (!$placement) {
                throw new RuntimeException('The embedded field placement is no longer available.');
            }
            array_unshift($path, [
                'kind' => $kind, 'handle' => $field->handle, 'fieldUid' => $field->uid, 'placementUid' => $placement,
                'type' => $type, 'layoutUid' => $owner->getFieldLayout()?->uid,
                'uid' => $owner instanceof Block ? $owner->getBlockUid() : $owner->uid,
            ]);
            $owner = $parent;
        }
        return $embedded && $owner ? ['owner' => $owner, 'path' => $path] : null;
    }

    public static function placement(ElementInterface $owner, FieldInterface $field): ?string
    {
        foreach ($owner->getFieldLayout()?->getCustomFieldElements() ?? [] as $placement) {
            $placed = $placement->getField();

            if ($placed->uid === $field->uid && $placed->handle === $field->handle
                && (!$field->layoutElement || $field->layoutElement->uid === $placement->uid)) {
                return $placement->uid;
            }
        }
        return null;
    }

    /** Rebuild only the signed schema path, including unsaved links and rows. */
    public static function resolve(ElementInterface $owner, array $path): ElementInterface
    {
        if (!$path || count($path) > 32) {
            throw new RuntimeException('invalidEmbeddedPath');
        }

        foreach ($path as $step) {
            $field = self::field($owner, $step['fieldUid'], $step['placementUid']);
            $child = null;

            if ($step['kind'] === 'hyper' && is_a($field, 'verbb\\hyper\\fields\\HyperField')) {
                $prototype = $field->getLinkTypeByHandle($step['type']);
                $child = $prototype ? clone $prototype : null;

                if ($child) {
                    $child->field = $field;
                    $child->setOwner($owner);
                }
            } elseif ($step['kind'] === 'vizy' && $field instanceof VizyField && $field->allowsBlockTypeUid($step['type'])) {
                $type = Vizy::$plugin->getBlockTypes()->getBlockTypeByUid($step['type']);

                if ($type) {
                    $child = new Block();
                    $child->setOwner($owner);
                    $child->setField($field);
                    $child->setType($type);
                    $child->setBlockUid($step['uid'] ?? '');
                    $child->setFieldLayout($type->getFieldLayout());
                }
            } elseif (($step['kind'] === 'matrix' && $field instanceof Matrix)
                || ($step['kind'] === 'neo' && is_a($field, 'benf\\neo\\Field'))) {
                $types = $field instanceof Matrix ? $field->getEntryTypes() : $field->getBlockTypes();

                foreach ($types as $type) {
                    if ($type->uid === $step['type']) {
                        $class = $field instanceof Matrix ? Entry::class : 'benf\\neo\\elements\\Block';
                        $child = new $class(['typeId' => $type->id, 'fieldId' => $field->id]);
                        $child->setOwner($owner);
                        break;
                    }
                }
            }

            if (!$child || $child->getFieldLayout()?->uid !== $step['layoutUid']) {
                throw new RuntimeException('staleEmbeddedLayout');
            }
            $child->id = null;
            $child->uid = $step['uid'] ?: null;
            $child->siteId = $owner->siteId;
            $owner = $child;
        }
        return $owner;
    }

    public static function field(ElementInterface $owner, string $fieldUid, string $placementUid): ?FieldInterface
    {
        foreach ($owner->getFieldLayout()?->getCustomFieldElements() ?? [] as $placement) {
            if ($placement->uid === $placementUid && $placement->getField()->uid === $fieldUid) {
                return $placement->getField();
            }
        }
        return null;
    }

    /** Select the corresponding immutable JSON fragment, never submitted content. */
    public static function storedValue(mixed $content, array $path, string $placement, string $handle): mixed
    {
        foreach ($path as $step) {
            $content = self::_decode($content);
            $value = self::_decode($content[$step['placementUid']] ?? $content[$step['handle']] ?? null);
            $content = null;

            if ($step['kind'] === 'vizy') {
                $find = function(array $nodes) use (&$find, $step): mixed {
                    foreach ($nodes as $node) {
                        if (($node['attrs']['blockUid'] ?? null) === $step['uid']) {
                            return $node['attrs']['fieldSlots'] ?? [];
                        }

                        if ($found = $find($node['content'] ?? [])) {
                            return $found;
                        }
                    }
                    return null;
                };
                $content = $find($value['content'] ?? []);
            } else {
                foreach ($value['entries'] ?? $value['blocks'] ?? $value ?? [] as $key => $row) {
                    if (is_array($row) && ($row['uid'] ?? preg_replace('/^uid:/', '', (string)$key)) === $step['uid']) {
                        $content = $row['fields'] ?? [];
                        break;
                    }
                }
            }

            if ($content === null) {
                return null;
            }
        }
        return $content[$placement] ?? $content[$handle] ?? null;
    }

    private static function _isEmbedded(?ElementInterface $owner): bool
    {
        $seen = [];

        while ($owner && !isset($seen[spl_object_id($owner)])) {
            $seen[spl_object_id($owner)] = true;

            if (is_a($owner, 'verbb\\hyper\\base\\Link')) {
                return true;
            }

            if (!$owner instanceof Block && !(($owner instanceof Entry || is_a($owner, 'benf\\neo\\elements\\Block')) && !$owner->id && $owner->fieldId)) {
                return false;
            }

            try {
                $owner = $owner->getOwner();
            } catch (\LogicException) {
                return false;
            }
        }
        return false;
    }

    private static function _decode(mixed $value): array
    {
        if (is_string($value)) {
            $value = Json::decode($value);
        }
        return is_array($value) ? $value : [];
    }
}
