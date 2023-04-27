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
        $this->attrs['src'] = ArrayHelper::remove($this->attrs, 'url');

        return parent::getTag();
    }
}
