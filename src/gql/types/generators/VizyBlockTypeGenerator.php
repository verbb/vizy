<?php
namespace verbb\vizy\gql\types\generators;

use verbb\vizy\Vizy;
use verbb\vizy\fields\VizyField;
use verbb\vizy\gql\GqlHelpers;
use verbb\vizy\gql\GqlNode;
use verbb\vizy\gql\interfaces\VizyBlockInterface;
use verbb\vizy\gql\types\VizyBlockType;
use verbb\vizy\models\BlockType;

use Craft;
use craft\gql\base\Generator;
use craft\gql\base\GeneratorInterface;
use craft\gql\base\SingleGeneratorInterface;
use craft\gql\GqlEntityRegistry;

use GraphQL\Type\Definition\ResolveInfo;

class VizyBlockTypeGenerator extends Generator implements GeneratorInterface, SingleGeneratorInterface
{
    // Static Methods
    // =========================================================================

    public static function generateTypes(mixed $context = null): array
    {
        if ($context instanceof VizyField) {
            $blockTypes = $context->getAllowedBlockTypes();
        } else {
            $blockTypes = Vizy::$plugin->getBlockTypes()->getAllBlockTypes();
        }

        $gqlTypes = [];

        foreach ($blockTypes as $blockType) {
            $type = static::generateType($blockType);
            $gqlTypes[$type->name] = $type;
        }

        return $gqlTypes;
    }

    public static function generateType(mixed $context): mixed
    {
        $typeName = GqlHelpers::blockTypeName($context);

        if ($entity = GqlEntityRegistry::getEntity($typeName)) {
            return $entity;
        }

        $layout = $context->getFieldLayout();
        $contentFields = $layout ? self::getContentFields($layout) : [];

        foreach ($contentFields as &$definition) {
            if (!is_array($definition) || !isset($definition['resolve'])) {
                continue;
            }

            $resolver = $definition['resolve'];
            $definition['resolve'] = static function(mixed $source, array $arguments, mixed $resolverContext, ResolveInfo $resolveInfo) use ($resolver): mixed {
                // Craft field resolvers expect the field-owning Element. Vizy's
                // GraphQL object is backed by a GqlNode, so hydrate the ephemeral
                // Block before delegating Matrix, Assets, Entries, and third-party
                // field resolvers. Fields without an explicit resolver continue
                // through VizyBlockType::resolve().
                if ($source instanceof GqlNode && ($block = $source->block()) !== null) {
                    $source = $source->document()->blockElement($block);
                }

                return call_user_func($resolver, $source, $arguments, $resolverContext, $resolveInfo);
            };
        }
        unset($definition);

        $fields = array_merge(VizyBlockInterface::getFieldDefinitions(), $contentFields);
        $prepared = Craft::$app->getGql()->prepareFieldDefinitions($fields, $typeName);

        return GqlEntityRegistry::createEntity($typeName, new VizyBlockType([
            'name' => $typeName,
            'fields' => static fn() => $prepared,
        ]));
    }
}
