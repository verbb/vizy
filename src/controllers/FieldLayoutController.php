<?php
namespace verbb\vizy\controllers;

use verbb\vizy\Vizy;
use verbb\vizy\fields\VizyField;
use verbb\vizy\helpers\FieldPlacements;
use verbb\vizy\services\HostedVizy;

use Craft;
use craft\base\ElementInterface;
use craft\web\Controller;

use yii\web\ForbiddenHttpException;
use yii\web\Response;

use Throwable;

final class FieldLayoutController extends Controller
{
    // Constants
    // =========================================================================

    private const BATCH_LIMIT = 25;


    // Properties
    // =========================================================================

    protected array|bool|int $allowAnonymous = false;


    // Public Methods
    // =========================================================================

    public function actionRender(): Response
    {
        $this->requirePostRequest();
        $this->requireAcceptsJson();
        try {
            $verified = $this->_verifiedRequest();
            if ($verified === null) {
                return $this->_conflict('staleField');
            }
            [$context, $owner, $field] = $verified;

            // The whole body is re-read from the raw request rather than through
            // getBodyParam(). Yii decodes JSON bodies into associative arrays,
            // which collapses the distinction between `{}` and `[]` — both
            // arrive as an empty PHP array. That matters because the Block hash
            // has to reproduce the browser's canonical JSON byte for byte, and a
            // Block with no field slots would hash as `"fieldSlots":[]` here
            // against the browser's `"fieldSlots":{}`. Decoding to objects keeps
            // empty objects distinguishable.
            $body = $this->_rawBodyObject();
            if ($body === null) {
                return $this->_conflict('invalidBlock');
            }

            $result = Vizy::$plugin->getFieldLayoutForms()->renderRequestItem($context, $owner, $field, $body);
            return $result['ok']
                ? $this->asJson($result['data'])
                : $this->_conflict($result['error'], $result['extra']);
        } catch (ForbiddenHttpException $exception) {
            throw $exception;
        } catch (Throwable $exception) {
            return $this->_rejected($exception);
        }
    }

    /**
     * Renders several Block FieldLayouts under one verified editor context.
     *
     * The editor mounts every mountable Block eagerly, so open bursts coalesce
     * into one HTTP round trip rather than one per Block. Guards stay per item:
     * one stale or unsupported Block reports its own error and the rest of the
     * batch still renders, because a partial mount is far better than dropping
     * every Block over one bad neighbour.
     */
    public function actionRenderBatch(): Response
    {
        $this->requirePostRequest();
        $this->requireAcceptsJson();
        try {
            $verified = $this->_verifiedRequest();
            if ($verified === null) {
                return $this->_conflict('staleField');
            }
            [$context, $owner, $field] = $verified;

            $body = $this->_rawBodyObject();
            $items = $body->items ?? null;
            if (!is_array($items) || $items === [] || count($items) > self::BATCH_LIMIT) {
                return $this->_conflict('invalidBatch');
            }

            $results = [];
            foreach ($items as $item) {
                if (!is_object($item)) {
                    $results[] = ['ok' => false, 'blockUid' => null, 'error' => 'invalidBlock'];
                    continue;
                }
                $result = Vizy::$plugin->getFieldLayoutForms()->renderRequestItem($context, $owner, $field, $item);
                $results[] = $result['ok']
                    ? ['ok' => true, ...$result['data']]
                    : [
                        'ok' => false,
                        'requestId' => (string)($item->requestId ?? ''),
                        'blockUid' => $item->block->attrs->blockUid ?? null,
                        'error' => $result['error'],
                        'message' => $result['message'] ?? null,
                        ...$result['extra'],
                    ];
            }

            return $this->asJson(['results' => $results]);
        } catch (ForbiddenHttpException $exception) {
            throw $exception;
        } catch (Throwable $exception) {
            return $this->_rejected($exception);
        }
    }


    // Private Methods
    // =========================================================================

    /**
     * Verifies the signed editor context and reauthorizes the owner for save.
     * Returns null when the context no longer matches the owner's placement of
     * the field, which callers surface as a `staleField` conflict.
     */
    private function _verifiedRequest(): ?array
    {
        // Craft action URLs can route outside the CP path. Check CP access
        // explicitly as well as permission to edit this particular owner.
        $this->requirePermission('accessCp');
        $context = Vizy::$plugin->getEditorContexts()->verify(
            (string)$this->request->getRequiredBodyParam('editorContextToken'),
        );
        $owner = $this->_resolveOwner($context);
        $user = static::currentUser();
        if (!$user || !Craft::$app->getElements()->canSave($owner, $user)) {
            throw new ForbiddenHttpException('forbidden');
        }
        $field = $this->_placedField($owner, $context);
        if (!$field) {
            return null;
        }
        return [$context, $owner, $field];
    }

    private function _rejected(Throwable $exception): Response
    {
        Craft::warning('Vizy FieldLayout request rejected: ' . $exception->getMessage(), __METHOD__);
        return $this->_conflict('invalidContext', [
            'detail' => YII_DEBUG || (getenv('ENVIRONMENT') === 'testing')
                ? $exception->getMessage()
                : null,
        ]);
    }

    private function _resolveOwner(array $context): ElementInterface
    {
        $class = $context['ownerClass'] ?? null;
        if (!is_string($class) || !is_subclass_of($class, ElementInterface::class)) {
            throw new \RuntimeException('invalidOwnerClass');
        }
        $query = $class::find()->siteId((int)$context['siteId'])->status(null);
        $owner = null;
        if ($context['revisionId'] ?? null) {
            $owner = (clone $query)->revisionId((int)$context['revisionId'])->one();
        } elseif ($context['draftId'] ?? null) {
            $owner = (clone $query)->draftId((int)$context['draftId'])->one();
        } elseif ($context['ownerId'] ?? null) {
            $owner = Craft::$app->getElements()->getElementById((int)$context['ownerId'], $class, (int)$context['siteId']);
        } elseif ($context['ownerUid'] ?? null) {
            $owner = Craft::$app->getElements()->getElementByUid((string)$context['ownerUid'], $class, (int)$context['siteId']);
        }
        if (!$owner) {
            // Only contexts issued for a genuinely unsaved owner may construct
            // one. A deleted saved entry/draft/revision must never become new.
            if (!empty($context['ownerId']) || !empty($context['draftId']) || !empty($context['revisionId'])) {
                throw new \RuntimeException('ownerNotFound');
            }
            $defining = is_array($context['definingAttributes'] ?? null)
                ? $context['definingAttributes']
                : [];
            $owner = Craft::createObject([
                'class' => $class,
                'uid' => $context['ownerUid'] ?: null,
                'siteId' => (int)$context['siteId'],
                ...$defining,
            ]);
        }
        if (!$owner instanceof ElementInterface) {
            throw new \RuntimeException('ownerNotFound');
        }
        $owner->setScenario((string)$context['scenario']);
        foreach (($context['definingAttributes'] ?? []) as $attribute => $value) {
            if (!in_array($attribute, ['sectionId', 'typeId', 'fieldId', 'ownerId', 'primaryOwnerId'], true)) {
                throw new \RuntimeException('invalidDefiningAttribute');
            }
            $actual = $attribute === 'typeId' && method_exists($owner, 'getTypeId')
                ? $owner->getTypeId()
                : ($owner->{$attribute} ?? null);
            if ((string)$actual !== (string)$value) {
                throw new \RuntimeException('staleOwnerDefinition');
            }
        }
        return $owner;
    }

    private function _placedField(ElementInterface $owner, array $context): ?VizyField
    {
        $layout = $owner->getFieldLayout();
        if (($context['ownerLayoutUid'] ?? null) !== $layout?->uid) {
            return null;
        }

        $authFieldUid = $context['entryFieldUid'] ?? $context['fieldUid'];
        $placementUid = $context['ownerPlacementUid'] ?? null;
        $field = $placementUid === null ? null : FieldPlacements::field($owner, $authFieldUid, $placementUid);
        if (!$field) {
            return null;
        }

        if (isset($context['entryFieldUid'])) {
            return $this->_hostedField($context, $field, $context['fieldUid']);
        }

        return $field;
    }

    private function _hostedField(array $context, VizyField $parent, string $renderFieldUid): ?VizyField
    {
        $path = $context['hostedPath'] ?? null;
        $depth = (int)($context['hostedDepth'] ?? 0);
        if (!is_array($path) || !array_is_list($path) || !HostedVizy::allowsDepth($depth) || count($path) !== $depth) {
            return null;
        }

        // Follow the original placements, not any alternative route to the same
        // field. This works for unsaved Blocks without trusting their content.
        foreach ($path as $index => $step) {
            if (!is_array($step) || !$parent instanceof VizyField) {
                return null;
            }
            $typeUid = (string)($step['blockTypeUid'] ?? '');
            $type = Vizy::$plugin->getBlockTypes()->getBlockTypeByUid($typeUid);
            $layout = $type?->getFieldLayout();
            if (!$type || !$parent->allowsBlockTypeUid($typeUid) || !$layout || $layout->uid !== ($step['layoutUid'] ?? null)) {
                return null;
            }
            $nested = null;
            foreach ($layout->getCustomFieldElements() as $placement) {
                if ($placement->uid === ($step['placementUid'] ?? null) && $placement->getField()->uid === ($step['fieldUid'] ?? null)) {
                    $nested = $placement->getField();
                    break;
                }
            }
            if (!$nested instanceof VizyField) {
                return null;
            }
            if ($index === $depth - 1 && (
                $parent->uid !== ($context['parentFieldUid'] ?? null)
                || $step['placementUid'] !== ($context['hostedPlacementUid'] ?? null)
            )) {
                return null;
            }
            $parent = $nested;
        }
        return $parent->uid === $renderFieldUid ? $parent : null;
    }

    private function _conflict(string $code, array $extra = []): Response
    {
        $this->response->setStatusCode(409);
        return $this->asJson(['error' => $code, ...$extra]);
    }

    /**
     * Decodes the raw request body preserving JSON objects as stdClass, so that
     * `{}` and `[]` stay distinguishable for hashing. Returns null when the body
     * is not a JSON object.
     */
    private function _rawBodyObject(): ?object
    {
        try {
            // Use the same JSON boundary as persisted documents. Hosted fields
            // and their rich text add containers without adding editor levels.
            $body = json_decode($this->request->getRawBody(), false, 512, JSON_THROW_ON_ERROR);
        } catch (Throwable) {
            return null;
        }
        return is_object($body) ? $body : null;
    }
}
