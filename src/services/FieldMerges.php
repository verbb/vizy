<?php
namespace verbb\vizy\services;

use verbb\vizy\Vizy;
use verbb\vizy\content\Change;

use Craft;
use craft\base\Component;
use craft\base\FieldInterface;
use craft\base\MergeableFieldInterface;
use craft\helpers\Json;
use craft\models\FieldLayout;

use InvalidArgumentException;

/** Builds read-only, reproducible plans before Craft field merges touch schema or content. */
final class FieldMerges extends Component
{
    // Public Methods
    // =========================================================================

    public function analyze(string $outgoingSelector, string $persistingSelector, int $sampleLimit = 50): array
    {
        if ($sampleLimit < 0 || $sampleLimit > 1000) {
            throw new InvalidArgumentException('sampleLimit must be between 0 and 1000.');
        }

        $outgoing = $this->_field($outgoingSelector, 'outgoing');
        $persisting = $this->_field($persistingSelector, 'persisting');
        if ($outgoing->uid === $persisting->uid) {
            throw new InvalidArgumentException('The outgoing and persisting fields must be different fields.');
        }

        $diagnostics = [];
        if (!$outgoing instanceof MergeableFieldInterface) {
            $diagnostics[] = $this->_diagnostic('error', 'outgoingNotMergeable', "The outgoing field {$outgoing->handle} does not support Craft field merges.");
        }
        if (!$persisting instanceof MergeableFieldInterface) {
            $diagnostics[] = $this->_diagnostic('error', 'persistingNotMergeable', "The persisting field {$persisting->handle} does not support Craft field merges.");
        }
        if ($outgoing instanceof MergeableFieldInterface && $persisting instanceof MergeableFieldInterface) {
            $reason = null;
            if (!$outgoing->canMergeInto($persisting, $reason)) {
                $diagnostics[] = $this->_diagnostic('error', 'cannotMergeInto', $reason ?: 'The outgoing field cannot be merged into the persisting field.');
            }
            $reason = null;
            if (!$persisting->canMergeFrom($outgoing, $reason)) {
                $diagnostics[] = $this->_diagnostic('error', 'cannotMergeFrom', $reason ?: 'The persisting field cannot accept the outgoing field.');
            }
        }

        $layouts = Craft::$app->getFields()->findFieldUsages($outgoing);
        $layoutPlans = [];
        foreach ($layouts as $layout) {
            $layoutPlan = $this->_layoutPlan($layout, $outgoing, $persisting);
            $layoutPlans[] = $layoutPlan;
            if (!$layout->id && !$layout->uid) {
                $diagnostics[] = $this->_diagnostic('error', 'unsavableLayout', 'An outgoing-field layout has neither an ID nor a UID.', $layoutPlan);
            }
            if ($layoutPlan['ambiguous']) {
                $diagnostics[] = $this->_diagnostic('error', 'ambiguousLayout', 'Both fields occur in a layout that does not support repeated instances.', $layoutPlan);
            }
        }

        $map = Vizy::$plugin->getContent()->captureFieldLocations($outgoing->uid);
        $samples = [];
        $rowIds = [];
        $elementIds = [];
        $siteIds = [];
        $groups = [];
        $scan = Vizy::$plugin->getContent()->modifyFieldValues($map, function(mixed $value, array $context) use (
            &$samples,
            &$rowIds,
            &$elementIds,
            &$siteIds,
            &$groups,
            $sampleLimit,
        ): array {
            $rowIds[(int)$context['rowId']] = true;
            $elementIds[(int)$context['elementId']] = true;
            $siteIds[(int)$context['siteId']] = true;

            $sample = $this->_contentLocation($context);
            if (count($samples) < $sampleLimit) {
                $samples[] = $sample;
            }

            // Instance IDs and node offsets vary by owner. The grouped path is
            // the stable schema route that a later apply step must preserve.
            $schemaPath = $this->_schemaPath($context);
            $key = hash('sha256', Json::encode($schemaPath));
            if (!isset($groups[$key])) {
                $groups[$key] = ['path' => $schemaPath, 'occurrences' => 0];
            }
            $groups[$key]['occurrences']++;

            return Change::unchanged();
        }, ['dryRun' => true]);

        ksort($groups);
        $siteIds = array_map('intval', array_keys($siteIds));
        sort($siteIds);
        $blocking = array_values(array_filter($diagnostics, fn(array $diagnostic): bool => $diagnostic['severity'] === 'error'));
        $plan = [
            'version' => 1,
            'status' => $blocking ? 'blocked' : 'ready',
            'safeToApply' => false,
            'fields' => [
                'outgoing' => $this->_fieldDetails($outgoing),
                'persisting' => $this->_fieldDetails($persisting),
            ],
            'mapping' => [
                'fieldUids' => [$outgoing->uid => $persisting->uid],
                'placements' => array_values(array_merge(...array_map(fn(array $layout): array => $layout['outgoingPlacements'], $layoutPlans))),
            ],
            'layouts' => $layoutPlans,
            'content' => [
                'occurrences' => $scan['matched'],
                'rows' => count($rowIds),
                'elements' => count($elementIds),
                'siteIds' => $siteIds,
                'locationGroups' => array_values($groups),
                'samples' => $samples,
                'samplesTruncated' => $scan['matched'] > count($samples),
            ],
            'locationMapHash' => hash('sha256', Json::encode($map)),
            'locationMap' => $map,
            'diagnostics' => $diagnostics,
            'nextStep' => $blocking
                ? 'Resolve every error and run the analysis again. No merge has been performed.'
                : 'Analysis is complete. No merge has been performed; the apply and verification workflow is not yet available.',
        ];
        $plan['planHash'] = hash('sha256', Json::encode($plan));

        return $plan;
    }


    // Private Methods
    // =========================================================================

    private function _field(string $selector, string $role): FieldInterface
    {
        $selector = trim($selector);
        if ($selector === '') {
            throw new InvalidArgumentException("A {$role} field handle or UID is required.");
        }
        $field = Craft::$app->getFields()->getFieldByHandle($selector)
            ?? Craft::$app->getFields()->getFieldByUid($selector);
        if (!$field) {
            throw new InvalidArgumentException("The {$role} field '{$selector}' was not found.");
        }
        return $field;
    }

    private function _fieldDetails(FieldInterface $field): array
    {
        return [
            'uid' => $field->uid,
            'handle' => $field->handle,
            'name' => $field->name,
            'type' => $field::class,
            'multiInstance' => $field::isMultiInstance(),
        ];
    }

    private function _layoutPlan(FieldLayout $layout, FieldInterface $outgoing, FieldInterface $persisting): array
    {
        $outgoingPlacements = [];
        $persistingPlacements = [];
        foreach ($layout->getCustomFieldElements() as $placement) {
            $details = [
                'layoutUid' => $layout->uid,
                'placementUid' => $placement->uid,
                'fromFieldUid' => $outgoing->uid,
                'toFieldUid' => $persisting->uid,
                'handle' => $placement->handle,
            ];
            if ($placement->getFieldUid() === $outgoing->uid) {
                $outgoingPlacements[] = $details;
            }
            if ($placement->getFieldUid() === $persisting->uid) {
                $persistingPlacements[] = [
                    'layoutUid' => $layout->uid,
                    'placementUid' => $placement->uid,
                    'fieldUid' => $persisting->uid,
                    'handle' => $placement->handle,
                ];
            }
        }

        return [
            'id' => $layout->id,
            'uid' => $layout->uid,
            'type' => $layout->type,
            'provider' => $layout->provider ? [
                'type' => $layout->provider::class,
                'handle' => method_exists($layout->provider, 'getHandle') ? $layout->provider->getHandle() : null,
            ] : null,
            'outgoingPlacements' => $outgoingPlacements,
            'persistingPlacements' => $persistingPlacements,
            'ambiguous' => $outgoingPlacements !== []
                && $persistingPlacements !== []
                && (!$outgoing::isMultiInstance() || !$persisting::isMultiInstance()),
        ];
    }

    private function _contentLocation(array $context): array
    {
        return [
            'rowId' => (int)$context['rowId'],
            'elementId' => (int)$context['elementId'],
            'siteId' => (int)$context['siteId'],
            'elementType' => $context['elementType'],
            'draftId' => $context['draftId'],
            'revisionId' => $context['revisionId'],
            'trashed' => $context['trashed'],
            'rootFieldUid' => $context['rootFieldUid'],
            'rootPlacementUid' => $context['rootPlacementUid'],
            'path' => $context['path'],
        ];
    }

    private function _schemaPath(array $context): array
    {
        $path = [$context['rootPlacementUid']];
        foreach (array_slice($context['path'], 1) as $segment) {
            if (!is_array($segment)) {
                continue;
            }
            $path[] = array_intersect_key($segment, array_flip([
                'kind',
                'blockTypeUid',
                'placementUid',
                'storedKey',
                'representation',
                'containerFieldUid',
                'fieldUid',
                'layoutUid',
            ]));
        }
        return $path;
    }

    private function _diagnostic(string $severity, string $code, string $message, array $context = []): array
    {
        return compact('severity', 'code', 'message', 'context');
    }
}
