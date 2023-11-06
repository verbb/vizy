<?php
namespace verbb\vizy\helpers;

use verbb\vizy\base\MarkInterface;
use verbb\vizy\base\NodeInterface;
use verbb\vizy\helpers\StringHelper;

use Craft;
use craft\helpers\Html;
use craft\helpers\HtmlPurifier;
use craft\validators\HandleValidator;

use LitEmoji\LitEmoji;
use voku\helper\AntiXSS;

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
        } else if ($text = $node->getText()) {
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
        $value = preg_replace_callback('/([^\'"\?#]*)(\?[^\'"\?#]+)?(#[^\'"\?#]+)?(?:#|%23)([\w]+)\:(\d+)(?:@(\d+))?(\:(?:transform\:)?' . HandleValidator::$handlePattern . ')?/', function($matches) {
            [, $url, $query, $hash, $elementType, $ref, $siteId, $transform] = array_pad($matches, 10, null);

            // Create the ref tag, and make sure :url is in there
            $ref = $elementType . ':' . $ref . ($siteId ? "@$siteId" : '') . ($transform ?: ':url');

            if ($query || $hash) {
                // Make sure that the query/hash isn't actually part of the parsed URL
                // - someone's Entry URL Format could include "?slug={slug}" or "#{slug}", etc.
                // - assets could include ?mtime=X&focal=none, etc.
                $parsed = Craft::$app->getElements()->parseRefs("{{$ref}}");

                if ($query) {
                    // Decode any HTML entities, e.g. &amp;
                    $query = Html::decode($query);

                    if (str_contains($parsed, $query)) {
                        $url .= $query;
                        $query = '';
                    }
                }
                if ($hash && str_contains($parsed, $hash)) {
                    $url .= $hash;
                    $hash = '';
                }
            }

            return '{' . $ref . '||' . $url . '}' . $query . $hash;
        }, $value);

        if (StringHelper::contains($value, '{')) {
            $value = Craft::$app->getElements()->parseRefs($value, $siteId);
        }

        return $value;
    }

    public static function serializeContent($rawNode)
    {
        $nodeType = $rawNode['type'] ?? '';
        $content = $rawNode['content'] ?? [];

        $antiXss = new AntiXSS();

        foreach ($content as $key => $block) {
            $type = $block['type'] ?? '';

            // We only want to modify simple nodes and their text content, not complicated
            // nodes like VizyBlocks, which could mess things up as fields control their content.
            $text = $block['text'] ?? '';

            // Escape any HTML tags used in the text. Maybe we're writing HTML in text?
            // But don't encode quotes, things like `&quot;` are invalid in JSON
            // Important to do this before emoji processing, as that'll replace `«`, etc characters
            if ($nodeType === 'codeBlock') {
                // Escape `<` and `>` for script HTML tags in code blocks. While AntiXSS will filter out any
                // `<script>` tags (correctly), they're valid in code blocks so long as they're escaped.
                // Using `htmlspecialchars` is too troublesome with ampersands, etc.
                $text = str_replace(['<', '>'], ['&lt;', '&gt;'], $text);
            } else {
                $text = $antiXss->xss_clean((string)$text);
            }

            // Serialize any emoji's
            $text = StringHelper::emojiToShortcodes($text);

            $rawNode['content'][$key]['text'] = $text;

            // If this is now an empty text node, remove it. Tiptap won't like it.
            if ($rawNode['content'][$key]['text'] === '' && $type === 'text') {
                unset($rawNode['content'][$key]);
            }
        }

        return $rawNode;
    }

    public static function normalizeContent($rawNode): array
    {
        $content = $rawNode['content'] ?? [];

        foreach ($content as $key => $block) {
            // We only want to modify simple nodes and their text content, not complicated
            // nodes like VizyBlocks, which could mess things up as fields control their content.
            $text = $block['text'] ?? '';

            // Un-serialize any emoji's
            $text = StringHelper::shortcodesToEmoji($text);

            $rawNode['content'][$key]['text'] = $text;
        }

        return $rawNode;
    }
    
}
