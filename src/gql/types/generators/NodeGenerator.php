<?php
namespace verbb\vizy\gql\types\generators;

use verbb\vizy\Vizy;
use verbb\vizy\gql\interfaces\NodeInterface;
use verbb\vizy\gql\interfaces\VizyBlockInterface;
use verbb\vizy\gql\types\NodeType;
use verbb\vizy\gql\types\VizyBlockType;

use Craft;
use craft\gql\base\GeneratorInterface;
use craft\gql\GqlEntityRegistry;
use craft\gql\TypeLoader;
use craft\gql\TypeManager;
use craft\helpers\Gql as GqlHelper;

use GraphQL\Type\Definition\Type;

class NodeGenerator implements GeneratorInterface
{
    // Public Methods
    // =========================================================================

    public static function generateTypes($field = null): array
    {
        $nodeClasses = Vizy::$plugin->getNodes()->getRegisteredNodes();

        $gqlTypes = [];

        foreach ($nodeClasses as $nodeClass) {
            $node = new $nodeClass;
            $node->setField($field);

            $typeName = $node->getGqlTypeName();
            $nodeGqlDefinitions = $node->getContentGqlType($node);

            // Handle Vizy Block nodes differently
            if ($node->type === 'vizyBlock') {
                $typeArray = VizyBlockTypeGenerator::generateTypes($field);
                $resolver = function($value) {
                    return $value->getGqlTypeName();
                };

                $contentFieldGqlTypes = [
                    'name' => $field->handle,
                    'type' => Type::listOf(GqlHelper::getUnionType($field->handle . '_VizyField', $typeArray, $resolver)),
                    'resolve' => VizyBlockResolver::class . '::resolve',
                ];

                $nodeFields = TypeManager::prepareFieldDefinitions(array_merge(VizyBlockInterface::getFieldDefinitions(), $contentFieldGqlTypes), $typeName);

                $gqlTypes[$typeName] = GqlEntityRegistry::getEntity($typeName) ?: GqlEntityRegistry::createEntity($typeName, new VizyBlockType([
                    'name' => $typeName,
                    'fields' => function() use ($nodeFields) {
                        return $nodeFields;
                    }
                ]));
            } else {
                $nodeFields = TypeManager::prepareFieldDefinitions(array_merge(NodeInterface::getFieldDefinitions(), $nodeGqlDefinitions), $typeName);

                $gqlTypes[$typeName] = GqlEntityRegistry::getEntity($typeName) ?: GqlEntityRegistry::createEntity($typeName, new NodeType([
                    'name' => $typeName,
                    'fields' => function() use ($nodeFields) {
                        return $nodeFields;
                    }
                ]));
            }
        }

        return $gqlTypes;
    }
}
