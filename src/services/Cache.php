<?php
namespace verbb\vizy\services;

use Craft;
use craft\base\Component;

class Cache extends Component
{
    // Properties
    // =========================================================================

    private $_cacheData = [];


    // Public Methods
    // =========================================================================

    public function get($key)
    {
        return $this->_cacheData[$key] ?? false;
    }

    public function set($key, $value)
    {
        $this->_cacheData[$key] = $value;
    }

    public function getOrSet($key, $callable)
    {
        if (($value = $this->get($key)) !== false) {
            return $value;
        }

        $value = call_user_func($callable, $this);

        $this->set($key, $value);

        return $value;
    }

}
