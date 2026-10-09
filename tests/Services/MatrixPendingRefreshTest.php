<?php

declare(strict_types=1);

use craft\db\Query;
use craft\elements\Entry;
use craft\elements\User;
use craft\helpers\Json;
use craft\helpers\StringHelper;
use Tests\Support\Fixtures\AssetSpikeFixture;
use Tests\Support\Fixtures\MatrixSupportFixture;
use Tests\Support\WebControllerHarness;
use verbb\vizy\controllers\FieldController;
use verbb\vizy\Vizy;
use yii\web\BadRequestHttpException;

function pendingMatrixFixture(): array
{
    AssetSpikeFixture::ensureAdminUser();
    $f = new MatrixSupportFixture();
    $blockUid = StringHelper::UUID();
    $rowUid = StringHelper::UUID();
    $context = Vizy::$plugin->getEditorContexts()->issue($f->owner, $f->field);
    unset($context['token']);
    $context['matrixBlockUid'] = $blockUid;
    $context['matrixBlockTypeUid'] = $f->blockType->uid;
    $context['matrixAnchorUid'] = null;
    $token = rtrim(strtr(base64_encode(Craft::$app->security->hashData(Json::encode($context))), '+/', '-_'), '=');
    $namespace = "vizyHost[$token][$blockUid][fields][fields][{$f->matrix->handle}][entries][uid:$rowUid]";
    $params = ['elementType'=>Entry::class, 'elementUid'=>$rowUid, 'fieldId'=>$f->matrix->id, 'typeId'=>$f->rowType->id, 'siteId'=>$f->owner->siteId, 'ownerId'=>$f->owner->id, 'fields'=>[$f->text->handle=>'Pending row value'], 'visibleLayoutElements'=>[], 'staticLayoutElements'=>[]];
    return compact('f', 'namespace', 'params');
}

function refreshPendingMatrix(array $fixture, array $overrides = [], ?string $namespace = null, bool $ensureAdmin = true): array
{
    $namespace ??= $fixture['namespace'];
    parse_str(http_build_query([$namespace=>array_replace($fixture['params'], $overrides)]), $body);
    WebControllerHarness::beginWebRequest($body, 'vizy/field/refresh-matrix-entry', $ensureAdmin);
    try {
        Craft::$app->request->headers->set('X-Craft-Namespace', $namespace);
        Craft::$app->request->setIsCpRequest(true);
        $controller = new FieldController('field', Vizy::$plugin);
        return $controller->actionRefreshMatrixEntry()->data;
    } finally {
        WebControllerHarness::endWebRequest();
    }
}

it('refreshes pending Matrix fields without creating entries or anchors', function() {
    $fixture = pendingMatrixFixture();
    $before = (new Query())->from('{{%elements}}')->count();
    $fixture['params']['fields']['hyperData'] = ['ui-only' => ['linkValue' => '/not-a-field']];
    $result = refreshPendingMatrix($fixture);
    $html = implode('', array_filter(array_column($result['missingElements'][0]['elements'], 'html'), 'is_string'));
    expect($html)->toContain('Pending row value')
        ->and($html)->toContain('vizyHost[')
        ->and($result)->toHaveKeys(['tabs','missingElements','headHtml','bodyHtml','uiLabel'])
        ->and((new Query())->from('{{%elements}}')->count())->toBe($before)
        ->and(Entry::find()->uid($fixture['params']['elementUid'])->drafts(null)->status(null)->exists())->toBeFalse();
});

it('rejects pending Matrix requests outside their signed placement', function(string $case) {
    $fixture = pendingMatrixFixture();
    $overrides = match ($case) {
        'field' => ['fieldId'=>$fixture['f']->text->id],
        'type' => ['typeId'=>$fixture['f']->owner->typeId],
        'site' => ['siteId'=>9999999],
        'identity' => ['elementUid'=>StringHelper::UUID()],
        'persisted' => ['elementId'=>$fixture['f']->owner->id],
        default => [],
    };
    $namespace = $case === 'signature' ? preg_replace('/^vizyHost\[./', 'vizyHost[x', $fixture['namespace']) : null;
    expect(fn() => refreshPendingMatrix($fixture, $overrides, $namespace))->toThrow(BadRequestHttpException::class);
})->with(['field','type','site','identity','persisted','signature']);

it('does not grant a different user access through a pending Matrix namespace', function() {
    $fixture = pendingMatrixFixture();
    $admin = Craft::$app->user->getIdentity();
    Craft::$app->user->setIdentity(new User(['id'=>9999999, 'username'=>'No access']));
    try {
        expect(fn() => refreshPendingMatrix($fixture, [], null, false))->toThrow(BadRequestHttpException::class);
    } finally {
        Craft::$app->user->setIdentity($admin);
    }
});

it('shows and hides pending row fields from submitted sibling values', function() {
    $fixture = pendingMatrixFixture();
    $f = $fixture['f'];
    $toggle = new craft\fields\Lightswitch(['name'=>'Show text', 'handle'=>'showText' . StringHelper::randomString(6)]);
    expect(Craft::$app->fields->saveField($toggle))->toBeTrue();
    $layout = $f->rowType->getFieldLayout();
    $textPlacement = $layout->getCustomFieldElements()[0];
    $togglePlacement = new craft\fieldlayoutelements\CustomField($toggle);
    $togglePlacement->uid = StringHelper::UUID();
    $tab = $layout->getTabs()[0];
    $tab->setElements([$togglePlacement, $textPlacement]);
    $condition = Entry::createCondition();
    $condition->setFieldLayouts([$layout]);
    $rule = new craft\fields\conditions\LightswitchFieldConditionRule();
    $rule->setFieldUid($toggle->uid);
    $rule->value = true;
    $condition->setConditionRules([$rule]);
    $textPlacement->setElementCondition($condition);
    expect(Craft::$app->fields->saveLayout($layout))->toBeTrue();
    $fields = [$f->text->handle=>'Preserved conditional value', $toggle->handle=>true];
    $shown = refreshPendingMatrix($fixture, ['fields'=>$fields]);
    $elements = array_column($shown['missingElements'][0]['elements'], null, 'uid');
    expect($elements[$textPlacement->uid]['html'])->toContain('Preserved conditional value')
        ->and($elements[$textPlacement->uid]['html'])->toContain(htmlspecialchars($fixture['namespace'], ENT_QUOTES));
    $fields[$toggle->handle] = false;
    $hidden = refreshPendingMatrix($fixture, ['fields'=>$fields, 'visibleLayoutElements'=>[$tab->uid=>[$textPlacement->uid,$togglePlacement->uid]]]);
    $elements = array_column($hidden['missingElements'][0]['elements'], null, 'uid');
    expect($elements[$textPlacement->uid]['html'])->toBeFalse();
});
