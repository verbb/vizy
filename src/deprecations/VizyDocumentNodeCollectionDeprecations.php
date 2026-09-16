<?php
namespace verbb\vizy\deprecations;

use verbb\vizy\fields\VizyField;

use Craft;

use InvalidArgumentException;

use Twig\Markup;

trait VizyDocumentNodeCollectionDeprecations
{
    // Public Methods
    // =========================================================================

    public function getField(): ?VizyField
    {
        $this->_warn('getField', 'VizyDocument::getField() is deprecated. Use field(). It will be removed in Vizy 5.');
        return $this->field();
    }

    public function getRawNodes(): array
    {
        $this->_warn('getRawNodes', 'VizyDocument::getRawNodes() is deprecated. Use content()->toArray(). It will be removed in Vizy 5.');
        return $this->content()->toArray();
    }

    public function renderHtml(array $config = []): Markup
    {
        $this->_warn('renderHtml', 'VizyDocument::renderHtml() is deprecated. Use render(). It will be removed in Vizy 5.');
        $this->_assertLegacyRenderConfigIsEquivalent($config, 'renderHtml');
        return $this->render();
    }

    /**
     * Canonical rendering is already independent from editor form state.
     *
     * @deprecated Use render(). Removed in Vizy 5.
     */
    public function renderStaticHtml(array $config = []): Markup
    {
        $this->_warn('renderStaticHtml', 'VizyDocument::renderStaticHtml() is deprecated. Use render(). It will be removed in Vizy 5.');
        $this->_assertLegacyRenderConfigIsEquivalent($config, 'renderStaticHtml');
        return $this->render();
    }


    // Private Methods
    // =========================================================================

    private function _warn(string $method, string $message): void
    {
        Craft::$app->getDeprecator()->log("verbb\\vizy\\document\\VizyDocument::{$method}", $message);
    }

    private function _assertLegacyRenderConfigIsEquivalent(array $config, string $method): void
    {
        if ($config !== []) {
            throw new InvalidArgumentException(
                "VizyDocument::{$method}() cannot translate legacy render configuration. Use render() with the canonical renderer contract."
            );
        }
    }
}
