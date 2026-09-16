<?php
namespace verbb\vizy\base;

use verbb\vizy\deprecations\VizyNodeInstanceHtmlDeprecations;
use verbb\vizy\events\ModifyNodeTagEvent;
use verbb\vizy\events\ModifyRenderedNodeEvent;
use verbb\vizy\helpers\TypeHtml;

use craft\base\Component;
use craft\base\ElementInterface;
use craft\base\FieldInterface;

use yii\base\InvalidConfigException;

use GraphQL\Type\Definition\ScalarType;
use GraphQL\Type\Definition\Type;

/**
 * TipTap node base — catalogue + HTML policy live on statics.
 *
 * Instance HTML methods are deprecated shims (see VizyNodeInstanceHtmlDeprecations).
 */
class Node extends Component implements NodeInterface
{
    // Static Methods
    // =========================================================================

    public static function id(): string
    {
        if (static::$type === null || static::$type === '') {
            throw new InvalidConfigException(static::class . ' must define $type or override id().');
        }

        return static::$type;
    }

    public static function moduleId(): string
    {
        return 'vizy/core/node/' . static::id();
    }

    public static function label(): string
    {
        return ucfirst(static::id());
    }

    public static function surfaces(): array
    {
        return [EditorSurface::Toolbar];
    }

    public static function icon(): ?string
    {
        return null;
    }

    public static function group(): ?string
    {
        return null;
    }

    public static function tag(): string|array|null
    {
        return null;
    }

    public static function tagForAttrs(array $attrs): string|array|null
    {
        return static::tag();
    }

    public static function isSelfClosing(): bool
    {
        return false;
    }

    public static function normalizeAttrs(array $attrs, RenderContext $ctx): array
    {
        return $attrs;
    }

    public static function resolveAttrs(array $attrs, RenderContext $ctx): array
    {
        return $attrs;
    }

    public static function renderOccurrenceHtml(string $children, array $resolvedAttrs, RenderContext $ctx): ?string
    {
        return null;
    }

    public static function dependencies(): array
    {
        return [];
    }

    public static function implies(): array
    {
        return [];
    }

    public static function alwaysEnabled(): bool
    {
        return false;
    }

    public static function isInternal(): bool
    {
        return false;
    }

    /**
     * Class-level modifyTag — no Node instance required.
     */
    public static function modifyTagStructure(string|array|null $tag, array $attrs, RenderContext $ctx, bool $opening): array
    {
        $structure = TypeHtml::structureFromTag($tag, $attrs);
        $event = new ModifyNodeTagEvent([
            'tag' => $structure,
            'node' => null,
            'attrs' => $attrs,
            'typeId' => static::id(),
            'context' => $ctx,
            'opening' => $opening ? true : null,
            'closing' => $opening ? null : true,
        ]);

        TypeHtml::triggerClassEvent(static::class, self::EVENT_MODIFY_TAG, $event);
        // Yii class-level Event::trigger already walks parents — do not fire Node again.

        return is_array($event->tag) ? $event->tag : [];
    }

    /**
     * Class-level modifyRenderedNode.
     */
    public static function modifyRenderedHtml(string $html, RenderContext $ctx): string
    {
        if (!TypeHtml::hasClassHandlers(static::class, self::EVENT_MODIFY_RENDERED_NODE)
            && !TypeHtml::hasClassHandlers(self::class, self::EVENT_MODIFY_RENDERED_NODE)) {
            return $html;
        }

        $event = new ModifyRenderedNodeEvent([
            'renderedNode' => $html,
            'typeId' => static::id(),
            'context' => $ctx,
            'node' => null,
        ]);

        TypeHtml::triggerClassEvent(static::class, self::EVENT_MODIFY_RENDERED_NODE, $event);
        // Yii inheritance already delivers base-class handlers.

        return (string)($event->renderedNode ?? '');
    }

    public static function gqlTypeNameByContext(mixed $context): string
    {
        $classNameParts = explode('\\', static::class);
        $end = array_pop($classNameParts);

        return 'VizyNode_' . $end;
    }


    // Constants
    // =========================================================================

    public const EVENT_MODIFY_TAG = 'modifyTag';
    public const EVENT_MODIFY_RENDERED_NODE = 'modifyRenderedNode';


    // Traits
    // =========================================================================

    use VizyNodeInstanceHtmlDeprecations;


    // Properties
    // =========================================================================

    public static ?string $type = null;
    public mixed $tagName = null;
    public array $content = [];
    public array $attrs = [];
    public array $marks = [];
    public array $rawNode = [];

    protected ?string $text = null;

    private ?ElementInterface $element = null;
    private ?FieldInterface $field = null;


    // Public Methods
    // =========================================================================

    public function getType(): ?string
    {
        return static::$type ?? static::id();
    }

    public function getField(): ?FieldInterface
    {
        return $this->field;
    }

    public function setField(?FieldInterface $value): void
    {
        $this->field = $value;
    }

    public function getElement(): ?ElementInterface
    {
        return $this->element;
    }

    public function setElement(?ElementInterface $value): void
    {
        $this->element = $value;
    }

    public function getGqlTypeName(): string
    {
        return static::gqlTypeNameByContext($this);
    }

    public function getContentGqlType(): ScalarType
    {
        return Type::string();
    }
}
