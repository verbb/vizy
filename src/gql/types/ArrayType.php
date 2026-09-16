<?php
namespace verbb\vizy\gql\types;

use craft\gql\GqlEntityRegistry;
use craft\helpers\Json;

use GraphQL\Error\Error;
use GraphQL\Language\AST\BooleanValueNode;
use GraphQL\Language\AST\FloatValueNode;
use GraphQL\Language\AST\IntValueNode;
use GraphQL\Language\AST\ListValueNode;
use GraphQL\Language\AST\Node as AstNode;
use GraphQL\Language\AST\NullValueNode;
use GraphQL\Language\AST\ObjectValueNode;
use GraphQL\Language\AST\StringValueNode;
use GraphQL\Language\AST\VariableNode;
use GraphQL\Type\Definition\ScalarType;

/**
 * JSON-shaped filter / envelope scalar for Vizy GraphQL `where` args.
 *
 * Input: object/list/null literals and variables decode to PHP arrays (and
 * scalars). Output: JSON-encoded string for envelope compatibility — not a
 * structured GraphQL object type.
 */
class ArrayType extends ScalarType
{
    // Static Methods
    // =========================================================================

    public static function getType()
    {
        return GqlEntityRegistry::getEntity(self::getName()) ?: GqlEntityRegistry::createEntity(self::getName(), new self());
    }

    public static function getName(): string
    {
        return 'ArrayType';
    }


    // Properties
    // =========================================================================

    public $name = 'ArrayType';
    public $description = 'JSON-shaped value. Input accepts object/list/null literals; output serializes as a JSON string.';


    // Public Methods
    // =========================================================================

    public function serialize($value): string
    {
        if (is_object($value) && method_exists($value, 'toArray')) {
            $value = $value->toArray();
        }

        return Json::encode($value);
    }

    public function parseValue($value)
    {
        if (is_string($value)) {
            $decoded = Json::decodeIfJson($value);

            return $decoded;
        }

        return $value;
    }

    public function parseLiteral($valueNode, ?array $variables = null)
    {
        return $this->_literalToPhp($valueNode, $variables ?? []);
    }


    // Private Methods
    // =========================================================================

    private function _literalToPhp(AstNode $valueNode, array $variables): mixed
    {
        if ($valueNode instanceof NullValueNode) {
            return null;
        }

        if ($valueNode instanceof StringValueNode) {
            return $valueNode->value;
        }

        if ($valueNode instanceof BooleanValueNode) {
            return $valueNode->value;
        }

        if ($valueNode instanceof IntValueNode) {
            return (int)$valueNode->value;
        }

        if ($valueNode instanceof FloatValueNode) {
            return (float)$valueNode->value;
        }

        if ($valueNode instanceof ListValueNode) {
            $list = [];
            foreach ($valueNode->values as $item) {
                $list[] = $this->_literalToPhp($item, $variables);
            }

            return $list;
        }

        if ($valueNode instanceof ObjectValueNode) {
            $object = [];
            foreach ($valueNode->fields as $field) {
                $object[$field->name->value] = $this->_literalToPhp($field->value, $variables);
            }

            return $object;
        }

        if ($valueNode instanceof VariableNode) {
            $name = $valueNode->name->value;
            if (!array_key_exists($name, $variables)) {
                throw new Error("Variable \"\${$name}\" is not defined.");
            }

            return $variables[$name];
        }

        throw new Error('ArrayType only accepts JSON-shaped literals (object, list, null, or scalar).');
    }
}
