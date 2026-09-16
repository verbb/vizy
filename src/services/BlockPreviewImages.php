<?php
namespace verbb\vizy\services;

use verbb\vizy\Vizy;
use verbb\vizy\models\Settings;

use Craft;
use craft\base\Component;
use craft\helpers\FileHelper;
use craft\helpers\StringHelper;
use craft\helpers\UrlHelper;

/**
 * Filesystem preview images for Block Types — portable Project Config paths,
 * not Craft assets (dev/prod asset IDs diverge).
 *
 * Mirrors {@see Icons} custom-folder scanning: root + one-level subfolders.
 */
class BlockPreviewImages extends Component
{
    // Constants
    // =========================================================================

    private const EXTENSIONS = ['*.png', '*.jpg', '*.jpeg', '*.webp', '*.gif'];


    // Properties
    // =========================================================================

    private ?array $_catalog = null;


    // Public Methods
    // =========================================================================

    /**
     * Flat catalog for autosuggest / lookup.
     */
    public function getCatalog(): array
    {
        if ($this->_catalog !== null) {
            return $this->_catalog;
        }

        $root = $this->getRootPath();
        if ($root === '' || !is_dir($root)) {
            return $this->_catalog = [];
        }

        $items = [];

        foreach ($this->_filesIn($root) as $filepath) {
            $value = pathinfo($filepath, PATHINFO_BASENAME);
            $items[] = $this->_entry($value, $filepath);
        }

        foreach (FileHelper::findDirectories($root, ['recursive' => false]) as $folder) {
            $subdir = trim(str_replace($root, '', $folder), DIRECTORY_SEPARATOR);
            if ($subdir === '' || str_contains($subdir, '..')) {
                continue;
            }
            foreach ($this->_filesIn($folder) as $filepath) {
                $value = $subdir . '/' . pathinfo($filepath, PATHINFO_BASENAME);
                $items[] = $this->_entry($value, $filepath);
            }
        }

        usort($items, static fn(array $a, array $b): int => strcmp($a['value'], $b['value']));

        return $this->_catalog = $items;
    }

    /**
     * Craft autosuggestField groups (same shape as template suggestions).
     */
    public function getSuggestions(): array
    {
        $byGroup = [];
        foreach ($this->getCatalog() as $item) {
            $slash = strrpos($item['value'], '/');
            $group = $slash === false
                ? Craft::t('vizy', 'Preview Images')
                : $this->_titleize(substr($item['value'], 0, $slash));
            $byGroup[$group][] = ['name' => $item['value']];
        }

        $suggestions = [];
        foreach ($byGroup as $label => $data) {
            $suggestions[] = [
                'label' => $label,
                'data' => $data,
            ];
        }

        return $suggestions;
    }

    /**
     * `pk-image-browser` groups — `preview` is the CP stream URL for each file.
     *
     * Labels are the portable relative path (same as `value`), matching PK’s
     * image-filename pattern so the trigger/tooltip show `block.png` rather
     * than a titleized stem like “Block”.
     */
    public function getBrowserGroups(): array
    {
        $byGroup = [];
        foreach ($this->getCatalog() as $item) {
            $slash = strrpos($item['value'], '/');
            $group = $slash === false
                ? Craft::t('vizy', 'Preview Images')
                : $this->_titleize(substr($item['value'], 0, $slash));
            $byGroup[$group][] = [
                'label' => $item['value'],
                'value' => $item['value'],
                'preview' => $item['url'],
            ];
        }

        $groups = [];
        foreach ($byGroup as $name => $items) {
            $groups[] = [
                'name' => $name,
                'items' => $items,
            ];
        }

        return $groups;
    }

    public function resolveUrl(?string $value): ?string
    {
        $path = $this->resolveAbsolutePath($value);
        if ($path === null) {
            return null;
        }

        $mtime = @filemtime($path) ?: 0;

        return UrlHelper::actionUrl('vizy/block-previews/view', [
            'file' => $this->normalizeValue($value),
            'v' => $mtime,
        ]);
    }

    public function resolveAbsolutePath(?string $value): ?string
    {
        $relative = $this->normalizeValue($value);
        if ($relative === null) {
            return null;
        }

        $root = $this->getRootPath();
        if ($root === '' || !is_dir($root)) {
            return null;
        }

        $candidate = FileHelper::normalizePath($root . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $relative));
        $rootReal = realpath($root);
        $fileReal = realpath($candidate);
        if ($rootReal === false || $fileReal === false) {
            return null;
        }
        if (!str_starts_with($fileReal, $rootReal . DIRECTORY_SEPARATOR) && $fileReal !== $rootReal) {
            return null;
        }
        if (!is_file($fileReal)) {
            return null;
        }

        $ext = strtolower(pathinfo($fileReal, PATHINFO_EXTENSION));
        if (!in_array($ext, ['png', 'jpg', 'jpeg', 'webp', 'gif'], true)) {
            return null;
        }

        return $fileReal;
    }

    public function normalizeValue(mixed $value): ?string
    {
        if (!is_string($value)) {
            return null;
        }
        $value = str_replace('\\', '/', trim($value));
        $value = ltrim($value, '/');
        if ($value === '' || str_contains($value, '..') || str_starts_with($value, './')) {
            return null;
        }
        // Only root or one nested folder: `file.png` or `group/file.png`.
        if (!preg_match('/^[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)?$/', $value)) {
            return null;
        }

        return $value;
    }

    public function getRootPath(): string
    {
                $settings = Vizy::$plugin->getSettings();

        return $settings->getBlockPreviewImagesPath();
    }

    public function resetCache(): void
    {
        $this->_catalog = null;
    }


    // Private Methods
    // =========================================================================

    private function _filesIn(string $dir): array
    {
        try {
            return FileHelper::findFiles($dir, [
                'only' => self::EXTENSIONS,
                'recursive' => false,
            ]);
        } catch (\Throwable) {
            return [];
        }
    }

    private function _entry(string $value, string $filepath): array
    {
        $label = $this->_titleize(pathinfo($filepath, PATHINFO_FILENAME));

        return [
            'label' => $label,
            'value' => $value,
            'url' => UrlHelper::actionUrl('vizy/block-previews/view', [
                'file' => $value,
                'v' => @filemtime($filepath) ?: 0,
            ]),
        ];
    }

    private function _titleize(string $value): string
    {
        return StringHelper::titleize(str_replace(['-', '_'], ' ', $value));
    }
}
