<?php
namespace verbb\vizy\services;

use verbb\vizy\Vizy;

use Craft;
use craft\base\Component;
use craft\helpers\ArrayHelper;
use craft\helpers\FileHelper;
use craft\helpers\Json;
use craft\helpers\StringHelper;

class Icons extends Component
{
    // Properties
    // =========================================================================

    private $_icons = null;
    private $_defaultIconSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-6 400H54c-3.3 0-6-2.7-6-6V86c0-3.3 2.7-6 6-6h340c3.3 0 6 2.7 6 6v340c0 3.3-2.7 6-6 6z"/></svg>';


    // Public Methods
    // =========================================================================

    public function getCustomIcons()
    {
        $iconsPath = Vizy::$plugin->getSettings()->getIconsPath();

        if (!is_dir($iconsPath)) {
            return [];
        }

        $files = [];
        $folderFiles = [];

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

    public function getFontAwesomeIcons()
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

    public function getAvailableIconSets()
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


    // Private Methods
    // =========================================================================

    private function _getFiles($path, $options)
    {
        $iconsPath = Vizy::$plugin->getSettings()->getIconsPath();

        if (!is_dir($iconsPath)) {
            return [];
        }

        $files = FileHelper::findFiles($path, $options);

        // Sort alphabetically
        uasort($files, function($a, $b) {
            return strcmp(basename($a), basename($b));
        });

        return $files;
    }

    private function _getIconModel($filepath)
    {
        $filename = pathinfo($filepath, PATHINFO_FILENAME);

        return [
            'label' => $this->_getTitleString($filename),
            'value' => $filename,
            'svg' => file_get_contents($filepath),
        ];
    }

    private function _getTitleString($string)
    {
        $string = str_replace(['-', '_'], [' ', ' '], $string);

        return StringHelper::titleizeForHumans($string);
    }

}
