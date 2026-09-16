<?php
namespace verbb\vizy\document;

/**
 * Validates semantic attrs for link/image/table nodes during canonical parse.
 */
final class SemanticNodeValidator
{
    // Constants
    // =========================================================================

    private const LINK_TYPES = ['entry', 'asset', 'category', 'url', 'email', 'tel', 'sms', 'unknown'];
    private const SITE_MODES = ['current', 'fixed'];
    private const ALT_MODES = ['asset', 'custom', 'decorative', 'missing'];
    private const IMAGE_SIZES = ['default', 'small', 'medium', 'large', 'full'];


    // Public Methods
    // =========================================================================

    public function validateNodeType(string $type, array $node, string $path): void
    {
        match ($type) {
            'image' => $this->_validateImage($node, $path),
            'iframe' => $this->_validateIframe($node, $path),
            'mediaEmbed' => $this->_validateMediaEmbed($node, $path),
            'table' => $this->_validateTable($node, $path),
            default => null,
        };
    }

    public function validateLinkMark(array $mark, string $path): void
    {
        $attrs = $mark['attrs'] ?? [];
        if (!is_array($attrs)) {
            throw new InvalidDocumentException("Link mark at {$path} requires object attrs.");
        }
        $type = $attrs['type'] ?? null;
        if (!is_string($type) || !in_array($type, self::LINK_TYPES, true)) {
            throw new InvalidDocumentException("Link mark at {$path} requires a supported attrs.type.");
        }
        if (isset($attrs['href'])) {
            throw new InvalidDocumentException("Link mark at {$path} must not persist href.");
        }
        $siteMode = $attrs['siteMode'] ?? 'current';
        if (!is_string($siteMode) || !in_array($siteMode, self::SITE_MODES, true)) {
            throw new InvalidDocumentException("Link mark at {$path} has invalid siteMode.");
        }
        if ($siteMode === 'fixed' && !is_string($attrs['siteUid'] ?? null)) {
            throw new InvalidDocumentException("Fixed-site links at {$path} require siteUid.");
        }
        if (in_array($type, ['entry', 'asset', 'category'], true) && !is_string($attrs['targetUid'] ?? null)) {
            throw new InvalidDocumentException("Internal link at {$path} requires targetUid.");
        }
        if ($type === 'url' && !is_string($attrs['value'] ?? null)) {
            throw new InvalidDocumentException("URL link at {$path} requires value.");
        }
        if (isset($attrs['suffix']) && !is_string($attrs['suffix'])) {
            throw new InvalidDocumentException("Link suffix at {$path} must be a string.");
        }
        if (isset($attrs['newWindow']) && !is_bool($attrs['newWindow'])) {
            throw new InvalidDocumentException("Link newWindow at {$path} must be boolean.");
        }
    }


    // Private Methods
    // =========================================================================

    private function _validateImage(array $node, string $path): void
    {
        $attrs = $node['attrs'] ?? [];
        if (!is_array($attrs)) {
            throw new InvalidDocumentException("Image at {$path} requires object attrs.");
        }
        if (isset($attrs['src'])) {
            throw new InvalidDocumentException("Image at {$path} must not persist src.");
        }
        if (!is_string($attrs['assetUid'] ?? null) || !$this->_isUuid($attrs['assetUid'])) {
            throw new InvalidDocumentException("Image at {$path} requires assetUid.");
        }
        $siteMode = $attrs['siteMode'] ?? 'current';
        if (!is_string($siteMode) || !in_array($siteMode, self::SITE_MODES, true)) {
            throw new InvalidDocumentException("Image at {$path} has invalid siteMode.");
        }
        $altMode = $attrs['altMode'] ?? 'asset';
        if (!is_string($altMode) || !in_array($altMode, self::ALT_MODES, true)) {
            throw new InvalidDocumentException("Image at {$path} has invalid altMode.");
        }
        $size = $attrs['size'] ?? 'default';
        if (!is_string($size) || !in_array($size, self::IMAGE_SIZES, true)) {
            throw new InvalidDocumentException("Image at {$path} has invalid size.");
        }
    }

    private function _validateIframe(array $node, string $path): void
    {
        $attrs = $node['attrs'] ?? [];
        if (!is_array($attrs)) {
            throw new InvalidDocumentException("Iframe at {$path} requires object attrs.");
        }
        $url = $attrs['url'] ?? $attrs['src'] ?? null;
        if (!is_string($url) || $url === '') {
            throw new InvalidDocumentException("Iframe at {$path} requires url.");
        }
        if (!preg_match('#^https?://#i', $url)) {
            throw new InvalidDocumentException("Iframe at {$path} requires an http(s) URL.");
        }
    }

    private function _validateMediaEmbed(array $node, string $path): void
    {
        $attrs = $node['attrs'] ?? [];
        if (!is_array($attrs)) {
            throw new InvalidDocumentException("Media embed at {$path} requires object attrs.");
        }
        $url = $attrs['url'] ?? null;
        if (!is_string($url) || $url === '') {
            throw new InvalidDocumentException("Media embed at {$path} requires url.");
        }
        if (!preg_match('#^https?://#i', $url)) {
            throw new InvalidDocumentException("Media embed at {$path} requires an http(s) URL.");
        }
        if (isset($attrs['data']) && $attrs['data'] !== null && !is_array($attrs['data'])) {
            throw new InvalidDocumentException("Media embed data at {$path} must be an object or null.");
        }
    }

    private function _validateTable(array $node, string $path): void
    {
        $attrs = $node['attrs'] ?? [];
        $widths = $attrs['columnWidths'] ?? null;
        if ($widths === null) {
            return;
        }
        if (!is_array($widths) || !array_is_list($widths)) {
            throw new InvalidDocumentException("Table at {$path} columnWidths must be a list.");
        }
        $total = 0;
        foreach ($widths as $index => $weight) {
            if (!is_int($weight) || $weight < 1) {
                throw new InvalidDocumentException("Table at {$path} columnWidths.{$index} must be a positive integer.");
            }
            $total += $weight;
        }
        if ($total !== 1000) {
            throw new InvalidDocumentException("Table at {$path} columnWidths must total 1000.");
        }
    }

    private function _isUuid(string $value): bool
    {
        return (bool)preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i', $value);
    }
}
