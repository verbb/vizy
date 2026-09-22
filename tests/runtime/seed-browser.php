<?php

require __DIR__ . '/verify.php';

use craft\elements\Entry;
use craft\elements\User;
use craft\fieldlayoutelements\CustomField;
use craft\fields\Entries;
use craft\fields\PlainText;
use craft\helpers\StringHelper;
use craft\models\FieldLayout;
use craft\models\FieldLayoutTab;
use Tests\Support\Fixtures\AssetSpikeFixture;
use Tests\Support\Fixtures\VizyFixtureFactory;
use verbb\vizy\elements\Block;
use verbb\vizy\fields\VizyField;
use verbb\vizy\models\BlockType;
use verbb\vizy\Vizy;

$admin = AssetSpikeFixture::ensureAdminUser();
$save = static function($model, callable $save): void {
    if (!$save($model)) throw new RuntimeException(json_encode($model->getErrors()));
};
$plain = new PlainText(['name' => 'Card heading', 'handle' => 'cardHeading']);
$related = new Entries(['name' => 'Related pages', 'handle' => 'relatedPages']);
$nested = new VizyField(['name' => 'Nested body', 'handle' => 'nestedBody', 'editorConfig' => 'standard']);
foreach ([$plain, $related, $nested] as $field) {
    $save($field, Craft::$app->getFields()->saveField(...));
}
$uploads = AssetSpikeFixture::assetsField('browser-uploads');
$uploads->name = 'Uploaded files';
$save($uploads, Craft::$app->getFields()->saveField(...));
$layout = new FieldLayout(['uid' => StringHelper::UUID(), 'type' => Block::class]);
$placements = [];
foreach ([$plain, $related, $nested, $uploads] as $field) {
    $placement = new CustomField($field);
    $placement->uid = StringHelper::UUID();
    $placements[] = $placement;
}
$placements[0]->required = true;
$tab = new FieldLayoutTab(['name' => 'Content', 'layout' => $layout]);
$tab->setElements($placements);
$layout->setTabs([$tab]);
$type = new BlockType(['uid' => StringHelper::UUID(), 'name' => 'Card', 'handle' => 'card']);
$type->setFieldLayout($layout);
$save($type, Vizy::$plugin->getBlockTypes()->saveBlockType(...));
$rootField = VizyFixtureFactory::vizyField();
$rootField->editorMode = VizyField::MODE_COMBINED;
$rootField->rootContentType = VizyField::ROOT_CONTENT_RICH;
$rootField->blockTypePickerGroups = [['name' => 'Content', 'blockTypeUids' => [$type->uid]]];
$save($rootField, Craft::$app->getFields()->saveField(...));
$section = VizyFixtureFactory::section();
$section->enableVersioning = true;
$save($section, Craft::$app->getEntries()->saveSection(...));
$relatedEntry = VizyFixtureFactory::entry('Related target');
$doc = json_decode(VizyFixtureFactory::paragraphDocument('Root before'), true);
$doc['content'][] = ['type' => 'vizyBlock', 'attrs' => [
    'blockUid' => StringHelper::UUID(), 'blockTypeUid' => $type->uid, 'enabled' => true,
    'fieldSlots' => [
        $placements[0]->uid => 'Heading before',
        $placements[1]->uid => [$relatedEntry->id],
        $placements[2]->uid => json_decode(VizyFixtureFactory::paragraphDocument('Nested before'), true),
    ],
]];
$owner = VizyFixtureFactory::entry('Browser owner', json_encode($doc));
$peer = VizyFixtureFactory::entry('Peer owner');
$actor = new User(['username' => 'editor', 'email' => 'editor@example.test', 'active' => true, 'pending' => false]);
$actor->newPassword = 'testing-only-password';
$save($actor, Craft::$app->getElements()->saveElement(...));
Craft::$app->getUserPermissions()->saveUserPermissions($actor->id, [
    'accessCp', "viewEntries:$section->uid", "saveEntries:$section->uid", "viewPeerEntries:$section->uid",
]);
$owner->setAuthorIds([$actor->id]);
$save($owner, Craft::$app->getElements()->saveElement(...));
$peer->setAuthorIds([$admin->id]);
$save($peer, Craft::$app->getElements()->saveElement(...));
require __DIR__ . '/seed-browser-matrix.php';
$matrixFixture = seedBrowserMatrix($rootField, $owner, $save);
$matrixModes = [];
foreach (['cards', 'cards-grid', 'index'] as $mode) {
    $modeOwner = VizyFixtureFactory::entry('Matrix mode ' . $mode);
    $modeOwner->setAuthorIds([$actor->id]);
    $save($modeOwner, Craft::$app->getElements()->saveElement(...));
    $matrixModes[$mode] = seedBrowserMatrix($rootField, $modeOwner, $save, $mode);
    $matrixModes[$mode]['entryId'] = $modeOwner->id;
    $matrixModes[$mode]['editPath'] = '/index.php?p=admin/entries/' . $section->handle . '/' . $modeOwner->id;
}
$scaleOwner = VizyFixtureFactory::entry('Matrix scale');
$scaleOwner->setAuthorIds([$actor->id]);
$sourceOwner = Entry::find()->id($owner->id)->status(null)->one();
$sourceBlocks = $sourceOwner->getFieldValue($rootField->handle)->toArray()['content'];
$sourceBlock = array_values(array_filter($sourceBlocks, static fn($block) => ($block['attrs']['blockUid'] ?? null) === $matrixFixture['blockUid']))[0];
$matrixType = Vizy::$plugin->getBlockTypes()->getBlockTypeByUid($sourceBlock['attrs']['blockTypeUid']);
$matrixPlacement = $matrixType->getFieldLayout()->getCustomFieldElements()[0]->uid;
$rowType = Craft::$app->getEntries()->getEntryTypeById($matrixFixture['entryTypeId']);
$scaleBlocks = [];
for ($index = 0; $index < 30; $index++) {
    $rows = [];
    for ($rowIndex = 0; $rowIndex < 3; $rowIndex++) {
        $rows[StringHelper::UUID()] = ['type' => $rowType->handle, 'fields' => [$matrixFixture['labelHandle'] => "Scale $index:$rowIndex"]];
    }
    $block = $sourceBlock;
    unset($block['attrs']['matrixAnchorUid']);
    $block['attrs']['blockUid'] = StringHelper::UUID();
    $block['attrs']['fieldSlots'] = [$matrixPlacement => ['entries' => $rows, 'sortOrder' => array_keys($rows)]];
    $scaleBlocks[] = $block;
}
$scaleOwner->setFieldValue($rootField->handle, ['type' => 'doc', 'attrs' => ['schemaVersion' => 2], 'content' => $scaleBlocks]);
$save($scaleOwner, Craft::$app->getElements()->saveElement(...));
$matrixModes['scale'] = $matrixFixture + [
    'entryId' => $scaleOwner->id,
    'editPath' => '/index.php?p=admin/entries/' . $section->handle . '/' . $scaleOwner->id,
    'blockUids' => array_column(array_column($scaleBlocks, 'attrs'), 'blockUid'),
];
$privateAsset = AssetSpikeFixture::createTempAsset('private-metadata.txt', 'private browser fixture');
require __DIR__ . '/seed-browser-matrix-integrations.php';
$matrixIntegrations = seedBrowserMatrixIntegrations($rootField, $matrixFixture, $sourceBlock, $actor, $save);
$runId = null;
foreach ($argv as $argument) {
    if (str_starts_with($argument, '--browser-run=')) $runId = substr($argument, 14);
}
if ($runId !== null && !preg_match('/^[a-f0-9-]{36}$/', $runId)) throw new RuntimeException('Invalid browser run ID');
$metadata = [
    'runId' => $runId,
    'matrix' => $matrixFixture,
    'matrixModes' => $matrixModes,
    'matrixIntegrations' => $matrixIntegrations,
    'privateAsset' => ['id' => $privateAsset->id, 'uid' => $privateAsset->uid, 'filename' => $privateAsset->filename],
    'url' => 'https://' . getenv('DDEV_SITENAME') . '.ddev.site',
    'entryId' => $owner->id, 'peerId' => $peer->id, 'actorId' => $actor->id,
    'editPath' => '/index.php?p=admin/entries/' . $section->handle . '/' . $owner->id,
    'fieldHandle' => $rootField->handle, 'fieldUid' => $rootField->uid,
    'blockUid' => $doc['content'][1]['attrs']['blockUid'],
    'headingPlacement' => $placements[0]->uid, 'relatedPlacement' => $placements[1]->uid,
    'uploadPlacement' => $placements[3]->uid, 'uploadVolumeId' => AssetSpikeFixture::volume()->id,
    'nestedPlacement' => $placements[2]->uid, 'relatedId' => $relatedEntry->id,
    'siteId' => $owner->siteId, 'sectionUid' => $section->uid,
];
// A long-lived fixture lease does not reach Craft's after-request event yet.
Craft::$app->getProjectConfig()->flush();
file_put_contents(dirname(__DIR__, 2) . '/.cache/verbb-tests/browser.json', json_encode($metadata, JSON_PRETTY_PRINT));
echo "Seeded disposable Craft browser fixtures.\n";

// Keep run.php's exclusive runtime lock until the host browser process finishes.
if ($runId !== null) {
    $done = dirname(__DIR__, 2) . '/.cache/verbb-tests/browser-done-' . $runId;
    $deadline = time() + 900;
    while (!is_file($done)) {
        if (time() > $deadline) throw new RuntimeException('Browser run did not release its runtime lease');
        usleep(250_000);
    }
}
