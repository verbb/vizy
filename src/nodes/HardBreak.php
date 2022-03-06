<?php
namespace verbb\vizy\nodes;

use verbb\vizy\base\Node;

class HardBreak extends Node
{
    // Properties
    // =========================================================================

    public static ?string $type = 'hardBreak';
    public mixed $tagName = 'br';

    // Public Methods
    // =========================================================================

    public function selfClosing(): bool
    {
        return true;
    }

}
