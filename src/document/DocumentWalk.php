<?php
namespace verbb\vizy\document;

use verbb\vizy\Vizy;
use verbb\vizy\fields\VizyField;

/**
 * Schema-aware document walk: TipTap tree + resolved Hosted Vizy placements.
 *
 * Does not recurse into opaque Craft field payloads. Shared by identity copy,
 * asset discovery, Matrix persistence, and related projections.
 */
final class DocumentWalk
{
    // Static Methods
    // =========================================================================

    /** Every TipTap-located Block, optionally descending into Hosted Vizy slots. */
    public static function blocks(VizyDocument $document, bool $includeHosted = true): iterable
    {
        yield from self::_blocksInNodes(
            $document,
            $document->content()->nodes(),
            $document->content()->path(),
            $includeHosted,
        );
    }

    /**
     * TipTap nodes in document order (including nested layout/column content),
     * then Hosted nested TipTap trees when `$includeHosted` is true. Each item
     * contains the node, its path, and the document that owns it.
     */
    public static function tipTapNodes(VizyDocument $document, bool $includeHosted = true): iterable
    {
        yield from self::_tipTapInNodes(
            $document,
            $document->content()->nodes(),
            $document->content()->path(),
            $includeHosted,
        );
    }

    /**
     * Whether a fieldSlots value is a Hosted Vizy document envelope.
     */
    public static function isHostedEnvelope(mixed $value): bool
    {
        return is_array($value)
            && ($value['type'] ?? null) === 'doc'
            && is_array($value['attrs'] ?? null)
            && is_array($value['content'] ?? null);
    }

    private static function _blocksInNodes(
        VizyDocument $document,
        array $nodes,
        string $basePath,
        bool $includeHosted,
    ): iterable {
        foreach ($nodes as $index => $node) {
            if (!is_array($node)) {
                continue;
            }
            $path = "{$basePath}.{$index}";
            if (($node['type'] ?? null) === 'vizyBlock') {
                $block = $document->blockFromNode($node, $path);
                yield $block;
                if ($includeHosted) {
                    yield from self::_hostedBlocks($document, $block);
                }
            } elseif (is_array($node['content'] ?? null)) {
                yield from self::_blocksInNodes(
                    $document,
                    $node['content'],
                    "{$path}.content",
                    $includeHosted,
                );
            }
        }
    }

    private static function _hostedBlocks(VizyDocument $document, VizyBlock $block): iterable
    {
        foreach (self::_hostedDocuments($document, $block) as $nested) {
            yield from self::blocks($nested, true);
        }
    }

    private static function _tipTapInNodes(
        VizyDocument $document,
        array $nodes,
        string $basePath,
        bool $includeHosted,
    ): iterable {
        foreach ($nodes as $index => $node) {
            if (!is_array($node)) {
                continue;
            }
            $path = "{$basePath}.{$index}";
            yield ['node' => $node, 'path' => $path, 'document' => $document];

            if (($node['type'] ?? null) === 'vizyBlock') {
                if ($includeHosted) {
                    $block = $document->blockFromNode($node, $path);
                    yield from self::_hostedTipTap($document, $block);
                }
                continue;
            }

            if (is_array($node['content'] ?? null)) {
                yield from self::_tipTapInNodes(
                    $document,
                    $node['content'],
                    "{$path}.content",
                    $includeHosted,
                );
            }
        }
    }

    private static function _hostedTipTap(VizyDocument $document, VizyBlock $block): iterable
    {
        foreach (self::_hostedDocuments($document, $block) as $nested) {
            yield from self::tipTapNodes($nested, true);
        }
    }

    private static function _hostedDocuments(VizyDocument $document, VizyBlock $block): iterable
    {
        $layout = $block->blockType()?->getFieldLayout();
        if (!$layout) {
            return;
        }
        foreach ($layout->getCustomFieldElements() as $placement) {
            $field = $placement->getField();
            if (!$field instanceof VizyField) {
                continue;
            }
            if ($document->owner() && $document->field()) {
                $nested = $document->blockElement($block)->getFieldValue($field->handle);
            } else {
                $raw = $block->rawFieldValue($placement->uid);
                if (!self::isHostedEnvelope($raw)) {
                    continue;
                }
                $nested = Vizy::$plugin->getDocuments()->normalizeDetached($raw);
            }
            if ($nested instanceof VizyDocument) {
                yield $nested;
            }
        }
    }
}
