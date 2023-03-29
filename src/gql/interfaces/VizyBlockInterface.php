<?php
namespace verbb\vizy\gql\interfaces;

use verbb\vizy\gql\types\generators\VizyBlockTypeGenerator;

use Craft;
use craft\gql\GqlEntityRegistry;

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

    public static function getType($context = null): Type
    {
        if ($type = GqlEntityRegistry::getEntity(self::getName())) {
            return $type;
        }

        $type = GqlEntityRegistry::createEntity(self::getName(), new InterfaceType([
            'name' => static::getName(),
            'fields' => self::class . '::getFieldDefinitions',
            'description' => 'This is the interface implemented by Vizy Block nodes.',
            'resolveType' => function($value) {
                return $value->getGqlTypeName();
            },
        ]));

        VizyBlockTypeGenerator::generateTypes($context);

        return $type;
    }

    public static function getName(): string
    {
        return 'VizyBlockInterface';
    }

    public static function getFieldDefinitions(): array
    {
        return Craft::$app->getGql()->prepareFieldDefinitions(array_merge(parent::getFieldDefinitions(), [
            'enabled' => [
                'name' => 'enabled',
                'description' => 'Whether this Vizy block is enabled or not.',
                'type' => Type::boolean(),
                'resolve' => function($source) {
                    return $source->getEnabled();
                },
            ],
            'collapsed' => [
                'name' => 'collapsed',
                'description' => 'Whether this Vizy block is collapsed or not.',
                'type' => Type::boolean(),
                'resolve' => function($source) {
                    return $source->attrs['collapsed'] ?? false;
                },
            ],
            'blockTypeId' => [
                'name' => 'blockTypeId',
                'description' => 'The block type ID for this Vizy block.',
                'type' => Type::string(),
                'resolve' => function($source) {
                    return $source->getBlockType()->id;
                },
            ],
            'blockTypeHandle' => [
                'name' => 'blockTypeHandle',
                'description' => 'The block type handle for this Vizy block.',
                'type' => Type::string(),
                'resolve' => function($source) {
                    return $source->getBlockType()->handle;
                },
            ],
        ]), self::getName());
    }
}
