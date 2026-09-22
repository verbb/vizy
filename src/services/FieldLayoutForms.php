<?php
namespace verbb\vizy\services;

use verbb\vizy\Vizy;
use verbb\vizy\elements\Block;
use verbb\vizy\fields\VizyField;
use verbb\vizy\helpers\FieldSlotValues;
use verbb\vizy\helpers\Matrix as MatrixHelper;

use Craft;
use craft\base\Component;
use craft\base\ElementInterface;
use craft\fieldlayoutelements\CustomField;
use craft\fields\Assets;
use craft\fields\Categories;
use craft\fields\Entries;
use craft\fields\Json as JsonField;
use craft\fields\Lightswitch;
use craft\fields\Link;
use craft\fields\Matrix;
use craft\fields\PlainText;
use craft\fields\Tags;
use craft\fields\Users;
use craft\helpers\Html;
use craft\helpers\Json;
use craft\models\FieldLayout;
use craft\web\View;

/**
 * Renders one Block's Craft FieldLayout for either initial bootstrap or the
 * authenticated lazy endpoint. Keeping one renderer prevents those paths from
 * drifting in namespace, adapter metadata, layout guards, or asset handling.
 */
final class FieldLayoutForms extends Component
{
    // Public Methods
    // =========================================================================

    /**
     * Validates an untrusted endpoint item before rendering it.
     */
    public function renderRequestItem(
        array $context,
        ElementInterface $owner,
        VizyField $field,
        object $item,
    ): array {
        $blockObject = $item->block ?? null;
        if (!is_object($blockObject)) {
            return $this->_fail('invalidBlock');
        }
        $blockHash = $this->blockHash($blockObject);
        if (!hash_equals($blockHash, (string)($item->blockHash ?? ''))) {
            return $this->_fail('staleBlockHash');
        }
        $destination = Json::decode(Json::encode($item->destination ?? null));
        if (!is_array($destination)) {
            return $this->_fail('invalidDestination');
        }

        return $this->_render(
            $context,
            $owner,
            $field,
            $blockObject,
            $destination,
            (int)($item->documentRevision ?? 0),
            (string)($item->requestId ?? ''),
            true,
        );
    }

    /**
     * Renders a server-trusted canonical Block into the initial editor payload.
     *
     * Assets remain registered on the parent CP view, so they are emitted by the
     * initial response rather than drained into per-layout append fragments.
     */
    public function renderInitial(
        array $context,
        ElementInterface $owner,
        VizyField $field,
        array $block,
        array $destination,
    ): array {
        return $this->_render(
            $context,
            $owner,
            $field,
            Json::decode(Json::encode($block), false),
            $destination,
            0,
            '',
            false,
        );
    }

    public function blockHash(mixed $block): string
    {
        return hash('sha256', $this->_stableJson($block));
    }


    // Private Methods
    // =========================================================================

    private function _render(
        array $context,
        ElementInterface $owner,
        VizyField $field,
        object $blockObject,
        array $destination,
        int $documentRevision,
        string $requestId,
        bool $captureAssets,
    ): array {
        $blockJson = Json::decode(Json::encode($blockObject));
        // Saved field values can legitimately be large. Loading their form must
        // not impose a smaller content budget than the canonical document path.
        if (!is_array($blockJson)) {
            return $this->_fail('invalidBlock');
        }
        $attrs = $blockJson['attrs'] ?? null;
        if (
            ($blockJson['type'] ?? null) !== 'vizyBlock'
            || !is_array($attrs)
            || !is_string($attrs['blockUid'] ?? null)
            || !is_string($attrs['blockTypeUid'] ?? null)
            || !is_bool($attrs['enabled'] ?? null)
            || !is_array($attrs['fieldSlots'] ?? null)
            // Blocks are leaves; Hosted documents live in fieldSlots. Their
            // ordinary rich text must not count against a separate form limit.
            || (isset($blockJson['content']) && $blockJson['content'] !== [])
        ) {
            return $this->_fail('invalidBlock');
        }
        if (!$this->_destinationIsWellFormed($destination)) {
            return $this->_fail('invalidDestination');
        }

        $blockType = Vizy::$plugin->getBlockTypes()->getBlockTypeByUid($attrs['blockTypeUid']);
        if (!$blockType || !$this->_destinationAllows($field, $blockType->uid, $destination)) {
            return $this->_fail('unknownBlockType');
        }
        $layout = $blockType->getFieldLayout();
        if (!$layout || !$layout->uid) {
            return $this->_fail('staleLayout');
        }

        $blockHash = $this->blockHash($blockObject);
        $layoutHash = hash('sha256', $this->_stableJson($layout->getConfig() ?? []));
        $layout = $this->_matrixInputLayout($layout);
        $namespace = sprintf('vizyHost[%s][%s][fields]', $context['nonce'], $attrs['blockUid']);

        $block = new Block();
        $block->setOwner($owner);
        $block->setField($field);
        $block->setType($blockType);
        $block->setFieldLayout($layout);
        $block->setBlockUid($attrs['blockUid']);
        $block->setScenario((string)$context['scenario']);

        // Matrix-in-Block: Entries live on MatrixAnchor. Point Block.id at the
        // anchor so Craft Matrix inputHtml / create-entry resolve nested Entries.
        $anchor = null;
        $anchorUid = is_string($attrs['matrixAnchorUid'] ?? null) ? $attrs['matrixAnchorUid'] : null;
        if (Vizy::$plugin->getAnchors()->blockHasMatrixFields($layout)) {
            // Bind native Matrix's subsequent render-only row requests to this
            // authorized placement. The namespace travels with every widget,
            // including default rows created during Craft's initialization.
            $matrixContext = $context;
            unset($matrixContext['token']);
            $matrixContext['matrixBlockUid'] = $attrs['blockUid'];
            $matrixContext['matrixBlockTypeUid'] = $attrs['blockTypeUid'];
            $matrixContext['matrixAnchorUid'] = $anchorUid;
            $token = rtrim(strtr(base64_encode(Craft::$app->getSecurity()->hashData(Json::encode($matrixContext))), '+/', '-_'), '=');
            $namespace = sprintf('vizyHost[%s][%s][fields]', $token, $attrs['blockUid']);
            $anchor = Vizy::$plugin->getAnchors()->getAnchor(
                $owner,
                $field,
                $attrs['blockUid'],
                $anchorUid,
            );
            if (!$anchor && $anchorUid) {
                return $this->_fail('unresolvedMatrixContent');
            }
            if ($anchor) {
                // Anchors loaded by UID have no FieldLayout until we attach the
                // Block Type layout — required for Matrix getFieldValue.
                $anchor->setFieldLayout($layout);
                $block->id = $anchor->id;
                $block->setMatrixAnchor($anchor);
                $anchorUid = $anchor->uid;
            } else {
                // Native inline Matrix requires a non-null owner identity to
                // render. This sentinel is only a form projection; row requests
                // authenticate the signed namespace and never persist it.
                $block->id = -1;
            }
        }

        $placements = [];
        foreach ($layout->getCustomFieldElements() as $placement) {
            $craftField = $placement->getField();
            $adapterId = $this->_adapterId($craftField);
            if ($adapterId === null) {
                return $this->_fail('unsupportedFieldCapability', [
                    'placementUid' => $placement->uid,
                    'fieldHandle' => $craftField->handle,
                    'fieldType' => $craftField::class,
                    'fieldName' => $craftField->name,
                    'fieldTypeLabel' => $craftField::displayName(),
                ]);
            }
            if ($craftField instanceof Matrix) {
                // Redisplay submitted values after failed validation. Loading
                // the saved anchor alone would silently replace the user's edits.
                if (array_key_exists($placement->uid, $attrs['fieldSlots'])) {
                    $block->setFieldValue($craftField->handle, MatrixHelper::normalizeContent(
                        $craftField,
                        $attrs['fieldSlots'][$placement->uid],
                        $anchor ?? $block,
                    ));
                } elseif ($anchor) {
                    $block->setFieldValue($craftField->handle, MatrixHelper::nestedEntryQuery($craftField, $anchor));
                }
            } elseif (array_key_exists($placement->uid, $attrs['fieldSlots'])) {
                $block->setFieldValue(
                    $craftField->handle,
                    FieldSlotValues::forSetFieldValue(
                        $craftField,
                        $attrs['fieldSlots'][$placement->uid],
                        $block,
                    ),
                );
            }
            $wrapperId = Html::id("{$namespace}[fields][{$craftField->handle}]") . '-field';
            $placementMeta = [
                'fieldLayoutElementUid' => $placement->uid,
                'fieldUid' => $craftField->uid,
                'fieldHandle' => $craftField->handle,
                'fieldType' => $craftField::class,
                'adapterId' => $adapterId,
                'wrapperId' => $wrapperId,
            ];
            if ($craftField instanceof Matrix && is_string($anchorUid)) {
                $placementMeta['matrixAnchorUid'] = $anchorUid;
            }
            $placements[] = $placementMeta;
        }

        $view = Craft::$app->getView();
        // Block FieldLayouts must not inherit the Entry form's `fields` (or any
        // other) View namespace. CustomField already wraps each placement in
        // namespaceInputs(..., 'fields'). If we nest under the Entry's `fields`
        // namespace, Selectize/AssetSelectInput JS bake `fields-vizyHost-…` ids
        // while Html::namespaceHtml only applies our vizyHost prefix → HTML ids
        // are `vizyHost-…` and `$('#id')` misses → Selectize onChange throws on
        // `$wrapper`. Isolate to a clean namespace root for the whole render.
        $previousNamespace = $view->getNamespace();
        $view->setNamespace(null);
        // On an initial CP response, keep asset bundles/styles registered on the
        // page but capture field-instance JS. It must execute only after the
        // preloaded HTML has been adopted into its final NodeView hosts.
        //
        // Buffer both queues Craft fields use:
        // - registerJs() → startJsBuffer (Selectize, Redactor, …)
        // - registerScript() → startScriptBuffer (CKEditor type=module, …)
        // Without the script buffer, CKEditor modules leak onto the entry page,
        // run before the textarea exists, and throw editor-missing-sourceelement.
        if (!$captureAssets) {
            $view->startJsBuffer();
            $view->startScriptBuffer();
        }
        // Carry the signed ancestry through both initial and AJAX rendering.
        // Each hosted field appends its own placement before issuing a context.
        $previousDepth = HostedVizy::renderingDepth();
        $previousEntryFieldUid = HostedVizy::entryFieldUid();
        $previousEntryPlacementUid = HostedVizy::entryPlacementUid();
        $previousPath = HostedVizy::renderingPath();
        HostedVizy::setRenderingPath($context['hostedPath'] ?? []);
        HostedVizy::setRenderingDepth((int)($context['hostedDepth'] ?? 0));
        $entryFieldUid = (string)($context['entryFieldUid'] ?? $context['fieldUid'] ?? '');
        HostedVizy::setEntryFieldUid($entryFieldUid !== '' ? $entryFieldUid : null);
        HostedVizy::setEntryPlacementUid($context['ownerPlacementUid'] ?? null);
        try {
            try {
                $html = $view->namespaceInputs(
                    fn() => $layout->createForm($block, false)->render(),
                    $namespace,
                );
            } catch (\Throwable $exception) {
                Craft::error(
                    'Vizy Block FieldLayout render failed: ' . $exception->getMessage(),
                    __METHOD__,
                );
                return $this->_fail('fieldLayoutRenderFailed', [
                    'blockUid' => $attrs['blockUid'],
                    'detail' => $exception->getMessage(),
                ]);
            }
        } finally {
            HostedVizy::setRenderingDepth($previousDepth);
            HostedVizy::setEntryFieldUid($previousEntryFieldUid);
            HostedVizy::setEntryPlacementUid($previousEntryPlacementUid);
            HostedVizy::setRenderingPath($previousPath);
            $initialBodyHtml = !$captureAssets
                ? $this->_captureInitialBodyHtml($view)
                : '';
            $view->setNamespace($previousNamespace);
        }
        foreach ($placements as $placement) {
            $needle = 'id="' . $placement['wrapperId'] . '"';
            $attributes = sprintf(
                'id="%s" data-vizy-field-layout-element-uid="%s" data-vizy-field-handle="%s" data-vizy-adapter-id="%s"',
                Html::encode($placement['wrapperId']),
                Html::encode($placement['fieldLayoutElementUid']),
                Html::encode($placement['fieldHandle']),
                Html::encode($placement['adapterId']),
            );
            $html = str_replace($needle, $attributes, $html);
        }

        $tabLabels = [];
        foreach ($layout->getTabs() as $tab) {
            $tabLabels[] = (string)$tab->name;
        }

        return ['ok' => true, 'data' => [
            'requestId' => $requestId,
            'documentRevision' => $documentRevision,
            'blockHash' => $blockHash,
            'blockUid' => $attrs['blockUid'],
            'blockTypeUid' => $attrs['blockTypeUid'],
            'fieldLayoutUid' => $layout->uid,
            'fieldLayoutHash' => $layoutHash,
            'hostNamespace' => $namespace,
            'html' => $html,
            'headHtml' => $captureAssets ? $view->getHeadHtml() : '',
            'bodyHtml' => $captureAssets ? $view->getBodyHtml() : $initialBodyHtml,
            'fields' => $placements,
            'tabLabels' => $tabLabels,
        ]];
    }

    private function _matrixInputLayout(FieldLayout $layout): FieldLayout
    {
        if (!Vizy::$plugin->getAnchors()->blockHasMatrixFields($layout)) {
            return $layout;
        }

        // Cards/indexes save through Craft's independent owner/draft endpoints.
        // Embedded Vizy blocks submit Matrix with their containing document.
        // Clone the render layout so a shared field retains its configured mode.
        $renderLayout = clone $layout;
        $tabs = [];
        foreach ($layout->getTabs() as $tab) {
            $renderTab = clone $tab;
            $renderTab->setLayout($renderLayout);
            $elements = [];
            foreach ($tab->getElements() as $element) {
                $renderElement = clone $element;
                if ($renderElement instanceof CustomField) {
                    $renderElement->setField($element->getField());
                    $field = $renderElement->getField();
                    if ($field instanceof Matrix) {
                        $field->viewMode = Matrix::VIEW_MODE_BLOCKS;
                        $field->showCardsInGrid = false;
                        MatrixHelper::bindToLayout($field);
                    }
                }
                $elements[] = $renderElement;
            }
            $renderTab->setElements($elements);
            $tabs[] = $renderTab;
        }
        $renderLayout->setTabs($tabs);
        return $renderLayout;
    }

    /**
     * Drain field-instance script tags + registerJs blobs for bootstrap bodyHtml.
     * Script tags (CKEditor modules) must come first so imports resolve before
     * any classic registerJs that might depend on them.
     */
    private function _captureInitialBodyHtml(View $view): string
    {
        $scriptHtml = '';
        $scripts = $view->clearScriptBuffer();
        if (is_array($scripts)) {
            foreach ([View::POS_HEAD, View::POS_BEGIN, View::POS_END] as $pos) {
                if (!empty($scripts[$pos])) {
                    $scriptHtml .= implode("\n", $scripts[$pos]) . "\n";
                }
            }
        }

        $js = $view->clearJsBuffer(true, true) ?: '';

        return $scriptHtml . $js;
    }

    private function _fail(string $error, array $extra = []): array
    {
        return [
            'ok' => false,
            'error' => $error,
            'message' => $this->_authorMessage($error, $extra),
            'extra' => $extra,
        ];
    }

    /**
     * Plain-language copy for CP authors. Codes stay on `error` for support.
     */
    private function _authorMessage(string $error, array $extra): string
    {
        return match ($error) {
            'unresolvedMatrixContent' => Craft::t('vizy', 'This Block’s stored Matrix content could not be resolved. Its reference and your edits have been preserved. Ask an administrator to restore the missing content before saving.'),
            'unsupportedFieldCapability' => Craft::t(
                'vizy',
                'This Block could not render “{name}” ({type}). That field cannot run inside Vizy Blocks (nested Craft elements or missing field).',
                [
                    'name' => (string)($extra['fieldName'] ?? $extra['fieldHandle'] ?? 'Field'),
                    'type' => (string)($extra['fieldTypeLabel'] ?? $extra['fieldType'] ?? 'Unknown'),
                ],
            ),
            'fieldLayoutRenderFailed' => Craft::t(
                'vizy',
                'This Block’s fields failed to render.{detail}',
                [
                    'detail' => !empty($extra['detail'])
                        ? ' ' . Craft::t('vizy', 'Details: {detail}', ['detail' => (string)$extra['detail']])
                        : '',
                ],
            ),
            'unknownBlockType' => Craft::t('vizy', 'This Block’s type is missing or no longer allowed on this field.'),
            'staleLayout' => Craft::t('vizy', 'This Block’s field layout is missing. Re-save the Block Type.'),
            'invalidBlock', 'invalidDestination', 'staleBlockHash' => Craft::t(
                'vizy',
                'This Block could not load its fields (invalid editor request). Reload the page and try again.',
            ),
            default => Craft::t(
                'vizy',
                'This Block could not load its fields ({code}). Reload the page and try again.',
                ['code' => $error],
            ),
        };
    }

    private function _destinationIsWellFormed(mixed $destination): bool
    {
        if (!is_array($destination) || !is_string($destination['kind'] ?? null)) {
            return false;
        }
        return match ($destination['kind']) {
            'root' => true,
            default => false,
        };
    }

    private function _destinationAllows(VizyField $field, string $blockTypeUid, array $destination): bool
    {
        if ($destination['kind'] === 'root') {
            return in_array($blockTypeUid, $field->getAllowedBlockTypeUids(), true);
        }
        // Content Area destinations retired; Hosted nesting authorizes via field layout mounts.
        return false;
    }

    /**
     * Transport adapter id for a Block FieldLayout placement.
     *
     * Mirrors FieldLifecycle canSerialize: MatrixAnchor mounts; other nested
     * Element owners cannot. Everything else gets a typed adapter or generic.
     */
    private function _adapterId(\craft\base\FieldInterface $field): ?string
    {
        if (!Vizy::$plugin->getFieldLifecycle()->canSerialize($field)) {
            return null;
        }

        if ($field instanceof VizyField) {
            return 'vizy.hosted';
        }
        if ($field instanceof Matrix) {
            return 'craft.matrix';
        }
        if ($field instanceof Lightswitch) {
            return 'craft.lightswitch';
        }
        if ($field instanceof Assets) {
            return 'craft.assets';
        }
        if ($field instanceof Entries) {
            return 'craft.entries';
        }
        if ($field instanceof Categories) {
            return 'craft.categories';
        }
        if ($field instanceof Tags) {
            return 'craft.tags';
        }
        if ($field instanceof Users) {
            return 'craft.users';
        }
        if ($field instanceof PlainText) {
            return 'craft.plainText';
        }
        if ($field instanceof JsonField) {
            return 'craft.json';
        }
        if ($field instanceof Link) {
            return 'craft.link';
        }

        // Dropdown, Date, Table, Money, third-party pure fields, …
        return 'craft.generic';
    }

    private function _stableJson(mixed $value): string
    {
        // Match the browser's JSON string encoding, including URLs and literal
        // Unicode line separators in ordinary field values.
        return Json::encode($this->_normalizeForHash($value), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_LINE_TERMINATORS);
    }

    private function _normalizeForHash(mixed $value): mixed
    {
        if ($value instanceof \stdClass) {
            $properties = get_object_vars($value);
            ksort($properties, SORT_STRING);
            return (object)array_map($this->_normalizeForHash(...), $properties);
        }
        if (is_array($value)) {
            if (!array_is_list($value)) {
                ksort($value, SORT_STRING);
            }
            return array_map($this->_normalizeForHash(...), $value);
        }
        return $value;
    }
}
