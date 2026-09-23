<?php

declare(strict_types=1);

use craft\db\Query;
use craft\helpers\Html;
use craft\helpers\Json;
use craft\helpers\StringHelper;
use craft\models\GqlSchema;
use Tests\Support\Fixtures\VizyFixtureFactory;
use verbb\vizy\document\VizyDocument;
use verbb\vizy\gql\GqlMark;
use verbb\vizy\helpers\FieldPlacements;

it('resolves persisted Entry links after site base URLs change', function() {
    [$siteA, $siteB] = VizyFixtureFactory::ensureSites(2);
    $sites = Craft::$app->getSites();
    $originalBaseUrls = [
        $siteA->id => $siteA->baseUrl,
        $siteB->id => $siteB->baseUrl,
    ];

    try {
        $field = VizyFixtureFactory::vizyField();
        $section = VizyFixtureFactory::multisiteSection($field, 1, [$siteA, $siteB]);
        $targetA = VizyFixtureFactory::entryOnSite(
            $section,
            $field,
            $siteA,
            'Environment link target',
            VizyFixtureFactory::paragraphDocument('Target'),
        );
        $targetB = craft\elements\Entry::find()->id($targetA->id)->siteId($siteB->id)->status(null)->one();
        expect($targetB)->not->toBeNull();

        $currentAttrs = [
            'type' => 'entry',
            'targetUid' => $targetA->uid,
            'siteMode' => 'current',
            'siteUid' => null,
            'value' => null,
            'suffix' => null,
            'newWindow' => false,
        ];
        $fixedAttrs = [...$currentAttrs, 'siteMode' => 'fixed', 'siteUid' => $siteA->uid];
        $document = [
            'type' => 'doc',
            'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
            'content' => [
                [
                    'type' => 'paragraph',
                    'content' => [[
                        'type' => 'text',
                        'text' => 'Current site',
                        'marks' => [['type' => 'link', 'attrs' => $currentAttrs]],
                    ]],
                ],
                [
                    'type' => 'paragraph',
                    'content' => [[
                        'type' => 'text',
                        'text' => 'Fixed site',
                        'marks' => [['type' => 'link', 'attrs' => $fixedAttrs]],
                    ]],
                ],
            ],
        ];
        $ownerA = VizyFixtureFactory::entryOnSite(
            $section,
            $field,
            $siteA,
            'Environment link owner',
            Json::encode($document),
        );
        $ownerB = craft\elements\Entry::find()->id($ownerA->id)->siteId($siteB->id)->status(null)->one();
        expect($ownerB)->not->toBeNull();

        // Canonical Vizy 4 storage keeps element identity and site intent, never
        // the environment-specific URL that happened to exist while authoring.
        $placementUid = FieldPlacements::uid($ownerA, $field);
        expect($placementUid)->not->toBeNull();
        $rawContent = (new Query())
            ->select('content')
            ->from('{{%elements_sites}}')
            ->where(['elementId' => $ownerA->id, 'siteId' => $siteA->id])
            ->scalar();
        $content = is_string($rawContent) ? Json::decode($rawContent) : $rawContent;
        $persisted = Json::decodeIfJson($content[$placementUid]);
        $persistedJson = Json::encode($persisted);
        expect($persisted['content'][0]['content'][0]['marks'][0]['attrs'])->toBe($currentAttrs)
            ->and($persisted['content'][1]['content'][0]['marks'][0]['attrs'])->toBe($fixedAttrs)
            ->and($persistedJson)->not->toContain('https://');

        $oldUrlA = $targetA->getUrl();
        $oldUrlB = $targetB->getUrl();
        $suffix = strtolower(StringHelper::randomString(8));
        $movedBaseA = "https://moved-a-{$suffix}.test/en/";
        $movedBaseB = "https://moved-b-{$suffix}.test/fr/";

        $siteA = $sites->getSiteById($siteA->id);
        $siteA->baseUrl = $movedBaseA;
        expect($sites->saveSite($siteA))->toBeTrue(Json::encode($siteA->getErrors()));
        $siteB = $sites->getSiteById($siteB->id);
        $siteB->baseUrl = $movedBaseB;
        expect($sites->saveSite($siteB))->toBeTrue(Json::encode($siteB->getErrors()));
        $sites->refreshSites();

        $targetA = craft\elements\Entry::find()->id($targetA->id)->siteId($siteA->id)->status(null)->one();
        $targetB = craft\elements\Entry::find()->id($targetB->id)->siteId($siteB->id)->status(null)->one();
        $ownerB = craft\elements\Entry::find()->id($ownerB->id)->siteId($siteB->id)->status(null)->one();
        expect($targetA)->not->toBeNull()
            ->and($targetB)->not->toBeNull()
            ->and($ownerB)->not->toBeNull();

        $urlA = $targetA->getUrl();
        $urlB = $targetB->getUrl();
        $ownerDocument = $ownerB->getFieldValue($field->handle);
        $renderedHtml = (string)$ownerDocument->render();
        expect(parse_url($urlA, PHP_URL_HOST))->toBe(parse_url($movedBaseA, PHP_URL_HOST))
            ->and(parse_url($urlB, PHP_URL_HOST))->toBe(parse_url($movedBaseB, PHP_URL_HOST))
            ->and($urlA)->not->toBe($oldUrlA)
            ->and($urlB)->not->toBe($oldUrlB)
            ->and($renderedHtml)->toContain('href="' . Html::encode($urlB) . '">Current site</a>')
            ->and($renderedHtml)->toContain('href="' . Html::encode($urlA) . '">Fixed site</a>')
            ->and($renderedHtml)->not->toContain((string)$oldUrlA)
            ->and($renderedHtml)->not->toContain((string)$oldUrlB);

        // Exercise the schema-scoped resolver source behind VizyLink.url. The
        // GraphQL bridge has separate end-to-end schema/query coverage.
        $gql = Craft::$app->getGql();
        $gql->setActiveSchema(new GqlSchema([
            'name' => 'Environment link schema ' . $suffix,
            'scope' => [
                'sections.' . $section->uid . ':read',
                'sites.' . $siteA->uid . ':read',
                'sites.' . $siteB->uid . ':read',
            ],
        ]));
        $currentMark = GqlMark::fromRaw(['type' => 'link', 'attrs' => $currentAttrs]);
        $fixedMark = GqlMark::fromRaw(['type' => 'link', 'attrs' => $fixedAttrs]);

        expect($currentMark->linkUrl($siteB->id))->toBe($urlB)
            ->and($fixedMark->linkUrl($siteB->id))->toBe($urlA);
    } finally {
        Craft::$app->getGql()->setActiveSchema(null);

        foreach ($originalBaseUrls as $siteId => $baseUrl) {
            $site = $sites->getSiteById((int)$siteId);
            if ($site && $site->baseUrl !== $baseUrl) {
                $site->baseUrl = $baseUrl;
                $sites->saveSite($site);
            }
        }
        $sites->refreshSites();
    }
});
