<?php
namespace verbb\vizy\models;

use Craft;

final class BlockSummaryTexts
{
    // Static Methods
    // =========================================================================

    public static function missingBlockTypeTitle(): string
    {
        return Craft::t('vizy', self::MISSING_BLOCK_TYPE_TITLE);
    }

    public static function boundTitle(?string $value, string $fallback): string
    {
        $text = self::_boundText($value, self::TITLE_LIMIT);
        return $text !== '' ? $text : $fallback;
    }

    public static function boundSubtitle(?string $value): ?string
    {
        $text = self::_boundText($value, self::SUBTITLE_LIMIT);
        return $text !== '' ? $text : null;
    }

    private static function _boundText(?string $value, int $limit): string
    {
        if (!is_string($value)) {
            return '';
        }
        $normalized = trim(preg_replace('/\s+/u', ' ', $value) ?? '');
        if ($normalized === '') {
            return '';
        }
        if (mb_strlen($normalized) <= $limit) {
            return $normalized;
        }
        return rtrim(mb_substr($normalized, 0, max(0, $limit - 1))) . '…';
    }


    // Constants
    // =========================================================================

    public const MISSING_BLOCK_TYPE_TITLE = 'Missing Block Type';
    private const TITLE_LIMIT = 120;
    private const SUBTITLE_LIMIT = 200;
}
