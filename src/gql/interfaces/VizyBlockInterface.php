<?php
namespace verbb\vizy\gql\interfaces;

use verbb\vizy\gql\GqlHelpers;
use verbb\vizy\gql\GqlNode;
use verbb\vizy\gql\types\ArrayType;
use verbb\vizy\gql\types\generators\VizyBlockTypeGenerator;

use Craft;
use craft\gql\GqlEntityRegistry;

use InvalidArgumentException;

use GraphQL\Type\Definition\InterfaceType;
use GraphQL\Type\Definition\Type;

class VizyBlockInterface extends VizyNodeInterface
{
    // Static Methods
    // =========================================================================

    public static function getTypeGenerator(): string
    {
        return VizyBlockTypeGenerator::class;
    }

    public static function getType($context = null): Type
    {
        if ($type = GqlEntityRegistry::getEntity(self::getName())) {
            return $type;
        }

        $type = GqlEntityRegistry::createEntity(self::getName(), new InterfaceType([
            'name' => static::getName(),
            'description' => 'A Vizy Block node with Craft field values.',
            'fields' => self::class . '::getFieldDefinitions',
            'resolveType' => static function($value) {
                $node = $value instanceof GqlNode ? $value : null;
                if ($node === null || !$node->isBlock()) {
                    throw new InvalidArgumentException('VizyBlockInterface requires a Block GqlNode source.');
                }

                return GqlHelpers::resolveNodeTypeName($node);
            },
        ]));

        VizyBlockTypeGenerator::generateTypes($context);

        return $type;
    }

    public static function getName(): string
    {
        return 'VizyBlockInterface';
    }

    public static function getFieldDefinitions(): array
    {
        return Craft::$app->getGql()->prepareFieldDefinitions(array_merge(parent::getFieldDefinitions(), [
            'uid' => [
                'name' => 'uid',
                'type' => Type::nonNull(Type::id()),
                'description' => 'Canonical Block instance UID.',
                'resolve' => static fn(GqlNode $node): string => $node->block()?->uid() ?? '',
            ],
            'blockTypeUid' => [
                'name' => 'blockTypeUid',
                'type' => Type::nonNull(Type::id()),
                'description' => 'Canonical Block Type UID.',
                'resolve' => static fn(GqlNode $node): string => $node->block()?->blockTypeUid() ?? '',
            ],
            'blockTypeHandle' => [
                'name' => 'blockTypeHandle',
                'type' => Type::string(),
                'description' => 'Current Block Type handle when schema resolves.',
                'resolve' => static fn(GqlNode $node): ?string => $node->block()?->getHandle(),
            ],
            'enabled' => [
                'name' => 'enabled',
                'type' => Type::nonNull(Type::boolean()),
                'resolve' => static fn(GqlNode $node): bool => $node->block()?->isEnabled() ?? false,
            ],
            'resolved' => [
                'name' => 'resolved',
                'type' => Type::nonNull(Type::boolean()),
                'description' => 'Whether Block Type and FieldLayout resolve in the current schema.',
                'resolve' => static fn(GqlNode $node): bool => $node->block()?->isResolved() ?? false,
            ],
            'rawFieldValues' => [
                'name' => 'rawFieldValues',
                'type' => Type::nonNull(ArrayType::getType()),
                'description' => 'Placement-UID keyed raw fieldSlots (includes Hosted Vizy envelopes).',
                'resolve' => static fn(GqlNode $node): array => $node->block()?->rawFieldValues() ?? [],
            ],
        ]), self::getName());
    }
}
