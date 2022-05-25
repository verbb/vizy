<?php
namespace verbb\vizy\services;

use Craft;
use craft\base\Component;

class Cache extends Component
{
    // Properties
    // =========================================================================

    private $_blockGroupsForInput = [];


    // Public Methods
    // =========================================================================

    public function getBlockGroupsForInput($key)
    {
        return $this->_blockGroupsForInput[$key] ?? [];
    }

    public function setBlockGroupsForInput($key, $value)
    {
        $this->_blockGroupsForInput[$key] = $value;
    }

}
