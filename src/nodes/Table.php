<?php
namespace verbb\vizy\nodes;

use verbb\vizy\base\Node;

class Table extends Node
{
    // Properties
    // =========================================================================

    public static ?string $type = 'table';
    public mixed $tagName = ['table', 'tbody'];


    public function getTag(): array
    {
        // Strip out attributes for `tbody` until we figure out a better way to define them
        // https://github.com/verbb/vizy/issues/355
        $tags = parent::getTag();
        $tags[0]['tag'] = 'table';
        $tags[1]['tag'] = 'tbody';

        return $tags;
    }

}
