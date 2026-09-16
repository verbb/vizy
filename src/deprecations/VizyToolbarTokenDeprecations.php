<?php
namespace verbb\vizy\deprecations;

use Craft;

/**
 * Vizy 3 toolbar / dropdown member IDs → Vizy 4 canonical vocabulary.
 *
 * Compatibility shim only: normalize rewrites, Deprecator encourages file authors
 * to update. Removed in Vizy 5 once call sites and `config/vizy/*.json` have moved on.
 */
final class VizyToolbarTokenDeprecations
{
    // Static Methods
    // =========================================================================

    /**
     * Rewrite one stored ID to the Vizy 4 vocabulary. Unknown IDs pass through.
     */
    public static function canonicalize(string $id, ?string $context = null): string
    {
        if ($id === '' || !isset(self::TOKEN_ALIASES[$id])) {
            return $id;
        }

        $canonical = self::TOKEN_ALIASES[$id];
        self::_warn($id, $canonical, $context);

        return $canonical;
    }

    public static function canonicalizeList(array $ids, ?string $context = null): array
    {
        $out = [];
        foreach ($ids as $id) {
            if (!is_string($id) || $id === '') {
                continue;
            }
            $canonical = self::canonicalize($id, $context);
            if ($canonical === '' || in_array($canonical, $out, true)) {
                continue;
            }
            $out[] = $canonical;
        }

        return $out;
    }

    private static function _warn(string $legacy, string $canonical, ?string $context): void
    {
        $key = $legacy . ':' . ($context ?? '');
        if (isset(self::$warned[$key])) {
            return;
        }
        self::$warned[$key] = true;

        $where = $context !== null && $context !== ''
            ? " in {$context}"
            : '';
        Craft::$app->getDeprecator()->log(
            "verbb\\vizy\\toolbar\\{$legacy}",
            "Vizy toolbar ID “{$legacy}”{$where} is deprecated; use “{$canonical}”. "
            . 'Update config/vizy JSON and Project Config Editor Configs. Removed in Vizy 5.',
        );
    }


    // Constants
    // =========================================================================

    /**
     * Button / member IDs used in Vizy 3 tip-tap configs and kebab-case spellings.
     */
    public const TOKEN_ALIASES = [
        'h1' => 'heading1',
        'h2' => 'heading2',
        'h3' => 'heading3',
        'h4' => 'heading4',
        'h5' => 'heading5',
        'h6' => 'heading6',
        'p' => 'paragraph',
        'align-left' => 'alignLeft',
        'align-center' => 'alignCenter',
        'align-right' => 'alignRight',
        'align-justify' => 'alignJustify',
        // Vizy 3 / TipTap button stems that differ from canonical node names.
        'bullet-list' => 'bulletList',
        'bulleted-list' => 'bulletList',
        'unordered-list' => 'bulletList',
        'ordered-list' => 'orderedList',
        'numbered-list' => 'orderedList',
        'code-block' => 'codeBlock',
        'horizontal-rule' => 'horizontalRule',
        'hr' => 'horizontalRule',
        'hard-break' => 'hardBreak',
        'strikethrough' => 'strike',
        'media-embed' => 'mediaEmbed',
        'clear-formatting' => 'clearFormatting',
        'insert-table' => 'table',
    ];


    // Properties
    // =========================================================================

    private static array $warned = [];
}
