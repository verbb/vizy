export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

export interface CanonicalNode {
    type: string;
    attrs?: Record<string, JsonValue>;
    content?: CanonicalNode[];
    marks?: Array<{ type: string; attrs?: Record<string, JsonValue> }>;
    text?: string;
    [key: string]: unknown;
}

export interface VizyBlockAttrs {
    blockUid: string;
    blockTypeUid: string;
    enabled: boolean;
    fieldSlots: Record<string, JsonValue>;
    /** Grandfathered Matrix-in-Block; Entries live on MatrixAnchor. */
    matrixAnchorUid?: string | null;
}

export interface BlockTypeManifest {
    fieldSlotKinds?: Record<string, 'hosted' | 'matrix'>;
    uid: string;
    name: string;
    handle: string;
    fieldLayoutUid?: string | null;
    fieldLayoutHash?: string | null;
    /** Optional `#rrggbb` accent for authoring UI. */
    color?: string | null;
    /** Configured Block Type icon SVG only — omit/null when unset (no icon fallback). */
    iconSvg?: string | null;
    /** Relative path under the plugin preview-images folder. */
    previewImage?: string | null;
    /** CP action URL for the preview image, when resolvable. */
    previewImageUrl?: string | null;
    summary?: {
        titlePlacementUid?: string | null;
        subtitlePlacementUid?: string | null;
        mediaPlacementUid?: string | null;
    };
    summaryInference?: {
        titlePlacementUids: string[];
        subtitlePlacementUids: string[];
        mediaPlacementUids: string[];
    };
    /** Craft layout tab names — stable before lazy FieldLayout render. */
    layoutTabLabels?: string[];
}

export interface LayoutPresetManifest {
    id: string;
    label: string;
    spans: number[];
    accessibleLabel?: string;
}

export interface InsertionItemManifest {
    id: string;
    kind: 'block' | 'node' | 'transform';
    label: string;
    description: string | null;
    icon: { name: string; svg?: string | null; color?: string | null } | null;
    /** CP action URL when the Block Type has a resolvable preview image. */
    previewImageUrl?: string | null;
    group: string;
    keywords: string[];
    aliases: string[];
    order: number;
    surfaces: Array<'slash' | 'inline' | 'empty' | 'browse' | 'keyboard'>;
    requiresInput: boolean;
    blockTypeUid?: string;
    nodeName?: string;
}

export interface EditorManifest {
    manifestVersion: number;
    uid: string;
    revision: string;
    hash: string;
    registryRevision: string;
    schemaRevision: string;
    enabledNodes: string[];
    enabledMarks: string[];
    internalNodes: string[];
    modules: string[];
    /**
     * The heading levels this config allows, and part of the schema rather than of the toolbar:
     * TipTap builds Heading's parse rules from this list, so a level left out is one a pasted
     * document cannot smuggle in. Empty when headings are not allowed at all.
     *
     * Optional because a browser can be holding a manifest cached before this existed, and the
     * fallback for that is every level — the behaviour of every build up to now, and the
     * conservative direction to be wrong in.
     */
    headingLevels?: number[];
    toolbar?: ToolbarManifest;
    bubble?: BubbleManifest;
    /**
     * Outset gutter `+` chip. Optional for older manifests — missing means enabled.
     * Independent of toolbar `addBlock` placement.
     */
    gutterInsert?: boolean;
    /**
     * Blank-line `/` Add Block shortcut. Optional for older manifests — missing means enabled.
     */
    slashInsert?: boolean;
    field: {
        fieldUid: string;
        /** Craft field handle — used for per-field localStorage preferences. */
        fieldHandle?: string;
        rootContentType: 'rich' | 'blocks';
        blockTypePickerGroups: Array<{
            name: string;
            blockTypeUids: string[];
            disabledBlockTypeUids: string[];
        }>;
        /** Permission/validation surface: every referenced type, disabled included. */
        allowedBlockTypeUids: string[];
        /** Insertion surface: referenced types minus field-locally disabled ones. */
        insertableBlockTypeUids: string[];
        minBlocks: number | null;
        maxBlocks: number | null;
        pasteAsPlainText?: boolean;
        /**
         * When true, Block ⋯ → Delete prompts before removing. Optional for
         * older manifests — missing means false (no prompt).
         */
        confirmBlockDeletion?: boolean;
        /**
         * Max consecutive same Block Type nesting. Optional for
         * manifests cached before this field existed — client falls back to 3.
         */
        sameBlockTypeMaxDepth?: number;
    };
    blockTypes: Record<string, BlockTypeManifest>;
    insertionItems: InsertionItemManifest[];
    layoutPresets?: LayoutPresetManifest[];
}

/**
 * What a control does when it is chosen.
 *
 * A button and a menu option are the same thing wearing different appearance, so both
 * carry an action and both are run through one table (`runToolbarAction`). Before
 * this, the toolbar held two hardcoded command ladders — one for buttons, one for
 * the Formatting dropdown's options — which is why `bulletList` worked as a button
 * and could not have worked inside a menu.
 *
 * The server names the command; the client owns the mapping to a TipTap chain. A
 * command the client does not know is skipped rather than rendered dead, so an
 * older field asset cannot be made to render a button it cannot honour.
 */
export type ToolbarActionManifest =
    /** A block wrapper that can be turned on and off, such as a list or a quote. */
    | { command: 'toggleNode'; nodeName: string }
    /** A block that is placed rather than toggled, such as a table or a rule. */
    | { command: 'insertNode'; nodeName: string }
    | { command: 'toggleMark'; markName: string }
    | { command: 'setParagraph' }
    | { command: 'setHeading'; level: number }
    /** Not a plain mark toggle: it collects a URL first. */
    | { command: 'setLink' }
    /**
     * Actions on the selection, with no capability behind them. Alignment writes an
     * attribute onto the current block; history is a schema mechanic rather than
     * content at all. See `EditorConfigPresentation::ACTIONS`.
     */
    | { command: 'setTextAlign'; align: string }
    | { command: 'clearFormatting' }
    | { command: 'undo' }
    | { command: 'redo' }
    /** Wraps the selection in columns, which is not the same as placing a layout. */
    | { command: 'wrapInLayout' }
    /**
     * Opens the shared Vizy Block insertion palette (field allowlist). Not a TipTap
     * chain command — handled by the toolbar → InsertionOverlay path.
     */
    | { command: 'openAddBlock' }
    /**
     * Third-party behaviour extension: PHP has no TipTap command; Craft.Vizy.registerControl
     * must supply the runner. Without a registration the control is treated as not actionable.
     */
    | { command: 'registeredControl' }
    /**
     * Editing the table around the cursor: rows, columns, cells and headers.
     *
     * One command carrying the operation rather than twelve of them, because they are
     * uniform — each is a nullary TipTap command that acts on the selection — and there is
     * nothing per-operation for the manifest to say.
     */
    | { command: 'tableOperation'; operation: TableOperation };

/** The table operations a toolbar may offer, matching Vizy 3's Table dropdown. */
export type TableOperation =
    | 'addColumnBefore'
    | 'addColumnAfter'
    | 'deleteColumn'
    | 'addRowBefore'
    | 'addRowAfter'
    | 'deleteRow'
    | 'mergeCells'
    | 'splitCell'
    | 'toggleHeaderRow'
    | 'toggleHeaderColumn'
    | 'toggleHeaderCell'
    | 'deleteTable';

export interface ToolbarControlManifest {
    id: string;
    /**
     * `group` is a control whose `items` open as a menu and which has no action of
     * its own. `presentation` is presentation, currently only `separator`.
     */
    kind: 'mark' | 'node' | 'group' | 'presentation' | 'action' | 'extension';
    label: string;
    /** Inline SVG resolved server-side from the bundled icon catalog. */
    icon?: string | null;
    /**
     * A short text glyph for a control the icon catalog cannot serve, such as "H3" —
     * Font Awesome's free set has no H4 to H6, and text is what Vizy 3 drew anyway. It
     * stands in for the icon while `label` stays the full accessible name.
     */
    abbr?: string | null;
    presentation?: string;
    /** Absent on `group` and `presentation` controls, which do nothing themselves. */
    action?: ToolbarActionManifest;
    /**
     * Menu contents, present only on a `group`. One level deep: a group's items are
     * ordinary controls, and a control that is itself a group is rejected server-side.
     */
    items?: ToolbarControlManifest[];
    /**
     * Styling hint for a menu option that previews what it applies, as Vizy 3 did:
     * heading options show their size, Quote is italic, Code block is monospace.
     */
    preview?: string;
}

export interface ToolbarManifest {
    controls: ToolbarControlManifest[];
}

export interface BubbleManifest {
    enabled?: boolean;
    controls: ToolbarControlManifest[];
}

export interface HostedVizyContext {
    depth: number;
    /** Vizy field placed on the Entry — FieldLayout auth root. */
    entryFieldUid: string;
    /** Immediate parent Vizy (may itself be hosted at depth 2+). */
    parentFieldUid: string;
    blockUid: string;
    placementUid: string;
    nestedFieldUid: string;
}

/** Craft element link picker row — matches Plugin Kit `LinkOptionSchemaItem`. */
export type VizyBootstrapLinkOption = {
    optionTitle: string;
    elementType: string;
    refHandle: string;
    sources?: string[];
    criteria?: Record<string, unknown>;
};

export interface FinalizationResult {
    finalizationStatus: 'complete' | 'pending' | 'failed';
    finalizationErrors?: readonly { code?: string; message?: string }[];
    finalizationDeferredReason?: string | null;
    retryToken?: string | null;
}

export interface EditorBootstrap {
    document: CanonicalNode;
    manifest: EditorManifest;
    editorContextToken: string;
    finalization?: FinalizationResult;
    /** Real server-rendered FieldLayout forms for Blocks already in the document. */
    initialFieldLayouts?: InitialFieldLayoutEntry[];
    /**
     * Present when this editor is a Hosted Vizy Editor inside a Block FieldLayout.
     * Nested editors skip ElementEditor root registration and flush into parent fieldSlots.
     */
    hosted?: HostedVizyContext;
    /**
     * Craft element link options for the toolbar Link menu (entry/asset/category).
     * Built per owner element at inputHtml time — not part of the cached manifest.
     */
    linkOptions?: VizyBootstrapLinkOption[];
    /** Owner element site id for Craft element selector defaultSiteId. */
    elementSiteId?: number;
    /** Asset picker volumes / transforms for Image authoring. */
    imageAuthoring?: {
        volumes: string[];
        transforms: Array<{ handle: string; name: string }>;
        defaultTransform: string;
        defaultSource: string | null;
    };
    /**
     * uid → preview for Image nodes in this document (canonical has no `src`).
     * Hydrated into the session preview cache before TipTap paints NodeViews.
     */
    imagePreviews?: Record<string, {
        assetId: number;
        url: string;
        label: string;
        transform?: string;
    }>;
}

export interface FieldMetadata {
    fieldLayoutElementUid: string;
    fieldUid: string;
    fieldHandle: string;
    fieldType: string;
    adapterId: string;
    wrapperId: string;
    /** Present for grandfathered Matrix placements when an anchor is resolved. */
    matrixAnchorUid?: string;
}

export interface FieldLayoutResponse {
    requestId: string;
    documentRevision: number;
    blockHash: string;
    blockUid: string;
    blockTypeUid: string;
    fieldLayoutUid: string;
    fieldLayoutHash: string;
    hostNamespace: string;
    html: string;
    headHtml: string;
    bodyHtml: string;
    fields: FieldMetadata[];
    /** Craft layout tab names in designer order; shown only when length ≥ 2. */
    tabLabels: string[];
    ok?: true;
}

/** Bootstrap / batch entry when PHP could not render a Block FieldLayout. */
export interface FieldLayoutFailure {
    ok: false;
    blockUid: string;
    blockTypeUid?: string;
    error: string;
    message?: string | null;
    fieldHandle?: string;
    fieldType?: string;
    fieldName?: string;
    fieldTypeLabel?: string;
    placementUid?: string;
    detail?: string;
}

export type InitialFieldLayoutEntry = FieldLayoutResponse | FieldLayoutFailure;

declare global {
    interface Window {
        Craft?: {
            systemUid?: string;
            t?: (category: string, message: string, params?: Record<string, unknown>) => string;
            CpScreenSlideout?: new (action: string, settings?: Record<string, unknown>) => {
                on: (event: string, handler: (ev: any) => void) => void;
            };
            actionUrl?: (action: string) => string;
            sendActionRequest?: <T>(
                method: string,
                action: string,
                config: { data?: unknown; headers?: Record<string, string>; signal?: AbortSignal },
            ) => Promise<{ data: T }>;
            appendHeadHtml?: (html: string) => void;
            appendBodyHtml?: (html: string) => void;
            initUiElements?: (container: HTMLElement) => void;
            getLocalStorage?: (key: string, fallback?: unknown) => unknown;
            setLocalStorage?: (key: string, value: unknown) => void;
            createElementSelectorModal?: (
                elementType: string,
                options: {
                    storageKey: string;
                    sources?: string[];
                    criteria?: Record<string, unknown>;
                    defaultSiteId?: number;
                    defaultSource?: string | null;
                    multiSelect?: boolean;
                    /** Craft AssetSelectorModal: `{ handle, name }[]` enables Select transform. */
                    transforms?: Array<{ handle: string; name: string }>;
                    autoFocusSearchBox?: boolean;
                    onSelect: (
                        elements: Array<{
                            id?: number;
                            siteId?: number;
                            label?: string;
                            url?: string;
                            uid?: string;
                            $element?: { data?: (key: string) => unknown; attr?: (key: string) => string | undefined };
                        }>,
                        transform?: string,
                    ) => void;
                    closeOtherModals?: boolean;
                },
            ) => void;
            sites?: Array<{ id?: number; uid?: string; name?: string }>;
            AssetImageEditor?: new (assetId: number, settings: Record<string, unknown>) => unknown;
            isImagick?: boolean;
            Vizy?: Record<string, unknown>;
        };
        $?: (value: unknown) => {
            data(key: string): unknown;
            data(key: string, value: unknown): unknown;
            on(event: string, handler: (event: unknown) => void): void;
            off(event: string, handler: (event: unknown) => void): void;
        };
    }
}
