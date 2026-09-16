<?php
namespace verbb\vizy\document;

use verbb\vizy\Vizy;
use verbb\vizy\base\RenderContext;
use verbb\vizy\fields\VizyField;

use craft\base\ElementInterface;

/**
 * Constructs immutable documents from strict canonical envelopes.
 */
final class DocumentParser
{
    // Public Methods
    // =========================================================================

    public function __construct(
        private DocumentUpgrader $upgrader = new DocumentUpgrader(),
        private SemanticNodeValidator $semanticValidator = new SemanticNodeValidator(),
    ) {
    }

    public function parse(
        array $value,
        ?ElementInterface $owner = null,
        ?VizyField $field = null,
    ): VizyDocument
    {
        $value = $this->upgrader->upgrade($value);

        // Type normalizeAttrs — semantic shaping only; resolve stays on render out.
        if (is_array($value['content'] ?? null) && Vizy::$plugin) {
            $ctx = new RenderContext(
                document: null,
                field: $field,
                owner: $owner,
                siteId: $owner?->siteId,
            );
            $value['content'] = Vizy::$plugin->getExtensions()->normalizeDocumentAttrs($value['content'], $ctx);
        }

        $this->_validateEnvelope($value);

        return VizyDocument::fromCanonicalData($value, $owner, $field);
    }


    // Private Methods
    // =========================================================================

    private function _validateEnvelope(array $value): void
    {
        if (($value['type'] ?? null) !== 'doc' || !is_array($value['attrs'] ?? null)) {
            throw new InvalidDocumentException('Malformed canonical Vizy document envelope.');
        }

        $content = $value['content'] ?? null;
        if (!is_array($content) || !array_is_list($content)) {
            throw new InvalidDocumentException('Canonical document content must be a node list.');
        }

        foreach ($content as $index => $node) {
            $this->_validateNode($node, "content.{$index}", 'doc');
        }
    }

    private function _validateNode(mixed $node, string $path, string $parentType): void
    {
        if (!is_array($node) || !is_string($node['type'] ?? null) || trim($node['type']) === '') {
            throw new InvalidDocumentException("Malformed node at {$path}: a non-empty type is required.");
        }

        // Editor placeholders are transport values, never a persistence fallback.
        if (in_array($node['type'], ['unsupportedNode', 'unsupportedInlineNode', 'unsupportedMark'], true)) {
            throw new InvalidDocumentException("Editor placeholder found in canonical content at {$path}.");
        }

        // Content Areas retired — Hosted Vizy is the sole nesting model.
        if ($node['type'] === 'vizySlot') {
            throw new InvalidDocumentException("Retired Content Area (vizySlot) at {$path}.");
        }

        if (isset($node['attrs']) && !is_array($node['attrs'])) {
            throw new InvalidDocumentException("Malformed attrs at {$path}.");
        }

        if (isset($node['marks'])) {
            if (!is_array($node['marks']) || !array_is_list($node['marks'])) {
                throw new InvalidDocumentException("Malformed marks at {$path}.");
            }

            foreach ($node['marks'] as $markIndex => $mark) {
                if (!is_array($mark) || !is_string($mark['type'] ?? null) || trim($mark['type']) === '') {
                    throw new InvalidDocumentException("Malformed mark at {$path}.marks.{$markIndex}.");
                }
                if (isset($mark['attrs']) && !is_array($mark['attrs'])) {
                    throw new InvalidDocumentException("Malformed mark attrs at {$path}.marks.{$markIndex}.");
                }
                if (($mark['type'] ?? null) === 'link') {
                    $this->semanticValidator->validateLinkMark($mark, "{$path}.marks.{$markIndex}");
                }
            }
        }

        if ($node['type'] === 'text' && !is_string($node['text'] ?? null)) {
            throw new InvalidDocumentException("Text node at {$path} requires string text.");
        }

        if ($node['type'] === 'vizyBlock') {
            $this->_validateBlock($node, $path);
        } elseif ($node['type'] === 'layout') {
            $this->_validateLayout($node, $path);
        } elseif ($node['type'] === 'column') {
            $this->_validateColumn($node, $path, $parentType);
        } else {
            $this->semanticValidator->validateNodeType($node['type'], $node, $path);
        }

        if (isset($node['content'])) {
            if (!is_array($node['content']) || !array_is_list($node['content'])) {
                throw new InvalidDocumentException("Malformed child content at {$path}.");
            }
            // vizyBlock is a TipTap leaf — do not walk children (validated empty above).
            if ($node['type'] === 'vizyBlock') {
                return;
            }
            foreach ($node['content'] as $index => $child) {
                $this->_validateNode($child, "{$path}.content.{$index}", $node['type']);
            }
        }
    }

    private function _validateBlock(array $node, string $path): void
    {
        $attrs = $node['attrs'] ?? [];
        foreach (['blockUid', 'blockTypeUid'] as $attribute) {
            if (!is_string($attrs[$attribute] ?? null) || $attrs[$attribute] === '') {
                throw new InvalidDocumentException("Block at {$path} requires attrs.{$attribute}.");
            }
        }
        if (!is_bool($attrs['enabled'] ?? null) || !is_array($attrs['fieldSlots'] ?? null)) {
            throw new InvalidDocumentException("Block at {$path} requires boolean enabled and object fieldSlots.");
        }

        foreach (array_keys($attrs['fieldSlots']) as $placementUid) {
            if (!is_string($placementUid) || $placementUid === '') {
                throw new InvalidDocumentException("Block fieldSlots at {$path} require non-empty placement UID keys.");
            }
        }

        // Leaf grammar: omit content, null, or []. Nesting lives in Hosted fieldSlots.
        // Non-empty TipTap children are healed in DocumentUpgrader before this check.
        if (array_key_exists('content', $node)) {
            $content = $node['content'];
            if ($content !== null && (!is_array($content) || $content !== [])) {
                throw new InvalidDocumentException("Vizy Block at {$path} must be a leaf (empty or omitted content).");
            }
        }
    }

    private function _validateLayout(array $node, string $path): void
    {
        $attrs = $node['attrs'] ?? [];
        if (!is_string($attrs['layoutUid'] ?? null) || $attrs['layoutUid'] === '') {
            throw new InvalidDocumentException("Layout at {$path} requires attrs.layoutUid.");
        }
        $stack = $attrs['stack'] ?? 'small';
        if (!in_array($stack, ['small', 'never'], true)) {
            throw new InvalidDocumentException("Layout at {$path} has invalid stack intent.");
        }
        $children = $node['content'] ?? [];
        if (!is_array($children) || count($children) < 2 || count($children) > 4) {
            throw new InvalidDocumentException("Layout at {$path} requires 2–4 columns.");
        }
        $spanTotal = 0;
        $columnUids = [];
        foreach ($children as $index => $child) {
            if (!is_array($child) || ($child['type'] ?? null) !== 'column') {
                throw new InvalidDocumentException("Layout at {$path} may contain columns only.");
            }
            $columnAttrs = $child['attrs'] ?? [];
            $columnUid = $columnAttrs['columnUid'] ?? null;
            if (!is_string($columnUid) || $columnUid === '') {
                throw new InvalidDocumentException("Column at {$path}.content.{$index} requires attrs.columnUid.");
            }
            if (isset($columnUids[$columnUid])) {
                throw new InvalidDocumentException("Duplicate column UID {$columnUid} in layout at {$path}.");
            }
            $columnUids[$columnUid] = true;
            $span = (int)($columnAttrs['span'] ?? 0);
            if ($span < 1 || $span > 12) {
                throw new InvalidDocumentException("Column at {$path}.content.{$index} span must be 1–12.");
            }
            $spanTotal += $span;
        }
        if ($spanTotal !== 12) {
            throw new InvalidDocumentException("Layout at {$path} column spans must total 12.");
        }
    }

    private function _validateColumn(array $node, string $path, string $parentType): void
    {
        if ($parentType !== 'layout') {
            throw new InvalidDocumentException("Column at {$path} must be a direct child of layout.");
        }
        $attrs = $node['attrs'] ?? [];
        if (!is_string($attrs['columnUid'] ?? null) || $attrs['columnUid'] === '') {
            throw new InvalidDocumentException("Column at {$path} requires attrs.columnUid.");
        }
        $span = (int)($attrs['span'] ?? 0);
        if ($span < 1 || $span > 12) {
            throw new InvalidDocumentException("Column at {$path} span must be 1–12.");
        }
        foreach ($node['content'] ?? [] as $index => $child) {
            if (is_array($child) && ($child['type'] ?? null) === 'layout') {
                throw new InvalidDocumentException("Nested layout at {$path}.content.{$index} is not allowed.");
            }
        }
    }
}
