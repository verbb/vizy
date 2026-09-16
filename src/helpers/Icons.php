<?php
namespace verbb\vizy\helpers;

use verbb\vizy\Vizy;
use verbb\vizy\web\assets\iconpicker\IconPickerAsset;

use Craft;
use craft\helpers\Html;
use craft\helpers\Json;
use craft\helpers\UrlHelper;

class Icons
{
    // Static Methods
    // =========================================================================

    /**
     * Block Type icon picker — `pk-image-browser` (mode=icon) behind a light-DOM
     * hidden input so Craft slideout jQuery serialize posts the value.
     *
     * Catalog loads from `vizy/icons/index`. Server-resolved SVG/label keep the
     * closed trigger accurate before the FA payload arrives. Grid names use PK’s
     * default `label-mode=tooltip` (shared `pk-tooltip`).
     */
    public static function pickerHtml(string $name, mixed $value, array $config = []): string
    {
        Craft::$app->getView()->registerAssetBundle(IconPickerAsset::class);

        $value = is_string($value) ? $value : '';
        $icon = $value !== '' ? Vizy::$plugin->getIcons()->getIconForValue($value) : null;
        $svg = is_array($icon) ? ($icon['svg'] ?? null) : null;
        $label = is_array($icon) && is_string($icon['label'] ?? null) ? $icon['label'] : null;

        return Html::tag('vizy-image-browser', '', [
            'name' => $name,
            'value' => $value,
            'mode' => 'icon',
            'label-mode' => 'tooltip',
            'placeholder' => Craft::t('vizy', 'Choose an icon'),
            'search-placeholder' => Craft::t('vizy', 'Search icons'),
            'empty-message' => Craft::t('vizy', 'No icons match your query.'),
            'aria-label' => Craft::t('vizy', 'Icon'),
            'data' => [
                'catalog-url' => UrlHelper::actionUrl('vizy/icons/index'),
                'selected-label' => $label,
                'selected-preview' => $svg,
            ],
            'id' => $config['id'] ?? null,
        ]);
    }

    /**
     * Block Type preview-image picker — same bridge, mode=image, filesystem
     * catalog under the plugin preview-images path (not Craft assets).
     */
    public static function previewImagePickerHtml(string $name, mixed $value, array $config = []): string
    {
        Craft::$app->getView()->registerAssetBundle(IconPickerAsset::class);

        $value = is_string($value) ? ($value !== '' ? $value : '') : '';
        $normalized = $value !== ''
            ? Vizy::$plugin->getBlockPreviewImages()->normalizeValue($value)
            : null;
        $value = $normalized ?? '';
        $url = $value !== ''
            ? Vizy::$plugin->getBlockPreviewImages()->resolveUrl($value)
            : null;
        $groups = Vizy::$plugin->getBlockPreviewImages()->getBrowserGroups();

        return Html::tag('vizy-image-browser', '', [
            'name' => $name,
            'value' => $value,
            'mode' => 'image',
            'label-mode' => 'tooltip',
            'placeholder' => Craft::t('vizy', 'Choose a preview image'),
            'search-placeholder' => Craft::t('vizy', 'Search images'),
            'empty-message' => Craft::t('vizy', 'No images match your query.'),
            'aria-label' => Craft::t('vizy', 'Preview Image'),
            'data' => [
                // Preview folders are small — embed so the panel opens without a round-trip.
                'catalog' => Json::encode($groups),
                'selected-label' => $value !== '' ? $value : null,
                'selected-preview' => $url,
            ],
            'id' => $config['id'] ?? null,
        ]);
    }

    /**
     * Renders Plugin Kit's colour input behind a light-DOM hidden field and
     * registers the icon-picker bundle (which defines `vizy-color-input`).
     *
     * Craft slideouts jQuery-serialize the form and miss form-associated
     * `pk-color-input` values; the bridge posts like `vizy-image-browser`.
     */
    public static function colorInputHtml(string $name, ?string $value, array $config = []): string
    {
        Craft::$app->getView()->registerAssetBundle(IconPickerAsset::class);

        return Html::tag('vizy-color-input', '', [
            'name' => $name,
            'value' => $value ?? '',
            'id' => $config['id'] ?? null,
            'aria-label' => $config['ariaLabel'] ?? Craft::t('app', 'Color'),
        ]);
    }
}
