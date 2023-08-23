<?php
namespace verbb\vizy\services;

use verbb\vizy\base\MarkInterface;
use verbb\vizy\base\NodeInterface;
use verbb\vizy\events\RegisterNodesEvent;
use verbb\vizy\events\RegisterMarksEvent;
use verbb\vizy\helpers\Nodes as NodesHelper;
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
            marks\TextStyle::class,
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

    public function renderNode(NodeInterface $node): string
    {
        return NodesHelper::renderNode($node);
    }

}
