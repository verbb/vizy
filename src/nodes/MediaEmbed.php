<?php
namespace verbb\vizy\nodes;

use verbb\vizy\base\Node;

class MediaEmbed extends Node
{
    // Properties
    // =========================================================================

    public static ?string $type = 'mediaEmbed';


    // Public Methods
    // =========================================================================

    public function renderNode(): ?string
    {
        return $this->attrs['data']['html'] ?? null;
    }
}
