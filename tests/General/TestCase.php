<?php

declare(strict_types=1);

namespace Tests\General;

use Craft;
use PHPUnit\Framework\TestCase as BaseTestCase;
use RuntimeException;

abstract class TestCase extends BaseTestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        $this->ensureCraftBootstrapped();
        Craft::$app->getSites()->refreshSites();
        Craft::$app->getIsMultiSite(true, true);
        Craft::$app->getSites()->setCurrentSite(Craft::$app->getSites()->getPrimarySite());
    }

    protected function tearDown(): void
    {
        if (class_exists(Craft::class) && Craft::$app?->getIsInstalled()) {
            Craft::$app->getGql()->setActiveSchema(null);
            \Tests\Support\WebControllerHarness::endWebRequest();
        }

        parent::tearDown();
    }

    protected function ensureCraftBootstrapped(): void
    {
        if (!class_exists(Craft::class) || !Craft::$app) {
            throw new RuntimeException('Craft application must be bootstrapped before running integration tests.');
        }
    }
}
