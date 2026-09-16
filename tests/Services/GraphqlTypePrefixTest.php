<?php

declare(strict_types=1);

use craft\gql\GqlEntityRegistry;
use craft\helpers\StringHelper;
use craft\models\FieldLayout;
use GraphQL\GraphQL;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use GraphQL\Type\Schema;
use verbb\vizy\document\DocumentParser;
use verbb\vizy\gql\GqlHelpers;
use verbb\vizy\gql\GqlMark;
use verbb\vizy\gql\interfaces\VizyMarkInterface;
use verbb\vizy\gql\types\generators\VizyMarkGenerator;
use verbb\vizy\gql\types\generators\VizyNodeGenerator;
use verbb\vizy\gql\types\VizyDocumentType;
use verbb\vizy\models\BlockType;
use verbb\vizy\Vizy;

it('executes structural GraphQL interfaces with the configured type prefix', function(string $prefix, string $surface) {
    $previousPrefix = GqlEntityRegistry::getPrefix();
    Craft::$app->getGql()->flushCaches();
    GqlEntityRegistry::setPrefix($prefix);
    try {
        $blockType = new BlockType([
            'uid' => StringHelper::UUID(),
            'name' => 'GraphQL prefix card',
            'handle' => 'prefixCard' . StringHelper::randomString(8),
        ]);
        $blockType->setFieldLayout(new FieldLayout(['type' => verbb\vizy\elements\Block::class]));
        expect(Vizy::$plugin->getBlockTypes()->saveBlockType($blockType))->toBeTrue();
        $blocks = array_map(static fn(string $uid): array => [
            'type' => 'vizyBlock',
            'attrs' => [
                'blockUid' => StringHelper::UUID(),
                'blockTypeUid' => $uid,
                'enabled' => true,
                'fieldSlots' => [],
            ],
        ], [$blockType->uid, StringHelper::UUID()]);
        $document = (new DocumentParser())->parse([
            'type' => 'doc',
            'attrs' => ['schemaVersion' => 2],
            'content' => [
                ['type' => 'paragraph', 'content' => [['type' => 'text', 'text' => 'Text']]],
                ['type' => 'futureNode'],
                ...$blocks,
            ],
        ]);
        $queryType = new ObjectType([
            'name' => 'PrefixQuery',
            'fields' => [
                'document' => ['type' => VizyDocumentType::getType(), 'resolve' => static fn() => $document],
                'marks' => [
                    'type' => Type::listOf(VizyMarkInterface::getType()),
                    'resolve' => static fn() => [GqlMark::fromRaw(['type' => 'bold']), GqlMark::fromRaw(['type' => 'futureMark'])],
                ],
            ],
        ]);
        $schema = new Schema([
            'query' => $queryType,
            'types' => [...array_values(VizyNodeGenerator::generateTypes()), ...array_values(VizyMarkGenerator::generateTypes())],
        ]);
        $query = $surface === 'marks'
            ? '{ marks { __typename type } }'
            : "{ document { {$surface} { __typename type } } }";
        $result = GraphQL::executeQuery($schema, $query)->toArray();
        expect($result)->not->toHaveKey('errors');
        $names = match ($surface) {
            'nodes' => ['VizyParagraph', 'VizyUnknownNode', GqlHelpers::blockTypeName($blockType), 'VizyUnresolvedBlock'],
            'blocks' => [GqlHelpers::blockTypeName($blockType), 'VizyUnresolvedBlock'],
            'marks' => ['VizyBold', 'VizyUnknownMark'],
        };
        $rows = $surface === 'marks' ? $result['data']['marks'] : $result['data']['document'][$surface];
        expect(array_column($rows, '__typename'))->toBe(array_map(static fn(string $name): string => $prefix . $name, $names));
    } finally {
        Craft::$app->getGql()->flushCaches();
        GqlEntityRegistry::setPrefix($previousPrefix ?? '');
    }
})->with(['unprefixed' => '', 'prefixed' => 'Site_'])->with(['nodes', 'blocks', 'marks']);
