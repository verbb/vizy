<?php

require __DIR__ . '/verify.php';

$metadata = json_decode(file_get_contents(dirname(__DIR__, 2) . '/.cache/verbb-tests/browser.json'), true, flags: JSON_THROW_ON_ERROR);
$matrix = $metadata['matrixModes'][$argv[1]];
$owner = \craft\elements\Entry::find()->id($matrix['entryId'])->status(null)->one();
$document = $owner->getFieldValue($metadata['fieldHandle']);
$rows = [];
foreach ($matrix['blockUids'] ?? [$matrix['blockUid']] as $uid) {
    array_push($rows, ...$document->blockElement($document->findBlock($uid))->getFieldValue($matrix['fieldHandle'])->all());
}
file_put_contents(dirname(__DIR__, 2) . '/.cache/verbb-tests/matrix-mode-state.json', json_encode([
    'labels' => array_map(fn($row) => (string)$row->getFieldValue($matrix['labelHandle']), $rows),
    'drafts' => \craft\elements\Entry::find()->drafts()->provisionalDrafts(null)->draftOf($owner->id)->status(null)->count(),
], JSON_PRETTY_PRINT));
