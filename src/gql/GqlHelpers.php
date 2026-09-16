<?php
namespace verbb\vizy\gql;

use verbb\vizy\document\VizyBlock;
use verbb\vizy\document\VizyDocument;
use verbb\vizy\document\VizyNodeQuery;
use verbb\vizy\gql\types\generators\VizyBlockTypeGenerator;
use verbb\vizy\gql\types\generators\VizyMarkGenerator;
use verbb\vizy\gql\types\generators\VizyNodeGenerator;
use verbb\vizy\models\BlockType;

use craft\helpers\StringHelper;

/**
 * Shared GraphQL naming, type resolution, and Twig-spirit node queries.
 */
final class GqlHelpers
{
    // Static Methods
    // =========================================================================

    /** Concrete GraphQL object name for a TipTap node type (`paragraph` → `VizyParagraph`). */
    public static function nodeTypeName(string $tipTapType): string
    {
        if ($tipTapType === '') {
            return 'VizyUnknownNode';
        }

        return 'Vizy' . StringHelper::toPascalCase($tipTapType);
    }

    /** Concrete GraphQL object name for a TipTap mark type (`bold` → `VizyBold`). */
    public static function markTypeName(string $tipTapType): string
    {
        if ($tipTapType === '') {
            return 'VizyUnknownMark';
        }

        return 'Vizy' . StringHelper::toPascalCase($tipTapType);
    }

    /** Deterministic Block Type GraphQL name (handle + short UID for stability). */
    public static function blockTypeName(BlockType $blockType): string
    {
        $handle = preg_replace('/[^a-zA-Z0-9]/', '', (string)$blockType->handle) ?: 'Block';
        $handle = StringHelper::toPascalCase($handle);
        $uid = preg_replace('/[^a-fA-F0-9]/', '', (string)$blockType->uid);
        $suffix = strtolower(substr($uid !== '' ? $uid : '00000000', 0, 8));

        return "{$handle}_{$suffix}_VizyBlock";
    }

    /** Resolve the GraphQL type name for a {@see GqlNode} source. */
    public static function resolveNodeTypeName(GqlNode $node): string
    {
        if ($node->isBlock()) {
            $block = $node->block();
            $blockType = $block?->blockType();
            if ($blockType instanceof BlockType) {
                return self::blockTypeName($blockType);
            }

            // Unresolved schema — still a Block interface implementor.
            return 'VizyUnresolvedBlock';
        }

        $type = $node->type();
        if ($type === '' || $node->isUnknown()) {
            return 'VizyUnknownNode';
        }

        return self::nodeTypeName($type);
    }

    /** Resolve the GraphQL type name for a {@see GqlMark} source. */
    public static function resolveMarkTypeName(GqlMark $mark): string
    {
        if ($mark->isUnknown() || $mark->type() === '') {
            return 'VizyUnknownMark';
        }

        return self::markTypeName($mark->type());
    }

    /**
     * Root `nodes(where/limit/orderBy)` — same defaults as Twig {@see VizyDocument::query()}.
     */
    public static function queryRootNodes(VizyDocument $document, array $args = []): array
    {
        $query = $document->query();
        if (isset($args['where'])) {
            $query->where($args['where']);
        }

        if (isset($args['limit'])) {
            $query->limit((int)$args['limit']);
        }
        if (isset($args['orderBy']) && is_string($args['orderBy']) && $args['orderBy'] !== '') {
            $query->orderBy($args['orderBy']);
        }

        return array_map(
            static fn(mixed $row): GqlNode => GqlNode::fromQueryRow($row),
            $query->all(),
        );
    }

    /**
     * Document-order Blocks with the same filter spirit as {@see queryRootNodes()}.
     */
    public static function queryBlocks(VizyDocument $document, array $args = []): array
    {
        $query = (new VizyNodeQuery())->from($document->blocks(null));
        if (isset($args['where'])) {
            $query->where($args['where']);
        }

        if (isset($args['limit'])) {
            $query->limit((int)$args['limit']);
        }
        if (isset($args['orderBy']) && is_string($args['orderBy']) && $args['orderBy'] !== '') {
            $query->orderBy($args['orderBy']);
        }

        return array_map(
            static fn(VizyBlock $block): GqlNode => GqlNode::fromQueryRow($block),
            $query->all(),
        );
    }

    public static function ensureGeneratedTypes(mixed $context = null): void
    {
        VizyNodeGenerator::generateTypes($context);
        VizyMarkGenerator::generateTypes($context);
        VizyBlockTypeGenerator::generateTypes($context);
    }

}
