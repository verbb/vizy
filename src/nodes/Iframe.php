<?php
namespace verbb\vizy\nodes;

use verbb\vizy\base\Node;

use craft\helpers\ArrayHelper;

class Iframe extends Node
{
    // Properties
    // =========================================================================

    public static ?string $type = 'iframe';
    public mixed $tagName = 'iframe';


    // Public Methods
    // =========================================================================

    public function getTag(): array
    {
        // In case this node is rendered multiple times, this attribute may have already been removed.
        $this->attrs['src'] = ArrayHelper::remove($this->attrs, 'url') ?? $this->attrs['src'];

        return parent::getTag();
    }
}
