<?php

declare(strict_types=1);

use craft\elements\Entry;
use craft\events\CreateFieldLayoutFormEvent;
use craft\models\FieldLayout;
use verbb\vizy\elements\Block;
use verbb\vizy\elements\MatrixAnchor;

it('keeps nested Entry field layouts interactive', function (): void {
    foreach ([new Block(), new MatrixAnchor()] as $owner) {
        $entry = new Entry();
        $entry->setOwner($owner);

        $event = new CreateFieldLayoutFormEvent([
            'element' => $entry,
            'static' => true,
        ]);

        (new FieldLayout())->trigger(FieldLayout::EVENT_CREATE_FORM, $event);

        expect($event->static)->toBeFalse();
    }
});
