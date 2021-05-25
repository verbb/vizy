<?php
namespace verbb\vizy\gql\types\generators;

use craft\gql\base\GeneratorInterface;
use craft\gql\GqlEntityRegistry;
use verbb\vizy\gql\interfaces\NodeInterface;
use verbb\vizy\gql\types\NodeType;
use verbb\vizy\Vizy;

class NodeGenerator implements GeneratorInterface
{
    // Public Methods
    // =========================================================================

    public static function generateTypes($field = null): array
    {
        $nodeClasses = Vizy::$plugin->getNodes()->getRegisteredNodes();

        $gqlTypes = [];
        $interfaceFields = NodeInterface::getFieldDefinitions();

        foreach ($nodeClasses as $nodeClass) {
            $node = new $nodeClass;
            $node->setField($field);

            $typeName = $node->getGqlTypeName();

            if (!($entity = GqlEntityRegistry::getEntity($typeName))) {
                $contentType = $node->getContentGqlType($field);

                // Override content field with the nodes content type.
                $nodeFields = array_merge($interfaceFields, ['content' => $contentType]);

                $entity = new NodeType([
                    'name' => $typeName,
                    'fields' => function() use ($nodeFields) {
                        return $nodeFields;
                    }
                ]);

                $entity = GqlEntityRegistry::getEntity($typeName) ?: GqlEntityRegistry::createEntity($typeName, $entity);
            }

            $gqlTypes[$entity->name] = $entity;
        }

        return $gqlTypes;
    }
}
