<?php
namespace verbb\vizy\deprecations;

use verbb\vizy\Vizy;
use verbb\vizy\events\ModifyNodeTagEvent;
use verbb\vizy\events\ModifyRenderedNodeEvent;
use verbb\vizy\helpers\Nodes;

use Craft;
use craft\helpers\Html;
use craft\helpers\Template;

use Twig\Markup;

/**
 * Instance HTML APIs from the retired NodeCollection hydrator.
 *
 * Document HTML uses {@see \verbb\vizy\services\Renderer} + type statics.
 * These methods log and still attempt a best-effort instance render so old
 * call sites don’t fatal during Vizy 4. Removed in Vizy 5.
 */
trait VizyNodeInstanceHtmlDeprecations
{
    // Public Methods
    // =========================================================================

    /**
     * @deprecated Use VizyDocument::render() / type statics. Removed in Vizy 5.
     */
    public function renderNode(array $config = []): ?string
    {
        $this->_warnNodeInstanceHtml(
            'renderNode',
            'Node::renderNode() is deprecated. Use VizyDocument::render() (class-static HTML). It will be removed in Vizy 5.',
        );

        Craft::configure($this, $config);

        $renderedNode = Vizy::$plugin->getNodes()->renderNode($this);

        $event = new ModifyRenderedNodeEvent([
            'renderedNode' => $renderedNode,
            'node' => $this,
            'typeId' => static::id(),
        ]);

        $this->trigger(self::EVENT_MODIFY_RENDERED_NODE, $event);

        return $event->renderedNode;
    }

    /**
     * @deprecated Use VizyDocument::render(). Removed in Vizy 5.
     */
    public function renderHtml(array $config = []): ?Markup
    {
        $this->_warnNodeInstanceHtml(
            'renderHtml',
            'Node::renderHtml() is deprecated. Use VizyDocument::render(). It will be removed in Vizy 5.',
        );

        return Template::raw((string)$this->renderNode($config));
    }

    /**
     * @deprecated Use VizyDocument::render(). Removed in Vizy 5.
     */
    public function renderStaticHtml(): ?Markup
    {
        $this->_warnNodeInstanceHtml(
            'renderStaticHtml',
            'Node::renderStaticHtml() is deprecated. Use VizyDocument::render(). It will be removed in Vizy 5.',
        );

        return $this->renderHtml();
    }

    /**
     * @deprecated Class-level EVENT_MODIFY_TAG / TypeHtml. Removed in Vizy 5.
     */
    public function renderOpeningTag(): ?string
    {
        $this->_warnNodeInstanceHtml(
            'renderOpeningTag',
            'Node::renderOpeningTag() is deprecated. Use class-level modify events / VizyDocument::render(). It will be removed in Vizy 5.',
        );

        $tag = $this->getTag();

        $event = new ModifyNodeTagEvent([
            'tag' => $tag,
            'node' => $this,
            'attrs' => $this->attrs,
            'typeId' => static::id(),
            'opening' => true,
        ]);

        $this->trigger(self::EVENT_MODIFY_TAG, $event);

        return Nodes::renderOpeningTag($event->tag);
    }

    /**
     * @deprecated Class-level EVENT_MODIFY_TAG / TypeHtml. Removed in Vizy 5.
     */
    public function renderClosingTag(): ?string
    {
        $this->_warnNodeInstanceHtml(
            'renderClosingTag',
            'Node::renderClosingTag() is deprecated. Use class-level modify events / VizyDocument::render(). It will be removed in Vizy 5.',
        );

        $tag = $this->getTag();

        $event = new ModifyNodeTagEvent([
            'tag' => $tag,
            'node' => $this,
            'attrs' => $this->attrs,
            'typeId' => static::id(),
            'closing' => true,
        ]);

        $this->trigger(self::EVENT_MODIFY_TAG, $event);

        return Nodes::renderClosingTag($event->tag);
    }

    /**
     * @deprecated Use tag() / tagForAttrs() statics. Removed in Vizy 5.
     */
    public function getTag(): array
    {
        $tagName = $this->tagName ?? static::tag();
        if ($tagName === null || $tagName === '') {
            return [];
        }

        return [
            [
                'tag' => $tagName,
                'attrs' => $this->attrs,
            ],
        ];
    }

    public function selfClosing(): bool
    {
        return static::isSelfClosing();
    }

    public function renderText(): string
    {
        return Html::encode((string)$this->text);
    }


    // Private Methods
    // =========================================================================

    private function _warnNodeInstanceHtml(string $method, string $message): void
    {
        Craft::$app->getDeprecator()->log('verbb\\vizy\\base\\Node::' . $method, $message);
    }
}
