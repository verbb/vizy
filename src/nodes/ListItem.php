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
            $firstChild = $this->content[0] ?? null;

            if ($firstChild instanceof Paragraph) {
                $this->content = $firstChild['content'] ?? [];
            }
        }

        return $this->content;
    }

}
