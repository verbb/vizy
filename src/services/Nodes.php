<?php
namespace verbb\vizy\services;

use verbb\vizy\events\RegisterNodesEvent;
use verbb\vizy\events\RegisterMarksEvent;
use verbb\vizy\nodes as allnodes;
use verbb\vizy\marks;

use craft\base\Component;

class Nodes extends Component
{
    // Constants
    // =========================================================================

    public const EVENT_REGISTER_NODES = 'registerNodes';
    public const EVENT_REGISTER_MARKS = 'registerMarks';


    // Properties
    // =========================================================================

    private array $_registeredNodesByType = [];
    private array $_registeredMarksByType = [];


    // Public Methods
    // =========================================================================

    public function getRegisteredNodes(): array
    {
        $nodes = [
            allnodes\Blockquote::class,
            allnodes\BulletList::class,
            allnodes\CodeBlock::class,
            allnodes\HardBreak::class,
            allnodes\Heading::class,
            allnodes\HorizontalRule::class,
            allnodes\Iframe::class,
            allnodes\Image::class,
            allnodes\ListItem::class,
            allnodes\MediaEmbed::class,
            allnodes\OrderedList::class,
            allnodes\Paragraph::class,
            allnodes\Table::class,
            allnodes\TableCell::class,
            allnodes\TableHeader::class,
            allnodes\TableRow::class,
            allnodes\Text::class,
            allnodes\VizyBlock::class,
        ];

        $event = new RegisterNodesEvent([
            'nodes' => $nodes,
        ]);

        $this->trigger(self::EVENT_REGISTER_NODES, $event);

        return $event->nodes;
    }

    public function getRegisteredNodesByType(): array
    {
        if ($this->_registeredNodesByType) {
            return $this->_registeredNodesByType;
        }

        foreach ($this->getRegisteredNodes() as $registeredNode) {
            $this->_registeredNodesByType[$registeredNode::$type] = $registeredNode;
        }

        return $this->_registeredNodesByType;
    }

    public function getRegisteredMarks(): array
    {
        $marks = [
            marks\Bold::class,
            marks\Code::class,
            marks\Highlight::class,
            marks\Italic::class,
            marks\Link::class,
            marks\Strike::class,
            marks\Subscript::class,
            marks\Superscript::class,
            marks\Underline::class,
        ];

        $event = new RegisterMarksEvent([
            'marks' => $marks,
        ]);

        $this->trigger(self::EVENT_REGISTER_MARKS, $event);

        return $event->marks;
    }

    public function getRegisteredMarksByType(): array
    {
        if ($this->_registeredMarksByType) {
            return $this->_registeredMarksByType;
        }

        foreach ($this->getRegisteredMarks() as $registeredMark) {
            $this->_registeredMarksByType[$registeredMark::$type] = $registeredMark;
        }

        return $this->_registeredMarksByType;
    }

    public function renderNode($node, $prevNode = null, $nextNode = null): string
    {
        $html = [];

        if ($node->marks) {
            foreach ($node->marks as $mark) {
                if ($this->markShouldOpen($mark, $prevNode)) {
                    $html[] = $mark->renderOpeningTag();
                }
            }
        }

        $html[] = $node->renderOpeningTag();

        if ($node->content) {
            foreach ($node->content as $index => $nestedNode) {
                $prevNestedNode = $node->content[$index - 1] ?? null;
                $nextNestedNode = $node->content[$index + 1] ?? null;

                $html[] = $this->renderNode($nestedNode, $prevNestedNode, $nextNestedNode);
                $prevNode = $nestedNode;
            }
        } else if ($text = $node->getText()) {
            $html[] = $text;
        }

        if (!$node->selfClosing()) {
            $html[] = $node->renderClosingTag();

            if ($node->marks) {
                foreach (array_reverse($node->marks) as $mark) {
                    if ($this->markShouldClose($mark, $nextNode)) {
                        $html[] = $mark->renderClosingTag();
                    }
                }
            }
        }

        return implode($html);
    }


    // Private Methods
    // =========================================================================

    private function markShouldOpen($mark, $prevNode): bool
    {
        return $this->nodeHasMark($prevNode, $mark);
    }

    private function markShouldClose($mark, $nextNode): bool
    {
        return $this->nodeHasMark($nextNode, $mark);
    }

    private function nodeHasMark($node, $mark): bool
    {
        if (!$node) {
            return true;
        }

        if (!property_exists($node, 'marks')) {
            return true;
        }

        // Other node has same mark
        foreach ($node->marks as $otherMark) {
            if ($mark == $otherMark) {
                return false;
            }
        }

        return true;
    }

}
