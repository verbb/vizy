<?php
namespace verbb\vizy\gql\types;

use verbb\vizy\gql\interfaces\VizyNodeInterface;
use verbb\vizy\gql\interfaces\VizyBlockInterface;

use craft\gql\base\ObjectType;

use GraphQL\Type\Definition\ResolveInfo;

class VizyBlockType extends ObjectType
{
    // Public Methods
    // =========================================================================

    public function __construct(array $config)
    {
        $config['interfaces'] = [
            VizyNodeInterface::getType(),
            VizyBlockInterface::getType(),
        ];

        parent::__construct($config);
    }

    protected function resolve(mixed $source, array $arguments, mixed $context, ResolveInfo $resolveInfo): mixed
    {
        return $source[$resolveInfo->fieldName];
    }
}
