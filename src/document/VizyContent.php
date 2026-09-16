<?php
namespace verbb\vizy\document;

use verbb\vizy\Vizy;

use craft\helpers\StringHelper;

use Twig\Markup;

/**
 * A document fragment: root content or a nested TipTap subtree (e.g. layout column).
 *
 * Holds canonical raw TipTap node trees without dropping unknown types.
 * Hosted nesting is in Block fieldSlots, not TipTap children of vizyBlock.
 */
final class VizyContent
{
    // Public Methods
    // =========================================================================

    public function __construct(
        private VizyDocument $document,
        private array $nodes,
        private string $path,
    ) {
    }

    public function path(): string
    {
        return $this->path;
    }

    public function document(): VizyDocument
    {
        return $this->document;
    }

    public function isRoot(): bool
    {
        return $this->path === 'content';
    }

    public function nodes(): array
    {
        return $this->nodes;
    }

    public function isEmpty(): bool
    {
        // Editors can submit several blank paragraphs before persistence trims
        // them. Required validation and template reads must agree before saving.
        foreach ($this->nodes as $node) {
            if (($node['type'] ?? null) !== 'paragraph') {
                return false;
            }

            foreach ($node['content'] ?? [] as $child) {
                if (($child['type'] ?? null) === 'hardBreak') {
                    continue;
                }

                // Preserve inline atoms and unknown extension nodes as content.
                if (($child['type'] ?? null) !== 'text' || StringHelper::trim($child['text'] ?? '') !== '') {
                    return false;
                }
            }
        }

        return true;
    }

    public function blocks(bool $recursive = true, ?bool $enabled = true): array
    {
        $blocks = [];

        foreach ($this->nodes as $index => $node) {
            if (($node['type'] ?? null) === 'vizyBlock') {
                // Leaf blocks: nested docs live in Hosted fieldSlots, not TipTap children.
                $block = $this->document->blockFromNode($node, "{$this->path}.{$index}");
                if ($enabled === null || $block->isEnabled() === $enabled) {
                    $blocks[] = $block;
                }
            } elseif ($recursive && is_array($node['content'] ?? null)) {
                $nested = new self(
                    $this->document,
                    $node['content'],
                    "{$this->path}.{$index}.content",
                );
                array_push($blocks, ...$nested->blocks(true, $enabled));
            }
        }

        return $blocks;
    }

    public function traverse(): iterable
    {
        foreach ($this->nodes as $node) {
            yield $node;
            if (is_array($node['content'] ?? null)) {
                yield from $this->_traverseNodes($node['content']);
            }
        }
    }

    public function toArray(): array
    {
        return $this->nodes;
    }

    public function render(array $config = []): Markup
    {
        return Vizy::$plugin->getRenderer()->renderContent($this, $config);
    }


    // Private Methods
    // =========================================================================

    private function _traverseNodes(array $nodes): iterable
    {
        foreach ($nodes as $node) {
            yield $node;
            if (is_array($node['content'] ?? null)) {
                yield from $this->_traverseNodes($node['content']);
            }
        }
    }
}
