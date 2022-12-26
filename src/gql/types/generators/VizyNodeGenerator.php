<?php
namespace verbb\vizy\gql\types\generators;

use verbb\vizy\Vizy;
use verbb\vizy\gql\interfaces\VizyBlockInterface;
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

    public static function generateTypes(mixed $context = null): array
    {
        $gqlTypes = [];

        $nodeClasses = Vizy::$plugin->getNodes()->getRegisteredNodes();

        $interfaceClasses = [
            Image::class => VizyImageNodeInterface::getFieldDefinitions(),
        ];

        foreach ($nodeClasses as $nodeClass) {
            if ($nodeClass === VizyBlock::class) {
                continue;
            }

            $typeName = $nodeClass::gqlTypeNameByContext($context);

            //if (!GqlEntityRegistry::getEntity($typeName)) {
                // Determine the interface
                $interfaceFields = $interfaceClasses[$nodeClass] ?? VizyNodeInterface::getFieldDefinitions();

                $gqlTypes[$typeName] = GqlEntityRegistry::getEntity($typeName) ?: GqlEntityRegistry::createEntity($typeName, new VizyNodeType([
                    'name' => $typeName,
                    'fields' => function() use ($interfaceFields) {
                        return $interfaceFields;
                    },
                ]));
            //}
        }

        // Generate the types for Vizy Blocks
        $generatorTypes = VizyBlockTypeGenerator::generateTypes($context);
        $gqlTypes = array_merge($gqlTypes, $generatorTypes);

        return $gqlTypes;
    }
}
