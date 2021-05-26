<?php
namespace verbb\vizy\gql\types;

use craft\helpers\Gql;
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
        $entity = GqlEntityRegistry::getEntity(self::getName());

        if (!$entity) {
            $nodeCollectionType = new self([
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
            ]);

            $entity = GqlEntityRegistry::getEntity(self::getName());

            if (!$entity) {
                $entity = GqlEntityRegistry::createEntity(self::getName(), $nodeCollectionType);
            }
        }

        return $entity;
    }


    // Protected Methods
    // =========================================================================

    protected function resolve($source, $arguments, $context, ResolveInfo $resolveInfo)
    {
        $fieldName = Gql::getFieldNameWithAlias($resolveInfo, $source, $context);

        if (method_exists($source, $fieldName)) {
            return $source->$fieldName();
        }

        return $source->$fieldName;
    }
}
