<?php
namespace verbb\vizy\document;

use yii\base\InvalidParamException;

use yii2mod\query\QueryProcessor;

/**
 * Boolean queries use document occurrences, not a node type as a primary key.
 */
final class VizyQueryProcessor extends QueryProcessor
{
    // Protected Methods
    // =========================================================================

    protected function filterOrCondition(array $data, mixed $operator, mixed $operands): array
    {
        $matches = [];
        $hasOperand = false;
        foreach ($operands as $operand) {
            if (is_array($operand)) {
                $hasOperand = true;
                $matches += $this->filterCondition($data, $operand);
            }
        }

        // Filters retain source keys. Intersect with the original input to keep
        // document order and include an occurrence only once across OR branches.
        return $hasOperand ? array_intersect_key($data, $matches) : $data;
    }

    protected function filterNotCondition(array $data, mixed $operator, mixed $operands): array
    {
        if (count($operands) !== 1) {
            throw new InvalidParamException("Operator '$operator' requires exactly one operand.");
        }

        return array_diff_key($data, $this->filterCondition($data, reset($operands)));
    }
}
