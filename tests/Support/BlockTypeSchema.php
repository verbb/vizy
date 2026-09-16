<?php

declare(strict_types=1);

namespace Tests\Support;

use verbb\vizy\models\BlockType;

/**
 * Block Type test helpers.
 *
 * Content Area helpers were retired with Hosted Vizy as the sole nesting model.
 */
final class BlockTypeSchema
{
    /** @deprecated Content Areas removed — no-op kept so older call sites fail loudly later. */
    public static function setContentAreas(BlockType $blockType, mixed ...$areas): void
    {
        throw new \BadMethodCallException('Content Areas are retired; Hosted Vizy is the sole nesting model.');
    }

    /** @deprecated Content Areas removed. */
    public static function contentArea(string $uid, array $config = []): never
    {
        throw new \BadMethodCallException('Content Areas are retired; Hosted Vizy is the sole nesting model.');
    }
}
