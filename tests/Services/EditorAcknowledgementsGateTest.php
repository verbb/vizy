<?php

declare(strict_types=1);

use craft\behaviors\CustomFieldBehavior;
use craft\elements\Entry;
use craft\fieldlayoutelements\CustomField;
use craft\helpers\Json;
use craft\helpers\StringHelper;
use craft\models\FieldLayout;
use craft\models\FieldLayoutTab;
use craft\web\Response as WebResponse;
use Tests\Support\Fixtures\AssetSpikeFixture;
use Tests\Support\Fixtures\VizyFixtureFactory;
use Tests\Support\WebControllerHarness;
use verbb\vizy\document\DocumentParser;
use verbb\vizy\document\VizyDocument;
use verbb\vizy\elements\Block;
use verbb\vizy\models\BlockType;
use verbb\vizy\services\AssetFinalizationException;
use verbb\vizy\Vizy;
use yii\base\Event;
use yii\web\Response;

beforeEach(function() {
    AssetSpikeFixture::ensureAdminUser();
    Vizy::$plugin->getAssetUploads()->resetRequestStateForTesting();
    Vizy::$plugin->getEditorAcknowledgements()->resetRequestStateForTesting();
});

afterEach(function() {
    Vizy::$plugin->getAssetUploads()->setMoveAssetHandlerForTesting(null);
    Vizy::$plugin->getAssetUploads()->resetRequestStateForTesting();
    Vizy::$plugin->getEditorAcknowledgements()->resetRequestStateForTesting();
});

/**
 * Single Assets placement + temp Asset. Forced move failure yields a durable
 * failed batch and retry token without relying on dual-destination preflight.
 *
 * @return array{assetField:\craft\fields\Assets,type:BlockType,placementUid:string,owner:Entry,field:\verbb\vizy\fields\VizyField,document:VizyDocument,temp:\craft\elements\Asset}
 */
function acknowledgementAssetDocument(string $label): array
{
    $assetField = AssetSpikeFixture::assetsField('ack-' . strtolower($label) . '/{id}');
    CustomFieldBehavior::$fieldHandles[$assetField->handle] = true;
    $layout = new FieldLayout(['uid' => StringHelper::UUID(), 'type' => Block::class]);
    $layout->setTabs([new FieldLayoutTab([
        'layout' => $layout,
        'name' => 'Assets',
        'elements' => [[
            'type' => CustomField::class,
            'fieldUid' => $assetField->uid,
        ]],
    ])]);
    $type = new BlockType([
        'uid' => StringHelper::UUID(),
        'name' => "Ack {$label}",
        'handle' => 'ack' . $label . StringHelper::randomString(5),
    ]);
    $type->setFieldLayout($layout);
    expect(Vizy::$plugin->getBlockTypes()->saveBlockType($type))->toBeTrue();
    $type = Vizy::$plugin->getBlockTypes()->getBlockTypeByUid($type->uid);
    $field = VizyFixtureFactory::vizyField();
    $field->blockTypePickerGroups = [['name' => 'Assets', 'blockTypeUids' => [$type->uid]]];
    expect(Craft::$app->getFields()->saveField($field))->toBeTrue();
    Craft::$app->getFields()->refreshFields();
    $field = Craft::$app->getFields()->getFieldByUid($field->uid);
    expect($field)->toBeInstanceOf(\verbb\vizy\fields\VizyField::class);
    $owner = VizyFixtureFactory::entry("Ack {$label} owner");
    foreach ($owner->getFieldLayout()?->getCustomFieldElements() ?? [] as $placement) {
        $layoutField = $placement->getField();
        if ($layoutField instanceof \verbb\vizy\fields\VizyField && $layoutField->uid === $field->uid) {
            $layoutField->blockTypePickerGroups = $field->blockTypePickerGroups;
        }
    }
    $placementUid = $type->getFieldLayout()->getCustomFieldElements()[0]->uid;
    $temp = AssetSpikeFixture::createTempAsset('ack-' . strtolower($label) . '.txt', $label);
    $document = (new DocumentParser())->parse([
        'type' => 'doc',
        'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
        'content' => [[
            'type' => 'vizyBlock',
            'attrs' => [
                'blockUid' => 'ack-' . strtolower($label) . '-block',
                'blockTypeUid' => $type->uid,
                'enabled' => true,
                'fieldSlots' => [
                    $placementUid => [$temp->id],
                ],
            ],
        ]],
    ], $owner, $field);
    $owner->setFieldValue($field->handle, $document);

    return compact('assetField', 'type', 'placementUid', 'owner', 'field', 'document', 'temp');
}

it('augments matching elements JSON saves with structured acknowledgement metadata after a long editing session', function() {
    \Tests\Support\Fixtures\AssetSpikeFixture::ensureAdminUser();
    $owner = VizyFixtureFactory::entry('Ack complete owner');
    $field = VizyFixtureFactory::vizyField();
    $context = Vizy::$plugin->getEditorContexts()->issue($owner, $field);
    unset($context['token']);
    $context['issuedAt'] = time() - 86400;
    $context['token'] = rtrim(strtr(base64_encode(Craft::$app->getSecurity()->hashData(Json::encode($context))), '+/', '-_'), '=');
    $document = $owner->getFieldValue($field->handle);
    $editorId = 'vizy-editor-ack-complete';

    $responseData = WebControllerHarness::withWebRequest(
        [
            'vizyTransport' => WebControllerHarness::transportMetadata(
                $editorId,
                $field->uid,
                $context['token'],
                7,
                3,
                'save',
            ),
        ],
        'elements/save',
        function() use ($owner, $field, $document, $editorId) {
            Vizy::$plugin->getEditorAcknowledgements()->collect($owner, $field, $document);
            $response = new WebResponse();
            $response->format = Response::FORMAT_JSON;
            $response->data = ['success' => true, 'element' => ['id' => $owner->id]];
            $event = new Event(['sender' => $response]);
            Vizy::$plugin->getEditorAcknowledgements()->augmentResponse($event);
            return $response->data;
        },
    );

    expect($responseData['vizy']['results'])->toHaveCount(1)
        ->and($responseData['vizy']['results'][0])->toMatchArray([
            'editorId' => $editorId,
            'generation' => 7,
            'requestKind' => 'save',
            'submittedClientRevision' => 3,
            'success' => true,
            'finalizationStatus' => 'complete',
            'retryToken' => null,
        ])
        ->and($responseData['vizy']['results'][0]['canonicalDocument'])->toBe($document->toArray());
});

it('returns structured failed acknowledgement instead of an unstructured 500 for expected Asset failure', function() {
    $context = acknowledgementAssetDocument('Fail');
    $editorContext = Vizy::$plugin->getEditorContexts()->issue($context['owner'], $context['field']);
    $editorId = 'vizy-editor-ack-fail';
    $thrown = null;

    // Deterministic web failure: Craft move is forced closed; Vizy must annotate
    // the JSON response instead of escaping as AssetFinalizationException/500.
    Vizy::$plugin->getAssetUploads()->setMoveAssetHandlerForTesting(static fn(): bool => false);

    $responseData = WebControllerHarness::withWebRequest(
        [
            'vizyTransport' => WebControllerHarness::transportMetadata(
                $editorId,
                $context['field']->uid,
                $editorContext['token'],
                2,
                9,
                'autosave',
            ),
        ],
        'elements/save',
        function() use ($context, &$thrown) {
            try {
                expect(Craft::$app->getElements()->saveElement($context['owner'], false))->toBeTrue();
            } catch (AssetFinalizationException $exception) {
                $thrown = $exception;
            }
            $response = new WebResponse();
            $response->format = Response::FORMAT_JSON;
            $response->data = ['success' => true];
            Vizy::$plugin->getEditorAcknowledgements()->augmentResponse(new Event(['sender' => $response]));
            return $response->data;
        },
    );

    $result = $responseData['vizy']['results'][0] ?? null;
    expect($thrown)->toBeNull()
        ->and($result)->not->toBeNull()
        ->and($result['finalizationStatus'])->toBe('failed')
        ->and($result['success'])->toBeTrue()
        ->and($result['retryToken'])->toBeString()->not->toBe('')
        ->and($result['finalizationErrors'][0]['code'] ?? null)->toBe('assetFinalization')
        ->and($result['canonicalDocument']['content'][0]['attrs']['blockUid'] ?? null)->toBe('ack-fail-block');
});

it('reauthorizes retry tokens without saving the owner', function() {
    $context = acknowledgementAssetDocument('Retry');
    $editorContext = Vizy::$plugin->getEditorContexts()->issue($context['owner'], $context['field']);
    $editorId = 'vizy-editor-ack-retry';

    // Create the durable failed batch on the console request (throws structured
    // AssetFinalizationException). Web collect/augment then issues the retry
    // token without re-entering Craft's Asset move path under the harness.
    Vizy::$plugin->getAssetUploads()->setMoveAssetHandlerForTesting(static fn(): bool => false);
    try {
        Craft::$app->getElements()->saveElement($context['owner'], false);
        $thrown = null;
    } catch (AssetFinalizationException $exception) {
        $thrown = $exception;
    }
    expect($thrown)->toBeInstanceOf(AssetFinalizationException::class)
        ->and(Vizy::$plugin->getAssetUploads()->resultForOwner($context['owner'], $context['field'])['status'] ?? null)
        ->toBe('failed');

    $document = $context['owner']->getFieldValue($context['field']->handle);
    $retryToken = WebControllerHarness::withWebRequest(
        [
            'vizyTransport' => WebControllerHarness::transportMetadata(
                $editorId,
                $context['field']->uid,
                $editorContext['token'],
                4,
                11,
                'autosave',
            ),
        ],
        'elements/save',
        function() use ($context, $document) {
            Vizy::$plugin->getEditorAcknowledgements()->collect($context['owner'], $context['field'], $document);
            $response = new WebResponse();
            $response->format = Response::FORMAT_JSON;
            $response->data = ['success' => true];
            Vizy::$plugin->getEditorAcknowledgements()->augmentResponse(new Event(['sender' => $response]));
            return $response->data['vizy']['results'][0]['retryToken'] ?? null;
        },
    );

    expect($retryToken)->toBeString()->not->toBe('');
    Vizy::$plugin->getAssetUploads()->setMoveAssetHandlerForTesting(static fn(): bool => false);
    $ownerBefore = Craft::$app->getElements()->getElementById($context['owner']->id, Entry::class, $context['owner']->siteId);
    $dateUpdated = $ownerBefore->dateUpdated?->format('c') ?? 'null';
    $title = $ownerBefore->title;

    $response = WebControllerHarness::retryFinalization(['retryToken' => $retryToken]);
    $reloaded = Craft::$app->getElements()->getElementById($context['owner']->id, Entry::class, $context['owner']->siteId);

    expect($response->getStatusCode())->toBe(200)
        ->and($response->data['editorId'])->toBe($editorId)
        ->and($response->data['generation'])->toBe(4)
        ->and($response->data['submittedClientRevision'])->toBe(11)
        ->and($response->data['finalizationStatus'])->toBe('failed')
        ->and($response->data['canonicalDocument'])->toBeArray()
        ->and($reloaded->dateUpdated?->format('c') ?? 'null')->toBe($dateUpdated)
        ->and($reloaded->title)->toBe($title);
});

it('rejects unsigned, expired, wrong-user, and stale retry tokens', function() {
    $context = acknowledgementAssetDocument('Reject');
    // Persist the owner without Asset work first so Elements::saveElement is not
    // asked to duplicate under suite-load Asset failure residue.
    $empty = (new DocumentParser())->parse([
        'type' => 'doc',
        'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
        'content' => [],
    ], $context['owner'], $context['field']);
    $context['owner']->setFieldValue($context['field']->handle, $empty);
    expect(Craft::$app->getElements()->saveElement($context['owner'], false))->toBeTrue();

    $context['owner']->setFieldValue($context['field']->handle, $context['document']);
    Vizy::$plugin->getAssetUploads()->setMoveAssetHandlerForTesting(static fn(): bool => false);
    $finalization = Vizy::$plugin->getAssetUploads()->finalizeDocument($context['document']);
    expect($finalization['status'])->toBe('failed')
        ->and($finalization['batchId'])->not->toBeNull();

    $editorContext = Vizy::$plugin->getEditorContexts()->issue($context['owner'], $context['field']);
    $retryToken = WebControllerHarness::withWebRequest(
        [
            'vizyTransport' => WebControllerHarness::transportMetadata(
                'vizy-editor-ack-reject',
                $context['field']->uid,
                $editorContext['token'],
                1,
                1,
                'save',
            ),
        ],
        'elements/save',
        function() use ($context) {
            Vizy::$plugin->getEditorAcknowledgements()->collect(
                $context['owner'],
                $context['field'],
                $context['document'],
            );
            $response = new WebResponse();
            $response->format = Response::FORMAT_JSON;
            $response->data = ['success' => true];
            Vizy::$plugin->getEditorAcknowledgements()->augmentResponse(new Event(['sender' => $response]));
            return $response->data['vizy']['results'][0]['retryToken'] ?? null;
        },
    );

    expect($retryToken)->toBeString()->not->toBe('');
    expect(fn() => Vizy::$plugin->getEditorAcknowledgements()->verifyRetryToken($retryToken . 'x'))
        ->toThrow(RuntimeException::class);

    $admin = AssetSpikeFixture::ensureAdminUser();
    $wrongUserPayload = Vizy::$plugin->getEditorAcknowledgements()->verifyRetryToken($retryToken);
    $wrongUserPayload['userId'] = ((int)$admin->id) + 99999;
    $wrongUserToken = rtrim(strtr(base64_encode(Craft::$app->getSecurity()->hashData(Json::encode($wrongUserPayload))), '+/', '-_'), '=');
    expect(fn() => Vizy::$plugin->getEditorAcknowledgements()->verifyRetryToken($wrongUserToken))
        ->toThrow(RuntimeException::class, 'invalidRetryToken');

    $payload = Vizy::$plugin->getEditorAcknowledgements()->verifyRetryToken($retryToken);
    $batch = \verbb\vizy\records\AssetUploadBatch::findOne((int)$payload['batchId']);
    expect($batch)->not->toBeNull();
    $batch->snapshotHash = 'tampered';
    expect($batch->save(false))->toBeTrue();
    expect(fn() => Vizy::$plugin->getEditorAcknowledgements()->verifyRetryToken($retryToken))
        ->toThrow(RuntimeException::class, 'staleRetryToken');
});

it('ignores unsigned mismatched transport metadata and non-elements routes', function() {
    $owner = VizyFixtureFactory::entry('Ack ignore owner');
    $field = VizyFixtureFactory::vizyField();
    $document = $owner->getFieldValue($field->handle);

    $responseData = WebControllerHarness::withWebRequest(
        [
            'vizyTransport' => [
                'bad' => [
                    'editorId' => 'bad',
                    'fieldUid' => $field->uid,
                    'editorContextToken' => 'not-a-token',
                    'generation' => 1,
                    'clientRevision' => 1,
                    'requestKind' => 'save',
                ],
            ],
        ],
        'dashboard/index',
        function() use ($owner, $field, $document) {
            Vizy::$plugin->getEditorAcknowledgements()->collect($owner, $field, $document);
            $response = new WebResponse();
            $response->data = ['ok' => true];
            Vizy::$plugin->getEditorAcknowledgements()->augmentResponse(new Event(['sender' => $response]));
            return $response->data;
        },
    );

    expect($responseData)->toBe(['ok' => true]);
});

it('reports pending finalization with canonical document while an outer owner transaction remains open', function() {
    $owner = VizyFixtureFactory::entry('Ack pending owner');
    $field = VizyFixtureFactory::vizyField();
    $document = $owner->getFieldValue($field->handle);
    $editorContext = Vizy::$plugin->getEditorContexts()->issue($owner, $field);
    $editorId = 'vizy-editor-ack-pending';

    // Inject the exact request-local pending Asset result without running a full
    // Assets move path (avoids Entry-duplication flakiness under suite load).
    $uploads = Vizy::$plugin->getAssetUploads();
    $uploads->defer($owner, $field, $document);

    $responseData = WebControllerHarness::withWebRequest(
        [
            'vizyTransport' => WebControllerHarness::transportMetadata(
                $editorId,
                $field->uid,
                $editorContext['token'],
                3,
                12,
                'save',
            ),
        ],
        'elements/save',
        function() use ($owner, $field, $document) {
            Vizy::$plugin->getEditorAcknowledgements()->collect($owner, $field, $document);
            $response = new WebResponse();
            $response->format = Response::FORMAT_JSON;
            $response->data = ['success' => true];
            Vizy::$plugin->getEditorAcknowledgements()->augmentResponse(new Event(['sender' => $response]));
            return $response->data;
        },
    );

    $result = $responseData['vizy']['results'][0] ?? null;
    expect($result)->not->toBeNull()
        ->and($result['editorId'])->toBe($editorId)
        ->and($result['generation'])->toBe(3)
        ->and($result['submittedClientRevision'])->toBe(12)
        ->and($result['requestKind'])->toBe('save')
        ->and($result['finalizationStatus'])->toBe('pending')
        ->and($result['retryToken'])->toBeNull()
        ->and($result['canonicalDocument'])->toBe($document->toArray());
});

it('acknowledges the first provisional draft created from a canonical editor context without matching another owner', function() {
    $admin = AssetSpikeFixture::ensureAdminUser();
    $owner = VizyFixtureFactory::entry('First autosave acknowledgement');
    $field = VizyFixtureFactory::vizyField();
    $context = Vizy::$plugin->getEditorContexts()->issue($owner, $field);
    $other = VizyFixtureFactory::entry('Unrelated autosave acknowledgement');
    $otherDraft = Craft::$app->getDrafts()->createDraft($other, $admin->id, 'Unrelated');
    $editorId = 'vizy-first-autosave';
    $result = WebControllerHarness::withWebRequest([
        'vizyTransport' => WebControllerHarness::transportMetadata($editorId, $field->uid, $context['token'], 5, 9, 'autosave'),
    ], 'elements/save-draft', function() use ($owner, $otherDraft, $admin, $field) {
        $acks = Vizy::$plugin->getEditorAcknowledgements();
        $acks->collect($otherDraft, $field, $otherDraft->getFieldValue($field->handle));
        // Real duplication and persistence can serialize the initial copy and
        // then the edited draft during the same elements/save-draft request.
        $draft = Craft::$app->getDrafts()->createDraft($owner, $admin->id, 'First autosave');
        $draft->setFieldValue($field->handle, VizyFixtureFactory::paragraphDocument('Autosaved current text'));
        expect(Craft::$app->getElements()->saveElement($draft, false))->toBeTrue();
        $response = new WebResponse();
        $response->data = ['draftId' => $draft->draftId, 'elementId' => $draft->id];
        $acks->augmentResponse(new Event(['sender' => $response]));
        return $response->data;
    });
    expect($result['vizy']['results'])->toHaveCount(1)
        ->and($result['vizy']['results'][0]['editorId'])->toBe($editorId)
        ->and($result['vizy']['results'][0]['requestKind'])->toBe('autosave')
        ->and($result['vizy']['results'][0]['canonicalDocument']['content'][0]['content'][0]['text'])->toBe('Autosaved current text');
});
