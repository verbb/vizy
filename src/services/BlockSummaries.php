<?php
namespace verbb\vizy\services;

use verbb\vizy\Vizy;
use verbb\vizy\document\VizyBlock;
use verbb\vizy\events\RegisterBlockSummaryProvidersEvent;
use verbb\vizy\models\BlockSummary;
use verbb\vizy\models\BlockSummaryContext;
use verbb\vizy\models\BlockSummaryDefinition;
use verbb\vizy\models\BlockSummaryMedia;
use verbb\vizy\models\BlockSummaryTexts;
use verbb\vizy\models\BlockSummaryTypePresentation;
use verbb\vizy\models\BlockType;

use craft\base\Component;
use craft\elements\Asset;

final class BlockSummaries extends Component
{
    // Constants
    // =========================================================================

    public const EVENT_REGISTER_PROVIDERS = 'registerBlockSummaryProviders';


    // Properties
    // =========================================================================

    private ?array $providers = null;
    private array $requestCache = [];
    private BlockSummaryProjection $projection;
    private int $assetMetadataQueryCount = 0;


    // Public Methods
    // =========================================================================

    public function init(): void
    {
        parent::init();
        $this->projection = new BlockSummaryProjection();
    }

    public function getSummary(VizyBlock $block, ?array $validationState = null): BlockSummary
    {
        return $this->getSummaries([$block], $validationState)[$block->uid()] ?? $this->_unresolvedSummary($block, $validationState);
    }

    /**
     * Resolve summaries for many Blocks in one pass (shared asset metadata).
     */
    public function getSummaries(iterable $blocks, ?array $validationState = null): array
    {
        $blockList = is_array($blocks) ? $blocks : iterator_to_array($blocks, false);
        if (!$blockList) {
            return [];
        }

        $summaries = [];
        $providerGroups = [];
        $assetReferences = [];

        foreach ($blockList as $block) {
            $cacheKey = $this->_cacheKey($block, $validationState);
            if (isset($this->requestCache[$cacheKey])) {
                $summaries[$block->uid()] = $this->requestCache[$cacheKey];
                continue;
            }

            $type = $block->blockType();
            if (!$type) {
                $summary = $this->_unresolvedSummary($block, $validationState);
                $summaries[$block->uid()] = $this->_remember($cacheKey, $summary);
                continue;
            }

            $definition = BlockSummaryDefinition::fromConfig($type->summary ?? null);
            $inference = $this->projection->inferenceFor($type);
            $fieldSlots = $block->rawFieldValues();

            if ($definition->provider && isset($this->_providers()[$definition->provider])) {
                $providerGroups[$definition->provider][] = $block;
            }

            $titlePlacement = $this->_validPlacement($type, $definition->titlePlacementUid);
            $subtitlePlacement = $this->_validPlacement($type, $definition->subtitlePlacementUid);
            $mediaPlacement = $this->_validPlacement($type, $definition->mediaPlacementUid);

            $title = $this->projection->titleFromSlots($type, $fieldSlots, $titlePlacement, $inference);
            $subtitle = $this->projection->subtitleFromSlots($fieldSlots, $subtitlePlacement, $inference);

            $mediaReference = null;
            if ($mediaPlacement) {
                $mediaReference = $this->_extractAssetReference($fieldSlots, $mediaPlacement)
                    ?? $this->_firstInferredAssetReference($fieldSlots, $inference);
            } else {
                $mediaReference = $this->_firstInferredAssetReference($fieldSlots, $inference);
            }
            if ($mediaReference !== null) {
                $assetReferences[(string)$mediaReference] = $mediaReference;
            }

            $summary = new BlockSummary(
                blockUid: $block->uid(),
                blockTypeUid: $block->blockTypeUid(),
                title: $title,
                subtitle: $subtitle,
                media: null,
                enabled: $block->isEnabled(),
                resolved: $block->isResolved(),
                errorCount: $this->_errorCount($block, $validationState, false),
                descendantErrorCount: $this->_errorCount($block, $validationState, true),
            );
            $summaries[$block->uid()] = $this->_remember($cacheKey, $summary);
        }

        $assetMetadata = $this->_resolveAssetMetadata($assetReferences, $blockList[0]->document()->siteId());
        foreach ($summaries as $uid => $summary) {
            if ($summary->media !== null) {
                continue;
            }
            $block = $this->_findBlockByUid($blockList, $uid);
            if (!$block) {
                continue;
            }
            $type = $block->blockType();
            if (!$type) {
                continue;
            }
            $definition = BlockSummaryDefinition::fromConfig($type->summary ?? null);
            $inference = $this->projection->inferenceFor($type);
            $media = $this->projection->mediaFromSlots(
                $type,
                $block->rawFieldValues(),
                $this->_validPlacement($type, $definition->mediaPlacementUid),
                $inference,
                $assetMetadata,
            );
            if ($media === null) {
                continue;
            }
            $cacheKey = $this->_cacheKey($block, $validationState);
            $summaries[$uid] = $this->_remember($cacheKey, new BlockSummary(
                blockUid: $summary->blockUid,
                blockTypeUid: $summary->blockTypeUid,
                title: $summary->title,
                subtitle: $summary->subtitle,
                media: $media,
                enabled: $summary->enabled,
                resolved: $summary->resolved,
                errorCount: $summary->errorCount,
                descendantErrorCount: $summary->descendantErrorCount,
            ));
        }

        foreach ($providerGroups as $handle => $groupBlocks) {
            $this->_applyProvider($handle, $groupBlocks, $summaries, $validationState);
        }

        return $summaries;
    }

    public function getTypePresentation(BlockType $type): BlockSummaryTypePresentation
    {
        return BlockSummaryTypePresentation::fromBlockType($type);
    }

    public function assetMetadataQueryCount(): int
    {
        return $this->assetMetadataQueryCount;
    }

    public function reset(): void
    {
        $this->requestCache = [];
        $this->providers = null;
        $this->assetMetadataQueryCount = 0;
        $this->projection->reset();
    }


    // Private Methods
    // =========================================================================

    private function _schemaRevision(): string
    {
        $configs = [];
        foreach (Vizy::$plugin->getBlockTypes()->getAllBlockTypes() as $type) {
            $configs[(string)$type->uid] = $type->toConfig();
        }
        ksort($configs);
        return hash('sha256', json_encode($configs, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
    }

    private function _providers(): array
    {
        if ($this->providers !== null) {
            return $this->providers;
        }

        $event = new RegisterBlockSummaryProvidersEvent();
        $this->trigger(self::EVENT_REGISTER_PROVIDERS, $event);
        $this->providers = [];
        foreach ($event->providers as $handle => $definition) {
            if (!is_string($handle) || $handle === '' || !is_array($definition)) {
                continue;
            }
            $callable = $definition['callable'] ?? null;
            if (!is_callable($callable)) {
                continue;
            }
            $this->providers[$handle] = [
                'callable' => $callable,
                'requiresTargetMetadata' => (bool)($definition['requiresTargetMetadata'] ?? false),
            ];
        }
        return $this->providers;
    }

    private function _applyProvider(
        string $handle,
        array $blocks,
        array &$summaries,
        ?array $validationState,
    ): void {
        $provider = $this->_providers()[$handle] ?? null;
        if (!$provider) {
            return;
        }

        $context = new BlockSummaryContext(
            documentRevision: (string)($validationState['revision'] ?? 'none'),
            schemaRevision: $this->_schemaRevision(),
            siteId: $blocks[0]->document()->siteId(),
        );

        try {
            $results = ($provider['callable'])($blocks, $context);
        } catch (\Throwable) {
            return;
        }
        if (!is_array($results)) {
            return;
        }

        foreach ($blocks as $block) {
            $payload = $results[$block->uid()] ?? null;
            if (!is_array($payload)) {
                continue;
            }
            $existing = $summaries[$block->uid()] ?? null;
            if (!$existing) {
                continue;
            }
            $title = isset($payload['title']) ? BlockSummaryTexts::boundTitle((string)$payload['title'], $existing->title) : $existing->title;
            $subtitle = array_key_exists('subtitle', $payload)
                ? BlockSummaryTexts::boundSubtitle(is_string($payload['subtitle']) ? $payload['subtitle'] : null)
                : $existing->subtitle;
            $media = $existing->media;
            if (array_key_exists('media', $payload) && is_array($payload['media'])) {
                $mediaPayload = $payload['media'];
                $media = new BlockSummaryMedia(
                    kind: (string)($mediaPayload['kind'] ?? 'asset'),
                    reference: $mediaPayload['reference'] ?? null,
                    alt: isset($mediaPayload['alt']) ? (string)$mediaPayload['alt'] : null,
                    thumbnailUrl: isset($mediaPayload['thumbnailUrl']) ? (string)$mediaPayload['thumbnailUrl'] : null,
                );
            }
            $cacheKey = $this->_cacheKey($block, $validationState);
            $summaries[$block->uid()] = $this->_remember($cacheKey, new BlockSummary(
                blockUid: $existing->blockUid,
                blockTypeUid: $existing->blockTypeUid,
                title: $title,
                subtitle: $subtitle,
                media: $media,
                enabled: $existing->enabled,
                resolved: $existing->resolved,
                errorCount: $existing->errorCount,
                descendantErrorCount: $existing->descendantErrorCount,
            ));
        }
    }

    private function _unresolvedSummary(VizyBlock $block, ?array $validationState): BlockSummary
    {
        return new BlockSummary(
            blockUid: $block->uid(),
            blockTypeUid: $block->blockTypeUid(),
            title: BlockSummaryTexts::missingBlockTypeTitle(),
            subtitle: null,
            media: null,
            enabled: $block->isEnabled(),
            resolved: false,
            errorCount: $this->_errorCount($block, $validationState, false),
            descendantErrorCount: $this->_errorCount($block, $validationState, true),
        );
    }

    private function _validPlacement(BlockType $type, ?string $placementUid): ?string
    {
        $layout = $type->getFieldLayout();
        if (!$layout || !$placementUid) {
            return null;
        }
        return $this->projection->placementExists($layout, $placementUid) ? $placementUid : null;
    }

    private function _extractAssetReference(array $fieldSlots, string $placementUid): int|string|null
    {
        if (!array_key_exists($placementUid, $fieldSlots)) {
            return null;
        }
        $raw = $fieldSlots[$placementUid];
        if (is_int($raw)) {
            return $raw;
        }
        if (is_string($raw) && ctype_digit($raw)) {
            return (int)$raw;
        }
        if (!is_array($raw)) {
            return null;
        }
        $ids = array_values(array_filter($raw, static fn(mixed $item) => is_int($item) || (is_string($item) && ctype_digit($item))));
        if (count($ids) !== 1) {
            return null;
        }
        return is_int($ids[0]) ? $ids[0] : (int)$ids[0];
    }

    private function _firstInferredAssetReference(array $fieldSlots, \verbb\vizy\models\BlockSummaryInference $inference): int|string|null
    {
        foreach ($inference->mediaCandidates as $placementUid) {
            $reference = $this->_extractAssetReference($fieldSlots, $placementUid);
            if ($reference !== null) {
                return $reference;
            }
        }
        return null;
    }

    private function _resolveAssetMetadata(array $references, ?int $siteId): array
    {
        if (!$references) {
            return [];
        }

        $this->assetMetadataQueryCount++;
        $ids = array_values(array_map(static fn($id) => (int)$id, $references));
        $assets = Asset::find()
            ->id($ids)
            ->siteId($siteId)
            ->status(null)
            ->all();

        $metadata = [];
        foreach ($assets as $asset) {
            $metadata[(string)$asset->id] = [
                'alt' => $asset->title ?: null,
                'thumbnailUrl' => $asset->getThumbUrl(['width' => 80, 'height' => 80]) ?: null,
            ];
        }
        return $metadata;
    }

    private function _errorCount(VizyBlock $block, ?array $validationState, bool $descendants): int
    {
        $state = $validationState['blocks'][$block->uid()] ?? null;
        if (!is_array($state)) {
            return 0;
        }
        $key = $descendants ? 'descendantErrorCount' : 'errorCount';
        return max(0, (int)($state[$key] ?? 0));
    }

    private function _cacheKey(VizyBlock $block, ?array $validationState): string
    {
        $revision = (string)($validationState['revision'] ?? 'none');
        $slots = json_encode($block->rawFieldValues(), JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        return hash('sha256', implode('|', [
            $block->uid(),
            $block->blockTypeUid(),
            $block->isEnabled() ? '1' : '0',
            $block->isResolved() ? '1' : '0',
            $revision,
            $slots,
        ]));
    }

    private function _remember(string $cacheKey, BlockSummary $summary): BlockSummary
    {
        return $this->requestCache[$cacheKey] = $summary;
    }

    private function _findBlockByUid(array $blocks, string $uid): ?VizyBlock
    {
        foreach ($blocks as $block) {
            if ($block->uid() === $uid) {
                return $block;
            }
        }
        return null;
    }
}
