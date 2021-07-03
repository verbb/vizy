<?php
namespace verbb\vizy\gql\types\generators;

use verbb\vizy\Vizy;
use verbb\vizy\fields\VizyField;
use verbb\vizy\gql\interfaces\VizyNodeInterface;
use verbb\vizy\gql\types\VizyNodeType;
use verbb\vizy\gql\types\generators\VizyBlockTypeGenerator;
use verbb\vizy\nodes\VizyBlock;

use craft\gql\base\GeneratorInterface;
use craft\gql\GqlEntityRegistry;

class VizyNodeGenerator implements GeneratorInterface
{
    // Public Methods
    // =========================================================================

    public static function generateTypes($field = null): array
    {
        $nodeClasses = Vizy::$plugin->getNodes()->getRegisteredNodes();

        $gqlTypes = [];
        $interfaceFields = VizyNodeInterface::getFieldDefinitions();

        foreach ($nodeClasses as $nodeClass) {
            // Handle these on a per-field base.
            if ($nodeClass === VizyBlock::class) {
                /** @noinspection SlowArrayOperationsInLoopInspection */
                $gqlTypes = array_merge($gqlTypes, VizyBlockTypeGenerator::generateTypes());
                continue;
            }

            $node = new $nodeClass;
            $node->setField($field);

            $typeName = $node->getGqlTypeName();

            if (!($entity = GqlEntityRegistry::getEntity($typeName))) {
                $contentType = $node->getContentGqlType($field);

                // Override content field with the nodes content type.
                // $nodeFields = array_merge($interfaceFields, ['content' => $contentType]);

                $entity = new VizyNodeType([
                    'name' => $typeName,
                    'fields' => function() use ($interfaceFields) {
                        return $interfaceFields;
                    }
                ]);

                $entity = GqlEntityRegistry::getEntity($typeName) ?: GqlEntityRegistry::createEntity($typeName, $entity);
            }

            $gqlTypes[$entity->name] = $entity;
        }

        return $gqlTypes;
    }
}
