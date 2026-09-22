<?php

require __DIR__ . '/verify.php';

$metadata = json_decode(file_get_contents(dirname(__DIR__, 2) . '/.cache/verbb-tests/browser.json'), true, flags: JSON_THROW_ON_ERROR);
$fixture = $metadata['matrixIntegrations'][$argv[1]];
$entry = \craft\elements\Entry::find()->id($fixture['entryId'])->status(null)->one();
$owner = $fixture['nestedHandle'] ? $entry->getFieldValue($fixture['nestedHandle'])->one() : $entry;
$document = $owner->getFieldValue($metadata['fieldHandle']);
$block = $document->blockElement($document->findBlock($fixture['blockUid']));
$rows = $block->getFieldValue($fixture['matrixHandle'])->all();
file_put_contents(dirname(__DIR__, 2) . '/.cache/verbb-tests/matrix-integration-state.json', json_encode([
    'labels' => array_map(fn($row) => (string)$row->getFieldValue($fixture['labelHandle']), $rows),
    'hyper' => array_map(fn($owner) => $owner->getFieldValue('browserHyper')->getLinkUrl(), [$block, ...$rows]),
    'typed' => array_map(fn($owner) => $owner->getFieldValue('browserTyped')->getUrl(), [$block, ...$rows]),
    'drafts' => \craft\elements\Entry::find()->drafts()->provisionalDrafts(null)->draftOf($entry->id)->status(null)->count(),
], JSON_PRETTY_PRINT));
