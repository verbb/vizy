<?php
namespace verbb\vizy\gql\interfaces;

use Craft;
use craft\gql\base\ElementArguments;
use craft\gql\interfaces\Element as ElementInterface;

class VizyLinkMarkInterface extends VizyMarkInterface
{
    // Public Methods
    // =========================================================================

    public static function getName(): string
    {
        return 'VizyLinkMarkInterface';
    }

    public static function getFieldDefinitions(): array
    {
        return Craft::$app->getGql()->prepareFieldDefinitions(array_merge(parent::getFieldDefinitions(), [
            'element' => [
                'name' => 'element',
                'type' => ElementInterface::getType(),
                'args' => ElementArguments::getArguments(),
                'description' => 'Returns the element used for this link.',
                'resolve' => function($source) {
                    return $source->getLinkElement();
                },
            ],
        ]), self::getName());
    }
}
