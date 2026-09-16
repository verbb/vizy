<?php
namespace verbb\vizy\web\twig;

use verbb\vizy\helpers\Fields;

use craft\models\FieldLayout;

use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

/**
 * CP Twig helpers that must run during namespaced slideout renders.
 */
final class VizyCpExtension extends AbstractExtension
{
    // Public Methods
    // =========================================================================

    public function getFunctions(): array
    {
        return [
            new TwigFunction('vizyFieldLayoutDesigner', [$this, 'fieldLayoutDesignerHtml'], ['is_safe' => ['html']]),
        ];
    }

    public function fieldLayoutDesignerHtml(FieldLayout $fieldLayout, array $config = []): string
    {
        return Fields::fieldLayoutDesignerHtml($fieldLayout, $config);
    }
}
