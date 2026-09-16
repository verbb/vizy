<?php

declare(strict_types=1);

namespace Tests\Support\Fixtures;

use Craft;
use craft\elements\Asset;
use craft\elements\User;
use craft\fields\Assets as AssetsField;
use craft\fs\Local;
use craft\helpers\FileHelper;
use craft\helpers\StringHelper;
use craft\models\Volume;
use RuntimeException;

/**
 * Spike-only Asset/Volume fixtures for foundation proofs.
 * Not part of Vizy production API.
 */
class AssetSpikeFixture
{
    private static ?AssetsField $assetsField = null;

    private static ?Volume $volume = null;

    private static ?string $fsHandle = null;

    private static ?string $volumeRoot = null;

    public static function ensureAdminUser(): User
    {
        $user = User::find()->admin()->one();

        if ($user) {
            Craft::$app->getUser()->setIdentity($user);

            return $user;
        }

        $user = new User([
            'username' => 'vizyspikeadmin',
            'email' => 'vizyspikeadmin@example.com',
            'admin' => true,
        ]);
        $user->newPassword = 'Password1!';

        if (!Craft::$app->getElements()->saveElement($user)) {
            throw new RuntimeException('Failed creating spike admin: ' . json_encode($user->getErrors()));
        }

        Craft::$app->getUser()->setIdentity($user);

        return $user;
    }

    public static function volume(): Volume
    {
        if (self::$volume) {
            return self::$volume;
        }

        $suffix = StringHelper::randomString(6);
        $fsHandle = 'vizySpikeFs' . $suffix;
        $volumeHandle = 'vizySpikeVol' . $suffix;
        // Craft forbids Local FS inside system dirs (storage/vendor/config/project root).
        // Keep spike volumes outside the plugin checkout.
        $root = sys_get_temp_dir() . '/vizy-spike-volumes/' . $volumeHandle;
        FileHelper::createDirectory($root);

        $fs = new Local([
            'name' => 'Vizy Spike FS ' . $suffix,
            'handle' => $fsHandle,
            'path' => $root,
            'hasUrls' => false,
        ]);

        if (!Craft::$app->getFs()->saveFilesystem($fs)) {
            throw new RuntimeException('Failed saving spike filesystem: ' . json_encode($fs->getErrors()));
        }

        $volume = new Volume([
            'name' => 'Vizy Spike Volume ' . $suffix,
            'handle' => $volumeHandle,
            'fsHandle' => $fsHandle,
        ]);

        if (!Craft::$app->getVolumes()->saveVolume($volume)) {
            throw new RuntimeException('Failed saving spike volume: ' . json_encode($volume->getErrors()));
        }

        self::$fsHandle = $fsHandle;
        self::$volumeRoot = $root;
        self::$volume = Craft::$app->getVolumes()->getVolumeByHandle($volumeHandle);

        if (!self::$volume) {
            throw new RuntimeException('Spike volume could not be reloaded.');
        }

        return self::$volume;
    }

    public static function assetsField(string $subpath = ''): AssetsField
    {
        if (self::$assetsField && $subpath === '') {
            return self::$assetsField;
        }

        $volume = self::volume();
        $handle = 'imagesSpike' . StringHelper::randomString(6);

        $field = new AssetsField([
            'name' => 'Images Spike',
            'handle' => $handle,
            'defaultUploadLocationSource' => 'volume:' . $volume->uid,
            'defaultUploadLocationSubpath' => $subpath,
            'restrictFiles' => false,
        ]);

        if (!Craft::$app->getFields()->saveField($field)) {
            throw new RuntimeException('Failed saving Assets field: ' . json_encode($field->getErrors()));
        }

        /** @var AssetsField $saved */
        $saved = Craft::$app->getFields()->getFieldByHandle($handle);

        if (!$saved instanceof AssetsField) {
            throw new RuntimeException('Assets field could not be reloaded.');
        }

        if ($subpath === '') {
            self::$assetsField = $saved;
        }

        return $saved;
    }

    public static function createTempAsset(string $filename = 'spike.txt', string $contents = 'vizy-spike'): Asset
    {
        self::ensureAdminUser();

        $uniqueName = StringHelper::randomString(8) . '-' . $filename;
        $tempFolder = Craft::$app->getAssets()->getUserTemporaryUploadFolder();
        $tempPath = Craft::$app->getPath()->getTempPath() . '/' . $uniqueName;
        FileHelper::writeToFile($tempPath, $contents);

        $asset = new Asset();
        $asset->tempFilePath = $tempPath;
        $asset->filename = $uniqueName;
        $asset->newFolderId = $tempFolder->id;
        $asset->setScenario(Asset::SCENARIO_CREATE);

        if (!Craft::$app->getElements()->saveElement($asset)) {
            throw new RuntimeException('Failed creating temp asset: ' . json_encode($asset->getErrors()));
        }

        $reloaded = Craft::$app->getAssets()->getAssetById($asset->id);

        if (!$reloaded) {
            throw new RuntimeException('Temp asset could not be reloaded.');
        }

        return $reloaded;
    }

    public static function isTempAsset(Asset $asset): bool
    {
        return Craft::$app->getAssets()->createTempAssetQuery()
            ->id($asset->id)
            ->exists();
    }

    public static function volumeRoot(): ?string
    {
        return self::$volumeRoot;
    }
}
