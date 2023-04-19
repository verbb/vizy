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

}
