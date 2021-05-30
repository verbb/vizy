<?php
namespace verbb\vizy\models;

use verbb\vizy\Vizy;

use Craft;
use craft\base\Model;
use craft\helpers\ArrayHelper;
use craft\helpers\Component as ComponentHelper;
use craft\helpers\Template;

use yii2mod\query\ArrayQuery;

class NodeCollection extends Model
{
    // Properties
    // =========================================================================

    private $element;
    private $field;
    private $nodes = [];
    private $rawNodes = [];

    private $_registeredNodesByType = [];
    private $_registeredMarksByType = [];


    // Public Methods
    // =========================================================================

    public function __construct($field, $nodes = [], $element = null)
    {
        $this->element = $element;
        $this->field = $field;
        $this->rawNodes = $nodes;

        // Save here as we're recursively populating nodes/marks
        $this->_registeredNodesByType = Vizy::$plugin->getNodes()->getRegisteredNodesByType();
        $this->_registeredMarksByType = Vizy::$plugin->getNodes()->getRegisteredMarksByType();

        // Prepare node/mark classes for the collection
        $this->nodes = $this->_populateNodes($nodes);
    }

    public function __toString()
    {
        return (string)$this->renderHtml();
    }

    public function getNodes()
    {
        return $this->nodes;
    }

    public function getField()
    {
        return $this->field;
    }

    public function getRawNodes()
    {
        return $this->rawNodes;
    }

    public function renderHtml($config = [])
    {
        $html = [];

        $this->_prepNodesForHtml($config);

        foreach ($this->getNodes() as $node) {
            $html[] = $node->renderHtml();
        }

        $html = join($html);

        // Is this a completely empty field?
        if (strip_tags($html) === '') {
            $html = '';
        }

        return Template::raw($html);
    }

    public function renderStaticHtml($config = [])
    {
        $html = [];

        $this->_prepNodesForHtml($config);

        foreach ($this->getNodes() as $node) {
            $html[] = $node->renderStaticHtml();
        }

        $html = join($html);

        return Template::raw($html);
    }

    public function all()
    {
        return $this->query()->all();
    }

    public function query()
    {
        $arrayQuery = new ArrayQuery();
        $arrayQuery->primaryKeyName = 'type';

        return $arrayQuery->from($this->getNodes());
    }


    // Private Methods
    // =========================================================================

    private static function configure($object, $properties, $merge)
    {
        foreach ($properties as $name => $value) {
            if ($merge) {
                $value = array_merge($object->$name, $value);
            }

            $object->$name = $value;
        }

        return $object;
    }

    private function _populateNodes($nodes)
    {
        $result = [];

        foreach ($nodes as $nodeKey => $node) {
            // Drill into any nested nodes first
            if (isset($node['content'])) {
                $node['content'] = $this->_populateNodes($node['content']);
            }

            // Handle initalizing nested marks
            if (isset($node['marks'])) {
                foreach ($node['marks'] as $markKey => $mark) {
                    if ($class = ($this->_registeredMarksByType[$mark['type']] ?? null)) {
                        unset($mark['type']);

                        $node['marks'][$markKey] = Craft::createObject(array_merge($mark, [
                            'class' => $class,
                            'field' => $this->field,
                            'element' => $this->element,
                        ]));
                    } else {
                        // If an un-registered mark, drop it
                        unset($node['marks'][$markKey]);
                    }
                }
            }

            if ($class = ($this->_registeredNodesByType[$node['type']] ?? null)) {
                unset($node['type']);
                
                $nodeClass = Craft::createObject(array_merge($node, [
                    'class' => $class,
                    'field' => $this->field,
                    'element' => $this->element,
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

    private function _prepNodesForHtml($config = [])
    {
        foreach ($this->getNodes() as $node) {
            // Apply any node config set in templates
            foreach ($config as $type => $nodeConfig) {
                if ($node->getType() === $type) {
                    // Extract any mark config and apply to all marks of matching type
                    // Also remove it from the config so it doesn't clash with the `marks` prop.
                    $marksConfig = ArrayHelper::remove($nodeConfig, 'marks');

                    foreach ($node->content as $nodeContent) {
                        foreach ($nodeContent->marks as $mark) {
                            $markConfig = $marksConfig[$mark->getType()] ?? [];

                            if ($markConfig) {
                                // Check if we want to merge attributes, instead of replace. Useful for attrs.
                                $merge = ArrayHelper::remove($markConfig, 'merge');

                                self::configure($mark, $markConfig, $merge);
                            }
                        }
                    }

                    // Check if we want to merge attributes, instead of replace. Useful for attrs.
                    $merge = ArrayHelper::remove($nodeConfig, 'merge');

                    self::configure($node, $nodeConfig, $merge);
                }
            }
        }
    }

}
