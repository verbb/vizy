<?php
namespace verbb\vizy\integrations\feedme;

use verbb\vizy\Vizy;
use verbb\vizy\elements\Block;
use verbb\vizy\fields\VizyField;
use verbb\vizy\importers\HtmlImportRule;
use verbb\vizy\models\BlockType;

use craft\base\ElementInterface;
use craft\base\FieldInterface;
use craft\feedme\Plugin as FeedMe;
use craft\helpers\StringHelper;

use DOMElement;
use InvalidArgumentException;

/**
 * Builds request-local HTML rules from explicit Feed Me Block mappings.
 */
final class FeedMeBlockMapper
{
    // Constants
    // =========================================================================

    private const SOURCES = ['attribute', 'html', 'literal', 'text'];


    // Public Methods
    // =========================================================================

    public function __construct(
        private readonly VizyField $field,
        private readonly ElementInterface $owner,
        private readonly mixed $feed,
    ) {
    }

    public function rules(mixed $config): array
    {
        if ($config === null || $config === []) {
            return [];
        }

        if (!is_array($config)) {
            throw new InvalidArgumentException('Vizy Block mappings must be keyed by Block Type UID.');
        }
        $rules = [];
        $selectors = [];

        foreach ($config as $blockTypeUid => $mapping) {
            if (!is_array($mapping)) {
                throw new InvalidArgumentException("Vizy Block mapping {$blockTypeUid} is invalid.");
            }

            if (!is_string($blockTypeUid) || !$this->field->allowsBlockTypeUid($blockTypeUid)) {
                throw new InvalidArgumentException("Vizy Block mapping references unavailable Block Type UID {$blockTypeUid}.");
            }
            $blockType = Vizy::$plugin->getBlockTypes()->getBlockTypeByUid($blockTypeUid);

            if (!$blockType) {
                throw new InvalidArgumentException("Vizy Block mapping references unknown Block Type UID {$blockTypeUid}.");
            }

            if (empty($mapping['enabled'])) {
                continue;
            }

            if (!in_array($blockTypeUid, $this->field->getInsertableBlockTypeUids($this->owner), true)) {
                throw new InvalidArgumentException("Vizy Block Type {$blockTypeUid} is not available for this element.");
            }
            $tag = strtolower(trim((string)($mapping['tag'] ?? '')));

            if (!$this->_validHtmlName($tag)) {
                throw new InvalidArgumentException("Vizy Block mapping {$blockTypeUid} requires a valid HTML tag.");
            }
            $matchAttribute = strtolower(trim((string)($mapping['attribute'] ?? '')));
            $matchValue = (string)($mapping['value'] ?? '');

            if ($matchAttribute !== '' && !$this->_validHtmlName($matchAttribute)) {
                throw new InvalidArgumentException("Vizy Block mapping {$blockTypeUid} has an invalid match attribute.");
            }

            if ($matchAttribute === '' && $matchValue !== '') {
                throw new InvalidArgumentException("Vizy Block mapping {$blockTypeUid} cannot match a value without an attribute.");
            }

            foreach ($selectors as $selector) {
                if ($this->_selectorsOverlap($selector, [$tag, $matchAttribute, $matchValue])) {
                    throw new InvalidArgumentException("Vizy Block mappings {$selector[3]} and {$blockTypeUid} have ambiguous HTML selectors.");
                }
            }
            $selectors[] = [$tag, $matchAttribute, $matchValue, $blockTypeUid];
            $fieldMappings = $this->_fieldMappings($blockType, $mapping['fields'] ?? []);
            $rules[] = HtmlImportRule::node(
                tags: [$tag],
                type: 'vizyBlock',
                placement: HtmlImportRule::PLACEMENT_BLOCK,
                content: HtmlImportRule::CONTENT_NONE,
                attributes: fn(DOMElement $element): array => $this->_blockAttributes($element, $blockType, $fieldMappings),
                priority: 100,
                matcher: static function(DOMElement $element) use ($matchAttribute, $matchValue): bool {
                    if ($matchAttribute === '') {
                        return true;
                    }

                    return $element->hasAttribute($matchAttribute)
                        && ($matchValue === '' || $element->getAttribute($matchAttribute) === $matchValue);
                },
            );
        }

        return $rules;
    }


    // Private Methods
    // =========================================================================

    private function _fieldMappings(BlockType $blockType, mixed $config): array
    {
        if (!is_array($config)) {
            throw new InvalidArgumentException("Vizy Block mapping {$blockType->uid} fields must be keyed by placement UID.");
        }
        $placements = [];

        foreach ($blockType->getFieldLayout()?->getCustomFieldElements() ?? [] as $placement) {
            if ($placement->uid && $placement->getField()) {
                $placements[$placement->uid] = $placement->getField();
            }
        }
        $mappings = [];

        foreach ($config as $placementUid => $mapping) {
            if (!is_string($placementUid) || !isset($placements[$placementUid])) {
                throw new InvalidArgumentException("Vizy Block mapping {$blockType->uid} references unknown placement UID {$placementUid}.");
            }

            if (!is_array($mapping)) {
                throw new InvalidArgumentException("Vizy Block placement mapping {$placementUid} is invalid.");
            }
            $source = trim((string)($mapping['source'] ?? ''));

            if ($source === '') {
                continue;
            }

            if (!in_array($source, self::SOURCES, true)) {
                throw new InvalidArgumentException("Vizy Block placement mapping {$placementUid} has an invalid source.");
            }
            $attribute = strtolower(trim((string)($mapping['attribute'] ?? '')));

            if ($source === 'attribute' && !$this->_validHtmlName($attribute)) {
                throw new InvalidArgumentException("Vizy Block placement mapping {$placementUid} requires a valid HTML attribute.");
            }
            $options = $mapping['options'] ?? [];

            if (!is_array($options)) {
                throw new InvalidArgumentException("Vizy Block placement mapping {$placementUid} options are invalid.");
            }
            $mappings[$placementUid] = [
                'field' => $placements[$placementUid],
                'source' => $source,
                'attribute' => $attribute,
                'value' => (string)($mapping['value'] ?? ''),
                'options' => $options,
            ];
        }

        return $mappings;
    }

    private function _blockAttributes(DOMElement $element, BlockType $blockType, array $mappings): array
    {
        $blockUid = StringHelper::UUID();
        $block = new Block();
        $block->setOwner($this->owner);
        $block->setField($this->field);
        $block->setType($blockType);
        $block->setFieldLayout($blockType->getFieldLayout());
        $block->setBlockUid($blockUid);
        $block->setScenario($this->owner->getScenario());
        $fieldSlots = [];

        foreach ($mappings as $placementUid => $mapping) {
            $fieldSlots[$placementUid] = $this->_parseFieldValue(
                $block,
                $mapping['field'],
                $this->_sourceValue($element, $mapping),
                $mapping['options'],
            );
        }

        return [
            'blockUid' => $blockUid,
            'blockTypeUid' => $blockType->uid,
            'enabled' => true,
            'fieldSlots' => $fieldSlots,
        ];
    }

    private function _parseFieldValue(Block $block, FieldInterface $field, mixed $value, array $options): mixed
    {
        $fields = FeedMe::$plugin->getFields();
        $adapter = $fields->getRegisteredField($field::class);
        $state = [];

        foreach (['feedData', 'fieldHandle', 'fieldInfo', 'field', 'element', 'feed'] as $property) {
            $state[$property] = $adapter->{$property};
        }

        try {
            return $fields->parseField(
                $this->feed,
                $block,
                ['value' => $value],
                $field->handle,
                [
                    'field' => $field::class,
                    'node' => 'value',
                    'options' => $options,
                ],
            );
        } finally {
            foreach ($state as $property => $propertyValue) {
                $adapter->{$property} = $propertyValue;
            }
        }
    }

    private function _sourceValue(DOMElement $element, array $mapping): string
    {
        return match ($mapping['source']) {
            'attribute' => $element->getAttribute($mapping['attribute']),
            'html' => $this->_innerHtml($element),
            'literal' => $mapping['value'],
            'text' => trim($element->textContent),
        };
    }

    private function _innerHtml(DOMElement $element): string
    {
        $html = '';

        foreach ($element->childNodes as $child) {
            $html .= $element->ownerDocument?->saveHTML($child) ?: '';
        }

        return $html;
    }

    private function _validHtmlName(string $value): bool
    {
        return (bool)preg_match('/^[a-z_:][a-z0-9_.:-]*$/', $value);
    }

    private function _selectorsOverlap(array $first, array $second): bool
    {
        if ($first[0] !== $second[0]) {
            return false;
        }

        return $first[1] === ''
            || $second[1] === ''
            || $first[1] !== $second[1]
            || $first[2] === ''
            || $second[2] === ''
            || $first[2] === $second[2];
    }
}
