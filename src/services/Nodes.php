<?php
namespace verbb\vizy\services;

use verbb\vizy\base\NodeInterface;
use verbb\vizy\deprecations\VizyNodesRegistryDeprecations;
use verbb\vizy\events\RegisterMarksEvent;
use verbb\vizy\events\RegisterNodesEvent;
use verbb\vizy\helpers\Nodes as NodesHelper;

use craft\base\Component;

/**
 * Deprecated husk — NodeCollection has been removed.
 *
 * Editor vocabulary and HTML live on {@see Extensions}. Methods here only exist
 * so Vizy 3 listeners get a deprecation instead of a missing component. Removed
 * in Vizy 5.
 */
class Nodes extends Component
{
    // Traits
    // =========================================================================

    use VizyNodesRegistryDeprecations;


    // Public Methods
    // =========================================================================

    /**
     * @deprecated Prefer Extensions `$event->nodes[]`. Removed in Vizy 5.
     */
    public function getRegisteredNodes(): array
    {
        $this->warnNodesRegistry(
            'getRegisteredNodes',
            'Nodes::getRegisteredNodes() is deprecated. Register node classes on Extensions::EVENT_REGISTER_EXTENSIONS. It will be removed in Vizy 5.',
        );

        $event = new RegisterNodesEvent(['nodes' => []]);
        $this->trigger(self::EVENT_REGISTER_NODES, $event);

        return $event->nodes;
    }

    /**
     * @deprecated Prefer Extensions::getNodes(). Removed in Vizy 5.
     */
    public function getRegisteredNodesByType(): array
    {
        $this->warnNodesRegistry(
            'getRegisteredNodesByType',
            'Nodes::getRegisteredNodesByType() is deprecated. Use Extensions::getNodes(). It will be removed in Vizy 5.',
        );

        $byType = [];
        foreach ($this->getRegisteredNodes() as $registeredNode) {
            if (is_string($registeredNode) && class_exists($registeredNode) && isset($registeredNode::$type)) {
                $byType[$registeredNode::$type] = $registeredNode;
            }
        }

        return $byType;
    }

    /**
     * @deprecated Prefer Extensions `$event->marks[]`. Removed in Vizy 5.
     */
    public function getRegisteredMarks(): array
    {
        $this->warnNodesRegistry(
            'getRegisteredMarks',
            'Nodes::getRegisteredMarks() is deprecated. Register mark classes on Extensions::EVENT_REGISTER_EXTENSIONS. It will be removed in Vizy 5.',
        );

        $event = new RegisterMarksEvent(['marks' => []]);
        $this->trigger(self::EVENT_REGISTER_MARKS, $event);

        return $event->marks;
    }

    /**
     * @deprecated Prefer Extensions::getMarks(). Removed in Vizy 5.
     */
    public function getRegisteredMarksByType(): array
    {
        $this->warnNodesRegistry(
            'getRegisteredMarksByType',
            'Nodes::getRegisteredMarksByType() is deprecated. Use Extensions::getMarks(). It will be removed in Vizy 5.',
        );

        $byType = [];
        foreach ($this->getRegisteredMarks() as $registeredMark) {
            if (is_string($registeredMark) && class_exists($registeredMark) && isset($registeredMark::$type)) {
                $byType[$registeredMark::$type] = $registeredMark;
            }
        }

        return $byType;
    }

    /**
     * @deprecated Instance-tree HTML is retired; use VizyDocument::render(). Removed in Vizy 5.
     */
    public function renderNode(NodeInterface $node): string
    {
        $this->warnNodesRegistry(
            'renderNode',
            'Nodes::renderNode() is deprecated. Use VizyDocument::render(). It will be removed in Vizy 5.',
        );

        return NodesHelper::renderNode($node);
    }
}
