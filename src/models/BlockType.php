<?php
namespace verbb\vizy\models;

use verbb\vizy\elements\Block;

use Craft;
use craft\base\Model;
use craft\helpers\StringHelper;
use craft\models\FieldLayout;

final class BlockType extends Model
{
    // Static Methods
    // =========================================================================

    public static function displayName(): string
    {
        return Craft::t('vizy', 'Vizy Block');
    }

    public static function lowerDisplayName(): string
    {
        return StringHelper::toLowerCase(static::displayName());
    }

    public static function pluralDisplayName(): string
    {
        return Craft::t('vizy', 'Vizy Blocks');
    }

    public static function pluralLowerDisplayName(): string
    {
        return StringHelper::toLowerCase(static::pluralDisplayName());
    }

    public static function refHandle(): ?string
    {
        return null;
    }

    public static function fieldLayouts(?string $source): array
    {
        return Craft::$app->getFields()->getLayoutsByType(Block::class);
    }

    public static function defaultCardAttributes(): array
    {
        return [];
    }

    /**
     * Keys are read explicitly rather than splatted into the constructor, so this
     * is the exact inverse of `toConfig()`.
     *
     * Project Config is written by whichever version of Vizy last saved it, so it
     * can legitimately hold keys this model no longer owns — e.g. a top-level
     * `contentAreas` map from before Content Areas became layout elements, then
     * retired entirely. Splatting those through `Model::__construct()` reaches
     * Yii's magic setter and throws on any property that is read-only.
     * Enumerating means unknown keys are simply ignored.
     */
    public static function fromConfig(string $uid, array $config): self
    {
        $blockType = new self();
        $blockType->uid = $uid;
        $blockType->name = is_string($config['name'] ?? null) ? $config['name'] : '';
        $blockType->handle = is_string($config['handle'] ?? null) ? $config['handle'] : '';
        $blockType->icon = $config['icon'] ?? null;
        $blockType->template = is_string($config['template'] ?? null) ? $config['template'] : null;
        $blockType->previewImage = self::normalizePreviewImage($config['previewImage'] ?? null);
        $blockType->color = self::normalizeColor($config['color'] ?? null);
        $blockType->summary = is_array($config['summary'] ?? null) ? $config['summary'] : null;
        // Legacy Project Config may still carry `representation`; ignore it.

        $layoutConfig = $config['fieldLayout'] ?? null;

        if (is_array($layoutConfig)) {
            $layoutConfig['type'] = Block::class;
            $blockType->setFieldLayout(FieldLayout::createFromConfig($layoutConfig));
        }

        return $blockType;
    }

    /**
     * Portable relative path under the preview-images folder. Empty / path-traversal
     * values become null so Project Config stays clean (missing files are OK).
     */
    public static function normalizePreviewImage(mixed $value): ?string
    {
        if (!is_string($value)) {
            return null;
        }
        $value = str_replace('\\', '/', trim($value));
        $value = ltrim($value, '/');
        if ($value === '' || str_contains($value, '..')) {
            return null;
        }
        if (!preg_match('/^[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)?$/', $value)) {
            return null;
        }

        return $value;
    }

    /**
     * Accepts `#rgb` / `#rrggbb` (case-insensitive) and normalises to lowercase
     * `#rrggbb`. Empty / invalid values become null so Project Config stays clean.
     */
    public static function normalizeColor(mixed $value): ?string
    {
        if (!is_string($value)) {
            return null;
        }

        $value = trim($value);
        if ($value === '' || $value === '__blank__') {
            return null;
        }

        if (preg_match('/^#([0-9a-f]{3})$/i', $value, $match)) {
            $hex = strtolower($match[1]);

            return '#' . $hex[0] . $hex[0] . $hex[1] . $hex[1] . $hex[2] . $hex[2];
        }

        if (preg_match('/^#([0-9a-f]{6})$/i', $value)) {
            return strtolower($value);
        }

        return null;
    }


    // Properties
    // =========================================================================

    public ?int $id = null;
    public ?string $uid = null;
    public string $name = '';
    public string $handle = '';
    public mixed $icon = null;
    public ?string $template = null;
    /**
     * Relative path under the plugin preview-images folder (e.g. `hero.png` or
     * `marketing/hero.webp`). Not a Craft asset ID — portable across environments.
     */
    public ?string $previewImage = null;
    public ?string $color = null;
    public ?array $summary = null;

    private ?FieldLayout $_fieldLayout = null;


    // Public Methods
    // =========================================================================

    public function getFieldLayout(): ?FieldLayout
    {
        if ($this->_fieldLayout !== null) {
            return $this->_fieldLayout;
        }

        return $this->_fieldLayout;
    }

    public function setFieldLayout(FieldLayout $fieldLayout): void
    {
        $this->_fieldLayout = $fieldLayout;
    }

    public function toConfig(): array
    {
        $layout = $this->getFieldLayout();
        $layoutConfig = $layout?->getConfig() ?? [];
        if ($layout) {
            $layoutConfig = ['uid' => $layout->uid, 'type' => Block::class] + $layoutConfig;
        }

        return [
            'name' => $this->name,
            'handle' => $this->handle,
            'icon' => $this->icon,
            'template' => $this->template,
            'previewImage' => $this->previewImage,
            'color' => $this->color,
            'summary' => $this->summary,
            'fieldLayout' => $layoutConfig,
        ];
    }


    // Protected Methods
    // =========================================================================

    protected function defineRules(): array
    {
        return [
            [['uid', 'name', 'handle'], 'required'],
            [['uid'], 'match', 'pattern' => '/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i'],
            [['handle'], 'match', 'pattern' => '/^[a-zA-Z][a-zA-Z0-9_]*$/'],
            [['color'], function(): void {
                if ($this->color === null) {
                    return;
                }
                if (!preg_match('/^#[0-9a-f]{6}$/', $this->color)) {
                    $this->addError('color', Craft::t('vizy', 'Color must be a hex value like #3b82f6.'));
                }
            }],
            // Hung off `uid` because Yii only runs inline rules for real
            // attributes, and the FieldLayout is getter-backed. Errors are still
            // reported against `fieldLayout`, which is what the settings screen surfaces.
            [['uid'], function(): void {
                $layout = $this->getFieldLayout();
                if (!$layout || $layout->type !== Block::class || !$layout->uid) {
                    $this->addError('fieldLayout', 'Block Types require UID-addressed elements\\Block FieldLayout.');
                }
            }],
        ];
    }
}
