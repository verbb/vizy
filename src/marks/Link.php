<?php
namespace verbb\vizy\marks;

use verbb\vizy\Vizy;
use verbb\vizy\base\Mark;
use verbb\vizy\base\RenderContext;
use verbb\vizy\helpers\SafeHtml;

use Craft;
use craft\base\ElementInterface;
use craft\elements\Asset;
use craft\elements\Category;
use craft\elements\Entry;
use craft\helpers\ArrayHelper;

class Link extends Mark
{
    // Static Methods
    // =========================================================================

    public static function label(): string
    {
        return 'Link';
    }

    public static function icon(): ?string
    {
        return 'link';
    }

    public static function tag(): string|array|null
    {
        return 'a';
    }

    /**
     * Omit the anchor when href was rejected / unresolved — keep inner text only.
     */
    public static function tagForAttrs(array $attrs): string|array|null
    {
        $href = $attrs['href'] ?? null;
        if (!is_string($href) || $href === '') {
            return null;
        }

        return parent::tagForAttrs($attrs);
    }

    public static function resolveAttrs(array $attrs, RenderContext $ctx): array
    {
        $newWindow = (bool)($attrs['newWindow'] ?? false);
        $href = self::resolveHref($attrs, $ctx->siteId, $ctx);

        // Authoring-only / semantic keys must never become HTML attributes.
        foreach ([
            'type', 'value', 'targetUid', 'siteMode', 'siteUid', 'suffix',
            'newWindow', 'url', 'linkClass',
        ] as $key) {
            ArrayHelper::remove($attrs, $key);
        }

        if ($href === null) {
            ArrayHelper::remove($attrs, 'href');
            ArrayHelper::remove($attrs, 'target');
            ArrayHelper::remove($attrs, 'rel');

            return $attrs;
        }

        $attrs['href'] = $href;

        if ($newWindow || ($attrs['target'] ?? null) === '_blank') {
            $attrs['target'] = '_blank';
            $attrs['rel'] = 'noopener noreferrer';
        }

        return $attrs;
    }

    /**
     * Site for element URL resolution: fixed siteUid when siteMode is fixed.
     */
    public static function resolveSiteId(array $attrs, ?int $fallbackSiteId = null): ?int
    {
        if (($attrs['siteMode'] ?? 'current') === 'fixed') {
            $siteUid = $attrs['siteUid'] ?? null;
            if (is_string($siteUid) && $siteUid !== '') {
                $site = Craft::$app->getSites()->getSiteByUid($siteUid);
                if ($site) {
                    return (int)$site->id;
                }
            }
        }

        return $fallbackSiteId;
    }

    /**
     * Resolve a safe href from semantic attrs or legacy href (ref tags).
     *
     * URL validation is HTMLPurifier AttrDef_URI — not a hand-rolled scheme check.
     */
    public static function resolveHref(array $attrs, ?int $siteId = null, ?RenderContext $ctx = null): ?string
    {
        $siteId = self::resolveSiteId($attrs, $siteId);
        $candidate = null;

        $legacyHref = $attrs['href'] ?? null;
        if (is_string($legacyHref) && $legacyHref !== '') {
            $candidate = Vizy::$plugin->getRefTags()->parse($legacyHref, $siteId);
        }

        if ($candidate === null || $candidate === '') {
            $kind = $attrs['type'] ?? null;
            $value = $attrs['value'] ?? null;
            $targetUid = $attrs['targetUid'] ?? null;

            if (in_array($kind, ['url', 'email', 'tel', 'sms'], true) && is_string($value) && $value !== '') {
                $candidate = match ($kind) {
                    'email' => str_starts_with(strtolower($value), 'mailto:') ? $value : 'mailto:' . $value,
                    'tel' => str_starts_with(strtolower($value), 'tel:') ? $value : 'tel:' . $value,
                    'sms' => str_starts_with(strtolower($value), 'sms:') ? $value : 'sms:' . $value,
                    default => $value,
                };
            } elseif (is_string($targetUid) && $targetUid !== '') {
                $elementType = match ($kind) {
                    'entry' => Entry::class,
                    'asset' => Asset::class,
                    'category' => Category::class,
                    default => null,
                };
                if ($elementType !== null) {
                    $element = $ctx !== null
                        ? $ctx->elementByUid($targetUid, $elementType, $siteId)
                        : Craft::$app->getElements()->getElementByUid($targetUid, $elementType, $siteId);
                    $url = $element?->getUrl();
                    if (is_string($url) && $url !== '') {
                        $suffix = $attrs['suffix'] ?? null;
                        $candidate = is_string($suffix) && $suffix !== '' ? $url . $suffix : $url;
                    }
                }
            }
        }

        if (!is_string($candidate) || $candidate === '') {
            return null;
        }

        return SafeHtml::sanitizeUri($candidate, SafeHtml::LINK_SCHEMES);
    }


    // Properties
    // =========================================================================

    public static ?string $type = 'link';
    public mixed $tagName = 'a';

    private ?string $_originalHref = null;


    // Public Methods
    // =========================================================================

    public function init(): void
    {
        parent::init();

        // Preserve authoring href for getLinkElement() (ref tags before resolveAttrs).
        $this->_originalHref = $this->attrs['href'] ?? '';
    }

    /**
     * @deprecated Prefer GraphQL / document link resolution. Removed in Vizy 5.
     */
    public function getLinkElement(): ?ElementInterface
    {
        // Deemed an element link if contains `#asset:694@1` or a ref
        $href = $this->_originalHref ?? ($this->attrs['href'] ?? '');

        preg_match('/([^\'"\?#]*)(\?[^\'"\?#]+)?(#[^\'"\?#]+)?(?:#|%23)([\w]+)\:(\d+)(?:@(\d+))?(\:(?:transform\:)?' . \craft\validators\HandleValidator::$handlePattern . ')?/', $href, $matches);

        [, $url, $query, $hash, $elementType, $ref, $siteId, $transform] = array_pad($matches, 10, null);

        if (!$elementType) {
            return null;
        }

        $elementType = Craft::$app->getElements()->getElementTypeByRefHandle($elementType);

        return Craft::$app->getElements()->getElementById($ref, $elementType, $siteId);
    }
}
