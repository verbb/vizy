<?php
namespace verbb\vizy\marks;

use verbb\vizy\Vizy;
use verbb\vizy\base\Mark;
use verbb\vizy\base\RenderContext;
use verbb\vizy\events\RegisterLinkAttributesEvent;
use verbb\vizy\helpers\SafeHtml;

use Craft;
use craft\base\ElementInterface;
use craft\elements\Asset;
use craft\elements\Category;
use craft\elements\Entry;

use yii\base\Event;

use RuntimeException;

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
     * Registered boolean attributes are added to the Link schema and dialog.
     */
    public static function registeredAttributes(): array
    {
        $event = new RegisterLinkAttributesEvent();
        Event::trigger(static::class, self::EVENT_REGISTER_ATTRIBUTES, $event);
        $registered = [];

        foreach ($event->attributes as $index => $attribute) {
            if (!is_array($attribute)) {
                throw new RuntimeException("Link attribute at index {$index} must be an array.");
            }
            $name = $attribute['name'] ?? null;

            if (!is_string($name) || !preg_match('/^[A-Za-z][A-Za-z0-9]*$/', $name)) {
                throw new RuntimeException("Link attribute at index {$index} has an invalid name.");
            }

            if (in_array($name, self::CORE_ATTRIBUTES, true)) {
                throw new RuntimeException("Link attribute {$name} collides with a core attribute.");
            }

            if (isset($registered[$name])) {
                throw new RuntimeException("Duplicate Link attribute {$name}.");
            }
            $label = $attribute['label'] ?? null;

            if (!is_string($label) || trim($label) === '') {
                throw new RuntimeException("Link attribute {$name} must have a label.");
            }
            $label = trim($label);
            $type = $attribute['type'] ?? 'boolean';

            if ($type !== 'boolean') {
                throw new RuntimeException("Link attribute {$name} must use the boolean type.");
            }
            $default = $attribute['default'] ?? false;

            if (!is_bool($default)) {
                throw new RuntimeException("Link attribute {$name} default must be boolean.");
            }
            $htmlAttribute = $attribute['htmlAttribute'] ?? null;
            $htmlValue = $attribute['htmlValue'] ?? null;

            if ($htmlAttribute !== null) {
                if (!is_string($htmlAttribute) || !self::_isSupportedOutputAttribute($htmlAttribute)) {
                    throw new RuntimeException("Link attribute {$name} has an unsafe HTML attribute mapping.");
                }

                if (!is_string($htmlValue) || trim($htmlValue) === '' || preg_match('/[\x00-\x1F\x7F]/', $htmlValue)) {
                    throw new RuntimeException("Link attribute {$name} requires a safe non-empty HTML value.");
                }
                $htmlValue = trim($htmlValue);

                if (in_array($htmlAttribute, ['class', 'rel'], true)) {
                    foreach (preg_split('/\s+/', $htmlValue) ?: [] as $token) {
                        if (!preg_match('/^[A-Za-z0-9_.:-]+$/', $token)) {
                            throw new RuntimeException("Link attribute {$name} has an invalid {$htmlAttribute} token.");
                        }
                    }
                }
            } elseif ($htmlValue !== null) {
                throw new RuntimeException("Link attribute {$name} cannot define htmlValue without htmlAttribute.");
            }

            $registered[$name] = [
                'name' => $name,
                'label' => $label,
                'type' => 'boolean',
                'default' => $default,
                'htmlAttribute' => $htmlAttribute,
                'htmlValue' => $htmlValue,
            ];
        }

        return array_values($registered);
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

        // Build from an explicit output allowlist. Semantic storage, identity,
        // and registered options must never leak into HTML by key coincidence.
        $htmlAttrs = [];

        foreach (['title', 'class', 'id', 'download'] as $key) {
            $value = $attrs[$key] ?? null;

            if (is_string($value) || is_bool($value)) {
                $htmlAttrs[$key] = $value;
            }
        }

        if (is_string($attrs['ariaLabel'] ?? null) && $attrs['ariaLabel'] !== '') {
            $htmlAttrs['aria-label'] = $attrs['ariaLabel'];
        }
        $rel = self::_tokens($attrs['rel'] ?? []);

        foreach (self::registeredAttributes() as $attribute) {
            if (($attrs[$attribute['name']] ?? $attribute['default']) !== true) {
                continue;
            }
            $htmlAttribute = $attribute['htmlAttribute'];

            if (!is_string($htmlAttribute) || !is_string($attribute['htmlValue'])) {
                continue;
            }

            if ($htmlAttribute === 'rel') {
                $rel = [...$rel, ...self::_tokens($attribute['htmlValue'])];
            } elseif ($htmlAttribute === 'class') {
                $classes = self::_tokens($htmlAttrs['class'] ?? '');
                $htmlAttrs['class'] = implode(' ', array_values(array_unique([
                    ...$classes,
                    ...self::_tokens($attribute['htmlValue']),
                ])));
            } else {
                $htmlAttrs[$htmlAttribute] = $attribute['htmlValue'];
            }
        }

        if ($href === null) {
            return $htmlAttrs;
        }

        $htmlAttrs['href'] = $href;

        if ($newWindow || ($attrs['target'] ?? null) === '_blank') {
            $htmlAttrs['target'] = '_blank';
            $rel = array_values(array_filter($rel, static fn(string $token): bool => strtolower($token) !== 'opener'));
            $rel = [...$rel, 'noopener', 'noreferrer'];
        }

        if ($rel !== []) {
            $htmlAttrs['rel'] = implode(' ', array_values(array_unique($rel)));
        }

        return $htmlAttrs;
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
                    default => preg_match('/(?:#|%23)(?:entry|asset|category):\d+(?:@\d+)?$/', $value)
                        ? Vizy::$plugin->getRefTags()->parse($value, $siteId)
                        // Preserve old content while correcting the schemeless
                        // host form that browsers otherwise treat as relative.
                        : (preg_match('/^www\./i', $value) ? 'https://' . $value : $value),
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

    private static function _isSupportedOutputAttribute(string $name): bool
    {
        return in_array($name, ['class', 'rel'], true)
            || preg_match('/^data-[a-z][a-z0-9_.:-]*$/i', $name) === 1;
    }

    private static function _tokens(mixed $value): array
    {
        $values = is_array($value) ? $value : preg_split('/\s+/', (string)$value);

        return array_values(array_filter(array_map(
            static fn(mixed $token): string => is_string($token) ? trim($token) : '',
            $values ?: [],
        ), static fn(string $token): bool => $token !== ''));
    }


    // Constants
    // =========================================================================

    public const EVENT_REGISTER_ATTRIBUTES = 'registerAttributes';

    private const CORE_ATTRIBUTES = [
        'type', 'targetUid', 'siteMode', 'siteUid', 'value', 'suffix', 'newWindow',
        'title', 'ariaLabel', 'rel', 'class', 'id', 'download', 'linkUid',
        'href', 'target', 'url', 'linkClass',
    ];


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
