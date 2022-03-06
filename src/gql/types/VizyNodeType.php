<?php
namespace verbb\vizy\gql\types;

use verbb\vizy\base\Node;
use verbb\vizy\gql\interfaces\VizyNodeInterface;

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

    protected function resolve(mixed $source, array $arguments, mixed $context, ResolveInfo $resolveInfo): mixed
    {
        /** @var Node $source */
        $fieldName = Gql::getFieldNameWithAlias($resolveInfo, $source, $context);

        if ($fieldName === 'content') {
            return $source->renderNode();
        }

        return $source[$resolveInfo->fieldName];
    }
}
