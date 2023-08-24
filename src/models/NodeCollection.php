<?php
namespace verbb\vizy\models;

use verbb\vizy\Vizy;
use verbb\vizy\fields\VizyField;
use verbb\vizy\helpers\Nodes;
use verbb\vizy\nodes\VizyBlock;

use Craft;
use craft\base\ElementInterface;
use craft\helpers\ArrayHelper;
use craft\helpers\Html;
use craft\helpers\Template;

use yii2mod\query\ArrayQuery;
use Twig\Markup;

class NodeCollection extends Markup
{
    // Static Methods
    // =========================================================================

    private static function configure($object, $properties, $merge): mixed
    {
        foreach ($properties as $name => $value) {
            if ($merge) {
                $value = array_merge($object->$name, $value);
            }

            $object->$name = $value;
        }

        return $object;
    }


    // Properties
    // =========================================================================

    private static mixed $element = null;
    private static mixed $field = null;
    private array $nodes = [];
    private array $rawNodes = [];
    
    private mixed $_content = null;
    private static array $_registeredNodesByType = [];
    private static array $_registeredMarksByType = [];


    // Public Methods
    // =========================================================================

    public function __construct($field, $nodes = [], $element = null)
    {
        // Handle emoji's and un-serialize them
        foreach ($nodes as $key => $node) {
            $nodes[$key] = Nodes::normalizeContent($node);
        }

        self::$element = $element;
        self::$field = $field;
        $this->rawNodes = $nodes;

        // Save here as we're recursively populating nodes/marks
        self::$_registeredNodesByType = Vizy::$plugin->getNodes()->getRegisteredNodesByType();
        self::$_registeredMarksByType = Vizy::$plugin->getNodes()->getRegisteredMarksByType();

        // Prepare node/mark classes for the collection
        $this->nodes = self::_populateNodes($nodes);
        $this->nodes = self::_normalizeNodes($this->getNodes(), self::$element);

        parent::__construct(null, null);
    }

    public function __toString(): string
    {
        if (!$this->_content) {
            $this->_content = (string)$this->renderHtml();
        }

        // Prevent everyone from having to use the `| raw` filter when outputting RTE content
        return $this->_content;
    }

    public function count(): bool|int
    {
        if (!$this->_content) {
            $this->_content = (string)$this->renderHtml();
        }

        return mb_strlen($this->_content, Craft::$app->charset);
    }

    public function getNodes(): array
    {
        return $this->nodes;
    }

    public function getField()
    {
        return self::$field;
    }

    public function getRawNodes(): array
    {
        // We want to fetch the raw node data after it's been normalized
        $nodes = [];

        foreach ($this->getNodes() as $node) {
            $nodes[] = $node->rawNode;
        }

        return $nodes;
    }

    public function renderHtml($config = []): ?Markup
    {
        $html = [];

        $this->_prepNodesForHtml($config);

        foreach ($this->getNodes() as $node) {
            $html[] = $node->renderHtml();
        }

        $html = implode($html);

        // Is this a completely empty field (we always have an empty paragraph)?
        if (str_replace(['<p>', '</p>'], '', $html) === '') {
            $html = '';
        }

        return Template::raw($html);
    }

    public function renderStaticHtml($config = []): ?Markup
    {
        $html = [];

        $this->_prepNodesForHtml($config);

        foreach ($this->getNodes() as $node) {
            $html[] = $node->renderStaticHtml();
        }

        $html = implode($html);

        return Template::raw($html);
    }

    public function all(): array
    {
        return $this->query()->all();
    }

    public function query(): ArrayQuery
    {
        $arrayQuery = new ArrayQuery();
        $arrayQuery->primaryKeyName = 'type';

        return $arrayQuery->from($this->getNodes())->where(['enabled' => true]);
    }

    public function serializeValues(ElementInterface $element = null): array
    {
        $values = [];

        // Ensure that we serialize nodes recursively
        $rawNodes = self::_serializeNodes($this->getNodes(), $element);

        foreach ($rawNodes as $nodeKey => $rawNode) {
            $rawNodeType = $rawNode['type'] ?? null;

            // Extra check if we are in blocks-only mode
            if (self::$field->editorMode === VizyField::MODE_BLOCKS) {
                if ($rawNodeType !== VizyBlock::$type) {
                    continue;
                }
            }

            // Handle serializing any emoji's in text nodes
            $values[$nodeKey] = Nodes::serializeContent($rawNode);
        }

        return array_values(array_filter($values));
    }

    public function isEmpty(): bool
    {
        // Don't rely on `renderHtml()` as this is trigger on-load in the CP when editing a field,
        // and it does plenty of unnecessary things. Instead, work with the `rawNodes` directly.
        $results = [];

        foreach ($this->getNodes() as $node) {
            $results[] = $node->isEmpty();
        }

        // Are _all_ the results the same?
        return (bool)array_product($results);
    }
    

    // Private Methods
    // =========================================================================

    private static function _normalizeNodes(array $nodes, ElementInterface $element = null): array
    {
        $values = [];

        foreach ($nodes as $nodeKey => $node) {
            $rawNode = $node->rawNode;
            $node->rawNode = $node->normalizeValue($element);
            $node->attrs = $node->rawNode['attrs'] ?? [];

            // If the node's `rawNode` has changed through normalization, we need to re-populate the
            // `content` nodes with this potentially updated schema to match `rawNode`.
            if ($rawNode !== $node->rawNode) {
                $node->content = self::_populateNodes([$node->rawNode['content']]);
            }

            $content = self::_normalizeNodes($node->getContent(), $element);

            if ($content) {
                $node->content = $content;

                // A tad annoying, we have to go back and update the rawNode data from the converted content
                foreach ($content as $contentKey => $c) {
                    $node->rawNode['content'][$contentKey] = $c->rawNode;
                }
            }

            $values[] = $node;
        }

        return $values;
    }

    private static function _serializeNodes(array $nodes, ElementInterface $element = null): array
    {
        $values = [];

        foreach ($nodes as $nodeKey => $node) {
            $value = $node->serializeValue($element);
            $content = self::_serializeNodes($node->getContent(), $element);

            if ($content) {
                $value['content'] = $content;
            }

            $values[] = $value;
        }

        return $values;
    }

    private static function _populateNodes($nodes): array
    {
        $result = [];

        foreach ($nodes as $nodeKey => $node) {
            $rawNode = $node;

            // Drill into any nested nodes first
            if (isset($node['content'])) {
                $node['content'] = self::_populateNodes($node['content']);
            }

            // Handle initializing nested marks
            if (isset($node['marks'])) {
                foreach ($node['marks'] as $markKey => $mark) {
                    if ($class = (self::$_registeredMarksByType[$mark['type']] ?? null)) {
                        unset($mark['type']);

                        $node['marks'][$markKey] = Craft::createObject(array_merge($mark, [
                            'class' => $class,
                            'field' => self::$field,
                            'element' => self::$element,
                        ]));
                    } else {
                        // If an un-registered mark, drop it
                        unset($node['marks'][$markKey]);
                    }
                }
            }

            // Escape hatch if some went really wrong with the node
            if (!isset($node['type'])) {
                continue;
            }

            if ($class = (self::$_registeredNodesByType[$node['type']] ?? null)) {
                unset($node['type']);
                // Craft::dd($node);

                $nodeClass = Craft::createObject(array_merge($node, [
                    'class' => $class,
                    'field' => self::$field,
                    'element' => self::$element,
                    'rawNode' => $rawNode,
                ]));

                if (!$nodeClass->isDeleted()) {
                    $result[] = $nodeClass;
                }
            } else {
                // If an un-registered node, drop it
                unset($nodes[$nodeKey]);
            }
        }

        return $result;
    }

    private function _prepNodesForHtml($config = []): void
    {
        foreach ($this->getNodes() as $node) {
            // Apply any node config set in templates
            foreach ($config as $type => $nodeConfig) {
                if ($node->getType() === $type) {
                    // Extract any mark config and apply to all marks of matching type
                    // Also remove it from the config, so it doesn't clash with the `marks` prop.
                    $marksConfig = ArrayHelper::remove($nodeConfig, 'marks');

                    foreach ($node->content as $nodeContent) {
                        foreach ($nodeContent->marks as $mark) {
                            $markConfig = $marksConfig[$mark->getType()] ?? [];

                            if ($markConfig) {
                                // Check if we want to merge attributes, instead of replace. Useful for attrs.
                                $merge = ArrayHelper::remove($markConfig, 'merge');

                                // Ensure that attributes are merged correctly
                                if ($merge) {
                                    $attributes1 = Html::normalizeTagAttributes($mark->attrs);
                                    $attributes2 = Html::normalizeTagAttributes(($markConfig['attrs'] ?? []));
                                    $markConfig['attrs'] = ArrayHelper::merge($attributes1, $attributes2);
                                }

                                self::configure($mark, $markConfig, $merge);
                            }
                        }
                    }

                    // Check if we want to merge attributes, instead of replace. Useful for attrs.
                    $merge = ArrayHelper::remove($nodeConfig, 'merge');

                    // Ensure that attributes are merged correctly
                    if ($merge) {
                        $attributes1 = Html::normalizeTagAttributes($node->attrs);
                        $attributes2 = Html::normalizeTagAttributes(($nodeConfig['attrs'] ?? []));
                        $nodeConfig['attrs'] = ArrayHelper::merge($attributes1, $attributes2);
                    }

                    self::configure($node, $nodeConfig, $merge);
                }
            }
        }
    }

}
