<?php
namespace verbb\vizy\gql\interfaces;

use verbb\vizy\Vizy;
use verbb\vizy\gql\GqlHelpers;
use verbb\vizy\gql\GqlNode;
use verbb\vizy\gql\types\ArrayType;
use verbb\vizy\gql\types\generators\VizyNodeGenerator;

use Craft;
use craft\gql\base\InterfaceType as BaseInterfaceType;
use craft\gql\GqlEntityRegistry;

use InvalidArgumentException;

use GraphQL\Type\Definition\InterfaceType;
use GraphQL\Type\Definition\Type;

class VizyNodeInterface extends BaseInterfaceType
{
    // Static Methods
    // =========================================================================

    public static function getTypeGenerator(): string
    {
        return VizyNodeGenerator::class;
    }

    public static function getType($context = null): Type
    {
        if ($type = GqlEntityRegistry::getEntity(self::getName())) {
            return $type;
        }

        $type = GqlEntityRegistry::createEntity(self::getName(), new InterfaceType([
            'name' => static::getName(),
            'description' => 'A Vizy document node (prose, layout, Block, or unknown).',
            'fields' => self::class . '::getFieldDefinitions',
            'resolveType' => static function($value) {
                $node = $value instanceof GqlNode ? $value : null;
                if ($node === null) {
                    throw new InvalidArgumentException('VizyNodeInterface requires a GqlNode source.');
                }

                return GqlHelpers::resolveNodeTypeName($node);
            },
        ]));

        VizyNodeGenerator::generateTypes($context);

        return $type;
    }

    public static function getName(): string
    {
        return 'VizyNodeInterface';
    }

    public static function getFieldDefinitions(): array
    {
        return Craft::$app->getGql()->prepareFieldDefinitions([
            'type' => [
                'name' => 'type',
                'type' => Type::nonNull(Type::string()),
                'description' => 'TipTap node type name.',
                'resolve' => static fn(GqlNode $node): string => $node->type(),
            ],
            'attrs' => [
                'name' => 'attrs',
                'type' => ArrayType::getType(),
                'description' => 'Node attributes as JSON.',
                'resolve' => static fn(GqlNode $node): array => $node->attrs(),
            ],
            'marks' => [
                'name' => 'marks',
                'type' => Type::nonNull(Type::listOf(Type::nonNull(VizyMarkInterface::getType()))),
                'description' => 'Marks on this node (typically text leaves).',
                'resolve' => static fn(GqlNode $node): array => $node->marks(),
            ],
            'children' => [
                'name' => 'children',
                'type' => Type::nonNull(Type::listOf(Type::nonNull(self::getType()))),
                'description' => 'Ordered TipTap children. Empty for Blocks (nesting is Hosted Vizy fields).',
                'resolve' => static fn(GqlNode $node): array => $node->children(),
            ],
            'text' => [
                'name' => 'text',
                'type' => Type::string(),
                'description' => 'Leaf text, or concatenated descendant text for containers.',
                'resolve' => static fn(GqlNode $node): ?string => $node->text(),
            ],
            'html' => [
                'name' => 'html',
                'type' => Type::nonNull(Type::string()),
                'description' => 'Rendered HTML for this node (same emit path as document renderedHtml).',
                'resolve' => static function(GqlNode $node): string {
                    return (string)Vizy::$plugin->getRenderer()->renderNode(
                        $node->document(),
                        $node->node(),
                    );
                },
            ],
            'raw' => [
                'name' => 'raw',
                'type' => Type::nonNull(ArrayType::getType()),
                'description' => 'Canonical TipTap JSON for this node.',
                'resolve' => static fn(GqlNode $node): array => $node->node(),
            ],
            'isUnknown' => [
                'name' => 'isUnknown',
                'type' => Type::nonNull(Type::boolean()),
                'description' => 'True when the node type has no installed Extension definition.',
                'resolve' => static fn(GqlNode $node): bool => $node->isUnknown(),
            ],
        ], self::getName());
    }
}
