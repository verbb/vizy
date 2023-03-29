<?php
namespace verbb\vizy\gql\types\generators;

use verbb\vizy\Vizy;
use verbb\vizy\gql\interfaces\VizyMarkInterface;
use verbb\vizy\gql\interfaces\VizyLinkMarkInterface;
use verbb\vizy\gql\types\VizyMarkType;
use verbb\vizy\marks\Link;

use craft\gql\base\GeneratorInterface;
use craft\gql\GqlEntityRegistry;

class VizyMarkGenerator implements GeneratorInterface
{
    // Public Methods
    // =========================================================================

    public static function generateTypes(mixed $context = null): array
    {
        $gqlTypes = [];

        $markClasses = Vizy::$plugin->getNodes()->getRegisteredMarks();

        $interfaceClasses = [
            Link::class => VizyLinkMarkInterface::getFieldDefinitions(),
        ];

        foreach ($markClasses as $markClass) {
            $typeName = $markClass::gqlTypeNameByContext($context);

            if (!GqlEntityRegistry::getEntity($typeName)) {
                // Determine the interface
                $interfaceFields = $interfaceClasses[$markClass] ?? VizyMarkInterface::getFieldDefinitions();

                $gqlTypes[$typeName] = GqlEntityRegistry::getEntity($typeName) ?: GqlEntityRegistry::createEntity($typeName, new VizyMarkType([
                    'name' => $typeName,
                    'fields' => function() use ($interfaceFields) {
                        return $interfaceFields;
                    },
                ]));
            }
        }

        return $gqlTypes;
    }
}
