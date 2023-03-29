<?php
namespace verbb\vizy\gql\interfaces;

use verbb\vizy\gql\types\generators\VizyNodeGenerator;
use verbb\vizy\gql\types\ArrayType;

use Craft;
use craft\gql\base\InterfaceType as BaseInterfaceType;
use craft\gql\GqlEntityRegistry;

use GraphQL\Type\Definition\InterfaceType;
use GraphQL\Type\Definition\Type;

class VizyNodeInterface extends BaseInterfaceType
{
    // Public Methods
    // =========================================================================

    public static function getTypeGenerator(): string
    {
        return VizyNodeGenerator::class;
    }

    public static function getType($context = null): Type
    {
        if ($type = GqlEntityRegistry::getEntity(self::getName())) {
            return $type;
        }

        $type = GqlEntityRegistry::createEntity(self::getName(), new InterfaceType([
            'name' => static::getName(),
            'fields' => self::class . '::getFieldDefinitions',
            'description' => 'This is the interface implemented by all fields.',
            'resolveType' => function($value) {
                return $value->getGqlTypeName();
            },
        ]));

        VizyNodeGenerator::generateTypes($context);

        return $type;
    }

    public static function getName(): string
    {
        return 'VizyNodeInterface';
    }

    public static function getFieldDefinitions(): array
    {
        return Craft::$app->getGql()->prepareFieldDefinitions([
            'type' => [
                'name' => 'type',
                'description' => 'The node type.',
                'type' => Type::string(),
            ],
            'tagName' => [
                'name' => 'tagName',
                'description' => 'The HTML tag used for this node.',
                'type' => Type::string(),
            ],
            'html' => [
                'name' => 'html',
                'description' => 'The rendered HTML for this node.',
                'type' => Type::string(),
                'resolve' => function($source) {
                    return $source->renderHtml();
                },
            ],
            'content' => [
                'name' => 'content',
                'description' => 'The content for this node.',
                'type' => ArrayType::getType(),
                'resolve' => function($source) {
                    return $source->rawNode['content'] ?? [];
                },
            ],
            'attrs' => [
                'name' => 'attrs',
                'description' => 'The attributes for this node.',
                'type' => ArrayType::getType(),
                'resolve' => function($source) {
                    return $source->rawNode['attrs'] ?? [];
                },
            ],
            'marks' => [
                'name' => 'marks',
                'description' => 'The nested marks for this node.',
                // 'type' => ArrayType::getType(),
                'type' => Type::listOf(VizyMarkInterface::getType()),
                'resolve' => function($source) {
                    $marks = [];
                    $content = $source->content ?? [];

                    foreach ($content as $node) {
                        if (isset($node['marks'])) {
                            $marks = array_merge($marks, $node['marks']);
                        }
                        // code...
                    }

                    return $marks;
                },
            ],
            'text' => [
                'name' => 'text',
                'description' => 'The textual content for this node.',
                'type' => Type::string(),
                'resolve' => function($source) {
                    return $source->rawNode['text'] ?? '';
                },
            ],
            'rawNode' => [
                'name' => 'rawNode',
                'description' => 'The raw JSON content for this node.',
                'type' => ArrayType::getType(),
            ],
        ], self::getName());
    }
}
