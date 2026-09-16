<?php
namespace verbb\vizy\services;

use verbb\vizy\Vizy;
use verbb\vizy\models\Settings;

use Craft;
use craft\base\Component;
use craft\helpers\ArrayHelper;
use craft\helpers\FileHelper;
use craft\helpers\Json;
use craft\helpers\StringHelper;

class Icons extends Component
{
    // Constants
    // =========================================================================

    public const BLOCK_TYPE_FALLBACK_ICON = 'vizy-block-fallback';


    // Properties
    // =========================================================================

    private ?array $_icons = null;
    private string $_defaultIconSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-6 400H54c-3.3 0-6-2.7-6-6V86c0-3.3 2.7-6 6-6h340c3.3 0 6 2.7 6 6v340c0 3.3-2.7 6-6 6z"/></svg>';


    // Public Methods
    // =========================================================================

    public function getCustomIcons(): array
    {
                $settings = Vizy::$plugin->getSettings();
        $iconsPath = $settings->getIconsPath();

        if (!is_dir($iconsPath)) {
            return [];
        }

        $files = [];

        // We use folder names as the group, so don't go recursive
        $rootFiles = $this->_getFiles($iconsPath, [
            'only' => ['*.svg'],
            'recursive' => false,
        ]);

        if ($rootFiles) {
            $groupName = Craft::t('vizy', 'Custom Icons');

            $icons = [];

            foreach ($rootFiles as $rootFile) {
                $icons[] = $this->_getIconModel($rootFile);
            }

            if ($icons) {
                $files[] = [
                    'name' => $groupName,
                    'icons' => $icons,
                ];
            }
        }

        $folders = FileHelper::findDirectories($iconsPath, [
            'recursive' => false,
        ]);

        foreach ($folders as $folder) {
            $path = trim(str_replace($iconsPath, '', $folder), '/');
            $groupName = $this->_getTitleString($path);

            $folderFiles = $this->_getFiles($folder, [
                'only' => ['*.svg'],
                'recursive' => false,
            ]);

            $icons = [];

            foreach ($folderFiles as $folderFile) {
                $icons[] = $this->_getIconModel($folderFile);
            }

            if ($icons) {
                $files[] = [
                    'name' => $groupName,
                    'icons' => $icons,
                ];
            }
        }

        return $files;
    }

    public function getFontAwesomeIcons(): array
    {
        $iconPath = __DIR__ . '/../inc/font-awesome.json';
        $allFontAwesomeIcons = Json::decode(file_get_contents($iconPath));
        $icons = [];

        foreach ($allFontAwesomeIcons as $key => $fontAwesomeIcons) {
            $groupName = Craft::t('vizy', 'Font Awesome - {group}', ['group' => $key]);

            $icons[] = [
                'name' => $groupName,
                'icons' => $fontAwesomeIcons,
            ];
        }

        return $icons;
    }

    public function getAvailableIconSets(): array
    {
        if ($this->_icons !== null) {
            return $this->_icons;
        }

        $fontAwesomeIcons = $this->getFontAwesomeIcons();
        $customIcons = $this->getCustomIcons();

        $icons = array_merge($fontAwesomeIcons, $customIcons);
        $icons = array_values($icons);

        return $this->_icons = $icons;
    }

    public function getIconForValue($value)
    {
        $iconGroups = $this->getAvailableIconSets();

        foreach ($iconGroups as $iconGroup) {
            $foundIcon = ArrayHelper::firstWhere($iconGroup['icons'], 'value', $value);

            if ($foundIcon) {
                return $foundIcon;
            }
        }

        return null;
    }

    public function getSvgForValue($value, $returnDefault = false)
    {
        if ($foundIcon = $this->getIconForValue($value)) {
            return $foundIcon['svg'];
        }

        if ($returnDefault) {
            return $this->_defaultIconSvg;
        }

        return null;
    }

    /**
     * SVG for a configured Block Type icon only. The fallback is rendered client-side
     * via `<pk-icon icon="vizy-block-fallback">`.
     */
    public function blockTypeIconSvg(mixed $icon): ?string
    {
        $value = is_string($icon) ? trim($icon) : '';
        if ($value === '') {
            return null;
        }

        return $this->getSvgForValue($value);
    }

    public function blockTypeInsertionIcon(mixed $icon, ?string $color = null): array
    {
        $value = is_string($icon) ? trim($icon) : '';
        if ($value !== '') {
            $svg = $this->getSvgForValue($value);
            if ($svg !== null) {
                return [
                    'name' => $value,
                    'svg' => $svg,
                    'color' => $color,
                ];
            }
        }

        return [
            'name' => self::BLOCK_TYPE_FALLBACK_ICON,
            'svg' => null,
            'color' => $color,
        ];
    }

    /**
     * Resolves many icon values in one indexed pass.
     *
     * `getSvgForValue()` scans every group linearly, which is fine for the one
     * icon a Block Type row needs but not for a whole toolbar: the catalog holds
     * ~2,000 icons, so twenty sequential lookups is twenty full scans. Callers
     * that need a set should ask once.
     */
    public function getSvgsForValues(array $values): array
    {
        $wanted = array_fill_keys(array_map('strval', $values), true);
        $found = [];

        foreach ($this->getAvailableIconSets() as $iconGroup) {
            foreach ($iconGroup['icons'] ?? [] as $icon) {
                $value = (string)($icon['value'] ?? '');
                // First group wins, matching `getIconForValue()`'s precedence.
                if ($value === '' || !isset($wanted[$value]) || isset($found[$value])) {
                    continue;
                }
                $found[$value] = (string)($icon['svg'] ?? '');
            }
        }

        return array_filter($found, static fn(string $svg): bool => $svg !== '');
    }


    // Private Methods
    // =========================================================================

    private function _getFiles(string $path, array $options): array
    {
                $settings = Vizy::$plugin->getSettings();

        if (!is_dir($settings->getIconsPath())) {
            return [];
        }

        $files = FileHelper::findFiles($path, $options);

        // Sort alphabetically
        uasort($files, function($a, $b) {
            return strcmp(basename($a), basename($b));
        });

        return $files;
    }

    private function _getIconModel(string $filepath): array
    {
        $filename = pathinfo($filepath, PATHINFO_FILENAME);

        return [
            'label' => $this->_getTitleString($filename),
            'value' => $filename,
            'svg' => file_get_contents($filepath),
        ];
    }

    private function _getTitleString(string $string): string
    {
        $string = str_replace(['-', '_'], [' ', ' '], $string);

        return StringHelper::titleizeForHumans($string);
    }
}
