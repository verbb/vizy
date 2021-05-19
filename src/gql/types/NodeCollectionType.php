<?php
namespace verbb\vizy\gql\types;

use verbb\vizy\gql\interfaces\NodeInterface;

use craft\gql\base\ObjectType;
use craft\gql\GqlEntityRegistry;

use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;

class NodeCollectionType extends ObjectType
{
    // Static Methods
    // =========================================================================

    public static function getName(): string
    {
        return 'NodeCollection';
    }

    public static function getType($context = null)
    {
        return GqlEntityRegistry::getEntity(self::getName()) ?: GqlEntityRegistry::createEntity(self::getName(), new self([
            'name' => self::getName(),
            'fields' => [
                'nodes' => [
                    'name' => 'nodes',
                    'type' => Type::listOf(NodeInterface::getType($context)),
                ],
                'rawNodes' => [
                    'name' => 'rawNodes',
                    'type' => ArrayType::getType(),
                ],
                'renderHtml' => [
                    'name' => 'renderHtml',
                    'type' => Type::string(),
                ],
            ],
        ]));
    }


    // Protected Methods
    // =========================================================================

    protected function resolve($source, $arguments, $context, ResolveInfo $resolveInfo)
    {
        $fieldName = $resolveInfo->fieldName;

        if (method_exists($source, $fieldName)) {
            return $source->$fieldName();
        }

        return $source->$fieldName;
    }
}
