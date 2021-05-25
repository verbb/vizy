<?php
namespace verbb\vizy\gql\interfaces;

use verbb\vizy\gql\types\generators\NodeGenerator;
use verbb\vizy\gql\types\ArrayType;

use craft\gql\base\InterfaceType as BaseInterfaceType;
use craft\gql\TypeManager;
use craft\gql\GqlEntityRegistry;

use GraphQL\Type\Definition\InterfaceType;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

class NodeInterface extends BaseInterfaceType
{
    // Public Methods
    // =========================================================================

    public static function getTypeGenerator(): string
    {
        return NodeGenerator::class;
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

        NodeGenerator::generateTypes($fields);

        return $type;
    }

    public static function getName(): string
    {
        return 'NodeInterface';
    }

    public static function getFieldDefinitions(): array
    {
        return TypeManager::prepareFieldDefinitions(array_merge(parent::getFieldDefinitions(), [
            'type' => [
                'name' => 'type',
                'type' => Type::string(),
            ],
            'tagName' => [
                'name' => 'tagName',
                'type' => Type::string(),
            ],
            'attrs' => [
                'name' => 'attrs',
                'type' => ArrayType::getType(),
            ],
            'marks' => [
                'name' => 'marks',
                'type' => ArrayType::getType(),
            ],
        ]), self::getName());
    }
}
