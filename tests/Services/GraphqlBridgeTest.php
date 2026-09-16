<?php

declare(strict_types=1);

use verbb\vizy\document\DocumentParser;
use verbb\vizy\document\VizyDocument;
use verbb\vizy\fields\VizyField;
use verbb\vizy\gql\GqlHelpers;
use verbb\vizy\gql\GqlNode;
use verbb\vizy\gql\types\VizyDocumentType;

it('exposes structural VizyDocument GraphQL fields', function() {
    $document = (new DocumentParser())->parse([
        'type' => 'doc',
        'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
        'content' => [
            [
                'type' => 'paragraph',
                'content' => [
                    ['type' => 'text', 'text' => 'Hello'],
                ],
            ],
            [
                'type' => 'heading',
                'attrs' => ['level' => 2],
                'content' => [
                    ['type' => 'text', 'text' => 'Title'],
                ],
            ],
            [
                'type' => 'futureNode',
                'attrs' => ['opaque' => true],
            ],
        ],
    ]);

    $type = VizyDocumentType::getType();

    expect($type->name)->toBe('VizyDocument')
        ->and($type->getField('schemaVersion'))->not->toBeNull()
        ->and($type->getField('nodes'))->not->toBeNull()
        ->and($type->getField('blocks'))->not->toBeNull()
        ->and($type->getField('renderedHtml'))->not->toBeNull()
        ->and($type->getField('raw'))->not->toBeNull()
        ->and(($type->getField('schemaVersion')->resolveFn)($document))->toBe(VizyDocument::CURRENT_SCHEMA_VERSION);

    $nodes = ($type->getField('nodes')->resolveFn)($document, []);
    expect($nodes)->toHaveCount(3)
        ->and($nodes[0])->toBeInstanceOf(GqlNode::class)
        ->and($nodes[0]->type())->toBe('paragraph')
        ->and($nodes[0]->text())->toBe('Hello')
        ->and(GqlHelpers::resolveNodeTypeName($nodes[0]))->toBe('VizyParagraph')
        ->and(GqlHelpers::resolveNodeTypeName($nodes[1]))->toBe('VizyHeading')
        ->and(GqlHelpers::resolveNodeTypeName($nodes[2]))->toBe('VizyUnknownNode');

    // Per-node html — Vizy 3 convenience restored on the structural interface.
    $nodeInterface = \verbb\vizy\gql\interfaces\VizyNodeInterface::getType();
    $htmlField = $nodeInterface->getField('html');
    expect($htmlField)->not->toBeNull();
    $paragraphHtml = ($htmlField->resolveFn)($nodes[0]);
    $headingHtml = ($htmlField->resolveFn)($nodes[1]);
    expect($paragraphHtml)->toContain('<p>')
        ->and($paragraphHtml)->toContain('Hello')
        ->and($headingHtml)->toContain('<h2>')
        ->and($headingHtml)->toContain('Title');
});

it('filters GraphQL nodes with Twig-query spirit where/limit', function() {
    $document = (new DocumentParser())->parse([
        'type' => 'doc',
        'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
        'content' => [
            [
                'type' => 'paragraph',
                'content' => [['type' => 'text', 'text' => 'A']],
            ],
            [
                'type' => 'paragraph',
                'content' => [['type' => 'text', 'text' => 'B']],
            ],
            [
                'type' => 'heading',
                'attrs' => ['level' => 1],
                'content' => [['type' => 'text', 'text' => 'H']],
            ],
        ],
    ]);

    $paragraphs = GqlHelpers::queryRootNodes($document, [
        'where' => ['type' => 'paragraph'],
        'limit' => 1,
    ]);

    expect($paragraphs)->toHaveCount(1)
        ->and($paragraphs[0]->type())->toBe('paragraph')
        ->and($paragraphs[0]->text())->toBe('A');
});

it('exposes layout stack/span/proportion on structural nodes', function() {
    $layoutUid = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
    $colA = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
    $colB = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc';

    $document = (new DocumentParser())->parse([
        'type' => 'doc',
        'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
        'content' => [[
            'type' => 'layout',
            'attrs' => ['layoutUid' => $layoutUid, 'stack' => 'never'],
            'content' => [
                [
                    'type' => 'column',
                    'attrs' => ['columnUid' => $colA, 'span' => 4],
                    'content' => [[
                        'type' => 'paragraph',
                        'content' => [['type' => 'text', 'text' => 'Left']],
                    ]],
                ],
                [
                    'type' => 'column',
                    'attrs' => ['columnUid' => $colB, 'span' => 8],
                    'content' => [],
                ],
            ],
        ]],
    ]);

    $nodes = GqlHelpers::queryRootNodes($document, []);
    expect($nodes)->toHaveCount(1)
        ->and($nodes[0]->type())->toBe('layout')
        ->and($nodes[0]->attrs()['stack'])->toBe('never');

    $columns = $nodes[0]->children();
    expect($columns)->toHaveCount(2)
        ->and($columns[0]->attrs()['span'])->toBe(4)
        ->and($columns[1]->attrs()['span'])->toBe(8)
        ->and(GqlHelpers::resolveNodeTypeName($columns[0]))->toBe('VizyColumn');
});

it('wires VizyField content GQL type to a field-scoped document type', function() {
    $field = new VizyField();
    $field->handle = 'body';

    $type = $field->getContentGqlType();

    expect($type->name)->toBe('body_VizyDocument');
});

it('keeps GraphQL raw unredacted while renderedHtml applies emit policy', function() {
    // Beta-1 residual: raw / attrs expose canonical storage; HTML emit is hardened.
    $document = (new DocumentParser())->parse([
        'type' => 'doc',
        'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
        'content' => [[
            'type' => 'paragraph',
            'content' => [[
                'type' => 'text',
                'text' => 'Click',
                'marks' => [[
                    'type' => 'link',
                    'attrs' => [
                        'type' => 'url',
                        'value' => 'javascript:alert(1)',
                        'siteMode' => 'current',
                        'newWindow' => false,
                    ],
                ]],
            ]],
        ]],
    ]);

    $type = VizyDocumentType::getType();
    $html = ($type->getField('renderedHtml')->resolveFn)($document);
    $raw = ($type->getField('raw')->resolveFn)($document);

    expect($html)->toContain('Click')
        ->and($html)->not->toContain('javascript:')
        ->and($html)->not->toMatch('/<a\b/i')
        ->and(json_encode($raw))->toContain('javascript:alert(1)');
});
