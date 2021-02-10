<?php
namespace verbb\vizy\services;

use verbb\vizy\Vizy;
use verbb\vizy\nodes as allnodes;
use verbb\vizy\marks;

use Craft;
use craft\base\Component;

class Nodes extends Component
{
    // Properties
    // =========================================================================


    // Public Methods
    // =========================================================================

    public function getRegisteredNodes()
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
            allnodes\OrderedList::class,
            allnodes\Paragraph::class,
            allnodes\Table::class,
            allnodes\TableCell::class,
            allnodes\TableHeader::class,
            allnodes\TableRow::class,
            allnodes\VizyBlock::class,
        ];

        return $nodes;
    }

    public function getRegisteredMarks()
    {
        $marks = [
            marks\Bold::class,
            marks\Code::class,
            marks\Italic::class,
            marks\Link::class,
            marks\Subscript::class,
            marks\Underline::class,
            marks\Strike::class,
            marks\Superscript::class,
        ];

        return $marks;
    }

    public function renderNode($field, $node)
    {
        $html = [];

        if (isset($node['marks'])) {
            foreach ($node['marks'] as $mark) {
                foreach ($this->getRegisteredMarks() as $class) {
                    $renderClass = new $class($mark);

                    if ($renderClass->matching()) {
                        $html[] = $renderClass->renderOpeningTag();
                    }
                }
            }
        }

        foreach ($this->getRegisteredNodes() as $class) {
            $renderClass = new $class($field, $node);

            if ($renderClass->matching()) {
                $html[] = $renderClass->renderOpeningTag();
                break;
            }
        }

        if (isset($node['content'])) {
            foreach ($node['content'] as $nestedNode) {
                if ($nodeHtml = $this->renderNode($field, $nestedNode)) {
                    $html[] = $nodeHtml;
                }
            }
        } elseif (isset($node['text'])) {
            $html[] = htmlentities($node['text'], ENT_QUOTES);
        } elseif ($text = $renderClass->text()) {
            $html[] = $text;
        }

        foreach ($this->getRegisteredNodes() as $class) {
            $renderClass = new $class($field, $node);

            if ($renderClass->selfClosing()) {
                continue;
            }

            if ($renderClass->matching()) {
                $html[] = $renderClass->renderClosingTag();
            }
        }

        if (isset($node['marks'])) {
            foreach (array_reverse($node['marks']) as $mark) {
                foreach ($this->getRegisteredMarks() as $class) {
                    $renderClass = new $class($mark);

                    if ($renderClass->matching()) {
                        $html[] = $renderClass->renderClosingTag();
                    }
                }
            }
        }

        return join($html);
    }

}
