<?php

declare(strict_types=1);

use craft\db\Query;
use craft\helpers\StringHelper;
use Tests\Support\Fixtures\MatrixSupportFixture;
use verbb\vizy\elements\MatrixAnchor;

it('keeps one Matrix anchor under simultaneous creation and permits a clean transaction retry', function(bool $outerTransaction, bool $localMutex) {
    $f = new MatrixSupportFixture();
    Craft::$app->getProjectConfig()->flush();
    $blockUid = StringHelper::UUID();
    $before = (int)(new Query())->from('{{%elements}}')->where(['type' => MatrixAnchor::class])->count();
    $job = [
        'ownerId' => $f->owner->id, 'siteId' => $f->owner->siteId,
        'fieldId' => $f->field->id, 'typeUid' => $f->blockType->uid, 'blockUid' => $blockUid,
        'outerTransaction' => $outerTransaction, 'localMutex' => $localMutex,
    ];
    $results = runMatrixWorkers([$job, $job, $job]);
    $errors = array_column($results, 'error');
    if ($outerTransaction) {
        // A stale REPEATABLE READ snapshot belongs to the caller. A failed
        // owner transaction must roll back and retry as a whole; the anchor
        // service must not commit it or leave partial elements behind.
        foreach ($errors as $error) {
            expect($error)->toStartWith('yii\\db\\IntegrityException:');
        }
        $retry = \verbb\vizy\Vizy::$plugin->getAnchors()->ensureAnchor($f->owner, $f->field, $blockUid, $f->blockType->getFieldLayout());
        expect($retry->id)->toBe(array_column($results, 'id')[0]);
    } else {
        expect($errors)->toBe([], json_encode($results));
    }
    expect(array_unique(array_column($results, 'id')))->toHaveCount(1);
    expect(array_unique(array_column($results, 'uid')))->toHaveCount(1);
    if ($localMutex) {
        expect(array_sum(array_column($results, 'creationAttempts')))->toBeGreaterThan(1);
    }
    expect((int)(new Query())->from(\verbb\vizy\db\Table::MATRIX_ANCHORS)->where([
        'parentOwnerId' => $f->owner->id, 'vizyFieldId' => $f->field->id, 'blockInstanceId' => $blockUid,
    ])->count())->toBe(1);
    expect((int)(new Query())->from('{{%elements}}')->where(['type' => MatrixAnchor::class])->count())->toBe($before + 1);
})->with([
    'shared database mutex' => [false, false],
    'inside owner transactions' => [true, false],
    'separate host-local mutexes' => [false, true],
]);


function runMatrixWorkers(array $jobs): array
{
    $directory = Craft::$app->getPath()->getTempPath() . '/matrix-race-' . StringHelper::UUID();
    mkdir($directory);
    $processes = [];
    $completed = false;
    try {
        $deadline = microtime(true) + 20;
        foreach ($jobs as $index => $job) {
            $job += ['ready' => "$directory/ready-$index", 'go' => "$directory/go", 'result' => "$directory/result-$index"];
            file_put_contents("$directory/job-$index", json_encode($job));
            $process = proc_open([PHP_BINARY, dirname(__DIR__) . '/runtime/matrix-concurrency-worker.php', "$directory/job-$index"], [
                0 => ['file', '/dev/null', 'r'], 1 => ['file', "$directory/log-$index", 'w'], 2 => ['file', "$directory/error-$index", 'w'],
            ], $pipes);
            expect(is_resource($process))->toBeTrue();
            $processes[] = $process;
            // Craft regenerates and prunes field classes after fixture schema
            // changes. Finish that startup serially; release every worker's
            // database operation together only after all reach the barrier.
            while (!is_file($job['ready'])) {
                if (glob("$directory/result-*") || microtime(true) > $deadline) {
                    $diagnostics = [];
                    foreach (['log', 'error', 'result'] as $kind) {
                        foreach (glob("$directory/$kind-*") as $file) $diagnostics[basename($file)] = file_get_contents($file);
                    }
                    throw new RuntimeException('Matrix workers failed to reach the start barrier: ' . json_encode($diagnostics));
                }
                usleep(10_000);
            }
        }
        touch("$directory/go");
        while (count(glob("$directory/result-*")) !== count($jobs)) {
            if (microtime(true) > $deadline) throw new RuntimeException('Matrix workers did not finish.');
            usleep(10_000);
        }
        $results = array_map(static fn($file) => json_decode(file_get_contents($file), true), glob("$directory/result-*"));
        $completed = true;
        return $results;
    } finally {
        foreach ($processes as $process) {
            if (!$completed && proc_get_status($process)['running']) proc_terminate($process);
            proc_close($process);
        }
        \craft\helpers\FileHelper::removeDirectory($directory);
    }
}

it('saves simultaneous Matrix drafts in separate processes without changing the published source', function() {
    $f = new MatrixSupportFixture();
    $uid = StringHelper::UUID();
    $owner = $f->save([$f->block($uid, $f->payload(['Published']))]);
    $original = $f->rows($uid)[0];
    $drafts = [Craft::$app->getDrafts()->createDraft($owner), Craft::$app->getDrafts()->createDraft($owner)];
    Craft::$app->getProjectConfig()->flush();
    $jobs = [];
    foreach ($drafts as $index => $draft) {
        $row = $f->rows($uid, $draft)[0];
        $document = $draft->getFieldValue($f->field->handle)->toArray();
        $document['content'][0]['attrs']['fieldSlots'][$f->placementUid] = [
            'entries' => [(string)$row->id => ['type' => $f->rowType->handle, 'fields' => [$f->text->handle => "Draft $index"]]],
            'sortOrder' => [(string)$row->id],
        ];
        $jobs[] = [
            'ownerId' => $draft->id, 'siteId' => $draft->siteId, 'fieldId' => $f->field->id,
            'typeUid' => $f->blockType->uid, 'blockUid' => $uid, 'document' => $document,
        ];
    }
    $results = runMatrixWorkers($jobs);
    expect(array_column($results, 'error'))->toBe([], json_encode($results));
    foreach ($drafts as $index => $draft) {
        expect($f->rows($uid, $draft)[0]->getFieldValue($f->text->handle))->toBe("Draft $index");
    }
    expect($f->rows($uid)[0]->id)->toBe($original->id);
    expect($f->rows($uid)[0]->getFieldValue($f->text->handle))->toBe('Published');
});

it('permits a whole-save retry after simultaneous ordinary first Matrix writes', function(bool $localMutex) {
    $f = new MatrixSupportFixture();
    $uid = StringHelper::UUID();
    Craft::$app->getProjectConfig()->flush();
    $jobs = [];
    foreach (['First writer', 'Second writer'] as $label) {
        $jobs[] = [
            'ownerId' => $f->owner->id, 'siteId' => $f->owner->siteId,
            'fieldId' => $f->field->id, 'typeUid' => $f->blockType->uid, 'blockUid' => $uid,
            'localMutex' => $localMutex,
            'document' => ['type' => 'doc', 'attrs' => ['schemaVersion' => 2], 'content' => [$f->block($uid, $f->payload([$label]))]],
        ];
    }
    $results = runMatrixWorkers($jobs);
    // Craft starts a transaction before serializing the Vizy field. On MySQL,
    // its snapshot can predate another request's first anchor insert even with
    // a shared mutex. Retry the complete submitted document in a fresh request.
    foreach ($results as $index => $result) {
        if (!isset($result['error'])) continue;
        expect($result['error'])->toStartWith('yii\\db\\IntegrityException:');
        $retry = runMatrixWorkers([$jobs[$index]])[0];
        expect($retry)->not->toHaveKey('error');
        $results[$index] = $retry;
    }
    expect(array_unique(array_column($results, 'id')))->toHaveCount(1);
    $rows = $f->rows($uid);
    expect($rows)->toHaveCount(1);
    expect($rows[0]->getFieldValue($f->text->handle))->toBeIn(['First writer', 'Second writer']);
})->with(['shared database mutex' => false, 'separate host-local mutexes' => true]);

it('saves existing Matrix rows concurrently through ordinary Craft saves', function() {
    $f = new MatrixSupportFixture();
    $uid = StringHelper::UUID();
    $owner = $f->save([$f->block($uid, $f->payload(['Original']))]);
    $row = $f->rows($uid)[0];
    Craft::$app->getProjectConfig()->flush();
    $jobs = [];
    foreach (['First edit', 'Second edit'] as $label) {
        $document = $owner->getFieldValue($f->field->handle)->toArray();
        $document['content'][0]['attrs']['fieldSlots'][$f->placementUid] = [
            'entries' => [(string)$row->id => ['type' => $f->rowType->handle, 'fields' => [$f->text->handle => $label]]],
            'sortOrder' => [(string)$row->id],
        ];
        $jobs[] = ['ownerId' => $owner->id, 'siteId' => $owner->siteId, 'fieldId' => $f->field->id,
            'typeUid' => $f->blockType->uid, 'blockUid' => $uid, 'document' => $document];
    }
    $results = runMatrixWorkers($jobs);
    expect(array_column($results, 'error'))->toBe([], json_encode($results));
    expect(array_unique(array_column($results, 'id')))->toHaveCount(1);
    $rows = $f->rows($uid);
    expect($rows)->toHaveCount(1);
    expect($rows[0]->id)->toBe($row->id);
    expect($rows[0]->getFieldValue($f->text->handle))->toBeIn(['First edit', 'Second edit']);
});
