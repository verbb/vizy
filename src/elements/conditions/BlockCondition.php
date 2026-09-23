<?php
namespace verbb\vizy\elements\conditions;

use craft\elements\conditions\ElementCondition;

/**
 * Craft-native condition for Vizy Block field layouts.
 *
 * A dedicated type keeps the Block condition contract explicit while retaining
 * Craft's built-in custom-field rules and in-memory element matching.
 */
class BlockCondition extends ElementCondition
{
}
