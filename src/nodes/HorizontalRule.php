<?php
namespace verbb\vizy\nodes;

use verbb\vizy\base\Node;

class HorizontalRule extends Node
{
    // Properties
    // =========================================================================

    public static ?string $type = 'horizontalRule';
    public mixed $tagName = 'hr';


    // Public Methods
    // =========================================================================

    public function selfClosing(): bool
    {
        return true;
    }
}
