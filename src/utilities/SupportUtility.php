<?php
namespace verbb\vizy\utilities;

use Craft;
use craft\base\Utility;

/**
 * The customer-facing home of support reports. Craft gives every utility its
 * own `utility:vizy-support` permission, which administrators pass automatically.
 */
final class SupportUtility extends Utility
{
    // Static Methods
    // =========================================================================

    public static function displayName(): string
    {
        return Craft::t('vizy', 'Vizy Support');
    }

    public static function id(): string
    {
        return 'vizy-support';
    }

    public static function icon(): ?string
    {
        return '@verbb/vizy/icon-mask.svg';
    }

    public static function contentHtml(): string
    {
        return Craft::$app->getView()->renderTemplate('vizy/diagnostics/_support');
    }
}
