<?php
namespace verbb\vizy\helpers;

use craft\helpers\Json;

use RuntimeException;

/**
 * Reads a built Vite manifest for CP asset bundles.
 *
 * The reason this exists rather than each bundle reading its own entry: an entry's
 * `css` key lists only the stylesheets belonging to that entry's own modules. Any
 * CSS reached through a *shared* chunk is listed against the chunk instead, and
 * registering the entry alone silently drops it. That is not a corner case — Plugin
 * Kit's design tokens and popup styles land in the shared chunk as soon as two
 * bundles use a Plugin Kit component, so the components render with every
 * `--pk-*` custom property unresolved: the tooltip came out as dark text on its own
 * dark background with square corners. Nothing errors, so it only shows up by eye.
 */
class ViteManifest
{
    // Static Methods
    // =========================================================================

    /** The script and every stylesheet an entry needs, imported chunks included. */
    public static function assets(string $manifestPath, string $entryKey): array
    {
        if (!is_file($manifestPath)) {
            throw new RuntimeException("The built Vizy asset manifest is missing: $manifestPath");
        }

        $manifest = Json::decode(file_get_contents($manifestPath));

        if (!is_array($manifest) || !is_array($manifest[$entryKey] ?? null)) {
            throw new RuntimeException("The built Vizy asset manifest is missing its entry for $entryKey.");
        }

        $entry = $manifest[$entryKey];

        if (!is_string($entry['file'] ?? null) || $entry['file'] === '') {
            throw new RuntimeException("The built Vizy asset manifest entry for $entryKey has no script.");
        }

        return [
            'js' => $entry['file'],
            'css' => self::_collectCss($manifest, $entryKey),
        ];
    }

    /**
     * Walks `imports` depth-first, gathering each chunk's `css`.
     *
     * Imported chunks are emitted before the importer's own stylesheets, so a
     * bundle's styles can override the library styles it builds on. `$seen` guards
     * against the shared chunks appearing on more than one path, and against a
     * cycle: chunk graphs are not guaranteed to be acyclic.
     */
    private static function _collectCss(array $manifest, string $key, array &$seen = []): array
    {
        if (isset($seen[$key]) || !is_array($manifest[$key] ?? null)) {
            return [];
        }

        $seen[$key] = true;
        $chunk = $manifest[$key];
        $files = [];

        foreach ($chunk['imports'] ?? [] as $import) {
            if (is_string($import)) {
                $files = [...$files, ...self::_collectCss($manifest, $import, $seen)];
            }
        }

        foreach ($chunk['css'] ?? [] as $file) {
            if (is_string($file) && $file !== '') {
                $files[] = $file;
            }
        }

        return array_values(array_unique($files));
    }
}
