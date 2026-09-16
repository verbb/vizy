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
$privateAsset = AssetSpikeFixture::createTempAsset('private-metadata.txt', 'private browser fixture');
$runId = null;
foreach ($argv as $argument) {
    if (str_starts_with($argument, '--browser-run=')) $runId = substr($argument, 14);
}
if ($runId !== null && !preg_match('/^[a-f0-9-]{36}$/', $runId)) throw new RuntimeException('Invalid browser run ID');
$metadata = [
    'runId' => $runId,
    'matrix' => $matrixFixture,
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
