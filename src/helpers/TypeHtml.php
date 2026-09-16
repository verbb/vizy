<?php
namespace verbb\vizy\helpers;

use verbb\vizy\base\Mark;
use verbb\vizy\base\MarkInterface;
use verbb\vizy\base\Node;
use verbb\vizy\base\NodeInterface;
use verbb\vizy\base\RenderContext;
use verbb\vizy\helpers\SafeHtml;

use craft\helpers\Html;

use yii\base\Event;

final class TypeHtml
{
    // Static Methods
    // =========================================================================

    public static function triggerClassEvent(string $class, string $name, Event $event): void
    {
        if (!Event::hasHandlers($class, $name)) {
            return;
        }

        Event::trigger($class, $name, $event);
    }

    public static function hasClassHandlers(string $class, string $name): bool
    {
        return Event::hasHandlers($class, $name);
    }

    /**
     * Shape matches Nodes::renderOpeningTag / renderClosingTag: one entry whose
     * `tag` may be a list (pre>code opens outer→inner; close reverses).
     */
    public static function structureFromTag(string|array|null $tag, array $attrs): array
    {
        if ($tag === null || $tag === '') {
            return [];
        }

        if (is_string($tag)) {
            return [['tag' => $tag, 'attrs' => $attrs]];
        }

        $names = [];
        foreach ($tag as $name) {
            if (is_string($name) && $name !== '') {
                $names[] = $name;
            }
        }

        if ($names === []) {
            return [];
        }

        // Nested wrappers stay one structure row so closing tags reverse correctly.
        return [['tag' => $names, 'attrs' => $attrs]];
    }

    public static function renderMark(string $class, string $innerHtml, array $attrs, RenderContext $ctx): string
    {
        $attrs = $class::resolveAttrs($attrs, $ctx);
        // Marks emit flat HTML attrs; strip onclick/srcdoc before beginTag.
        $attrs = SafeHtml::filterEmitAttrs($attrs);
        $tag = $class::tagForAttrs($attrs);
        if ($tag === null || $tag === '') {
            return $innerHtml;
        }

        $opening = $class::modifyTagStructure($tag, $attrs, $ctx, true);
        $closing = $class::modifyTagStructure($tag, $attrs, $ctx, false);

        if ($class::isSelfClosing()) {
            return Nodes::renderOpeningTag($opening) ?? '';
        }

        return (Nodes::renderOpeningTag($opening) ?? '')
            . $innerHtml
            . (Nodes::renderClosingTag($closing) ?? '');
    }

    public static function renderNode(string $class, string $children, array $attrs, RenderContext $ctx): string
    {
        $attrs = $class::resolveAttrs($attrs, $ctx);

        // Custom emitters (MediaEmbed, Image, …) may need structured attrs
        // (e.g. data.html). Filter only the default tag path so nested payloads
        // are not dropped as non-scalars.
        $custom = $class::renderOccurrenceHtml($children, $attrs, $ctx);
        if ($custom !== null) {
            return $class::modifyRenderedHtml($custom, $ctx);
        }

        $attrs = SafeHtml::filterEmitAttrs($attrs);
        $tag = $class::tagForAttrs($attrs);
        if ($tag === null || $tag === '') {
            // No tag — children only (omit-like carriers should not reach here with content).
            return $class::modifyRenderedHtml($children, $ctx);
        }

        $opening = $class::modifyTagStructure($tag, $attrs, $ctx, true);
        $closing = $class::modifyTagStructure($tag, $attrs, $ctx, false);

        if ($class::isSelfClosing()) {
            $html = Nodes::renderOpeningTag($opening) ?? '';
        } else {
            $html = (Nodes::renderOpeningTag($opening) ?? '')
                . $children
                . (Nodes::renderClosingTag($closing) ?? '');
        }

        return $class::modifyRenderedHtml($html, $ctx);
    }
}
