<?php
namespace verbb\vizy\nodes;

use verbb\vizy\base\EditorGroup;
use verbb\vizy\base\Node;
use verbb\vizy\base\RenderContext;
use verbb\vizy\helpers\Nodes;
use verbb\vizy\helpers\SafeHtml;
use verbb\vizy\helpers\TypeHtml;
use verbb\vizy\marks\Link;

use Craft;
use craft\elements\Asset;
use craft\helpers\ArrayHelper;

class Image extends Node
{
    // Static Methods
    // =========================================================================

    public static function label(): string
    {
        return 'Image';
    }

    public static function icon(): ?string
    {
        return 'image';
    }

    public static function group(): ?string
    {
        return EditorGroup::Media;
    }

    public static function tag(): string|array|null
    {
        return 'img';
    }

    public static function isSelfClosing(): bool
    {
        return true;
    }

    public static function resolveAttrs(array $attrs, RenderContext $ctx): array
    {
        $siteId = Link::resolveSiteId($attrs, $ctx->siteId);
        $assetUid = $attrs['assetUid'] ?? null;
        $asset = null;

        if (is_string($assetUid) && $assetUid !== '') {
            $asset = $ctx->elementByUid(
                $assetUid,
                Asset::class,
                $siteId,
            );
            if (!$asset instanceof Asset) {
                $asset = null;
            }
        }

        // Transform is not part of the canonical authoring contract (preview-only
        // in the editor). Honor a persisted handle if present for legacy content.
        $transform = $attrs['transform'] ?? null;
        ArrayHelper::remove($attrs, 'transform');

        $src = $attrs['src'] ?? null;
        if ((!is_string($src) || $src === '') && $asset) {
            $transformArg = is_string($transform) && $transform !== '' ? $transform : null;
            $attrs['src'] = (string)($asset->getUrl($transformArg) ?: '');
        }

        $src = $attrs['src'] ?? '';
        if (is_string($src) && $src !== '') {
            $attrs['src'] = Nodes::parseRefTags($src, $siteId);
        }

        // Semantic size → output class (authoring size is not an HTML attribute).
        $size = $attrs['size'] ?? 'default';
        if (is_string($size) && $size !== '' && $size !== 'default') {
            $attrs['class'] = trim(($attrs['class'] ?? '') . ' vizy-image--' . $size);
        }

        // Alt modes: decorative keeps empty string; asset pulls Craft alt text.
        $altMode = $attrs['altMode'] ?? 'asset';
        if ($altMode === 'decorative') {
            $attrs['alt'] = '';
        } elseif ($altMode === 'asset' && $asset) {
            $assetAlt = $asset->alt;
            if (is_string($assetAlt)) {
                $attrs['alt'] = $assetAlt;
            }
        } elseif ($altMode === 'missing') {
            unset($attrs['alt']);
        }
        // custom: keep attrs.alt as authored

        return $attrs;
    }

    public static function renderOccurrenceHtml(string $children, array $resolvedAttrs, RenderContext $ctx): ?string
    {
        // Legacy V3 link fields + canonical attrs.link (semantic link object).
        $legacyUrl = $resolvedAttrs['url'] ?? null;
        $target = $resolvedAttrs['target'] ?? '';
        $linkClass = $resolvedAttrs['linkClass'] ?? '';
        $semanticLink = is_array($resolvedAttrs['link'] ?? null) ? $resolvedAttrs['link'] : null;

        // Img-only attrs — never emit link/asset/semantic authoring fields on <img>.
        $imgAttrs = $resolvedAttrs;
        unset(
            $imgAttrs['url'],
            $imgAttrs['target'],
            $imgAttrs['linkClass'],
            $imgAttrs['transform'],
            $imgAttrs['assetUid'],
            $imgAttrs['siteMode'],
            $imgAttrs['siteUid'],
            $imgAttrs['altMode'],
            $imgAttrs['size'],
            $imgAttrs['link'],
            $imgAttrs['decorative'],
            $imgAttrs['imageUid'],
        );

        // Drop non-string id that was only an element id.
        if (isset($imgAttrs['id']) && is_int($imgAttrs['id'])) {
            unset($imgAttrs['id']);
        }

        // Resource URL via HTMLPurifier AttrDef_URI (http/https only).
        $src = $imgAttrs['src'] ?? null;
        if (is_string($src) && $src !== '') {
            $safeSrc = SafeHtml::sanitizeUri($src, SafeHtml::RESOURCE_SCHEMES);
            if ($safeSrc === null) {
                unset($imgAttrs['src']);
            } else {
                $imgAttrs['src'] = $safeSrc;
            }
        }

        // Allowlist img attrs after authoring-key strip — no onerror / unknown leak.
        $allowed = ['src', 'alt', 'title', 'width', 'height', 'class', 'loading', 'decoding', 'sizes', 'srcset', 'id'];
        $imgAttrs = array_intersect_key(
            SafeHtml::filterEmitAttrs($imgAttrs),
            array_flip($allowed),
        );

        // Keep decorative alt="" — array_filter would drop empty strings.
        $emitAttrs = [];
        foreach ($imgAttrs as $key => $value) {
            if ($value === null) {
                continue;
            }
            if ($value === '' && $key !== 'alt') {
                continue;
            }
            $emitAttrs[$key] = $value;
        }

        // Tag-hook contract: custom emitters must still run modifyTagStructure.
        $opening = self::modifyTagStructure('img', $emitAttrs, $ctx, true);
        $imgHtml = Nodes::renderOpeningTag($opening) ?? '';

        $href = null;
        $markAttrs = [];
        if ($semanticLink !== null) {
            $href = Link::resolveHref($semanticLink, $ctx->siteId, $ctx);
            if ($href !== null) {
                $markAttrs = [
                    'href' => $href,
                    'newWindow' => (bool)($semanticLink['newWindow'] ?? false),
                    'class' => $semanticLink['class'] ?? '',
                    'title' => $semanticLink['title'] ?? null,
                ];
            }
        } elseif (is_string($legacyUrl) && $legacyUrl !== '') {
            $href = $legacyUrl;
            $markAttrs = [
                'href' => $legacyUrl,
                'target' => $target,
                'class' => $linkClass,
            ];
        }

        if ($href === null) {
            return $imgHtml;
        }

        return TypeHtml::renderMark(Link::class, $imgHtml, $markAttrs, $ctx);
    }


    // Properties
    // =========================================================================

    public static ?string $type = 'image';
    public mixed $tagName = 'img';


    // Public Methods
    // =========================================================================

    /**
     * Resolve the related Asset when attrs carry a numeric element id.
     *
     * @deprecated Prefer attrs.assetUid + Elements service. Removed in Vizy 5.
     */
    public function getAsset()
    {
        $id = $this->attrs['id'] ?? null;
        $siteId = $this->getElement()->siteId ?? null;

        if ($id) {
            return Craft::$app->getElements()->getElementById($id, Asset::class, $siteId);
        }

        return null;
    }
}
