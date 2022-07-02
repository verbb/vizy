<?php
namespace verbb\vizy\gql\interfaces;

use craft\gql\arguments\elements\Asset as AssetArguments;
use craft\gql\interfaces\elements\Asset as AssetInterface;
use craft\gql\TypeManager;


class VizyImageNodeInterface extends VizyNodeInterface
{
    // Public Methods
    // =========================================================================

    public static function getName(): string
    {
        return 'VizyImageNodeInterface';
    }

    public static function getFieldDefinitions(): array
    {
        return Craft::$app->getGql()->prepareFieldDefinitions(array_merge(parent::getFieldDefinitions(), [
            'asset' => [
                'name' => 'asset',
                'type' => AssetInterface::getType(),
                'args' => AssetArguments::getArguments(),
                'description' => 'Returns the asset element used for this image.',
            ],
        ]), self::getName());
    }
}
