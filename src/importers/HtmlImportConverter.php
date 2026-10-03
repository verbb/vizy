<?php
namespace verbb\vizy\importers;

use verbb\vizy\document\DocumentParser;
use verbb\vizy\document\VizyDocument;
use verbb\vizy\fields\VizyField;
use verbb\vizy\helpers\SafeHtml;
use verbb\vizy\marks\TextStyle;

use craft\helpers\StringHelper;

use DOMDocument;
use DOMElement;
use DOMNode;
use DOMText;
use DOMXPath;
use RuntimeException;
use Throwable;

/**
 * Request-local converter. Keeping mutable traversal state out of the service makes nested calls safe.
 */
final class HtmlImportConverter
{
    // Properties
    // =========================================================================

    private array $allowedNodes;
    private array $allowedMarks;
    private array $headingLevels;
    private array $diagnostics = [];
    private array $footnoteDefinitions = [];


    // Public Methods
    // =========================================================================

    public function __construct(
        private readonly VizyField $field,
        private readonly array $manifest,
        private readonly HtmlImportOptions $options,
        private array $rules,
    ) {
        $this->allowedNodes = array_fill_keys([
            ...($manifest['enabledNodes'] ?? []),
            ...($manifest['internalNodes'] ?? []),
        ], true);
        $this->allowedMarks = array_fill_keys($manifest['enabledMarks'] ?? [], true);
        $this->headingLevels = array_fill_keys($manifest['headingLevels'] ?? [], true);
        usort($this->rules, static fn(HtmlImportRule $a, HtmlImportRule $b): int => $b->priority <=> $a->priority);
    }

    public function convert(string $html): HtmlImportResult
    {
        if (strlen($html) > $this->options->maxHtmlBytes) {
            throw new HtmlImportException("HTML import exceeds the {$this->options->maxHtmlBytes}-byte limit.");
        }

        $root = $this->_parseFragment($html);
        $this->_assertTreeBounds($root);
        $content = $this->_convertBlockChildren($root, 0);
        $content = $this->_attachFootnoteDefinitions($content);

        if ($this->field->rootContentType === VizyField::ROOT_CONTENT_BLOCKS) {
            $prose = array_filter($content, static fn(array $node): bool => ($node['type'] ?? null) !== 'vizyBlock');

            if ($prose !== []) {
                $this->_diagnose(
                    'rootContentDisallowsProse',
                    'The destination field accepts root Vizy Blocks; imported prose was removed.',
                    $root,
                );
                $content = array_values(array_filter(
                    $content,
                    static fn(array $node): bool => ($node['type'] ?? null) === 'vizyBlock',
                ));
            }
        }

        $document = (new DocumentParser())->parse([
            'type' => 'doc',
            'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
            'content' => $content,
        ], null, $this->field);

        return new HtmlImportResult($document, $this->diagnostics);
    }


    // Private Methods
    // =========================================================================

    private function _parseFragment(string $html): DOMElement
    {
        $dom = new DOMDocument('1.0', 'UTF-8');
        $previous = libxml_use_internal_errors(true);
        libxml_clear_errors();
        $wrapped = '<!doctype html><html><body><div data-vizy-import-root="1">' . $html . '</div></body></html>';
        $loaded = $dom->loadHTML('<?xml encoding="UTF-8">' . $wrapped, LIBXML_NONET | LIBXML_NOERROR | LIBXML_NOWARNING);
        libxml_clear_errors();
        libxml_use_internal_errors($previous);

        if (!$loaded) {
            throw new HtmlImportException('HTML import could not parse the supplied markup.');
        }
        $root = (new DOMXPath($dom))->query('//*[@data-vizy-import-root="1"]')->item(0);

        if (!$root instanceof DOMElement) {
            throw new HtmlImportException('HTML import could not locate its parsed fragment.');
        }

        return $root;
    }

    private function _convertBlockChildren(DOMNode $parent, int $depth): array
    {
        $this->_guardDepth($depth);
        $blocks = [];
        $inline = [];

        $flushInline = function() use (&$blocks, &$inline): void {
            $inline = $this->_trimInline($inline);

            if ($inline !== []) {
                $blocks[] = ['type' => 'paragraph', 'content' => $inline];
            }
            $inline = [];
        };

        foreach ($parent->childNodes as $child) {
            if ($child instanceof DOMText && trim($child->nodeValue ?? '') === '') {
                continue;
            }

            if ($child instanceof DOMElement && $this->_isBlockElement($child)) {
                $flushInline();
                $blocks = [...$blocks, ...$this->_convertBlockElement($child, $depth + 1)];
            } else {
                $inline = [...$inline, ...$this->_convertInlineNode($child, [], $depth + 1)];
            }
        }
        $flushInline();

        return $blocks;
    }

    private function _convertBlockElement(DOMElement $element, int $depth): array
    {
        $rule = $this->_matchingRule($element, HtmlImportRule::PLACEMENT_BLOCK);

        if ($rule) {
            return $this->_convertRuleNode($element, $rule, [], $depth);
        }
        $tag = strtolower($element->tagName);

        return match ($tag) {
            'p' => $this->_paragraph($element, $depth),
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6' => [$this->_heading($element, (int)substr($tag, 1), $depth)],
            'blockquote' => $this->_blockquote($element, $depth),
            'pre' => $this->_codeBlock($element),
            'ul' => $this->_list($element, strtolower($element->getAttribute('data-type')) === 'tasklist' ? 'taskList' : 'bulletList', $depth),
            'ol' => $this->_list($element, 'orderedList', $depth),
            'details' => $this->_details($element, $depth),
            'table' => $this->_table($element, $depth),
            'hr' => $this->_leafBlock($element, 'horizontalRule'),
            'img' => $this->_image($element),
            'section' => strtolower($element->getAttribute('data-type')) === 'footnotelist'
                ? $this->_footnoteList($element, $depth)
                : $this->_container($element, $depth),
            'div', 'article', 'main', 'header', 'footer', 'aside', 'nav', 'figure', 'figcaption' => $this->_container($element, $depth),
            default => $this->_unsupportedContainer($element, $depth),
        };
    }

    private function _paragraph(DOMElement $element, int $depth): array
    {
        $this->_diagnoseDiscardedAttributes($element);
        $blocks = [];
        $inline = [];

        $flushInline = function(bool $keepEmpty = false) use (&$blocks, &$inline): void {
            $inline = $this->_trimInline($inline);

            if ($inline !== [] || ($keepEmpty && $blocks === [])) {
                $blocks[] = ['type' => 'paragraph', 'content' => $inline];
            }
            $inline = [];
        };

        foreach ($element->childNodes as $child) {
            $rule = $child instanceof DOMElement
                ? $this->_matchingRule($child, HtmlImportRule::PLACEMENT_BLOCK)
                : null;

            if ($rule) {
                $flushInline();
                $blocks = [...$blocks, ...$this->_convertRuleNode($child, $rule, [], $depth + 1)];
            } else {
                $inline = [...$inline, ...$this->_convertInlineNode($child, [], $depth + 1)];
            }
        }
        $flushInline(true);

        return $blocks;
    }

    private function _heading(DOMElement $element, int $level, int $depth): array
    {
        $this->_diagnoseDiscardedAttributes($element);
        $content = $this->_trimInline($this->_convertInlineChildren($element, [], $depth));

        if (!$this->_allowsNode('heading') || !isset($this->headingLevels[$level])) {
            $this->_diagnose('disallowedHeading', "Heading level {$level} is not enabled for the destination field; its text was kept as a paragraph.", $element);
            return ['type' => 'paragraph', 'content' => $content];
        }

        return ['type' => 'heading', 'attrs' => ['level' => $level], 'content' => $content];
    }

    private function _blockquote(DOMElement $element, int $depth): array
    {
        $this->_diagnoseDiscardedAttributes($element);
        $children = $this->_convertBlockChildren($element, $depth);
        $children = $children !== [] ? $children : [['type' => 'paragraph', 'content' => []]];

        if (!$this->_allowsNode('blockquote')) {
            $this->_diagnose('disallowedNode', 'Block quotes are not enabled for the destination field; their content was kept without the quote.', $element, ['type' => 'blockquote']);
            return $children;
        }

        return [['type' => 'blockquote', 'content' => $children]];
    }

    private function _codeBlock(DOMElement $element): array
    {
        $this->_diagnoseDiscardedAttributes($element);
        $language = null;

        foreach ($element->getElementsByTagName('*') as $descendant) {
            if (strtolower($descendant->tagName) !== 'code') {
                $this->_diagnose('unsupportedElement', "Unsupported element <{$descendant->tagName}> inside preformatted text was removed while its text was kept.", $descendant, ['tag' => strtolower($descendant->tagName)]);
            }
            $allowedAttributes = [];

            if (strtolower($descendant->tagName) === 'code' && $descendant->hasAttribute('class')) {
                $classNames = array_values(array_filter(preg_split('/\s+/', trim($descendant->getAttribute('class'))) ?: []));

                foreach ($classNames as $className) {
                    if (preg_match('/^language-([a-z0-9][a-z0-9_+-]{0,31})$/i', $className, $matches) === 1) {
                        $language = strtolower($matches[1]);
                        break;
                    }
                }

                if (count($classNames) === 1 && $language !== null) {
                    $allowedAttributes[] = 'class';
                }
            }
            $this->_diagnoseDiscardedAttributes($descendant, $allowedAttributes);
        }
        $text = $element->textContent;

        if (!$this->_allowsNode('codeBlock')) {
            $this->_diagnose('disallowedNode', 'Code blocks are not enabled for the destination field; their text was kept as a paragraph.', $element, ['type' => 'codeBlock']);
            return [['type' => 'paragraph', 'content' => $text === '' ? [] : [['type' => 'text', 'text' => $text]]]];
        }

        $node = [
            'type' => 'codeBlock',
            'content' => $text === '' ? [] : [['type' => 'text', 'text' => $text]],
        ];

        if ($language !== null) {
            $node['attrs'] = ['language' => $language];
        }

        return [$node];
    }

    private function _list(DOMElement $element, string $type, int $depth): array
    {
        $allowedAttributes = match ($type) {
            'orderedList' => ['start'],
            'taskList' => ['data-type'],
            default => [],
        };
        $this->_diagnoseDiscardedAttributes($element, $allowedAttributes);
        $items = [];

        foreach ($element->childNodes as $child) {
            if (!$child instanceof DOMElement || strtolower($child->tagName) !== 'li') {
                if ($child instanceof DOMText && trim($child->nodeValue ?? '') === '') {
                    continue;
                }
                $this->_diagnose('invalidListChild', 'List content outside a list item was ignored.', $child);
                continue;
            }
            $items[] = $this->_listItem($child, $depth + 1, $type === 'taskList');
        }

        if (!$this->_allowsNode($type)) {
            $this->_diagnose('disallowedNode', 'This list type is not enabled for the destination field; list items were kept as ordinary blocks.', $element, ['type' => $type]);
            return array_merge(...array_map(static fn(array $item): array => $item['content'] ?? [], $items));
        }
        $node = ['type' => $type, 'content' => $items];

        if ($type === 'orderedList' && $element->hasAttribute('start')) {
            $start = filter_var($element->getAttribute('start'), FILTER_VALIDATE_INT);

            if (is_int($start)) {
                $node['attrs'] = ['start' => $start];
            } else {
                $this->_diagnose('invalidAttribute', 'The ordered-list start attribute is not an integer and was removed.', $element, ['tag' => 'ol', 'attribute' => 'start']);
            }
        }

        return [$node];
    }

    private function _listItem(DOMElement $element, int $depth, bool $task = false): array
    {
        $this->_diagnoseDiscardedAttributes($element, $task ? ['data-type', 'data-checked'] : []);
        $contentRoot = $element;

        if ($task) {
            foreach ($element->childNodes as $child) {
                if ($child instanceof DOMElement && strtolower($child->tagName) === 'div') {
                    $contentRoot = $child;
                    break;
                }
            }
        }
        $content = $this->_convertBlockChildren($contentRoot, $depth);

        if ($content === []) {
            $content[] = ['type' => 'paragraph', 'content' => []];
        }

        if (!$task) {
            return ['type' => 'listItem', 'content' => $content];
        }
        $checked = strtolower($element->getAttribute('data-checked')) === 'true';

        if (!$checked) {
            $checkbox = $element->getElementsByTagName('input')->item(0);
            $checked = $checkbox instanceof DOMElement && $checkbox->hasAttribute('checked');
        }

        return ['type' => 'taskItem', 'attrs' => ['checked' => $checked], 'content' => $content];
    }

    private function _details(DOMElement $element, int $depth): array
    {
        $this->_diagnoseDiscardedAttributes($element);
        $summary = null;
        $contentRoot = null;

        foreach ($element->childNodes as $child) {
            if (!$child instanceof DOMElement) {
                continue;
            }
            $tag = strtolower($child->tagName);

            if ($tag === 'summary' && $summary === null) {
                $summary = $child;
            } elseif ($tag === 'div' && strtolower($child->getAttribute('data-type')) === 'detailscontent') {
                $contentRoot = $child;
            }
        }
        $summaryContent = $summary ? $this->_trimInline($this->_convertInlineChildren($summary, [], $depth + 1)) : [];
        $content = [];

        if ($contentRoot) {
            $this->_diagnoseDiscardedAttributes($contentRoot, ['data-type']);
            $content = $this->_convertBlockChildren($contentRoot, $depth + 1);
        } else {
            $inline = [];

            foreach ($element->childNodes as $child) {
                if ($child === $summary || ($child instanceof DOMText && trim($child->nodeValue ?? '') === '')) {
                    continue;
                }

                if ($child instanceof DOMElement && $this->_isBlockElement($child)) {
                    if ($inline !== []) {
                        $content[] = ['type' => 'paragraph', 'content' => $this->_trimInline($inline)];
                        $inline = [];
                    }
                    $content = [...$content, ...$this->_convertBlockElement($child, $depth + 1)];
                } else {
                    $inline = [...$inline, ...$this->_convertInlineNode($child, [], $depth + 1)];
                }
            }

            if ($inline !== []) {
                $content[] = ['type' => 'paragraph', 'content' => $this->_trimInline($inline)];
            }
        }

        if ($summary === null) {
            $this->_diagnose('invalidDetails', 'Details content without a summary was flattened.', $element);
        }

        if ($summary === null || !$this->_allowsNode('details')) {
            if ($summary !== null && !$this->_allowsNode('details')) {
                $this->_diagnose('disallowedNode', 'Details are not enabled for the destination field; their content was kept without disclosure behaviour.', $element, ['type' => 'details']);
            }
            $fallback = $summaryContent === [] ? [] : [['type' => 'paragraph', 'content' => $summaryContent]];

            return [...$fallback, ...$content];
        }

        return [[
            'type' => 'details',
            'content' => [
                ['type' => 'detailsSummary', 'content' => $summaryContent],
                ['type' => 'detailsContent', 'content' => $content !== [] ? $content : [['type' => 'paragraph', 'content' => []]]],
            ],
        ]];
    }

    private function _table(DOMElement $element, int $depth): array
    {
        $this->_diagnoseDiscardedAttributes($element);
        $captionBlocks = [];

        foreach ($element->childNodes as $child) {
            if ($child instanceof DOMElement && strtolower($child->tagName) === 'caption') {
                $this->_diagnose('unsupportedTableCaption', 'The table caption was moved before the table because the destination schema does not represent captions.', $child);
                $this->_diagnoseDiscardedAttributes($child);
                $captionBlocks = [...$captionBlocks, ...$this->_convertBlockChildren($child, $depth + 1)];
            }
        }

        if (!$this->_allowsNode('table')) {
            $this->_diagnose('disallowedNode', 'Tables are not enabled for the destination field; cell content was kept as paragraphs.', $element, ['type' => 'table']);
            return [...$captionBlocks, ...$this->_tableFallback($element, $depth)];
        }
        $rows = [];

        foreach ($this->_tableRows($element) as $row) {
            $this->_diagnoseDiscardedAttributes($row);
            $cells = [];

            foreach ($row->childNodes as $cell) {
                if (!$cell instanceof DOMElement || !in_array(strtolower($cell->tagName), ['td', 'th'], true)) {
                    if ($cell instanceof DOMElement || ($cell instanceof DOMText && trim($cell->nodeValue ?? '') !== '')) {
                        $this->_diagnose('invalidTableChild', 'Unsupported content in a table row was ignored.', $cell);
                    }
                    continue;
                }
                $this->_diagnoseDiscardedAttributes($cell, ['colspan', 'rowspan']);
                $attrs = [];

                foreach (['colspan', 'rowspan'] as $name) {
                    if ($cell->hasAttribute($name)) {
                        $value = filter_var($cell->getAttribute($name), FILTER_VALIDATE_INT);

                        if (is_int($value) && $value > 0) {
                            $attrs[$name] = $value;
                        } else {
                            $this->_diagnose('invalidAttribute', "The table-cell {$name} attribute is not a positive integer and was removed.", $cell, ['tag' => strtolower($cell->tagName), 'attribute' => $name]);
                        }
                    }
                }
                $content = $this->_convertBlockChildren($cell, $depth + 1);
                $cells[] = array_filter([
                    'type' => strtolower($cell->tagName) === 'th' ? 'tableHeader' : 'tableCell',
                    'attrs' => $attrs,
                    'content' => $content !== [] ? $content : [['type' => 'paragraph', 'content' => []]],
                ], static fn(mixed $value): bool => $value !== []);
            }

            if ($cells !== []) {
                $rows[] = ['type' => 'tableRow', 'content' => $cells];
            }
        }

        return $rows === [] ? $captionBlocks : [...$captionBlocks, ['type' => 'table', 'content' => $rows]];
    }

    private function _tableRows(DOMElement $table): array
    {
        $rows = [];

        foreach ($table->childNodes as $child) {
            if (!$child instanceof DOMElement) {
                if ($child instanceof DOMText && trim($child->nodeValue ?? '') !== '') {
                    $this->_diagnose('invalidTableChild', 'Unsupported text directly inside a table was ignored.', $child);
                }
                continue;
            }
            $tag = strtolower($child->tagName);

            if ($tag === 'tr') {
                $rows[] = $child;
            } elseif (in_array($tag, ['thead', 'tbody', 'tfoot'], true)) {
                $this->_diagnoseDiscardedAttributes($child);

                foreach ($child->childNodes as $row) {
                    if ($row instanceof DOMElement && strtolower($row->tagName) === 'tr') {
                        $rows[] = $row;
                    } elseif ($row instanceof DOMElement || ($row instanceof DOMText && trim($row->nodeValue ?? '') !== '')) {
                        $this->_diagnose('invalidTableChild', "Unsupported content in <{$tag}> was ignored.", $row);
                    }
                }
            } elseif ($tag !== 'caption') {
                $this->_diagnose('invalidTableChild', "Unsupported <{$tag}> content in a table was ignored.", $child);
            }
        }

        return $rows;
    }

    private function _tableFallback(DOMElement $table, int $depth): array
    {
        $blocks = [];

        foreach ($this->_tableRows($table) as $row) {
            foreach ($row->childNodes as $cell) {
                if ($cell instanceof DOMElement && in_array(strtolower($cell->tagName), ['td', 'th'], true)) {
                    $blocks = [...$blocks, ...$this->_convertBlockChildren($cell, $depth + 1)];
                }
            }
        }

        return $blocks;
    }

    private function _leafBlock(DOMElement $element, string $type): array
    {
        $this->_diagnoseDiscardedAttributes($element);

        if (!$this->_allowsNode($type)) {
            $this->_diagnose('disallowedNode', "The {$type} node is not enabled for the destination field and was removed.", $element, ['type' => $type]);
            return [];
        }

        return [['type' => $type]];
    }

    private function _image(DOMElement $element): array
    {
        $this->_diagnoseDiscardedAttributes($element, ['src', 'alt', 'title']);
        $assetUid = '';
        $src = trim($element->getAttribute('src'));

        if (!$this->_isUuid($assetUid) && $src !== '' && $this->options->assetResolver) {
            try {
                $resolved = ($this->options->assetResolver)($src, $element, $this->field);
                $assetUid = is_string($resolved) ? $resolved : '';
            } catch (Throwable $exception) {
                $this->_diagnose('assetResolutionFailed', 'The image asset resolver failed: ' . $exception->getMessage(), $element);
            }
        }

        if (!$this->_allowsNode('image') || !$this->_isUuid($assetUid)) {
            $code = $this->_allowsNode('image') ? 'unresolvedImage' : 'disallowedNode';
            $message = $this->_allowsNode('image')
                ? 'The image could not be mapped to a Craft Asset; its alternative text was kept when available.'
                : 'Images are not enabled for the destination field; alternative text was kept when available.';
            $this->_diagnose($code, $message, $element, ['type' => 'image', 'src' => $src]);
            $alt = trim($element->getAttribute('alt'));
            return $alt === '' ? [] : [['type' => 'paragraph', 'content' => [['type' => 'text', 'text' => $alt]]]];
        }
        $hasAlt = $element->hasAttribute('alt');
        $attrs = [
            'assetUid' => $assetUid,
            'siteMode' => 'current',
            'altMode' => $hasAlt ? 'custom' : 'asset',
            'alt' => $hasAlt ? $element->getAttribute('alt') : null,
            'title' => $element->hasAttribute('title') ? $element->getAttribute('title') : null,
            'size' => 'default',
            'imageUid' => StringHelper::UUID(),
        ];

        return [['type' => 'image', 'attrs' => $attrs]];
    }

    private function _container(DOMElement $element, int $depth): array
    {
        $this->_diagnoseDiscardedAttributes($element);

        if (strtolower($element->tagName) !== 'div') {
            $this->_diagnose('flattenedContainer', "Container <{$element->tagName}> was flattened because the destination schema does not represent it.", $element, ['tag' => strtolower($element->tagName)]);
        }

        return $this->_convertBlockChildren($element, $depth);
    }

    private function _unsupportedContainer(DOMElement $element, int $depth): array
    {
        $this->_diagnose('unsupportedElement', "Unsupported HTML element <{$element->tagName}> was removed while its readable content was kept.", $element, ['tag' => strtolower($element->tagName)]);
        $this->_diagnoseDiscardedAttributes($element);
        return $this->_convertBlockChildren($element, $depth);
    }

    private function _convertInlineChildren(DOMNode $parent, array $marks, int $depth): array
    {
        $nodes = [];

        foreach ($parent->childNodes as $child) {
            $nodes = [...$nodes, ...$this->_convertInlineNode($child, $marks, $depth + 1)];
        }

        return $nodes;
    }

    private function _convertInlineNode(DOMNode $node, array $marks, int $depth): array
    {
        $this->_guardDepth($depth);

        if ($node instanceof DOMText) {
            $value = $node->nodeValue ?? '';
            $text = preg_replace('/[\x20\t\r\n\f]+/u', ' ', $value) ?? $value;

            if ($text === '') {
                return [];
            }
            $result = ['type' => 'text', 'text' => $text];

            if ($marks !== []) {
                $result['marks'] = array_values($marks);
            }

            return [$result];
        }

        if (!$node instanceof DOMElement) {
            return [];
        }
        $rule = $this->_matchingRule($node, HtmlImportRule::PLACEMENT_INLINE);

        if ($rule) {
            if ($rule->kind === HtmlImportRule::KIND_MARK) {
                return $this->_convertRuleMark($node, $rule, $marks, $depth);
            }

            return $this->_convertRuleNode($node, $rule, $marks, $depth);
        }
        $tag = strtolower($node->tagName);

        $classNames = preg_split('/\s+/', trim($node->getAttribute('class'))) ?: [];

        if ($tag === 'sup' && (in_array('footnote', $classNames, true) || strtolower($node->getAttribute('data-type')) === 'footnotereference')) {
            return $this->_footnoteReference($node);
        }
        $markType = match ($tag) {
            'strong', 'b' => 'bold',
            'em', 'i' => 'italic',
            'u' => 'underline',
            's', 'strike', 'del' => 'strike',
            'code' => 'code',
            'mark' => 'highlight',
            'sub' => 'subscript',
            'sup' => 'superscript',
            default => null,
        };

        if ($markType !== null) {
            $this->_diagnoseDiscardedAttributes($node);
            return $this->_withMark($node, $markType, [], $marks, $depth);
        }

        if ($tag === 'a') {
            return $this->_link($node, $marks, $depth);
        }

        if ($tag === 'ruby') {
            return $this->_rubyText($node, $marks, $depth);
        }

        if ($tag === 'span' && strtolower($node->getAttribute('data-type')) === 'emoji') {
            return $this->_emoji($node, $marks);
        }

        if ($tag === 'br') {
            $this->_diagnoseDiscardedAttributes($node);
            return [['type' => 'hardBreak']];
        }

        if ($tag === 'img') {
            $this->_diagnose('inlineImageMoved', 'An inline image was converted at the nearest block boundary.', $node);
            $fallback = $this->_image($node);
            return $this->_blocksAsInlineText($fallback);
        }

        if ($tag === 'span') {
            if ($node->hasAttribute('style')) {
                $this->_diagnoseDiscardedAttributes($node, ['style']);
                $style = $node->getAttribute('style');
                $attrs = TextStyle::attrsFromStyle($style);
                $hasUnsupportedStyle = TextStyle::hasUnsupportedStyle($style);

                if ($hasUnsupportedStyle) {
                    $this->_diagnose('unsupportedInlineStyle', 'Unsupported inline style values were removed.', $node, ['tag' => 'span']);
                }

                if ($attrs !== []) {
                    return $this->_withMark($node, 'textStyle', $attrs, $marks, $depth);
                }

                if (!$hasUnsupportedStyle) {
                    $this->_diagnose('unsupportedInlineStyle', 'The inline style did not contain a supported Vizy text style and was removed.', $node, ['tag' => 'span']);
                }
            } else {
                $this->_diagnoseDiscardedAttributes($node);
            }
            return $this->_convertInlineChildren($node, $marks, $depth);
        }

        if ($this->_isBlockElement($node)) {
            $this->_diagnose('blockInsideInlineContent', "Block element <{$tag}> was flattened inside inline content.", $node);
            return $this->_blocksAsInlineText($this->_convertBlockElement($node, $depth));
        }

        $this->_diagnose('unsupportedElement', "Unsupported inline element <{$tag}> was removed while its text was kept.", $node, ['tag' => $tag]);
        $this->_diagnoseDiscardedAttributes($node);
        return $this->_convertInlineChildren($node, $marks, $depth);
    }

    private function _emoji(DOMElement $element, array $marks): array
    {
        $this->_diagnoseDiscardedAttributes($element, ['data-type', 'data-name', 'data-emoji']);
        $name = strtolower(trim($element->getAttribute('data-name')));
        $emoji = trim($element->getAttribute('data-emoji')) ?: trim($element->textContent);

        if (!$this->_allowsNode('emoji')) {
            $this->_diagnose('disallowedNode', 'Emoji are not enabled for the destination field; the visible character was kept as text.', $element, ['type' => 'emoji']);
            return $emoji === '' ? [] : [['type' => 'text', 'text' => $emoji, ...($marks === [] ? [] : ['marks' => $marks])]];
        }

        if ($name === '' || preg_match('/^[a-z0-9_+-]{1,80}$/', $name) !== 1) {
            $this->_diagnose('invalidAttribute', 'The emoji name was missing or invalid; the visible character was kept as text.', $element, ['tag' => 'span', 'attribute' => 'data-name']);
            return $emoji === '' ? [] : [['type' => 'text', 'text' => $emoji, ...($marks === [] ? [] : ['marks' => $marks])]];
        }

        return [array_filter([
            'type' => 'emoji',
            'attrs' => array_filter([
                'name' => $name,
                'emoji' => $emoji !== '' ? mb_substr($emoji, 0, 16) : null,
            ], static fn(mixed $value): bool => $value !== null),
            'marks' => $marks,
        ], static fn(mixed $value): bool => $value !== [])];
    }

    private function _footnoteReference(DOMElement $element): array
    {
        $this->_diagnoseDiscardedAttributes($element, [
            'class', 'data-type', 'data-footnote-uid', 'data-footnote-text',
        ]);

        if (!$this->_allowsNode('footnoteReference')) {
            $this->_diagnose('disallowedNode', 'Footnotes are not enabled for the destination field; the note text was kept inline.', $element, ['type' => 'footnoteReference']);
            $text = trim($element->getAttribute('data-footnote-text')) ?: trim($element->textContent);
            return $text === '' ? [] : [['type' => 'text', 'text' => $text]];
        }

        $uid = strtolower(trim($element->getAttribute('data-footnote-uid')));

        if (preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/', $uid) !== 1) {
            $uid = StringHelper::UUID();
        }
        $classNames = preg_split('/\s+/', trim($element->getAttribute('class'))) ?: [];
        $legacy = in_array('footnote', $classNames, true) && !$element->hasAttribute('data-type');
        $fallbackText = trim($element->getAttribute('data-footnote-text'));

        if ($legacy) {
            $fallbackText = trim($element->textContent);
        }

        if ($fallbackText !== '') {
            $this->footnoteDefinitions[$uid] = [
                'type' => 'footnoteItem',
                'attrs' => ['footnoteUid' => $uid],
                'content' => [[
                    'type' => 'paragraph',
                    'content' => [['type' => 'text', 'text' => mb_substr($fallbackText, 0, 5000)]],
                ]],
            ];
        }

        return [['type' => 'footnoteReference', 'attrs' => array_filter([
            'footnoteUid' => $uid,
            'fallbackText' => $fallbackText !== '' ? mb_substr($fallbackText, 0, 5000) : null,
        ], static fn(mixed $value): bool => $value !== null)]];
    }

    private function _footnoteList(DOMElement $element, int $depth): array
    {
        $this->_diagnoseDiscardedAttributes($element, ['class', 'data-type', 'role', 'aria-label']);

        if (!$this->_allowsNode('footnoteList')) {
            $this->_diagnose('disallowedNode', 'Footnote definitions are not enabled for the destination field.', $element, ['type' => 'footnoteList']);
            return $this->_convertBlockChildren($element, $depth);
        }
        $items = [];

        foreach ($element->getElementsByTagName('li') as $itemElement) {
            if (strtolower($itemElement->getAttribute('data-type')) !== 'footnoteitem') {
                continue;
            }
            $uid = strtolower(trim($itemElement->getAttribute('data-footnote-uid')));

            if (preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/', $uid) !== 1) {
                $this->_diagnose('invalidAttribute', 'A footnote definition with an invalid identity was ignored.', $itemElement, ['attribute' => 'data-footnote-uid']);
                continue;
            }
            $contentRoot = null;

            foreach ($itemElement->childNodes as $child) {
                if ($child instanceof DOMElement && $child->hasAttribute('data-footnote-content')) {
                    $contentRoot = $child;
                    break;
                }
            }
            $content = $this->_convertBlockChildren($contentRoot ?? $itemElement, $depth + 1);
            $content = $content !== [] ? $content : [['type' => 'paragraph', 'content' => []]];
            $items[] = [
                'type' => 'footnoteItem',
                'attrs' => ['footnoteUid' => $uid],
                'content' => $content,
            ];
        }

        return $items === [] ? [] : [['type' => 'footnoteList', 'content' => $items]];
    }

    private function _attachFootnoteDefinitions(array $content): array
    {
        if ($this->footnoteDefinitions === []) {
            return $content;
        }
        $listIndex = null;
        $defined = [];

        foreach ($content as $index => $node) {
            if (($node['type'] ?? null) !== 'footnoteList') {
                continue;
            }
            $listIndex = $index;

            foreach ($node['content'] ?? [] as $item) {
                $uid = $item['attrs']['footnoteUid'] ?? null;

                if (is_string($uid)) {
                    $defined[$uid] = true;
                }
            }
        }
        $missing = array_values(array_filter(
            $this->footnoteDefinitions,
            static fn(array $item): bool => !isset($defined[$item['attrs']['footnoteUid']]),
        ));

        if ($missing === []) {
            return $content;
        }

        if ($listIndex !== null) {
            $content[$listIndex]['content'] = [...($content[$listIndex]['content'] ?? []), ...$missing];
            return $content;
        }

        $content[] = ['type' => 'footnoteList', 'content' => $missing];
        return $content;
    }

    private function _link(DOMElement $element, array $marks, int $depth): array
    {
        $allowedAttributes = ['href', 'aria-label', 'rel', 'id', 'download'];

        if (in_array('newWindow', $this->field->linkSettings, true)) {
            $allowedAttributes[] = 'target';
        }

        if (in_array('title', $this->field->linkSettings, true)) {
            $allowedAttributes[] = 'title';
        }

        if (in_array('classes', $this->field->linkSettings, true)) {
            $allowedAttributes[] = 'class';
        }
        $this->_diagnoseDiscardedAttributes($element, $allowedAttributes);
        $href = trim($element->getAttribute('href'));
        $safe = $href === '' ? null : SafeHtml::sanitizeUri($href, SafeHtml::LINK_SCHEMES);

        if ($safe === null) {
            $this->_diagnose('unsafeLink', 'A link with an empty or unsafe destination was removed while its text was kept.', $element, ['href' => $href]);
            return $this->_convertInlineChildren($element, $marks, $depth);
        }
        [$type, $value] = $this->_semanticLinkValue($safe);
        $target = strtolower(trim($element->getAttribute('target')));
        $newWindow = in_array('newWindow', $this->field->linkSettings, true) && $target === '_blank';

        if (in_array('newWindow', $this->field->linkSettings, true) && !in_array($target, ['', '_self', '_blank'], true)) {
            $this->_diagnose('unsupportedLinkTarget', "The link target {$target} is not represented by the destination schema and was removed.", $element, ['target' => $target]);
        }
        $attrs = [
            'type' => $type,
            'value' => $value,
            'siteMode' => 'current',
            'newWindow' => $newWindow,
        ];

        if (in_array('title', $this->field->linkSettings, true) && $element->hasAttribute('title')) {
            $attrs['title'] = $element->getAttribute('title');
        }

        if (in_array('classes', $this->field->linkSettings, true) && $element->hasAttribute('class')) {
            $attrs['class'] = $element->getAttribute('class');
        }

        if ($element->hasAttribute('aria-label')) {
            $attrs['ariaLabel'] = $element->getAttribute('aria-label');
        }

        if ($element->hasAttribute('rel')) {
            $attrs['rel'] = preg_split('/\s+/', trim($element->getAttribute('rel')), -1, PREG_SPLIT_NO_EMPTY) ?: [];
        }

        if ($element->hasAttribute('id')) {
            $attrs['id'] = $element->getAttribute('id');
        }

        if ($element->hasAttribute('download')) {
            $download = $element->getAttribute('download');
            $attrs['download'] = $download === '' ? true : $download;
        }

        return $this->_withMark($element, 'link', $attrs, $marks, $depth);
    }

    private function _rubyText(DOMElement $element, array $marks, int $depth): array
    {
        $this->_diagnoseDiscardedAttributes($element);
        $annotationNode = $element->getElementsByTagName('rt')->item(0);
        $annotation = $annotationNode instanceof DOMElement ? trim($annotationNode->textContent) : '';

        if ($annotation === '') {
            $this->_diagnose('invalidRubyText', 'Ruby text without an annotation was kept as ordinary text.', $element);
            return $this->_convertRubyBase($element, $marks, $depth);
        }

        if (!$this->_allowsMark('rubyText')) {
            $this->_diagnose('disallowedMark', 'The rubyText mark is not enabled for the destination field; its text was kept without that annotation.', $element, ['type' => 'rubyText']);
            return $this->_convertRubyBase($element, $marks, $depth);
        }
        $rubyMark = ['type' => 'rubyText', 'attrs' => ['rt' => mb_substr($annotation, 0, 200)]];

        return $this->_convertRubyBase($element, [...$marks, $rubyMark], $depth);
    }

    private function _convertRubyBase(DOMElement $element, array $marks, int $depth): array
    {
        $base = $element->getElementsByTagName('rb')->item(0);

        if ($base instanceof DOMElement) {
            return $this->_convertInlineChildren($base, $marks, $depth);
        }
        $nodes = [];

        foreach ($element->childNodes as $child) {
            if ($child instanceof DOMElement && in_array(strtolower($child->tagName), ['rt', 'rp'], true)) {
                continue;
            }
            $nodes = [...$nodes, ...$this->_convertInlineNode($child, $marks, $depth + 1)];
        }

        return $nodes;
    }

    private function _semanticLinkValue(string $href): array
    {
        foreach (['mailto:' => 'email', 'tel:' => 'tel', 'sms:' => 'sms'] as $prefix => $type) {
            if (str_starts_with(strtolower($href), $prefix)) {
                return [$type, substr($href, strlen($prefix))];
            }
        }

        return ['url', $href];
    }

    private function _withMark(DOMElement $element, string $type, array $attrs, array $marks, int $depth): array
    {
        if (!$this->_allowsMark($type)) {
            $this->_diagnose('disallowedMark', "The {$type} mark is not enabled for the destination field; its text was kept without that formatting.", $element, ['type' => $type]);
            return $this->_convertInlineChildren($element, $marks, $depth);
        }
        $mark = array_filter(['type' => $type, 'attrs' => $attrs], static fn(mixed $value): bool => $value !== []);
        $key = json_encode($mark, JSON_THROW_ON_ERROR);
        $indexed = [];

        foreach ($marks as $existing) {
            $indexed[json_encode($existing, JSON_THROW_ON_ERROR)] = $existing;
        }
        $indexed[$key] = $mark;

        return $this->_convertInlineChildren($element, array_values($indexed), $depth);
    }

    private function _convertRuleMark(DOMElement $element, HtmlImportRule $rule, array $marks, int $depth): array
    {
        try {
            $attrs = $rule->resolveAttributes($element);
        } catch (Throwable $exception) {
            $this->_diagnose('importRuleFailed', "HTML import rule {$rule->type} failed: {$exception->getMessage()}", $element, ['type' => $rule->type]);
            return $this->_convertInlineChildren($element, $marks, $depth);
        }

        return $this->_withMark($element, $rule->type, $attrs, $marks, $depth);
    }

    private function _convertRuleNode(DOMElement $element, HtmlImportRule $rule, array $marks, int $depth): array
    {
        if (!$this->_allowsNode($rule->type)) {
            $this->_diagnose('disallowedNode', "The {$rule->type} node is not enabled for the destination field.", $element, ['type' => $rule->type]);
            return $rule->placement === HtmlImportRule::PLACEMENT_BLOCK
                ? $this->_convertBlockChildren($element, $depth)
                : $this->_convertInlineChildren($element, $marks, $depth);
        }

        try {
            $attrs = $rule->resolveAttributes($element);
        } catch (Throwable $exception) {
            $this->_diagnose('importRuleFailed', "HTML import rule {$rule->type} failed: {$exception->getMessage()}", $element, ['type' => $rule->type]);
            return $rule->placement === HtmlImportRule::PLACEMENT_BLOCK
                ? $this->_convertBlockChildren($element, $depth)
                : $this->_convertInlineChildren($element, $marks, $depth);
        }
        $content = match ($rule->content) {
            HtmlImportRule::CONTENT_BLOCK => $this->_convertBlockChildren($element, $depth),
            HtmlImportRule::CONTENT_INLINE => $this->_trimInline($this->_convertInlineChildren($element, $marks, $depth)),
            default => [],
        };
        $node = array_filter([
            'type' => $rule->type,
            'attrs' => $attrs,
            'content' => $content,
        ], static fn(mixed $value): bool => $value !== []);

        return [$node];
    }

    private function _matchingRule(DOMElement $element, string $placement): ?HtmlImportRule
    {
        foreach ($this->rules as $rule) {
            if ($rule->placement === $placement && $rule->matches($element)) {
                return $rule;
            }
        }

        return null;
    }

    private function _isBlockElement(DOMElement $element): bool
    {
        if ($this->_matchingRule($element, HtmlImportRule::PLACEMENT_BLOCK)) {
            return true;
        }

        return in_array(strtolower($element->tagName), [
            'address', 'article', 'aside', 'blockquote', 'div', 'dl', 'fieldset', 'figcaption', 'figure',
            'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hr', 'img', 'main', 'nav',
            'details', 'ol', 'p', 'pre', 'section', 'table', 'ul',
        ], true);
    }

    private function _blocksAsInlineText(array $blocks): array
    {
        $text = [];
        $walk = function(array $nodes) use (&$walk, &$text): void {
            foreach ($nodes as $node) {
                if (($node['type'] ?? null) === 'text' && is_string($node['text'] ?? null)) {
                    $text[] = $node['text'];
                }

                if (is_array($node['content'] ?? null)) {
                    $walk($node['content']);
                }
            }
        };
        $walk($blocks);
        $value = trim(implode(' ', array_filter($text, static fn(string $part): bool => trim($part) !== '')));
        return $value === '' ? [] : [['type' => 'text', 'text' => $value]];
    }

    private function _trimInline(array $nodes): array
    {
        while ($nodes !== [] && ($nodes[0]['type'] ?? null) === 'text') {
            $nodes[0]['text'] = ltrim((string)$nodes[0]['text']);

            if ($nodes[0]['text'] !== '') {
                break;
            }
            array_shift($nodes);
        }

        while ($nodes !== [] && ($nodes[array_key_last($nodes)]['type'] ?? null) === 'text') {
            $last = array_key_last($nodes);
            $nodes[$last]['text'] = rtrim((string)$nodes[$last]['text']);

            if ($nodes[$last]['text'] !== '') {
                break;
            }
            array_pop($nodes);
        }

        return array_values($nodes);
    }

    private function _diagnoseDiscardedAttributes(DOMElement $element, array $allowed = []): void
    {
        $allowed = array_fill_keys($allowed, true);

        foreach ($element->attributes as $attribute) {
            $name = strtolower($attribute->name);

            if (!isset($allowed[$name])) {
                $this->_diagnose(
                    'removedAttribute',
                    "Attribute {$name} on <{$element->tagName}> is not represented by the destination schema and was removed.",
                    $element,
                    ['tag' => strtolower($element->tagName), 'attribute' => $name],
                );
            }
        }
    }

    private function _diagnose(string $code, string $message, DOMNode $node, array $details = []): void
    {
        $this->diagnostics[] = new HtmlImportDiagnostic($code, $message, $this->_path($node), true, $details);
    }

    private function _path(DOMNode $node): string
    {
        $parts = [];

        while ($node->parentNode && $node->parentNode instanceof DOMElement && !$node->parentNode->hasAttribute('data-vizy-import-root')) {
            if ($node instanceof DOMElement) {
                $index = 1;
                $sibling = $node->previousSibling;

                while ($sibling) {
                    if ($sibling instanceof DOMElement && strtolower($sibling->tagName) === strtolower($node->tagName)) {
                        $index++;
                    }
                    $sibling = $sibling->previousSibling;
                }
                array_unshift($parts, strtolower($node->tagName) . "[{$index}]");
            }
            $node = $node->parentNode;
        }

        if ($node instanceof DOMElement && !$node->hasAttribute('data-vizy-import-root')) {
            array_unshift($parts, strtolower($node->tagName) . '[1]');
        }

        return '/' . implode('/', $parts);
    }

    private function _assertTreeBounds(DOMNode $root): void
    {
        $nodes = 0;
        $walk = function(DOMNode $parent, int $depth) use (&$walk, &$nodes): void {
            foreach ($parent->childNodes as $child) {
                $nodes++;

                if ($nodes > $this->options->maxNodes) {
                    throw new HtmlImportException("HTML import exceeds the {$this->options->maxNodes}-node limit.");
                }

                if ($depth > $this->options->maxDepth) {
                    throw new HtmlImportException("HTML import exceeds the {$this->options->maxDepth}-level depth limit.");
                }

                if ($child->hasChildNodes()) {
                    $walk($child, $depth + 1);
                }
            }
        };
        $walk($root, 1);
    }

    private function _guardDepth(int $depth): void
    {
        if ($depth > $this->options->maxDepth) {
            throw new HtmlImportException("HTML import exceeds the {$this->options->maxDepth}-level depth limit.");
        }
    }

    private function _allowsNode(string $type): bool
    {
        return isset($this->allowedNodes[$type]);
    }

    private function _allowsMark(string $type): bool
    {
        return isset($this->allowedMarks[$type]);
    }

    private function _isUuid(string $value): bool
    {
        return (bool)preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i', $value);
    }
}
