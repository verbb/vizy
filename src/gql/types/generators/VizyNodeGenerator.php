<?php
namespace verbb\vizy\gql\types\generators;

use verbb\vizy\Vizy;
use verbb\vizy\gql\interfaces\VizyNodeInterface;
use verbb\vizy\gql\interfaces\VizyImageNodeInterface;
use verbb\vizy\gql\types\VizyNodeType;
use verbb\vizy\gql\types\generators\VizyBlockTypeGenerator;
use verbb\vizy\gql\types\generators\VizyImageNodeGenerator;
use verbb\vizy\nodes\VizyBlock;
use verbb\vizy\nodes\Image;

use craft\gql\base\GeneratorInterface;
use craft\gql\GqlEntityRegistry;

class VizyNodeGenerator implements GeneratorInterface
{
    // Public Methods
    // =========================================================================

    public static function generateTypes(mixed $field = null): array
    {
        $nodeClasses = Vizy::$plugin->getNodes()->getRegisteredNodes();

        $gqlTypes = [];

        $interfaceClasses = [
            Image::class => VizyImageNodeInterface::getFieldDefinitions(),
        ];

        $generatorClasses = [
            VizyBlock::class => VizyBlockTypeGenerator::generateTypes(),
        ];

        foreach ($nodeClasses as $nodeClass) {
            // Skip anything without a field instance
            if (!$field) {
                continue;
            }
            
            // Special handling for some nodes
            $generatorClass = $generatorClasses[$nodeClass] ?? null;

            if ($generatorClass) {
                $gqlTypes = array_merge($gqlTypes, $generatorClass);
                continue;
            }

            $interfaceFields = $interfaceClasses[$nodeClass] ?? VizyNodeInterface::getFieldDefinitions();

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
                    },
                ]);

                $entity = GqlEntityRegistry::getEntity($typeName) ?: GqlEntityRegistry::createEntity($typeName, $entity);
            }

            $gqlTypes[$entity->name] = $entity;
        }

        return $gqlTypes;
    }
}
