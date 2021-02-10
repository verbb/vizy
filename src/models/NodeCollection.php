<?php
namespace verbb\vizy\models;

use verbb\vizy\Vizy;

use Craft;
use craft\base\Model;
use craft\helpers\Template;

use yii2mod\query\ArrayQuery;

class NodeCollection extends Model
{
    // Properties
    // =========================================================================

    protected $field;
    protected $nodes = [];


    // Public Methods
    // =========================================================================

    public function __construct($field, $nodes = [])
    {
        $this->field = $field;

        $registeredNodes = Vizy::$plugin->getNodes()->getRegisteredNodes();

        // Create node objects for all items
        foreach ($nodes as $node) {
            foreach ($registeredNodes as $class) {
                $renderClass = new $class($field, $node);

                if ($renderClass->matching()) {
                    if ($renderClass->isDeleted()) {
                        break;
                    }

                    $this->nodes[] = $renderClass;
                    break;
                }
            }
        }
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

    public function renderHtml()
    {
        $html = [];

        foreach ($this->getNodes() as $node) {
            $html[] = $node->renderHtml();
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
        return (new ArrayQuery())->from($this->getNodes());
    }

    public function getRawNodes()
    {
        $data = [];

        foreach ($this->getNodes() as $node) {
            $data[] = $node->node;
        }

        return $data;
    }

}
