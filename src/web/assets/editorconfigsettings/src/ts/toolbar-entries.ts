/**
 * What a toolbar is made of, and the rules for rearranging it.
 *
 * Pure functions over plain data, deliberately knowing nothing about the DOM. The
 * builder element is large and mostly concerned with rendering; keeping the decisions
 * about what may hold what out here means they can be reasoned about — and tested —
 * without mounting anything.
 *
 * These rules are the client half of `EditorConfigs::normalizeToolbar`. The server is
 * the authority and rejects anything invalid outright, so the point of enforcing them
 * here is that the builder should never offer an author a gesture the save would refuse.
 *
 * There is not much left of this. A toolbar is a list of IDs, and the only thing to know about
 * an ID is whether it names a dropdown. It once held a discriminated union, member
 * add/remove/move operations, a nesting rule and a hash-based key, all of which existed to
 * support authoring a dropdown's contents from anywhere. What replaced them is `rosterOrder`:
 * a dropdown's contents are a registered roster you subtract from, so there is no "may this go
 * in here" question left to answer — only which of a fixed set is in, and in what order.
 */

/**
 * The prefix marking a dropdown, as against a plain button.
 *
 * Kept in step with `EditorConfigPresentation::DROPDOWN_PREFIX`. It earns its keep by keeping
 * the two apart in one namespace: a `table` dropdown and a `table` button are both plausible.
 */
export const DROPDOWN_PREFIX = 'dropdown:';

/** A toolbar holds button and dropdown IDs, told apart by prefix. */
export type ToolbarEntry = string;

/** Whether an ID names a dropdown rather than a button. */
export function isDropdownKey(id: string): boolean {
    return id.startsWith(DROPDOWN_PREFIX);
}

/**
 * The registration name behind a dropdown ID, which is how membership is keyed.
 *
 * The prefix is a toolbar concern — it keeps a `table` dropdown and a `table` button apart in
 * one list — and `dropdowns` is already keyed by kind, so it stores the bare name.
 */
export function dropdownName(id: string): string {
    return isDropdownKey(id) ? id.slice(DROPDOWN_PREFIX.length) : id;
}

/**
 * A dropdown's members with the trimmed-away ones back in place, as one list.
 *
 * The preview menu shows what a dropdown *may* hold, not only what it does, because a member
 * that has been switched off has to be visible to be switched back on — and because a designed
 * menu with some of it struck through is the honest picture of the feature: a config subtracts
 * from a roster, it does not compose one.
 *
 * One list, in place. This appended the excluded ones to the end for as long as the panel had a
 * second row to append them to, and the row was the reason: two rows need two lists. Now that a
 * click switches a row off where it sits, appending would be a bug — the row an author just
 * clicked would leap to the bottom of the menu, and clicking it again would leap it back.
 *
 * So each excluded member is placed against the first *included* member that follows it in the
 * roster, which is where `VizyEditorConfigSettingsElement#toggleMember` puts one it restores.
 * The two agreeing is what makes a toggle look like it did nothing but grey the row out: the
 * position it would come back to is the position it is already being drawn in.
 */
export function rosterOrder(roster: readonly string[], members: readonly string[]): string[] {
    const included = members.filter((member) => roster.includes(member));
    const order = [...included];

    for (const member of roster) {
        if (included.includes(member)) continue;

        // Its registered successors, of the members still in. The first of those is what it sits
        // in front of; none of them means it belongs at the end.
        const at = roster.indexOf(member);
        const before = order.findIndex((id) => included.includes(id) && roster.indexOf(id) > at);
        order.splice(before === -1 ? order.length : before, 0, member);
    }

    return order;
}

/**
 * Where an entry sits, given the ID the drag reported and the index it claims.
 *
 * The index is only trusted while it still holds that entry. A separator may appear
 * several times, so an ID alone is ambiguous, and a re-render between pick-up and
 * release would otherwise move the wrong one.
 */
export function indexOfEntry(toolbar: readonly ToolbarEntry[], id: string, index?: number): number {
    if (index !== undefined && index >= 0 && index < toolbar.length && toolbar[index] === id) {
        return index;
    }

    return toolbar.indexOf(id);
}

/**
 * Every ID the toolbar itself has spoken for.
 *
 * The strip only, and that is now all there is to ask: a control a dropdown owns is not a button
 * at all, so it never reaches the palette to be subtracted from it. This used to have a companion
 * that took a placed dropdown's current members out of the palette as well.
 */
export function claimedKeys(toolbar: readonly ToolbarEntry[]): Set<string> {
    return new Set(toolbar);
}
