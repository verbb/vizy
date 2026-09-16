<?php
namespace verbb\vizy\gql\types;

use verbb\vizy\document\VizyDocument;
use verbb\vizy\fields\VizyField;
use verbb\vizy\gql\GqlHelpers;
use verbb\vizy\gql\GqlNode;
use verbb\vizy\gql\interfaces\VizyBlockInterface;
use verbb\vizy\gql\interfaces\VizyMarkInterface;
use verbb\vizy\gql\interfaces\VizyNodeInterface;

use craft\gql\base\ObjectType;
use craft\gql\GqlEntityRegistry;

use GraphQL\Type\Definition\Type;

/**
 * Structural VizyDocument GraphQL root (beta-1 structural subset).
 */
final class VizyDocumentType extends ObjectType
{
    // Static Methods
    // =========================================================================

    public static function getName(): string
    {
        return 'VizyDocument';
    }

    public static function getType(mixed $context = null): Type
    {
        // Field-scoped schemas get a dedicated type so Block unions match allowances.
        $typeName = self::getName();
        if ($context instanceof VizyField && is_string($context->handle) && $context->handle !== '') {
            $typeName = $context->handle . '_VizyDocument';
        }

        if ($entity = GqlEntityRegistry::getEntity($typeName)) {
            return $entity;
        }

        // Register before generating dependents so Hosted Vizy fieldSlots can recurse
        // without re-entering an unfinished getType() for this name.
        $type = new self([
            'name' => $typeName,
            'fields' => static function() use ($context): array {
                return [
                    'schemaVersion' => [
                        'type' => Type::nonNull(Type::int()),
                        'resolve' => static fn(VizyDocument $document): int => $document->schemaVersion(),
                    ],
                    'nodes' => [
                        'type' => Type::nonNull(Type::listOf(Type::nonNull(VizyNodeInterface::getType($context)))),
                        'description' => 'Root nodes. Defaults to enabled Blocks + prose (same as Twig query()). Pass where/limit/orderBy to filter.',
                        'args' => [
                            'where' => [
                                'name' => 'where',
                                'type' => ArrayType::getType(),
                                'description' => 'Same condition shapes as Twig query().where({…}). Use { enabled: null } to include disabled Blocks.',
                            ],
                            'limit' => [
                                'name' => 'limit',
                                'type' => Type::int(),
                            ],
                            'orderBy' => [
                                'name' => 'orderBy',
                                'type' => Type::string(),
                                'description' => 'e.g. "type DESC" or a Block field handle.',
                            ],
                        ],
                        'resolve' => static fn(VizyDocument $document, array $args): array => GqlHelpers::queryRootNodes($document, $args),
                    ],
                    'blocks' => [
                        'type' => Type::nonNull(Type::listOf(Type::nonNull(VizyBlockInterface::getType($context)))),
                        'description' => 'Document-order Blocks (recursive in the outer tree). Same filter spirit as nodes.',
                        'args' => [
                            'where' => [
                                'name' => 'where',
                                'type' => ArrayType::getType(),
                            ],
                            'limit' => [
                                'name' => 'limit',
                                'type' => Type::int(),
                            ],
                            'orderBy' => [
                                'name' => 'orderBy',
                                'type' => Type::string(),
                            ],
                        ],
                        'resolve' => static fn(VizyDocument $document, array $args): array => GqlHelpers::queryBlocks($document, $args),
                    ],
                    'block' => [
                        'type' => VizyBlockInterface::getType($context),
                        'args' => [
                            'uid' => [
                                'name' => 'uid',
                                'type' => Type::nonNull(Type::id()),
                            ],
                        ],
                        'resolve' => static function(VizyDocument $document, array $args): ?GqlNode {
                            $block = $document->findBlock((string)$args['uid']);

                            return $block !== null ? GqlNode::fromQueryRow($block) : null;
                        },
                    ],
                    'raw' => [
                        'type' => Type::nonNull(ArrayType::getType()),
                        'description' => 'Full canonical document envelope (escape hatch).',
                        'resolve' => static fn(VizyDocument $document): array => $document->toArray(),
                    ],
                    'rawNodes' => [
                        'type' => Type::nonNull(ArrayType::getType()),
                        'deprecationReason' => 'Use nodes { raw } or raw. Removed in Vizy 5.',
                        'resolve' => static fn(VizyDocument $document): array => $document->content()->nodes(),
                    ],
                    'renderedHtml' => [
                        'type' => Type::nonNull(Type::string()),
                        'description' => 'Document HTML from VizyDocument::render().',
                        'resolve' => static fn(VizyDocument $document): string => (string)$document->render(),
                    ],
                    'renderHtml' => [
                        'type' => Type::nonNull(Type::string()),
                        'deprecationReason' => 'Use renderedHtml. Removed in Vizy 5.',
                        'resolve' => static fn(VizyDocument $document): string => (string)$document->render(),
                    ],
                ];
            },
        ]);

        GqlEntityRegistry::createEntity($typeName, $type);

        // Concrete unions after the root name is reserved.
        GqlHelpers::ensureGeneratedTypes($context);
        VizyNodeInterface::getType($context);
        VizyMarkInterface::getType($context);
        VizyBlockInterface::getType($context);

        return $type;
    }
}
