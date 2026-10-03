<?php
namespace verbb\vizy\gql;

use verbb\vizy\Vizy;
use verbb\vizy\document\VizyBlock;
use verbb\vizy\document\VizyContentNode;
use verbb\vizy\document\VizyDocument;

/**
 * GraphQL resolver source for one TipTap node (prose, layout, or Block).
 *
 * Built from raw canonical arrays or {@see VizyDocument::query()} rows — no
 * TipTap class hydration.
 */
final class GqlNode
{
    // Static Methods
    // =========================================================================

    public static function fromRaw(VizyDocument $document, array $node, string $path): self
    {
        $block = ($node['type'] ?? null) === 'vizyBlock'
            ? $document->blockFromNode($node, $path)
            : null;

        return new self($document, $node, $path, $block);
    }

    public static function fromQueryRow(VizyBlock|VizyContentNode $row): self
    {
        if ($row instanceof VizyBlock) {
            return new self($row->document(), $row->toArray(), 'query', $row);
        }

        return new self($row->document(), $row->toArray(), $row->path());
    }


    // Properties
    // =========================================================================

    private VizyDocument $_document;
    private array $_node;
    private string $_path;
    private ?VizyBlock $_block;


    // Public Methods
    // =========================================================================

    public function document(): VizyDocument
    {
        return $this->_document;
    }

    public function node(): array
    {
        return $this->_node;
    }

    public function path(): string
    {
        return $this->_path;
    }

    public function type(): string
    {
        return (string)($this->_node['type'] ?? '');
    }

    public function isBlock(): bool
    {
        return $this->type() === 'vizyBlock';
    }

    public function block(): ?VizyBlock
    {
        return $this->_block;
    }

    public function attrs(): array
    {
        return is_array($this->_node['attrs'] ?? null) ? $this->_node['attrs'] : [];
    }

    public function children(): array
    {
        // Blocks nest via Hosted Vizy fieldSlots, not TipTap children.
        if ($this->isBlock()) {
            return [];
        }

        $content = $this->_node['content'] ?? null;

        if (!is_array($content)) {
            return [];
        }

        $children = [];

        foreach ($content as $index => $child) {
            if (!is_array($child)) {
                continue;
            }
            $children[] = self::fromRaw($this->_document, $child, "{$this->_path}.content.{$index}");
        }

        return $children;
    }

    public function marks(): array
    {
        $marks = $this->_node['marks'] ?? null;

        if (!is_array($marks)) {
            return [];
        }

        $out = [];

        foreach ($marks as $mark) {
            if (is_array($mark)) {
                $out[] = GqlMark::fromRaw($mark);
            }
        }

        return $out;
    }

    public function text(): ?string
    {
        if (is_string($this->_node['text'] ?? null)) {
            return $this->_node['text'];
        }

        // Concatenate descendant text for container nodes (paragraph, heading, …).
        $parts = [];
        $this->_collectText($this->_node, $parts);

        return $parts === [] ? null : implode('', $parts);
    }

    public function isUnknown(): bool
    {
        $type = $this->type();

        if ($type === '' || $type === 'vizyBlock') {
            return false;
        }

        return Vizy::$plugin->getExtensions()->getDefinition('node', $type) === null;
    }

    public function footnoteNumber(): ?int
    {
        $uid = $this->attrs()['footnoteUid'] ?? null;

        if (!is_string($uid) || $uid === '') {
            return null;
        }
        $number = 0;
        $seen = [];
        $found = null;
        $walk = function(array $nodes, string $prefix) use (&$walk, &$number, &$seen, &$found, $uid): void {
            foreach ($nodes as $index => $node) {
                if ($found !== null || !is_array($node)) {
                    continue;
                }

                if (($node['type'] ?? null) === 'footnoteReference') {
                    $referenceUid = $node['attrs']['footnoteUid'] ?? null;

                    if (is_string($referenceUid) && !isset($seen[$referenceUid])) {
                        $seen[$referenceUid] = true;
                        $number++;

                        if ($referenceUid === $uid) {
                            $found = $number;
                            return;
                        }
                    }
                }

                if (is_array($node['content'] ?? null)) {
                    $walk($node['content'], "{$prefix}.{$index}.content");
                }
            }
        };
        $walk($this->_document->toArray()['content'] ?? [], 'content');
        return $found;
    }

    public function footnoteDefinition(): ?self
    {
        $uid = $this->attrs()['footnoteUid'] ?? null;

        if (!is_string($uid) || $uid === '') {
            return null;
        }
        $found = null;
        $walk = function(array $nodes, string $prefix) use (&$walk, &$found, $uid): void {
            foreach ($nodes as $index => $node) {
                if ($found !== null || !is_array($node)) {
                    continue;
                }
                $path = "{$prefix}.{$index}";

                if (($node['type'] ?? null) === 'footnoteItem' && ($node['attrs']['footnoteUid'] ?? null) === $uid) {
                    $found = self::fromRaw($this->_document, $node, $path);
                    return;
                }

                if (is_array($node['content'] ?? null)) {
                    $walk($node['content'], "{$path}.content");
                }
            }
        };
        $walk($this->_document->toArray()['content'] ?? [], 'content');
        return $found;
    }


    // Private Methods
    // =========================================================================

    private function __construct(
        VizyDocument $document,
        array $node,
        string $path,
        ?VizyBlock $block = null,
    ) {
        $this->_document = $document;
        $this->_node = $node;
        $this->_path = $path;
        $this->_block = $block;
    }

    private function _collectText(array $node, array &$parts): void
    {
        if (is_string($node['text'] ?? null)) {
            $parts[] = $node['text'];
        }

        foreach ($node['content'] ?? [] as $child) {
            if (is_array($child)) {
                $this->_collectText($child, $parts);
            }
        }
    }
}
