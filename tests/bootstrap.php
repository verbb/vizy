<?php

declare(strict_types=1);

// Source-invariant tests do not boot Craft or need Composer autoload.
// `composer test` still works once require-dev (phpunit) is installed.
$autoload = dirname(__DIR__) . '/vendor/autoload.php';

if (is_file($autoload)) {
    require $autoload;
}
