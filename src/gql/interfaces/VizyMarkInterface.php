<?php
namespace verbb\vizy\gql\interfaces;

use verbb\vizy\gql\types\generators\VizyMarkGenerator;
use verbb\vizy\gql\types\ArrayType;

use Craft;
use craft\gql\base\InterfaceType as BaseInterfaceType;
use craft\gql\GqlEntityRegistry;

use GraphQL\Type\Definition\InterfaceType;
use GraphQL\Type\Definition\Type;

class VizyMarkInterface extends BaseInterfaceType
{
    // Public Methods
    // =========================================================================

    public static function getTypeGenerator(): string
    {
        return VizyMarkGenerator::class;
    }

    public static function getType($context = null): Type
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

        VizyMarkGenerator::generateTypes($context);

        return $type;
    }

    public static function getName(): string
    {
        return 'VizyMarkInterface';
    }

    public static function getFieldDefinitions(): array
    {
        return Craft::$app->getGql()->prepareFieldDefinitions([
            'type' => [
                'name' => 'type',
                'description' => 'The mark type.',
                'type' => Type::string(),
            ],
            'tagName' => [
                'name' => 'tagName',
                'description' => 'The HTML tag used for this mark.',
                'type' => Type::string(),
            ],
            'attrs' => [
                'name' => 'attrs',
                'description' => 'The attributes for this mark.',
                'type' => ArrayType::getType(),
            ],
        ], self::getName());
    }
}
