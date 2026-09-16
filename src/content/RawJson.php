<?php
namespace verbb\vizy\content;

/** Preserve untouched JSON objects, including empty and numerically keyed objects. */
final class RawJson
{
    // Static Methods
    // =========================================================================

    public static function encode(mixed $value): string
    {
        return json_encode($value, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }

    /** Keep objects that PHP arrays cannot distinguish from JSON lists. */
    public static function decode(string $value): mixed
    {
        return self::_decodeValue(json_decode($value, false, 512, JSON_THROW_ON_ERROR));
    }

    public static function same(mixed $before, mixed $after): bool
    {
        // Distinguish [] from {}, while equal object values remain idempotent
        // even when a callback constructs a fresh stdClass instance.
        return self::encode($before) === self::encode($after);
    }

    public static function preserve(string $source, array $changed): mixed
    {
        return self::_merge(json_decode($source, false, 512, JSON_THROW_ON_ERROR), self::decode($source), $changed);
    }

    private static function _decodeValue(mixed $value): mixed
    {
        if (!is_array($value) && !$value instanceof \stdClass) {
            return $value;
        }
        $members = array_map(self::_decodeValue(...), (array)$value);
        return $value instanceof \stdClass && array_is_list($members) ? (object)$members : $members;
    }

    private static function _merge(mixed $original, mixed $before, mixed $after): mixed
    {
        if (self::same($before, $after)) {
            return $original;
        }
        if (!is_array($before) || !is_array($after) || array_is_list($before) !== array_is_list($after)) {
            return $after;
        }
        $result = $original instanceof \stdClass ? new \stdClass() : [];
        foreach ($after as $key => $value) {
            if (array_key_exists($key, $before)) {
                $old = $original instanceof \stdClass ? $original->{(string)$key} : $original[$key];
                $value = self::_merge($old, $before[$key], $value);
            }
            if ($result instanceof \stdClass) {
                $result->{(string)$key} = $value;
            } else {
                $result[$key] = $value;
            }
        }
        return $result;
    }
}
