<?php
namespace verbb\vizy\gql\interfaces;

use verbb\vizy\gql\types\generators\VizyBlockTypeGenerator;

use craft\gql\GqlEntityRegistry;
use craft\gql\TypeManager;

use GraphQL\Type\Definition\InterfaceType;
use GraphQL\Type\Definition\Type;

class VizyBlockInterface extends VizyNodeInterface
{
    // Public Methods
    // =========================================================================

    public static function getTypeGenerator(): string
    {
        return VizyBlockTypeGenerator::class;
    }

    public static function getType($fields = null): Type
    {
        if ($type = GqlEntityRegistry::getEntity(self::getName())) {
            return $type;
        }

        $type = GqlEntityRegistry::createEntity(self::getName(), new InterfaceType([
            'name' => static::getName(),
            'fields' => self::class . '::getFieldDefinitions',
            'description' => 'This is the interface implemented by all fields.',
            'resolveType' => function($value) {
                return $value->getGqlTypeName();
            },
        ]));

        VizyBlockTypeGenerator::generateTypes($fields);

        return $type;
    }

    public static function getName(): string
    {
        return 'VizyBlockInterface';
    }

    public static function getFieldDefinitions(): array
    {
        return TypeManager::prepareFieldDefinitions(array_merge(parent::getFieldDefinitions(), [
            'enabled' => [
                'name' => 'enabled',
                'type' => Type::boolean(),
                'resolve' => function ($source, $arguments) {
                    return $source->getEnabled();
                },
            ],
            'collapsed' => [
                'name' => 'collapsed',
                'type' => Type::boolean(),
                'resolve' => function ($source, $arguments) {
                    return $source->attrs['collapsed'] ?? false;
                },
            ],
            'blockTypeId' => [
                'name' => 'blockTypeId',
                'type' => Type::string(),
                'resolve' => function ($source, $arguments) {
                    return $source->getBlockType()->id;
                },
            ],
            'blockTypeHandle' => [
                'name' => 'blockTypeHandle',
                'type' => Type::string(),
                'resolve' => function ($source, $arguments) {
                    return $source->getBlockType()->handle;
                },
            ],
        ]), self::getName());
    }
}
