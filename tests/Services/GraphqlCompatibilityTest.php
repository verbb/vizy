<?php

declare(strict_types=1);

use craft\behaviors\CustomFieldBehavior;
use craft\elements\Entry;
use craft\fieldlayoutelements\CustomField;
use craft\helpers\Gql as GqlHelper;
use GraphQL\Utils\SchemaPrinter;
use Tests\Support\Fixtures\AssetSpikeFixture;
use Tests\Support\Fixtures\MatrixSupportFixture;
use verbb\vizy\gql\GqlHelpers;

it('dumps concrete Vizy types and returns Matrix Assets through Craft GraphQL', function() {
    $fixture = new MatrixSupportFixture();
    $assetField = AssetSpikeFixture::assetsField();
    CustomFieldBehavior::$fieldHandles[$assetField->handle] = true;

    $rowLayout = $fixture->rowType->getFieldLayout();
    $rowTab = $rowLayout->getTabs()[0];
    $rowTab->setElements([...$rowTab->getElements(), new CustomField($assetField)]);
    expect(Craft::$app->getFields()->saveLayout($rowLayout))->toBeTrue();

    $asset = AssetSpikeFixture::createTempAsset('graphql-matrix.txt', 'GraphQL Matrix Asset');
    $volume = AssetSpikeFixture::volume();
    $folder = Craft::$app->getAssets()->getRootFolderByVolumeId($volume->id);
    expect(Craft::$app->getAssets()->moveAsset($asset, $folder))->toBeTrue();

    $payload = $fixture->payload(['GraphQL asset row']);
    foreach ($payload['entries'] as &$entry) {
        $entry['fields'][$assetField->handle] = [$asset->id];
    }
    unset($entry);

    $blockUid = 'graphql-matrix-block';
    $owner = $fixture->save([$fixture->block($blockUid, $payload)]);
    $row = $fixture->rows($blockUid, $owner)[0];
    expect($row->getFieldValue($assetField->handle)->ids())->toBe([$asset->id]);

    $gql = Craft::$app->getGql();
    $gql->flushCaches();
    $fullSchema = GqlHelper::createFullAccessSchema();
    $ownerTypeName = Entry::gqlTypeName($owner->getType());
    $rowTypeName = Entry::gqlTypeName($fixture->rowType);
    $blockTypeName = GqlHelpers::blockTypeName($fixture->blockType);
    $query = <<<GQL
        {
          entries(id: {$owner->id}) {
            ... on {$ownerTypeName} {
              {$fixture->field->handle} {
                blocks {
                  ... on {$blockTypeName} {
                    {$fixture->matrix->handle} {
                      ... on {$rowTypeName} {
                        {$assetField->handle} {
                          id
                          filename
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        GQL;

    try {
        // This is the same eager build used by `graphql/dump-schema`, which was
        // the failing #214 path rather than ordinary lazy query execution.
        $schemaDef = $gql->getSchemaDef($fullSchema, true);
        $typeNames = array_keys($schemaDef->getTypeMap());
        $printed = SchemaPrinter::doPrint($schemaDef);
        expect($typeNames)->toContain(
            'VizyNodeInterface',
            'VizyParagraph',
            'VizyHeading',
            'VizyUnknownNode',
            'VizyBlockInterface',
            $fixture->field->handle . '_VizyDocument',
            $blockTypeName,
        )
            ->and($printed)->toContain('type VizyParagraph implements VizyNodeInterface')
            ->and($printed)->toContain("type {$blockTypeName} implements VizyNodeInterface & VizyBlockInterface");

        $result = $gql->executeQuery($fullSchema, $query, debugMode: true);

        expect($result['errors'] ?? [])->toBe([], json_encode($result));
        $assets = $result['data']['entries'][0][$fixture->field->handle]['blocks'][0][$fixture->matrix->handle][0][$assetField->handle];
        expect($assets)->toBe([[
            'id' => (string)$asset->id,
            'filename' => $asset->filename,
        ]]);
    } finally {
        $gql->flushCaches();
    }
});
