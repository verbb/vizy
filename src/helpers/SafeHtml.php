<?php
namespace verbb\vizy\helpers;

use Craft;
use craft\helpers\HtmlPurifier;

use HTMLPurifier_AttrDef_URI;
use HTMLPurifier_Config;
use HTMLPurifier_Context;

/**
 * Library-backed HTML/URI hardening for render + GraphQL URL convenience.
 *
 * Prefer Craft HtmlPurifier / HTMLPurifier URI AttrDef over hand-rolled scheme
 * checks. Whole-document field Purifier on normalize stays out of scope — this
 * is emit-time only for untrusted fragments and URL attributes.
 */
final class SafeHtml
{
    // Static Methods
    // =========================================================================

    /**
     * Purify migrated / third-party embed HTML (oEmbed payloads).
     *
     * Uses HTMLPurifier SafeIframe so only configured provider iframe srcs
     * survive; scripts and event handlers are stripped by the library. Built
     * with HTMLPurifier directly (not Yii `process()`) so SafeIframe /
     * HTML.Allowed can be set before Craft’s HTML definition configure step.
     */
    public static function purifyEmbedHtml(string $html): string
    {
        $config = HTMLPurifier_Config::createDefault();
        $config->autoFinalize = false;

        // SafeIframe regexp is HTMLPurifier’s own knob (same family as Craft
        // CKEditor embeds) — not a Vizy-invented URL parser. Default element
        // vocabulary is enough; scripts/event handlers are stripped by the library.
        $config->set('HTML.SafeIframe', true);
        $config->set(
            'URI.SafeIframeRegexp',
            '%^(https?:)?//(www\.youtube(?:-nocookie)?\.com/embed/|player\.vimeo\.com/video/)%',
        );
        $config->set('Attr.AllowedFrameTargets', ['_blank']);
        $config->set('Cache.SerializerPath', Craft::$app->getRuntimePath());
        $config->set('Cache.SerializerPermissions', 0775);

        HtmlPurifier::configure($config);

        return (new \HTMLPurifier($config))->purify($html);
    }

    /**
     * Validate and normalize a URI via HTMLPurifier’s AttrDef_URI (AllowedSchemes).
     */
    public static function sanitizeUri(string $uri, array $schemes = self::LINK_SCHEMES): ?string
    {
        $trimmed = trim($uri);
        if ($trimmed === '') {
            return null;
        }

        $config = HTMLPurifier_Config::createDefault();
        $config->autoFinalize = false;
        $allowed = [];
        foreach ($schemes as $scheme) {
            $allowed[strtolower($scheme)] = true;
        }
        $config->set('URI.AllowedSchemes', $allowed);

        $def = new HTMLPurifier_AttrDef_URI();
        $context = new HTMLPurifier_Context();
        $result = $def->validate($trimmed, $config, $context);

        if ($result === false || $result === null || $result === '') {
            return null;
        }

        return (string)$result;
    }

    /**
     * Whether `$name` is safe to pass as an Html helper attribute key.
     *
     * Yii encodes attribute *values*, not names. Names with spaces, quotes, or
     * `=` can break out of attribute syntax into executable handlers even when
     * ordinary `onclick` keys are blacklisted.
     */
    public static function isSafeEmitAttrName(string $name): bool
    {
        if ($name === '') {
            return false;
        }

        // HTML/XML Name-ish tokens only — no whitespace, quotes, or delimiters.
        if (preg_match('/^[a-zA-Z_][\w.\-:]*$/', $name) !== 1) {
            return false;
        }

        // Event handlers + iframe/document injection surfaces.
        if (preg_match('/^on/i', $name) === 1 || strcasecmp($name, 'srcdoc') === 0) {
            return false;
        }

        return true;
    }

    /**
     * Strip attrs that must never reach Html::beginTag / Html::tag on emit.
     *
     * Craft encodes attribute *values*; malformed or event-handler *names*
     * still execute. URI attrs stay the caller's job via `sanitizeUri()` —
     * this only drops unsafe names and non-scalars. Lossless storage is
     * separate from safe emission.
     */
    public static function filterEmitAttrs(array $attrs): array
    {
        $out = [];
        foreach ($attrs as $key => $value) {
            if (!is_string($key) || !self::isSafeEmitAttrName($key)) {
                continue;
            }

            if (is_bool($value) || is_int($value) || is_float($value)) {
                $out[$key] = $value;
                continue;
            }

            if (is_string($value)) {
                $out[$key] = $value;
            }
        }

        return $out;
    }


    // Constants
    // =========================================================================

    /** Default schemes for `<a href>` (semantic url/email/tel/sms + http(s)). */
    public const LINK_SCHEMES = ['http', 'https', 'mailto', 'tel', 'sms'];

    /** Schemes allowed on iframe/img src and similar resource URLs. */
    public const RESOURCE_SCHEMES = ['http', 'https'];
}
