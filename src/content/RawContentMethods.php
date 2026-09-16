<?php
namespace verbb\vizy\content;

/** Public raw content API, separate from normal field interpretation and save hooks. */
trait RawContentMethods
{
    // Public Methods
    // =========================================================================

    public function rawContent(): RawContent
    {
        return new RawContent();
    }

    public function captureFieldLocations(string $fieldUid): array
    {
        return $this->rawContent()->captureFieldLocations($fieldUid);
    }

    public function transformValue(mixed $value, string $containerFieldUid, array $map, callable $transform, array $context = []): array
    {
        return $this->rawContent()->transformValue($value, $containerFieldUid, $map, $transform, $context);
    }

    public function modifyFieldValues(array $map, callable $transform, array $options = []): array
    {
        return $this->rawContent()->modifyFieldValues($map, $transform, $options);
    }

    public function getRawContentAdapter(): RawContentAdapter
    {
        return new RawContentAdapter();
    }
}
