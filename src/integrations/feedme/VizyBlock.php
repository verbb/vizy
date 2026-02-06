<?php
namespace verbb\vizy\integrations\feedme;

use craft\helpers\Json;

use Tiptap\Core\Node;
use Tiptap\Utils\HTML;

class VizyBlock extends Node
{
    public static $name = 'vizyBlock';

    public function parseHTML()
    {
        return [
            [
                'tag' => 'vizy-block',
                'getAttrs' => function ($DOMNode) {
                    $content = $DOMNode->textContent;

                    if (is_string($content) && Json::isJsonObject($content)) {
                        return Json::decode($content);
                    }

                    return [];
                },
            ],
        ];
    }
}
