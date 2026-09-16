<?php
namespace verbb\vizy\controllers;

use verbb\vizy\Vizy;
use verbb\vizy\elements\Block;
use verbb\vizy\helpers\Icons;
use verbb\vizy\models\BlockType;

use Craft;
use craft\helpers\Json;
use craft\helpers\StringHelper;
use craft\helpers\UrlHelper;
use craft\models\FieldLayout;
use craft\models\FieldLayoutTab;
use craft\web\Controller;

use yii\web\NotFoundHttpException;
use yii\web\Response;

class BlockTypesController extends Controller
{
    // Public Methods
    // =========================================================================

    public function actionIndex(): Response
    {
        $this->requireAdmin();

        return $this->renderTemplate('vizy/block-types/index', [
            'blockTypes' => Vizy::$plugin->getBlockTypes()->getAllBlockTypes(),
        ]);
    }

    /**
     * Edit screen for a Block Type (standalone CP or field-settings slideout).
     *
     * `$blockType` is supplied by `asModelFailure()` so validation errors survive
     * without a session round-trip. `$name` seeds a new Block Type's name so
     * typing an unknown name into the field settings combobox carries over.
     */
    public function actionEdit(?string $uid = null, ?BlockType $blockType = null, ?string $name = null): Response
    {
        $this->requireAdmin();

        if ($blockType === null) {
            $blockType = $uid ? Vizy::$plugin->getBlockTypes()->getBlockTypeByUid($uid) : null;
            if ($uid && !$blockType) {
                throw new NotFoundHttpException('Block Type not found.');
            }

            if (!$blockType) {
                $blockType = $this->_newBlockType();

                if ($name !== null && trim($name) !== '') {
                    $blockType->name = trim($name);
                    $blockType->handle = StringHelper::toCamelCase($blockType->name);
                }
            }
        }

        // One CP screen serves both the standalone page and the slideout opened from
        // Vizy field settings, so global Block Type editing is always the same form.
        // "New" means not yet in Project Config — a failed first save still carries UID,
        // so the store is the source of truth rather than the route segment.
        $isNew = Vizy::$plugin->getBlockTypes()->getBlockTypeByUid((string)$blockType->uid) === null;

        $screen = $this->asCpScreen()
            ->title($isNew ? Craft::t('vizy', 'New Block Type') : $blockType->name)
            ->addCrumb(Craft::t('app', 'Settings'), 'settings')
            ->addCrumb(Craft::t('vizy', 'Vizy'), 'vizy/settings')
            ->addCrumb(Craft::t('vizy', 'Block Types'), 'vizy/settings/block-types')
            ->action('vizy/block-types/save')
            ->redirectUrl('vizy/settings/block-types')
            // Save returns to the index; Cmd+S and "Save and continue editing" come back
            // here, as on Craft's own settings screens. `{uid}` is resolved against the
            // saved model, so a brand new type lands on its own edit screen rather than `new`.
            ->addAltAction(Craft::t('app', 'Save and continue editing'), [
                'redirect' => 'vizy/settings/block-types/{uid}',
                'shortcut' => true,
                'retainScroll' => true,
            ]);

        if (!$isNew) {
            // Header Save menu, matching Fields / Entry Types — not footer buttons in the body.
            $screen
                ->addAltAction(Craft::t('app', 'Duplicate'), [
                    'action' => 'vizy/block-types/duplicate',
                ])
                ->addAltAction(Craft::t('app', 'Delete'), [
                    'action' => 'vizy/block-types/delete',
                    'redirect' => 'vizy/settings/block-types',
                    'destructive' => true,
                    'confirm' => Craft::t(
                        'vizy',
                        'Are you sure you want to delete this block type? Blocks already created with it will no longer resolve.',
                    ),
                ]);
        }

        return $screen->contentTemplate('vizy/block-types/_edit', [
            'blockType' => $blockType,
            'isNew' => $isNew,
            'iconPickerHtml' => Icons::pickerHtml('icon', $blockType->icon, ['id' => 'icon']),
            'colorInputHtml' => Icons::colorInputHtml('color', $blockType->color, ['id' => 'color']),
            'previewImagePickerHtml' => Icons::previewImagePickerHtml('previewImage', $blockType->previewImage, ['id' => 'previewImage']),
        ]);
    }

    public function actionSave(): ?Response
    {
        $this->requireAdmin();
        $this->requirePostRequest();

        $blockType = $this->_populateBlockTypeFromPost();
        if (!Vizy::$plugin->getBlockTypes()->saveBlockType($blockType)) {
            return $this->asModelFailure(
                $blockType,
                Craft::t('vizy', 'Couldn’t save Block Type.'),
                'blockType',
            );
        }

        // The Vizy field settings slideout reads `blockType` off the success payload
        // to patch its picker in place, so a full page reload never discards
        // unsaved field settings.
        return $this->asModelSuccess(
            $blockType,
            Craft::t('vizy', 'Block Type saved.'),
            'blockType',
            [
                'blockType' => [
                    'uid' => (string)$blockType->uid,
                    'name' => $blockType->name,
                    'handle' => $blockType->handle,
                    'icon' => is_string($blockType->icon) ? $blockType->icon : null,
                    'iconSvg' => Vizy::$plugin->getIcons()->blockTypeIconSvg($blockType->icon),
                    'color' => $blockType->color,
                    'template' => $blockType->template,
                    'previewImage' => $blockType->previewImage,
                    'previewImageUrl' => Vizy::$plugin->getBlockPreviewImages()->resolveUrl($blockType->previewImage),
                ],
            ],
        );
    }

    public function actionDelete(): Response
    {
        $this->requireAdmin();
        $this->requirePostRequest();

        // The index table posts `id`; the edit screen posts `uid`. Both are the
        // Block Type UID.
        $uid = (string)($this->request->getBodyParam('uid') ?? $this->request->getRequiredBodyParam('id'));

        $blockType = Vizy::$plugin->getBlockTypes()->getBlockTypeByUid($uid);
        if (!$blockType) {
            throw new NotFoundHttpException('Block Type not found.');
        }

        if (!Vizy::$plugin->getBlockTypes()->deleteBlockType($blockType)) {
            return $this->asFailure(Craft::t('vizy', 'Couldn’t delete Block Type.'));
        }

        return $this->asSuccess(
            Craft::t('vizy', 'Block Type deleted.'),
            redirect: UrlHelper::cpUrl('vizy/settings/block-types'),
        );
    }

    public function actionDuplicate(): Response
    {
        $this->requireAdmin();
        $this->requirePostRequest();

        $uid = $this->request->getRequiredBodyParam('uid');
        $source = Vizy::$plugin->getBlockTypes()->getBlockTypeByUid($uid);
        if (!$source) {
            throw new NotFoundHttpException('Block Type not found.');
        }

        $duplicate = Vizy::$plugin->getBlockTypes()->duplicateBlockType($source);

        return $this->asSuccess(
            Craft::t('vizy', 'Block Type duplicated.'),
            redirect: UrlHelper::cpUrl('vizy/settings/block-types/' . $duplicate->uid),
        );
    }


    // Private Methods
    // =========================================================================

    private function _newBlockType(): BlockType
    {
        return $this->_newBlockTypeWithUid(StringHelper::UUID());
    }

    private function _newBlockTypeWithUid(string $uid): BlockType
    {
        $blockType = new BlockType([
            'uid' => $uid,
            // Deliberately blank: a placeholder name would be silently accepted, and
            // it also suppresses the handle generator (which only listens while the
            // handle is empty and untouched).
            'name' => '',
            'handle' => '',
        ]);
        $layout = new FieldLayout(['uid' => StringHelper::UUID(), 'type' => Block::class]);

        // Match Craft Entry Types: one empty tab, no pre-seeded Content Areas or fields.
        // Authors add layout elements from the designer libraries.
        $tab = new FieldLayoutTab([
            'uid' => StringHelper::UUID(),
            'name' => Craft::t('app', 'Content'),
            'layout' => $layout,
        ]);
        $tab->setElements([]);
        $layout->setTabs([$tab]);

        $blockType->setFieldLayout($layout);

        return $blockType;
    }

    private function _populateBlockTypeFromPost(): BlockType
    {
        $uid = (string)$this->request->getRequiredBodyParam('uid');
        $existing = Vizy::$plugin->getBlockTypes()->getBlockTypeByUid($uid);
        $blockType = $existing ?? new BlockType(['uid' => $uid]);

        $blockType->name = (string)$this->request->getBodyParam('name', '');
        $blockType->handle = (string)$this->request->getBodyParam('handle', '');
        $blockType->icon = $this->request->getBodyParam('icon') ?: null;
        $blockType->template = $this->request->getBodyParam('template') ?: null;
        $blockType->previewImage = BlockType::normalizePreviewImage($this->request->getBodyParam('previewImage'));
        $blockType->color = BlockType::normalizeColor($this->request->getBodyParam('color'));

        $layoutConfig = Json::decodeIfJson($this->request->getBodyParam('fieldLayout')) ?? [];
        $layoutConfig['type'] = Block::class;
        if ($existing?->getFieldLayout()?->uid) {
            $layoutConfig['uid'] ??= $existing->getFieldLayout()->uid;
        }
        $blockType->setFieldLayout(FieldLayout::createFromConfig($layoutConfig));

        return $blockType;
    }
}
