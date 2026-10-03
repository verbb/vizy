<?php
namespace verbb\vizy\base;

use verbb\vizy\document\VizyDocument;
use verbb\vizy\fields\VizyField;

use Craft;
use craft\base\ElementInterface;
use craft\base\FieldInterface;

/**
 * Field / owner / site context for resolve and normalize class methods.
 *
 * Passed by value-ish reference through render and document walks — not a
 * Mark/Node instance and not a place for per-occurrence mutable type state.
 */
final class RenderContext
{
    // Static Methods
    // =========================================================================

    public static function fromDocument(VizyDocument $document): self
    {
        $field = $document->field();
        $owner = $document->owner();

        return new self(
            document: $document,
            field: $field,
            owner: $owner,
            siteId: $document->siteId() ?? $owner?->siteId,
        );
    }

    public static function empty(): self
    {
        return new self();
    }


    // Properties
    // =========================================================================

    private array $_elements = [];
    private ?array $_footnoteNumbers = null;


    // Public Methods
    // =========================================================================

    public function __construct(
        public readonly ?VizyDocument $document = null,
        public readonly ?FieldInterface $field = null,
        public readonly ?ElementInterface $owner = null,
        public readonly ?int $siteId = null,
    ) {
    }

    /**
     * Trusted template resolution, scoped to one render pass. Repeated marks and
     * images share lookups without carrying stale elements into a later render.
     * GraphQL permission-filtered projections use their separate access boundary.
     */
    public function elementByUid(string $uid, string $type, ?int $siteId): ?ElementInterface
    {
        $siteId ??= (int)Craft::$app->getSites()->getCurrentSite()->id;
        $key = $type . ':' . $siteId . ':' . $uid;

        if (!array_key_exists($key, $this->_elements)) {
            $this->_elements[$key] = Craft::$app->getElements()->getElementByUid($uid, $type, $siteId);
        }

        return $this->_elements[$key];
    }

    public function fieldOrNull(): ?VizyField
    {
        return $this->field instanceof VizyField ? $this->field : null;
    }

    public function footnoteNumber(string $uid): ?int
    {
        if ($this->_footnoteNumbers === null) {
            $this->_footnoteNumbers = [];
            $next = 1;
            $walk = function(array $nodes) use (&$walk, &$next): void {
                foreach ($nodes as $node) {
                    if (!is_array($node)) {
                        continue;
                    }

                    if (($node['type'] ?? null) === 'footnoteReference') {
                        $footnoteUid = $node['attrs']['footnoteUid'] ?? null;

                        if (is_string($footnoteUid) && $footnoteUid !== '' && !isset($this->_footnoteNumbers[$footnoteUid])) {
                            $this->_footnoteNumbers[$footnoteUid] = $next++;
                        }
                    }

                    if (is_array($node['content'] ?? null)) {
                        $walk($node['content']);
                    }
                }
            };
            $walk($this->document?->toArray()['content'] ?? []);
        }

        return $this->_footnoteNumbers[$uid] ?? null;
    }
}
