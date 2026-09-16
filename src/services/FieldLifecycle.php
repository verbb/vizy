<?php
namespace verbb\vizy\services;

use verbb\vizy\events\ClassifyFieldEvent;
use verbb\vizy\fields\VizyField;

use Craft;
use craft\base\Component;
use craft\base\Field;
use craft\base\FieldInterface;
use craft\fields\Addresses;
use craft\fields\Assets;
use craft\fields\ContentBlock;
use craft\fields\Matrix;
use craft\fields\MissingField;

/**
 * Compatibility policy for JSON-owned Block field values.
 *
 * Vizy Blocks are not saved Craft Elements. Field values live in document JSON
 * (fieldSlots), projected onto an ephemeral id-null Block only for Craft APIs.
 *
 * Capability labels are persistence strategies — not a “supported plugins”
 * allowlist:
 *
 * - {@see PURE} — ordinary value field: normalize/serialize through Craft on
 *   the ephemeral Block and store the result in JSON. This is the default for
 *   Craft and third-party fields. (Name is historical; think “value field”.)
 * - {@see ASSETS} — like pure, plus post-owner Asset finalization.
 * - {@see HOSTED_VIZY} — nested Vizy document envelope.
 * - {@see MATRIX_ANCHOR} — legacy Matrix-in-Block via MatrixAnchor (mount yes,
 *   new placements no).
 * - {@see MIGRATION_ONLY} — nested Element owner (Neo, Super Table, …): cannot
 *   correctly persist under a JSON Block; refuse new placements.
 * - {@see UNSUPPORTED} — missing/broken field types.
 *
 * Policy is a nested-owner **blocklist**, not opt-in support. Third-party value
 * fields are handled via `craft.generic` unless they are known nested owners.
 * {@see EVENT_CLASSIFY_FIELD} / {@see registerPersistedNestedOwnerClass()} exist
 * for rare overrides — not as the normal path to “enable” a field.
 */
final class FieldLifecycle extends Component
{
    // Constants
    // =========================================================================

    public const EVENT_CLASSIFY_FIELD = 'classifyField';

    public const PURE = 'pure';
    public const ASSETS = 'assets';
    public const HOSTED_VIZY = 'hostedVizy';
    /**
     * Existing Matrix-in-Block via MatrixAnchor. Mount/serialize yes; new FLD
     * placements no.
     */
    public const MATRIX_ANCHOR = 'matrixAnchor';
    public const MIGRATION_ONLY = 'migrationOnly';
    public const UNSUPPORTED = 'unsupported';

    /**
     * Craft / known third-party classes that persist nested Elements under the
     * Block owner. Blocklist only — not an allowlist of supported fields.
     *
     * Neo ships as `benf\neo\Field` (not `verbb\neo\…`). Keep both strings so
     * either FQCN fails closed if present on a site.
     */
    private const NESTED_OWNER_CLASSES = [
        Matrix::class,
        ContentBlock::class,
        Addresses::class,
        'verbb\\supertable\\fields\\SuperTableField',
        'verbb\\supertable\\fields\\SuperTable',
        'benf\\neo\\Field',
        'verbb\\neo\\fields\\Neo',
    ];


    // Properties
    // =========================================================================

    /** Extra nested-owner class strings registered at runtime. */
    private array $extraNestedOwnerClasses = [];


    // Public Methods
    // =========================================================================

    /**
     * Register an additional nested-owner field class (string, no install required).
     * Prefer this or {@see EVENT_CLASSIFY_FIELD} over forking FieldLifecycle.
     */
    public function registerPersistedNestedOwnerClass(string $fieldClass): void
    {
        if ($fieldClass === '' || in_array($fieldClass, $this->extraNestedOwnerClasses, true)) {
            return;
        }
        $this->extraNestedOwnerClasses[] = $fieldClass;
    }

    /** Classifies the field and reports the policy decisions derived from it. */
    public function classify(FieldInterface $field): array
    {
        $capability = self::PURE;
        $reason = 'defaultPureValue';

        if ($field instanceof MissingField) {
            $capability = self::UNSUPPORTED;
            $reason = 'missingField';
        } elseif ($field instanceof VizyField) {
            $capability = self::HOSTED_VIZY;
            $reason = 'hostedVizyEditor';
        } elseif ($field instanceof Matrix) {
            // Grandfather: runtime MatrixAnchor path; designer still forbids new.
            $capability = self::MATRIX_ANCHOR;
            $reason = 'legacyMatrixAnchor';
        } elseif ($this->isPersistedNestedOwner($field)) {
            // Nested Element owners need afterElementPropagate / elements_owners —
            // not document-native on JSON Blocks.
            $capability = self::MIGRATION_ONLY;
            $reason = 'persistedNestedOwner';
        } elseif ($field instanceof Assets) {
            $capability = self::ASSETS;
            $reason = 'focusedAssetFinalization';
        }

        $event = new ClassifyFieldEvent([
            'field' => $field,
            'capability' => $capability,
            'reason' => $reason,
        ]);
        $this->trigger(self::EVENT_CLASSIFY_FIELD, $event);
        $capability = $event->capability;
        $reason = $event->reason;

        return [
            'craftVersion' => Craft::$app->getVersion(),
            'fieldClass' => $field::class,
            'capability' => $capability,
            'reason' => $reason,
            'canMountInBlock' => $this->_capabilityAllowsMount($capability),
            'requiresPersistedBlockOwner' => $this->_capabilityRequiresPersistedOwner($capability),
            'permitsNewPlacement' => $this->_capabilityAllowsNewPlacement($capability),
        ];
    }

    /**
     * Whether Block FieldLayout HTML may mount this field (adapter / serialize).
     * Distinct from {@see requiresPersistedBlockOwner}.
     */
    public function canMountInBlock(FieldInterface $field): bool
    {
        return $this->classify($field)['canMountInBlock'];
    }

    /**
     * Whether meaningful persistence needs a saved nested Element owner
     * (MatrixAnchor or migration-only nested owners). Id-null Blocks must not
     * pretend these are complete without that owner.
     */
    public function requiresPersistedBlockOwner(FieldInterface $field): bool
    {
        return $this->classify($field)['requiresPersistedBlockOwner'];
    }

    public function canSerialize(FieldInterface $field): bool
    {
        return $this->_capabilityAllowsMount($this->classify($field)['capability']);
    }

    public function permitsNewPlacement(FieldInterface $field): bool
    {
        // Split from canSerialize so MatrixAnchor can mount/save without reopening
        // the Block Type field library.
        return $this->_capabilityAllowsNewPlacement($this->classify($field)['capability']);
    }

    /**
     * Class-string gate for FLD “New field” type menus (no instance yet).
     */
    public function permitsNewPlacementClass(string $fieldClass): bool
    {
        if ($fieldClass === '' || !is_a($fieldClass, FieldInterface::class, true)) {
            return false;
        }

        if (is_a($fieldClass, MissingField::class, true)) {
            return false;
        }

        // Matrix / nested owners: never offer as *new* Block Type fields.
        if ($this->isPersistedNestedOwnerClass($fieldClass)) {
            return false;
        }

        return true;
    }

    /**
     * Author-facing rejection when a field cannot be newly placed on a Block Type.
     */
    public function placementRejectionMessage(FieldInterface $field): string
    {
        $inventory = $this->classify($field);
        $name = method_exists($field, 'getName') ? (string)$field->getName() : '';
        if ($name === '' && $field instanceof Field) {
            $name = (string)$field->name;
        }
        if ($name === '') {
            $name = $field::displayName();
        }

        $typeLabel = $field::displayName();

        if ($inventory['capability'] === self::MATRIX_ANCHOR) {
            return Craft::t(
                'vizy',
                '“{name}” ({type}) can’t be added to Vizy Block Types. Existing Matrix fields on Blocks remain editable; nest new content with a Hosted Vizy field instead.',
                ['name' => $name, 'type' => $typeLabel],
            );
        }

        if ($inventory['capability'] === self::MIGRATION_ONLY) {
            return Craft::t(
                'vizy',
                '“{name}” ({type}) can’t be used on Vizy Block Types because it stores nested Craft elements. Nest content with a Hosted Vizy field instead, or keep {type} on the Entry.',
                ['name' => $name, 'type' => $typeLabel],
            );
        }

        if ($inventory['capability'] === self::UNSUPPORTED) {
            return Craft::t(
                'vizy',
                '“{name}” ({type}) can’t be used on Vizy Block Types.',
                ['name' => $name, 'type' => $typeLabel],
            );
        }

        return Craft::t(
            'vizy',
            '“{name}” ({type}) can’t be used on Vizy Block Types.',
            ['name' => $name, 'type' => $typeLabel],
        );
    }

    /**
     * Custom object templates may use honest adapter context, but not pretend
     * the JSON-owned Block has persisted Element identity.
     */
    public function customTranslationKeyIsSupported(FieldInterface $field): bool
    {
        if (!$field instanceof Field || $field->translationMethod !== Field::TRANSLATION_METHOD_CUSTOM) {
            return true;
        }

        $format = (string)$field->translationKeyFormat;
        return preg_match('/\{\{\s*(?:id|uid|canonicalId|draftId|revisionId)\b/i', $format) !== 1
            && preg_match('/\{\s*(?:id|uid|canonicalId|draftId|revisionId)\b/i', $format) !== 1;
    }

    public function isPersistedNestedOwner(FieldInterface $field): bool
    {
        return $this->isPersistedNestedOwnerClass($field::class);
    }

    public function isPersistedNestedOwnerClass(string $fieldClass): bool
    {
        foreach ([...self::NESTED_OWNER_CLASSES, ...$this->extraNestedOwnerClasses] as $blocked) {
            // Exact string match so menus work when Neo/Super Table are not installed
            // (is_a(..., true) returns false for missing classes).
            if ($fieldClass === $blocked || is_a($fieldClass, $blocked, true)) {
                return true;
            }
        }

        return false;
    }


    // Private Methods
    // =========================================================================

    private function _capabilityAllowsMount(string $capability): bool
    {
        return in_array(
            $capability,
            [self::PURE, self::ASSETS, self::HOSTED_VIZY, self::MATRIX_ANCHOR],
            true,
        );
    }

    private function _capabilityAllowsNewPlacement(string $capability): bool
    {
        return in_array(
            $capability,
            [self::PURE, self::ASSETS, self::HOSTED_VIZY],
            true,
        );
    }

    private function _capabilityRequiresPersistedOwner(string $capability): bool
    {
        return in_array(
            $capability,
            [self::MATRIX_ANCHOR, self::MIGRATION_ONLY],
            true,
        );
    }
}
