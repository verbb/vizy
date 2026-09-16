<?php
namespace verbb\vizy\gql;

use verbb\vizy\Vizy;
use verbb\vizy\helpers\SafeHtml;
use verbb\vizy\marks\Link;

use craft\base\ElementInterface;
use craft\elements\Asset;
use craft\elements\Category;
use craft\elements\Entry;

/**
 * GraphQL resolver source for one TipTap mark.
 */
final class GqlMark
{
    // Static Methods
    // =========================================================================

    public static function fromRaw(array $mark): self
    {
        return new self($mark);
    }


    // Properties
    // =========================================================================

    private array $_mark;


    // Public Methods
    // =========================================================================

    public function mark(): array
    {
        return $this->_mark;
    }

    public function type(): string
    {
        return (string)($this->_mark['type'] ?? '');
    }

    public function attrs(): array
    {
        return is_array($this->_mark['attrs'] ?? null) ? $this->_mark['attrs'] : [];
    }

    public function isUnknown(): bool
    {
        $type = $this->type();
        if ($type === '') {
            return true;
        }

        return Vizy::$plugin->getExtensions()->getDefinition('mark', $type) === null;
    }

    public function linkElement(?int $siteId = null): ?ElementInterface
    {
        if ($this->type() !== 'link') {
            return null;
        }

        $attrs = $this->attrs();
        $targetUid = $attrs['targetUid'] ?? null;
        if (!is_string($targetUid) || $targetUid === '') {
            return null;
        }

        $elementType = match ($attrs['type'] ?? null) {
            'entry' => Entry::class,
            'asset' => Asset::class,
            'category' => Category::class,
            default => null,
        };

        if ($elementType === null) {
            return null;
        }

        // GraphQL convenience — schema scope, not bare getElementByUid.
        return GqlElementAccess::elementByUid($targetUid, $elementType, Link::resolveSiteId($attrs, $siteId));
    }

    public function linkUrl(?int $siteId = null): ?string
    {
        if ($this->type() !== 'link') {
            return null;
        }

        $attrs = $this->attrs();
        $kind = $attrs['type'] ?? null;

        // Element-backed links: only emit URL when schema may see the element.
        if (in_array($kind, ['entry', 'asset', 'category'], true)) {
            $element = $this->linkElement($siteId);
            if ($element === null) {
                return null;
            }
            $url = $element->getUrl();
            if (!is_string($url) || $url === '') {
                return null;
            }
            $suffix = $attrs['suffix'] ?? null;
            $candidate = is_string($suffix) && $suffix !== '' ? $url . $suffix : $url;

            return SafeHtml::sanitizeUri($candidate, SafeHtml::LINK_SCHEMES);
        }

        // Scalar url/email/tel/sms — same HTMLPurifier path as Twig (no element disclosure).
        return Link::resolveHref($attrs, $siteId);
    }


    // Private Methods
    // =========================================================================

    private function __construct(array $mark)
    {
        $this->_mark = $mark;
    }
}
