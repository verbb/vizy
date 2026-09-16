<?php
namespace verbb\vizy\gql\types;

use verbb\vizy\gql\interfaces\VizyNodeInterface;

use craft\gql\base\ObjectType;

/**
 * Concrete prose / structural node GraphQL object (implements VizyNodeInterface).
 *
 * Field resolvers live on the generated field definitions (interface + extras
 * like Image.asset / Layout.stack).
 */
class VizyNodeType extends ObjectType
{
    // Public Methods
    // =========================================================================

    public function __construct(array $config)
    {
        $config['interfaces'] = [
            VizyNodeInterface::getType(),
        ];

        parent::__construct($config);
    }
}
