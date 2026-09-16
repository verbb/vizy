<?php
namespace verbb\vizy\deprecations;

use verbb\vizy\events\ModifyMarkTagEvent;
use verbb\vizy\helpers\Nodes;

use Craft;

/**
 * Instance mark HTML APIs from the retired NodeCollection hydrator.
 *
 * Document HTML uses Renderer + Mark statics. Removed in Vizy 5.
 */
trait VizyMarkInstanceHtmlDeprecations
{
    // Public Methods
    // =========================================================================

    /**
     * @deprecated Use tag() static + class-level EVENT_MODIFY_TAG. Removed in Vizy 5.
     */
    public function getTag(): array
    {
        $tagName = $this->tagName ?? static::tag();

        return [
            [
                'tag' => $tagName,
                'attrs' => array_filter($this->attrs),
            ],
        ];
    }

    /**
     * @deprecated Class-level EVENT_MODIFY_TAG / TypeHtml. Removed in Vizy 5.
     */
    public function renderOpeningTag(): ?string
    {
        $this->_warnMarkInstanceHtml(
            'renderOpeningTag',
            'Mark::renderOpeningTag() is deprecated. Use VizyDocument::render() / class-level modify events. It will be removed in Vizy 5.',
        );

        $tag = $this->getTag();

        $event = new ModifyMarkTagEvent([
            'tag' => $tag,
            'mark' => $this,
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
        $this->_warnMarkInstanceHtml(
            'renderClosingTag',
            'Mark::renderClosingTag() is deprecated. Use VizyDocument::render() / class-level modify events. It will be removed in Vizy 5.',
        );

        $tag = $this->getTag();

        $event = new ModifyMarkTagEvent([
            'tag' => $tag,
            'mark' => $this,
            'attrs' => $this->attrs,
            'typeId' => static::id(),
            'closing' => true,
        ]);

        $this->trigger(self::EVENT_MODIFY_TAG, $event);

        return Nodes::renderClosingTag($event->tag);
    }


    // Private Methods
    // =========================================================================

    private function _warnMarkInstanceHtml(string $method, string $message): void
    {
        Craft::$app->getDeprecator()->log('verbb\\vizy\\base\\Mark::' . $method, $message);
    }
}
