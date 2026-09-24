<?php
namespace verbb\vizy\services;

use verbb\vizy\document\VizyDocument;

use craft\base\Component;
use craft\helpers\Json;

/**
 * Bounded plain-text projection for presentation surfaces that must not render Twig.
 */
final class ContentText extends Component
{
    // Constants
    // =========================================================================

    private const CACHE_LIMIT = 256;
    private const DOCUMENT_DEPTH_LIMIT = 8;


    // Properties
    // =========================================================================

    private array $_cache = [];
    private int $_projectionCount = 0;


    // Public Methods
    // =========================================================================

    public function project(VizyDocument|array $document, int $limit): ?string
    {
        if ($limit < 1) {
            return null;
        }

        $data = $document instanceof VizyDocument ? $document->toArray() : $document;
        $nodes = is_array($data['content'] ?? null) ? $data['content'] : [];
        $cacheKey = $limit . ':' . hash('sha256', Json::encode($nodes));
        if (array_key_exists($cacheKey, $this->_cache)) {
            return $this->_cache[$cacheKey];
        }

        $parts = [];
        $length = 0;
        $this->_collect($nodes, $parts, $length, $limit, 0);
        $text = trim(implode(' ', $parts));
        if ($text === '') {
            return $this->_remember($cacheKey, null);
        }

        if (mb_strlen($text) > $limit) {
            $text = rtrim(mb_substr($text, 0, max(0, $limit - 1))) . '…';
        }

        return $this->_remember($cacheKey, $text);
    }

    public function projectionCount(): int
    {
        return $this->_projectionCount;
    }

    public function reset(): void
    {
        $this->_cache = [];
        $this->_projectionCount = 0;
    }


    // Private Methods
    // =========================================================================

    private function _collect(array $nodes, array &$parts, int &$length, int $limit, int $depth): void
    {
        if ($depth > self::DOCUMENT_DEPTH_LIMIT || $length > $limit) {
            return;
        }

        foreach ($nodes as $node) {
            if (!is_array($node) || in_array($node['type'] ?? null, ['image', 'vizyBlock'], true)) {
                continue;
            }

            if (($node['type'] ?? null) === 'text' && is_string($node['text'] ?? null)) {
                $text = trim(preg_replace('/\s+/u', ' ', $node['text']) ?? '');
                if ($text !== '') {
                    $parts[] = $text;
                    $length += mb_strlen($text) + 1;
                }
            }

            if ($length > $limit) {
                return;
            }

            if (is_array($node['content'] ?? null)) {
                $this->_collect($node['content'], $parts, $length, $limit, $depth + 1);
            }

            if ($length > $limit) {
                return;
            }
        }
    }

    private function _remember(string $key, ?string $text): ?string
    {
        // Card grids can be large, but a long-lived process must not retain an
        // unbounded set of content revisions after their request has finished.
        if (count($this->_cache) >= self::CACHE_LIMIT) {
            array_shift($this->_cache);
        }

        $this->_projectionCount++;
        $this->_cache[$key] = $text;

        return $text;
    }
}
