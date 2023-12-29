<?php
namespace verbb\vizy\nodes;

use verbb\vizy\base\Node;
use verbb\vizy\helpers\StringHelper;

use craft\base\ElementInterface;
use craft\helpers\Html;
use craft\helpers\Json;

class MediaEmbed extends Node
{
    // Properties
    // =========================================================================

    public static ?string $type = 'mediaEmbed';


    // Public Methods
    // =========================================================================

    public function renderNode(array $config = []): ?string
    {
        return $this->attrs['data']['html'] ?? null;
    }

    public function normalizeValue(?ElementInterface $element = null): ?array
    {
        // A little extra help if there are any encoded characters in the HTML
        $html = $this->attrs['data']['html'] ?? '';
        $this->rawNode['attrs']['data']['html'] = Html::decode($html);

        return $this->rawNode;
    }

    public function serializeValue(ElementInterface $element = null): ?array
    {
        $value = parent::serializeValue($element);

        // In case the payload contains emoji's, the field will throw an error
        $value = Json::decode(Json::encode($value));

        return $value;
    }
}
