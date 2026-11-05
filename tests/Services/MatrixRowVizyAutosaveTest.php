<?php

declare(strict_types=1);

use craft\elements\Entry;
use craft\elements\User;
use craft\helpers\Json;
use craft\helpers\StringHelper;
use Tests\Support\Fixtures\AssetSpikeFixture;
use Tests\Support\Fixtures\MatrixSupportFixture;
use Tests\Support\Fixtures\VizyFixtureFactory;
use verbb\vizy\document\InvalidDocumentException;
use verbb\vizy\exceptions\ContentConflictException;
use verbb\vizy\Vizy;

// The first autosave creates the draft's own anchor while the editor still
// submits rows under their saved UIDs and with tokens issued for those rows.
function rowVizyDoc(array $content): array
{
    return ['type' => 'doc', 'attrs' => ['schemaVersion' => 2], 'content' => $content];
}

function rowVizyText(string $text): array
{
    return rowVizyDoc([['type' => 'paragraph', 'content' => [['type' => 'text', 'text' => $text]]]]);
}

function rowVizyPayload(MatrixSupportFixture $f, array $documents): array
{
    $entries = [];
    foreach ($documents as $document) {
        $fields = [$f->text->handle => 'Label'];
        if ($document !== null) {
            $fields[$f->rowVizy->handle] = Json::encode($document);
        }
        $entries[StringHelper::UUID()] = ['type' => $f->rowType->handle, 'fields' => $fields];
    }
    return ['entries' => $entries, 'sortOrder' => array_keys($entries)];
}

/** What the browser posts for one row: its saved UID, with the token the page was issued. */
function rowVizySubmittedRows(MatrixSupportFixture $f, array $rows, array $documents = []): array
{
    $entries = [];
    foreach ($rows as $row) {
        $document = $documents[$row->id] ?? $row->getFieldValue($f->rowVizy->handle)->toArray();
        $document['attrs']['_storageToken'] = Vizy::$plugin->getContentVersions()->issue($row, $f->rowVizy);
        $entries['uid:' . $row->uid] = ['type' => $f->rowType->handle, 'enabled' => '1', 'fields' => [
            $f->text->handle => $row->getFieldValue($f->text->handle),
            $f->rowVizy->handle => Json::encode($document),
        ]];
    }
    return ['entries' => $entries, 'sortOrder' => array_map(static fn($row) => $row->uid, $rows)];
}

function rowVizySubmittedDocument(MatrixSupportFixture $f, Entry $page, array $slots): array
{
    $document = $page->getFieldValue($f->field->handle)->toArray();
    $document['attrs']['_storageToken'] = Vizy::$plugin->getContentVersions()->issue($page, $f->field);
    $document['content'][0]['attrs']['fieldSlots'][$f->placementUid] = $slots;
    return $document;
}

/** Mirrors ElementsController::actionSaveDraft(): create the provisional draft, apply the POST, save. */
function rowVizyAutosave(MatrixSupportFixture $f, Entry $canonical, array $document): Entry
{
    $draft = Craft::$app->getDrafts()->createDraft($canonical, Craft::$app->getUser()->getId(), provisional: true);
    $draft->setCanonical($canonical);
    return rowVizySaveDraft($f, $draft, $document);
}

function rowVizySaveDraft(MatrixSupportFixture $f, Entry $draft, array $document): Entry
{
    $draft->setScenario(\craft\base\Element::SCENARIO_ESSENTIALS);
    $draft->setFieldValue($f->field->handle, $document);
    expect(Craft::$app->getElements()->saveElement($draft))->toBeTrue();
    return $f->reload($draft);
}

function rowVizyStoredText(MatrixSupportFixture $f, Entry $row): string
{
    return Json::encode($row->getFieldValue($f->rowVizy->handle)->toArray()['content']);
}

beforeEach(function() {
    AssetSpikeFixture::ensureAdminUser();
});

afterEach(function() {
    AssetSpikeFixture::ensureAdminUser();
});

it('autosaves an entry whose Matrix rows hold Vizy text without changing the live rows', function() {
    $f = new MatrixSupportFixture(rowVizy: true);
    $uid = StringHelper::UUID();
    $owner = $f->save([$f->block($uid, rowVizyPayload($f, [rowVizyText('First saved'), rowVizyText('Second saved'), null]))]);
    $rows = $f->rows($uid);
    $document = rowVizySubmittedDocument($f, $owner, rowVizySubmittedRows($f, $rows, [
        $rows[0]->id => rowVizyText('First autosaved'),
    ]));

    $draft = rowVizyAutosave($f, $owner, $document);

    $draftRows = $f->rows($uid, $draft);
    expect($draftRows)->toHaveCount(3)
        ->and(rowVizyStoredText($f, $draftRows[0]))->toContain('First autosaved')
        ->and(rowVizyStoredText($f, $draftRows[1]))->toContain('Second saved')
        ->and($draftRows[0]->id)->not->toBe($rows[0]->id);
    $liveRows = $f->rows($uid, $owner);
    expect(array_column($liveRows, 'id'))->toBe(array_column($rows, 'id'))
        ->and(rowVizyStoredText($f, $liveRows[0]))->toContain('First saved');
});

it('accepts later autosaves using either the refreshed token or the one the page opened with', function() {
    $f = new MatrixSupportFixture(rowVizy: true);
    $uid = StringHelper::UUID();
    $owner = $f->save([$f->block($uid, rowVizyPayload($f, [rowVizyText('Saved')]))]);
    $rows = $f->rows($uid);
    $openedSlots = rowVizySubmittedRows($f, $rows, [$rows[0]->id => rowVizyText('First edit')]);
    $openedDocument = rowVizySubmittedDocument($f, $owner, $openedSlots);
    $draft = rowVizyAutosave($f, $owner, $openedDocument);

    // A row edited while the first save is in flight can miss its token refresh.
    $stale = $openedDocument;
    $staleRow = Json::decode($openedSlots['entries']['uid:' . $rows[0]->uid]['fields'][$f->rowVizy->handle]);
    $staleRow['content'][0]['content'][0]['text'] = 'Edited during first save';
    $stale['content'][0]['attrs']['fieldSlots'][$f->placementUid]['entries']['uid:' . $rows[0]->uid]['fields'][$f->rowVizy->handle] = Json::encode($staleRow);
    $draft = rowVizySaveDraft($f, $draft, $stale);
    expect(rowVizyStoredText($f, $f->rows($uid, $draft)[0]))->toContain('Edited during first save');

    $draftRows = $f->rows($uid, $draft);
    $draft = rowVizySaveDraft($f, $draft, rowVizySubmittedDocument($f, $draft, rowVizySubmittedRows($f, $draftRows, [
        $draftRows[0]->id => rowVizyText('Second edit'),
    ])));
    expect($f->rows($uid, $draft))->toHaveCount(1)
        ->and(rowVizyStoredText($f, $f->rows($uid, $draft)[0]))->toContain('Second edit')
        ->and(rowVizyStoredText($f, $f->rows($uid, $owner)[0]))->toContain('Saved');
});

it('still reports a conflict when the saved row changed after the page opened', function() {
    $f = new MatrixSupportFixture(rowVizy: true);
    $uid = StringHelper::UUID();
    $owner = $f->save([$f->block($uid, rowVizyPayload($f, [rowVizyText('Saved')]))]);
    $rows = $f->rows($uid);
    $document = rowVizySubmittedDocument($f, $owner, rowVizySubmittedRows($f, $rows, [
        $rows[0]->id => rowVizyText('Stale edit'),
    ]));

    $live = Entry::find()->id($rows[0]->id)->status(null)->one();
    $live->setFieldValue($f->rowVizy->handle, rowVizyText('Newer live edit'));
    expect(Craft::$app->getElements()->saveElement($live))->toBeTrue();

    expect(fn() => rowVizyAutosave($f, $owner, $document))
        ->toThrow(ContentConflictException::class);
    expect(rowVizyStoredText($f, $f->rows($uid, $owner)[0]))->toContain('Newer live edit');
});

it('rejects a row token and UID borrowed from another entry', function() {
    $f = new MatrixSupportFixture(rowVizy: true);
    $uid = StringHelper::UUID();
    $owner = $f->save([$f->block($uid, rowVizyPayload($f, [rowVizyText('Mine')]))]);
    $other = new Entry([
        'sectionId' => $owner->sectionId, 'typeId' => $owner->typeId, 'siteId' => $owner->siteId, 'title' => 'Other entry',
    ]);
    expect(Craft::$app->getElements()->saveElement($other))->toBeTrue();
    $otherUid = StringHelper::UUID();
    $other = $f->save([$f->block($otherUid, rowVizyPayload($f, [rowVizyText('Not mine')]))], $other);
    $document = rowVizySubmittedDocument($f, $owner, rowVizySubmittedRows($f, $f->rows($otherUid, $other)));

    expect(fn() => rowVizyAutosave($f, $owner, $document))
        ->toThrow(RuntimeException::class, 'belongs to another owner');
});

it('still checks a reference first added while the row is recreated on the draft', function() {
    $asset = AssetSpikeFixture::createTempAsset('row-vizy-private.txt', 'private');
    $folder = Craft::$app->getAssets()->getRootFolderByVolumeId(AssetSpikeFixture::volume()->id);
    expect(Craft::$app->getAssets()->moveAsset($asset, $folder))->toBeTrue();
    $f = new MatrixSupportFixture(rowVizy: true);
    $uid = StringHelper::UUID();
    $owner = $f->save([$f->block($uid, rowVizyPayload($f, [rowVizyText('Saved')]))]);
    $rows = $f->rows($uid);
    $document = rowVizySubmittedDocument($f, $owner, rowVizySubmittedRows($f, $rows, [
        $rows[0]->id => rowVizyDoc([['type' => 'image', 'attrs' => ['assetUid' => $asset->uid]]]),
    ]));
    $author = new User([
        'username' => 'rowvizy' . StringHelper::randomString(6),
        'email' => StringHelper::randomString(8) . '@example.test',
        'active' => true,
        'pending' => false,
    ]);
    $author->newPassword = 'Testing1!';
    expect(Craft::$app->getElements()->saveElement($author))->toBeTrue();
    Craft::$app->getUser()->setIdentity($author);

    expect(fn() => rowVizyAutosave($f, $owner, $document))->toThrow(InvalidDocumentException::class);
    expect(rowVizyStoredText($f, $f->rows($uid, $owner)[0]))->toContain('Saved');
});

it('autosaves rows that propagate to another site', function() {
    [, $siteB] = VizyFixtureFactory::ensureSites(2);
    $f = new MatrixSupportFixture(rowVizy: true);
    $uid = StringHelper::UUID();
    $owner = $f->save([$f->block($uid, rowVizyPayload($f, [rowVizyText('Both sites')]))]);
    $rows = $f->rows($uid);

    $draft = rowVizyAutosave($f, $owner, rowVizySubmittedDocument($f, $owner, rowVizySubmittedRows($f, $rows, [
        $rows[0]->id => rowVizyText('Primary site edit'),
    ])));

    expect(rowVizyStoredText($f, $f->rows($uid, $draft)[0]))->toContain('Primary site edit');
    $liveOnB = Entry::find()->id($owner->id)->siteId($siteB->id)->status(null)->one();
    expect($liveOnB)->not->toBeNull()
        ->and(rowVizyStoredText($f, $f->rows($uid, $owner)[0]))->toContain('Both sites');
});
