<?php
namespace verbb\vizy\nodes;

use verbb\vizy\base\Node;

class Table extends Node
{
    // Properties
    // =========================================================================

    public static ?string $type = 'table';
    public mixed $tagName = ['table', 'tbody'];

}
