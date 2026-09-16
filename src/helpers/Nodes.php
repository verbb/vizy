<?php
namespace verbb\vizy\helpers;

use verbb\vizy\base\MarkInterface;
use verbb\vizy\base\NodeInterface;
use verbb\vizy\helpers\StringHelper;

use Craft;
use craft\helpers\Html;
use craft\validators\HandleValidator;

class Nodes
{
    // Static Methods
    // =========================================================================

    public static function renderNode(NodeInterface $node, ?NodeInterface $previousNode = null, ?NodeInterface $nextNode = null, array &$markStack = []): string
    {
        $html = [];
        $markTagsToClose = [];

        if (isset($node->marks)) {
            foreach ($node->marks as $mark) {
                if (!self::markShouldOpen($mark, $previousNode)) {
                    continue;
                }

                $html[] = $mark->renderOpeningTag();

                $markStack[] = $mark;
            }
        }

        $html[] = $node->renderOpeningTag();

        if ($node->content) {
            $nestedNodeMarkStack = [];

            foreach ($node->content as $index => $nestedNode) {
                $prevNestedNode = $node->content[$index - 1] ?? null;
                $nextNestedNode = $node->content[$index + 1] ?? null;
            
                $html[] = self::renderNode($nestedNode, $prevNestedNode, $nextNestedNode, $nestedNodeMarkStack);
            }
        } else if ($text = $node->renderText()) {
            $html[] = $text;
        }

        if (!$node->selfClosing()) {
            $html[] = $node->renderClosingTag();
        }

        if (isset($node->marks)) {
            foreach (array_reverse($node->marks) as $mark) {
                if (!self::markShouldClose($mark, $nextNode)) {
                    continue;
                }

                $markTagsToClose[] = $mark;
            }

            $html = array_merge($html, self::closeAndReopenTags($markTagsToClose, $markStack));
        }

        return join($html);
    }

    public static function closeAndReopenTags(array $markTagsToClose, array &$markStack): array
    {
        $markTagsToReopen = [];

        $closingTags = self::closeMarkTags($markTagsToClose, $markStack, $markTagsToReopen);
        $reopeningTags = self::reopenMarkTags($markTagsToReopen, $markStack);

        return array_merge($closingTags, $reopeningTags);
    }

    public static function closeMarkTags($markTagsToClose, &$markStack, &$markTagsToReopen): array
    {
        $html = [];

        while (!empty($markTagsToClose)) {
            $mark = array_pop($markStack);
            $html[] = $mark->renderClosingTag();

            if (count(array_filter($markTagsToClose, function ($markToClose) use ($mark) {
                return $mark == $markToClose;
            })) == 0) {
                $markTagsToReopen[] = $mark;
            } else {
                $markTagsToClose = array_udiff($markTagsToClose, [$mark], function ($a1, $a2) {
                    return strcmp($a1->type, $a2->type);
                });
            }
        }

        return $html;
    }

    public static function reopenMarkTags(array $markTagsToReopen, array &$markStack): array
    {
        $html = [];

        foreach (array_reverse($markTagsToReopen) as $mark) {
            $html[] = $mark->renderOpeningTag();
            $markStack[] = $mark;
        }

        return $html;
    }

    public static function markShouldOpen(?MarkInterface $mark, ?NodeInterface $previousNode): bool
    {
        return self::nodeHasMark($previousNode, $mark);
    }

    public static function markShouldClose(?MarkInterface $mark, ?NodeInterface $nextNode): bool
    {
        return self::nodeHasMark($nextNode, $mark);
    }

    public static function nodeHasMark(?NodeInterface $node, ?MarkInterface $mark): bool
    {
        if (!$node) {
            return true;
        }

        if (!property_exists($node, 'marks')) {
            return true;
        }

        // The other node has same mark
        foreach ($node->marks as $otherMark) {
            if ($mark == $otherMark) {
                return false;
            }
        }

        return true;
    }

    public static function renderOpeningTag(array $tags): ?string
    {
        if (!$tags || !count($tags)) {
            return null;
        }

        return implode(array_map(function($tag) {
            $tagNames = $tag['tag'] ?? [];
            $attrs = $tag['attrs'] ?? [];

            if (!is_array($tagNames)) {
                $tagNames = [$tagNames];
            }

            return implode(array_map(function($tagName) use ($attrs) {
                return Html::beginTag($tagName, $attrs);
            }, $tagNames));
        }, $tags));
    }

    public static function renderClosingTag(array $tags): ?string
    {
        if (!$tags || !count($tags)) {
            return null;
        }

        return implode(array_map(function($tag) {
            $tagNames = $tag['tag'] ?? [];

            if (!is_array($tagNames)) {
                $tagNames = [$tagNames];
            }

            return implode(array_map(function($tagName) {
                return Html::endTag($tagName);
            }, array_reverse($tagNames)));
        }, $tags));
    }

    public static function parseRefTags($value, $siteId): array|string|null
    {
        // Prefer the focused service when the plugin is booted; fall back for early boot.
        if (class_exists(\verbb\vizy\Vizy::class) && \verbb\vizy\Vizy::$plugin) {
            return \verbb\vizy\Vizy::$plugin->getRefTags()->parse($value, $siteId);
        }

        return (new \verbb\vizy\services\RefTags())->parse($value, $siteId);
    }

    public static function serializeContent($rawNode)
    {
        return $rawNode;
    }

    public static function normalizeContent($rawNode): array
    {
        $content = $rawNode['content'] ?? [];

        foreach ($content as $key => $block) {
            // We only want to modify simple nodes and their text content, not complicated
            // nodes like VizyBlocks, which could mess things up as fields control their content.
            $text = $block['text'] ?? '';

            $rawNode['content'][$key]['text'] = $text;
        }

        return $rawNode;
    }
    
}
