<?php
namespace verbb\vizy\gql\types\generators;

use verbb\vizy\Vizy;
use verbb\vizy\fields\VizyField;
use verbb\vizy\gql\GqlHelpers;
use verbb\vizy\gql\interfaces\VizyBlockInterface;
use verbb\vizy\gql\types\VizyBlockType;
use verbb\vizy\models\BlockType;

use Craft;
use craft\gql\base\Generator;
use craft\gql\base\GeneratorInterface;
use craft\gql\base\SingleGeneratorInterface;
use craft\gql\GqlEntityRegistry;

class VizyBlockTypeGenerator extends Generator implements GeneratorInterface, SingleGeneratorInterface
{
    // Static Methods
    // =========================================================================

    public static function generateTypes(mixed $context = null): array
    {
        if ($context instanceof VizyField) {
            $blockTypes = $context->getAllowedBlockTypes();
        } else {
            $blockTypes = Vizy::$plugin->getBlockTypes()->getAllBlockTypes();
        }

        $gqlTypes = [];
        foreach ($blockTypes as $blockType) {
            $type = static::generateType($blockType);
            $gqlTypes[$type->name] = $type;
        }

        return $gqlTypes;
    }

    public static function generateType(mixed $context): mixed
    {
                $typeName = GqlHelpers::blockTypeName($context);

        if ($entity = GqlEntityRegistry::getEntity($typeName)) {
            return $entity;
        }

        $layout = $context->getFieldLayout();
        $contentFields = $layout ? self::getContentFields($layout) : [];

        // Nested Vizy field placements recurse to the same structural document type.
        foreach ($contentFields as $handle => $gqlType) {
            // getContentGqlType on VizyField already returns VizyDocument — leave as-is.
            unset($handle, $gqlType);
        }

        $fields = array_merge(VizyBlockInterface::getFieldDefinitions(), $contentFields);
        $prepared = Craft::$app->getGql()->prepareFieldDefinitions($fields, $typeName);

        return GqlEntityRegistry::createEntity($typeName, new VizyBlockType([
            'name' => $typeName,
            'fields' => static fn() => $prepared,
        ]));
    }
}
