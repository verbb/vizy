<?php
namespace verbb\vizy\gql\types;

use verbb\vizy\base\Mark;
use verbb\vizy\gql\interfaces\VizyMarkInterface;

use craft\gql\base\ObjectType;
use craft\helpers\Gql;

use GraphQL\Type\Definition\ResolveInfo;

class VizyMarkType extends ObjectType
{
    // Public Methods
    // =========================================================================

    public function __construct(array $config)
    {
        $config['interfaces'] = [
            VizyMarkInterface::getType(),
        ];

        parent::__construct($config);
    }

    protected function resolve(mixed $source, array $arguments, mixed $context, ResolveInfo $resolveInfo): mixed
    {
        /** @var Mark $source */
        $fieldName = Gql::getFieldNameWithAlias($resolveInfo, $source, $context);

        if ($fieldName === 'content') {
            return $source->renderMark();
        }

        return $source[$resolveInfo->fieldName];
    }
}
