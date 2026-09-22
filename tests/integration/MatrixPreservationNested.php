<?php

// Included by MatrixAnchorRecovery.php inside its rollback transaction.
// Schema fixtures must never be installed in a shared support database.
if (getenv('CRAFT_DB_DATABASE') !== 'vizy_preservation_test') {
    throw new RuntimeException('Nested preservation fixtures require the isolated vizy_preservation_test database.');
}
Craft::$app->getProjectConfig()->writeYamlAutomatically = false;
$vizy->translationMethod = craft\base\Field::TRANSLATION_METHOD_SITE;
check(Craft::$app->getFields()->saveField($vizy), 'nested Vizy fixture supports independent site content');
$entryType = rows($source, $matrix)[0]->getType();
$nestedMatrix = new craft\fields\Matrix([
    'name' => 'Preservation nested Matrix', 'handle' => 'preservationNestedMatrix',
    'entryTypes' => [$entryType],
]);
check(Craft::$app->getFields()->saveField($nestedMatrix), 'nested Matrix test field is created');
$relatedField = new craft\fields\Entries(['name' => 'Preservation relations', 'handle' => 'preservationRelations', 'sources' => '*']);
check(Craft::$app->getFields()->saveField($relatedField), 'relation test field is created');
$relationPlacement = new craft\fieldlayoutelements\CustomField();
$relationPlacement->setField($relatedField);
$entryLayout = $entryType->getFieldLayout();
$tabs = $entryLayout->getTabs();
$nestedPlacement = new craft\fieldlayoutelements\CustomField();
$nestedPlacement->setField($nestedMatrix);
$vizyPlacement = new craft\fieldlayoutelements\CustomField();
$vizyPlacement->setField($vizy);
$tabs[] = new craft\models\FieldLayoutTab([
    'name' => 'Preservation tests', 'layout' => $entryLayout, 'elements' => [$nestedPlacement, $vizyPlacement, $relationPlacement],
]);
$entryLayout->setTabs($tabs);
$entryType->setFieldLayout($entryLayout);
check(Craft::$app->getEntries()->saveEntryType($entryType), 'nested test fields are placed on the Matrix entry type');

$qualifiedRow = rows($qualified, $matrix)[0];
$qualifiedRow->setFieldValue($relatedField->handle, [$owner->id]);
$qualifiedRow->setFieldValue($nestedMatrix->handle, [
    'entries' => ['new1' => ['type' => $entryType->handle, 'title' => 'Nested native Matrix row', 'fields' => []]],
    'sortOrder' => ['new1'],
]);
$innerVizy = $owner->getFieldValue($vizy->handle)->getRawNodes();
foreach ($innerVizy as &$node) {
    if (($node['type'] ?? '') === verbb\vizy\nodes\VizyBlock::$type) {
        $node['attrs']['id'] = 'vizy-block-preservation-inner';
        unset($node['attrs']['values']['matrixAnchorUid']);
        $node['attrs']['values']['content']['fields'][$matrix->handle] = [
            'entries' => ['new1' => ['type' => $entryType->handle, 'title' => 'Matrix in nested Vizy', 'fields' => []]],
            'sortOrder' => ['new1'],
        ];
    }
}
unset($node);
$qualifiedRow->setFieldValue($vizy->handle, $innerVizy);
check(Craft::$app->getElements()->saveElement($qualifiedRow, false, false, false), 'Matrix-in-Matrix and Matrix-in-nested-Vizy fixture saves');
$nestedSnapshot = $recovery->captureAnchor($qualified, 'nested-content-test');
$nestedBefore = contentFingerprint($recovery->getSnapshot($nestedSnapshot)['payload']['sites']);
$anchors->deleteAnchor($qualified, true);
$recovery->restore($nestedSnapshot);
$qualified = verbb\vizy\elements\MatrixAnchor::find()->uid($qualified->uid)->siteId($qualified->siteId)->one();
$nestedAfterId = $recovery->captureAnchor($qualified, 'nested-content-result');
$nestedAfter = contentFingerprint($recovery->getSnapshot($nestedAfterId)['payload']['sites']);
if ($nestedBefore !== $nestedAfter) {
    file_put_contents('/tmp/vizy-preservation-before.json', json_encode($nestedBefore, JSON_PRETTY_PRINT));
    file_put_contents('/tmp/vizy-preservation-after.json', json_encode($nestedAfter, JSON_PRETTY_PRINT));
}
check($nestedBefore === $nestedAfter, 'complete nested Matrix, Vizy and relation values survive permanent deletion and recovery');
