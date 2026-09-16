<?php
namespace verbb\vizy\controllers;

use verbb\vizy\Vizy;
use verbb\vizy\helpers\EditorConfigPresentation;
use verbb\vizy\services\EditorConfigs;
use verbb\vizy\web\assets\editorconfigsettings\EditorConfigSettingsAsset;

use Craft;
use craft\helpers\Json;
use craft\helpers\UrlHelper;
use craft\web\Controller;

use yii\web\NotFoundHttpException;
use yii\web\Response;

class EditorConfigsController extends Controller
{
    // Static Methods
    // =========================================================================

    /**
     * Posted toolbar entries, which are IDs.
     *
     * A dropdown object was allowed through here untouched for a while, back when one carried
     * its own membership. It is dropped now rather than stringified to "Array": the only way
     * to post one is to be an Advanced tab left open across the change.
     */
    private static function _toolbarEntries(mixed $toolbar): array
    {
        if (!is_array($toolbar)) {
            return [];
        }

        return array_values(array_map(
            'strval',
            array_filter($toolbar, static fn(mixed $entry): bool => !is_array($entry)),
        ));
    }

    /**
     * Posted dropdown membership: a map of dropdown name to member IDs.
     *
     * Null when nothing was posted, which is not the same as an empty map — see
     * `EditorConfigs::normalizeDropdowns`, where absent membership means "whatever this dropdown
     * ships with". Anything that is not a list of scalars is dropped here so the service sees a
     * well-formed shape and can spend its errors on the decisions rather than on the transport.
     */
    private static function _dropdownMembers(mixed $dropdowns): ?array
    {
        if (!is_array($dropdowns) || array_is_list($dropdowns)) {
            return null;
        }

        $normalized = [];
        foreach ($dropdowns as $name => $members) {
            if (!is_array($members) || !array_is_list($members)) {
                continue;
            }
            $normalized[(string)$name] = array_values(array_map(
                'strval',
                array_filter($members, static fn(mixed $member): bool => is_scalar($member)),
            ));
        }

        return $normalized;
    }


    // Public Methods
    // =========================================================================

    public function actionIndex(): Response
    {
        $this->requireAdmin();

        return $this->renderTemplate('vizy/editor-configs/index', [
            'configs' => Vizy::$plugin->getEditorConfigs()->getAllConfigs(),
        ]);
    }

    public function actionEdit(?string $id = null): Response
    {
        $this->requireAdmin();

        $service = Vizy::$plugin->getEditorConfigs();
        $isNew = $id === null || $id === 'new';
        $isFile = false;
        $filename = null;
        $fileJson = null;

        if ($isNew) {
            // New configs start from the standard config's capabilities rather than an empty
            // editor, so a config is usable the moment it is created.
            $config = $service->getConfig(EditorConfigs::DEFAULT_ID);
            $config['label'] = '';
            $id = '';
        } else {
            $config = $service->getConfig($id);
            if (!$config) {
                throw new NotFoundHttpException('Editor Config not found.');
            }
            $isFile = ($config['source'] ?? null) === EditorConfigs::SOURCE_FILE;
            $filename = is_string($config['filename'] ?? null) ? $config['filename'] : null;
            if ($isFile) {
                $fileJson = $service->fileContents($id);
            }
        }

        // The visual builder is only for Project Config entries. File configs are identity
        // plus a read-only dump of the JSON on disk — no asset bundle, no Save.
        if (!$isFile) {
            Craft::$app->getView()->registerAssetBundle(EditorConfigSettingsAsset::class);
        }

        $screen = $this->asCpScreen()
            ->title($isNew ? Craft::t('vizy', 'New Editor Config') : $config['label'])
            ->addCrumb(Craft::t('app', 'Settings'), 'settings')
            ->addCrumb(Craft::t('vizy', 'Vizy'), 'vizy/settings')
            ->addCrumb(Craft::t('vizy', 'Editor Configs'), 'vizy/settings/editor-configs');

        if (!$isFile) {
            $screen
                ->action('vizy/editor-configs/save')
                ->redirectUrl('vizy/settings/editor-configs')
                // Save returns to the index; Cmd+S and the Save menu's "Save and continue
                // editing" come back here, as they do on Craft's own settings screens. `{id}`
                // is resolved against the save response, so a brand new config lands on its
                // own edit screen rather than on `new`.
                ->addAltAction(Craft::t('app', 'Save and continue editing'), [
                    'redirect' => 'vizy/settings/editor-configs/{id}',
                    'shortcut' => true,
                    'retainScroll' => true,
                ]);

            // Header Save menu — same pattern as Block Types / Craft Fields.
            // Standard config cannot be deleted; new screens have nothing to delete yet.
            if (!$isNew && $id !== EditorConfigs::DEFAULT_ID) {
                $screen->addAltAction(Craft::t('app', 'Delete'), [
                    'action' => 'vizy/editor-configs/delete',
                    'redirect' => 'vizy/settings/editor-configs',
                    'destructive' => true,
                    'confirm' => Craft::t('vizy', 'Are you sure you want to delete this editor config?'),
                ]);
            }
        } else {
            $screen->submitButtonLabel(null);
        }

        $vars = [
            'configId' => $id,
            'config' => $config,
            'isNew' => $isNew,
            'isFile' => $isFile,
            'filename' => $filename,
            'fileJson' => $fileJson,
            'isStandard' => $id === EditorConfigs::DEFAULT_ID,
        ];

        if (!$isFile) {
            $vars['editorConfigInitial'] = [
                'config' => [
                    'capabilities' => [
                        'nodes' => $config['capabilities']['nodes'],
                        'marks' => $config['capabilities']['marks'],
                        'extensions' => $config['capabilities']['extensions'] ?? [],
                    ],
                    'headings' => $config['headings'],
                    'toolbar' => $config['toolbar'],
                    // Empty for a config whose dropdowns have never been trimmed. Only the
                    // ones an author has actually changed are stored; the rest follow their
                    // registration, which is also how they keep picking up members a later
                    // Vizy release adds.
                    'dropdowns' => $config['dropdowns'] ?? [],
                    'bubble' => $config['bubble'],
                    'gutterInsert' => (bool)($config['gutterInsert'] ?? true),
                    'slashInsert' => (bool)($config['slashInsert'] ?? true),
                ],
                // Two catalogs, one palette. They are assembled and looked up separately —
                // only a dropdown has `members` — and offered together, merged into one row
                // by the `paletteRank` both carry.
                'toolbarCatalog' => EditorConfigPresentation::toolbarCatalog(),
                'dropdownCatalog' => EditorConfigPresentation::dropdownCatalog(),
                'bubbleCatalog' => EditorConfigPresentation::bubbleCatalog(),
                'capabilityCatalog' => EditorConfigPresentation::capabilityCatalog(),
            ];
        }

        return $screen->contentTemplate('vizy/editor-configs/_edit', $vars);
    }

    public function actionSave(): ?Response
    {
        $this->requireAdmin();
        $this->requirePostRequest();

        // `newId` is only posted by the create form; an existing config's ID is
        // immutable, so editing never reads it.
        $newId = trim((string)$this->request->getBodyParam('newId', ''));
        $existingId = trim((string)$this->request->getBodyParam('id', ''));
        $isNew = $existingId === '';
        $id = $isNew ? $newId : $existingId;
        $label = trim((string)$this->request->getBodyParam('label', ''));

        // Failures return to the form they came from: the create screen for a new
        // config, otherwise that config's edit screen.
        $failureUrl = UrlHelper::cpUrl('vizy/settings/editor-configs/' . ($isNew ? 'new' : $id));

        if ($id === '') {
            $message = Craft::t('vizy', 'An Editor Config ID is required.');

            return $this->asFailure($message) ?? $this->redirect($failureUrl);
        }

        $service = Vizy::$plugin->getEditorConfigs();

        if ($service->isFileConfig($id)) {
            $message = Craft::t('vizy', 'Editor configs that live in files cannot be saved from the control panel.');

            return $this->asFailure($message) ?? $this->redirect($failureUrl);
        }

        if ($isNew && $service->getConfig($id)) {
            $message = Craft::t('vizy', 'An Editor Config with the ID “{id}” already exists.', ['id' => $id]);

            return $this->asFailure($message) ?? $this->redirect($failureUrl);
        }

        try {
            $payload = $this->_buildPayloadFromRequest();
            $payload['label'] = $label;
            $service->saveConfig($id, $payload);
        } catch (\Throwable $exception) {
            return $this->asFailure($exception->getMessage()) ?? $this->redirect($failureUrl);
        }

        // Where to go next is the form's decision, not this action's: Save posts the
        // screen's index redirect, and Cmd+S or "Save and continue editing" posts
        // `.../{id}`, which is resolved here against the config that was just saved. The
        // index is only the fallback for a post that named nowhere.
        $redirect = $this->getPostedRedirectUrl((object)['id' => $id, 'label' => $label])
            ?? UrlHelper::cpUrl('vizy/settings/editor-configs');

        // Vizy field settings read `editorConfig` off the payload to patch their
        // select in place, so opening the slideout never costs unsaved field
        // settings a page reload.
        return $this->asSuccess(
            Craft::t('vizy', 'Editor Config saved.'),
            data: [
                'editorConfig' => [
                    'id' => $id,
                    'label' => $label !== '' ? $label : $id,
                ],
            ],
            redirect: $redirect,
        );
    }

    public function actionDelete(): Response
    {
        $this->requireAdmin();
        $this->requirePostRequest();

        $id = (string)$this->request->getRequiredBodyParam('id');
        if ($id === EditorConfigs::DEFAULT_ID) {
            return $this->asFailure(Craft::t('vizy', 'The standard Editor Config cannot be deleted.'));
        }

        $service = Vizy::$plugin->getEditorConfigs();
        if ($service->isFileConfig($id)) {
            return $this->asFailure(Craft::t('vizy', 'Editor configs that live in files cannot be deleted from the control panel.'));
        }

        $service->removeConfig($id);

        return $this->asSuccess(
            Craft::t('vizy', 'Editor Config deleted.'),
            redirect: UrlHelper::cpUrl('vizy/settings/editor-configs'),
        );
    }


    // Private Methods
    // =========================================================================

    private function _buildPayloadFromRequest(): array
    {
        $advanced = (string)$this->request->getBodyParam('advancedConfig', '');
        if ($advanced !== '') {
            $decoded = Json::decodeIfJson($advanced);
            if (!is_array($decoded)) {
                throw new \InvalidArgumentException(Craft::t('vizy', 'Invalid JSON.'));
            }

            $capabilities = $decoded['capabilities'] ?? [];

            return [
                'capabilities' => [
                    'nodes' => array_values(array_map('strval', $capabilities['nodes'] ?? [])),
                    'marks' => array_values(array_map('strval', $capabilities['marks'] ?? [])),
                    'extensions' => array_values(array_map('strval', $capabilities['extensions'] ?? [])),
                ],
                'headings' => [
                    'levels' => array_map('intval', $decoded['headings']['levels'] ?? [2, 3, 4]),
                ],
                'toolbar' => self::_toolbarEntries($decoded['toolbar'] ?? []),
                'dropdowns' => self::_dropdownMembers($decoded['dropdowns'] ?? null),
                'bubble' => is_array($decoded['bubble'] ?? null) ? [
                    'enabled' => (bool)($decoded['bubble']['enabled'] ?? true),
                    'items' => array_values(array_map('strval', $decoded['bubble']['items'] ?? [])),
                ] : EditorConfigPresentation::defaultBubble(),
                'gutterInsert' => (bool)($decoded['gutterInsert'] ?? true),
                'slashInsert' => (bool)($decoded['slashInsert'] ?? true),
            ];
        }

        $toolbar = Json::decodeIfJson((string)$this->request->getBodyParam('toolbarJson', '[]'));
        $dropdowns = Json::decodeIfJson((string)$this->request->getBodyParam('dropdownsJson', '{}'));
        $bubble = Json::decodeIfJson((string)$this->request->getBodyParam('bubbleJson', '{}'));

        return [
            'capabilities' => [
                'nodes' => array_values(array_filter(array_map('strval', $this->request->getBodyParam('capabilityNodes', [])))),
                'marks' => array_values(array_filter(array_map('strval', $this->request->getBodyParam('capabilityMarks', [])))),
                'extensions' => array_values(array_filter(array_map('strval', $this->request->getBodyParam('capabilityExtensions', [])))),
            ],
            'headings' => [
                'levels' => array_map('intval', $this->request->getBodyParam('headingLevels', [2, 3, 4])),
            ],
            'toolbar' => self::_toolbarEntries($toolbar),
            'dropdowns' => self::_dropdownMembers($dropdowns),
            'bubble' => is_array($bubble) ? [
                'enabled' => (bool)($bubble['enabled'] ?? true),
                'items' => array_values(array_map('strval', $bubble['items'] ?? [])),
            ] : EditorConfigPresentation::defaultBubble(),
            // Hidden inputs post "1" / "0" from the Editor Config builder.
            'gutterInsert' => (string)$this->request->getBodyParam('gutterInsert', '1') !== '0',
            'slashInsert' => (string)$this->request->getBodyParam('slashInsert', '1') !== '0',
        ];
    }
}
