<?php
namespace verbb\vizy\nodes;

use verbb\vizy\base\EditorGroup;
use verbb\vizy\base\EditorSurface;
use verbb\vizy\base\Node;
use verbb\vizy\base\RenderContext;

use craft\helpers\ArrayHelper;

class Heading extends Node
{
    // Static Methods
    // =========================================================================

    public static function label(): string
    {
        return 'Heading';
    }

    public static function icon(): ?string
    {
        return 'heading';
    }

    public static function group(): ?string
    {
        return EditorGroup::Headings;
    }

    public static function surfaces(): array
    {
        // Capability token; level buttons (heading1…6) are separate toolbar controls.
        return [EditorSurface::Toolbar];
    }

    public static function tag(): string|array|null
    {
        return null;
    }

    public static function tagForAttrs(array $attrs): string|array|null
    {
        $level = (int)($attrs['level'] ?? 2);
        $level = max(1, min(6, $level));

        return "h{$level}";
    }

    public static function resolveAttrs(array $attrs, RenderContext $ctx): array
    {
        $align = ArrayHelper::remove($attrs, 'textAlign');

        if ($align && $align !== 'start') {
            $attrs['class'] = trim(($attrs['class'] ?? '') . ' text-' . $align);
        }

        // Keep `level` for tagForAttrs (TypeHtml resolves attrs first). Stripped in
        // modifyTagStructure so it never becomes an HTML attribute.
        return $attrs;
    }

    public static function modifyTagStructure(string|array|null $tag, array $attrs, RenderContext $ctx, bool $opening): array
    {
        unset($attrs['level']);

        return parent::modifyTagStructure($tag, $attrs, $ctx, $opening);
    }


    // Properties
    // =========================================================================

    public static ?string $type = 'heading';

}
