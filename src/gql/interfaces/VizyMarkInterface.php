<?php
namespace verbb\vizy\gql\interfaces;

use verbb\vizy\gql\GqlHelpers;
use verbb\vizy\gql\GqlMark;
use verbb\vizy\gql\types\ArrayType;
use verbb\vizy\gql\types\generators\VizyMarkGenerator;

use Craft;
use craft\gql\base\InterfaceType as BaseInterfaceType;
use craft\gql\GqlEntityRegistry;

use InvalidArgumentException;

use GraphQL\Type\Definition\InterfaceType;
use GraphQL\Type\Definition\Type;

class VizyMarkInterface extends BaseInterfaceType
{
    // Static Methods
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
            'description' => 'A Vizy mark on a text node.',
            'fields' => self::class . '::getFieldDefinitions',
            'resolveType' => static function($value) {
                $mark = $value instanceof GqlMark ? $value : null;
                if ($mark === null) {
                    throw new InvalidArgumentException('VizyMarkInterface requires a GqlMark source.');
                }

                return GqlEntityRegistry::prefixTypeName(GqlHelpers::resolveMarkTypeName($mark));
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
                'type' => Type::nonNull(Type::string()),
                'resolve' => static fn(GqlMark $mark): string => $mark->type(),
            ],
            'attrs' => [
                'name' => 'attrs',
                'type' => ArrayType::getType(),
                'resolve' => static fn(GqlMark $mark): array => $mark->attrs(),
            ],
            'raw' => [
                'name' => 'raw',
                'type' => Type::nonNull(ArrayType::getType()),
                'resolve' => static fn(GqlMark $mark): array => $mark->mark(),
            ],
            'isUnknown' => [
                'name' => 'isUnknown',
                'type' => Type::nonNull(Type::boolean()),
                'resolve' => static fn(GqlMark $mark): bool => $mark->isUnknown(),
            ],
        ], self::getName());
    }
}
