import './editor-config-settings.css';

// Plugin Kit components are styled entirely from these custom properties, and
// resolve to unusable fallbacks without them — the tooltip came out as dark text on
// its own dark background, with square corners.
import '@verbb/plugin-kit-web/tokens.css';
import '@verbb/plugin-kit-web/components/tooltip';
import '@verbb/plugin-kit-web/components/lightswitch';
import '@verbb/plugin-kit-web/components/checkbox-select';
import '@verbb/plugin-kit-web/components/field';
// `pk-code-editor` is deliberately absent here and imported on demand instead. See
// `#loadCodeEditor`.

import { isPaletteList, ToolbarDragList, type ToolbarDrop } from './ToolbarDragList';
import {
    claimedKeys,
    dropdownName,
    indexOfEntry,
    isDropdownKey,
    rosterOrder,
    type ToolbarEntry,
} from './toolbar-entries';
import { MENU_CHEVRON_SVG } from '../../../shared/menu-chevron';

type CatalogItem = {
    id: string;
    label: string;
    /**
     * `action` is a button that acts on the selection with no capability behind it —
     * Undo, alignment, clearing formatting — so nothing an author switches off can make
     * it unavailable. See `EditorConfigPresentation::ACTIONS`.
     */
    kind: 'presentation' | 'mark' | 'node' | 'group' | 'action' | 'dropdown' | 'extension';
    group: string;
    /**
     * Inline SVG resolved server-side from the bundled icon catalog. Plugin-owned
     * markup, not author input, so it is interpolated unescaped — escaping would
     * print the tags. Same trust boundary as the icon picker's initial SVG.
     */
    icon?: string | null;
    /**
     * A short text glyph for a button the icon catalog cannot serve, such as "H3". Author
     * input never reaches it — it comes from the catalog — but it is escaped anyway, since
     * it is text rather than markup.
     */
    abbr?: string | null;
    capabilityKind?: string;
    capabilityName?: string;
    /**
     * Which level a heading button applies. `capabilityName` covers the Heading capability but
     * says nothing about which of its six levels this config allows, and the palette must not
     * offer H5 to a config permitting H2–H4.
     */
    headingLevel?: number;
    /**
     * A registered dropdown's roster, as button IDs. Only on entries from the dropdown palette,
     * and it is the full set the dropdown *may* hold — what the preview menu draws, with this
     * config's trimmings struck through.
     */
    members?: string[];
    /**
     * The token the menu styles a row by, so Heading 2 previews at Heading 2's size. Only on the
     * block types that have a look to preview; a mark or an action has nothing to show.
     */
    preview?: string;
    /**
     * A catalog button Vizy cannot run yet. Placeable and stored like any other, but it
     * resolves to no control, so the editor draws nothing for it. See
     * `EditorConfigPresentation::PENDING` (currently empty — whole-document HTML source
     * was retired instead of shipping a lossy source view).
     */
    pending?: boolean;
    /**
     * A control a dropdown owns, so a toolbar may not name it directly and the palette does not
     * offer it. It is still a full catalog entry, because the menu draws its rows from here. See
     * `EditorConfigPresentation::MEMBER_ONLY_IDS`.
     */
    memberOnly?: boolean;
    /**
     * Where this falls in the palette's one row. The buttons and the dropdowns arrive as two
     * catalogs and are offered as a single sequence, so the order has to be something both carry
     * rather than the position either happens to hold in its own list. See
     * `EditorConfigPresentation::PALETTE_ORDER`.
     *
     * Optional only because a catalog can be handed in by a test that does not care about order.
     */
    paletteRank?: number;
};

type EditorConfigState = {
    /** What the editor is able to represent: the nodes and marks it understands. */
    capabilities: {
        nodes: string[];
        marks: string[];
        extensions: string[];
    };
    headings: {
        levels: number[];
    };
    toolbar: ToolbarEntry[];
    /**
     * What each placed dropdown holds, keyed by registration name, as a subset of its registered
     * roster in the author's order.
     *
     * Written only when an author actually trims or reorders one. A name missing from here is a
     * dropdown nobody has touched, which the server reads as "whatever it ships with" — so an
     * untouched dropdown also picks up members a later Vizy release adds to it, which a stored
     * one by design does not. That is the whole reason nothing is written on placement.
     */
    dropdowns: Record<string, string[]>;
    bubble: {
        enabled: boolean;
        items: string[];
    };
    /** Outset gutter `+` chip — independent of toolbar Add Block. Default on. */
    gutterInsert: boolean;
    /** Blank-line `/` opens Add Block palette. Default on. */
    slashInsert: boolean;
};

type CapabilityOption = { label: string; value: string };

/** The slice of `pk-lightswitch` this screen reads. */
type PkLightswitch = HTMLElement & { checked: boolean };

/**
 * The slice of `pk-checkbox-select` this screen reads. `options` is read back off the
 * element so the change handler knows which capabilities that select governs, rather
 * than the caller having to say twice.
 */
type PkCheckboxSelect = HTMLElement & { options: CapabilityOption[] };

/** The slice of `pk-code-editor` this screen drives. */
type PkCodeEditor = HTMLElement & { value: string };

/** The slice of `pk-tooltip` the builder drives, anchored by element id. */
type BuilderTooltip = HTMLElement & {
    for: string;
    content: string;
    show(): unknown;
    hide(): unknown;
};

type CapabilityCatalog = {
    nodes: CapabilityOption[];
    marks: CapabilityOption[];
    extensions: CapabilityOption[];
    headingAvailable: boolean;
};

type InitialData = {
    config: EditorConfigState;
    toolbarCatalog: CatalogItem[];
    dropdownCatalog: CatalogItem[];
    bubbleCatalog: CatalogItem[];
    capabilityCatalog: CapabilityCatalog;
};

/** Every level a heading can be, which is what the Headings select offers. */
const HEADING_LEVELS = [1, 2, 3, 4, 5, 6];

/** What a config starts with, and the fallback when a saved one names no levels. */
const DEFAULT_HEADING_LEVELS = [2, 3, 4];

function t(category: string, message: string, params: Record<string, string> = {}): string {
    const globals = window as typeof window & {
        Craft?: { t: (cat: string, msg: string, params?: Record<string, string>) => string };
    };
    // The fallback substitutes too, so a missing Craft global degrades to readable
    // English rather than leaving `{label}` in an accessible name.
    return globals.Craft?.t(category, message, params)
        ?? message.replace(/\{(\w+)\}/g, (match, key) => params[key] ?? match);
}

/**
 * Capability labels come from the PHP registry, which third-party plugins can
 * extend, and this component builds its UI from `innerHTML` strings.
 */
function escapeHtml(value: string): string {
    return value.replace(/[&<>"']/g, (char) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
    }[char] as string));
}

class VizyEditorConfigSettingsElement extends HTMLElement {
    #state: EditorConfigState = {
        capabilities: { nodes: [], marks: [], extensions: [] },
        headings: { levels: [...DEFAULT_HEADING_LEVELS] },
        toolbar: [],
        dropdowns: {},
        bubble: { enabled: true, items: [] },
        gutterInsert: true,
        slashInsert: true,
    };
    #toolbarCatalog: CatalogItem[] = [];
    /**
     * The registered dropdowns. Offered in the same palette row as the buttons, but kept as its
     * own catalog: `members` is a dropdown's alone, and the roster lookups read it by name.
     */
    #dropdownCatalog: CatalogItem[] = [];
    #bubbleCatalog: CatalogItem[] = [];
    #capabilityCatalog: CapabilityCatalog = { nodes: [], marks: [], extensions: [], headingAvailable: false };
    #mode: 'visual' | 'advanced' = 'visual';

    /**
     * Whether the Content schema section is unfolded.
     *
     * Kept here rather than left to the `<details>` element, because ticking a box in it
     * re-renders the whole panel and would otherwise slam the section shut under the
     * author's hand — every tick closing the thing being edited.
     */
    #schemaOpen = false;

    /**
     * Which placed item is selected, by builder and position.
     *
     * Clicking a placed item selects it rather than removing it, which is a change worth
     * explaining. Click-to-remove worked for buttons and could not work for a dropdown, because
     * a dropdown is the one item with an interior and clicking it obviously means "show me
     * inside". So click meant two different things depending on what you clicked, and removing a
     * dropdown was reachable only by dragging it out or by pressing Delete — a gesture with no
     * visible affordance at all.
     *
     * Selecting instead makes one gesture mean one thing everywhere, and gives the menu somewhere
     * to hang from. Drag out and Delete both still remove in one gesture.
     *
     * By position rather than by ID, because a toolbar may hold several separators.
     */
    #selection: { list: 'toolbar' | 'bubble'; index: number } | null = null;

    /**
     * Dismisses the open menu on a click that lands anywhere else, as a menu should.
     *
     * A click on the trigger still toggles, which was the only way to close one before — and
     * being the only way is what made it feel wrong: nothing else on the page asks you to go back
     * and click the thing you opened.
     *
     * Two exemptions, and no more. A click inside the menu is the author working in it, which is
     * the whole point of click-to-toggle: switching three rows off should not take three reopens.
     * A click on any builder button is left to that button's own handler, which already knows
     * whether it means add, select, deselect or toggle — deciding again out here would either
     * fight it or duplicate it.
     *
     * On the document rather than on the component, because "anywhere else" includes the rest of
     * the page. Bound once and dropped on disconnect, unlike the per-render handlers, since the
     * markup it consults is found at the moment it fires.
     */
    #dismiss = (event: Event): void => {
        if (!this.#selection) return;

        const target = event.target;
        if (!(target instanceof Element)) return;
        if (target.closest('[data-builder-menu]') || target.closest('[data-toolbar-item]')) return;

        this.#clearSelection();
    };

    /**
     * `Escape` closes the menu, which is the keyboard's half of the same gesture.
     *
     * Focus goes back to the trigger, rather than to wherever the row that has just stopped
     * existing used to be. That is the one thing this has to do that the click path does not: a
     * pointer keeps its own position, a caret does not.
     *
     * Deliberately not restricted to keystrokes from inside this component. Safari does not focus a
     * button when it is clicked, so a mouse user there has an open menu and focus still on the body
     * — and an `Escape` that works in three browsers is worse than one that works in four. Nothing
     * is prevented either: `Escape` has no default action to cancel here, and staying out of the
     * way means this cannot interfere with Craft dismissing a slideout over the top of us.
     */
    #dismissOnEscape = (event: KeyboardEvent): void => {
        if (event.key !== 'Escape' || !this.#selection) return;

        const { list, index } = this.#selection;
        this.#clearSelection();

        const trigger = this.querySelector(`[data-builder-list="${list}-active"]`)?.children[index];
        if (trigger instanceof HTMLElement) trigger.focus({ preventScroll: true });
    };

    /**
     * Closes the open menu, and does nothing at all when there is none.
     *
     * The guard is what stops a click on a plain button from rebuilding the panel. Clicking Bold in
     * the strip means "not a dropdown, so nothing is selected" and used to render anyway, throwing
     * the panel's whole markup away to arrive at the state it was already in.
     */
    #clearSelection(): void {
        if (!this.#selection) return;

        this.#selection = null;
        this.render();
    }

    /** Whether the on-demand `pk-code-editor` chunk has arrived. See `#loadCodeEditor`. */
    #codeEditorLoaded = false;
    #advancedJson = '';
    #advancedError = '';
    #syncRoot: HTMLElement | null = null;
    /**
     * One sortable per builder, created on first render and then refreshed. They
     * are kept across renders because each owns a DragDropManager and its
     * document-level sensors.
     */
    #dragLists = new Map<'toolbar' | 'bubble', ToolbarDragList>();

    /**
     * One manually driven `pk-tooltip` for every control in both builders, rather
     * than one element per button. The labels are the only thing that differs, so
     * ~40 tooltip components would be 40 sets of listeners rebuilt on every render
     * to say what a single repositioned popup can. It lives outside the rendered
     * host so `innerHTML` never destroys it mid-hover.
     */
    #tooltip?: BuilderTooltip;

    #tooltipSeq = 0;

    /** Pending hover-intent timer; see `#bindTooltip`. */
    #tooltipTimer: number | null = null;

    /**
     * How long the pointer must rest on a control before it is named.
     *
     * A hint is for a pointer that has stopped, not one passing through: a toolbar is a row
     * of adjacent buttons, so moving across it fired a show for each one in turn and the
     * popup chased the cursor along the strip. Worse, showing it puts `pk-popup`'s hover
     * bridge under the pointer — see `fromTooltip` — and each show/hide swapped the cursor
     * between the button's `grab` and the bridge's arrow, which read as a flicker.
     */
    static #tooltipDelay = 200;

    connectedCallback(): void {
        this.#syncRoot = this.querySelector('[data-vizy-config-sync]');
        this.#bindTooltip();
        const initial = this.getAttribute('data-initial');
        if (initial) {
            const parsed = JSON.parse(initial) as InitialData;
            this.#state = {
                ...parsed.config,
                dropdowns: parsed.config.dropdowns ?? {},
                capabilities: {
                    nodes: [...(parsed.config.capabilities?.nodes ?? [])],
                    marks: [...(parsed.config.capabilities?.marks ?? [])],
                    extensions: [...(parsed.config.capabilities?.extensions ?? [])],
                },
                // Older configs omit these — stay enabled.
                gutterInsert: parsed.config.gutterInsert ?? true,
                slashInsert: parsed.config.slashInsert ?? true,
                bubble: {
                    enabled: parsed.config.bubble?.enabled ?? true,
                    items: [...(parsed.config.bubble?.items ?? [])],
                },
            };
            this.#reconcileHeadings();
            this.#toolbarCatalog = parsed.toolbarCatalog;
            this.#dropdownCatalog = parsed.dropdownCatalog ?? [];
            this.#bubbleCatalog = parsed.bubbleCatalog;
            this.#capabilityCatalog = {
                nodes: parsed.capabilityCatalog.nodes ?? [],
                marks: parsed.capabilityCatalog.marks ?? [],
                extensions: parsed.capabilityCatalog.extensions ?? [],
                headingAvailable: parsed.capabilityCatalog.headingAvailable ?? false,
            };
        }
        this.#advancedJson = this.#serializeAdvanced();
        // The hidden inputs are kept current as the author works — `render()` ends by
        // syncing them, and the Advanced editor syncs on each change — rather than being
        // filled in on submit. Craft submits a CP screen through jQuery for Cmd+S and for
        // every entry in the Save menu, and jQuery's `trigger('submit')` ends in a native
        // `form.submit()`, which fires no `submit` event at all. Anything this element did
        // only on submit was therefore skipped by exactly the save paths this screen has
        // just gained, and the config would post with an empty toolbar.
        //
        // The listener remains for the one thing the sync-as-you-go path cannot do: refusing
        // a save whose Advanced JSON does not parse, and saying so. It only runs on a real
        // click on Save, which is the only submit that dispatches an event.
        const form = this.closest('form');
        if (form && !form.dataset.vizyConfigBound) {
            form.dataset.vizyConfigBound = '1';
            form.addEventListener('submit', (event) => {
                if (this.#mode === 'advanced' && !this.#applyAdvanced()) {
                    event.preventDefault();
                    this.render();
                    return;
                }
                this.#syncInputs();
            });
        }
        // On the document, so a click or a keystroke anywhere on the page can close an open menu.
        // See `#dismiss`.
        document.addEventListener('click', this.#dismiss);
        document.addEventListener('keydown', this.#dismissOnEscape);

        this.render();
    }

    disconnectedCallback(): void {
        this.#dragLists.forEach((dragList) => dragList.destroy());
        this.#dragLists.clear();
        document.removeEventListener('click', this.#dismiss);
        document.removeEventListener('keydown', this.#dismissOnEscape);
    }

    #serializeAdvanced(): string {
        return JSON.stringify({
            capabilities: this.#state.capabilities,
            headings: this.#state.headings,
            toolbar: this.#state.toolbar,
            dropdowns: this.#state.dropdowns,
            bubble: this.#state.bubble,
            gutterInsert: this.#state.gutterInsert,
            slashInsert: this.#state.slashInsert,
        }, null, 2);
    }

    #applyAdvanced(): boolean {
        try {
            const parsed = JSON.parse(this.#advancedJson) as Partial<EditorConfigState>;
            this.#state = {
                capabilities: {
                    nodes: [...(parsed.capabilities?.nodes ?? [])],
                    marks: [...(parsed.capabilities?.marks ?? [])],
                    extensions: [...(parsed.capabilities?.extensions ?? [])],
                },
                headings: {
                    levels: [...(parsed.headings?.levels ?? DEFAULT_HEADING_LEVELS)],
                },
                toolbar: [...(parsed.toolbar ?? [])],
                dropdowns: { ...(parsed.dropdowns ?? {}) },
                bubble: {
                    enabled: parsed.bubble?.enabled ?? true,
                    items: [...(parsed.bubble?.items ?? [])],
                },
                gutterInsert: parsed.gutterInsert ?? true,
                slashInsert: parsed.slashInsert ?? true,
            };
            // Hand-written JSON can disagree with itself just as stored config can.
            this.#reconcileHeadings();
            this.#advancedError = '';
            return true;
        } catch {
            this.#advancedError = t('vizy', 'Invalid JSON');
            return false;
        }
    }

    #catalogItem(id: string, catalog: CatalogItem[]): CatalogItem | undefined {
        return catalog.find((item) => item.id === id);
    }

    /**
     * The palette item a toolbar ID draws as.
     *
     * A button is its catalog entry unchanged. A dropdown is its registered entry, redrawn as
     * `group` so the preview gives it a chevron — the label and glyph come from the registry,
     * which is what keeps the preview and `dropdownControl`'s rendering of the same dropdown
     * in agreement without either having to guess. One naming a registration that has gone
     * away draws as nothing, the same as a button whose capability was uninstalled.
     */
    #activeItem(entry: ToolbarEntry): CatalogItem | undefined {
        if (!isDropdownKey(entry)) {
            return this.#catalogItem(entry, this.#toolbarCatalog);
        }

        const registered = this.#catalogItem(entry, this.#dropdownCatalog);

        return registered ? { ...registered, kind: 'group' } : undefined;
    }

    /**
     * Whether the config allows what a palette item stands for.
     *
     * This governs the palette only. It is not enforced on what is already in the toolbar:
     * unticking Quote no longer reaches in and deletes the Quote button, it just stops the
     * button rendering and marks it in the strip. The two lists are edited at different
     * moments and pruning one from behind the author's back lost work they had done.
     */
    #itemAllowed(item: CatalogItem): boolean {
        // A button that is not built yet is never gated on the capabilities, because the two
        // reasons a control might not render are separate answers to separate questions and
        // the strip has to say which one applies (pending vs capability-off).
        if (item.pending) return true;
        // Presentation separators, and the registered dropdowns. Neither has a capability of its own: a
        // dropdown whose members are all disallowed renders nothing, which is the same
        // outcome as any other button whose capability is off.
        if (item.kind === 'presentation' || item.kind === 'dropdown') return true;
        // Undo, alignment and clearing formatting act on the selection and stand for no
        // capability, so there is nothing that could disallow them. The table operations are
        // the exception: they act on the selection too, but their commands arrive with the
        // Table extension, so they name the capability they need and are gated like a button.
        if (item.kind === 'action') {
            return item.capabilityName === undefined
                || this.#state.capabilities.nodes.includes(item.capabilityName);
        }
        if (item.kind === 'mark') {
            return this.#state.capabilities.marks.includes(item.capabilityName ?? item.id);
        }
        if (item.kind === 'extension') {
            return this.#state.capabilities.extensions.includes(item.capabilityName ?? item.id);
        }
        // A level is allowed only if the schema allows that level, which the Heading capability
        // alone does not say. Checked before the node branch below, which would see the Heading
        // capability ticked and offer all six.
        if (item.headingLevel !== undefined) {
            return this.#state.headings.levels.includes(item.headingLevel);
        }
        // Paragraph is always permitted in prose, and a line break is a Shift+Enter mechanic
        // rather than an editorial decision; neither has a checkbox of its own to consult.
        if (item.kind === 'node') {
            if (item.id === 'paragraph' || item.id === 'hardBreak') return true;

            return this.#state.capabilities.nodes.includes(item.capabilityName ?? item.id);
        }

        return false;
    }

    /**
     * Whether something already in the toolbar will actually render.
     *
     * A dropdown always will, as far as this screen can tell. Its contents are its
     * registration's business and are pruned against the capabilities where they are resolved,
     * so the builder would have to reimplement that to say otherwise — and the answer would
     * usually be "yes, minus one option", which is not what the unavailable marker means.
     */
    #entryAvailable(entry: ToolbarEntry): boolean {
        if (isDropdownKey(entry)) return true;

        const item = this.#catalogItem(entry, this.#toolbarCatalog);
        if (!item || item.kind === 'presentation') return true;

        return this.#itemAllowed(item);
    }

    /**
     * The palette: everything a toolbar may name, buttons and dropdowns alike, less what it holds.
     *
     * One row for both. They had a shelf each for a while, on the grounds that a dropdown is a
     * different kind of thing from a button — one applies formatting, the other is a menu of
     * things that do — which was true and was not the reason. The reason was that they were
     * *indistinguishable*: a dropdown wore the same 36px square, so a single row read as a list
     * mixing "applies bold" with "is a menu of things". A dropdown now draws with a chevron and a
     * wider box, in the palette exactly as in the strip, and a distinction the eye can make does
     * not need a heading to announce it.
     *
     * What splitting them cost was the sequence. `PALETTE_ORDER` states the order the editors
     * agree a toolbar is built in, and three of its steps are dropdowns — so with the dropdowns on
     * another shelf, in registration order, the palette could only state the part of that
     * consensus that happened to be buttons. Merged, Formatting opens the row where a format menu
     * belongs, and an author looking for heading control no longer has to know which shelf it is
     * filed under before they can look.
     *
     * `memberOnly` is the interesting filter, and it is the whole of what used to be a rule here.
     * A control a dropdown owns is not a button, so it is never offered as one — see
     * `MEMBER_ONLY_IDS`. What this did instead was offer every member as a button *and* subtract
     * the ones a placed dropdown currently held, which meant placing one chip made four vanish
     * from a palette the author was not looking at, and only worked in that direction: place the
     * four alignments first and the Alignment dropdown was still on offer, so the strip ended up
     * holding each command twice with nothing objecting.
     */
    #toolbarPoolItems(): CatalogItem[] {
        const active = claimedKeys(this.#state.toolbar);

        // Two catalogs because they are looked up separately — only a dropdown carries `members`
        // — and one row because that is how they are offered. `paletteRank` is the server's single
        // sequence across both; see `EditorConfigPresentation::inPaletteOrder`.
        return [...this.#toolbarCatalog, ...this.#dropdownCatalog]
            .filter((item) => {
                if (item.memberOnly) return false;
                // Repeatable items stay offered no matter how many are in use. A dropdown is not
                // one: it is a single named thing, so it leaves the palette when placed.
                if (active.has(item.id) && !this.#isRepeatable(item.id)) return false;
                return this.#itemAllowed(item);
            })
            .sort((a, b) => (a.paletteRank ?? 0) - (b.paletteRank ?? 0))
            // Repeatable items last. The palette otherwise reads as a list of things you
            // have not used yet, and a separator is not one of those — it never leaves,
            // however many are in the toolbar, so it sits apart from the items that do.
            // Applied second, and `Array.sort` is stable, so the sequence above survives it.
            .sort((a, b) => Number(this.#isRepeatable(a.id)) - Number(this.#isRepeatable(b.id)));
    }

    #bubblePoolItems(): CatalogItem[] {
        const active = new Set(this.#state.bubble.items);
        return this.#bubbleCatalog.filter((item) => {
            if (active.has(item.id)) return false;
            return this.#itemAllowed(item);
        });
    }

    #setMode(mode: 'visual' | 'advanced'): void {
        if (mode === 'visual' && this.#mode === 'advanced') {
            // Stay put on unparseable JSON, but re-render on the way out: `#applyAdvanced`
            // has just set the error message, and returning without a render left it
            // stored and never shown. Clicking Visual with bad JSON simply did nothing.
            if (!this.#applyAdvanced()) {
                this.render();
                return;
            }
        }
        if (mode === 'advanced') {
            this.#advancedJson = this.#serializeAdvanced();
            this.#advancedError = '';
            void this.#loadCodeEditor();
        }
        this.#mode = mode;
        this.render();
    }

    /**
     * Brings in the code editor the first time the Advanced tab is opened.
     *
     * Loaded on demand because it carries CodeMirror: importing it up front took this
     * screen's bundle from 37kB to 520kB — 10kB to 179kB gzipped — and the screen opens
     * on the Visual tab, so most visits would pay for an editor they never see.
     *
     * A re-render follows the load rather than being relied upon to happen anyway,
     * because the markup is written before the element is defined. Lit does adopt
     * properties set on a not-yet-upgraded element, but the tab would otherwise sit
     * blank for however long the chunk takes to arrive.
     */
    async #loadCodeEditor(): Promise<void> {
        if (this.#codeEditorLoaded) return;

        await import('@verbb/plugin-kit-web/components/code-editor');
        this.#codeEditorLoaded = true;

        // The author may have gone back to Visual while it was loading.
        if (this.#mode === 'advanced') this.render();
    }

    #toggleCapability(kind: 'nodes' | 'marks' | 'extensions', value: string, checked: boolean): void {
        const list = new Set(this.#state.capabilities[kind]);
        if (checked) list.add(value);
        else list.delete(value);
        this.#state.capabilities[kind] = [...list];
        this.render();
    }

    /**
     * Replaces a whole group of capabilities, which is what a checkbox select reports.
     *
     * Anything the select does not offer is left as it was. `heading` is the reason
     * this is not a plain assignment: it lives in `capabilities.nodes` but is chosen in
     * the Headings section, so taking the nodes select's answer literally would switch
     * headings off every time an unrelated block was ticked.
     */
    #setCapabilities(kind: 'nodes' | 'marks' | 'extensions', chosen: string[], governed: string[]): void {
        const untouched = this.#state.capabilities[kind].filter((id) => !governed.includes(id));
        this.#state.capabilities[kind] = [...new Set([...untouched, ...chosen])];
        this.render();
    }

    /**
     * A `pk-checkbox-select` for one group of capabilities.
     *
     * Options and value go in as attributes because the component parses JSON from
     * both, which keeps this declarative alongside the rest of the markup — the
     * screen re-renders by replacing `innerHTML`, so anything assigned as a property
     * would have to be re-applied on every render.
     *
     * `*` is the component's "all" mode: it ticks the All box and disables the rest.
     * We send it whenever the selection happens to cover every option, rather than
     * storing a wildcard, because the saved config is an explicit list of
     * capabilities and the server has no notion of "all". The visible consequence is
     * intended — tick All, and it stays ticked through the re-render.
     *
     * What we deliberately do *not* inherit is the wildcard's forward promise: a
     * config saved with everything allowed will not silently adopt capabilities added
     * by a later Vizy release. For a setting that governs what pasted content may
     * contain, growing on its own is not a favour.
     */
    #checkboxSelectHtml(group: string, options: CapabilityOption[], selected: string[]): string {
        const all = options.length > 0 && options.every((option) => selected.includes(option.value));
        const value = all ? '*' : JSON.stringify(selected);

        return `
            <pk-checkbox-select
                data-capability-group="${escapeHtml(group)}"
                show-all-option
                all-label="${escapeHtml(t('vizy', 'All'))}"
                options="${escapeHtml(JSON.stringify(options))}"
                value="${escapeHtml(value)}"
            ></pk-checkbox-select>
        `;
    }

    /**
     * Clears heading levels on a config that does not allow headings.
     *
     * Needed because the two can disagree in stored data: the server fills `levels` in
     * with `[2, 3, 4]` whether or not `heading` is allowed, so a config with
     * headings switched off still arrives carrying levels. Now that the levels *are*
     * the setting, taking them at face value would show H2–H4 ticked and a default
     * level control on a config that disallows headings outright.
     *
     * The capability list wins, because that is what the editor and the server actually act
     * on. Levels without `heading` are leftovers, not an instruction.
     */
    #reconcileHeadings(): void {
        if (!this.#state.capabilities.nodes.includes('heading')) {
            this.#state.headings.levels = [];
        }
    }

    /**
     * Whether headings are allowed at all, which is now simply whether any level is.
     *
     * `heading` still lives in the capability list, because that is what the editor and the
     * server read; it is kept in step with the levels rather than being chosen
     * separately. See `#setHeadingLevels`.
     */
    #headingsEnabled(): boolean {
        return this.#state.headings.levels.length > 0;
    }

    /**
     * Applies a heading level selection, deriving everything else from it.
     *
     * One decision, two things to keep consistent: the levels themselves, and whether
     * `heading` is allowed. There was a third — a default level, which had to be one of the
     * chosen ones or the server refused the config — and it went with the button that applied it.
     */
    #setHeadingLevels(levels: number[]): void {
        this.#state.headings.levels = [...levels].sort((a, b) => a - b);

        // Rebuilds the toolbar and Bubble Menu too, since turning headings off has to
        // mark the heading buttons as no longer rendering.
        this.#toggleCapability('nodes', 'heading', this.#headingsEnabled());
    }

    /**
     * Whether the palette never runs out of an item.
     *
     * The separator alone. It is pure spacing, so a toolbar may hold as many as it likes and
     * there is no sense in which one is in use. Every other control — a dropdown included — is
     * one named thing and appears at most once.
     */
    #isRepeatable(id: string): boolean {
        return id === 'separator';
    }

    #entryIndex(key: string, index?: number): number {
        return indexOfEntry(this.#state.toolbar, key, index);
    }

    /**
     * Adds a button or a dropdown, both of which are IDs.
     *
     * A dropdown is placed and nothing else happens. Its members are written only if an author
     * goes on to trim or reorder them, so a config that simply uses Formatting says so in one
     * token and keeps following the registration. See `EditorConfigState.dropdowns`.
     */
    #addToolbarItem(id: string, at?: number): void {
        if (!this.#isRepeatable(id) && this.#entryIndex(id) !== -1) return;
        if (at === undefined) this.#state.toolbar.push(id);
        else this.#state.toolbar.splice(at, 0, id);

        this.render();
    }

    /** The selected toolbar entry, or null when the selection is elsewhere or stale. */
    #selectedEntry(): ToolbarEntry | null {
        if (this.#selection?.list !== 'toolbar') return null;

        return this.#state.toolbar[this.#selection.index] ?? null;
    }

    /** The registration name of the selected dropdown, if a dropdown is what is selected. */
    #selectedDropdown(): string | null {
        const entry = this.#selectedEntry();

        return entry !== null && isDropdownKey(entry) ? dropdownName(entry) : null;
    }

    /** Everything a dropdown may hold, which is its registration's business and fixed. */
    #dropdownRoster(name: string): string[] {
        return this.#catalogItem(`dropdown:${name}`, this.#dropdownCatalog)?.members ?? [];
    }

    /** What it currently holds: this config's subset, or the whole roster if untouched. */
    #dropdownMembers(name: string): string[] {
        return this.#state.dropdowns[name] ?? this.#dropdownRoster(name);
    }

    /**
     * Stores a membership, or forgets it when it says nothing the registration does not.
     *
     * Dropping back to "untouched" matters beyond tidiness: a stored membership is frozen, so a
     * dropdown that has been edited will not pick up members a later release adds to it. An
     * author who trims a member and puts it back should end up where they started rather than
     * with a config that has quietly opted out of future additions.
     */
    #setDropdownMembers(name: string, members: string[]): void {
        const roster = this.#dropdownRoster(name);
        const untouched = members.length === roster.length
            && members.every((member, at) => member === roster[at]);

        if (untouched) delete this.#state.dropdowns[name];
        else this.#state.dropdowns[name] = members;

        this.render();
    }

    /**
     * Puts a member in or takes it out, holding back the last one in.
     *
     * A dropdown with nothing in it is a trigger that opens onto nothing, and the way to be rid
     * of one is to remove the dropdown — so the last member's toggle is refused here, where it
     * can be explained, as well as by the server, which will not store an empty membership.
     *
     * Restoring puts the member back at its registered position relative to what is already in,
     * rather than on the end. The roster's order is the designed one and a member coming back
     * has no reason to have moved.
     */
    #toggleMember(name: string, member: string): void {
        const roster = this.#dropdownRoster(name);
        if (!roster.includes(member)) return;

        const members = this.#dropdownMembers(name);
        if (members.includes(member)) {
            if (members.length <= 1) return;
            this.#setDropdownMembers(name, members.filter((id) => id !== member));
            return;
        }

        const at = roster.indexOf(member);
        const before = members.findIndex((id) => roster.indexOf(id) > at);
        const next = [...members];
        next.splice(before === -1 ? next.length : before, 0, member);
        this.#setDropdownMembers(name, next);
    }

    /** Reorders within what the dropdown holds, which is the only drag the panel offers. */
    #moveMember(name: string, from: number, to: number): void {
        const members = [...this.#dropdownMembers(name)];
        if (from < 0 || to < 0 || from >= members.length || to >= members.length) return;

        const [member] = members.splice(from, 1);
        members.splice(to, 0, member);
        this.#setDropdownMembers(name, members);
    }

    /**
     * Opens a placed dropdown, or closes it if it is the one already open.
     *
     * Only a dropdown can be selected, which is narrower than it started out. Selection was
     * introduced when a click stopped removing, and for a while it applied to everything placed:
     * a plain button drew a ring too, on the grounds that the ring said where `Delete` would land.
     *
     * It did not need to. `Delete` is bound to each button's own `keydown`, so it has always acted
     * on the button holding the keyboard, and the focus ring says that already — with the ring on
     * whatever was last clicked, there were two marks on screen claiming to be the target and only
     * one of them was. So a plain button now draws nothing on click, and a mark in the strip means
     * one thing: this dropdown is open.
     *
     * Clicking a plain button therefore closes an open menu, which is what a click anywhere else
     * does — `#dismiss` leaves builder buttons to this method precisely so it stays the one place
     * that decides.
     */
    #select(list: 'toolbar' | 'bubble', index: number): void {
        // The Bubble Menu holds no dropdowns at all, so nothing in it is ever selectable.
        const entry = list === 'toolbar' ? this.#state.toolbar[index] : undefined;
        if (entry === undefined || !isDropdownKey(entry)) {
            this.#clearSelection();
            return;
        }

        const same = this.#selection?.list === list && this.#selection.index === index;
        this.#selection = same ? null : { list, index };
        this.render();
    }

    /**
     * Removes one occurrence at `index`, falling back to the first match.
     *
     * A toolbar may hold several separators, so filtering by ID would remove
     * every one of them from a single click.
     */
    #removeToolbarItem(id: string, index?: number): void {
        const at = this.#entryIndex(id, index);
        if (at === -1) return;
        this.#state.toolbar.splice(at, 1);

        // A dropdown taken out of the toolbar takes its membership with it, matching what the
        // server prunes on save: membership belongs to the placed dropdown. So removing one and
        // dragging it back starts from the registration again, which is the whole of the way back
        // to the defaults now that the menu offers no Reset of its own.
        if (isDropdownKey(id)) delete this.#state.dropdowns[dropdownName(id)];

        // Whatever was selected has moved or gone. Cleared rather than adjusted: the panel
        // describes one item, and quietly re-pointing it at the neighbour that slid into the
        // vacated position would show the author settings for something they did not choose.
        this.#selection = null;

        this.render();
    }

    #addBubbleItem(id: string, at?: number): void {
        if (this.#state.bubble.items.includes(id)) return;
        if (at === undefined) this.#state.bubble.items.push(id);
        else this.#state.bubble.items.splice(at, 0, id);
        this.render();
    }

    #removeBubbleItem(id: string): void {
        this.#state.bubble.items = this.#state.bubble.items.filter((item) => item !== id);
        this.render();
    }

    #moveItem(list: 'toolbar' | 'bubble', from: number, to: number): void {
        const target = list === 'toolbar' ? this.#state.toolbar : this.#state.bubble.items;
        if (from < 0 || to < 0 || from >= target.length || to >= target.length) return;
        const [item] = target.splice(from, 1);
        target.splice(to, 0, item);
        this.render();
    }

    /**
     * Applies a committed dnd-kit drop to state.
     *
     * The drag list reports which list the item came from and which it landed in. A palette is
     * derived from state rather than author-ordered, so landing in one means "take this out of
     * use" and its index is ignored; the strip and the member row are both positions.
     *
     * A member drag never leaves the member row and nothing can be dragged into it — the drag
     * list offers no landing place for either, so those combinations do not arrive here. What is
     * left is one gesture per zone: place, remove, or reorder.
     */
    #applyDrop(list: 'toolbar' | 'bubble', drop: ToolbarDrop): void {
        if (list === 'bubble') {
            if (isPaletteList(drop.to)) this.#removeBubbleItem(drop.itemId);
            else if (isPaletteList(drop.from)) this.#addBubbleItem(drop.itemId, drop.index);
            else this.#moveItem('bubble', drop.fromIndex, drop.index);
            return;
        }

        if (drop.from === 'members') {
            // Only a reorder can land, but a release outside the menu still reports a drop into
            // the palette. That is not a removal here — switching a member off is a click on it —
            // so it is a no-change outcome and the render puts the row back.
            const name = this.#selectedDropdown();
            if (name !== null && drop.to === 'members') this.#moveMember(name, drop.fromIndex, drop.index);
            else this.render();
            return;
        }

        // Dropped over neither list, which is how removal from the strip is spelled. Clears the
        // selection itself, the item it described being gone.
        if (isPaletteList(drop.to)) {
            this.#removeToolbarItem(drop.itemId, drop.fromIndex);
            return;
        }

        // An insert shifts every position after it, and the selection is a position, so whatever
        // was selected may no longer be what the panel is describing.
        if (isPaletteList(drop.from)) {
            this.#selection = null;
            this.#addToolbarItem(drop.itemId, drop.index);
            return;
        }

        // A reorder carries the selection with the item being dragged, so a dropdown can be moved
        // along the strip without its menu closing — worth having, now that the menu is drawn
        // under the trigger and would otherwise vanish the moment you tidied the toolbar.
        //
        // Any *other* selection goes, because a reorder also shifts everything the item moved
        // past. Following those through would mean re-deriving an index from a move this method
        // has not made yet, to keep a panel open on an item nobody is working on.
        if (this.#selection?.list === 'toolbar') {
            this.#selection = this.#selection.index === drop.fromIndex
                ? { list: 'toolbar', index: drop.index }
                : null;
        }
        this.#moveItem('toolbar', drop.fromIndex, drop.index);
    }

    #syncInputs(): void {
        if (!this.#syncRoot) return;
        this.#syncRoot.replaceChildren();

        const appendHidden = (name: string, value: string): void => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = name;
            input.value = value;
            this.#syncRoot?.append(input);
        };

        this.#state.capabilities.nodes.forEach((value) => appendHidden('capabilityNodes[]', value));
        this.#state.capabilities.marks.forEach((value) => appendHidden('capabilityMarks[]', value));
        this.#state.capabilities.extensions.forEach((value) => appendHidden('capabilityExtensions[]', value));
        this.#state.headings.levels.forEach((value) => appendHidden('headingLevels[]', String(value)));
        appendHidden('toolbarJson', JSON.stringify(this.#state.toolbar));
        appendHidden('dropdownsJson', JSON.stringify(this.#state.dropdowns));
        appendHidden('bubbleJson', JSON.stringify(this.#state.bubble));
        appendHidden('gutterInsert', this.#state.gutterInsert ? '1' : '0');
        appendHidden('slashInsert', this.#state.slashInsert ? '1' : '0');
        appendHidden('advancedConfig', this.#serializeAdvanced());
    }

    /**
     * A button's face: its icon, else the short stand-in it carries, else its name.
     *
     * Mirrors `controlIcon` in the field's own UI, which is what the strip is a preview
     * of. `abbr` is how the heading levels are drawn — "H3" in the square, with the full
     * name left to the tooltip.
     */
    #glyphHtml(item: CatalogItem): string {
        if (item.icon) return item.icon;
        if (item.abbr) return `<span class="vizy-control-abbr">${escapeHtml(item.abbr)}</span>`;

        return `<span class="vizy-control-text">${escapeHtml(item.label)}</span>`;
    }

    /**
     * One renderer for all three areas, so an item looks the same wherever it sits —
     * the whole point of the builder is that the strip previews the real toolbar.
     * They are drawn identically: `variant` decides only what a click does, and
     * remains on the element as a hook. Fading the available ones was tried and read
     * as "disabled" rather than "not in use yet"; the section headings say which
     * half is which.
     *
     * `is-unavailable` is the exception, and is not about the builder: it marks a button
     * whose capability this config does not allow, which is now something a toolbar is
     * permitted to contain. It will not render in the editor, and saying so here is the
     * whole of the feedback — the alternative was deleting it from behind the author's back.
     *
     * `is-pending` is the same treatment for the other reason a button will not render: it is
     * a Vizy 3 control Vizy has not built the editing for. Same fade, different name, because
     * "not allowed here" and "not there yet" are different things to tell an author.
     */
    #itemHtml(
        item: CatalogItem,
        list: 'toolbar' | 'bubble',
        variant: 'available' | 'active',
        options: { unavailable?: boolean; selected?: boolean } = {},
    ): string {
        // `dropdown` in a palette, `group` once placed. Both wear the chevron: one is the
        // offer of a menu and the other is a menu, and the preview should not pretend the
        // thing being dragged is a plain button. Add Block opens a palette rather than a
        // roster menu, but the same appearance (+ glyph + chevron) says it opens something.
        const isDropdown = item.kind === 'group' || item.kind === 'dropdown';
        const hasMenuAppearance = isDropdown || item.id === 'addBlock';
        const classes = [
            'vizy-control',
            item.id === 'separator' ? 'is-separator' : '',
            // A stand-in glyph keeps the square, as an icon does; only a button falling all
            // the way back to its full name has to widen for it.
            item.icon || item.abbr || item.id === 'separator' ? '' : 'is-text',
            // A chevron, so a dropdown / Add Block reads as an opener in the preview as
            // well as in the editor. Same class the field's own UI uses.
            hasMenuAppearance ? 'has-menu' : '',
            variant === 'available' ? 'is-available' : '',
            // The open dropdown, and only ever that — see `#select` for why a plain button no
            // longer draws anything when it is clicked.
            options.selected ? 'is-selected' : '',
            options.unavailable ? 'is-unavailable' : '',
            // Same fade as `is-unavailable`, for the same reason: this button will not render
            // in the editor. A separate class because the two are separate facts and only one
            // of them is about a setting — see the accessible name below, which is the part
            // an author actually reads.
            item.pending ? 'is-pending' : '',
        ].filter(Boolean).join(' ');

        // "Coming soon" rather than a capability's name, because there is nothing to switch on.
        // Pending wins over unavailable when both somehow apply: not being built yet is the
        // fact that governs, and the config's opinion of a capability it cannot use is moot.
        const label = item.pending
            ? t('vizy', '{label} (not available yet)', { label: item.label })
            : options.unavailable
            ? t('vizy', '{label} (not allowed by this config)', { label: item.label })
            : item.label;

        // Deliberately no `title`. A native tooltip pops up at the cursor and
        // covers the neighbouring buttons — worst of all mid-drag, which is
        // exactly when you need to see them. `aria-label` carries the accessible
        // name; the icons speak for themselves for everyone else.
        //
        // `aria-expanded` below, and only on a placed dropdown, because that is now the one item a
        // click does anything visible to and what it does is open a menu. It replaces an
        // `aria-current` on everything placed, which described a selection plain buttons no longer
        // have — and never described this one well, "the current item of a set" not being "the menu
        // you have open".
        return `
            <button
                type="button"
                class="${classes}"
                aria-label="${escapeHtml(label)}"
                ${variant === 'active' && isDropdown ? `aria-expanded="${options.selected ? 'true' : 'false'}"` : ''}
                data-toolbar-item="${escapeHtml(item.id)}"
                data-toolbar-list="${list}"
                data-toolbar-variant="${variant}"
                ${this.#isRepeatable(item.id) ? 'data-toolbar-repeatable' : ''}
            >${item.id === 'separator' ? '' : this.#glyphHtml(item)}${hasMenuAppearance ? `<span class="vizy-control-chevron" aria-hidden="true">${MENU_CHEVRON_SVG}</span>` : ''}</button>
        `;
    }

    /**
     * What the editor may contain, folded away.
     *
     * "Content schema" rather than "Capabilities", because that is literally what these
     * checkboxes are: the nodes and marks the ProseMirror schema is built from. The name is
     * technical on purpose — an Editor Config is a developer's screen, reached through Vizy's
     * settings rather than a field's, and the vaguer names were worse for the audience that
     * actually opens it. "Capabilities" said nothing about *when* it applies, which is the one
     * thing an author needed to know to understand why it exists apart from the toolbar.
     *
     * Collapsed because it is the advanced half of this screen and most configs want it left
     * alone, while nearly every visit is about the toolbar. Not hidden, though, and not moved
     * to another tab: the summary line states the count, so a narrowed schema is visible at a
     * glance rather than being something you have to think to check.
     */
    #schemaSectionHtml(): string {
        const options = [
            ...this.#capabilityCatalog.nodes,
            ...this.#capabilityCatalog.marks,
            ...this.#capabilityCatalog.extensions,
        ];
        const allowed = options.filter((option) => (
            this.#state.capabilities.nodes.includes(option.value)
            || this.#state.capabilities.marks.includes(option.value)
            || this.#state.capabilities.extensions.includes(option.value)
        ));

        return `
            <details class="vizy-editor-config-section vizy-editor-config-schema" data-schema-details ${this.#schemaOpen ? 'open' : ''}>
                <summary>
                    <span class="vizy-editor-config-schema-title">${t('vizy', 'Content schema')}</span>
                    <span class="vizy-editor-config-schema-count">${t('vizy', '{allowed} of {total} content types allowed', {
                        allowed: String(allowed.length),
                        total: String(options.length),
                    })}</span>
                </summary>
                <p class="instructions">${t('vizy', 'The nodes, marks, and behaviour extensions this editor understands. It governs pasted and imported content as well as the toolbar, so a content type can be allowed without being given a button — which is how existing formatting is preserved without authors being offered more of it.')}</p>

                <div class="vizy-editor-config-subhead">${t('vizy', 'Blocks and objects')}</div>
                ${this.#checkboxSelectHtml('nodes', this.#capabilityCatalog.nodes, this.#state.capabilities.nodes)}

                <!--
                    Here rather than in a section of its own, which is where it was and which
                    made the one content decision with a bespoke control read as an unrelated
                    setting that happened to be nearby. Six levels are six content types: they
                    govern pasted and imported content exactly as Quote and Code block do — an
                    H1 pasted into a config that disallows level 1 becomes a paragraph — so they
                    belong with every other answer to "what may this editor contain".

                    Kept as their own select under a subhead rather than folded into the blocks
                    grid above, because "Heading 1" through "Heading 6" sorted alphabetically in
                    among Code block, Horizontal rule and Image reads as six unrelated types, and
                    its All box would then mean all-blocks-and-all-levels.
                -->
                ${this.#capabilityCatalog.headingAvailable ? `
                    <div class="vizy-editor-config-subhead">${t('vizy', 'Heading levels')}</div>
                    <!--
                        No separate "Allow headings" switch. The levels are the setting: choosing
                        none is how headings are disallowed. Two controls for one decision meant
                        the switch could be on with no levels ticked, a state that had to be
                        papered over by seeding defaults.
                    -->
                    ${this.#checkboxSelectHtml(
                        'headings',
                        HEADING_LEVELS.map((level) => ({ label: `H${level}`, value: String(level) })),
                        this.#state.headings.levels.map(String),
                    )}
                ` : ''}

                <div class="vizy-editor-config-subhead">${t('vizy', 'Inline formatting')}</div>
                ${this.#checkboxSelectHtml('marks', this.#capabilityCatalog.marks, this.#state.capabilities.marks)}

                ${this.#capabilityCatalog.extensions.length > 0 ? `
                    <div class="vizy-editor-config-subhead">${t('vizy', 'Behaviour extensions')}</div>
                    <p class="instructions">${t('vizy', 'TipTap modules that change editing behaviour without adding a document type. Enable them here so their JavaScript loads with this config.')}</p>
                    ${this.#checkboxSelectHtml('extensions', this.#capabilityCatalog.extensions, this.#state.capabilities.extensions)}
                ` : ''}
            </details>
        `;
    }

    /**
     * The selected dropdown, drawn as the menu it will be.
     *
     * Live authoring uses Plugin Kit `pk-dropdown-menu` `size="sm"`. This preview
     * mirrors that panel UI (tokens + row metrics in `editor-config-settings.css`)
     * but stays a light-DOM editable roster: click toggles membership, drag reorders,
     * and the panel stays open — a real PK menu would close on select and fight DnD.
     *
     * One list, not two. A menu row can simply grey out and stay put. So a click switches
     * a row off where it sits: an untouched dropdown is a plain menu, and a trimmed one is
     * a menu with lines through it.
     *
     * Nothing can be dragged in, and dragging within only reorders. What a dropdown *may*
     * hold belongs to whoever registered it.
     *
     * What the schema disallows is left out rather than faded, which is the one rule that
     * keeps this a preview. `dropdownControl` builds the real menu by resolving each member
     * and dropping the ones that resolve to nothing.
     */
    #menuHtml(name: string): string {
        const roster = this.#dropdownRoster(name);
        const members = this.#dropdownMembers(name);

        // Every member the dropdown may hold, the switched-off ones in the place they would come
        // back to rather than herded to the end — see `rosterOrder`. Then the ones the schema
        // disallows drop out, exactly as they will when the editor builds the real menu.
        const rows = rosterOrder(roster, members)
            .filter((member) => this.#memberRenders(member))
            .map((member) => this.#menuRowHtml(member, !members.includes(member)))
            .join('');

        return `
            <div
                class="vizy-editor-config-menu"
                role="menu"
                data-size="sm"
                data-builder-list="toolbar-members"
                data-builder-menu
            >
                ${rows || `<p class="vizy-editor-config-menu-empty">${t('vizy', 'Nothing in this dropdown can render, so it won’t appear.')}</p>`}
            </div>
        `;
    }

    /**
     * Whether a member would survive the editor building this menu.
     *
     * The catalog has to know it, and the schema has to allow it. Both are the same question the
     * server answers with `controlFor` returning null — see `#menuHtml` for why the answer is to
     * leave the row out rather than to draw it faded.
     */
    #memberRenders(member: string): boolean {
        const item = this.#catalogItem(member, this.#toolbarCatalog);

        return item !== undefined && !item.pending && this.#itemAllowed(item);
    }

    /**
     * One row of that menu: a glyph, if the control has one, and its name.
     *
     * Not `#itemHtml`. That renders the 36px square a toolbar is made of, and a menu row is a
     * different shape with a different job — it is mostly text, and its text is the preview. The
     * two share the `data-toolbar-*` hooks, though, so a row is picked up by the same drag
     * registration and the same click routing as any other item in the builder.
     *
     * `data-preview` on `.preview-label` keys the typography (same as live toolbar).
     *
     * Only ever called for a member that will render — `#menuHtml` has already dropped the rest —
     * so there is no faded state here. `is-off` is the only thing a row can be beyond ordinary.
     */
    #menuRowHtml(member: string, off: boolean): string {
        const item = this.#catalogItem(member, this.#toolbarCatalog);
        if (!item) return '';

        const label = off
            ? t('vizy', '{label} (switched off)', { label: item.label })
            : item.label;

        return `
            <button
                type="button"
                role="menuitem"
                class="vizy-editor-config-menu-item${off ? ' is-off' : ''}"
                aria-label="${escapeHtml(label)}"
                aria-pressed="${off ? 'false' : 'true'}"
                data-toolbar-item="${escapeHtml(item.id)}"
                data-toolbar-list="toolbar"
                data-toolbar-variant="member"
            >${item.icon ? `<span class="vizy-editor-config-menu-icon" aria-hidden="true">${item.icon}</span>` : ''}<span class="preview-label"${item.preview ? ` data-preview="${escapeHtml(item.preview)}"` : ''}>${escapeHtml(item.label)}</span></button>
        `;
    }

    /** Says why a list is empty, since an empty strip otherwise reads as broken. */
    #emptyPlaceholderHtml(label: string): string {
        return `
            <span class="vizy-editor-config-empty" data-empty-placeholder>
                ${escapeHtml(label)}
            </span>
        `;
    }

    /**
     * Soaks up the leftover space after the last item, and anchors the end of the
     * list.
     *
     * Stretched to fill the row so the strip keeps its shape, and it is what
     * `ToolbarDragList` puts the reserved slot in front of when an item is headed
     * past the last button — appending to the list itself would land the slot on the
     * far side of this filler, out at the right-hand edge.
     */
    #tailHtml(): string {
        return `<span class="vizy-editor-config-tail" data-builder-tail></span>`;
    }

    /**
     * The items, or a note saying why there are none, plus the end-of-list anchor.
     *
     * Only the toolbar gets a tail. The available list is not a drop target at all,
     * so there is no end of it to drop at.
     */
    #listHtml(items: string, emptyLabel: string, droppable = true): string {
        const body = items || this.#emptyPlaceholderHtml(emptyLabel);
        return droppable ? body + this.#tailHtml() : body;
    }

    /**
     * Hover hints for the controls, delegated from the component so they survive
     * the re-render that replaces the builder markup. Icon-only buttons need a
     * name on hover, but a native `title` was tried first and was worse than
     * nothing: it appears under the pointer, covering the neighbouring buttons at
     * the exact moment you are dragging between them. A tooltip anchored above the
     * button keeps the row readable.
     */
    /**
     * Takes the tooltip out of the hit test, so it cannot own the cursor.
     *
     * `pk-popup` paints a "hover bridge": an invisible quadrilateral spanning anchor to popup, so
     * a pointer travelling to a popup does not dismiss it on the way. Measured here at 805x926, it
     * covers this whole builder, and it wins the hit test wherever no button is drawn over it —
     * the 4px channels between buttons, and the few pixels above each row.
     *
     * Which is where the flicker came from. A button says `cursor: grab`; the bridge says nothing,
     * so it inherits the arrow. Cross a button's top edge with a hint showing and the cursor
     * changes twice, and a hand not quite still on a 36px square does that several times a second.
     * Chrome showed it worst. Firefox hit-tests the band slightly differently and only flickered a
     * little, which is the sort of difference that says the layer, not the styling, is the problem.
     *
     * Nothing in this popup is for interacting with: the trigger is `manual`, so we show and hide
     * it ourselves and do not need the bridge keeping it alive, and the content is one word of
     * text. So the whole popup is made transparent to the pointer, cursor included.
     *
     * It takes a `<style>` pushed into `pk-popup`'s shadow root, which is reaching into another
     * component's internals and worth saying why. `pointer-events` is inherited, so setting it on
     * the host would be enough — except the bridge sets it back to `auto` in that shadow style,
     * and `pk-tooltip` forwards neither the `hoverBridge` property nor a `hover-bridge` part, so
     * there is no supported way in. A `<style>` element rather than an adopted stylesheet because
     * it needs no feature test and no constructor.
     *
     * Every step is optional-chained and the whole thing is best-effort: if a future `pk-popup`
     * has no shadow root to reach, or names the bridge something else, the hint still works and we
     * are back to a flickering cursor rather than a broken panel.
     */
    async #disarmTooltipPointer(tooltip: BuilderTooltip): Promise<void> {
        // The popup is rendered by `pk-tooltip`'s own first update, so there is nothing to reach
        // into until that has happened.
        await (tooltip as unknown as { updateComplete?: Promise<unknown> }).updateComplete;

        const popup = tooltip.shadowRoot?.querySelector('pk-popup');
        if (!popup) return;

        await customElements.whenDefined('pk-popup');
        await (popup as unknown as { updateComplete?: Promise<unknown> }).updateComplete;
        if (!popup.shadowRoot) return;

        const style = document.createElement('style');
        style.textContent = ':host, .hover-bridge, [part="content"] { pointer-events: none; }';
        popup.shadowRoot.appendChild(style);
    }

    #bindTooltip(): void {
        const tooltip = document.createElement('pk-tooltip') as BuilderTooltip;
        tooltip.setAttribute('trigger', 'manual');
        tooltip.setAttribute('placement', 'top');
        this.appendChild(tooltip);
        this.#tooltip = tooltip;
        void this.#disarmTooltipPointer(tooltip);

        const controlFor = (target: EventTarget | null): HTMLElement | null =>
            target instanceof Element ? target.closest<HTMLElement>('.vizy-control') : null;

        /**
         * Whether an event came from the tooltip itself rather than from the panel.
         *
         * It does so more often than it looks: `pk-popup` paints a "hover bridge" — an
         * invisible, pointer-accepting quadrilateral spanning anchor to popup, so a cursor
         * travelling to the tooltip does not dismiss it on the way. Measured at 400x521,
         * it covers this whole builder, and it wins the hit test wherever no button is
         * drawn over it: the 4px channels between buttons, and the band just above a row.
         *
         * Left unhandled, that bridge fought this tooltip for the cursor. Hovering a button
         * showed the hint, which put the bridge under the pointer, whose `pointerover`
         * reached the handler below as "not a control" and hid the hint again — taking the
         * bridge with it, re-exposing the button, and starting over. The cursor flickered
         * between `grab` and the default arrow for as long as the pointer stayed there.
         *
         * Events from inside the tooltip are therefore not news about the panel and are
         * ignored on both sides. `composed` events retarget to the host, so the host's own
         * `contains` is enough to catch anything from its shadow tree.
         *
         * `#disarmTooltipPointer` now takes the bridge out of the hit test altogether, which
         * is the better fix and the one that also settles the cursor. This guard stays as
         * the belt to that braces: it is two lines, it costs nothing, and it keeps the
         * behaviour correct if a future `pk-popup` renders the bridge somewhere this cannot
         * reach.
         */
        const fromTooltip = (target: EventTarget | null): boolean =>
            target instanceof Node && tooltip.contains(target);

        const cancel = (): void => {
            if (this.#tooltipTimer === null) return;
            window.clearTimeout(this.#tooltipTimer);
            this.#tooltipTimer = null;
        };

        const show = (event: Event): void => {
            if (fromTooltip(event.target)) return;

            const control = controlFor(event.target);
            const label = control?.getAttribute('aria-label');

            // Whatever was pending was for a different button, or for this one before the
            // pointer left and came back. Either way it is stale.
            cancel();

            // Nothing to point at mid-drag: the item is moving, and a popup
            // tracking it would sit over the slot the author is aiming for.
            if (
                !control
                || !label
                || control.closest('.is-sorting')
                || control.hasAttribute('data-dnd-placeholder')
            ) {
                tooltip.hide();
                return;
            }

            // Held back until the pointer settles. A keyboard focus is not a passing
            // pointer, but it goes through the same wait so both paths behave alike and the
            // hint cannot appear twice for one arrival.
            this.#tooltipTimer = window.setTimeout(() => {
                this.#tooltipTimer = null;

                // The strip may have been rebuilt, or a drag begun, while we waited.
                if (!control.isConnected || control.closest('.is-sorting')) return;

                // `for` anchors by id, so the button needs one; assigned on first hover
                // rather than at render time, where it would be 40 ids nobody reads.
                if (!control.id) control.id = `vizy-control-${++this.#tooltipSeq}`;

                tooltip.for = control.id;
                tooltip.content = label;
                tooltip.show();
            }, VizyEditorConfigSettingsElement.#tooltipDelay);
        };

        const hide = (event: Event): void => {
            if (fromTooltip(event.target)) return;

            cancel();
            tooltip.hide();
        };

        this.addEventListener('pointerover', show);
        this.addEventListener('focusin', show);
        this.addEventListener('pointerout', hide);
        this.addEventListener('focusout', hide);
        // A press is either a click or the start of a drag; the hint is in the way
        // of both.
        this.addEventListener('pointerdown', hide);
    }

    /**
     * What clicking and keying a builder button do.
     *
     * Click in a palette to add. Click a placed item to *select* it, which is where this changed:
     * it used to remove, and could not go on doing so once a dropdown needed a way to be opened.
     * Removal is a drag out or `Delete`, neither of which the section's one line of instructions
     * spends itself on any more — the first needs no telling, the second belongs in the docs. See
     * `#selection`, and `#dismiss` for closing an open menu by clicking anywhere else.
     *
     * Click a roster member to take it out of its dropdown or put it back — the one place a click
     * still toggles something in place, because there is nothing else it could mean.
     *
     * The keyboard takes the same paths from `keydown` rather than inferring them from a click
     * with no click count. That is what a keyboard activation looks like, but it is also what
     * `element.click()` looks like, which made every programmatic click a removal.
     */
    #bindItemEvents(root: HTMLElement): void {
        /** Where the button sits in its own list, so one of several separators is acted on
         * where it sits rather than wherever the first one happens to be. */
        const positionOf = (button: HTMLElement): number | undefined => {
            const index = [...(button.parentElement?.children ?? [])].indexOf(button);
            return index === -1 ? undefined : index;
        };

        root.querySelectorAll<HTMLElement>('[data-toolbar-item]').forEach((button) => {
            const id = button.dataset.toolbarItem;
            const list = button.dataset.toolbarList as 'toolbar' | 'bubble' | undefined;
            const variant = button.dataset.toolbarVariant as 'available' | 'active' | 'member' | undefined;
            if (!id || !list) return;

            const activate = (): void => {
                if (variant === 'available') {
                    if (list === 'toolbar') this.#addToolbarItem(id);
                    else this.#addBubbleItem(id);
                    return;
                }

                if (variant === 'member') {
                    const name = this.#selectedDropdown();
                    if (name !== null) this.#toggleMember(name, id);
                    return;
                }

                this.#select(list, positionOf(button) ?? -1);
            };

            button.onclick = activate;

            button.onkeydown = (event) => {
                // Removal in one keystroke, since activation now selects rather than removes.
                // Drag-out is the only other one-gesture removal and drag is a pointer, so
                // without this the keyboard would have to go via the panel for everything.
                if (event.key === 'Delete' || event.key === 'Backspace') {
                    if (variant !== 'active') return;
                    event.preventDefault();
                    if (list === 'toolbar') this.#removeToolbarItem(id, positionOf(button));
                    else this.#removeBubbleItem(id);
                    return;
                }

                if (event.key !== 'Enter' && event.key !== ' ') return;
                // Both keys activate a button natively, so the click that follows has to be
                // headed off or the item would be added and removed in one keystroke.
                event.preventDefault();
                activate();
            };
        });
    }

    /**
     * Creates each builder's sortable on first render, then re-registers it
     * against the freshly rendered DOM. The managers outlive renders so their
     * document-level sensors are not torn down and rebuilt on every keystroke.
     */
    #refreshSortables(root: HTMLElement): void {
        (['toolbar', 'bubble'] as const).forEach((list) => {
            const container = () => root.querySelector<HTMLElement>(`[data-builder="${list}"]`);

            // Advanced mode renders no builders, so drop the manager rather than
            // leaving it registered against detached elements.
            if (!container()) {
                this.#dragLists.get(list)?.destroy();
                this.#dragLists.delete(list);
                return;
            }

            let dragList = this.#dragLists.get(list);
            if (!dragList) {
                dragList = new ToolbarDragList({
                    container,
                    // Distinct per builder, so a bubble item can never be dropped
                    // into the main toolbar.
                    type: `vizy-${list}-control`,
                    availableList: () => root.querySelector<HTMLElement>(`[data-builder-list="${list}-available"]`),
                    activeList: () => root.querySelector<HTMLElement>(`[data-builder-list="${list}-active"]`),
                    // Present only while a dropdown is open, and only for the toolbar builder.
                    // Resolved lazily like the rest, so opening and closing a dropdown needs no
                    // more than a render.
                    memberList: () => root.querySelector<HTMLElement>(`[data-builder-list="${list}-members"]`),
                    onDrop: (drop) => this.#applyDrop(list, drop),
                    // State is already correct; re-rendering is what puts back the
                    // button the drag carried through the toolbar as its slot.
                    onRevert: () => this.render(),
                });
                this.#dragLists.set(list, dragList);
            }

            dragList.refresh();
        });
    }

    render(): void {
        const host = this.querySelector<HTMLElement>('[data-vizy-config-host]');
        if (!host) return;

        // How far down the open menu was scrolled, before the markup that holds it is replaced.
        // Switching a row off re-renders the panel, and a Formatting menu is tall enough to
        // scroll — so without this, clicking Heading 4 threw the author back to Paragraph and
        // they had to find their place again to switch the next one off. Restored in `#alignMenu`,
        // once the new menu exists and has been given its size.
        const menuScroll = host.querySelector<HTMLElement>('[data-builder-menu]')?.scrollTop ?? 0;

        // And how far down the page itself was, for a related but separate reason — see the restore
        // below the markup.
        const scroller = document.scrollingElement;
        const pageScroll = scroller?.scrollTop ?? 0;

        // Which builder button had the keyboard, for the same reason: the markup that holds it is
        // about to be replaced. Every edit re-renders, so without this a keyboard author lost focus
        // to the body on each one — pressing Enter on a menu row switched it off and then stranded
        // them, so switching off three rows meant tabbing back in three times.
        const focused = this.#focusedButton(host);

        const selectedDropdown = this.#selectedDropdown();
        const toolbarItems = this.#state.toolbar
            .map((entry, index) => {
                const item = this.#activeItem(entry);
                if (!item) return '';

                return this.#itemHtml(item, 'toolbar', 'active', {
                    unavailable: !this.#entryAvailable(entry),
                    selected: this.#selection?.list === 'toolbar' && this.#selection.index === index,
                });
            })
            .join('');
        const bubbleItems = this.#state.bubble.items
            .map((id, index) => {
                const item = this.#catalogItem(id, this.#bubbleCatalog);

                return item
                    ? this.#itemHtml(item, 'bubble', 'active', {
                        selected: this.#selection?.list === 'bubble' && this.#selection.index === index,
                    })
                    : '';
            })
            .join('');

        host.innerHTML = `
            <div class="vizy-editor-config">
                <div class="vizy-editor-config-tabs">
                    <button type="button" class="${this.#mode === 'visual' ? 'active' : ''}" data-mode="visual">${t('vizy', 'Visual')}</button>
                    <button type="button" class="${this.#mode === 'advanced' ? 'active' : ''}" data-mode="advanced">${t('vizy', 'Advanced')}</button>
                </div>

                ${this.#mode === 'visual' ? `
                    <div class="vizy-editor-config-panel">
                        <!--
                            The toolbar leads, because it is what these configs are opened to
                            change. What the editor is *able* to represent used to come first,
                            which put an advanced decision — and one most configs want left
                            alone — in front of the routine one, and made buttons look missing
                            when they were only unticked. It is last now, and folded away.
                        -->
                        <section class="vizy-editor-config-section">
                            <h3>${t('vizy', 'Toolbar')}</h3>
                            <!--
                                One sentence, naming the gesture that gets someone started. It grew
                                to five as each behaviour was added — remove, open a dropdown, edit
                                its contents, and why its contents are fixed — until it was a
                                paragraph of rules above a panel whose whole argument is that it can
                                be experimented with. Everything dropped from it is either something
                                the interface shows on contact or something only reached by trying:
                                clicking a dropdown opens it, and the rows say what they do.

                                'Delete' is the one loss worth naming, being the only affordance with
                                nothing on screen to hint at it. It is a second route to a removal
                                that dragging already does, so the sentence is not the place; the
                                docs are.
                            -->
                            <p class="instructions">${t('vizy', 'Drag toolbar items into the editor.')}</p>
                            <div class="vizy-editor-config-builder" data-builder="toolbar">
                                <!--
                                    Buttons and dropdowns in one row. A dropdown draws with a
                                    chevron and a wider box, here as in the strip, which is what
                                    tells the two apart — they had a shelf each while they wore the
                                    same square and could not be told apart at all, and a heading
                                    was doing work the item can do itself. Splitting them also cost
                                    the sequence: three of the steps 'PALETTE_ORDER' arranges are
                                    dropdowns, so a buttons-only row could state only part of it.

                                    Nothing a dropdown owns is offered here as well. A dropdown
                                    owns its members outright, so a toolbar cannot name them and
                                    the palette does not list them. See 'MEMBER_ONLY_IDS'.

                                    The set is registered rather than authored: a plugin adds to
                                    it through 'Extensions::EVENT_REGISTER_TOOLBAR_DROPDOWNS'.
                                    So is what each one may hold — a config can trim and reorder
                                    that roster, in the menu a selected dropdown opens, but not
                                    add to it.
                                -->
                                <div class="vizy-editor-config-group">
                                    <h4 class="vizy-editor-config-subhead">${t('vizy', 'Available items')}</h4>
                                    <div class="vizy-editor-config-available" data-builder-list="toolbar-available">
                                        ${this.#listHtml(
                                            // One unbroken row, in the order the server sequenced
                                            // them — see `EditorConfigPresentation::PALETTE_ORDER`.
                                            this.#toolbarPoolItems()
                                                .map((item) => this.#itemHtml(item, 'toolbar', 'available'))
                                                .join(''),
                                            t('vizy', 'Everything is in the toolbar.'),
                                            false,
                                        )}
                                    </div>
                                </div>
                                <div class="vizy-editor-config-group is-preview">
                                    <h4 class="vizy-editor-config-subhead">${t('vizy', 'Toolbar preview')}</h4>
                                    <!--
                                        Toolbar plus a stub of editor body, so the
                                        strip reads as the top of an editor rather
                                        than a row of chips. The stub is decoration
                                        only: it reads as the editor's content, so it
                                        is deliberately outside the drop zone and
                                        offers no landing place.
                                    -->
                                    <div class="vizy-editor-config-editor">
                                        <div class="vizy-editor-config-active" data-builder-list="toolbar-active">
                                            ${this.#listHtml(toolbarItems, t('vizy', 'Drag items here.'))}
                                        </div>
                                        <!--
                                            The selected dropdown, open: a menu belongs under the
                                            trigger it hangs off, and '#alignMenu' puts it there.

                                            Overlaid rather than in the flow, so opening one does
                                            not grow the tinted panel and shove the rest of the
                                            page down. It covers the body stub below, which is
                                            decoration with no text in it, and hangs past the
                                            panel's bottom edge when it is taller than the stub.
                                        -->
                                        ${selectedDropdown !== null ? this.#menuHtml(selectedDropdown) : ''}
                                        <!--
                                            A stub of the editor's body. Decoration only: it
                                            reads as the editor's content rather than its
                                            UI, so it is outside the drop zone.
                                        -->
                                        <div class="vizy-editor-config-canvas"></div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section class="vizy-editor-config-section">
                            <h3>${t('vizy', 'Block insertion')}</h3>
                            <pk-field
                                class="vizy-editor-config-toggle"
                                label="${escapeHtml(t('vizy', 'Show gutter Add button'))}"
                                instructions="${escapeHtml(t('vizy', 'The + chip beside each block. Independent of the toolbar Add Block control.'))}"
                            >
                                <pk-lightswitch
                                    data-gutter-insert
                                    ${this.#state.gutterInsert ? 'checked' : ''}
                                ></pk-lightswitch>
                            </pk-field>
                            <pk-field
                                class="vizy-editor-config-toggle"
                                label="${escapeHtml(t('vizy', 'Enable slash Add shortcut'))}"
                                instructions="${escapeHtml(t('vizy', 'Typing / on a blank line opens the same Add Block palette as the gutter.'))}"
                            >
                                <pk-lightswitch
                                    data-slash-insert
                                    ${this.#state.slashInsert ? 'checked' : ''}
                                ></pk-lightswitch>
                            </pk-field>
                        </section>

                        <section class="vizy-editor-config-section">
                            <h3>${t('vizy', 'Bubble Menu')}</h3>
                            <!--
                                A lightswitch rather than a checkbox, because this
                                switches a whole feature on and off rather than ticking
                                one of a set — the same distinction Craft draws in its
                                own settings screens.

                                The label and instructions belong to the 'pk-field' shell,
                                not to the switch: the shell owns the header, associates it
                                with whatever control it wraps, and gives the instructions
                                somewhere to live. Setting 'label' on the switch as well
                                would name the control twice.
                            -->
                            <pk-field
                                class="vizy-editor-config-toggle"
                                label="${escapeHtml(t('vizy', 'Show a Bubble Menu on selection'))}"
                                instructions="${escapeHtml(t('vizy', 'A small toolbar that appears over selected text, for formatting without reaching for the toolbar.'))}"
                            >
                                <pk-lightswitch
                                    data-bubble-enabled
                                    ${this.#state.bubble.enabled ? 'checked' : ''}
                                ></pk-lightswitch>
                            </pk-field>
                            ${this.#state.bubble.enabled ? `
                                <div class="vizy-editor-config-builder" data-builder="bubble">
                                    <div class="vizy-editor-config-group">
                                        <h4 class="vizy-editor-config-subhead">${t('vizy', 'Available buttons')}</h4>
                                        <div class="vizy-editor-config-available" data-builder-list="bubble-available">
                                            ${this.#listHtml(
                                                this.#bubblePoolItems().map((item) => this.#itemHtml(item, 'bubble', 'available')).join(''),
                                                t('vizy', 'Everything is in the Bubble Menu.'),
                                                false,
                                            )}
                                        </div>
                                    </div>
                                    <div class="vizy-editor-config-group">
                                        <h4 class="vizy-editor-config-subhead">${t('vizy', 'Bubble Menu preview')}</h4>
                                        <div class="vizy-editor-config-active is-bubble" data-builder-list="bubble-active">
                                            ${this.#listHtml(bubbleItems, t('vizy', 'Drag items here.'))}
                                        </div>
                                    </div>
                                </div>
                            ` : ''}
                        </section>

                        ${this.#schemaSectionHtml()}
                    </div>
                ` : `
                    <div class="vizy-editor-config-advanced">
                        <span class="vizy-editor-config-strip-label">${t('vizy', 'Advanced configuration JSON')}</span>
                        <!--
                            The content is not set here. The value attribute maps to the
                            component's defaultValue, which is the reset target rather
                            than what is shown, so the JSON is assigned as a property once
                            the element exists — see below. That also spares us escaping a
                            multi-line JSON document into an attribute.

                            Not wrapped in a label either: the editor is a CodeMirror
                            surface, and a label's click-to-focus fights its own cursor
                            placement.
                        -->
                        <pk-code-editor
                            data-advanced-json
                            language="json"
                            rows="20"
                            ${this.#advancedError ? 'invalid' : ''}
                        ></pk-code-editor>
                        ${this.#advancedError ? `<p class="vizy-editor-config-error">${this.#advancedError}</p>` : ''}
                    </div>
                `}
            </div>
        `;

        // Put the page back where it was, the line above having briefly taken the panel's height
        // out of the document. This panel is most of the page's height, so while the markup is
        // being replaced there is nothing to scroll — and a scroll position past the end of a
        // shorter document is clamped by the browser, not restored when the height returns. Anyone
        // scrolled down far enough was thrown to the top by a click that only meant to open a menu.
        //
        // Cheaper than it looks: the assignment is skipped unless the browser actually moved us,
        // and reading `scrollTop` here forces no layout the swap had not already forced.
        if (scroller && scroller.scrollTop !== pageScroll) scroller.scrollTop = pageScroll;

        host.querySelectorAll<HTMLButtonElement>('[data-mode]').forEach((button) => {
            button.onclick = () => this.#setMode(button.dataset.mode as 'visual' | 'advanced');
        });

        // Remembered rather than acted on: nothing about the panel changes when the section
        // folds, so there is no render to do — only the next one to get right.
        const schema = host.querySelector<HTMLDetailsElement>('[data-schema-details]');
        if (schema) {
            schema.addEventListener('toggle', () => { this.#schemaOpen = schema.open; });
        }

        host.querySelectorAll<PkCheckboxSelect>('[data-capability-group]').forEach((select) => {
            select.addEventListener('pk-change', (event) => {
                // `*` means the All box, so it resolves to every option on offer. The
                // config stores capabilities by name, not a wildcard.
                const { value } = (event as CustomEvent<{ value: string[] | '*' }>).detail;
                const chosen = value === '*' ? select.options.map((option) => option.value) : value;
                const group = select.dataset.capabilityGroup;

                if (group === 'headings') this.#setHeadingLevels(chosen.map(Number));
                else {
                    this.#setCapabilities(
                        group as 'nodes' | 'marks' | 'extensions',
                        chosen,
                        select.options.map((option) => option.value),
                    );
                }
            });
        });

        // `pk-change` rather than `change`: the lightswitch is form-associated, so it
        // carries a hidden checkbox whose own events are its business, not ours.
        const bubbleEnabled = host.querySelector<PkLightswitch>('[data-bubble-enabled]');
        if (bubbleEnabled) {
            bubbleEnabled.addEventListener('pk-change', () => {
                this.#state.bubble.enabled = bubbleEnabled.checked;
                this.render();
            });
        }

        const gutterInsert = host.querySelector<PkLightswitch>('[data-gutter-insert]');
        if (gutterInsert) {
            gutterInsert.addEventListener('pk-change', () => {
                this.#state.gutterInsert = gutterInsert.checked;
                this.render();
            });
        }

        const slashInsert = host.querySelector<PkLightswitch>('[data-slash-insert]');
        if (slashInsert) {
            slashInsert.addEventListener('pk-change', () => {
                this.#state.slashInsert = slashInsert.checked;
                this.render();
            });
        }

        const advancedJson = host.querySelector<PkCodeEditor>('[data-advanced-json]');
        if (advancedJson) {
            // Assigned rather than rendered, because the `value` attribute is the
            // component's reset target and not its content.
            advancedJson.value = this.#advancedJson;
            // Kept in a field rather than read back on submit: the element is replaced on
            // every render, so there may be no editor left to ask by then.
            advancedJson.addEventListener('pk-change', (event) => {
                this.#advancedJson = (event as CustomEvent<{ value: string }>).detail.value;
                // Folded into state and posted as it is typed, so Cmd+S saves what is on
                // screen. Silently, and without a render: `#applyAdvanced` keeps the last
                // parseable state when the text is mid-edit, and re-rendering here would
                // replace the code editor under the author's cursor. A save that is still
                // unparseable is refused at submit, where the error can be shown.
                if (this.#applyAdvanced()) {
                    this.#syncInputs();
                }
            });
        }

        this.#bindItemEvents(host);
        this.#alignMenu(host, menuScroll);
        this.#restoreFocus(host, focused);
        this.#refreshSortables(host);
        this.#syncInputs();
    }

    /**
     * The builder button holding the keyboard, described so it can be found again.
     *
     * By list and position rather than by element, the element being about to be discarded, and
     * rather than by ID alone, since a toolbar may hold several separators — the same reason
     * `#selection` is a position. Anything else focused, including the panel's own inputs, is not
     * ours to restore: those elements survive the render.
     */
    #focusedButton(root: HTMLElement): { list: string; index: number } | null {
        const active = document.activeElement;
        if (!(active instanceof HTMLElement) || !root.contains(active)) return null;

        const button = active.closest<HTMLElement>('[data-toolbar-item]');
        const list = button?.parentElement?.dataset.builderList;
        if (!button || !list) return null;

        return { list, index: [...button.parentElement!.children].indexOf(button) };
    }

    /**
     * Gives the keyboard back to the button that had it.
     *
     * Nothing happens when the position no longer holds a button, which is what a removal looks
     * like from here. Losing focus to the body is the right answer then, there being nothing left
     * to hold it — and `Escape` is the one case with a better answer, which is why it names its own
     * target rather than relying on this.
     *
     * `preventScroll`, because the alternative is a refocus that scrolls the menu back to the row
     * it just restored focus to — which would undo the scroll `#alignMenu` has this moment put
     * back, and jump the page besides.
     */
    #restoreFocus(root: HTMLElement, focused: { list: string; index: number } | null): void {
        if (!focused) return;

        const list = root.querySelector(`[data-builder-list="${focused.list}"]`);
        const button = list?.children[focused.index];
        if (button instanceof HTMLElement && button.matches('[data-toolbar-item]')) {
            button.focus({ preventScroll: true });
        }
    }

    /**
     * Puts the open menu under the trigger it belongs to.
     *
     * The one measurement in this file, and worth being clear about why it is safe when the
     * approach it replaces was not. An earlier revision drew this menu absolutely positioned and
     * re-anchored it as the drag moved, which meant measuring a strip whose buttons were shifting
     * under a reserved slot — it was a whole button adrift whenever it lost the race, and
     * repositioning on every pointer move is what made it a race at all.
     *
     * This reads a resting strip, once per render: a drop clears the selection, so the menu is
     * never open while anything is moving. And it is only ever cosmetic — a wrong answer here
     * slides a menu sideways, it does not misplace a drop.
     *
     * Both offsets are gaps between bounding rects rather than `offsetLeft`, because the elements
     * involved do not share an offset parent: the strip is positioned, so it is its buttons'
     * parent, while the menu's is the editor wrapper. Subtracting rects sidesteps that, and being
     * differences they are immune to where the page happens to be scrolled.
     *
     * `scroll` is where the previous menu had been scrolled to, and it is restored here for the
     * same reason the offsets are set here: this runs after the menu is in the document, so it has
     * a scroll height to be scrolled within. Assigning past the end is harmless — the browser
     * clamps it — which is what should happen when the row that was switched off shortened the
     * menu below where it was.
     */
    #alignMenu(root: HTMLElement, scroll = 0): void {
        const menu = root.querySelector<HTMLElement>('[data-builder-menu]');
        const strip = root.querySelector<HTMLElement>('[data-builder-list="toolbar-active"]');
        if (!menu || !strip) return;

        menu.scrollTop = scroll;

        // Scoped to the strip: the Bubble Menu builder marks a selection the same way, and it has
        // no menu of its own to anchor.
        const trigger = strip.querySelector<HTMLElement>('.vizy-control.is-selected');
        if (!trigger) return;

        const editor = menu.closest<HTMLElement>('.vizy-editor-config-editor');
        if (!editor) return;

        const box = trigger.getBoundingClientRect();
        const bounds = strip.getBoundingClientRect();

        // Down: under the trigger's own row, which is not the same as under the strip once a long
        // toolbar has wrapped onto two lines — the menu should hang off the row it was opened
        // from. The extra pixel overlaps the strip's border, so the menu reads as attached to it.
        //
        // Measured against the editor wrapper by name rather than `offsetParent`, which is the
        // containing block either way but reads as null in a hidden subtree and is not implemented
        // in jsdom at all.
        const top = box.bottom - editor.getBoundingClientRect().top - 1;

        // Across: clamped, so a dropdown near the right-hand end of a long toolbar does not push a
        // 250px menu off the edge of the panel.
        const from = box.left - bounds.left;
        const room = Math.max(0, strip.clientWidth - menu.offsetWidth);

        menu.style.insetBlockStart = `${top}px`;
        menu.style.insetInlineStart = `${Math.max(0, Math.min(from, room))}px`;
    }
}

if (!customElements.get('vizy-editor-config-settings')) {
    customElements.define('vizy-editor-config-settings', VizyEditorConfigSettingsElement);
}

declare global {
    interface HTMLElementTagNameMap {
        'vizy-editor-config-settings': VizyEditorConfigSettingsElement;
    }
}
