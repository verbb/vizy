<?php
namespace verbb\vizy\services;

use verbb\vizy\Vizy;
use verbb\vizy\base\MarkInterface;
use verbb\vizy\base\NodeInterface;
use verbb\vizy\base\RenderContext;
use verbb\vizy\document\VizyBlock;
use verbb\vizy\document\VizyContent;
use verbb\vizy\document\VizyDocument;
use verbb\vizy\helpers\TypeHtml;

use Craft;
use craft\base\Component;
use craft\helpers\Html;
use craft\helpers\Json;
use craft\helpers\Template;
use craft\web\View;

use Twig\Markup;

/**
 * Sole HTML boundary for VizyDocument::render().
 *
 * Dispatches through compiled type classes (statics) — no Craft::createObject
 * per mark/node occurrence on the default path.
 */
final class Renderer extends Component
{
    // Properties
    // =========================================================================

    private array $_templateAvailability = [];


    // Public Methods
    // =========================================================================

    public function renderDocument(VizyDocument $document, array $config = []): Markup
    {
        return $this->renderContent($document->content(), $config);
    }

    public function renderContent(VizyContent $content, array $config = []): Markup
    {
        // Path prefix matches VizyContent::blocks() so blockFromNode cache keys
        // stay unique across layouts/columns and nested fragments.
        return Template::raw($this->_renderNodes(
            $content->nodes(),
            $content->document(),
            $config,
            $content->path(),
            RenderContext::fromDocument($content->document()),
        ));
    }

    /**
     * Render one TipTap node (and its descendants) through the same emit path
     * as document HTML — used by GraphQL per-node `html`.
     */
    public function renderNode(VizyDocument $document, array $node, array $config = []): Markup
    {
        // Fragment paths must not collide with document `content.*` keys or with
        // other single-node renders that share a local index of zero.
        $uid = $node['attrs']['blockUid'] ?? null;
        $prefix = is_string($uid) && $uid !== ''
            ? "fragment.block.{$uid}"
            : 'fragment.' . substr(hash('xxh3', Json::encode($node)), 0, 16);

        return Template::raw($this->_renderNodes([$node], $document, $config, $prefix, RenderContext::fromDocument($document)));
    }


    // Private Methods
    // =========================================================================

    private function _renderNodes(array $nodes, VizyDocument $document, array $config, string $pathPrefix, RenderContext $ctx): string
    {
        $extensions = Vizy::$plugin->getExtensions();
        $html = '';

        foreach ($nodes as $index => $node) {
            if (!is_array($node)) {
                continue;
            }

            $path = "{$pathPrefix}.{$index}";
            $type = $node['type'] ?? null;

            if (!is_string($type) || $type === '') {
                continue;
            }

            // Text is omit at the definition level; the renderer owns encoding + marks.
            if ($type === 'text') {
                $html .= $this->_renderText($node, $ctx, $config);
                continue;
            }

            $render = $extensions->getRender('node', $type);

            if ($render === null) {
                continue;
            }

            $html .= match ($render['strategy']) {
                'omit' => '',
                'block' => $this->_renderBlock($document->blockFromNode($node, $path), $config),
                'type' => $this->_renderTypeNode($node, $render, $document, $config, $ctx, $path),
                default => '',
            };
        }

        return $html;
    }

    private function _renderTypeNode(
        array $node,
        array $render,
        VizyDocument $document,
        array $config,
        RenderContext $ctx,
        string $path,
    ): string {
        $class = $render['class'] ?? null;

        if (!is_string($class) || !is_a($class, NodeInterface::class, true)) {
            return '';
        }

        $attrs = is_array($node['attrs'] ?? null) ? $node['attrs'] : [];
        $children = $this->_renderNodes(
            $node['content'] ?? [],
            $document,
            $config,
            "{$path}.content",
            $ctx,
        );

        $attrs = $class::resolveAttrs($attrs, $ctx);
        $template = $this->_renderTemplate('node', $node['type'], $config);

        if ($template !== null) {
            $html = Craft::$app->getView()->renderTemplate($template, [
                'node' => $node,
                'type' => $node['type'],
                'attrs' => $attrs,
                'content' => Template::raw($children),
                'context' => $ctx,
                'document' => $ctx->document,
                'field' => $ctx->field,
                'owner' => $ctx->owner,
                'siteId' => $ctx->siteId,
            ], View::TEMPLATE_MODE_SITE);

            return $class::modifyRenderedHtml($html, $ctx);
        }

        return TypeHtml::renderResolvedNode($class, $children, $attrs, $ctx);
    }

    private function _renderText(array $node, RenderContext $ctx, array $config): string
    {
        $text = Html::encode((string)($node['text'] ?? ''));
        $extensions = Vizy::$plugin->getExtensions();

        foreach ($node['marks'] ?? [] as $mark) {
            if (!is_array($mark)) {
                continue;
            }
            $markType = $mark['type'] ?? null;

            if (!is_string($markType) || $markType === '') {
                continue;
            }

            $render = $extensions->getRender('mark', $markType);

            if ($render === null) {
                continue;
            }

            $text = match ($render['strategy']) {
                'omit' => $text,
                'type' => $this->_renderTypeMark($text, $mark, $render, $ctx, $config),
                default => $text,
            };
        }

        return $text;
    }

    private function _renderTypeMark(string $html, array $mark, array $render, RenderContext $ctx, array $config): string
    {
        $class = $render['class'] ?? null;

        if (!is_string($class) || !is_a($class, MarkInterface::class, true)) {
            return $html;
        }

        $attrs = is_array($mark['attrs'] ?? null) ? $mark['attrs'] : [];

        $attrs = $class::resolveAttrs($attrs, $ctx);
        $template = $this->_renderTemplate('mark', $mark['type'], $config);

        if ($template !== null) {
            return Craft::$app->getView()->renderTemplate($template, [
                'mark' => $mark,
                'type' => $mark['type'],
                'attrs' => $attrs,
                'content' => Template::raw($html),
                'context' => $ctx,
                'document' => $ctx->document,
                'field' => $ctx->field,
                'owner' => $ctx->owner,
                'siteId' => $ctx->siteId,
            ], View::TEMPLATE_MODE_SITE);
        }

        return TypeHtml::renderResolvedMark($class, $html, $attrs, $ctx);
    }

    private function _renderBlock(VizyBlock $block, array $config): string
    {
        if (!$block->isEnabled() || !($type = $block->blockType())) {
            return '';
        }

        $template = $config['blockTemplates'][$type->uid] ?? $type->template;

        if (!$template) {
            return '';
        }

        $variables = array_merge($config['blockVariables'] ?? [], [
            'block' => $block,
            'type' => $type,
        ]);

        return Craft::$app->getView()->renderTemplate($template, $variables, View::TEMPLATE_MODE_SITE);
    }

    private function _renderTemplate(string $kind, string $type, array $config): ?string
    {
        $configKey = $kind . 'Templates';
        $configuredTemplates = $config[$configKey] ?? [];
        $configured = is_array($configuredTemplates) ? ($configuredTemplates[$type] ?? null) : null;

        if (is_string($configured) && trim($configured) !== '') {
            return trim($configured);
        }

        $basePath = Vizy::$plugin->getSettings()->getRenderTemplatesPath();

        if ($basePath === '') {
            return null;
        }

        $template = $basePath . '/' . $kind . 's/' . $type;

        if (!array_key_exists($template, $this->_templateAvailability)) {
            $this->_templateAvailability[$template] = Craft::$app->getView()->doesTemplateExist(
                $template,
                View::TEMPLATE_MODE_SITE,
            );
        }

        return $this->_templateAvailability[$template] ? $template : null;
    }
}
