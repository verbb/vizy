<?php
namespace verbb\vizy\nodes;

use verbb\vizy\base\Node;

class Text extends Node
{
    // Properties
    // =========================================================================

    public static ?string $type = 'text';


    // Public Methods
    // =========================================================================

    public function getTag(): array
    {
        return [];
    }
}
