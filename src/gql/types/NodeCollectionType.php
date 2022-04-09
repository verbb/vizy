<?php
namespace verbb\vizy\gql\types;

use verbb\vizy\gql\interfaces\VizyNodeInterface;

use craft\gql\base\ObjectType;
use craft\gql\GqlEntityRegistry;
use craft\helpers\Gql;

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
                        'description' => 'Query nodes for this node collection.',
                        'type' => Type::listOf(VizyNodeInterface::getType($context)),
                        'resolve' => function($source) {
                            return $source->getNodes();
                        },
                    ],
                    'rawNodes' => [
                        'name' => 'rawNodes',
                        'description' => 'The raw JSON of nodes for this node collection.',
                        'type' => ArrayType::getType(),
                        'resolve' => function($source) {
                            return $source->getRawNodes();
                        },
                    ],
                    'renderHtml' => [
                        'name' => 'renderHtml',
                        'description' => 'The rendered HTML of nodes for this node collection.',
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
