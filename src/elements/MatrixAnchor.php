<?php
namespace verbb\vizy\elements;

use verbb\vizy\elements\db\MatrixAnchorQuery;
use verbb\vizy\helpers\Matrix as MatrixHelper;
use verbb\vizy\records\MatrixAnchor as MatrixAnchorRecord;

use Craft;
use craft\base\Element;
use craft\base\ElementInterface;
use craft\elements\User;
use craft\fields\Matrix;
use craft\helpers\ElementHelper;
use craft\models\FieldLayout;

/**
 * Ownership records survive soft deletion so the same anchor can be restored.
 * The element foreign key removes them when the anchor is permanently deleted.
 */
class MatrixAnchor extends Element
{
    // Static Methods
    // =========================================================================

    public static function displayName(): string
    {
        return Craft::t('vizy', 'Vizy Matrix Anchor');
    }

    public static function lowerDisplayName(): string
    {
        return Craft::t('vizy', 'Vizy matrix anchor');
    }

    public static function pluralDisplayName(): string
    {
        return Craft::t('vizy', 'Vizy Matrix Anchors');
    }

    public static function pluralLowerDisplayName(): string
    {
        return Craft::t('vizy', 'Vizy matrix anchors');
    }

    public static function refHandle(): ?string
    {
        return 'vizyMatrixAnchor';
    }

    public static function hasContent(): bool
    {
        return false;
    }

    public static function hasTitles(): bool
    {
        return false;
    }

    public static function hasStatuses(): bool
    {
        return false;
    }

    public static function isLocalized(): bool
    {
        return true;
    }

    public static function find(): MatrixAnchorQuery
    {
        return new MatrixAnchorQuery(static::class);
    }


    // Properties
    // =========================================================================

    public ?int $vizyFieldId = null;
    public ?string $blockInstanceId = null;
    public ?int $parentOwnerId = null;

    private ?FieldLayout $_fieldLayout = null;
    private ?ElementInterface $_parentOwner = null;


    // Public Methods
    // =========================================================================

    public function getUiLabel(): string
    {
        return '';
    }

    public function getFieldLayout(): ?FieldLayout
    {
        return $this->_fieldLayout;
    }

    public function setFieldLayout(?FieldLayout $fieldLayout): void
    {
        $this->_fieldLayout = $fieldLayout;
        foreach ($fieldLayout?->getCustomFields() ?? [] as $field) {
            if ($field instanceof Matrix) {
                MatrixHelper::bindToLayout($field);
            }
        }
    }

    public function getParentOwner(): ?ElementInterface
    {
        // Include unsaved site enablement on the actual owner being saved.
        // Drafts and revisions retain their own owner ID in Vizy 4.
        if ($this->_parentOwner && $this->_parentOwner->id === $this->parentOwnerId) {
            return $this->_parentOwner;
        }
        if (!$this->parentOwnerId) {
            return null;
        }

        return Craft::$app->getElements()->getElementById($this->parentOwnerId, null, $this->siteId)
            ?? Craft::$app->getElements()->getElementById($this->parentOwnerId);
    }

    public function setParentOwner(ElementInterface $owner): void
    {
        $this->_parentOwner = $owner;
    }

    public function getSupportedSites(): array
    {
        $owner = $this->getParentOwner();
        if (!$owner) {
            return [$this->siteId ?? Craft::$app->getSites()->getPrimarySite()->id];
        }
        // Custom propagation can expose supported sites before the owner's
        // site rows exist. Its anchor must be ready for those first saves.
        return array_map(static fn(array $site): int => (int)$site['siteId'], ElementHelper::supportedSitesForElement($owner, true));
    }

    public function canView(User $user): bool
    {
        $parent = $this->getParentOwner();

        return $parent && Craft::$app->getElements()->canView($parent, $user);
    }

    public function canSave(User $user): bool
    {
        $parent = $this->getParentOwner();

        return $parent && Craft::$app->getElements()->canSave($parent, $user);
    }

    public function afterSave(bool $isNew): void
    {
        if (!$this->propagating) {
            if (!$isNew) {
                $record = MatrixAnchorRecord::findOne($this->id);

                if (!$record) {
                    throw new \yii\base\InvalidConfigException("Invalid Vizy matrix anchor ID: $this->id");
                }
            } else {
                $record = new MatrixAnchorRecord();
                $record->id = (int)$this->id;
            }

            $record->vizyFieldId = $this->vizyFieldId;
            $record->blockInstanceId = $this->blockInstanceId;
            $record->parentOwnerId = $this->parentOwnerId;
            $record->save(false);
        }

        parent::afterSave($isNew);
    }

    public function beforeSave(bool $isNew): bool
    {
        if (!parent::beforeSave($isNew)) {
            return false;
        }

        if (!$this->enabled) {
            $this->enabled = true;
        }

        return true;
    }


    // Protected Methods
    // =========================================================================

    protected function defineRules(): array
    {
        return array_merge(parent::defineRules(), [
            [['vizyFieldId', 'parentOwnerId'], 'integer'],
            [['blockInstanceId'], 'string', 'max' => 36],
        ]);
    }

    protected function uiLabel(): ?string
    {
        return null;
    }
}
