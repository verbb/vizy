<?php
namespace verbb\vizy\importers;

use DOMElement;
use InvalidArgumentException;

/**
 * Declarative bridge from an HTML element to one registered Vizy node or mark.
 */
final class HtmlImportRule
{
    // Static Methods
    // =========================================================================

    public static function node(
        array $tags,
        string $type,
        string $placement = self::PLACEMENT_INLINE,
        string $content = self::CONTENT_INLINE,
        mixed $attributes = null,
        int $priority = 0,
        mixed $matcher = null,
    ): self {
        return new self($tags, self::KIND_NODE, $type, $placement, $content, $attributes, $priority, $matcher);
    }

    public static function mark(
        array $tags,
        string $type,
        mixed $attributes = null,
        int $priority = 0,
        mixed $matcher = null,
    ): self {
        return new self($tags, self::KIND_MARK, $type, self::PLACEMENT_INLINE, self::CONTENT_INLINE, $attributes, $priority, $matcher);
    }


    // Constants
    // =========================================================================

    public const KIND_NODE = 'node';
    public const KIND_MARK = 'mark';
    public const PLACEMENT_BLOCK = 'block';
    public const PLACEMENT_INLINE = 'inline';
    public const CONTENT_BLOCK = 'block';
    public const CONTENT_INLINE = 'inline';
    public const CONTENT_NONE = 'none';


    // Properties
    // =========================================================================

    public readonly array $tags;
    public readonly string $kind;
    public readonly string $type;
    public readonly string $placement;
    public readonly string $content;
    public readonly int $priority;

    private mixed $attributes;
    private mixed $matcher;


    // Public Methods
    // =========================================================================

    public function __construct(
        array $tags,
        string $kind,
        string $type,
        string $placement = self::PLACEMENT_INLINE,
        string $content = self::CONTENT_INLINE,
        mixed $attributes = null,
        int $priority = 0,
        mixed $matcher = null,
    ) {
        $tags = array_values(array_unique(array_map(static fn(mixed $tag): string => strtolower(trim((string)$tag)), $tags)));

        if ($tags === [] || in_array('', $tags, true)) {
            throw new InvalidArgumentException('An HTML import rule requires at least one tag.');
        }

        if (!in_array($kind, [self::KIND_NODE, self::KIND_MARK], true)) {
            throw new InvalidArgumentException('An HTML import rule kind must be node or mark.');
        }

        if ($type === '') {
            throw new InvalidArgumentException('An HTML import rule requires a Vizy type.');
        }

        if (!in_array($placement, [self::PLACEMENT_BLOCK, self::PLACEMENT_INLINE], true)) {
            throw new InvalidArgumentException('An HTML import rule placement must be block or inline.');
        }

        if (!in_array($content, [self::CONTENT_BLOCK, self::CONTENT_INLINE, self::CONTENT_NONE], true)) {
            throw new InvalidArgumentException('An HTML import rule content mode is invalid.');
        }

        if ($kind === self::KIND_MARK && ($placement !== self::PLACEMENT_INLINE || $content !== self::CONTENT_INLINE)) {
            throw new InvalidArgumentException('HTML mark import rules must wrap inline content.');
        }

        if ($attributes !== null && !is_callable($attributes) && !is_array($attributes)) {
            throw new InvalidArgumentException('HTML import rule attributes must be an array or callable.');
        }

        if ($matcher !== null && !is_callable($matcher)) {
            throw new InvalidArgumentException('HTML import rule matcher must be callable.');
        }

        $this->tags = $tags;
        $this->kind = $kind;
        $this->type = $type;
        $this->placement = $placement;
        $this->content = $content;
        $this->attributes = $attributes;
        $this->matcher = $matcher;
        $this->priority = $priority;
    }

    public function matches(DOMElement $element): bool
    {
        return in_array(strtolower($element->tagName), $this->tags, true)
            && ($this->matcher === null || (bool)($this->matcher)($element));
    }

    public function resolveAttributes(DOMElement $element): array
    {
        $attributes = is_callable($this->attributes)
            ? ($this->attributes)($element)
            : ($this->attributes ?? []);

        if (!is_array($attributes)) {
            throw new InvalidArgumentException("HTML import rule {$this->type} returned non-array attributes.");
        }

        return $attributes;
    }
}
