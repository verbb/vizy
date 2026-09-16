<?php
namespace Tests\Support\Types;

use verbb\vizy\base\Mark;

/** Unlisted vizy/core module — must not become installed. */
class FakeCoreMark extends Mark
{
    public static ?string $type = 'fakeCore';

    public static function moduleId(): string
    {
        return 'vizy/core/mark/notBundled';
    }

    public static function tag(): string|array|null
    {
        return 'span';
    }
}
