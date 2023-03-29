<?php
namespace verbb\vizy\services;

use craft\base\Component;

class Cache extends Component
{
    // Properties
    // =========================================================================

    private array $_cacheData = [];


    // Public Methods
    // =========================================================================

    public function get(string $key)
    {
        return $this->_cacheData[$key] ?? false;
    }

    public function set(string $key, mixed $value): void
    {
        $this->_cacheData[$key] = $value;
    }

    public function getOrSet(string $key, $callable)
    {
        if (($value = $this->get($key)) !== false) {
            return $value;
        }

        $value = $callable($this);

        $this->set($key, $value);

        return $value;
    }

}
