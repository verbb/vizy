<?php
namespace verbb\vizy\elements\conditions;

use verbb\vizy\elements\Block;

use craft\base\ElementInterface;
use craft\elements\Entry;
use craft\elements\conditions\ElementCondition;
use craft\elements\conditions\HasDescendantsRule;
use craft\elements\conditions\HasUrlConditionRule;
use craft\elements\conditions\LevelConditionRule;
use craft\elements\conditions\StatusConditionRule;
use craft\elements\conditions\TitleConditionRule;
use craft\elements\conditions\UriConditionRule;
use craft\elements\conditions\entries\AuthorConditionRule;
use craft\elements\conditions\entries\AuthorGroupConditionRule;
use craft\elements\conditions\entries\ExpiryDateConditionRule;
use craft\elements\conditions\entries\PostDateConditionRule;
use craft\elements\conditions\entries\SavableConditionRule;
use craft\elements\conditions\entries\SectionConditionRule;
use craft\elements\conditions\entries\TypeConditionRule;
use craft\elements\conditions\entries\ViewableConditionRule;
use craft\fields\conditions\FieldConditionRuleInterface;

/**
 * Craft-native condition for Vizy Block field layouts.
 *
 * A dedicated type keeps the Block condition contract explicit while retaining
 * Craft's built-in custom-field rules and in-memory element matching.
 */
class BlockCondition extends ElementCondition
{
    /**
     * Block layouts can depend on both their sibling Block fields and the Entry
     * being edited. Craft's Entry rules are useful here, but the Entry field
     * rule is deliberately omitted: Block custom-field rules already represent
     * the fields local to this layout and are evaluated against the Block.
     */
    protected function selectableConditionRules(): array
    {
        return array_merge(parent::selectableConditionRules(), [
            HasUrlConditionRule::class,
            StatusConditionRule::class,
            TitleConditionRule::class,
            UriConditionRule::class,
            AuthorConditionRule::class,
            AuthorGroupConditionRule::class,
            ExpiryDateConditionRule::class,
            HasDescendantsRule::class,
            LevelConditionRule::class,
            PostDateConditionRule::class,
            SavableConditionRule::class,
            SectionConditionRule::class,
            TypeConditionRule::class,
            ViewableConditionRule::class,
        ]);
    }

    /**
     * Sibling-field rules read the ephemeral Block. Element and Entry rules read
     * its durable owner, so rules such as Section, Entry Type, Title, Site, and
     * Status behave exactly as authors expect in a Block FieldLayout.
     */
    public function matchElement(ElementInterface $element): bool
    {
        if (!$element instanceof Block) {
            return parent::matchElement($element);
        }

        $owner = $element->getOwner();
        foreach ($this->getConditionRules() as $rule) {
            if (
                str_starts_with($rule::class, 'craft\\elements\\conditions\\entries\\')
                && !$owner instanceof Entry
            ) {
                return false;
            }
            $target = $rule instanceof FieldConditionRuleInterface ? $element : $owner;
            if (!$rule->matchElement($target)) {
                return false;
            }
        }

        return true;
    }
}
