<?php
namespace verbb\vizy\gql\types\generators;

use verbb\vizy\Vizy;
use verbb\vizy\gql\interfaces\VizyNodeInterface;
use verbb\vizy\gql\interfaces\VizyImageNodeInterface;
use verbb\vizy\gql\types\VizyNodeType;
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
        $nodeClasses = Vizy::$plugin->getNodes()->getRegisteredNodes();
        $gqlTypes = [];

        foreach ($nodeClasses as $nodeClass) {
            if ($nodeClass === VizyBlock::class) {
                continue;
            }

            $type = static::generateType($nodeClass);

            $gqlTypes[$type->name] = $type;
        }

        // Generate the types for Vizy Blocks
        $generatorTypes = VizyBlockTypeGenerator::generateTypes($context);

        return array_merge($gqlTypes, $generatorTypes);
    }

    public static function generateType(mixed $context): mixed
    {
        $typeName = $context::gqlTypeNameByContext(null);

        $interfaceClasses = [
            Image::class => VizyImageNodeInterface::getFieldDefinitions(),
        ];

        $interfaceFields = $interfaceClasses[$context] ?? VizyNodeInterface::getFieldDefinitions();

        return GqlEntityRegistry::getEntity($typeName) ?: GqlEntityRegistry::createEntity($typeName, new VizyNodeType([
            'name' => $typeName,
            'fields' => function() use ($interfaceFields, $typeName) {
                return \Craft::$app->getGql()->prepareFieldDefinitions($interfaceFields, $typeName);
            },
        ]));
    }
}
