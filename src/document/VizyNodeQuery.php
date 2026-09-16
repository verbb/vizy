<?php
namespace verbb\vizy\document;

use InvalidArgumentException;

use yii2mod\query\ArrayQuery;

/**
 * Queries document nodes with an enabled scope independent of ordinary filters.
 */
final class VizyNodeQuery extends ArrayQuery
{
    // Properties
    // =========================================================================

    private ?bool $enabledFilter = true;


    // Public Methods
    // =========================================================================

    public function init(): void
    {
        $this->queryProcessorClass = VizyQueryProcessor::class;
        parent::init();
    }

    public function enabled(?bool $enabled = true): static
    {
        $this->enabledFilter = $enabled;

        return $this;
    }

    public function where(mixed $condition, mixed $params = []): static
    {
        return parent::where($this->_extractEnabled($condition));
    }

    public function andWhere(mixed $condition, mixed $params = []): static
    {
        return parent::andWhere($this->_extractEnabled($condition));
    }

    public function orWhere(mixed $condition, mixed $params = []): static
    {
        return parent::orWhere($this->_extractEnabled($condition));
    }

    public function filterWhere(array $condition): static
    {
        return parent::filterWhere($this->_extractEnabled($condition));
    }

    public function andFilterWhere(array $condition): static
    {
        return parent::andFilterWhere($this->_extractEnabled($condition));
    }

    public function orFilterWhere(array $condition): static
    {
        return parent::orFilterWhere($this->_extractEnabled($condition));
    }


    // Protected Methods
    // =========================================================================

    protected function fetchData(): array
    {
        $condition = $this->where;

        // Apply the scope outside the whole expression, so OR cannot accidentally
        // expose disabled blocks. Explicit enabled predicates own their filtering.
        $this->where = $this->_normalizeNullEnabledPredicates($condition);
        if ($this->enabledFilter !== null && !$this->_hasEnabledPredicate($condition)) {
            $this->where = ['and', ['enabled' => $this->enabledFilter], $this->where];
        }

        try {
            return parent::fetchData();
        } finally {
            // Reusing, cloning, or changing a query must not accumulate defaults.
            $this->where = $condition;
        }
    }


    // Private Methods
    // =========================================================================

    private function _extractEnabled(mixed $condition): mixed
    {
        if (is_array($condition) && !array_is_list($condition) && array_key_exists('enabled', $condition)) {
            $enabled = $condition['enabled'];
            if ($enabled !== null && !is_bool($enabled)) {
                throw new InvalidArgumentException('The enabled filter must be true, false, or null.');
            }
            $this->enabled($enabled);
            unset($condition['enabled']);
        }

        return $condition;
    }

    private function _normalizeNullEnabledPredicates(mixed $condition): mixed
    {
        if (!is_array($condition)) {
            return $condition;
        }
        if (!array_is_list($condition)) {
            if (array_key_exists('enabled', $condition) && $condition['enabled'] === null) {
                unset($condition['enabled']);
            }
            return $condition;
        }
        if (in_array(strtolower((string)($condition[0] ?? '')), ['and', 'or', 'not'], true)) {
            foreach (array_slice($condition, 1, null, true) as $index => $operand) {
                $condition[$index] = $this->_normalizeNullEnabledPredicates($operand);
            }
        }
        return $condition;
    }

    private function _hasEnabledPredicate(mixed $condition): bool
    {
        if (!is_array($condition)) {
            return false;
        }
        if (!array_is_list($condition)) {
            return array_key_exists('enabled', $condition);
        }

        $operator = strtolower((string)($condition[0] ?? ''));
        if (in_array($operator, ['and', 'or', 'not'], true)) {
            foreach (array_slice($condition, 1) as $operand) {
                if ($this->_hasEnabledPredicate($operand)) {
                    return true;
                }
            }
            return false;
        }

        return ($condition[1] ?? null) === 'enabled';
    }
}
