<?php
namespace verbb\vizy\gql\types\generators;

use verbb\vizy\Vizy;
use verbb\vizy\gql\interfaces\VizyBlockInterface;
use verbb\vizy\gql\types\VizyBlockType;

use craft\gql\base\Generator;
use craft\gql\base\GeneratorInterface;
use craft\gql\base\SingleGeneratorInterface;
use craft\gql\GqlEntityRegistry;
use craft\gql\TypeManager;

class VizyBlockTypeGenerator extends Generator implements GeneratorInterface, SingleGeneratorInterface
{
    // Public Methods
    // =========================================================================

    public static function generateTypes(mixed $context = null): array
    {
        if ($context) {
            $vizyBlockTypes = $context->getBlockTypes();
        } else {
            $vizyBlockTypes = Vizy::$plugin->getService()->getAllBlockTypes();
        }

        $gqlTypes = [];

        foreach ($vizyBlockTypes as $vizyBlockType) {
            $type = static::generateType($vizyBlockType);
            $gqlTypes[$type->name] = $type;
        }

        return $gqlTypes;
    }

    public static function generateType(mixed $context): mixed
    {
        $typeName = $context->getField()->handle . '_' . $context->handle . '_BlockType';

        if (!($entity = GqlEntityRegistry::getEntity($typeName))) {
            $contentFieldGqlTypes = $context->getFieldLayout() ? self::getContentFields($context->getFieldLayout()) : [];
            $blockTypeFields = TypeManager::prepareFieldDefinitions(array_merge(VizyBlockInterface::getFieldDefinitions(), $contentFieldGqlTypes), $typeName);

            // Generate a type for each block type
            $entity = GqlEntityRegistry::getEntity($typeName);

            if (!$entity) {
                $entity = new VizyBlockType([
                    'name' => $typeName,
                    'fields' => function() use ($blockTypeFields) {
                        return $blockTypeFields;
                    },
                ]);

                $entity = GqlEntityRegistry::getEntity($typeName) ?: GqlEntityRegistry::createEntity($typeName, $entity);
            }
        }

        return $entity;
    }
}
