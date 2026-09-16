<?php
namespace verbb\vizy\base;

use verbb\vizy\Vizy;
use verbb\vizy\legacy\LegacySchemaMaps;
use verbb\vizy\legacy\OwnerContentMigrator;
use verbb\vizy\legacy\Vizy3PromotionOrchestrator;
use verbb\vizy\services\Anchors;
use verbb\vizy\services\AssetUploads;
use verbb\vizy\services\BlockPreviewImages;
use verbb\vizy\services\BlockSummaries;
use verbb\vizy\services\BlockTypes;
use verbb\vizy\services\Cache;
use verbb\vizy\services\Content;
use verbb\vizy\services\ContentBaselines;
use verbb\vizy\services\Documents;
use verbb\vizy\services\EditorAcknowledgements;
use verbb\vizy\services\EditorConfigs;
use verbb\vizy\services\EditorContexts;
use verbb\vizy\services\EditorManifests;
use verbb\vizy\services\Extensions;
use verbb\vizy\services\FieldLayoutForms;
use verbb\vizy\services\FieldLifecycle;
use verbb\vizy\services\Icons;
use verbb\vizy\services\InitialFieldLayouts;
use verbb\vizy\services\MatrixPersistence;
use verbb\vizy\services\MultisiteDocuments;
use verbb\vizy\services\Nodes;
use verbb\vizy\services\RefTags;
use verbb\vizy\services\Renderer;
use verbb\vizy\web\assets\field\VizyAsset;

use nystudio107\pluginvite\services\VitePluginService;
use verbb\base\helpers\Plugin;
use verbb\base\LogTrait;

trait PluginTrait
{
    // Static Methods
    // =========================================================================

    public static function config(): array
    {
        Plugin::bootstrapPlugin('vizy');

        return [
            'components' => [
                'anchors' => Anchors::class,
                'assetUploads' => AssetUploads::class,
                'blockTypes' => BlockTypes::class,
                'blockSummaries' => BlockSummaries::class,
                'blockPreviewImages' => BlockPreviewImages::class,
                'blockContentUsages' => \verbb\vizy\services\BlockContentUsages::class,
                'cache' => Cache::class,
                'content' => Content::class,
                'contentBaselines' => ContentBaselines::class,
                'documents' => Documents::class,
                'editorConfigs' => EditorConfigs::class,
                'editorAcknowledgements' => EditorAcknowledgements::class,
                'editorContexts' => EditorContexts::class,
                'editorManifests' => EditorManifests::class,
                'extensions' => Extensions::class,
                'fieldLifecycle' => FieldLifecycle::class,
                'fieldLayoutForms' => FieldLayoutForms::class,
                'icons' => Icons::class,
                'initialFieldLayouts' => InitialFieldLayouts::class,
                'legacySchemaMaps' => LegacySchemaMaps::class,
                'matrixPersistence' => MatrixPersistence::class,
                'ownerContentMigrator' => OwnerContentMigrator::class,
                'promotionOrchestrator' => Vizy3PromotionOrchestrator::class,
                'multisiteDocuments' => MultisiteDocuments::class,
                'nodes' => Nodes::class,
                'refTags' => RefTags::class,
                'renderer' => Renderer::class,
                'vite' => [
                    'class' => VitePluginService::class,
                    'assetClass' => VizyAsset::class,
                    'useDevServer' => true,
                    'devServerPublic' => 'http://localhost:4001/',
                    'errorEntry' => 'js/main.js',
                    'cacheKeySuffix' => '',
                    'devServerInternal' => 'http://localhost:4001/',
                    'checkDevServer' => true,
                    'includeReactRefreshShim' => false,
                ],
            ],
        ];
    }


    // Traits
    // =========================================================================

    use LogTrait;


    // Properties
    // =========================================================================

    public static ?Vizy $plugin = null;

    private array $_nestedMatrixFields = [];


    // Public Methods
    // =========================================================================

    public function getAnchors(): Anchors
    {
        return $this->get('anchors');
    }

    public function getAssetUploads(): AssetUploads
    {
        return $this->get('assetUploads');
    }

    public function getBlockTypes(): BlockTypes
    {
        return $this->get('blockTypes');
    }

    public function getBlockSummaries(): BlockSummaries
    {
        return $this->get('blockSummaries');
    }

    public function getBlockPreviewImages(): BlockPreviewImages
    {
        return $this->get('blockPreviewImages');
    }

    public function getBlockContentUsages(): \verbb\vizy\services\BlockContentUsages
    {
        return $this->get('blockContentUsages');
    }

    public function getCache(): Cache
    {
        return $this->get('cache');
    }

    public function getContent(): Content
    {
        return $this->get('content');
    }

    public function getContentBaselines(): ContentBaselines
    {
        return $this->get('contentBaselines');
    }

    public function getDocuments(): Documents
    {
        return $this->get('documents');
    }

    public function getEditorConfigs(): EditorConfigs
    {
        return $this->get('editorConfigs');
    }

    public function getEditorAcknowledgements(): EditorAcknowledgements
    {
        return $this->get('editorAcknowledgements');
    }

    public function getEditorContexts(): EditorContexts
    {
        return $this->get('editorContexts');
    }

    public function getEditorManifests(): EditorManifests
    {
        return $this->get('editorManifests');
    }

    public function getExtensions(): Extensions
    {
        return $this->get('extensions');
    }

    public function getFieldLifecycle(): FieldLifecycle
    {
        return $this->get('fieldLifecycle');
    }

    public function getFieldLayoutForms(): FieldLayoutForms
    {
        return $this->get('fieldLayoutForms');
    }

    public function getIcons(): Icons
    {
        return $this->get('icons');
    }

    public function getInitialFieldLayouts(): InitialFieldLayouts
    {
        return $this->get('initialFieldLayouts');
    }

    public function getLegacySchemaMaps(): LegacySchemaMaps
    {
        return $this->get('legacySchemaMaps');
    }

    public function getMatrixPersistence(): MatrixPersistence
    {
        return $this->get('matrixPersistence');
    }

    public function getOwnerContentMigrator(): OwnerContentMigrator
    {
        return $this->get('ownerContentMigrator');
    }

    public function getPromotionOrchestrator(): Vizy3PromotionOrchestrator
    {
        return $this->get('promotionOrchestrator');
    }

    public function getMultisiteDocuments(): MultisiteDocuments
    {
        return $this->get('multisiteDocuments');
    }

    public function getNodes(): Nodes
    {
        return $this->get('nodes');
    }

    public function getRefTags(): RefTags
    {
        return $this->get('refTags');
    }

    public function getRenderer(): Renderer
    {
        return $this->get('renderer');
    }

    public function getVite(): VitePluginService
    {
        return $this->get('vite');
    }

    public function setNestedMatrixFields(mixed $value): void
    {
        $this->_nestedMatrixFields[] = $value;
    }

    public function getNestedMatrixFields(): array
    {
        return $this->_nestedMatrixFields;
    }
}
