<?php
namespace verbb\vizy\gql\types\generators;

use verbb\vizy\Vizy;
use verbb\vizy\gql\GqlHelpers;
use verbb\vizy\gql\GqlMark;
use verbb\vizy\gql\interfaces\VizyMarkInterface;
use verbb\vizy\gql\types\VizyMarkType;

use Craft;
use craft\gql\base\GeneratorInterface;
use craft\gql\GqlEntityRegistry;
use craft\gql\interfaces\Element as ElementInterface;

use GraphQL\Type\Definition\Type;

class VizyMarkGenerator implements GeneratorInterface
{
    // Static Methods
    // =========================================================================

    public static function generateTypes(mixed $context = null): array
    {
        $gqlTypes = [];

        foreach (array_keys(Vizy::$plugin->getExtensions()->getMarks()) as $tipTapType) {
            $type = static::generateType($tipTapType);
            $gqlTypes[$type->name] = $type;
        }

        $gqlTypes['VizyUnknownMark'] = self::_ensureUnknown();

        return $gqlTypes;
    }

    public static function generateType(mixed $context): mixed
    {
        $tipTapType = is_string($context) ? $context : '';
        $typeName = GqlHelpers::markTypeName($tipTapType);

        if ($entity = GqlEntityRegistry::getEntity($typeName)) {
            return $entity;
        }

        $fields = VizyMarkInterface::getFieldDefinitions();

        // Link: element + url convenience from semantic attrs.
        if ($tipTapType === 'link') {
            $fields['element'] = [
                'name' => 'element',
                'type' => ElementInterface::getType(),
                'description' => 'Resolved Entry/Asset/Category for attrs.targetUid when present.',
                'resolve' => static function(GqlMark $mark, array $args, $context): mixed {
                    $siteId = null;
                    if (is_array($context) && isset($context['siteId'])) {
                        $siteId = (int)$context['siteId'];
                    }

                    return $mark->linkElement($siteId);
                },
            ];
            $fields['url'] = [
                'name' => 'url',
                'type' => Type::string(),
                'description' => 'Resolved URL convenience (element URL, or value for url/email/tel/sms).',
                'resolve' => static function(GqlMark $mark, array $args, $context): ?string {
                    $siteId = null;
                    if (is_array($context) && isset($context['siteId'])) {
                        $siteId = (int)$context['siteId'];
                    }

                    return $mark->linkUrl($siteId);
                },
            ];
        }

        $prepared = Craft::$app->getGql()->prepareFieldDefinitions($fields, $typeName);

        return GqlEntityRegistry::createEntity($typeName, new VizyMarkType([
            'name' => $typeName,
            'fields' => static fn() => $prepared,
        ]));
    }

    private static function _ensureUnknown(): mixed
    {
        if ($entity = GqlEntityRegistry::getEntity('VizyUnknownMark')) {
            return $entity;
        }

        $prepared = Craft::$app->getGql()->prepareFieldDefinitions(
            VizyMarkInterface::getFieldDefinitions(),
            'VizyUnknownMark',
        );

        return GqlEntityRegistry::createEntity('VizyUnknownMark', new VizyMarkType([
            'name' => 'VizyUnknownMark',
            'fields' => static fn() => $prepared,
        ]));
    }
}
