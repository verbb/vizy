<?php
namespace verbb\vizy\events;

use yii\base\Event;

/**
 * The registration boundary for toolbar dropdowns.
 *
 * A dropdown is a named, glyphed container of buttons. Authors place one and choose what
 * goes in it; they do not invent one, name one or pick its icon — that was tried, and put a
 * label field and an icon picker on a screen whose job is laying out a toolbar, for a payoff
 * only a handful of installs would ever want. Adding to the set is a developer act, as
 * registering a custom button already is, so both arrive the same way and the server stays
 * the authority on what a toolbar may contain.
 */
final class RegisterToolbarDropdownsEvent extends Event
{
    // Properties
    // =========================================================================

    public array $dropdowns = [];
}
