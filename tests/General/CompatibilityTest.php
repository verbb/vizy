<?php

declare(strict_types=1);

it('locks production to PHP 8.2 syntax and the required Craft 5.9 API floor', function() {
    $root = dirname(__DIR__, 2);
    $composer = json_decode(
        file_get_contents($root . '/composer.json'),
        true,
        512,
        JSON_THROW_ON_ERROR,
    );

    expect($composer['require']['php'])->toBe('^8.2')
        ->and($composer['require']['craftcms/cms'])->toBe('^5.9.0')
        ->and($composer['require-dev'])->not->toHaveKey('craftcms/cms');

    $iterator = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($root . '/src', FilesystemIterator::SKIP_DOTS)
    );
    $typedConstants = [];
    foreach ($iterator as $file) {
        if ($file->isFile() && $file->getExtension() === 'php') {
            $source = file_get_contents($file->getPathname());
            if (preg_match('/\bconst\s+(?:string|int|bool|array|float)\s+/', $source)) {
                $typedConstants[] = $file->getPathname();
            }
        }
    }

    expect($typedConstants)->toBe([]);
});
