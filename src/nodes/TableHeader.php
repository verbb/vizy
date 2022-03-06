<?php
namespace verbb\vizy\nodes;

use verbb\vizy\base\Node;

class TableHeader extends Node
{
    // Properties
    // =========================================================================

    public static ?string $type = 'tableHeader';
    public mixed $tagName  = 'th';

}
