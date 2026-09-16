import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '../../src/web/assets/editorconfigsettings/src/ts/VizyEditorConfigSettingsElement';
import {
    claimedKeys,
    DROPDOWN_PREFIX,
    indexOfEntry,
    isDropdownKey,
    type ToolbarEntry,
} from '../../src/web/assets/editorconfigsettings/src/ts/toolbar-entries';
import { installAnimationsShim, installElementInternalsShim } from './support/element-internals';

// Must run before Plugin Kit's form-associated components are constructed: the Bubble
// Menu toggle is a `pk-lightswitch`, which calls `attachInternals()` as it upgrades.
installElementInternalsShim();
installAnimationsShim();

const BOLD_SVG = '<svg viewBox="0 0 384 512"><path d="M0 0h1v1H0z"/></svg>';

/** Activates a builder button from the keyboard, which is how adding and removing is done. */
const press = (item: HTMLElement | undefined): void => {
    item?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
};

type Initial = Parameters<typeof JSON.stringify>[0];

/**
 * Formatting as `EditorConfigPresentation::dropdownCatalog` sends it.
 *
 * `members` is the fixed roster it may hold, as button IDs: the registration's `headingLevels`
 * shorthand is expanded to all six levels before it leaves PHP, so the panel draws a chip per
 * level and a config can trim them one at a time. All six, not the allowed ones — which levels a
 * config permits is the Content schema's answer, applied when the toolbar is built.
 */
const FORMATTING_DROPDOWN = {
    id: 'dropdown:formatting',
    label: 'Formatting',
    kind: 'dropdown',
    group: 'Dropdowns',
    icon: null,
    // Only the three levels the catalog below knows about, so every roster member has a palette
    // entry to draw from. A real roster carries all six.
    members: ['paragraph', 'heading2', 'heading3', 'heading5', 'blockquote', 'codeBlock'],
};

afterEach(() => {
    document.body.replaceChildren();
});

function initialData(overrides: Record<string, unknown> = {}): Initial {
    return {
        config: {
            capabilities: { nodes: [], marks: ['bold', 'italic'] },
            headings: { levels: [2, 3] },
            toolbar: ['bold', 'separator', 'italic'],
            bubble: { enabled: true, items: ['bold'] },
        },
        toolbarCatalog: [
            { id: 'bold', label: 'Bold', kind: 'mark', group: 'formatting', icon: BOLD_SVG },
            { id: 'italic', label: 'Italic', kind: 'mark', group: 'formatting', icon: BOLD_SVG },
            { id: 'separator', label: 'Separator', kind: 'presentation', group: 'layout', icon: null },
            { id: 'undo', label: 'Undo', kind: 'action', group: 'history', icon: BOLD_SVG },
            // Opens a palette — wears the same chevron appearance as a dropdown trigger.
            { id: 'addBlock', label: 'Add Block', kind: 'action', group: 'Blocks', icon: BOLD_SVG },
            // Two list types, which a Lists dropdown briefly owned. They are buttons because
            // "bulleted" and "numbered" are independent toggles rather than two values of one
            // setting, which is the test a family has to pass to be a menu.
            { id: 'bulletList', label: 'Bulleted list', kind: 'node', group: 'lists', icon: BOLD_SVG, capabilityKind: 'node', capabilityName: 'bulletList' },
            // The one kind of action that rides on a capability: its command comes with the
            // Table extension. See `#itemAllowed`. Member-only, so the *menu* is where that
            // gating shows — there is no such thing as a loose table button.
            { id: 'tableAddRowAfter', label: 'Insert row below', kind: 'action', group: 'table', icon: BOLD_SVG, capabilityKind: 'node', capabilityName: 'table', memberOnly: true },
            // `memberOnly` throughout: Formatting and Alignment own these outright, so a toolbar
            // cannot name one and the palette does not offer it. They were briefly offered as
            // buttons *and* subtracted from the palette once a menu holding them was placed,
            // which fired silently and only in one direction — see `MEMBER_ONLY_IDS`.
            //
            // Still full catalog entries, because the menu draws its rows from here: gated on the
            // config's levels as well as on the Heading capability (see `headingLevel`), and
            // carrying the `preview` token the menu styles a row by, exactly as the editor's
            // manifest carries it. See `EditorConfigPresentation::toolbarCatalog`.
            { id: 'alignCenter', label: 'Align centre', kind: 'action', group: 'alignment', icon: BOLD_SVG, memberOnly: true },
            { id: 'heading2', label: 'Heading 2', kind: 'node', group: 'headings', icon: BOLD_SVG, abbr: 'H2', headingLevel: 2, capabilityKind: 'node', capabilityName: 'heading', preview: 'heading2', memberOnly: true },
            { id: 'heading3', label: 'Heading 3', kind: 'node', group: 'headings', icon: BOLD_SVG, abbr: 'H3', headingLevel: 3, capabilityKind: 'node', capabilityName: 'heading', preview: 'heading3', memberOnly: true },
            { id: 'heading5', label: 'Heading 5', kind: 'node', group: 'headings', icon: BOLD_SVG, abbr: 'H5', headingLevel: 5, capabilityKind: 'node', capabilityName: 'heading', preview: 'heading5', memberOnly: true },
            { id: 'blockquote', label: 'Quote', kind: 'node', group: 'blocks', icon: BOLD_SVG, preview: 'blockquote', memberOnly: true },
            { id: 'codeBlock', label: 'Code block', kind: 'node', group: 'blocks', icon: BOLD_SVG, preview: 'codeBlock', memberOnly: true },
            { id: 'paragraph', label: 'Paragraph', kind: 'node', group: 'blocks', icon: BOLD_SVG, preview: 'paragraph', memberOnly: true },
            { id: 'mediaEmbed', label: 'Media embed', kind: 'node', group: 'media', icon: BOLD_SVG, capabilityKind: 'node', capabilityName: 'mediaEmbed', preview: 'mediaEmbed' },
            { id: 'iframe', label: 'Iframe', kind: 'node', group: 'media', icon: BOLD_SVG, capabilityKind: 'node', capabilityName: 'iframe', preview: 'iframe' },
        ],
        dropdownCatalog: [FORMATTING_DROPDOWN],
        bubbleCatalog: [
            { id: 'bold', label: 'Bold', kind: 'mark', group: 'formatting', icon: BOLD_SVG },
            { id: 'italic', label: 'Italic', kind: 'mark', group: 'formatting', icon: BOLD_SVG },
        ],
        capabilityCatalog: { nodes: [], marks: [], headingAvailable: false },
        ...overrides,
    };
}

function mount(overrides: Record<string, unknown> = {}): HTMLElement {
    const element = document.createElement('vizy-editor-config-settings');
    element.setAttribute('data-initial', JSON.stringify(initialData(overrides)));
    element.innerHTML = '<div data-vizy-config-host></div><div data-vizy-config-sync></div>';
    document.body.append(element);
    return element;
}

const items = (element: HTMLElement, list: string): HTMLElement[] =>
    [...element.querySelectorAll<HTMLElement>(`[data-builder-list="${list}"] [data-toolbar-item]`)];

const ids = (element: HTMLElement, list: string): string[] =>
    items(element, list).map((item) => item.dataset.toolbarItem ?? '');

/** The values of the hidden inputs the builder posts under a given name. */
const hidden = (element: HTMLElement, name: string): string[] =>
    [...element.querySelectorAll<HTMLInputElement>(`input[name="${name}"]`)].map((input) => input.value);

const toolbarState = (element: HTMLElement): ToolbarEntry[] => {
    const input = element.querySelector<HTMLInputElement>('input[name="toolbarJson"]');
    return JSON.parse(input?.value ?? '[]');
};

/** What each placed dropdown holds, as the builder posts it. */
const dropdownState = (element: HTMLElement): Record<string, string[]> => {
    const input = element.querySelector<HTMLInputElement>('input[name="dropdownsJson"]');
    return JSON.parse(input?.value ?? '{}');
};

describe('the palette', () => {
    const add = (element: HTMLElement, list: string, id: string): void => {
        press(items(element, list).find((item) => item.dataset.toolbarItem === id));
    };

    const bare = (levels: number[] = []) => mount({
        config: {
            capabilities: { nodes: ['heading', 'blockquote', 'codeBlock', 'bulletList'], marks: ['bold'] },
            headings: { levels },
            toolbar: ['bold'],
            bubble: { enabled: false, items: [] },
        },
    });

    it('offers buttons and dropdowns in one list, telling them apart by how they are drawn', () => {
        const element = bare();

        // A shelf each, briefly, on the grounds that they are two kinds of thing. They are, and
        // that was not the problem: they wore the same 36px square, so one row read as a list
        // mixing "applies bold" with "is a menu of things that do". The chevron settles it now,
        // and a distinction the eye can make does not need a heading to announce it.
        expect(ids(element, 'toolbar-available')).toContain('bulletList');
        expect(ids(element, 'toolbar-available')).toContain('dropdown:formatting');
        expect(element.querySelector('[data-builder-list="toolbar-dropdowns"]')).toBeNull();

        const drawn = (id: string) => items(element, 'toolbar-available')
            .find((item) => item.dataset.toolbarItem === id)!.className;
        expect(drawn('dropdown:formatting')).toContain('has-menu');
        expect(drawn('addBlock')).toContain('has-menu');
        expect(drawn('bulletList')).not.toContain('has-menu');
    });

    it('places a dropdown as an ID, and stores nothing about what it holds', () => {
        const element = bare([2, 3]);
        add(element, 'toolbar-available', 'dropdown:formatting');

        // The toolbar is still order and presence, and a dropdown is still one ID in it. What it
        // holds lives alongside, keyed by name, so the drag that reorders the strip never has to
        // touch membership — which is what `{dropdown, items}` made unavoidable.
        expect(toolbarState(element)).toEqual(['bold', 'dropdown:formatting']);
        // And nothing is written until an author actually trims or reorders it, so an untouched
        // dropdown keeps following its registration and picks up whatever a later release adds.
        expect(dropdownState(element)).toEqual({});
        // Placing does not open it either. A menu unrolling under a drag that has just ended is a
        // surprise, and it would cover the strip the author is still building.
        expect(element.querySelector('[data-builder-menu]')).toBeNull();
    });

    it('trims a dropdown, keeps the trim, and can put it back', () => {
        // Every level the roster names is allowed here, so the menu draws all of them and this
        // test is about trimming alone. A level the schema vetoes is simply not in the menu — see
        // the omission test below.
        const element = bare([2, 3, 5]);
        add(element, 'toolbar-available', 'dropdown:formatting');
        items(element, 'toolbar-active').at(-1)!.click();

        // Vizy 3's `"formatting": ["h2", "h3", "p"]`, as a gesture: clicking a member takes it
        // out of the dropdown. What is stored is every member that stays, levels named one by one
        // — which is not the freeze it looks like, because all six are always there and the
        // Content schema decides which of them render.
        press(items(element, 'toolbar-members').find((item) => item.dataset.toolbarItem === 'codeBlock'));
        expect(dropdownState(element).formatting)
            .toEqual(['paragraph', 'heading2', 'heading3', 'heading5', 'blockquote']);

        // A switched-off member is struck through where it sits rather than hidden or herded into
        // a second row: a row you cannot see is a row you cannot switch back on, and a row that
        // jumps to the bottom of the menu when you click it is worse still.
        const off = [...element.querySelectorAll<HTMLElement>('.vizy-editor-config-menu-item.is-off')];
        expect(off.map((item) => item.dataset.toolbarItem)).toEqual(['codeBlock']);
        expect(ids(element, 'toolbar-members')).toEqual(FORMATTING_DROPDOWN.members);
        // The dropdown itself is untouched: trimming its contents is not removing it.
        expect(toolbarState(element)).toEqual(['bold', 'dropdown:formatting']);

        // Clicking it again puts it back, and a membership that says nothing the registration
        // does not is forgotten entirely — so an author who switches a member off and on again
        // ends up where they started, still following the roster.
        press(off[0]);
        expect(dropdownState(element)).toEqual({});
    });

    it('will not let the last member go, since an emptied dropdown opens onto nothing', () => {
        const element = bare([2, 3, 5]);
        add(element, 'toolbar-available', 'dropdown:formatting');
        items(element, 'toolbar-active').at(-1)!.click();

        for (const id of FORMATTING_DROPDOWN.members) {
            press(items(element, 'toolbar-members').find((item) => item.dataset.toolbarItem === id));
        }

        // The way to get rid of a dropdown is to get rid of the dropdown, not to empty it and
        // leave a trigger behind. Refused at the gesture as well as by the server, which will
        // not store an empty membership.
        expect(dropdownState(element).formatting).toHaveLength(1);
    });

    it('offers no way to add to a dropdown, only to subtract from it', () => {
        const element = bare([2]);
        add(element, 'toolbar-available', 'dropdown:formatting');
        items(element, 'toolbar-active').at(-1)!.click();

        // The question that settled this was Alignment: nobody wants a fifth item in a menu of
        // four alignments, and plenty of people want Justify out of it. So what a dropdown *may*
        // hold belongs to whoever registered it, and every row is one of that set — there is no
        // palette anywhere near the menu, and `underline` is not among them however much the
        // strip has of it.
        expect(ids(element, 'toolbar-members').every((id) => (
            FORMATTING_DROPDOWN.members.includes(id)
        ))).toBe(true);
        expect(element.querySelectorAll('[data-builder-menu] [data-builder-list$="-available"]')).toHaveLength(0);
    });

    it('takes a dropdown’s membership away with the dropdown', () => {
        const element = bare([2]);
        add(element, 'toolbar-available', 'dropdown:formatting');
        items(element, 'toolbar-active').at(-1)!.click();
        press(items(element, 'toolbar-members').find((item) => item.dataset.toolbarItem === 'codeBlock'));

        // Delete from the keyboard, activation now meaning "select this". Either way membership
        // belongs to the placed dropdown, which is what the server prunes to on save.
        items(element, 'toolbar-active')
            .find((item) => item.dataset.toolbarItem === 'dropdown:formatting')!
            .dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete', bubbles: true }));

        expect(toolbarState(element)).toEqual(['bold']);
        expect(dropdownState(element)).toEqual({});
        expect(element.querySelector('[data-builder-menu]')).toBeNull();
    });

    it('offers no heading level at all, the Formatting menu owning all six', () => {
        const element = bare([2, 3]);

        // They were ordinary buttons for a while, as in Vizy 3, gated on the config's levels so
        // that a palette permitting H2–H3 did not offer an H5 that could not render. Formatting
        // owns them now, so the level gating has moved to where the levels are: the menu leaves
        // out what the schema disallows, which is what the editor does with the real one.
        expect(ids(element, 'toolbar-available')).not.toContain('heading2');
        expect(ids(element, 'toolbar-available')).not.toContain('heading5');
    });

    it('draws one row in the order the server sequenced, dropdowns among the buttons', () => {
        // The sequence is the server's — see `PALETTE_ORDER` — and it covers both catalogs, which
        // is the argument for one row: three of its steps are dropdowns, so a buttons-only palette
        // could state only the part of the order that happened to be buttons. `paletteRank` is how
        // the two arrive able to be merged, the client knowing nothing about the sequence itself.
        //
        // The grouping within it is expressed by what ends up beside what, not by anything drawn.
        // A 12px gap at each boundary was tried and read as a set of dividers, competing with
        // `separator` a few squares along, which is genuinely a vertical rule.
        const element = mount({
            config: {
                capabilities: { nodes: ['bulletList'], marks: ['bold', 'italic'] },
                headings: { levels: [] },
                toolbar: [],
                bubble: { enabled: false, items: [] },
            },
            toolbarCatalog: [
                { id: 'bold', label: 'Bold', kind: 'mark', group: 'marks', icon: BOLD_SVG, paletteRank: 1 },
                { id: 'italic', label: 'Italic', kind: 'mark', group: 'marks', icon: BOLD_SVG, paletteRank: 2 },
                { id: 'bulletList', label: 'Bulleted list', kind: 'node', group: 'lists', icon: BOLD_SVG, capabilityKind: 'node', capabilityName: 'bulletList', paletteRank: 4 },
            ],
            // Ranked in front of Bold, and after Italic, so the merge cannot pass by appending one
            // catalog to the other — which is what it would look like if the ranks went unread.
            dropdownCatalog: [
                { ...FORMATTING_DROPDOWN, paletteRank: 0 },
                { id: 'dropdown:alignment', label: 'Alignment', kind: 'dropdown', group: 'Dropdowns', icon: null, members: ['alignCenter'], paletteRank: 3 },
            ],
        });

        expect(ids(element, 'toolbar-available')).toEqual([
            'dropdown:formatting', 'bold', 'italic', 'dropdown:alignment', 'bulletList',
        ]);
        expect(element.querySelector('.is-cluster-start')).toBeNull();
    });

    it('takes a dropdown out of the palette once it is placed', () => {
        const element = bare();
        add(element, 'toolbar-available', 'dropdown:formatting');

        // One named thing, so it is placed once — unlike while these were seeds, when what a
        // seed produced was a fresh, separately-editable dropdown and there was no sense in
        // which the seed itself was spoken for.
        expect(ids(element, 'toolbar-available')).not.toContain('dropdown:formatting');
        // The separator is the only thing that never runs out.
        expect(ids(element, 'toolbar-available')).toContain('separator');
    });

    it('never offers a control a dropdown owns, placed or not', () => {
        const element = bare([2]);

        // Not offered before the dropdown is anywhere near the toolbar, which is the whole
        // difference. This used to offer every member as a button and then subtract the ones a
        // *placed* dropdown held — so adding one chip made four vanish from a palette the author
        // was not looking at, and only in that direction: place the members first and the
        // dropdown was still on offer, so the strip could hold each command twice.
        expect(ids(element, 'toolbar-available')).not.toContain('blockquote');
        expect(ids(element, 'toolbar-available')).not.toContain('heading2');
        expect(ids(element, 'toolbar-available')).not.toContain('alignCenter');

        // And still not offered once it is placed, nor once a member is switched off. Switching
        // one off now means the editor does not offer that format at all, rather than moving it
        // out to the strip.
        add(element, 'toolbar-available', 'dropdown:formatting');
        items(element, 'toolbar-active').at(-1)!.click();
        press(items(element, 'toolbar-members').find((item) => item.dataset.toolbarItem === 'blockquote'));
        expect(ids(element, 'toolbar-available')).not.toContain('blockquote');

        // What belongs to no dropdown is offered as ever, which is the check that the flag is
        // doing the work and not the family names.
        expect(ids(element, 'toolbar-available')).toContain('bulletList');
        expect(ids(element, 'toolbar-available')).toContain('undo');
    });

    it('selects a placed dropdown and opens it, as the menu it will be', () => {
        const element = bare([2, 3, 5]);
        add(element, 'toolbar-available', 'dropdown:formatting');

        items(element, 'toolbar-active').at(-1)!.click();

        // Plugin Kit `sm` menu UI preview: panel + rows (not a live pk-dropdown-menu —
        // the roster stays open for toggle/drag). Heading preview typography lives on
        // `.preview-label[data-preview]`.
        const menu = element.querySelector('[data-builder-menu]')!;
        expect(menu).not.toBeNull();
        expect(menu.classList.contains('vizy-editor-config-menu')).toBe(true);
        expect(menu.getAttribute('data-size')).toBe('sm');
        expect(menu.getAttribute('role')).toBe('menu');
        expect(ids(element, 'toolbar-members')).toEqual(FORMATTING_DROPDOWN.members);

        // Inside the toolbar preview, under the trigger: it is a preview of a menu and it belongs
        // where a menu goes.
        expect(menu.closest('.vizy-editor-config-editor')).not.toBeNull();
        // And the trigger reads as open, as it would in the editor.
        expect(items(element, 'toolbar-active').at(-1)!.classList.contains('is-selected')).toBe(true);

        // The menu is the whole of what selecting a dropdown produces. There was a panel under
        // the preview too, naming it and carrying a Remove link and the rules for its kind — a
        // tinted box and four lines of prose around one control that had nowhere else to go.
        expect(element.querySelector('[data-builder-selection]')).toBeNull();
        expect(element.querySelector('vizy-icon-picker')).toBeNull();
        // Nothing to reset on a dropdown nobody has trimmed, and offering it would imply there
        // were something stored to undo.
        expect(element.querySelector('[data-dropdown-reset]')).toBeNull();

        // Clicking the same button again deselects it, closing the menu. One gesture covers both.
        items(element, 'toolbar-active').at(-1)!.click();
        expect(element.querySelector('[data-builder-menu]')).toBeNull();
    });

    it('closes an open menu on a click anywhere else, and not on a click inside it', () => {
        const element = bare([2, 3, 5]);
        add(element, 'toolbar-available', 'dropdown:formatting');

        const trigger = () => items(element, 'toolbar-active')
            .find((item) => item.dataset.toolbarItem === 'dropdown:formatting')!;
        const menu = () => element.querySelector('[data-builder-menu]');

        trigger().click();
        expect(menu()).not.toBeNull();

        // Switching several rows off in one visit is the point of click-to-toggle, so a click in
        // the menu is exempt — as is a click on any builder button, whose own handler already knows
        // whether it means add, select, deselect or toggle.
        items(element, 'toolbar-members')[2].click();
        expect(menu()).not.toBeNull();

        // Anything else closes it. Clicking the trigger again still does too, but being the only
        // way is what made it feel wrong.
        element.querySelector<HTMLElement>('.instructions')!.click();
        expect(menu()).toBeNull();
        expect(element.querySelector('.vizy-control.is-selected')).toBeNull();

        // Including a click with nothing to do with this panel at all.
        trigger().click();
        expect(menu()).not.toBeNull();
        document.body.click();
        expect(menu()).toBeNull();

        // And a click on a plain button in the strip, which draws nothing of its own but is still
        // somewhere other than the menu. `#dismiss` exempts builder buttons so that `#select`
        // stays the one place deciding what a click on one means; this is that decision.
        trigger().click();
        expect(menu()).not.toBeNull();
        items(element, 'toolbar-active').find((item) => item.dataset.toolbarItem === 'bold')!.click();
        expect(menu()).toBeNull();
    });

    it('marks the open dropdown as expanded, and marks nothing else at all', () => {
        const element = bare([2, 3, 5]);
        add(element, 'toolbar-available', 'dropdown:formatting');

        const placed = () => items(element, 'toolbar-active');
        const trigger = () => placed().find((item) => item.dataset.toolbarItem === 'dropdown:formatting')!;

        // Closed, but still the only placed item carrying the attribute: a plain button has no
        // expanded state to report, having nothing to expand.
        expect(trigger().getAttribute('aria-expanded')).toBe('false');
        expect(placed().filter((item) => item.hasAttribute('aria-expanded')).length).toBe(1);

        trigger().click();
        expect(trigger().getAttribute('aria-expanded')).toBe('true');
        expect(element.querySelectorAll('.vizy-control.is-selected').length).toBe(1);
    });

    it('closes the menu on Escape, handing the keyboard back to the trigger', () => {
        const element = bare([2, 3, 5]);
        add(element, 'toolbar-available', 'dropdown:formatting');

        const trigger = () => items(element, 'toolbar-active')
            .find((item) => item.dataset.toolbarItem === 'dropdown:formatting')!;
        trigger().click();

        // From the row, since that is where a keyboard author is once they have been down the menu.
        // Not scoped to keystrokes from inside the component: Safari does not focus a button when
        // it is clicked, so a mouse user there presses Escape with focus still on the body.
        items(element, 'toolbar-members')[1].focus();
        document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

        expect(element.querySelector('[data-builder-menu]')).toBeNull();
        // The row that had focus no longer exists, so the trigger takes it rather than the body.
        expect(document.activeElement).toBe(trigger());
    });

    it('keeps the keyboard on the row it was on, across a toggle', () => {
        const element = bare([2, 3, 5]);
        add(element, 'toolbar-available', 'dropdown:formatting');
        items(element, 'toolbar-active').at(-1)!.click();

        const row = () => items(element, 'toolbar-members')
            .find((item) => item.dataset.toolbarItem === 'heading3')!;

        // Every edit re-renders, which replaces the row outright. Without carrying focus over,
        // switching a row off with the keyboard stranded the author on the body, so switching off
        // three of them meant tabbing back in three times.
        row().focus();
        press(row());

        expect(document.activeElement).toBe(row());
        expect(row().classList.contains('is-off')).toBe(true);
    });

    it('holds the menu still where it was scrolled to, across a toggle', () => {
        // jsdom does no layout, so nothing is ever scrollable and `scrollTop` reads back as 0. A
        // real accessor for the duration, then: the point under test is that a re-render carries
        // the position from the old menu to the new one, and that needs somewhere to carry it to.
        const positions = new WeakMap<Element, number>();
        const real = Object.getOwnPropertyDescriptor(Element.prototype, 'scrollTop')!;
        Object.defineProperty(Element.prototype, 'scrollTop', {
            configurable: true,
            get(this: Element) { return positions.get(this) ?? 0; },
            set(this: Element, value: number) { positions.set(this, value); },
        });

        try {
            const element = bare([2, 3, 5]);
            add(element, 'toolbar-available', 'dropdown:formatting');
            items(element, 'toolbar-active').at(-1)!.click();

            const menu = () => element.querySelector<HTMLElement>('[data-builder-menu]')!;
            menu().scrollTop = 120;

            // Switching a row off re-renders the panel, which replaces the menu element outright.
            // Without carrying the position over, a Formatting menu — nine rows in a 300px box —
            // jumped back to Paragraph on every click, so switching off H4, H5 and H6 meant
            // finding your place again twice.
            press(items(element, 'toolbar-members').find((item) => item.dataset.toolbarItem === 'codeBlock'));

            expect(menu().scrollTop).toBe(120);
        } finally {
            Object.defineProperty(Element.prototype, 'scrollTop', real);
        }
    });

    it('leaves the panel standing when a click means nothing, and replaces it when it means close', () => {
        const element = bare([2, 3, 5]);
        const bold = () => items(element, 'toolbar-active').find((item) => item.dataset.toolbarItem === 'bold')!;

        // Nothing is selected, and a plain button is not selectable, so this click has nothing to
        // do. It used to re-render anyway — throwing away the panel's markup to arrive at the state
        // it was already in, which is how a click on Bold came to move the page at all.
        const standing = bold();
        standing.click();
        expect(bold()).toBe(standing);

        // A click that does close something still rebuilds, the menu being part of the markup.
        add(element, 'toolbar-available', 'dropdown:formatting');
        items(element, 'toolbar-active').at(-1)!.click();
        expect(element.querySelector('[data-builder-menu]')).not.toBeNull();

        const doomed = bold();
        doomed.click();
        expect(bold()).not.toBe(doomed);
        expect(element.querySelector('[data-builder-menu]')).toBeNull();
    });

    it('keeps the page where it was, across a rebuild of the panel', () => {
        const element = bare([2, 3, 5]);
        const host = element.querySelector<HTMLElement>('[data-vizy-config-host]')!;

        // jsdom lays nothing out, so the two halves of this are modelled rather than observed: a
        // page scrolled some way down, and a document that loses most of its height while the
        // panel's markup is being replaced. The browser clamps a scroll position past the end of a
        // shorter document and does not put it back when the height returns, which threw anyone
        // scrolled far enough to the top on a click that only meant to open a menu.
        let page = 400;
        Object.defineProperty(document.documentElement, 'scrollTop', {
            configurable: true,
            get: () => page,
            set: (value: number) => { page = value; },
        });
        const real = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML')!;
        Object.defineProperty(host, 'innerHTML', {
            configurable: true,
            get: real.get,
            set(this: Element, value: string) {
                page = 0;
                real.set!.call(this, value);
            },
        });

        try {
            add(element, 'toolbar-available', 'dropdown:formatting');
            expect(page).toBe(400);
        } finally {
            delete (host as unknown as Record<string, unknown>).innerHTML;
            delete (document.documentElement as unknown as Record<string, unknown>).scrollTop;
        }
    });

    it('offers no Reset in the menu, removing the dropdown being the way back', () => {
        const element = bare([2, 3, 5]);
        add(element, 'toolbar-available', 'dropdown:formatting');
        items(element, 'toolbar-active').at(-1)!.click();

        press(items(element, 'toolbar-members').find((item) => item.dataset.toolbarItem === 'codeBlock'));
        expect(dropdownState(element).formatting).not.toContain('codeBlock');

        // A footer for one control, on one kind of item, in one of its states — and the control
        // duplicated what dragging the dropdown out and back in already does, since a placed
        // dropdown's membership goes with it.
        expect(element.querySelector('[data-dropdown-reset]')).toBeNull();
        expect(element.querySelector('.vizy-editor-config-menu-footer')).toBeNull();

        items(element, 'toolbar-active')
            .find((item) => item.dataset.toolbarItem === 'dropdown:formatting')!
            .dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete', bubbles: true }));
        add(element, 'toolbar-available', 'dropdown:formatting');
        expect(dropdownState(element)).toEqual({});
    });

    it('previews each row as the style it applies, which is why it is a menu', () => {
        const element = bare([2, 3]);
        add(element, 'toolbar-available', 'dropdown:formatting');
        items(element, 'toolbar-active').at(-1)!.click();

        const row = (id: string) => items(element, 'toolbar-members')
            .find((item) => item.dataset.toolbarItem === id)!;

        // `data-preview` on `.preview-label` keys the typography — 20px semibold for an H2,
        // italic for a quote, mono for code. Same tokens as the live toolbar.
        expect(row('heading2').querySelector('.preview-label')!.getAttribute('data-preview')).toBe('heading2');
        expect(row('heading3').querySelector('.preview-label')!.getAttribute('data-preview')).toBe('heading3');
        expect(row('blockquote').querySelector('.preview-label')!.getAttribute('data-preview')).toBe('blockquote');
        expect(row('codeBlock').querySelector('.preview-label')!.getAttribute('data-preview')).toBe('codeBlock');

        // A row is its name, with the glyph alongside if the control has one — the reverse of the
        // strip, where the glyph is the whole button and the name is only an accessible label.
        expect(row('heading2').querySelector('.preview-label')!.textContent!.trim()).toBe('Heading 2');
        expect(row('heading2').querySelector('.vizy-editor-config-menu-icon')).not.toBeNull();
    });

    it('leaves out what the schema disallows, drawing the menu the editor will build', () => {
        const element = bare([2, 3]);
        add(element, 'toolbar-available', 'dropdown:formatting');
        items(element, 'toolbar-active').at(-1)!.click();

        // Ordinary members rather than one row reading "Heading levels: H2, H3". That row was an
        // attempt to keep the levels following the Content schema, which storing a *snapshot* of
        // the schema had broken — but all six always exist, so naming them all freezes nothing,
        // and it reads as the H1…H6 authors expect.
        expect(ids(element, 'toolbar-members')).toContain('heading2');
        expect(ids(element, 'toolbar-members')).toContain('heading3');

        // And a level the schema does not allow is absent, not faded. `dropdownControl` resolves
        // each member and drops the ones that resolve to nothing, so this is the menu the editor
        // will actually build — a preview drawing the vetoed rows greyed out is showing the
        // roster, not the menu. The strip fades instead, because there the author placed the
        // button themselves; nobody places H5 as a Formatting member.
        expect(ids(element, 'toolbar-members')).not.toContain('heading5');
        expect(element.querySelectorAll('[data-builder-menu] .is-unavailable')).toHaveLength(0);

        // Nothing was stored by any of this: leaving a member out is the schema's doing, not this
        // dropdown's, so the config stays untrimmed and keeps following the registration. Ticking
        // the level under Content schema is the whole of the way back.
        expect(dropdownState(element)).toEqual({});
    });

    it('keeps Paragraph in a Formatting menu whatever the schema says', () => {
        // Which is why the "nothing can render" note is not reachable through Formatting: prose
        // always permits a paragraph, so the menu keeps at least one row however much is switched
        // off. `controlFor` special-cases it for the same reason, and the two have to agree or the
        // preview would show an empty menu the editor then fills.
        const element = mount({
            config: {
                capabilities: { nodes: [], marks: ['bold'] },
                headings: { levels: [] },
                toolbar: ['dropdown:formatting'],
                bubble: { enabled: false, items: [] },
            },
        });
        items(element, 'toolbar-active').at(-1)!.click();

        expect(ids(element, 'toolbar-members')).toEqual(['paragraph']);
        expect(element.querySelector('.vizy-editor-config-menu-empty')).toBeNull();
    });

    it('marks a dropdown as available whatever the capabilities say', () => {
        const element = mount({
            config: {
                capabilities: { nodes: [], marks: [] },
                headings: { levels: [] },
                toolbar: ['dropdown:formatting'],
                bubble: { enabled: false, items: [] },
            },
        });

        // Its contents are pruned against the capabilities where they are resolved, so the
        // builder would have to reimplement that to say otherwise — and the answer is usually
        // "yes, minus an option", which is not what the unavailable marker means.
        expect(items(element, 'toolbar-active')[0].classList.contains('is-unavailable')).toBe(false);
    });
});

describe('clicking a builder item', () => {
    it('adds from a palette, and neither removes nor marks a plain button in the strip', () => {
        const element = mount();

        // Click-to-add is the quickest way to build a toolbar without dragging.
        items(element, 'toolbar-available').find((item) => item.dataset.toolbarItem === 'undo')!.click();
        expect(toolbarState(element)).toEqual(['bold', 'separator', 'italic', 'undo']);

        // A click in the strip used to remove, and could not go on doing so once a dropdown needed
        // a way to be opened: one gesture cannot both remove a button and show what is inside it.
        // So it does neither here. The highlight is reserved for an open dropdown, since `Delete`
        // is bound to each button's own keydown and so acts on the button holding the keyboard —
        // which the focus ring already says, and a second mark claiming the same thing was one too
        // many.
        items(element, 'toolbar-active')[0].click();
        expect(toolbarState(element)).toEqual(['bold', 'separator', 'italic', 'undo']);
        expect(items(element, 'toolbar-active')[0].className).not.toContain('is-selected');
        expect(items(element, 'toolbar-active')[0].getAttribute('aria-expanded')).toBeNull();

        // Removal is a drag out or this keystroke. It was briefly a labelled link in a panel
        // below the preview, which cost a tinted box, a heading and four lines of prose to host
        // one control — and the panel's real justification, that the keystroke was undocumented,
        // is answered by documenting it in the section's instructions.
        items(element, 'toolbar-active')[0]
            .dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete', bubbles: true }));
        expect(toolbarState(element)).toEqual(['separator', 'italic', 'undo']);
        expect(element.querySelector('.vizy-control.is-selected')).toBeNull();
    });

    it('removes the separator the keystroke came from, not the first one', () => {
        const element = mount({
            config: {
                capabilities: { nodes: [], marks: ['bold'] },
                headings: { levels: [] },
                toolbar: ['separator', 'bold', 'separator'],
                bubble: { enabled: false, items: [] },
            },
        });

        // Delete carries the button's position rather than its ID, for exactly this: a toolbar may
        // hold several separators and an ID alone cannot say which one the author was on.
        items(element, 'toolbar-active')[2]
            .dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete', bubbles: true }));

        expect(toolbarState(element)).toEqual(['separator', 'bold']);
    });

});

describe('what a toolbar is made of', () => {
    it('tells a dropdown from a button by its prefix', () => {
        // One namespace for two kinds of thing needs a mark: a `table` dropdown and a `table`
        // button are both plausible, and were briefly the same token.
        expect(isDropdownKey('dropdown:formatting')).toBe(true);
        expect(isDropdownKey('bold')).toBe(false);
        expect(DROPDOWN_PREFIX).toBe('dropdown:');
    });

    it('counts what the toolbar names, and nothing further in', () => {
        // It used to reach inside every dropdown for its members as well. See the palette test
        // above for why that had to go with the contents becoming fixed.
        expect(claimedKeys(['bold', 'dropdown:formatting'])).toEqual(new Set(['bold', 'dropdown:formatting']));
    });

    it('trusts the index a drag reports only while it still holds that item', () => {
        const toolbar: ToolbarEntry[] = ['separator', 'bold', 'separator'];

        // A separator may appear several times, so an ID alone is ambiguous and the index is
        // what disambiguates — until a re-render between pick-up and release invalidates it.
        expect(indexOfEntry(toolbar, 'separator', 2)).toBe(2);
        expect(indexOfEntry(toolbar, 'separator', 1)).toBe(0);
        expect(indexOfEntry(toolbar, 'italic')).toBe(-1);
    });
});

describe('editor config toolbar builder', () => {
    it('renders both areas as the same icon buttons, neither of them faded', () => {
        const element = mount();

        const available = items(element, 'toolbar-available');
        const active = items(element, 'toolbar-active');

        // Both areas share one renderer, so the strip genuinely previews the
        // toolbar rather than showing a different kind of thing.
        expect(available.every((item) => item.classList.contains('vizy-control'))).toBe(true);
        expect(active.every((item) => item.classList.contains('vizy-control'))).toBe(true);

        // The variant is a behavioural hook — a click adds on one side and removes
        // on the other — and no longer changes how the item looks. Fading the
        // available ones read as "disabled" rather than "not in use yet".
        expect(available.every((item) => item.classList.contains('is-available'))).toBe(true);
        expect(active.some((item) => item.classList.contains('is-available'))).toBe(false);

        const css = readFileSync(
            resolve(process.cwd(), 'src/web/assets/editorconfigsettings/src/ts/editor-config-settings.css'),
            'utf8',
        );
        expect(css).not.toMatch(/\.vizy-control\.is-available\s*\{/);
        // Filled rather than outlined, as in Craft's CKEditor toolbar builder: a visible
        // outline around every item made a toolbar look like a grid of boxes. The border
        // is present but transparent, so that the reserved slot — which is a dashed
        // border on one of these buttons — cannot sit a pixel off its neighbours.
        const control = css.match(/\.vizy-control\s*\{[^}]*\}/)?.[0] ?? '';
        expect(control).toMatch(/border:\s*1px solid transparent/);
        expect(control).toMatch(/box-sizing:\s*border-box/);

        // Unlabelled: the glyph carries the meaning and the name is on attributes.
        const bold = active.find((item) => item.dataset.toolbarItem === 'bold');
        expect(bold?.querySelector('svg')).not.toBeNull();
        expect(bold?.textContent?.trim()).toBe('');
        expect(bold?.getAttribute('aria-label')).toBe('Bold');
    });

    it('names items via aria-label only, with no tooltip and no hint line', () => {
        const element = mount();
        const all = [...items(element, 'toolbar-available'), ...items(element, 'toolbar-active')];

        // A native tooltip pops up at the cursor and hides the neighbours, which
        // is worst exactly when dragging between them.
        expect(all.every((item) => !item.hasAttribute('title'))).toBe(true);
        // So `aria-label` is the only thing carrying the accessible name.
        expect(all.every((item) => (item.getAttribute('aria-label') ?? '') !== '')).toBe(true);
        // The readout line that briefly stood in for the tooltips is gone; the
        // icons are left to speak for themselves.
        expect(element.querySelector('[data-builder-readout]')).toBeNull();
    });

    it('offers no remove buttons, because removal is a drag back out', () => {
        const element = mount();
        expect(element.querySelectorAll('.vizy-control-remove')).toHaveLength(0);
    });

    it('keeps a control’s glyph out of hit testing, so the button is what gets grabbed', () => {
        // Asserted against the stylesheet text because happy-dom applies no layout
        // and does no hit testing, so the behaviour itself is unobservable here.
        // Worth guarding even so: without this rule a press landed on the glyph —
        // an SVGPathElement, which the drag sensor does not recognise as one of its
        // draggables — and dragging silently did nothing at all, while clicking
        // carried on working because a click bubbles to the button.
        const css = readFileSync(
            resolve(process.cwd(), 'src/web/assets/editorconfigsettings/src/ts/editor-config-settings.css'),
            'utf8',
        );

        expect(css).toMatch(/\.vizy-control\s*>\s*\*\s*\{[^}]*pointer-events:\s*none/);
        // The browser must not claim the gesture for a native drag or a selection.
        expect(css).toMatch(/-webkit-user-drag:\s*none/);
        expect(css).toMatch(/user-select:\s*none/);
    });

    it('opens the menu over the preview rather than growing the panel', () => {
        const css = readFileSync(
            resolve(process.cwd(), 'src/web/assets/editorconfigsettings/src/ts/editor-config-settings.css'),
            'utf8',
        );

        // In the flow, the menu was a block between the strip and the body stub, so opening one
        // grew the tinted panel by up to 300px and pushed everything below it down the page —
        // which is a lot of movement for a click that selects something.
        expect(css).toMatch(/\.vizy-editor-config-menu\s*\{[^}]*position:\s*absolute/);
        // Which needs a containing block, and needs the panel to stop clipping: a menu taller than
        // the body stub has to be free to hang past the panel's bottom edge.
        expect(css).toMatch(/\.vizy-editor-config-editor\s*\{[^}]*position:\s*relative/);
        expect(css).not.toMatch(/\.vizy-editor-config-builder\s*\{[^}]*overflow:/);
        // The browser must not claim the gesture for a native drag or a selection.
        expect(css).toMatch(/-webkit-user-drag:\s*none/);
        expect(css).toMatch(/user-select:\s*none/);
    });

    it('names the gesture that gets someone started, and stops', () => {
        const element = mount();
        const instructions = element.querySelector('[data-builder="toolbar"]')
            ?.previousElementSibling?.textContent?.trim() ?? '';

        // One sentence. It reached five as each behaviour was added — remove, open a dropdown, edit
        // its contents, and why its contents are fixed — which is a paragraph of rules above a
        // panel whose whole argument is that it can be experimented with. Dragging is the one thing
        // nothing on screen hints at, so it is the one thing said.
        expect(instructions).toBe('Drag toolbar items into the editor.');

        // Said once, and not again inside the builder.
        expect(element.querySelectorAll('.vizy-editor-config-builder .instructions')).toHaveLength(0);
    });

    it('registers every string it asks Craft to translate', () => {
        // `Craft.t` returns the message untouched when the category has not been registered for
        // the page, so a missing entry here does not throw — it ships English to a translated
        // control panel, and only for the strings nobody checked. The list had rotted to eight
        // strings the builder no longer says and four it had started saying, which is precisely
        // the failure mode this shape of test exists for.
        const source = ['VizyEditorConfigSettingsElement.ts', 'ToolbarDragList.ts', 'toolbar-entries.ts']
            .map((file) => readFileSync(
                resolve(process.cwd(), 'src/web/assets/editorconfigsettings/src/ts', file),
                'utf8',
            ))
            .join('\n');
        const registered = readFileSync(
            resolve(process.cwd(), 'src/web/assets/editorconfigsettings/EditorConfigSettingsAsset.php'),
            'utf8',
        );

        const asked = [...source.matchAll(/\bt\('vizy', '([^']*)'/g)].map((match) => match[1]);
        expect(asked.length).toBeGreaterThan(10);

        for (const message of new Set(asked)) {
            // Compared against the PHP source rather than a parsed array: the file is a literal
            // list, and reaching for a PHP parser to read one array of strings would cost more
            // than it protects.
            expect(registered).toContain(`'${message}'`);
        }
    });

    it('exposes the drag contract both lists need to be sortable', () => {
        const element = mount();

        expect(element.querySelector('[data-builder="toolbar"]')).not.toBeNull();
        expect(element.querySelector('[data-builder-list="toolbar-available"]')).not.toBeNull();
        expect(element.querySelector('[data-builder-list="toolbar-active"]')).not.toBeNull();
    });

    it('says why an emptied list is empty, and still anchors the end of it', () => {
        const element = mount({
            config: {
                capabilities: { nodes: [], marks: ['bold'] },
                headings: { levels: [2] },
                toolbar: [],
                bubble: { enabled: false, items: [] },
            },
        });

        // An empty strip otherwise reads as broken rather than as waiting for items.
        const active = element.querySelector('[data-builder-list="toolbar-active"]');
        expect(active?.querySelector('[data-empty-placeholder]')).not.toBeNull();
        // The tail is still needed: it is what the reserved slot is inserted in front
        // of, so a first item dropped into an empty toolbar has somewhere to go.
        expect(active?.querySelector('[data-builder-tail]')).not.toBeNull();
    });

    it('gives the toolbar an end-of-list anchor, but not the available list', () => {
        const element = mount();

        const active = element.querySelector('[data-builder-list="toolbar-active"]');
        const tail = active?.querySelector('[data-builder-tail]');
        expect(tail).not.toBeNull();
        // Last in the DOM, so the slot goes in front of it and lands after the items
        // rather than out at the right-hand edge.
        expect(active?.lastElementChild).toBe(tail);
        // Nothing inside it. It was once a droppable needing an unpickable handle;
        // placement no longer goes through droppables at all.
        expect(tail?.childElementCount).toBe(0);

        // The available list is a source only — releasing outside the toolbar is
        // what removes an item, so there is no position to drop into here.
        const available = element.querySelector('[data-builder-list="toolbar-available"]');
        expect(available?.querySelector('[data-builder-tail]')).toBeNull();
    });

    it('titles every part of each builder, since the items no longer differ', () => {
        const element = mount();

        const heads = (builder: string): string[] =>
            [...element.querySelectorAll(`[data-builder="${builder}"] .vizy-editor-config-subhead`)]
                .map((node) => node.textContent?.trim() ?? '');

        // With the available items drawn exactly like toolbar items, a heading is the only thing
        // left saying which part is which. Two of them now: `Available dropdowns` went when the
        // palettes became one row, and `items` is what that row holds — buttons and dropdowns.
        expect(heads('toolbar')).toEqual(['Available items', 'Toolbar preview']);
        // The Bubble Menu really does hold nothing but buttons, being a flat row of marks.
        expect(heads('bubble')).toEqual(['Available buttons', 'Bubble Menu preview']);

        // Each heading belongs to the group holding its list, so it stays attached
        // when the panel reflows.
        const groups = element.querySelectorAll('[data-builder="toolbar"] .vizy-editor-config-group');
        expect(groups).toHaveLength(2);
        expect(groups[0].querySelector('[data-builder-list="toolbar-available"]')).not.toBeNull();
        expect(groups[1].querySelector('[data-builder-list="toolbar-active"]')).not.toBeNull();
    });

    it('draws the toolbar as an editor, with a body stub the Bubble Menu does not get', () => {
        const element = mount();

        // The strip is a preview of a real toolbar, so it is given the top of a
        // real editor: a slice of body beneath it whose side rules continue down
        // and fade out. Without it the strip reads as just another row of chips.
        const editor = element.querySelector('[data-builder="toolbar"] .vizy-editor-config-editor');
        expect(editor).not.toBeNull();
        expect(editor?.querySelector('[data-builder-list="toolbar-active"]')).not.toBeNull();

        const canvas = editor?.querySelector('.vizy-editor-config-canvas');
        expect(canvas).not.toBeNull();
        // After the strip, so the rules run downwards out of the toolbar.
        expect(editor?.lastElementChild).toBe(canvas);
        // Empty until a dropdown is opened in the strip, and never a drop target itself — the
        // menu it then holds registers its own zone.
        expect(canvas?.hasAttribute('data-builder-list')).toBe(false);
        expect(canvas?.classList.contains('has-menu')).toBe(false);
        expect(canvas?.textContent?.trim()).toBe('');

        // A Bubble Menu floats over content instead of framing it, so it has no
        // body to preview.
        const bubble = element.querySelector('[data-builder="bubble"]');
        expect(bubble?.querySelector('.vizy-editor-config-editor')).toBeNull();
        expect(bubble?.querySelector('.vizy-editor-config-canvas')).toBeNull();
    });

    it('sizes preview buttons exactly as the real toolbar does', () => {
        // The builder strip is a preview of the editor's toolbar, so a button here has to
        // be the same box as a button there. They are separate bundles — one a stylesheet,
        // one a Lit `css` block in a shadow root — so nothing keeps them in step but this.
        const preview = readFileSync(
            resolve(process.cwd(), 'src/web/assets/editorconfigsettings/src/ts/editor-config-settings.css'),
            'utf8',
        );
        const real = readFileSync(
            resolve(process.cwd(), 'src/web/assets/field/src/ts/toolbar/control-appearance.ts'),
            'utf8',
        );

        const box = (source: string): string[] => {
            const rule = source.match(/\.vizy-control\s*\{[^}]*\}/)?.[0] ?? '';
            return [
                rule.match(/width:\s*([^;]+);/)?.[1] ?? '',
                rule.match(/height:\s*([^;]+);/)?.[1] ?? '',
                rule.match(/font-size:\s*([^;]+);/)?.[1] ?? '',
                rule.match(/border:\s*([^;]+);/)?.[1] ?? '',
                rule.match(/box-sizing:\s*([^;]+);/)?.[1] ?? '',
            ];
        };

        expect(box(preview)).toEqual(['32px', '32px', '16px', '1px solid transparent', 'border-box']);
        expect(box(real)).toEqual(box(preview));
    });

    it('marks a dropdown with a chevron SVG, matching between preview and editor', () => {
        const preview = readFileSync(
            resolve(process.cwd(), 'src/web/assets/editorconfigsettings/src/ts/editor-config-settings.css'),
            'utf8',
        );
        const real = readFileSync(
            resolve(process.cwd(), 'src/web/assets/field/src/ts/toolbar/control-appearance.ts'),
            'utf8',
        );
        const chevron = readFileSync(
            resolve(process.cwd(), 'src/web/assets/shared/menu-chevron.ts'),
            'utf8',
        );

        expect(chevron).toContain('iconToSvg(chevronDown)');
        expect(preview).toMatch(/\.vizy-control\.has-menu\s*\{[^}]*gap:\s*4px/);
        expect(real).toMatch(/\.vizy-control\.has-menu\s*\{[^}]*gap:\s*4px/);
        expect(preview).toMatch(/\.vizy-control-chevron svg/);
        expect(real).toMatch(/\.vizy-control\.has-menu \.chevron svg/);
        expect(preview).not.toMatch(/\.vizy-control-chevron\s*\{[^}]*border-right:/);
        expect(real).not.toMatch(/\.vizy-control\.has-menu \.chevron\s*\{[^}]*border-right:/);
    });

    it('frames the editor with Plugin Kit input border tokens', () => {
        const editorCss = readFileSync(
            resolve(process.cwd(), 'src/web/assets/field/src/ts/vizy.css'),
            'utf8',
        );
        const previewCss = readFileSync(
            resolve(process.cwd(), 'src/web/assets/editorconfigsettings/src/ts/editor-config-settings.css'),
            'utf8',
        );

        expect(editorCss).toMatch(/--vizy-border:\s*var\(--pk-input-border-color/);
        expect(editorCss).toMatch(/--vizy-radius:\s*var\(--pk-input-border-radius/);
        expect(editorCss).not.toMatch(/border-radius:\s*6px/);
        expect(editorCss).toMatch(/\.vizy-editor-body\s*\{[\s\S]*border:\s*1px solid var\(--vizy-border\)/);
        expect(editorCss).toMatch(
            /\.vizy-editor-body:has\(\.vizy-editor-surface:focus-within\)[\s\S]*border-color:\s*var\(--vizy-focus/,
        );
        expect(editorCss).toMatch(
            /\.vizy-editor-body:has\(\.vizy-editor-surface:focus-within\)[\s\S]*box-shadow:[\s\S]*--pk-input-focus-shadow/,
        );
        expect(editorCss).toMatch(/vizy-toolbar[\s\S]*position:\s*sticky/);
        expect(editorCss).toMatch(/vizy-toolbar[\s\S]*border-bottom:\s*1px solid var\(--vizy-border\)/);
        expect(editorCss).not.toMatch(
            /\.vizy-editor-body:focus-within vizy-toolbar[\s\S]*border-color:\s*var\(--vizy-focus\)/,
        );
        expect(editorCss).not.toMatch(
            /\.vizy-editor-body:focus-within \.vizy-editor-surface[\s\S]*border-color:\s*var\(--vizy-focus\)/,
        );
        expect(editorCss).not.toMatch(
            /\.ProseMirror \.is-empty::before[\s\S]*content:\s*attr\(data-placeholder\)/,
        );
        expect(previewCss).toMatch(/\.vizy-editor-config-active[\s\S]*var\(--pk-input-border-color/);
        expect(previewCss).toMatch(/\.vizy-editor-config-canvas[\s\S]*var\(--pk-input-border-color/);
    });

    it('carries the button clear of the cursor, wherever it was grabbed', () => {
        const source = readFileSync(
            resolve(process.cwd(), 'src/web/assets/editorconfigsettings/src/ts/ToolbarDragList.ts'),
            'utf8',
        );

        // The grab point is cancelled out rather than nudged past. dnd-kit keeps
        // whichever point of the button you pressed under the pointer, so a fixed
        // offset would still leave the button under the cursor when grabbed by its
        // right-hand edge.
        expect(source).toMatch(/#grabPoint\.x - rect\.left \+ ToolbarDragList\.#carryGap/);
        expect(source).toMatch(/#grabPoint\.y - rect\.top \+ ToolbarDragList\.#carryGap/);
        // `pointerdown`, not the drag's first move: by then the pointer has travelled
        // far enough for the sensor to call it a drag, which would skew the offset.
        expect(source).toMatch(/addEventListener\('pointerdown'/);
        // Through `transform`, the one positioning property dnd-kit leaves alone on an
        // overlay, and which composes with the `translate` it drives every frame.
        expect(source).toMatch(/setProperty\('transform', `translate\(/);
    });

    it('offers one meaning per pointer position, having retired the combine gesture', () => {
        // Dropping one button onto another used to make a dropdown of the pair, and it cost
        // the builder its primary gesture. Buttons are 36px and flush, so a middle-half
        // "combine" band left roughly an 18px channel between neighbours in which a slot was
        // still offered: the dashed outline looked like it had gone, and placing an item
        // became luck. Dwell-gating it on a 500ms pause made insertion available everywhere
        // again but left two meanings for one release to choose between.
        const source = readFileSync(
            resolve(process.cwd(), 'src/web/assets/editorconfigsettings/src/ts/ToolbarDragList.ts'),
            'utf8',
        );

        // Gone entirely, along with the dwell timer that was propping it up. A dropdown is
        // now a palette item, and filling one is a drop into its menu.
        expect(source).not.toMatch(/combine|Combine|dwell|Dwell/);

        // Which leaves a release meaning exactly one thing: the position the slot is in.
        expect(source).toMatch(/const zone = this\.#geometry\.get\(name\);/);
        expect(source).toMatch(/this\.#landingZone = name;/);
    });

    it('takes drops in the strip and in the open dropdown, and positions nothing against them', () => {
        const drag = readFileSync(
            resolve(process.cwd(), 'src/web/assets/editorconfigsettings/src/ts/ToolbarDragList.ts'),
            'utf8',
        );
        const host = readFileSync(
            resolve(process.cwd(), 'src/web/assets/editorconfigsettings/src/ts/VizyEditorConfigSettingsElement.ts'),
            'utf8',
        );

        // A drag moves the buttons in the strip without re-rendering — the lift closes the row
        // up, the slot opens a button's worth of gap — and while a menu was drawn under one of
        // those buttons, every one of those moments had to tell the host so the margin could be
        // read again. Measured a whole button adrift when it did not, which read as the wrong
        // menu hanging off the button above. There is no menu now, so there is nothing to tell.
        expect(drag).not.toMatch(/onShift/);
        expect(host).not.toMatch(/positionOpenMenu|reanchor/);

        // Two zones again, and this is why the member row is drawn below the preview rather
        // than over it: they cannot overlap, so nothing has to decide which wins a hit test.
        expect(drag).toMatch(/if \(active\) zones\.push\(\{ name: 'active', element: active \}\);/);
        expect(drag).toMatch(/if \(members\) zones\.push\(\{ name: 'members', element: members \}\);/);
    });

    it('shows the reserved slot only where the item would actually land', () => {
        // Two complaints with one cause: an item picked out of the available list should
        // leave it and close the gap rather than sit there as a slot, and an item dragged
        // off the toolbar to bin it should stop advertising a landing place. A slot means
        // "it lands here", so there should be none when the pointer is not over the
        // toolbar.
        const source = readFileSync(
            resolve(process.cwd(), 'src/web/assets/editorconfigsettings/src/ts/ToolbarDragList.ts'),
            'utf8',
        );

        // Being over the toolbar is the whole condition, because the slot is put there by
        // us rather than by the drag library. It used to take a second check that the
        // button had actually been relocated into the strip — dnd-kit moved it a beat
        // after the pointer crossed in, so an outline flashed into the available row for
        // that frame. Owning the slot closes that gap: it exists where the item lands and
        // nowhere else.
        // Being over a list that will take the item is the only way a slot is offered, and
        // leaving them all clears it.
        expect(source).toMatch(/const target = this\.#zoneUnderPointer\(\);\s*\n\s*if \(!target\) \{\s*\n\s*this\.#clearSlot\(\);/);
        // Driven off our own pointer tracking, like the drop decision, because the
        // library's idea of what is under the cursor lags it and is often empty.
        expect(source).toMatch(/this\.#updateSlot\(\);/);
        expect(source).not.toMatch(/addEventListener\('dragover'/);
        // The button it was dragged from is collapsed by pulling the neighbours over it,
        // computed from its own size so narrower separators close up by the right amount — and
        // taken on whichever axis the list runs, so a menu row closes the gap below it rather
        // than shrinking sideways into nothing.
        expect(source).toMatch(/const extent = axis === 'inline' \? rect\.width : rect\.height;/);
        expect(source).toMatch(/marginInlineEnd' : 'marginBlockEnd'\] = `-\$\{extent \+ gap\}px`/);

        const css = readFileSync(
            resolve(process.cwd(), 'src/web/assets/editorconfigsettings/src/ts/editor-config-settings.css'),
            'utf8',
        );

        // The drop zone is the white strip alone. It was briefly widened to include the body
        // stub drawn beneath it, which offered a landing place over what reads as the editor's
        // content.
        expect(source).toMatch(/this\.#options\.activeList\(\)/);

        // The release honours the slot instead of re-deriving the answer from the
        // pointer, and nothing tracks `pointerup`, so there is a single reading of where
        // the item lands and no race over who handled the release first.
        expect(source).toMatch(/if \(!landed\)/);
        expect(source).toMatch(/const landed = this\.#landed\(\);/);
        expect(source).toMatch(/return !!this\.#slot\?\.isConnected;/);
        expect(source).not.toMatch(/addEventListener\('pointerup'/);

        const hidden = css.match(/\.vizy-control\.is-lifted\s*\{[^}]*\}/)?.[0] ?? '';
        expect(hidden).toMatch(/visibility:\s*hidden/);
        // Neither of the obvious ways to take it out of flow: `display: none` makes it
        // unmeasurable, and an absolutely positioned child of a flex container resolves
        // its static position to the container's start — which anchored the carried copy
        // to the front of the list, 211px adrift.
        expect(hidden).not.toMatch(/display:\s*none/);
        expect(hidden).not.toMatch(/position:\s*absolute/);
    });

    it('places the slot by the cursor alone, with no droppables to collide with', () => {
        // This is the fix for placement that was "buggy and sporadic". dnd-kit's
        // sortable decides where to open the gap from which droppable the drag collides
        // with, and here the gap is a real 36px button: opening one shifts every button
        // after it, which changes what the pointer is over, which moves the gap again.
        // Measured with buttons resting at 36–72, 76–104, 108–144, 148–184 and 188–224,
        // the index changed at 36, 76, 116, 148, 188 and 228 — and at the left-hand end
        // it flipped between two positions across five pixels of travel.
        //
        // Counting the other buttons the pointer has passed the midpoint of is a fixed
        // point instead: inserting at `k` moves only the buttons from `k` onwards, and
        // moving them away from the pointer cannot bring an earlier midpoint back across
        // it. Asserted on the source because happy-dom has no layout to drag through.
        const source = readFileSync(
            resolve(process.cwd(), 'src/web/assets/editorconfigsettings/src/ts/ToolbarDragList.ts'),
            'utf8',
        );

        // Draggables only. A droppable would be something else's opinion about where the
        // item goes, and two answers is how this went wrong in the first place.
        expect(source).toMatch(/new Draggable<ItemData>\(/);
        expect(source).not.toMatch(/new Sortable\(|new Droppable\(/);
        expect(source).not.toMatch(/collisionDetector|@dnd-kit\/collision|@dnd-kit\/dom\/sortable/);

        // The midpoint is the boundary, measured against the *other* buttons.
        expect(source).toMatch(/\.filter\(\(item\) => item !== this\.#sourceElement\)/);
        // Whole lines before positions within one, because the toolbar wraps and comparing the
        // one axis alone would place an item by its position on the wrong line.
        expect(source).toMatch(/peer\.band < band \? true : peer\.band > band \? false : along > peer\.middle/);

        // The row is resolved by nearest, not by which button's box contains `y`. Most of
        // the strip is not inside a button — it is padded, and the carried copy sits
        // down-right of the cursor, so the cursor rides near the top edge for much of a
        // drag. Testing each button's own box made the pointer count as being on a
        // different line from every one of them in those bands, so the slot snapped to
        // the front of the strip above them and to the end below them.
        expect(source).toMatch(/#pointerBand\(zone: ZoneGeometry, cross: number\): number/);
        expect(source).toMatch(/cross < band\.start \? band\.start - cross : Math\.max\(0, cross - band\.end\)/);
        // Which also means a single-row toolbar has exactly one answer whatever `y` does.
        expect(source).toMatch(/Math\.abs\(current\.start - start\) > 1/);

        // Against the row as it rests, taken once with the slot collapsed. Measuring the
        // live row instead is self-consistent but sticky: the slot pushes every midpoint
        // from its own position onwards 40px away from the pointer, so two adjacent
        // positions are both valid across a whole button's width and which one you get
        // depends on the direction you came from.
        expect(source).toMatch(/#measureZones\(\): void/);
        // Before the source is lifted, which is what stops the fault below.
        expect(source).toMatch(/this\.#measureZones\(\);\s*\n\s*this\.#liftSource\(\);/);
        // Relative to the list, so scrolling mid-drag cannot skew them.
        expect(source).toMatch(/\? rect\.left \+ rect\.width \/ 2 - origin\.left/);
        expect(source).toMatch(/const offset = \{ x: this\.#pointer\.x - origin\.left, y: this\.#pointer\.y - origin\.top \};/);
        // Stops at the first button not yet passed, so the answer is a single crossing
        // point rather than a count that could disagree with itself.
        expect(source).toMatch(/if \(!passed\) break;/);

        // And the release reads back the index the slot was offering rather than working
        // it out again, so the outline is a promise the drop keeps.
        expect(source).toMatch(/this\.#landingIndex = index;/);
        expect(source).toMatch(/const index = this\.#landingIndex;/);
    });

    it('measures whichever way a list runs, a menu running down where a toolbar runs across', () => {
        const source = readFileSync(
            resolve(process.cwd(), 'src/web/assets/editorconfigsettings/src/ts/ToolbarDragList.ts'),
            'utf8',
        );

        // The placement arithmetic is one rule over two axes: bands across the way a list runs,
        // midpoints along it. A toolbar wraps, so its bands are lines and the midpoint is
        // horizontal; the member menu is a column, so its bands degenerate to one per row and the
        // midpoint is vertical. Getting this wrong is not subtle — comparing `x` in a menu places
        // a row by how far right the pointer happens to sit, which is nothing at all.
        expect(source).toMatch(/type ZoneAxis = 'inline' \| 'block';/);
        expect(source).toMatch(/return name === 'members' \? 'block' : 'inline';/);
        expect(source).toMatch(/const along = zone\.axis === 'inline' \? offset\.x : offset\.y;/);
        expect(source).toMatch(/zone\.axis === 'inline' \? offset\.y : offset\.x/);

        // Read from what the list *is* rather than from its computed `flex-direction`, so a
        // stylesheet change cannot silently move which axis a drop is judged on.
        expect(source).not.toMatch(/flexDirection/);

        // And the gap the lifted row closes is read on the matching axis too.
        expect(source).toMatch(/axis === 'inline' \? styles\?\.columnGap : styles\?\.rowGap/);
    });

    it('drives one shared tooltip for every control, rather than one each', () => {
        const element = mount();

        // Icon-only buttons need a name on hover, but 40 tooltip components would be
        // 40 sets of listeners rebuilt on every render to say what one repositioned
        // popup can.
        const tooltips = element.querySelectorAll('pk-tooltip');
        expect(tooltips).toHaveLength(1);
        // Driven by us on hover, so it can be suppressed mid-drag.
        expect(tooltips[0].getAttribute('trigger')).toBe('manual');
        // Outside the rendered host, or a re-render would destroy it mid-hover.
        expect(tooltips[0].closest('[data-vizy-config-host]')).toBeNull();
    });

    it('names a control only once the pointer settles on it', async () => {
        vi.useFakeTimers();

        try {
            const element = mount();
            const tooltip = element.querySelector('pk-tooltip')!;
            const shows: string[] = [];
            (tooltip as HTMLElement & { show: () => void }).show = () => shows.push('1');

            const hover = (target: Element, type: string) =>
                target.dispatchEvent(new PointerEvent(type, { bubbles: true, composed: true }));

            // A toolbar is a row of adjacent buttons, so crossing it used to fire a show for
            // each one and the popup chased the cursor along the strip. Each show also put
            // `pk-popup`'s hover bridge under the pointer, and the resulting show/hide cycle
            // swapped the cursor between the button's `grab` and the bridge's arrow — which
            // is what read as a flicker while moving quickly over the toolbar.
            const strip = items(element, 'toolbar-active');
            for (const button of strip) {
                hover(button, 'pointerover');
                vi.advanceTimersByTime(40);
                hover(button, 'pointerout');
            }

            vi.advanceTimersByTime(500);
            expect(shows).toHaveLength(0);

            // Resting on one still names it.
            hover(strip[0], 'pointerover');
            expect(shows).toHaveLength(0);
            vi.advanceTimersByTime(500);
            expect(shows).toHaveLength(1);
        } finally {
            vi.useRealTimers();
        }
    });

    it('ignores pointer events the tooltip itself emits', () => {
        vi.useFakeTimers();

        const element = mount();
        const tooltip = element.querySelector('pk-tooltip')!;
        const button = items(element, 'toolbar-active')[0];

        // `pk-popup` paints a pointer-accepting "hover bridge" from anchor to popup, so a
        // cursor moving onto a tooltip does not dismiss it. Measured at 400x521, it covered
        // the whole builder and won the hit test wherever no button was drawn over it.
        //
        // That made the hint fight for the cursor: hovering a button showed it, which put
        // the bridge under the pointer, whose `pointerover` read as "not a control" and hid
        // it again — removing the bridge, re-exposing the button, and repeating. The cursor
        // flickered between `grab` and the arrow for as long as the pointer stayed put.
        const hover = (target: Element, type: string) =>
            target.dispatchEvent(new PointerEvent(type, { bubbles: true, composed: true }));

        // `for` and `content` are properties on the component, not attributes.
        const state = tooltip as HTMLElement & { for?: string; content?: string };
        const shows: string[] = [];
        const hides: number[] = [];
        (tooltip as HTMLElement & { show: () => void }).show = () => shows.push(state.for ?? '');
        (tooltip as HTMLElement & { hide: () => void }).hide = () => hides.push(1);

        hover(button, 'pointerover');
        vi.advanceTimersByTime(500);
        expect(shows).toHaveLength(1);
        expect(hides).toHaveLength(0);

        // Anything from the tooltip is not news about the panel, so the hint stays put:
        // neither shown again nor — the part that mattered — hidden.
        for (let round = 0; round < 5; round += 1) {
            hover(tooltip, 'pointerover');
            hover(tooltip, 'pointerout');
        }
        vi.advanceTimersByTime(500);
        expect(shows).toHaveLength(1);
        expect(hides).toHaveLength(0);

        // A genuine departure from the panel still dismisses it.
        hover(button, 'pointerout');
        expect(hides).toHaveLength(1);

        vi.useRealTimers();
    });

    it('adds and removes from the keyboard, where there is no drag to make', () => {
        const element = mount();

        // Read off `keydown` rather than a click with no click count. That is what a keyboard
        // activation looks like, but it is also what `element.click()` looks like, which made
        // every programmatic click a removal.
        press(items(element, 'toolbar-available').find((item) => item.dataset.toolbarItem === 'undo'));
        expect(toolbarState(element)).toEqual(['bold', 'separator', 'italic', 'undo']);

        // Enter selects, as a click does. Delete is the one-keystroke removal, since drag-out is
        // the only other and drag is a pointer.
        const bold = items(element, 'toolbar-active').find((item) => item.dataset.toolbarItem === 'bold')!;
        press(bold);
        expect(toolbarState(element)).toEqual(['bold', 'separator', 'italic', 'undo']);

        bold.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete', bubbles: true }));
        expect(toolbarState(element)).toEqual(['separator', 'italic', 'undo']);
    });

    it('offers the separator after the buttons, and marks it as never running out', () => {
        const element = mount();

        // The palette reads as a list of things not yet used, and a separator is not one
        // of those — it never leaves, so it sits last, after the items that do.
        const available = ids(element, 'toolbar-available');
        expect(available.indexOf('separator')).toBe(available.length - 1);
        expect(available.filter((id) => id === 'separator')).toHaveLength(1);

        // The flag is what tells the drag list to leave this button where it is rather
        // than closing the gap behind it.
        const separator = items(element, 'toolbar-available')
            .find((item) => item.dataset.toolbarItem === 'separator');
        expect(separator?.hasAttribute('data-toolbar-repeatable')).toBe(true);

        const bold = items(element, 'toolbar-active')
            .find((item) => item.dataset.toolbarItem === 'bold');
        expect(bold?.hasAttribute('data-toolbar-repeatable')).toBe(false);
    });

    it('leaves an inexhaustible button in the palette, and copies it for the slot', () => {
        // Dragging a separator must not take it out of the palette: a toolbar may hold any
        // number, so there is always another. That is only possible because the slot is a
        // *copy* of the dragged button rather than the button itself — otherwise the one
        // element would have to be in the palette and in the strip at the same time.
        const source = readFileSync(
            resolve(process.cwd(), 'src/web/assets/editorconfigsettings/src/ts/ToolbarDragList.ts'),
            'utf8',
        );

        expect(source).toMatch(/repeatable: element\.hasAttribute\('data-toolbar-repeatable'\)/);
        // Either palette, since there are two of them now, which is what `isPaletteList` is for.
        expect(source).toMatch(/return !!this\.#source\?\.repeatable && isPaletteList\(this\.#source\.list\);/);
        // Only a palette's copy is inexhaustible. A separator already *in* the toolbar
        // is an ordinary item that can be reordered or dragged out like any other.
        expect(source).toMatch(/if \(!element \|\| this\.#isInexhaustible\(\)\) return;/);

        // The slot is a clone, stripped of everything that would make it a second copy of
        // the button rather than a picture of one — including `data-toolbar-item`, which
        // keeps it out of `#items` and so out of its own placement arithmetic.
        expect(source).toMatch(/slot\.removeAttribute\('data-toolbar-item'\)/);
        expect(source).toMatch(/slot\.setAttribute\('aria-hidden', 'true'\)/);
        expect(source).toMatch(/slot\.classList\.add\('is-slot'\)/);
    });

    it('clones the slot from a resting button, not the lifted one', () => {
        // The source is lifted before the slot is first reserved, and lifting is
        // `visibility: hidden` plus a negative inline margin that collapses the button's
        // width. Cloning it in that state produced an invisible slot occupying no space:
        // the dashed outline was in the DOM, at the right index, reserving nothing and
        // showing nothing — the whole gesture silently gone.
        const source = readFileSync(
            resolve(process.cwd(), 'src/web/assets/editorconfigsettings/src/ts/ToolbarDragList.ts'),
            'utf8',
        );

        expect(source).toMatch(/slot\.classList\.remove\('is-lifted'\)/);
        expect(source).toMatch(/slot\.style\.marginInlineEnd = ''/);

        // Undone on the clone rather than by relying on where the lift sits in `dragstart`,
        // since the lift now runs after the measuring and could reasonably move again.
        const dragstart = source.match(/'dragstart',[\s\S]*?\n {12}\}\),/)?.[0] ?? '';
        expect(dragstart.indexOf('#liftSource()')).toBeGreaterThan(-1);
        expect(dragstart.indexOf('#reserveSlot()')).toBe(-1);
    });

    it('waits for the pointer to travel before treating a press as a drag', () => {
        const source = readFileSync(
            resolve(process.cwd(), 'src/web/assets/editorconfigsettings/src/ts/ToolbarDragList.ts'),
            'utf8',
        );

        // Without a threshold a press *was* a drag: the button was torn out of its list, a slot
        // opened and the carried copy appeared, all before the pointer had moved. Clicking a
        // dropdown to edit it therefore looked like the start of a move, and clicking and
        // holding a toolbar button showed the item being taken out from under the cursor.
        expect(source).toMatch(/static #dragThreshold = \d+;/);
        expect(source).toMatch(/PointerSensor\.configure\(\{/);
        expect(source).toMatch(
            /new PointerActivationConstraints\.Distance\(\{\s*\n\s*value: ToolbarDragList\.#dragThreshold,/,
        );
    });

    describe('capabilities', () => {
        const CONTENT = {
            capabilityCatalog: {
                nodes: [
                    { label: 'Quote', value: 'blockquote' },
                    { label: 'Image', value: 'image' },
                ],
                marks: [
                    { label: 'Bold', value: 'bold' },
                    { label: 'Italic', value: 'italic' },
                ],
                headingAvailable: true,
            },
        };

        const select = (element: HTMLElement, group: string) =>
            element.querySelector(`[data-capability-group="${group}"]`) as HTMLElement & { options: { value: string }[] };

        /** Reports a selection the way `pk-checkbox-select` does. */
        const choose = (element: HTMLElement, group: string, value: string[] | '*'): void => {
            select(element, group).dispatchEvent(new CustomEvent('pk-change', { detail: { value } }));
        };

        /** A config that allows headings, which the base fixture does not. */
        const withHeadings = {
            ...CONTENT,
            config: {
                capabilities: { nodes: ['heading'], marks: ['bold', 'italic'] },
                headings: { levels: [2, 3] },
                toolbar: ['bold', 'separator', 'italic'],
                bubble: { enabled: true, items: ['bold'] },
            },
        };

        it('folds the schema away, states its count, and stays open while it is edited', () => {
            const element = mount(CONTENT);
            const details = element.querySelector<HTMLDetailsElement>('[data-schema-details]');

            // Closed on arrival, and after the toolbar: it is the advanced half of the screen
            // and most configs want it left alone, while nearly every visit is about buttons.
            expect(details).not.toBeNull();
            expect(details?.open).toBe(false);
            const sections = [...element.querySelectorAll('.vizy-editor-config-section')];
            expect(sections.indexOf(details as HTMLElement)).toBe(sections.length - 1);

            // The count is why this is a fold rather than another tab: a narrowed schema says
            // so without being opened, so "why is that button not offered" is answerable from
            // the closed state. Two nodes and two marks on offer here, `bold` and `italic` on.
            expect(details?.querySelector('summary')?.textContent).toContain('2 of 4');

            // Ticking a box re-renders the whole panel, which would otherwise close the
            // section under the author's hand on every tick.
            details?.dispatchEvent(new Event('toggle'));
            Object.defineProperty(details as HTMLDetailsElement, 'open', { value: true, configurable: true });
            details?.dispatchEvent(new Event('toggle'));
            choose(element, 'marks', ['bold']);

            const reopened = element.querySelector<HTMLDetailsElement>('[data-schema-details]');
            expect(reopened?.hasAttribute('open')).toBe(true);
            // And the count follows the edit rather than the render it was drawn in.
            expect(reopened?.querySelector('summary')?.textContent).toContain('1 of 4');
        });

        it('treats levels on a config that disallows headings as leftovers', () => {
            // The server writes `levels` whether or not `heading` is allowed,
            // so a config with headings off still arrives carrying `[2, 3]`. Reading the
            // levels as the setting would show them ticked, claiming headings are allowed
            // on a config that does not allow them.
            const element = mount(CONTENT);

            expect(hidden(element, 'capabilityNodes[]')).not.toContain('heading');
            expect(hidden(element, 'headingLevels[]')).toEqual([]);
        });

        it('asks about heading levels inside the schema, with everything else it governs', () => {
            const element = mount(withHeadings);
            const details = element.querySelector<HTMLDetailsElement>('[data-schema-details]');

            // The levels had a top-level section of their own, which read as a toolbar setting
            // sitting near the schema rather than as part of it. They are not: six levels are six
            // content types, governing pasted and imported content exactly as Quote does — an H1
            // pasted into a config that disallows level 1 becomes a paragraph.
            expect(details?.querySelector('[data-capability-group="headings"]')).not.toBeNull();
            expect([...element.querySelectorAll('.vizy-editor-config-section h3')].map((node) => node.textContent?.trim()))
                .not.toContain('Headings');
        });

        it('drives headings entirely from the levels, with no separate switch', () => {
            const element = mount(withHeadings);

            // One control for one decision, and now the only one. A second "Allow headings"
            // checkbox could disagree with it — on, with no levels ticked — and a "Default
            // level" select was a third, needed only by a bare Heading button that stood for
            // whichever level it named. Both are gone: a heading button names its own level.
            expect(element.querySelector('[data-headings-enabled]')).toBeNull();
            expect(element.querySelector('[data-default-heading]')).toBeNull();
            expect(hidden(element, 'defaultHeadingLevel')).toEqual([]);
            expect(hidden(element, 'capabilityNodes[]')).toContain('heading');

            // Choosing no levels is how headings are disallowed.
            choose(element, 'headings', []);
            expect(hidden(element, 'headingLevels[]')).toEqual([]);
            expect(hidden(element, 'capabilityNodes[]')).not.toContain('heading');

            // And choosing some brings headings back.
            choose(element, 'headings', ['3', '4']);
            expect(hidden(element, 'headingLevels[]')).toEqual(['3', '4']);
            expect(hidden(element, 'capabilityNodes[]')).toContain('heading');
        });

        it('leaves capabilities a select does not offer alone', () => {
            const element = mount({
                ...CONTENT,
                config: {
                    // `doc` and `text` are structural and never author-selectable, and
                    // `heading` is chosen in its own section — none appear as options.
                    capabilities: { nodes: ['doc', 'text', 'heading', 'image'], marks: [] },
                    headings: { levels: [2] },
                    toolbar: [],
                    bubble: { enabled: true, items: [] },
                },
            });

            choose(element, 'nodes', ['blockquote']);

            const nodes = hidden(element, 'capabilityNodes[]');
            // Taking the select's answer literally would have thrown these away, which
            // for `heading` means switching headings off whenever a block was ticked.
            expect(nodes).toContain('doc');
            expect(nodes).toContain('text');
            expect(nodes).toContain('heading');
            expect(nodes).toContain('blockquote');
            // `image` was on offer and was not chosen, so it does go.
            expect(nodes).not.toContain('image');
        });

        it('resolves the All option to every capability on offer', () => {
            const element = mount(CONTENT);

            choose(element, 'marks', '*');
            expect(hidden(element, 'capabilityMarks[]')).toEqual(['bold', 'italic']);

            // Fed back as `*` so the All box stays ticked through the re-render. The
            // config stores names rather than a wildcard, so this is derived from the
            // selection covering everything rather than remembered.
            expect(select(element, 'marks').getAttribute('value')).toBe('*');

            choose(element, 'marks', ['bold']);
            expect(select(element, 'marks').getAttribute('value')).toBe('["bold"]');
        });

        it('keeps a button whose capability is switched off, and says it will not render', () => {
            const element = mount(CONTENT);
            expect(toolbarState(element)).toContain('italic');

            choose(element, 'marks', ['bold']);

            // Deleting it was the old behaviour, and it was the wrong one twice over: it
            // threw away arrangement work behind the author's back, and it made unticking a
            // capability an irreversible edit to a second setting. A button with nothing to
            // apply simply does not render, so keeping it costs nothing.
            expect(toolbarState(element)).toContain('italic');
            expect(toolbarState(element)).toContain('bold');

            // Said where the author is looking, since the strip is a preview and this is the
            // one thing about it that will not be true of the real toolbar.
            const italic = items(element, 'toolbar-active').find((item) => item.dataset.toolbarItem === 'italic');
            expect(italic?.className).toContain('is-unavailable');
            expect(italic?.getAttribute('aria-label')).toContain('not allowed');

            // And it is offered nowhere else: the palette lists what is not yet in use.
            expect(ids(element, 'toolbar-available')).not.toContain('italic');
        });

        it('gates Media embed and Iframe on their capabilities', () => {
            const element = mount({
                config: {
                    capabilities: { nodes: [], marks: [] },
                    headings: { levels: [2] },
                    toolbar: ['mediaEmbed', 'iframe'],
                    bubble: { enabled: false, items: [] },
                },
            });

            // With capabilities off they stay in the strip as unavailable (layout preserved).
            const media = items(element, 'toolbar-active')
                .find((item) => item.dataset.toolbarItem === 'mediaEmbed');
            const iframe = items(element, 'toolbar-active')
                .find((item) => item.dataset.toolbarItem === 'iframe');
            expect(media?.className).toContain('is-unavailable');
            expect(iframe?.className).toContain('is-unavailable');
            expect(media?.className).not.toContain('is-pending');
            expect(iframe?.className).not.toContain('is-pending');
            expect(toolbarState(element)).toEqual(expect.arrayContaining(['mediaEmbed', 'iframe']));
        });

        it('gates a heading level on the level, not only on the capability', () => {
            // The gate is the same one; where it shows has moved. Formatting owns the six levels,
            // so there is no palette entry to withhold and the menu is where a disallowed level
            // is absent — see `#memberRenders`.
            const menu = (levels: number[]): string[] => {
                const element = mount({
                    config: {
                        capabilities: { nodes: ['heading'], marks: [] },
                        headings: { levels },
                        toolbar: ['dropdown:formatting'],
                        bubble: { enabled: false, items: [] },
                    },
                });
                items(element, 'toolbar-active')[0].click();
                const rows = ids(element, 'toolbar-members');
                element.remove();
                return rows;
            };

            // `capabilityName` is `heading` for all six, so the capability check alone would draw
            // a level this config does not allow.
            expect(menu([2, 3])).toContain('heading2');
            expect(menu([2, 3])).not.toContain('heading5');

            // And none of them once the levels are empty, the levels being the setting: none
            // allowed is headings disallowed, whatever the stored capability says. See
            // `#reconcileHeadings`. Quote and Code block are disallowed here too, so what is left
            // is the one row prose always permits — which is also why a Formatting menu can never
            // be empty.
            expect(menu([])).toEqual(['paragraph']);
        });

        it('never marks an action unavailable, since nothing can switch one off', () => {
            // Undo and alignment act on the selection and stand for no capability at all,
            // so a config with nothing whatsoever allowed still offers them.
            const element = mount({
                config: {
                    capabilities: { nodes: [], marks: [] },
                    headings: { levels: [2] },
                    toolbar: ['undo', 'alignCenter'],
                    bubble: { enabled: false, items: [] },
                },
            });

            for (const item of items(element, 'toolbar-active')) {
                expect(item.className).not.toContain('is-unavailable');
            }
        });

        it('gates a table operation on the Table capability, unlike every other action', () => {
            // Undo and the alignments stand for no capability, but the table operations only
            // exist while the Table extension is loaded — so without it the row is dead rather
            // than merely useless, and the menu leaves it out.
            //
            // Its own dropdown fixture, because this is the only test that needs a second one and
            // the rest assert what the dropdown palette holds.
            const rows = (nodes: string[]): string[] => {
                const element = mount({
                    config: {
                        capabilities: { nodes, marks: [] },
                        headings: { levels: [2] },
                        toolbar: ['dropdown:table'],
                        bubble: { enabled: false, items: [] },
                    },
                    dropdownCatalog: [{
                        id: 'dropdown:table',
                        label: 'Table',
                        kind: 'dropdown',
                        group: 'Dropdowns',
                        icon: null,
                        members: ['tableAddRowAfter', 'alignCenter'],
                    }],
                });
                items(element, 'toolbar-active')[0].click();
                const members = ids(element, 'toolbar-members');
                element.remove();
                return members;
            };

            expect(rows(['table'])).toContain('tableAddRowAfter');
            expect(rows([])).not.toContain('tableAddRowAfter');
            // An alignment is there either way, which is the contrast worth holding onto.
            expect(rows([])).toContain('alignCenter');
        });
    });

    it('drops the Bubble Menu builder entirely when the menu is switched off', () => {
        const element = mount();
        expect(element.querySelector('[data-builder="bubble"]')).not.toBeNull();

        // A lightswitch, not a checkbox: this switches a whole feature on and off rather
        // than ticking one of a set.
        const toggle = element.querySelector('[data-bubble-enabled]') as HTMLElement & { checked: boolean };
        expect(toggle.tagName).toBe('PK-LIGHTSWITCH');

        // Named and explained by the surrounding field shell, which associates its header
        // with whatever control it wraps. The switch itself carries no label, or the
        // control would be named twice over.
        const field = toggle.closest('pk-field');
        expect(field?.getAttribute('label')).toBe('Show a Bubble Menu on selection');
        expect(field?.getAttribute('instructions')).not.toBeNull();
        expect(toggle.hasAttribute('label')).toBe(false);

        toggle.checked = false;
        toggle.dispatchEvent(new Event('pk-change'));

        // Left in the DOM but hidden, its sortable would stay registered against
        // zero-size elements.
        expect(element.querySelector('[data-builder="bubble"]')).toBeNull();
    });

    describe('the advanced tab', () => {
        const openAdvanced = (element: HTMLElement): void => {
            element.querySelector<HTMLButtonElement>('[data-mode="advanced"]')?.click();
        };

        const editor = (element: HTMLElement) =>
            element.querySelector('[data-advanced-json]') as HTMLElement & { value: string };

        it('edits the JSON in a code editor, given the content as a property', () => {
            const element = mount();
            openAdvanced(element);

            const code = editor(element);
            expect(code.tagName).toBe('PK-CODE-EDITOR');
            expect(code.getAttribute('language')).toBe('json');

            // Assigned rather than rendered: the `value` attribute is the component's
            // reset target, so writing the config there would show nothing.
            expect(code.getAttribute('value')).toBeNull();
            expect(JSON.parse(code.value)).toMatchObject({ toolbar: ['bold', 'separator', 'italic'] });
        });

        it('applies what the editor reports, not what the element currently holds', () => {
            const element = mount();
            openAdvanced(element);

            const code = editor(element);
            code.dispatchEvent(new CustomEvent('pk-change', {
                detail: {
                    value: JSON.stringify({
                        capabilities: { nodes: [], marks: ['italic'] },
                        headings: { levels: [] },
                        toolbar: ['italic'],
                        bubble: { enabled: true, items: ['italic'] },
                    }),
                },
            }));

            element.querySelector<HTMLButtonElement>('[data-mode="visual"]')?.click();

            expect(toolbarState(element)).toEqual(['italic']);
        });

        it('round-trips capabilities under the one key it recognises', () => {
            const element = mount();
            openAdvanced(element);

            // The key names what the editor is able to represent, and is the only spelling
            // read back, so a config cannot half-apply under an older name.
            expect(JSON.parse(editor(element).value)).toHaveProperty('capabilities');

            editor(element).dispatchEvent(new CustomEvent('pk-change', {
                detail: {
                    value: JSON.stringify({
                        capabilities: { nodes: [], marks: ['italic'] },
                        headings: { levels: [] },
                        toolbar: ['italic'],
                        bubble: { enabled: true, items: ['italic'] },
                    }),
                },
            }));
            element.querySelector<HTMLButtonElement>('[data-mode="visual"]')?.click();

            expect(hidden(element, 'capabilityMarks[]')).toEqual(['italic']);
            expect(toolbarState(element)).toEqual(['italic']);
        });

        it('says so when the JSON will not parse, rather than ignoring the click', () => {
            const element = mount();
            openAdvanced(element);

            editor(element).dispatchEvent(new CustomEvent('pk-change', { detail: { value: '{ not json' } }));
            element.querySelector<HTMLButtonElement>('[data-mode="visual"]')?.click();

            // Staying put is right, but it used to happen without a render, so the message
            // was stored and never shown and the button appeared to do nothing at all.
            expect(element.querySelector('[data-mode="advanced"]')?.className).toContain('active');
            expect(element.querySelector('.vizy-editor-config-error')?.textContent).toContain('Invalid JSON');
        });

        it('posts what the editor holds without waiting for a submit event', () => {
            const element = mount();
            openAdvanced(element);

            editor(element).dispatchEvent(new CustomEvent('pk-change', {
                detail: {
                    value: JSON.stringify({
                        capabilities: { nodes: [], marks: ['italic'] },
                        headings: { levels: [] },
                        toolbar: ['italic'],
                        bubble: { enabled: true, items: ['italic'] },
                    }),
                },
            }));

            // No `submit` dispatched, and no switch back to Visual. Craft's Cmd+S and Save
            // menu submit through jQuery, which ends in a native `form.submit()` and fires
            // no event, so anything left until submit would be left undone.
            expect(toolbarState(element)).toEqual(['italic']);
            expect(hidden(element, 'capabilityMarks[]')).toEqual(['italic']);
        });

        it('leaves the posted payload alone while the JSON is unparseable', () => {
            const element = mount();
            openAdvanced(element);

            editor(element).dispatchEvent(new CustomEvent('pk-change', { detail: { value: '{ not json' } }));

            // Half-typed JSON is not a config. The last parseable state stands, and a save
            // attempted from a real click is refused at submit with the error shown.
            expect(toolbarState(element)).toEqual(['bold', 'separator', 'italic']);
        });
    });

    it('keeps the posted inputs current as the toolbar is edited', () => {
        const element = mount();
        items(element, 'toolbar-active')
            .find((item) => item.dataset.toolbarItem === 'italic')!
            .dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete', bubbles: true }));

        // The sync used to happen on the form's `submit` event, which the save shortcut and
        // the Save menu never fire.
        expect(toolbarState(element)).toEqual(['bold', 'separator']);
    });
});
