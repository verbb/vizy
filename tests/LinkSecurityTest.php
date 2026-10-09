<?php

declare(strict_types=1);

use PHPUnit\Framework\TestCase;
use verbb\vizy\helpers\Nodes;
use verbb\vizy\marks\Link;
use verbb\vizy\nodes\Image;

final class LinkSecurityTest extends TestCase
{
    public function testMalformedLinkHrefIsDropped(): void
    {
        foreach ([['bad'], (object)['bad'], 42] as $href) {
            $link = new Link(['attrs' => ['href' => $href]]);

            self::assertSame([
                [
                    'tag' => 'a',
                    'attrs' => [],
                ],
            ], $link->getTag());
        }
    }

    public function testMalformedRefTagValueIsRejected(): void
    {
        self::assertNull(Nodes::parseRefTags(['bad'], null));
        self::assertNull(Nodes::parseRefTags((object)['bad'], null));
    }

    public function testMalformedImageSourceIsDropped(): void
    {
        $image = new Image(['attrs' => ['src' => ['bad']]]);

        self::assertNull($image->getTag()[0]['attrs']['src']);
    }

    public function testValidLinkBehaviorIsPreserved(): void
    {
        $link = new Link([
            'attrs' => [
                'href' => 'https://example.com/path',
                'target' => '_blank',
            ],
        ]);

        self::assertSame([
            [
                'tag' => 'a',
                'attrs' => [
                    'href' => 'https://example.com/path',
                    'target' => '_blank',
                    'rel' => 'noopener noreferrer',
                ],
            ],
        ], $link->getTag());
    }
}
