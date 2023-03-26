<?php
namespace verbb\vizy\nodes;

use verbb\vizy\base\Node;

class ListItem extends Node
{
    // Properties
    // =========================================================================

    public static ?string $type = 'listItem';
    public mixed $tagName = 'li';
    

    // Public Methods
    // =========================================================================

    public function init(): void
    {
        // Fix ProseMirror wrapping node items with inner paragraph
        $firstChild = $this->content[0] ?? null;

        if ($firstChild instanceof Paragraph) {
            $this->content = $firstChild['content'] ?? [];
        }

        parent::init();
    }

}
