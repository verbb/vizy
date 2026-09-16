<?php
namespace verbb\vizy\base;

use verbb\vizy\deprecations\VizyMarkInstanceHtmlDeprecations;

use craft\base\Component;
use craft\base\ElementInterface;
use craft\base\FieldInterface;

use yii\base\InvalidConfigException;

use GraphQL\Type\Definition\ScalarType;
use GraphQL\Type\Definition\Type;

/**
 * TipTap mark base — catalogue + HTML policy live on statics.
 *
 * Instance HTML methods are deprecated shims (see VizyMarkInstanceHtmlDeprecations).
 */
class Mark extends Component implements MarkInterface
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
        return 'vizy/core/mark/' . static::id();
    }

    public static function label(): string
    {
        return ucfirst(static::id());
    }

    public static function surfaces(): array
    {
        return [EditorSurface::Toolbar, EditorSurface::Bubble];
    }

    public static function icon(): ?string
    {
        return null;
    }

    public static function group(): ?string
    {
        return EditorGroup::Marks;
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
     * Class-level modifyTag — no Mark instance required.
     */
    public static function modifyTagStructure(string|array|null $tag, array $attrs, RenderContext $ctx, bool $opening): array
    {
        $structure = \verbb\vizy\helpers\TypeHtml::structureFromTag($tag, $attrs);
        $event = new \verbb\vizy\events\ModifyMarkTagEvent([
            'tag' => $structure,
            'mark' => null,
            'attrs' => $attrs,
            'typeId' => static::id(),
            'context' => $ctx,
            'opening' => $opening ? true : null,
            'closing' => $opening ? null : true,
        ]);

        \verbb\vizy\helpers\TypeHtml::triggerClassEvent(static::class, self::EVENT_MODIFY_TAG, $event);
        // Yii class-level Event::trigger already walks parents — do not fire Mark again.

        return is_array($event->tag) ? $event->tag : [];
    }

    public static function gqlTypeNameByContext(mixed $context): string
    {
        $classNameParts = explode('\\', static::class);
        $end = array_pop($classNameParts);

        return 'VizyMark_' . $end;
    }


    // Constants
    // =========================================================================

    public const EVENT_MODIFY_TAG = 'modifyTag';


    // Traits
    // =========================================================================

    use VizyMarkInstanceHtmlDeprecations;


    // Properties
    // =========================================================================

    public static ?string $type = null;
    public mixed $tagName = null;
    public array $attrs = [];

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

    public function setField(FieldInterface $value): void
    {
        $this->field = $value;
    }

    public function getElement(): ?ElementInterface
    {
        return $this->element;
    }

    public function setElement(ElementInterface $value): void
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
