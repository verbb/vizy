<?php

declare(strict_types=1);

use craft\base\ElementInterface;
use craft\db\Query;
use craft\db\Table;
use craft\elements\Entry;
use craft\elements\GlobalSet;
use craft\enums\PropagationMethod;
use craft\fieldlayoutelements\CustomField;
use craft\helpers\Json;
use craft\helpers\StringHelper;
use craft\models\FieldLayout;
use craft\models\FieldLayoutTab;
use Tests\Support\Fixtures\MatrixSupportFixture;
use Tests\Support\Fixtures\VizyFixtureFactory;
use verbb\vizy\console\controllers\AnchorsController;
use verbb\vizy\Vizy;
use yii\db\JsonExpression;

function storeHistoricalMatrixDocument(ElementInterface $owner, MatrixSupportFixture $f, array $blocks): void
{
    $placement = $owner->getFieldLayout()->getCustomFieldElements()[0];
    $content = [$placement->uid => Json::encode(['type' => 'doc', 'attrs' => ['schemaVersion' => 2], 'content' => $blocks])];
    Craft::$app->getDb()->createCommand()->update(Table::ELEMENTS_SITES, ['content' => new JsonExpression($content)], [
        'elementId' => $owner->id, 'siteId' => $owner->siteId,
    ])->execute();
}

function matrixBackfillController(): AnchorsController
{
    return new class('anchors', Vizy::$plugin) extends AnchorsController {
        public string $output = '';
        public function stdout($string) { $this->output .= $string; }
    };
}

it('backfills every Matrix site independently while preserving timestamps and excluding drafts', function() {
    [$siteA, $siteB] = VizyFixtureFactory::ensureSites(2);
    $f = new MatrixSupportFixture(propagation: PropagationMethod::None);
    $ownerA = $f->owner;
    $ownerB = Entry::find()->id($ownerA->id)->siteId($siteB->id)->status(null)->one();
    $draft = Craft::$app->getDrafts()->createDraft($ownerA);
    $uid = StringHelper::UUID();
    foreach ([[$ownerA, 'A'], [$ownerB, 'B'], [$draft, 'Draft untouched']] as [$owner, $label]) {
        storeHistoricalMatrixDocument($owner, $f, [$f->block($uid, $f->payload([$label]))]);
    }
    Craft::$app->getDb()->createCommand()->update(Table::ELEMENTS, ['dateUpdated' => '2001-01-01 00:00:00'], ['id' => $ownerA->id])->execute();
    $before = $f->reload($ownerA)->dateUpdated->format('c');
    $draftBefore = (new Query())->from(Table::ELEMENTS_SITES)->where(['elementId' => $draft->id, 'siteId' => $draft->siteId])->select('content')->scalar();
    $controller = matrixBackfillController();
    $controller->elementId = $ownerA->id;
    $controller->dryRun = true;
    expect($controller->actionBackfill())->toBe(0)
        ->and(Vizy::$plugin->getAnchors()->getAnchor($ownerA, $f->field, $uid))->toBeNull();
    $controller->dryRun = false;
    expect($controller->actionBackfill())->toBe(0)
        ->and($controller->output)->toContain('Site scope: all sites')
        ->and($f->rows($uid, $ownerA)[0]->getFieldValue($f->text->handle))->toBe('A')
        ->and($f->rows($uid, $ownerB)[0]->getFieldValue($f->text->handle))->toBe('B')
        ->and($f->reload($ownerA)->dateUpdated->format('c'))->toBe($before)
        ->and((new Query())->from(Table::ELEMENTS_SITES)->where(['elementId' => $draft->id, 'siteId' => $draft->siteId])->select('content')->scalar())->toBe($draftBefore);
    // Selecting the draft explicitly still needs the opt-in flag.
    $controller->elementId = $draft->id;
    expect($controller->actionBackfill())->toBe(0)
        ->and(Vizy::$plugin->getAnchors()->getAnchor($draft, $f->field, $uid))->toBeNull();
    $controller->drafts = true;
    expect($controller->actionBackfill())->toBe(0)
        ->and($f->rows($uid, $draft)[0]->getFieldValue($f->text->handle))->toBe('Draft untouched')
        ->and($f->rows($uid, $ownerA)[0]->getFieldValue($f->text->handle))->toBe('A');
});

it('backfills Matrix on a global set using only its actual Vizy placements', function() {
    $f = new MatrixSupportFixture();
    $layout = new FieldLayout(['type' => GlobalSet::class]);
    $layout->setTabs([new FieldLayoutTab(['layout' => $layout, 'name' => 'Content', 'elements' => [new CustomField($f->field)]])]);
    $global = new GlobalSet(['name' => 'Matrix global', 'handle' => 'matrixGlobal' . StringHelper::randomString(8)]);
    $global->setFieldLayout($layout);
    expect(Craft::$app->getGlobals()->saveSet($global))->toBeTrue();
    $uid = StringHelper::UUID();
    storeHistoricalMatrixDocument($global, $f, [$f->block($uid, $f->payload(['Global content']))]);
    $controller = matrixBackfillController();
    $controller->elementId = $global->id;
    expect($controller->actionBackfill())->toBe(0);
    $reloaded = GlobalSet::find()->id($global->id)->siteId($global->siteId)->one();
    $doc = $reloaded->getFieldValue($f->field->handle);
    $rows = $doc->blockElement($doc->findBlock($uid))->getFieldValue($f->matrix->handle)->all();
    expect($rows)->toHaveCount(1)
        ->and($rows[0]->getFieldValue($f->text->handle))->toBe('Global content');
});
