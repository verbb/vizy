<?php
namespace verbb\vizy\gql\types;

use verbb\vizy\base\Node;
use verbb\vizy\gql\interfaces\VizyNodeInterface;
use verbb\vizy\gql\interfaces\VizyBlockInterface;

use craft\gql\base\ObjectType;
use craft\helpers\Gql;

use GraphQL\Type\Definition\ResolveInfo;

class VizyNodeType extends ObjectType
{
    // Public Methods
    // =========================================================================

    public function __construct(array $config)
    {
        $config['interfaces'] = [
            VizyNodeInterface::getType(),
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
