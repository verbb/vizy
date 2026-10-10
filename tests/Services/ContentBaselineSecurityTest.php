<?php

declare(strict_types=1);

use craft\db\Query;
use craft\db\Table;
use craft\elements\Entry;
use craft\helpers\Json;
use Tests\Support\Fixtures\VizyFixtureFactory;
use verbb\vizy\helpers\FieldPlacements;
use verbb\vizy\Vizy;

it('uses canonical content rather than an author-controlled draft as the grandfather baseline', function() {
    $field = VizyFixtureFactory::vizyField();
    $canonical = VizyFixtureFactory::entry(
        'Canonical baseline',
        VizyFixtureFactory::paragraphDocument('Canonical content'),
    );
    $canonicalDocument = $canonical->getFieldValue($field->handle)->toArray();
    $draft = Craft::$app->getDrafts()->createDraft(
        $canonical,
        Craft::$app->getUser()->getId(),
        'Untrusted draft baseline',
    );
    $placementUid = FieldPlacements::uid($draft, $field);
    $content = (new Query())
        ->select('content')
        ->from(Table::ELEMENTS_SITES)
        ->where(['elementId' => $draft->id, 'siteId' => $draft->siteId])
        ->scalar();
    $content = is_string($content) ? Json::decode($content) : $content;
    $content[$placementUid] = VizyFixtureFactory::paragraphDocument('Draft-only capability');
    Craft::$app->getDb()->createCommand()->update(Table::ELEMENTS_SITES, ['content' => $content], [
        'elementId' => $draft->id,
        'siteId' => $draft->siteId,
    ])->execute();
    $draft = Entry::find()->id($draft->id)->siteId($draft->siteId)->drafts()->status(null)->one();
    Vizy::$plugin->getContentBaselines()->clear();

    expect(Vizy::$plugin->getContentBaselines()->document($draft, $field)?->toArray())
        ->toBe($canonicalDocument);
});

it('does not grandfather an unpublished draft that has no persisted canonical content', function() {
    $section = VizyFixtureFactory::section();
    $field = VizyFixtureFactory::vizyField();
    $type = Craft::$app->getEntries()->getEntryTypesBySectionId($section->id)[0];
    $draft = new Entry([
        'sectionId' => $section->id,
        'typeId' => $type->id,
        'siteId' => Craft::$app->getSites()->getPrimarySite()->id,
        'title' => 'Unpublished draft baseline',
        'slug' => 'unpublished-draft-baseline',
    ]);
    $draft->setAuthorIds([Craft::$app->getUser()->getId()]);
    $draft->setFieldValue($field->handle, VizyFixtureFactory::paragraphDocument('Draft-only content'));
    expect(Craft::$app->getDrafts()->saveElementAsDraft($draft, Craft::$app->getUser()->getId()))->toBeTrue();
    Vizy::$plugin->getContentBaselines()->clear();

    expect($draft->getIsDraft())->toBeTrue()
        ->and(Vizy::$plugin->getContentBaselines()->document($draft, $field))->toBeNull();
});
