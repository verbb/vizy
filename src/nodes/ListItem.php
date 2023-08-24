<?php
namespace verbb\vizy\nodes;

use verbb\vizy\base\Node;

use Craft;
use craft\base\ElementInterface;

class ListItem extends Node
{
    // Properties
    // =========================================================================

    public static ?string $type = 'listItem';
    public mixed $tagName = 'li';
    

    // Public Methods
    // =========================================================================

    public function getContent(): array
    {
        // Fix ProseMirror wrapping node items with inner paragraph. Only do this for front-end requests though.
        // But only do this for a non-editor render (front-end, or GQL) as this is still needed by the editor to work.
        if (!Craft::$app->getRequest()->getIsCpRequest()) {
            $newContent = [];

            foreach ($this->content as $contentNode) {
                if ($contentNode instanceof Paragraph) {
                    $content = $contentNode['content'] ?? [];

                    foreach ($content as $innerNode) {
                        $newContent[] = $innerNode;
                    }
                } else {
                    $newContent[] = $contentNode;
                }
            }

            $this->content = $newContent;
        }

        return $this->content;
    }

    public function serializeValue(ElementInterface $element = null): ?array
    {
        $value = parent::serializeValue($element);

        $value['content'] = array_filter(($value['content'] ?? []));

        // Protect against empty content, which can happen in some cases.
        if (!$value['content']) {
            $value['content'] = [['type' => 'paragraph']];
        }

        // Fix an issue where we messed up list items schema. Can be removed at some point
        $firstNode = $value['content'][0]['type'] ?? null;

        if ($firstNode !== 'paragraph') {
            $value['content'] = [['type' => 'paragraph', 'attrs' => [], 'content' => $value['content']]];
        }

        return $value;
    }

    public function normalizeValue(?ElementInterface $element = null): ?array
    {
        $value = parent::normalizeValue($element);

        $value['content'] = array_filter(($value['content'] ?? []));

        // Protect against empty content, which can happen in some cases.
        if (!$value['content']) {
            $value['content'] = [['type' => 'paragraph']];
        }

        // Fix an issue where we messed up list items schema. Can be removed at some point
        $firstNode = $value['content'][0]['type'] ?? null;

        if ($firstNode !== 'paragraph') {
            $value['content'] = [['type' => 'paragraph', 'attrs' => [], 'content' => $value['content']]];
        }

        return $value;
    }

}
