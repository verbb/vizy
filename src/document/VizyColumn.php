<?php
namespace verbb\vizy\document;

/**
 * Lazy read wrapper for canonical column nodes.
 */
final class VizyColumn
{
    // Public Methods
    // =========================================================================

    public function __construct(
        private VizyLayout $layout,
        private string $uid,
        private int $span,
        private VizyContent $content,
    ) {
    }

    public function layout(): VizyLayout
    {
        return $this->layout;
    }

    public function uid(): string
    {
        return $this->uid;
    }

    public function span(): int
    {
        return $this->span;
    }

    public function content(): VizyContent
    {
        return $this->content;
    }

    public function toArray(): array
    {
        return [
            'type' => 'column',
            'attrs' => ['columnUid' => $this->uid, 'span' => $this->span],
            'content' => $this->content->toArray()['content'] ?? [],
        ];
    }
}
