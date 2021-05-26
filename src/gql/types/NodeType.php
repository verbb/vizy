<?php
namespace verbb\vizy\gql\types;

use craft\helpers\Gql;
use verbb\vizy\base\Node;
use verbb\vizy\gql\interfaces\NodeInterface;
use verbb\vizy\gql\interfaces\VizyBlockInterface;

use craft\gql\base\ObjectType;

use GraphQL\Type\Definition\ResolveInfo;

class NodeType extends ObjectType
{
    // Public Methods
    // =========================================================================

    public function __construct(array $config)
    {
        $config['interfaces'] = [
            NodeInterface::getType(),
        ];

        parent::__construct($config);
    }

    protected function resolve($source, $arguments, $context, ResolveInfo $resolveInfo)
    {
        /** @var Node $source */
        $fieldName = Gql::getFieldNameWithAlias($resolveInfo, $source, $context);

        if ($fieldName === 'content') {
            return $source->renderNode();
        }

        return $source[$resolveInfo->fieldName];
    }
}
