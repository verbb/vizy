<?php
namespace verbb\vizy\document;

use verbb\vizy\Vizy;
use verbb\vizy\deprecations\VizyDocumentNodeCollectionDeprecations;
use verbb\vizy\elements\Block as BlockElement;
use verbb\vizy\fields\VizyField;
use verbb\vizy\helpers\FieldSlotValues;
use verbb\vizy\helpers\Matrix as MatrixHelper;
use verbb\vizy\models\BlockType;

use craft\base\ElementInterface;

use LogicException;
use UnexpectedValueException;

use Twig\Markup;

/**
 * Immutable canonical document graph. Only request-local projection caches mutate.
 */
final class VizyDocument
{
    // Static Methods
    // =========================================================================

    public static function fromCanonicalData(
        array $data,
        ?ElementInterface $owner = null,
        ?VizyField $field = null,
    ): self {
        return new self($data, $owner, $field);
    }

    public static function empty(
        ?ElementInterface $owner = null,
        ?VizyField $field = null,
    ): self {
        return new self([
            'type' => 'doc',
            'attrs' => ['schemaVersion' => self::CURRENT_SCHEMA_VERSION],
            'content' => [],
        ], $owner, $field);
    }


    // Constants
    // =========================================================================

    public const LEGACY_SCHEMA_VERSION = 1;
    public const CURRENT_SCHEMA_VERSION = 2;


    // Traits
    // =========================================================================

    use VizyDocumentNodeCollectionDeprecations;


    // Properties
    // =========================================================================

    private ?VizyContent $content = null;
    private array $blocksByPath = [];
    private ?array $blockUidIndex = null;
    private array $blockTypes = [];
    private array $blockElements = [];
    private int $blockElementCreationCount = 0;


    // Public Methods
    // =========================================================================

    public function owner(): ?ElementInterface
    {
        return $this->owner;
    }

    public function field(): ?VizyField
    {
        return $this->field;
    }

    public function schemaVersion(): int
    {
        return $this->envelope['attrs']['schemaVersion'];
    }

    public function siteId(): ?int
    {
        return $this->owner?->siteId;
    }

    public function content(): VizyContent
    {
        return $this->content ??= new VizyContent($this, $this->envelope['content'], 'content');
    }

    /**
     * Whether the document has no meaningful content (empty / blank paragraphs).
     *
     * Preferred Twig alias for `content()->isEmpty()` — kept as first-class API.
     */
    public function isEmpty(): bool
    {
        return $this->content()->isEmpty();
    }

    /**
     * Query root document nodes (prose + Blocks), Vizy 3 consumer API.
     *
     * Defaults to `enabled = true` (prose nodes always match). Returns
     * {@see VizyBlock} or {@see VizyContentNode} rows via ArrayQuery.
     *
     * @see https://verbb.io/craft-plugins/vizy/docs/template-guides/querying-nodes
     */
    public function query(): VizyNodeQuery
    {
        $items = [];
        foreach ($this->content()->nodes() as $index => $node) {
            if (!is_array($node)) {
                continue;
            }
            $path = "content.{$index}";
            $items[] = ($node['type'] ?? null) === 'vizyBlock'
                ? $this->blockFromNode($node, $path)
                : new VizyContentNode($this, $node, $path);
        }

        return (new VizyNodeQuery())->from($items);
    }

    /**
     * All root nodes matching the default query (`enabled` Blocks + prose).
     */
    public function all(): array
    {
        return $this->query()->all();
    }

    /**
     * Read blocks in the outer node tree. Null includes both enabled states.
     */
    public function blocks(?bool $enabled = true): array
    {
        return $this->content()->blocks(true, $enabled);
    }

    /**
     * Identity lookup includes disabled blocks for editing and persistence.
     */
    public function findBlock(string $blockUid): ?VizyBlock
    {
        if ($this->blockUidIndex === null) {
            $this->blockUidIndex = [];
            foreach ($this->blocks(null) as $block) {
                $this->blockUidIndex[$block->uid()][] = $block;
            }
        }

        $matches = $this->blockUidIndex[$blockUid] ?? [];
        if (count($matches) > 1) {
            throw new UnexpectedValueException("Duplicate Vizy Block UID makes lookup ambiguous: {$blockUid}.");
        }

        return $matches[0] ?? null;
    }

    public function traverse(): iterable
    {
        yield from $this->content()->traverse();
    }

    public function toArray(): array
    {
        return $this->envelope;
    }

    public function toJson(): string
    {
        return json_encode($this->envelope, JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    }

    public function render(array $config = []): Markup
    {
        return Vizy::$plugin->getRenderer()->renderDocument($this, $config);
    }

    public function blockFromNode(array $node, string $path): VizyBlock
    {
        return $this->blocksByPath[$path] ??= VizyBlock::fromCanonicalNode($this, $node, $path);
    }

    public function resolveBlockType(string $uid): ?BlockType
    {
        if (!array_key_exists($uid, $this->blockTypes)) {
            $this->blockTypes[$uid] = Vizy::$plugin?->getBlockTypes()->getBlockTypeByUid($uid);
        }

        return $this->blockTypes[$uid];
    }

    public function blockElement(VizyBlock $block): BlockElement
    {
        if (!$this->owner || !$this->field) {
            throw new LogicException('Normalized Block field access requires an owner Element and Vizy field context.');
        }

        // UID-keyed caches are unsafe until identity is known to be unique.
        $this->assertUnambiguousBlockUid($block->uid());

        if (isset($this->blockElements[$block->uid()])) {
            return $this->blockElements[$block->uid()];
        }

        $type = $block->blockType();
        $layout = $type?->getFieldLayout();
        if (!$type || !$layout) {
            throw new LogicException("Cannot project unresolved Vizy Block {$block->uid()}.");
        }

        $element = new BlockElement();
        $element->id = null;
        $element->setOwner($this->owner);
        $element->setField($this->field);
        $element->setBlockUid($block->uid());
        $element->setType($type);
        $element->setFieldLayout($layout);

        // Matrix-in-Block: hydrate Matrix values from MatrixAnchor (not fieldSlots).
        $anchor = null;
        if (Vizy::$plugin->getAnchors()->blockHasMatrixFields($layout)) {
            $anchor = Vizy::$plugin->getAnchors()->getAnchor(
                $this->owner,
                $this->field,
                $block->uid(),
                $block->matrixAnchorUid(),
            );
            if ($anchor) {
                $anchor->setFieldLayout($layout);
                $element->id = $anchor->id;
                $element->setMatrixAnchor($anchor);
            } elseif ($block->matrixAnchorUid()) {
                throw new LogicException("Matrix content for block {$block->uid()} could not be resolved. Its stored reference and submitted values have been retained; restore the missing content before saving.");
            }
        }

        // Placement UIDs are storage identity; handles only interpret current schema.
        foreach ($layout->getCustomFieldElements() as $placement) {
            $uid = $placement->uid;
            $craftField = $placement->getField();
            if ($craftField instanceof \craft\fields\Matrix) {
                if ($anchor) {
                    $element->setFieldValue($craftField->handle, MatrixHelper::nestedEntryQuery($craftField, $anchor));
                }
                continue;
            }
            if ($block->hasRawFieldValue($uid)) {
                $element->setFieldValue(
                    $craftField->handle,
                    FieldSlotValues::forSetFieldValue($craftField, $block->rawFieldValue($uid), $element),
                );
            }
        }

        $this->blockElementCreationCount++;
        return $this->blockElements[$block->uid()] = $element;
    }

    public function blockElementCreationCount(): int
    {
        return $this->blockElementCreationCount;
    }

    public function assertUnambiguousBlockUid(string $blockUid): void
    {
        $this->findBlock($blockUid);
    }

    public function recontextualize(?ElementInterface $owner, ?VizyField $field): self
    {
        return new self($this->envelope, $owner, $field);
    }


    // Private Methods
    // =========================================================================

    private function __construct(
        private array $envelope,
        private ?ElementInterface $owner = null,
        private ?VizyField $field = null,
    ) {
    }
}
