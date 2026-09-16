<?php
namespace verbb\vizy\gql\types;

use verbb\vizy\gql\GqlNode;
use verbb\vizy\gql\interfaces\VizyBlockInterface;
use verbb\vizy\gql\interfaces\VizyNodeInterface;

use craft\gql\base\ObjectType;
use craft\helpers\Gql as GqlHelper;

use GraphQL\Type\Definition\ResolveInfo;

/**
 * Per–Block Type GraphQL object (implements VizyNode + VizyBlock interfaces).
 *
 * Craft field handles resolve through {@see VizyBlock} ArrayAccess / fieldValue().
 */
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


    // Protected Methods
    // =========================================================================

    protected function resolve(mixed $source, array $arguments, mixed $context, ResolveInfo $resolveInfo): mixed
    {
        $fieldName = GqlHelper::getFieldNameWithAlias($resolveInfo, $source, $context);
        $block = $source instanceof GqlNode ? $source->block() : null;

        if ($source instanceof GqlNode) {
            $interfaceValue = match ($fieldName) {
                'type' => $source->type(),
                'attrs' => $source->attrs(),
                'marks' => $source->marks(),
                'children' => $source->children(),
                'text' => $source->text(),
                'raw' => $source->node(),
                'isUnknown' => false,
                'uid' => $block?->uid(),
                'blockTypeUid' => $block?->blockTypeUid(),
                'blockTypeHandle' => $block?->getHandle(),
                'enabled' => $block?->isEnabled(),
                'resolved' => $block?->isResolved(),
                'rawFieldValues' => $block?->rawFieldValues(),
                default => '__continue__',
            };

            if ($interfaceValue !== '__continue__') {
                return $interfaceValue;
            }
        }

        // Craft fields on the Block Type — same path as Twig `$block->plainText`.
        if ($block !== null && $block->hasField($fieldName)) {
            return $block->fieldValue($fieldName);
        }

        return parent::resolve($source, $arguments, $context, $resolveInfo);
    }
}
