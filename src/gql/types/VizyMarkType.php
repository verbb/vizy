<?php
namespace verbb\vizy\gql\types;

use verbb\vizy\gql\interfaces\VizyMarkInterface;

use craft\gql\base\ObjectType;

/**
 * Concrete mark GraphQL object (implements VizyMarkInterface).
 */
class VizyMarkType extends ObjectType
{
    // Public Methods
    // =========================================================================

    public function __construct(array $config)
    {
        $config['interfaces'] = [
            VizyMarkInterface::getType(),
        ];

        parent::__construct($config);
    }
}
