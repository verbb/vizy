<?php
require __DIR__ . '/verify.php';
$metadata = json_decode(file_get_contents(dirname(__DIR__, 2) . '/.cache/verbb-tests/browser.json'), true, flags: JSON_THROW_ON_ERROR);
$entry = craft\elements\Entry::find()->id($metadata['entryId'])->status(null)->one();
if (!$entry) throw new RuntimeException('Browser fixture owner not found');
$document = $entry->getFieldValue($metadata['fieldHandle']);
$matrix = $metadata['matrix'];
$block = $document->findBlock($matrix['blockUid']);
$rows = $document->blockElement($block)->getFieldValue($matrix['fieldHandle'])->all();
file_put_contents(dirname(__DIR__, 2) . '/.cache/verbb-tests/browser-state.json', json_encode([
    'nestedElementCount' => (int)(new craft\db\Query())->from('{{%entries}}')->where(['primaryOwnerId' => $matrix['anchorId']])->count(),
    'drafts' => array_map(fn($draft) => [
        'id' => $draft->id, 'draftId' => $draft->draftId,
        'document' => $draft->getFieldValue($metadata['fieldHandle'])->toArray(),
    ], craft\elements\Entry::find()->drafts()->provisionalDrafts(null)->draftOf($entry->id)->status(null)->all()),
    'uploads' => array_map(static function($asset) {
        $folder = Craft::$app->getAssets()->getFolderById($asset->folderId);
        return ['id' => $asset->id, 'filename' => $asset->filename, 'volumeId' => $asset->volumeId,
            'folderPath' => $folder->path, 'contents' => $asset->getFs()->read($asset->getPath())];
    }, craft\elements\Asset::find()->volumeId($metadata['uploadVolumeId'])->status(null)->all()),
    'relatedExists' => craft\elements\Entry::find()->id($metadata['relatedId'])->status(null)->exists(),
    'matrixRows' => array_map(fn($row) => ['id' => $row->id, 'label' => (string)$row->getFieldValue($matrix['labelHandle'])], $rows),
    'document' => $document->toArray(), 'html' => (string)$document->render(),
], JSON_PRETTY_PRINT));
