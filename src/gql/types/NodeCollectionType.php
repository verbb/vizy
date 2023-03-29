<?php
namespace verbb\vizy\gql\types;

use verbb\vizy\gql\interfaces\VizyNodeInterface;

use Craft;
use craft\gql\base\ObjectType;
use craft\gql\GqlEntityRegistry;
use craft\helpers\Gql;
use craft\helpers\Json;

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
                        'args' => [
                            'where' => [
                                'name' => 'where',
                                'type' => Type::string(),
                                'description' => 'Used to filter items based on params. This should be a JSON-encoded string.',
                            ],
                            'limit' => [
                                'name' => 'limit',
                                'type' => Type::int(),
                                'description' => 'Limit the number of nodes returned.',
                            ],
                            'orderBy' => [
                                'name' => 'orderBy',
                                'type' => Type::string(),
                                'description' => 'Return nodes ordered by a property.',
                            ],
                        ],
                        'type' => Type::listOf(VizyNodeInterface::getType($context)),
                        'resolve' => function($source, $arguments) {
                            if (isset($arguments['where'])) {
                                $arguments['where'] = Json::decode($arguments['where']);
                            }

                            return Craft::configure($source->query(), $arguments)->all();
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

    protected function resolve(mixed $source, array $arguments, mixed $context, ResolveInfo $resolveInfo): mixed
    {
        $fieldName = Gql::getFieldNameWithAlias($resolveInfo, $source, $context);

        if (method_exists($source, $fieldName)) {
            return $source->$fieldName();
        }

        return $source->$fieldName;
    }
}
