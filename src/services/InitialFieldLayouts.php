<?php
namespace verbb\vizy\services;

use verbb\vizy\Vizy;
use verbb\vizy\fields\VizyField;

use craft\base\Component;
use craft\base\ElementInterface;

/**
 * Builds every mountable FieldLayout form for the editor bootstrap.
 *
 * Vizy 3 shipped complete forms with the page. Client-side lazy/eager mount left
 * authors with shell→fields layout shifts. Server-render the whole opening
 * document so TipTap adopts ready HTML with no render-batch on first paint.
 * New Blocks still prefetch via the batch endpoint before insert.
 */
final class InitialFieldLayouts extends Component
{
    // Public Methods
    // =========================================================================

    public function build(
        array $document,
        array $context,
        ElementInterface $owner,
        VizyField $field,
    ): array {
        $layouts = [];

        $walk = function(array $nodes, array $destination) use (
            &$walk,
            &$layouts,
            $context,
            $owner,
            $field,
        ): void {
            foreach ($nodes as $node) {
                if (!is_array($node)) {
                    continue;
                }

                $content = is_array($node['content'] ?? null) ? $node['content'] : [];
                if (($node['type'] ?? null) !== 'vizyBlock') {
                    // Walk layout/column prose; vizyBlock is a TipTap leaf.
                    $walk($content, $destination);
                    continue;
                }

                $attrs = is_array($node['attrs'] ?? null) ? $node['attrs'] : [];
                $blockTypeUid = is_string($attrs['blockTypeUid'] ?? null)
                    ? $attrs['blockTypeUid']
                    : '';
                $blockType = $blockTypeUid !== ''
                    ? Vizy::$plugin->getBlockTypes()->getBlockTypeByUid($blockTypeUid)
                    : null;
                if ($blockType?->getFieldLayout()?->uid) {
                    $result = Vizy::$plugin->getFieldLayoutForms()->renderInitial(
                        $context,
                        $owner,
                        $field,
                        $node,
                        $destination,
                    );
                    if ($result['ok']) {
                        $layouts[] = ['ok' => true, ...$result['data']];
                    } else {
                        // Do not drop failures — the editor paints them on the Block
                        // instead of an empty white card.
                        $layouts[] = [
                            'ok' => false,
                            'blockUid' => $attrs['blockUid'] ?? null,
                            'blockTypeUid' => $blockTypeUid,
                            'error' => $result['error'],
                            'message' => $result['message'] ?? null,
                            ...$result['extra'],
                        ];
                    }
                }
                // Nested editors mount via Hosted Vizy fieldSlots, not TipTap children.
            }
        };

        $walk(
            is_array($document['content'] ?? null) ? $document['content'] : [],
            ['kind' => 'root'],
        );

        return $layouts;
    }
}
