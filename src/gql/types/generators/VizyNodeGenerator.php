<?php
namespace verbb\vizy\gql\types\generators;

use verbb\vizy\Vizy;
use verbb\vizy\gql\GqlElementAccess;
use verbb\vizy\gql\GqlHelpers;
use verbb\vizy\gql\GqlNode;
use verbb\vizy\gql\interfaces\VizyNodeInterface;
use verbb\vizy\gql\types\VizyNodeType;

use Craft;
use craft\elements\Asset;
use craft\gql\base\GeneratorInterface;
use craft\gql\GqlEntityRegistry;
use craft\gql\interfaces\elements\Asset as AssetInterface;

use GraphQL\Type\Definition\Type;

class VizyNodeGenerator implements GeneratorInterface
{
    // Static Methods
    // =========================================================================

    public static function generateTypes(mixed $context = null): array
    {
        $gqlTypes = [];

        foreach (array_keys(Vizy::$plugin->getExtensions()->getNodes()) as $tipTapType) {
            // Envelope / Block types are not prose union members.
            if (in_array($tipTapType, ['doc', 'vizyBlock'], true)) {
                continue;
            }

            $type = static::generateType($tipTapType);
            $gqlTypes[$type->name] = $type;
        }

        // Fallbacks always present.
        foreach (['VizyUnknownNode', 'VizyUnresolvedBlock'] as $fallback) {
            $gqlTypes[$fallback] = self::_ensureNamedType($fallback, $fallback === 'VizyUnresolvedBlock');
        }

        // Block Type objects join the same union via their generator.
        foreach (VizyBlockTypeGenerator::generateTypes($context) as $name => $type) {
            $gqlTypes[$name] = $type;
        }

        return $gqlTypes;
    }

    public static function generateType(mixed $context): mixed
    {
        $tipTapType = is_string($context) ? $context : '';
        $typeName = GqlHelpers::nodeTypeName($tipTapType);

        if ($entity = GqlEntityRegistry::getEntity($typeName)) {
            return $entity;
        }

        $fields = VizyNodeInterface::getFieldDefinitions();

        // Image: resolve Asset by canonical assetUid.
        if ($tipTapType === 'image') {
            $fields['asset'] = [
                'name' => 'asset',
                'type' => AssetInterface::getType(),
                'description' => 'Resolved Asset for attrs.assetUid when present.',
                'resolve' => static function(GqlNode $node): ?Asset {
                    $uid = $node->attrs()['assetUid'] ?? null;
                    if (!is_string($uid) || $uid === '') {
                        return null;
                    }

                    $siteId = $node->document()->siteId();

                    // Schema-aware — do not bypass volume scope via getElementByUid.
                    return GqlElementAccess::assetByUid($uid, $siteId);
                },
            ];
        }

        // Layout: semantic stack + columns.
        if ($tipTapType === 'layout') {
            $fields['uid'] = [
                'name' => 'uid',
                'type' => Type::nonNull(Type::id()),
                'resolve' => static fn(GqlNode $node): string => (string)($node->attrs()['layoutUid'] ?? ''),
            ];
            $fields['stack'] = [
                'name' => 'stack',
                'type' => Type::nonNull(Type::string()),
                'resolve' => static fn(GqlNode $node): string => (string)($node->attrs()['stack'] ?? 'small'),
            ];
            $fields['columns'] = [
                'name' => 'columns',
                'type' => Type::nonNull(Type::listOf(Type::nonNull(VizyNodeInterface::getType()))),
                'description' => 'Column children (VizyColumn).',
                'resolve' => static fn(GqlNode $node): array => $node->children(),
            ];
        }

        // Column: span + derived proportion.
        if ($tipTapType === 'column') {
            $fields['uid'] = [
                'name' => 'uid',
                'type' => Type::nonNull(Type::id()),
                'resolve' => static fn(GqlNode $node): string => (string)($node->attrs()['columnUid'] ?? ''),
            ];
            $fields['span'] = [
                'name' => 'span',
                'type' => Type::nonNull(Type::int()),
                'resolve' => static fn(GqlNode $node): int => (int)($node->attrs()['span'] ?? 0),
            ];
            $fields['proportion'] = [
                'name' => 'proportion',
                'type' => Type::nonNull(Type::string()),
                'description' => 'Derived span/12 as a decimal string (never stored).',
                'resolve' => static function(GqlNode $node): string {
                    $span = (int)($node->attrs()['span'] ?? 0);

                    return rtrim(rtrim(sprintf('%.4f', $span / 12), '0'), '.') ?: '0';
                },
            ];
        }

        $prepared = Craft::$app->getGql()->prepareFieldDefinitions($fields, $typeName);

        return GqlEntityRegistry::createEntity($typeName, new VizyNodeType([
            'name' => $typeName,
            'fields' => static fn() => $prepared,
        ]));
    }

    private static function _ensureNamedType(string $typeName, bool $asBlockFallback): mixed
    {
        if ($entity = GqlEntityRegistry::getEntity($typeName)) {
            return $entity;
        }

        if ($asBlockFallback) {
            // Minimal Block-shaped fallback when Block Type schema is missing.
            $fields = \verbb\vizy\gql\interfaces\VizyBlockInterface::getFieldDefinitions();
            $prepared = Craft::$app->getGql()->prepareFieldDefinitions($fields, $typeName);

            return GqlEntityRegistry::createEntity($typeName, new \verbb\vizy\gql\types\VizyBlockType([
                'name' => $typeName,
                'fields' => static fn() => $prepared,
            ]));
        }

        $fields = VizyNodeInterface::getFieldDefinitions();
        $prepared = Craft::$app->getGql()->prepareFieldDefinitions($fields, $typeName);

        return GqlEntityRegistry::createEntity($typeName, new VizyNodeType([
            'name' => $typeName,
            'fields' => static fn() => $prepared,
        ]));
    }
}
