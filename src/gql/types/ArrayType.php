<?php
namespace verbb\vizy\gql\types;

use craft\gql\GqlEntityRegistry;
use craft\helpers\Json;

use GraphQL\Type\Definition\ScalarType;
use GraphQL\Language\AST\StringValueNode;
use GraphQL\Language\AST\NullValueNode;
use GraphQL\Language\AST\IntValueNode;
use GraphQL\Language\AST\FloatValueNode;
use GraphQL\Language\AST\BooleanValueNode;

class ArrayType extends ScalarType
{
    public static function getType()
    {
        return GqlEntityRegistry::getEntity(self::getName()) ?: GqlEntityRegistry::createEntity(self::getName(), new self());
    }

    // Static Methods
    // =========================================================================

    public static function getName(): string
    {
        return 'ArrayType';
    }
    public $name = 'ArrayType';


    // Public Methods
    // =========================================================================

    public function serialize($value): string
    {
        if (!is_array($value)) {
            $value->toArray();
        }

        return Json::encode($value);
    }

    public function parseValue($value)
    {
        return $value;
    }

    public function parseLiteral($valueNode, array $variables = null): BooleanValueNode|FloatValueNode|IntValueNode|NullValueNode|StringValueNode
    {
        return $valueNode;
    }
}
