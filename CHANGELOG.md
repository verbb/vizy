## Unreleased

### Added
- Added a raw content API for inspecting and migrating embedded field values, with captured placement identities, dry runs, explicit replacements and caller-owned transactions. Supports composition with Hyper’s content API.

### Changed
- Align documentation filenames with page titles and update internal links.
- Block reads now return enabled blocks by default; pass `false` for disabled blocks or `null` for both states. Query filters preserve the enabled scope unless explicitly changed, including in GraphQL. Templates relying on unfiltered reads must request both states.
- Updated documentation for field setup, block templates, insertion controls, and query behaviour, with a shared Limitations page and explicit GraphQL document, node, mark, and block field references.
- Block Type **Icon** and **Preview Image** settings use Plugin Kit’s `pk-image-browser` (`mode=icon` / `mode=image`, `label-mode=tooltip`) via a thin `vizy-image-browser` Craft-serialize bridge. Replaces the bespoke `vizy-icon-picker` panel and autosuggest-only preview path. Preview images still store portable filesystem paths under **Block Preview Images Path**. Requires `@verbb/plugin-kit-web` 2.0.16+.
- Normalize CP General Settings to the shared `verbb-base` settings layout (`pageTabs` / `pageTitle` / `pageAction` helpers; existing Settings → Plugins → Vizy crumbs retained).
- **Multisite Hosted merge** recurses into nested Vizy envelopes so site-
  translated fields inside a nontranslated Hosted placement keep target-local
  values (structure still follows the source site).
- **Owner content migrator** is checkpoint-first (`persisting` before Craft
  save). `resume()` recovers when live content already matches the candidate,
  or retries a stuck `persisting` write.
- GraphQL docs clarify `raw` / HTML as trusted escape hatches under schema
  access; image transforms remain preview-oriented.

### Fixed
- Fixed Initial Rows having no effect on editor height.
- Fixed Plain Text Paste retaining clipboard formatting when enabled.
- Fixed an empty Available Volumes selection showing all available image sources.
- Fixed repeated placements of the same Vizy field mixing editor save responses, rejecting unchanged content, and sharing upload recovery state.
- Fixed failed file uploads being hidden after saving or reopening content, with an upload retry that preserves unsaved edits.
- Fixed required Vizy fields accepting blank paragraphs as content.
- Fixed the Block menu’s Move down action leaving the Block in its original position.
- Fixed structured custom field values losing their keys when edited inside Blocks.
- Fixed Block field tabs and loading errors appearing on the wrong editor when the same content is open more than once.
- Fixed Matrix content in Blocks remaining active or orphaned when deleting non-entry elements.
- Fixed Matrix content in Blocks being lost when restoring deleted entries or cancelling entry deletion, and orphaned Matrix content remaining after permanent deletion.
- Fixed Block fields failing to load when deeply nested Vizy fields contain tables or other structured rich text.
- Fixed autosave updates moving the text cursor and disrupting undo history.
- Fixed unsaved Block field values being lost during copy, cut, and undo, or appearing already saved.
- Fixed undoing a Block deletion leaving its fields detached from the editor.
- Fixed copying or duplicating Blocks with nested rich text producing content that could not be saved.
- Fixed Block field loading and save status updates failing after an editor remained open for an hour.
- Fixed save status updates missing when Craft creates a provisional draft during autosave.
- Fixed unchanged Block fields triggering repeated autosaves after server normalization.
- Fixed Block fields loading for deleted entries or removed nested field placements.
- Fixed compound node queries combining or excluding distinct blocks that share the same node type.
- Fixed authorization bypass vulnerabilities.
- Fixed asset finalization reporting failures when an editor retained existing assets without upload permissions.
- Fixed raw content migrations retaining the old JSON object shape when replacing a field value with an array.
- Fixed raw content migrations leaving stale validation baselines after committing changes in the same process.
- Fixed Block fields failing to load when their values exceeded an internal request-size limit.
- Fixed Vizy 3 upgrades dropping image links and their link classes.
- Fixed Vizy 3 schema promotion rejecting unchanged Block Types with template paths containing slashes.
- Fixed Vizy 3 upgrades rejecting content that uses a disabled Block Type. Existing Blocks remain editable while the type stays unavailable for insertion.
- Fixed Block Types being deletable while still referenced by a Vizy field’s picker configuration.
- Fixed edits to existing Matrix rows being lost when their Block had an empty field-value map.
- Fixed Vizy 3 upgrades failing checksum verification when a site's empty Matrix block omitted an existing anchor reference.
- Fixed Vizy 3 editor config upgrades dropping the strikethrough toolbar button and formatting capability.
- Fixed simultaneously opened Block field layouts sometimes making separate requests when their hashes finished at different times.
- Fixed large or deeply nested documents failing to open or save because clipboard limits were applied to ordinary editor content, and supported nested content failing to paste.
- Fixed Block field layouts failing to load when field values contain URLs or mixed-case, numeric, or non-ASCII object keys.
- Fixed a cross-site scripting vulnerability.
- Fixed a moderate-severity cross-site scripting vulnerability in Tiptap ([GHSA-cp6q-959q-f8rh](https://github.com/advisories/GHSA-cp6q-959q-f8rh)).
- Fixed a high-severity denial-of-service vulnerability in Tiptap ([GHSA-j95f-988m-3j2f](https://github.com/advisories/GHSA-j95f-988m-3j2f)).
- Fixed repeated element links and images performing redundant lookups during document rendering.
- Fixed iframe previews reloading when their URL had not changed.
- Fixed wrapping selected text or multiple paragraphs into layouts producing invalid content or failing to wrap.
- Fixed refreshed image previews not updating existing editor images until their content changed.
- Fixed clearing image preview transforms leaving the previous transform visible, and image-editor refreshes discarding required URL parameters.
- Fixed delayed image transform responses replacing previews for a newer selection or another image.
- Fixed link dialogs removing text formatting and losing email, telephone, and SMS destinations when updating links.
- Fixed image updates losing semantic links, site selection, and alternative-text settings.
- Fixed empty-paragraph trimming producing invalid nested lists and empty structural containers.
- Fixed an information disclosure vulnerability.
- Fixed Matrix content isolation when saving, publishing, copying, and restoring drafts and revisions.
- Fixed Block action menus failing to reopen during a previous close animation.
- Excluded development dependencies, test output, and environment files from release archives.
- **Normalize leaf Blocks:** leftover TipTap `content` on `vizyBlock` (pre-leaf /
  Content Area-era children) is stripped in `DocumentUpgrader` instead of throwing
  on CP open / `normalizeValue`. Hosted nesting remains `fieldSlots` only; retired
  root `vizySlot` still rejects.
- **Field compatibility (A15):** Neo blocklist uses real `benf\neo\Field`
  (plus legacy `verbb\neo\fields\Neo` alias). `FieldLifecycle` exposes
  `canMountInBlock` / `requiresPersistedBlockOwner`,
  `EVENT_CLASSIFY_FIELD`, and `registerPersistedNestedOwnerClass()`. Field
  layout designer filtering uses the same policy (not a second Neo/ST list).
- **Ephemeral Block characterization** asserts null Craft element ids and
  rejects reintroduction of Vizy 3 `$block->id = rand()` (obsolete source
  probe removed).
- **Editor Config settings** registers the current builder translation
  strings (behaviour extensions, gutter/slash insertion, updated schema copy).
- **Browser harness:** default mock FieldLayout success; FieldLayout failure
  chrome uses `div` (not `p`) so ProseMirror queries stay unambiguous.
- **Save acknowledgement dirty baseline** compares in canonical-projection
  space after accept (raw TipTap JSON no longer leaves `isDirty` stuck).
- **DocumentWalk** is the shared TipTap + Hosted Vizy traversal (opaque
  fieldSlots stay opaque). Identity copy, Asset discovery, and Matrix sync use
  it so nested Hosted Blocks are no longer skipped.
- **Identity copy (PHP/TS)** regenerates Hosted Block/layout UIDs, clears
  `matrixAnchorUid`, and remaps flushed Craft 5 Matrix payloads to new entry
  UIDs so copies do not share Matrix ownership or entry rows. PHP owner
  duplication materializes Matrix content from the source anchor when blobs
  were already stripped. Copying follows field placements and preserves unrelated
  custom-field JSON even when it resembles Hosted or Matrix content.
- **Matrix persistence** runs through Craft’s database serialization hook only.
  General field serialization remains free of writes, and save acknowledgements
  use the snapshot actually persisted.
- **Block duplicate** flushes mounted Craft fields before snapshotting and
  re-resolves the insert position by Block UID after FieldLayout prefetch.
- **FieldLayoutLoader** coalesces only equivalent revision/hash requests; a
  newer document revision starts a replacement instead of returning a stale
  in-flight promise.
- **Renderer Block cache paths** use canonical TipTap location paths (and unique
  fragment prefixes for per-node `html`) so layout columns and reversed
  GraphQL node renders no longer collide on `render.{index}`.
- **GraphQL `ArrayType`** coerces object/list/null literals and variables to PHP
  values; `serialize()` still returns a JSON string (documented envelope shape).
- **Field slot legacy JSON decode** is limited to structured Craft field types
  (Link, Checkboxes, MultiSelect, Table, relations) — Plain Text that looks like
  JSON stays a string.
- **Extension render events** trigger once through Yii inheritance (no double
  base-class dispatch). Image custom emit runs `modifyTagStructure`.
- **Semantic Image/Link output:** `attrs.link` wraps the image; `size` maps to
  `vizy-image--*`; decorative `alt=""` is preserved; fixed `siteMode`/`siteUid`
  governs element URL resolution. Editor transform remains preview-only unless
  a legacy transform handle is already persisted.
- **Emit attribute names** are restricted to safe HTML name tokens before any
  tag helper (Yii encodes values, not names). Malformed keys that break out of
  attribute syntax are dropped at emit time; lossless storage stays separate.
- **MatrixAnchor lookup** resolves only by the authorized ownership tuple
  (`parentOwnerId` + `vizyFieldId` + `blockInstanceId`). A supplied
  `matrixAnchorUid` must match that row or resolution fails closed — no
  UID-only retargeting across owners/fields/blocks.
- **Block validation** applies allowed Block Type and Craft field validation to
  every TipTap-located Block, including layout → column children. Root min/max
  and `rootContentType` remain root-only.
- **GraphQL Image `asset` and Link `element`/`url`** resolve through schema-aware
  projection (`GqlElementAccess`). Convenience fields return null when the active
  schema cannot query the target volume/section/category group. Trusted Twig
  link resolution is unchanged.

### Removed
- Removed `Content::modifyFieldContent()`; integrations should use the new content API.

## 4.0.0-beta.1

### Added
- **Structural GraphQL (beta-1).** `VizyDocument` exposes typed nodes
  (`VizyParagraph`, `VizyLayout` / `VizyColumn`, …), generated Block Type objects
  with Craft fields, Image `asset`, Link `element`/`url`, plus `nodes` /
  `blocks` `where`/`limit`/`orderBy` (same spirit as Twig `query()`). Escape
  hatches: `raw`, `renderedHtml`. Per-node `html` on `VizyNodeInterface` (same
  Renderer emit path as document HTML). See `docs/developers/graphql.md`.
- **Search keyword enrichment.** Element search indexes TipTap text plus Image
  `alt` / Asset title+filename and Link mark string values; Hosted nested Vizy
  recurses through searchable Block FieldLayout fields (Vizy 3 nested behaviour).
- **Editor Config insertion chrome.** `gutterInsert` and `slashInsert` (default
  on) toggle the outset gutter `+` chip and blank-line `/` Add Block shortcut
  independently of toolbar `addBlock` placement.
- **Third-party TipTap modules (beta-1).** Register capabilities via
  `Extensions::EVENT_REGISTER_EXTENSIONS` and CP factories via
  `Craft.Vizy.registerModule` / `replaceModule` / `registerControl`, with shared
  `Craft.Vizy.tiptap.core` and `tiptap.pm.*`. Editor Config enables marks/nodes
  and toolbar placement — no Vizy 3 `plugins[]` / `Craft.Vizy.Config`. Overview:
  `docs/template-guides/extending-vizy.md`; Abbreviation walkthrough:
  `docs/guides/developers/creating-a-custom-mark-from-scratch.md`. Sample module:
  `examples/vizy-abbr-module/`. Guides under `docs/guides/developers/` rewritten
  for Vizy 4.
- **Third-party catalogue metadata.** Extension definitions may set `icon` (inline
  SVG or glyph name), `surfaces` (`toolbar` / `bubble`), optional `controlId`
  and `group`. Your own **nodes** appear in the toolbar catalogue without a core
  allowlist entry. Pure TipTap behaviour modules use `kind: 'extension'` and
  Editor Config `capabilities.extensions`.
- **Third-party slash / insertion registration.** `Craft.Vizy.registerInsertion`
  merges custom palette rows into slash / gutter / Browse (Vizy 3
  `registerCommands` replacement). Enabled installed custom **nodes** are also
  listed automatically in the insertion manifest.
- **Migration fixture promote + verify (§8.6).** `migration-tests/vizy-4`
  `./promote` / `./upgrade` run schema promotion, owner jobs from
  `seed-map.json`, and write `verify-report.json` (multi-site + Neo/Super Table
  corpus included).

- **Ship-risk automated gates (§6).** Hosted `vizy.hosted` adapter fold +
  Playwright nested flush; toolbar Layout → preset chooser; table contextual
  dropdown; embed/iframe dialog + chip; renderer block-template / iframe /
  mediaEmbed smoke; PK Escape/outside checklist; browser ship-risk checklist
  (live Craft CP remains release hygiene).
- **Feature Tour pages** for Editor Configs, Blocks & Block Types, Rich Text,
  Layout & Columns, and Nested Vizy; Developers **Extensibility** (supported vs
  deferred). Sidebar aligned to the beta docs IA.
- **Upgrading From v3** docs (`docs/get-started/upgrading-from-v3.md`) covering
  schema promotion, confirmation phrase, status/resume, owner migrator, and
  common diagnostics.
- **Operator-facing migration console copy.** `vizy/migrations/*` prints stage
  labels, confirmation guidance, and `nextStep` summaries before JSON output
  (`PromotionOperatorMessages`).

- **Hosted Vizy Editors:** Vizy fields may be placed on Block Type FieldLayouts again as nested editors with their own Editor Config. Nested docs store as structured objects in the parent Block `fieldSlots` (not JSON strings); mount in the Block FieldLayout host; dirty/save folds into the outer Vizy field. Max hosted depth = **5** (testing; Entry field = 0).
- Field setting **Confirm Block Deletion** (`confirmBlockDeletion`): when on, Block ⋯ → Delete prompts before removing. **Off by default** — Delete is already an explicit menu action.
- Block Type **Preview Image**: optional relative path under plugin setting **Block Preview Images Path** (`blockPreviewImagesPath`, default `@webroot/vizy-block-previews/`). Autosuggest from that folder (png/jpg/webp/gif); stored in Project Config for portability — not a Craft asset. CP streams files via `vizy/block-previews/view`.
- **Add Block** list/grid: list stays flat + group headings in `pk-popup` (with hover preview when a preview URL exists); grid opens `pk-dialog` with All/group tabs and cards. Preference remembered in `localStorage` per Craft field handle.
- **Add Block** toolbar action (`addBlock`) is placeable in Editor Config (default toolbars lead with it). Opens the Blocks-only insertion palette; not a roster-editable dropdown — Block Types come from the field allowlist. Hidden at runtime when the field has no insertable Block Types.

- Undo and redo. The editor had no history extension at all, so neither the keyboard shortcuts nor a button had anything behind them; both are now available, with `undo` and `redo` toolbar buttons.
- Text alignment, applying to paragraphs and headings, which are the two the front end renders an alignment class for. Pressing the alignment already in force clears it. Offered as the four members of an Alignment dropdown rather than as the four buttons Vizy 3 had: one property with four mutually exclusive values is a radio group, and drawing it as four separate squares is drawing four checkboxes. Craft's own CKEditor toolbar builder makes the same call, offering `alignment` and none of the individual items CKEditor provides.
- A `clearFormatting` toolbar button, which drops the selection's marks and returns it to plain paragraphs.
- Heading levels `heading1` through `heading6`, held individually by the Formatting dropdown, where each is a row of its own that can be switched off like any other member. Which levels a config allows is chosen under `Content schema` alongside every other content type, and a level it disallows renders nowhere however a toolbar names it — an H1 pasted into a config that disallows level 1 becomes a paragraph.
- Clicking an item already in the toolbar builder selects it rather than removing it: a dropdown opens as the menu it will be, and a plain button is simply marked, which is what says where `Delete` will land. A click could not go on removing once a dropdown needed a way to be opened, since one gesture cannot both mean "take this away" and "show me what is in this".
- `Delete` and `Backspace` remove the focused item in the toolbar builder, so a toolbar can be built and emptied from the keyboard in one keystroke each.
- `layout` is available as a toolbar button, wrapping the selection in columns. It has been an installed, author-configurable capability since it shipped and was missing from the toolbar palette only by omission.
- Toolbar dropdowns: Formatting, Table and Alignment. Each is a named unit with its own glyph, dragged in from the same `Available items` palette as the buttons and told apart by the chevron it draws with. A toolbar names one as `dropdown:formatting`. A family earns a dropdown by being either the mutually exclusive values of one property — Formatting's block types, Alignment's four — or operations on one object, as Table's are. A Lists dropdown was tried and dropped for failing that test: a bulleted list and a numbered list are two independent toggles, not two values of one setting, so grouping them turned one click into two to save a single square. `bulletList` and `orderedList` are buttons, as in Vizy 3, TinyMCE and Craft's CKEditor builder.
- A config can trim and reorder what a dropdown holds, which is Vizy 3's `formatting` and `table` options generalised to every dropdown. Select a dropdown in the toolbar builder and it opens as the menu it will be, drawn from the editor's own stylesheet — so each row previews the style it applies, a Heading 2 at Heading 2's size, and members the content schema disallows are left out exactly as the editor will leave them out — a default config, allowing H2–H4, shows a six-row Formatting menu rather than nine rows with three greyed out. Clicking a row switches it off where it sits, struck through, and clicking it again switches it back on; dragging reorders, and the menu holds its scroll position so switching off three of nine rows does not mean finding your place again twice. Dragging the dropdown out of the toolbar and back in returns it to its registration, a placed dropdown owning its own membership. Stored as a `dropdowns` map keyed by dropdown name, alongside `toolbar`, so the JSON reads `"dropdowns": {"formatting": ["heading2", "heading3", "paragraph"]}` — Vizy 3's `"formatting": ["h2", "h3", "p"]` in Vizy 4's vocabulary. A dropdown holds a *fixed* roster registered by Vizy or a plugin, so a config can only ever subtract from it: what a menu of four alignments may contain is a design decision, and the case for editing it is always Justify coming out rather than a fifth item going in. A dropdown a config has never trimmed keeps following its registration and picks up members later releases add to it, and the capabilities prune it further, so a dropdown can only render less than it names.
- A dropdown owns its members outright: a control is offered as a button or as a menu row, never both. So Paragraph, the six heading levels, Quote, Code block, the four alignments and the thirteen table operations are not toolbar buttons, and a toolbar naming one drops it on load rather than refusing to open — which is how a migrated Vizy 3 toolbar naming `h2` or `align-left` arrives. Vizy 3 mostly agreed already: its thirteen table operations existed only inside `table`, exactly as here; headings and alignment are where this differs. Both forms were offered for a while, with a rule that took a family's buttons out of the palette once its menu was placed — which fired silently, at a distance, and in one direction only, so placing the four alignments *first* left the Alignment dropdown still on offer and a toolbar could carry every alignment command twice. Nothing needs hiding now, because nothing is offered twice, and the buttons palette is about twenty squares shorter.
- `Extensions::EVENT_REGISTER_TOOLBAR_DROPDOWNS`, for adding a dropdown to that set or replacing one. Naming a dropdown, choosing its glyph and deciding what goes in it are developer acts, as registering a custom button already is, so both arrive the same way and the server stays the authority on what a toolbar may contain.
- The icon picker reveals the rest of a set as its results are scrolled, so all of Font Awesome can be browsed rather than only the first 48 of each group. Its icons are drawn large enough to tell apart, in a taller, wider panel.
- The toolbar may name a button whose capability is switched off. It is marked as such in the builder and simply does not render in the editor, rather than being deleted from the toolbar.
- `paragraph` needs no capability — prose always permits paragraphs — so the Formatting menu always has at least that one row, whatever the content schema disallows.
- The last three buttons Vizy 3 offered — `html`, `iframe` and `mediaEmbed` — can be placed on a toolbar and are saved with it, so a Vizy 3 toolbar can be reproduced in full in one pass. The editing behind them is not built yet, so they are faded and named "(not available yet)" in the builder and do not render in the editor; they will start working where they sit as each lands. Vizy 3's own glyph is used for each.
- Editor Config visual builder in CP: allowed content, toolbar drag-and-drop, bubble menu configuration, and Advanced JSON tab with round-trip editing.
- Inline Block Configuration UI in Vizy field settings: groups/block tiles, per-block editor panel with Field Layout designer, and global Block Type persistence from the field form.
- Verbb CP asset bundle on Vizy plugin settings pages (subnav styling and footer credit).
- W28 layout interaction: preset chooser popover, gutter drag/keyboard resize, column reorder, wrap/unwrap commands with Vitest coverage (`layout-interaction.test.ts`).
- W30–32 semantic client nodes: canonical link/image/table extensions, sanitization on save, toolbar/bubble wiring (`semantic-nodes.test.ts`).
- **CP product shell (M1):** Vizy CP nav with Block Types index/edit (Field Layout designer, Content Areas, duplicate/delete), Editor Configs index/edit, field settings links to manage/create global Block Types, removed stale Vue `field/input.html`.
- Workshop 22 Command / Insertion Registry: PHP `insertionItems` manifest slice, per-editor `InsertionRegistry` (`query` / `execute`), context factory, availability/search helpers, and generic block/node executors wired into `<vizy-editor>`.
- Workshop 23 insertion UI slice 1: shared `vizy-insertion-list` component and slash command extension consuming the registry (`buildContext`, stale container checks, trigger-range removal on execute).
- Workshop 23 insertion UI complete: `InsertionOverlay` with contextual empty state, inline `+` boundaries, shared popover, and Browse All dialog — all registry-backed with one-choice direct insertion for explicit empty/`+` actions.
- Workshop 24 Block Summary API: `BlockSummaries` service with batch `getSummaries()`, deterministic placement/inference projection from raw slots, provider event registry, Block Type `summary` PC config, type presentation for Browse All, and 100/500 Block performance gates (zero Block Elements).
- Bundles A–H pending-gates follow-up: toolbar/bubble DOM, layout column resize commands, semantic link/image/table PHP validation, 500-block summary projection gate, Playwright authoring-ui flows, basic a11y roles on block/slot/structure.
- Vitest W22 gate suite (`insertion-registry.test.ts`), W23 gate suite (`insertion-ui.test.ts`), and PHP insertion manifest gates (`InsertionRegistryGateTest.php`).
- Icon picker for Block Type icons, with searchable Font Awesome and custom icon sets from the Icons Path setting.
- Per-block-type availability switch in Vizy field settings, so a block type can stay in a group without being offered to authors.
- Block type reordering in Vizy field settings, including dragging block types between groups, and group reordering and renaming. Dragging is keyboard accessible, animates rows out of the way, and is constrained to the configurator so a row cannot be dragged off across the control panel.
- Vizy field settings block picker is a combobox that both searches existing global block types and creates a new one, seeded with whatever name was typed. It presents as a button, with the search field inside the popover.

- Immutable canonical Vizy document runtime with recursive UID traversal, strict parsing, lazy id-null Craft Block projections, and explicit Vizy 3 schema mapping.
- Global Project Config-backed Block Types and Content Areas with synchronized runtime records, schema validation, cycle detection, and duplication support.
- Internal atomic document mutation primitives plus deterministic Vizy 3 schema-promotion analysis and Project Config provenance maps.
- Version-aware field lifecycle inventory, post-commit Asset upload batches, and UID-addressed multisite document overlays.
- Dry-run nested Vizy and Matrix analyzers/transformers with deterministic identity and verification.
- Durable per-owner migration checkpoints with exact source snapshots, deterministic replay, real-owner persistence, reload verification, and analyze/apply/status/resume console operations.
- Resumable ordered Vizy 3 Project Config promotion with durable stage records and explicit analyze/dry-run/apply/status/resume console operations.
- Read-only live MatrixAnchor Entry loading for verified Matrix-to-Content-Area owner migration.
- Renderer-backed Vizy document deprecation shims for the intentionally retained Vizy 3 APIs.
- PHP-authoritative Extension Registry, named Project Config Editor Configs, and deterministic per-field editor manifests for the Phase 4 prerequisite gate.
- Trusted persisted-content baselines for save-time Editor Config allowed-content validation, plus a golden Workshop 17 manifest contract fixture.
- Canonical TypeScript/TipTap 3 editor runtime with direct Lit Block and Content Area NodeViews, UID-owned lazy Craft FieldLayout hosts, typed one-value field transport, and opaque unknown-content preservation.
- Signed, permission-checked lazy FieldLayout rendering with revision, Block hash, FieldLayout UID, and deterministic layout-hash guards.
- Structured save acknowledgements and signed, snapshot-bound Asset finalization retry responses for matching Craft element JSON requests.

### Changed
- Updated documentation for field setup, block templates, insertion controls, and query behaviour, with a shared Limitations page.
- **Extensions type system.** Partners register TipTap-shaped PHP classes on
  `RegisterExtensionsEvent::$marks` / `$nodes` / `$extensions` (e.g.
  `$event->marks[] = Abbr::class`). Types own `id()` / `moduleId()`, catalogue
  `surfaces()` / `icon()` / `group()`, and HTML via `tag()` / `resolveAttrs()` /
  class-level modify events — not public `'strategy' => 'markTag'` arrays.
  Default render uses statics (no `Craft::createObject` per bold span). Link
  refs resolve through `RefTags` + `Link::resolveAttrs`. Sample:
  `examples/vizy-abbr-module/`. Mark-heavy Pest gate (500 spans, zero Bold
  createObject) plus perf budget profile (2000 spans). Partner docs scrubbed of
  public render-strategy wording.
- **NodeCollection removed.** Field values are `VizyDocument` only. Document
  HTML goes through `Renderer` + type statics. Prose serialize shaping
  (`trimEmptyParagraphs`, listItem/table cell content guards, mediaEmbed JSON
  safety) lives on `DocumentSerializer`. `VizyDocument::isEmpty()`, `query()`,
  and `all()` are first-class (Vizy 3 query consumer API via `VizyNodeQuery` +
  `VizyContentNode` / `VizyBlock` projections). `getField` / `getRawNodes` /
  `renderHtml` / `renderStaticHtml` remain Vizy 4 deprecation shims.
  `services\Nodes` is a deprecation husk for old register listeners; instance
  Node/Mark HTML methods warn via `deprecations/` traits through Vizy 4.
- **Upgrade write confirmation** also gates owner `--apply` / `resume` (same
  `PROMOTE VIZY 3` phrase as schema promotion apply/resume).

- **Default Editor Config toolbar.** New configs no longer include a separator
  between Formatting and Bold/Italic/Link.

- **Docs honesty (surgical).** Field Settings / Block-Based Editor / Template
  Guides / Events / Node Collection / Extending Vizy call out Vizy 4
  `VizyDocument` + `render()`, quarantined events, and parked Vizy 3 plugin
  recipes — without a wholesale page rewrite.

- **Orphan `services\Service`.** Vizy 3 `fieldData` layout-sync helper and
  `getService()` accessor removed. Block layouts are owned by
  `services\BlockTypes` / Project Config `vizy.blockTypes`.
- **Vizy 3 typed GraphQL tree removed, then replaced.** Unregistered the Vizy 3
  `NodeCollection` / `VizyNode_*` generators. Beta-1 ships a structural
  `VizyDocument` GraphQL MVP (concrete nodes, Block Craft fields,
  `nodes(where/limit/orderBy)`); see Added above and
  `docs/developers/graphql.md`.
- **Content Areas retired.** Nested composition is **Hosted Vizy Editors** only. Removed `vizySlot` / Content Area FieldLayout elements, Content library bucket in the Block Type designer, Content Area allowlists/cycles, Nested Vizy→CA and Matrix→CA migrators, and CA destinations in FieldLayout prefetch. `vizyBlock` is a TipTap leaf (empty/omitted content); nesting lives in Hosted `fieldSlots`.

- **Nested Vizy runtime convert hardened.** Hosted `FieldSlotValues` pre-normalizes
  nested Vizy via the nested field’s provenance; `DocumentSerializer` fail-closes
  if a Hosted slot does not become a `VizyDocument` (no re-persisting V3 lists).
  Pest proves bare-list / JSON-list → canonical object, Hosted depth-1 auth HTML,
  and max-depth refusal (`HostedVizyNestedConvertTest`).
- **Matrix-in-Block grandfather.** Existing Matrix placements on Block Types
  remain editable via MatrixAnchor on the canonical mount/serialize path
  (`FieldLifecycle::MATRIX_ANCHOR`: can serialize, cannot newly place). V3
  `matrixAnchorUid` converts into canonical Block attrs; schema promotion
  informs instead of blocking; designer / New-field menus still forbid Matrix.
- **Inline manual Editor Config minting.** Vizy 3 “Enter a custom config” fields
  promote through a dedicated `editorConfigs` stage: fingerprint + dedupe against
  existing PC/file configs, mint a Project Config Editor Config when
  `allowAdminChanges` is on, and retarget the field. File-backed `config/vizy/*`
  refs are unchanged.
- **Vizy 3 toolbar token shim.** `h2` / `align-left` / `bullet-list` / … rewrite to
  Vizy 4 IDs on Editor Config normalize with Craft Deprecator logs
  (`deprecations\VizyToolbarTokenDeprecations`). Not a forever dual vocabulary.
- **Nested Vizy allow + runtime convert.** Schema promotion no longer fail-closes
  nested Vizy placements; outer document convert passes nested bare lists through
  for Hosted normalize on load (no bulk entry rewrite).
- **Leaf owner migration is map-only.** `OwnerContentMigrator` converts bare Vizy 3
  root lists with `{ revision, schemaMap }` (schemaMap from the mapping or field
  provenance). Nested Vizy → Content Area and Matrix → Content Area mapping keys
  stay retired/fail-closed. Already-canonical `doc` values re-parse without
  re-convert.
- **Extensions → Renderer is the canonical HTML path.** Core marks/nodes are
  TipTap-shaped PHP classes; `VizyDocument::render()` dispatches through
  `services\Renderer` + type statics (`tag()`, `resolveAttrs()`,
  `renderOccurrenceHtml()`). Layout/column emit semantic wrappers
  (`vizy-layout` / `vizy-column`). Image types resolve semantic `assetUid` to a
  URL on render. `services\Nodes` is a deprecation husk only.
- Plugin version **`4.0.0-beta.1`**; Craft plugin `schemaVersion` **`1.0.0`**
  (document JSON `attrs.schemaVersion` remains `2`).
- **Vizy 3 field extensibility APIs quarantined.** `EVENT_DEFINE_VIZY_CONFIG`,
  `EVENT_REGISTER_PLUGINS`, and `registerPlugin()` live on deprecation traits
  (config event never fires; `registerPlugin()` no-ops with a Deprecator log).
  `base\Plugin` / plugin events are deprecated for Vizy 5. Legacy
  `fieldData` / `vizyConfig` / inline-config accessors moved to
  `VizyFieldLegacySettingsDeprecations` for migration tooling only. Unused
  `blockTypeBehaviour` dropped. `isValueEmpty()` uses `VizyDocument::isEmpty()`.
- **`EVENT_MODIFY_PURIFIER_CONFIG` quarantined.** Whole-document / field HTML
  Purifier on normalize stays out. The event constant lives on
  `deprecations\VizyFieldPurifierDeprecations` and never fires;
  `ModifyPurifierConfigEvent` is deprecated for Vizy 5. Emit-time hardening
  uses `helpers\SafeHtml` (see Fixed).
- **Toolbar Layout opens the preset chooser.** Clicking Layout with a caret
  (or wrapable selection) shows the same column presets as slash/gutter
  Layout, then inserts or wraps. Inside a layout the control still unwraps.
- **Table dropdown is contextual.** Outside a table the menu shows **Insert
  table** only (label fixed — was ambiguous “Table”). Inside a table it shows
  structure ops (rows/columns/merge/headers/delete). Default roster order
  matches Vizy 3. No separate table bubble.
- **Whole-document HTML source toolbar retired.** The pending Vizy 3 `html`
  button is no longer placeable; stored configs drop it on normalize (same as
  other retired toolbar tokens). Schema round-trips cannot keep arbitrary
  attributes, so source editing is not offered. Media Embed / iFrame remain.
- **Media Embed and iFrame authoring enabled.** Toolbar buttons are no longer
  pending: enable the node capabilities, place the buttons, and insert via a
  Vizy 3–style URL `pk-dialog` (Edit · Delete chip on selection). YouTube/Vimeo
  Media Embeds get trusted iframe HTML; unknown URLs store as a safe card/link.
- Image authoring: toolbar Image opens Craft’s asset selector (optional
  transform for preview), then an Insert/Edit `pk-dialog` (alt, title, link,
  size). Persists semantic attrs (`assetUid`, not `src`). Selected
  images show a chip (Image Editor · Edit · Delete); Image Editor uses
  `Craft.AssetImageEditor`. Asset Select passes full `{handle,name}` transform
  objects so Craft shows **Select transform**; after Select, `vizy/assets/info`
  resolves `assetUid` (Craft’s selector does not return uid) so the Insert
  dialog opens. Editor bootstrap includes `imagePreviews` (uid → thumb URL)
  so save/reload paints images without a session-only cache miss.
- Link authoring: toolbar Link is a Plugin Kit–style menu (Craft element
  options when available, Insert/Edit Link, Unlink). Insert/Update uses
  `pk-dialog` (URL, Text, Open in new tab) instead of `window.prompt`. Reuses
  `@verbb/plugin-kit-tiptap-core/links` helpers; applies Vizy semantic link
  marks, not TipTap `href`. Element picks prefer Craft `uid` →
  `targetUid`. Caret in a link shows a Formie-style chip (preview · Edit ·
  Unlink) via `pk-popup`; formatting bubble stays separate.
- Gutter `+` is hidden when `insertableBlockTypeUids` is empty (Rich Text Only /
  no Block Types), matching toolbar Add Block. Previously Rich Text Only could
  still show a chip because anchors keyed off `allowedBlockTypeUids` and the
  overlay invented a target from row geometry.
- Editor prose/table CSS uses `@scope (.ProseMirror) to (vizy-block)` so
  list/heading/table rules no longer paint Craft FieldLayout chrome (e.g.
  Assets/Entries chip bullets) inside Blocks. Nested Hosted editors keep their
  own writing-surface scope.
- Craft **Link** fields on Blocks use a typed `craft.link` adapter (active type
  + `[value]` → `{type, value}`). ElementSelect chips with `name="null"` no
  longer poison `craft.generic` unwrap, which had cleared Link slots on save
  while Entries/Assets (typed relation adapters) still persisted.
- Prefetched FieldLayouts for new Blocks wait until the field host is in the
  document (microtask + rAF) before running Craft instance scripts. Mounting
  mid-NodeView construction previously failed as “field host was not in the
  document” and stayed failed because eager remount skips `failed` hosts.
- Initial Block FieldLayout bootstrap buffers Craft `registerScript()` tags
  (CKEditor `type=module`) alongside `registerJs()`. Modules were leaking onto
  the entry page, running before the Block textarea existed, and throwing
  `editor-missing-sourceelement`.
- Dismissible FieldLayout Tip/Warning UI elements work inside Blocks: mount
  applies `dismissedTips` localStorage and wires `.tip-dismiss-btn` (ElementEditor
  only bound tips present at form boot; Tip.php hide scripts do not run via
  `innerHTML`).
- Craft **JSON** fields on Blocks use a typed `craft.json` adapter (parse
  textarea → structured `fieldSlots` value) and PHP hydrates legacy string
  slots via `normalizeValueFromRequest`. Stops after-save display of
  `"{ \"test\" : \"www\" }"` from double encoding.
- `craft.generic` duplicate form names **last-win** (PHP POST semantics).
  Craft Date+Time posts `locale` twice (date.twig + time.twig); promoting to
  `string[]` crashed `DateTimeHelper::getLocaleById` on Block validate/save.
  PHP also collapses poisoned `locale`/`timezone` arrays when hydrating
  fieldSlots onto Block elements.
- Block FieldLayout render clears any inherited Craft View namespace (Entry
  `fields`) so Selectize/AssetSelectInput script ids match the mounted HTML
  (`vizyHost-…`, not `fields-vizyHost-…`). Fixes Selectize `$wrapper` TypeError
  on Complex Blocks in the CP.
- Block FieldLayout mount runs Craft field-instance `bodyHtml` synchronously
  while the host is in the document (no `Craft.appendBodyHtml` queue). Fixes
  Selectize `onChange` throwing `$wrapper` of undefined when `$('#id')` missed
  the Block host.
- Block Type FieldLayouts use a **nested-owner blocklist** (Matrix, Content
  Block, Addresses, Neo, Super Table) instead of an allowlist of inventoried
  Craft fields. Third-party fields are allowed by default as pure JSON values.
  Blocked types are hidden from the FLD library and New-field type menu; save
  errors explain the nested-elements limitation in plain language.
- Hosted nested field rings are depth-first: only the innermost owning
  `vizy-editor` paints the Craft-style frame / Block selection outline. Ancestor
  `:focus-within` no longer stacks concentric blue borders (same ownership idea
  as sticky toolbars and nested gutter `+`).
- Hosted Vizy bootstrap now has one canonical inline payload; removed the duplicate instance-JS fallback. Local CP profiles dropped nested-entry HTML transfer by about 43% (three-editor chain: 442 KB → 254 KB; five-editor sample: 583 KB → 331 KB) while preserving zero FieldLayout requests on reload. Performance gates now cover linear 10-sibling PHP payload growth and 10 hosted browser editors booting with zero FieldLayout requests.
- Field toolbar sticky pin offsets under Craft’s fixed entry header (`--header-height`) so formatting controls stay visible while scrolling long entries (was stuck at `top: 0` and hidden under Preview/Save). This closes mid-document formatting proximity for long entries.
- Slash `/` is blank-line only (empty paragraph): consumes `/` and opens the same Blocks-only Add Block palette as gutter `+` (in-panel Search; list/grid preference). Mid-sentence `/` and `/` before existing text stay literal. Not a prose-node command palette.
- Standing toolbar no longer focuses the editor (or paints field focus ring) when the editor was unfocused — Formatting menus, mark/node buttons, and **Add Block** only reclaim focus if ProseMirror already had it. Toolbar **Add Block** always autofocuses its Search field; field-focus hold stays warm-only. Trigger-toggle and outside dismiss do not restore editor focus. Field ring keys off writing-surface `:focus-within` (or `data-has-focus`), not toolbar/`pk-dropdown-menu` focus.
- Toolbar **Add Block**, gutter `+`, and slash `/` are Blocks-only (shared palette). Prose nodes stay on the formatting toolbar / typing.
- Field toolbar controls are 32×32 (dropdown / Add Block triggers stay wider for the chevron); Editor Config builder preview matches.
- Gutter `+` and toolbar **Add Block** both use Plugin Kit `pk-icon` `plus` (hand-rolled gutter SVG removed).
- Gutter `+` chip is 24×24 with a 20px plus (was 20×20 / 16px).
- Add Block insertion palette matches Formatting (`pk-dropdown-menu`): `--pk-shadow-popup` ring+shadow, `pk-radius-md`, scale+fade enter/exit (named hide keyframes so dismiss is not aborted by enter-cancel `animationend`); toolbar trigger paints open via `aria-expanded`.
- Insertion list select runs the insert handler before palette `onClose` so the session context stays available when committing a click.
- Editor Config toolbar builder: white panel background (was tinted blue-grey); **Add Block** draws as + with chevron (same opener appearance as Formatting / Alignment).
- Layout column resize gutters removed from authoring UI (preset spans stay fixed; drag/keyboard resize was buggy). Dotted column wells unchanged; Layout toolbar still unwraps.
- Selection bubble controls are 26×28 with 14px glyphs (field toolbar stays 32×32 / 16px).
- Layout authoring UI matches the minimal column-well look: no Layout header / Col N:X/12 strip, no outer dashed frame, and no resize gutters. Dotted borders sit on each column (white wells). The Layout toolbar control unwraps when the caret is already inside a layout.
- Layout preset chooser uses column language: Two / Three / Four columns, plus 60/40 and 40/60 (replacing 50/50, 33/67, 67/33, Thirds, Quarters). Colored span previews unchanged. Single column is not offered — layouts still require 2–4 columns.
- Block ⋯ menu: Insert before/after replaced with Matrix-style **Add Block above**. One allowed type inserts immediately (`Add {Name} above`); several opens the shared insertion list. Duplicate remains the same-type clone.
- Block Collapse/Expand moved into the ⋯ menu beside Duplicate (header chevron removed; double-click header still toggles).
- Removed the Block Type “Editor Representation” setting (Compact / Structured / Visual / Structural). It was speculative planning UI with no shipped UX; all project Block Types use the same authoring card. Legacy Project Config `representation` keys are ignored on load and dropped on the next save.
- Block Types may set an optional accent colour via Plugin Kit’s `pk-color-input`. The colour tints Block header while authoring, washes field-settings rows (background only), and colours insertion-list icons. A configured Block Type icon also appears beside the type label in the Block header (Matrix parity). Slideout saves post colour through a light-DOM hidden input (`vizy-color-input`) so Craft’s jQuery serialize picks it up (same pattern as the icon picker).

- Completely empty rich Content Areas now show a light, transient “Write, or type ‘/’ for commands…” placeholder so nested writing surfaces are discoverable without adding text to the document or dirtying the field.
- Block FieldLayouts now render through one ordered, Hyper-inset surface. Craft field runs are stable keyed ProseMirror widget decorations between Content Area NodeViews, replacing the separate leading host and per-Content-Area field shells.
- Block Type icons are optional. Field settings rows and the insertion menu render the shared `vizy-block-fallback` `<pk-icon>` when no icon is configured; configured icons still use their catalog SVG.
- New Block Types start with an empty “Content” layout tab (Craft Entry Type parity). No Content Area or fields are pre-seeded.
- Block Type layout designer Add/New Tab controls work in the field-settings slideout; designer JS now registers during namespaced slideout render so selectors match the layout markup.
- Field settings “Add Group” now prompts for the group name up front (same native prompt as rename) instead of inserting a default “Blocks” group to edit afterward.
- New Vizy fields start with an empty block configuration; add a group when you are ready instead of clearing a default “Blocks” group.
- Empty block type groups in field settings now show a fixed-height drop zone with muted background copy instead of a row-shaped placeholder; dragging onto an empty group lands on the zone at index 0 rather than above or below a stand-in row.
- Dragging the last block type out of a group now keeps that group’s drop zone reserved for the duration of the drag. The zone registers on drag start (hidden while the row is still present) and appears as soon as the row leaves, so the gray panel never collapses to zero height mid-gesture. Empty-group drops are decided by a pointer hit test against the whole group card; the empty stand-in is visual only (not a Sortable), so cross-group moves into empty groups commit cleanly without above/below insertion slots or breaking within-group reorders.
- Fixed a 1–2px list jump when dragging the first block type row or dropping onto index 0; row hairlines now use flex gap instead of `:first-child` border exemptions that dnd-kit’s drag placeholder disturbed.
- Block type rows in field settings now sit on white (`#fff`) cards over a `--gray-050` list panel, matching Craft’s surface hierarchy.
- Field settings Editor Config instructions are shorter; the manage link is unchanged.
- Block Type edit screen: shortened Icon and Layout instruction copy.

- Editor headings use Vizy 3 typography: regular weight, `#212529`, rem scale (H1 2rem → H6 1rem), H1 letter-spacing, no uppercase H6. Formatting menu previews match weight/colour. Sibling block rhythm uses `0.75rem` (not `em`) so large headings do not inflate the gap above them.
- In-block Craft fields match Hyper’s real layout: stacked label-above-input (not an inline label column), and Craft FLD widths (`width-25`/`50`/`75`) via `@container vizy-block`.
- Nested authoring borders (Card, header seam, Content Area, in-block Craft inputs) use `--vizy-border` from the field shell — same token as the outer frame. Retired separate `--vizy-block-border` (`#cdd8e4`).
- Blocks-only Content Areas no longer paint a full-width `--vizy-panel` wash (`oneTypeBlocks`); they match rich Content AreUI. Treatment remains behavioural only.
- Block ⋯ menu: icons on every action (`pk-icon` / Font Awesome) and separators between insert, duplicate, move, enable/disable, and delete. Delete uses `xmark` (not trash). New glyphs `arrows-up-to-line`, `arrows-down-to-line`, and `ban` registered for insert/disable.
- Authoring UI menus/popovers migrated to Plugin Kit: Block ⋯ and toolbar Formatting/Alignment/Table use `pk-dropdown-menu`; gutter `+` and slash share one `pk-popup` + filterable insertion list (in-panel `Search…`, autofocus; slash no longer filters via typing after `/`); layout presets and icon picker panel use `pk-popup`. Insertion items ship Font Awesome / toolbar SVGs when available (Plugin Kit icons as fallback). Gutter palette dismisses on editor clicks without refocusing the `+` (avoids click-retarget reopen) and toggles closed on a second `+` press. Editor Config dropdown preview uses Plugin Kit `sm` menu UI (editable roster); `dropdown-menu.css` removed.
- Empty-state overlay and Browse All dialog removed from authoring. Empty blocks containers insert via gutter `+` (sole boundary); rich stays typing-first with `/` and `+`. Slot UI may still show diagnostic messages only (unresolved / max / no types).
- Editor field focus ring is one frame on `.vizy-editor-body` (Craft-style `border-color` + `--pk-input-focus-shadow` on focus). Toolbar and surface no longer draw their own outer borders — the toolbar/surface seam stays a neutral divider. Toolbar is sticky-ready (`position: sticky`, `--vizy-toolbar-sticky-top`).
- Insertion picker (`vizy-insertion-list`) is slightly denser (TipTap Notion-demo row/icon rhythm); still bespoke, not Plugin Kit `pk-dropdown-menu`.
- Block header drag handle matches Hyper: no hover wash, `cursor: move` (grabbing while active), and tighter header right padding so it sits closer to the frame edge. Block type labels are non-selectable; double-clicking header controls (outside action buttons) toggles collapse. Collapsed blocks clip their white preview to the host radius (`overflow: hidden`, briefly `visible` while the ⋯ menu is open).
- Production insertion uses the `outset` gutter with accent fill: a 20×20 3px-radius focus-blue chip and SVG plus icon at rest (no box-shadow), darkening slightly on hover. Gutter `+` controls sit on each row (vertically centred on the block) and always insert after that row. Typing hides the gutter chip until the pointer moves again (TipTap drag-handle pattern). Leaving the writing surface clears the chip (it no longer reappears from stale pointer coords while the field stays focused). Open Block ⋯ menus and pointer-over header controls also suppress the gutter so the chip does not chase the cursor through the menu. Gutter hit-testing uses midpoint bands between rows (so heading margins count) and treats Content Area labels as part of the first row’s band; slot lookup crosses shadow roots. Nested Content Areas use the same outset chip on the framed region's left edge, with editor off-white (`--vizy-editor-bg`) and inner `0.75rem 1rem` prose padding matching the root surface (host keeps its `0.75rem` field-aligned inset) so they read as mini writing surfaces rather than Craft text inputs.
- Authoring toolbar restored to Vizy 2 look: white raised strip with shadow over a `#fbfcfe` writing surface; toolbar border (including the bottom edge) uses the same Plugin Kit input border token as the editor frame. Controls are 32×34px again. Dropdown triggers use a Plugin Kit chevron SVG with a 4px gap to the main glyph. The editor frame uses Plugin Kit input border color and radius so it lines up with Craft text fields beside it. Toolbar tooltips no longer leave a blank band under the button row. Block headers and in-block Craft fields share one inline label column (`--vizy-block-label-width`, `#667c92`, 12px / 500) with the control beside the label; Content Area labels sit above their editable region. Block body vertical padding is symmetric and owned by the body shell only — Content Areas and Craft fields carry horizontal inset, not extra top/bottom padding.
- Block types with no Craft field layout no longer trigger field-layout fetch or show a "Retry fields" affordance in block header.

- A `hardBreak` toolbar button, Vizy 3's `line-break`. The node has always been installed and its client extension always loaded; it was missing from the palette because it is always enabled and so has no capability to be listed under.
- `textStyle` is no longer offered as a toolbar or Bubble Menu button. It carries a colour or a font rather than toggling, so there was no state for the button to switch and Vizy 3 offered none — ticking Text style drew a button that looked live and did nothing. It remains a capability, since it is what other features hang their attributes on.
- The icon picker no longer marks the icon already in use. It was ringed in `--primary-color`, red in a default Craft install, which read as an error against a grid of otherwise identical glyphs — and the chosen icon is already shown at size beside its name on the trigger that opens the panel. The state is announced to assistive technology instead.
- The Editor Config screen leads with the Toolbar, and the `Capabilities` section is now `Content schema`, collapsed, and last. It is the advanced half of the screen and most configs want it left alone, while nearly every visit is about which buttons to offer — and having it first made buttons look missing when their content type was merely unticked. The new name says what the checkboxes are (the nodes and marks the schema is built from), and its summary line states how many of the available content types are allowed, so a narrowed schema is visible without unfolding it.
- An Editor Config's heading levels now govern the content, not just the menus. The levels were only ever consulted when building the toolbar, so unticking H1 removed the button while an `<h1>` pasted from Word was still accepted and saved. The allowed levels are now part of the schema the editor is built from — a disallowed heading arrives as a paragraph instead — and a heading at a disallowed level is reported at save like any other content type the config does not allow, with content that already contained one left untouched. A config allowing no levels allows no headings, which the screen has always said and nothing enforced.
- The Toolbar instructions are one sentence: `Drag toolbar items into the editor.` They had reached five, a clause at a time, as the builder gained behaviours to explain — which is a paragraph of rules above a panel whose whole point is that it can be experimented with. What went is either shown on contact or found by trying, both of which a live preview does better than prose.
- A highlight in the toolbar builder means one thing: this dropdown is open. Clicking a plain button no longer marks it. The mark was there to say where `Delete` would land, but `Delete` has always acted on the button holding the keyboard, which the focus ring says already — so on screen were two marks claiming to be the target, only one of them right. A placed dropdown now also reports `aria-expanded`, in place of an `aria-current` that every placed item carried.
- An open dropdown menu in the toolbar builder closes on a click anywhere else, or on `Escape`, as a menu should. Clicking the dropdown again still closes it, but being the only way to made it feel stuck — nothing else on the page asks you to go back and click the thing you opened. Clicks inside the menu are exempt, switching several rows off in one visit being the point of it. `Escape` hands the keyboard back to the dropdown it closed, and the builders now keep focus on the button that had it across a re-render at all — previously every edit stranded a keyboard author on the page body, so switching off three rows of a menu meant tabbing back into it three times.
- The cursor no longer flickers while the pointer moves over an Editor Config toolbar builder. Each button asked for a grab cursor and the 4px gaps between them did not, so crossing a row of nineteen changed the cursor thirty-eight times, and a hand not quite still over a gap changed it continuously — plainest in Chrome, a twitch in Firefox. The trays now carry the same cursor as the buttons in them, so there is no boundary within one to change at. The hover bridge belonging to the buttons' tooltips is also taken out of the hit test, which was not the cause but did leave a band above each button reporting the tooltip rather than the panel.
- The toolbar builder offers buttons and dropdowns in one `Available items` palette, sequenced by what belongs together: `Formatting`, inline formatting, `Link`, `Alignment`, the two list types, what can be inserted including `Table`, then undo, redo and clear formatting, and last the ones Vizy has yet to build. It followed assembly order before, which meant the marks came out in registration order and the nodes alphabetically — so `Bulleted list` and `Numbered list`, about the most reliable pair on any toolbar, sat four squares apart with `Image` and `Layout` between them. The sequence is the one CKEditor's default toolbar, TinyMCE's and the palette in Craft's own CKEditor plugin all broadly share. Dropdowns had a labelled palette of their own for a while, which was worth it only while they wore the same square as a button and could not be told apart; they draw with a chevron now, and being on their own shelf in registration order meant the palette could state only the part of that sequence that happened to be buttons. Anything registered by a plugin sorts after all of these rather than being guessed into a position it was never written for.
- The Editor Config toolbar palette is two lists, `Available buttons` and `Available dropdowns`, rather than one list mixing them. Buttons and dropdowns are placed the same way but are not the same kind of thing, and one list left a dropdown looking like a button that happened to open.
- The Alignment dropdown is named `alignment` rather than `align`, so its name and its label agree as every other dropdown's do. A config naming `dropdown:align` is loaded as `dropdown:alignment`, membership and all.
- Heading levels are chosen under `Content schema` rather than in a `Headings` section of their own. Six levels are six content types, governing pasted and imported content exactly as Quote and Code block do, so they belong with every other answer to what an editor may contain — and a bespoke section next to the schema implied they were a toolbar setting instead.

- Hover hints in the Editor Config builder now wait for the pointer to settle. A toolbar is a row of adjacent buttons, so moving across it fired a hint for each one in turn and the popup chased the cursor, taking the cursor style with it — which is what showed up as a flicker while moving quickly over the toolbar.
- Fixed the dashed drop placeholder never appearing when dragging a button into the Editor Config toolbar. The placeholder is a copy of the button being dragged, and it was being copied after that button had been collapsed out of its own row — so it inherited the collapse, and was drawn invisible and zero-width. It was present in the toolbar at the correct position the whole time, reserving no space and showing nothing.
- Dropping one toolbar button onto another no longer combines them into a dropdown; a dropdown is a palette item you drag in. Combining meant a release over a button had two possible outcomes, and with 36px buttons sitting flush, the zone for "into this" covered most of each one — leaving a narrow channel between neighbours in which the dashed drop placeholder appeared, so placing an item became a matter of luck. There is now one outcome per pointer position.
- An Editor Config's `vocabulary` is now called `capabilities`, which is what the Extension Registry and Vizy's own validation messages already call the nodes and marks an editor understands. `content` was considered and rejected: Vizy uses that word for document content throughout — Content Areas, content types, the stored document itself — so `content:` sitting beside `toolbar:` in a config read like the editor's contents rather than what it is permitted to contain. The post params the settings screen sends are `capabilityNodes` and `capabilityMarks`, and the Advanced JSON tab reads and writes `capabilities`.
- The editor toolbar and Bubble Menu now render as icon buttons, matching Vizy 3, rather than text labels. Icons come from the icon set Vizy already bundles, so custom node and mark registrations can be given a glyph.
- The Formatting toolbar item is a working dropdown containing Paragraph, the editor config’s enabled heading levels, and its enabled block transforms. Each option previews the style it applies.
- The Editor Config editor’s toolbar and bubble menu are shown as they will appear in the editor — real icons, real controls — instead of a list of text chips. Toolbar items can be dragged to reorder, and a toolbar may contain more than one separator.
- The Editor Config toolbar and Bubble Menu builders now work like CKEditor’s: available items and toolbar items are the same outlined icon buttons, the available ones muted, in one tinted panel. Items are dragged between the two, and dragging one out of the toolbar removes it, so the per-item “×” badges are gone. Clicking still adds and removes for keyboard and pointer users.
- Dragging in those builders is now handled by dnd-kit rather than native HTML5 drag, so the item is carried under the pointer, neighbours slide out of the way, and a dashed slot is held open at the position where it will land.
- Picking an item up from the available list now takes it straight out of that list instead of offering to rearrange it there. The available list has no order of its own, so only the toolbar reacts while you drag a new item in.
- The toolbar is now the only drop target in those builders, as it is in Craft’s CKEditor toolbar builder. Releasing an item anywhere outside the toolbar removes it — there is no longer any need to aim at the available list to get rid of a button. Dragging a *new* item out and releasing it outside the toolbar abandons the add instead, so a half-finished gesture leaves nothing behind.
- Dragged items are no longer pinned inside the builder panel, so they follow the pointer instead of sticking at its edges.
- The empty space after the last item in the toolbar is now a drop target, so an item can be added to the end by dropping it anywhere in that space rather than having to aim at the last button.
- Editor Config builder items are filled rather than outlined, following Craft’s CKEditor toolbar builder. An outline around every item made a toolbar look like a grid of boxes instead of a row of controls.
- Separators in those builders carry the same fill as the buttons, so they read as an item you can pick up rather than a gap where one has gone missing.
- Available items in those builders are no longer faded. They read as “disabled” when dimmed, when they are simply not in use yet, and they are the same buttons wherever they sit.
- Each half of those builders is now headed “Available buttons” and “Toolbar preview” (or “Bubble Menu preview”), since the two halves are otherwise drawn identically. CKEditor labels neither.
- The Editor Config toolbar is now drawn as the top of an editor rather than a strip on its own: the toolbar is raised over a slice of editor body whose side rules run down out of it and fade into the panel, as Craft’s CKEditor toolbar builder does. That body is part of the drop zone, so releasing an item just below the toolbar adds it instead of discarding it. The Bubble Menu keeps its floating-popover preview.
- Toolbar and Bubble Menu items no longer carry a `title`, because the native tooltip popped up at the cursor and covered the neighbouring buttons — worst of all mid-drag. Items are named for assistive technology via `aria-label`, and hovering one now shows a tooltip above the button, clear of the row, which is dismissed as soon as you press to drag.
- The item being dragged in the builders is now carried down-right of the pointer, so the cursor no longer sits on top of the icon being placed.
- Separator items in the builders are wider, so they can actually be grabbed and dragged.
- The Editor Config editor’s “Vocabulary” section is now “Capabilities”, split into “Blocks and objects” and “Inline formatting”, with an explanation that it governs pasted and imported content as well as the toolbar. The heading matches the config key, so the screen and the project config use one word for one idea.
- Capabilities are listed by author-facing name (“Bulleted list”, “Quote”, “Strikethrough”) rather than internal TipTap names (`bulletList`, `blockquote`, `strike`). Custom node and mark registrations may supply their own label.
- Headings are enabled from the Headings section rather than a separate checkbox, and the section’s levels appear only when headings are allowed.
- Paragraph and Line break are no longer listed as allowed content. Prose always permits both, so they were toggles that could not meaningfully be turned off.
- Editor Configs can now be created in the control panel, starting from the standard config's allowed content.
- Vizy field settings replaces “Root Content Type” with Vizy 3’s “Editor Mode” (Blocks & Rich Text, Rich Text Only, Blocks Only). Switching modes preserves the configured block types, so it is reversible.
- Vizy field settings no longer edits global Block Types inline. Creating or editing one opens a separate slideout, and the field settings refresh in place without losing unsaved changes.
- Block Types are edited through one Craft CP screen, shared by the standalone settings page and the field settings slideout.
- Block type rows in field settings are stacked full width, matching the single-column authoring experience, rather than a three-across tile grid.
- Vizy field settings is built from Plugin Kit components (combobox, dropdown menu, lightswitch, input, button, icon) so it matches other Verbb plugins and the Craft design system.
- Block type group headers show the name as a label, with rename, reorder and delete in a single overflow menu, matching Craft’s Matrix entry type groups. The group and block type overflow menus share one shape and iconography.
- Each block type row carries its own overflow menu (edit, reorder, delete), replacing the bare remove button.
- Clicking a block type row opens its editor directly, so field settings no longer needs a detail pane beside the list.
- Block type reordering in field settings uses dnd-kit rather than native HTML5 drag events, matching Hyper. Drag is locked to the vertical axis and to the configurator, rows shift out of the way as you drag, and an emptied group remains a valid drop target.
- Links to manage global block types and editor configs moved into the relevant field instructions.
- Restored the Vizy 3 instructions text across Vizy field settings and the Block Type editor.
- Block Types and Editor Configs moved under plugin settings (`vizy/settings/block-types`, `vizy/settings/editor-configs`), since they are admin-only project schema rather than user-facing screens.
- Plugin settings use a sidebar tab layout, replacing the in-content link list.
- Block Types and Editor Configs indexes use Craft’s Vue admin table with a header action button, matching the Icon Picker settings screens.

- Editor Config toolbar placement is now decided purely from the cursor, as which side of a button the pointer is on. dnd-kit’s collision detection no longer has any part in it, so the builder registers no drop targets at all.
- Dragging an Editor Config toolbar button now carries a copy of it, leaving the real button in place as the reserved slot.

- The Editor Config button being dragged is now carried clear of the cursor, so the pointer no longer covers the glyph. The gap is the same wherever within the button the drag started.
- Picking an Editor Config button out of the available buttons now takes it out of that list and closes the gap, rather than leaving a placeholder behind.

- The Editor Config placeholder is now an outline only, with no fill, so it does not read as another button in the strip.
- Toolbar and Bubble Menu buttons are now 36px rather than 32px, matching CKEditor. The Editor Config preview follows, as it always mirrors the real toolbar.
- The Editor Config placeholder outline is now 2px, which reads clearly against the buttons either side of it, and lighter, so the gap no longer draws more attention than the buttons themselves.
- Editor Config "Allowed Content" now uses Plugin Kit checkbox selects, each with an All option, in place of hand-rolled checkbox grids.
- The Editor Config "Allow headings" checkbox is gone. The heading levels are the setting: pick all, pick specific ones, or pick none to disallow headings. Previously the switch could be on with no levels chosen, a state that had to be papered over by silently seeding defaults.
- The Editor Config toolbar and Bubble Menu panels now use 16px padding and 16px between their two halves, giving the buttons more room to breathe. The spacing between the buttons themselves is unchanged, so both previews still read as toolbars.
- The Editor Config "Show a Bubble Menu on selection" setting is now a lightswitch rather than a checkbox, since it switches a whole feature on and off rather than ticking one of a set.
- The "Everything is in the toolbar/Bubble Menu." message now lines up with the heading and buttons above it, instead of sitting 6px further in.
- The separator is now offered at the end of the Editor Config available buttons, and dragging one no longer takes it out of that list. A toolbar may hold any number of separators, so there is always another to reach for; the rest of the available buttons still leave the list as they are picked up.
- Editor Config buttons no longer animate into their new positions when items are moved.
- An existing Editor Config's ID is now shown in a readonly input with a copy button, rather than as bare text that was easy to miss between the fields around it.
- The Editor Config Advanced tab now edits its JSON in a Plugin Kit code editor, with line numbers, syntax highlighting, bracket matching and JSON-aware indentation, in place of a plain textarea. The editor is fetched the first time the tab is opened rather than with the page, as it carries CodeMirror and the screen opens on the Visual tab.

- Raised the minimum Craft CMS requirement to 5.9 while retaining PHP 8.2 compatibility.
- Vizy fields now normalize to `VizyDocument` and reference global Block Type UIDs through ordered picker groups.
- Removed field-local Block Type ownership, legacy Block attributes in canonical documents, fake Block Element IDs, and implicit MatrixAnchor field lifecycle behavior from canonical paths.
- Canonical document input is strict: malformed/future documents throw, and bare Vizy 3 lists require complete promotion mappings.
- Production legacy reads now load persisted field promotion provenance lazily; detached conversion still requires an explicit complete map.
- Canonical serialization now recursively overlays resolved real-field values by placement UID while preserving unresolved and exact empty raw states.
- Vizy 3 promotion is modeled as resumable ordered states because Craft Project Config does not provide an atomic cross-path apply boundary.
- Matrix transforms materialize additive Content Areas idempotently before inserting converted rows.
- Vizy field settings now select named Editor Configs, and canonical validation rejects newly introduced disabled/unregistered nodes and marks while preserving exact trusted baseline content.
- Replaced the production Vue/portal input path with one `<vizy-editor>` and one hidden canonical document control; initial editor load renders no Block FieldLayouts.
- Removed the retired Vue, portal, eager-form, and legacy frontend source tree after the canonical Web Component build became authoritative.

### Deprecated
- Vizy 3 field extensibility surfaces: `EVENT_DEFINE_VIZY_CONFIG`, `EVENT_REGISTER_PLUGINS` /
  `registerPlugin()`, `EVENT_MODIFY_PURIFIER_CONFIG`, instance Node/Mark HTML helpers,
  and `VizyDocument` shims `getField` / `getRawNodes` / `renderHtml` / `renderStaticHtml`
  (removed in Vizy 5). Prefer Extensions registration, TipTap `registerModule` /
  `registerControl` / `registerInsertion`, and `render()` / `query()` / `all()`.
- GraphQL `renderHtml` / `rawNodes` aliases — use `renderedHtml` / walk `nodes`.

### Removed
- **Authoring Labs** playground (`vizy/settings/labs`): side-by-side Lab A/B/C panels, Ensure demo Block Types UI, bootstrap `labs` flags, and lab-only node/discovery UI. Blocks-only insert filter remains production.
- The temporary Insertion Lab settings screen and its prototype-only gutter variants and seam insertion mode.

- The `Headings` dropdown, whose contents were Paragraph plus the heading levels — a strict subset of `Formatting`. Surveying CKEditor, TinyMCE, Redactor, Tiptap, Quill, Lexical and Froala found that every one of them ships exactly one dropdown answering "what block is this", and Vizy shipped two: the same decision made twice, with H1–H6 appearing in both and nothing to say that placing either spent the same buttons. A toolbar wanting a headings-only menu trims Quote and Code out of Formatting in two clicks and places them as buttons. Configs naming `dropdown:headings` are loaded with it dropped, as any dropdown whose registration has gone away is.
- The ability to name a dropdown, choose its glyph, invent one, or change what is in it, in the Editor Config builder. A dropdown is one of a registered set, and an author places it. Authoring put a label field and an icon picker in front of every author to serve the few who wanted a menu of their own, on a screen whose job is laying out a toolbar; editable contents meant a member dragged out of Formatting came back as a top-level button and nowhere else, which is not what removing something means anywhere else. Taking both from the registration also means a release can change what Formatting holds everywhere, rather than only in toolbars saved since. `Extensions::EVENT_REGISTER_TOOLBAR_DROPDOWNS` covers the case that lost, and can replace a built-in as well as add one.
- The bare `heading` button and the `Default level` setting behind it. Headings were three ideas for one decision: `heading1`–`heading6` as buttons, a `heading` button applying whatever the setting said, and a dropdown that looked like it competed with both. A levelled button says what it does in its own name, and a dropdown holding "the heading levels" follows the schema. Configs still naming `heading`, `defaultLevel`, or the empty `dropdown` placeholder are loaded with it dropped, as `more` is.

- The `more` toolbar item. Vizy’s toolbar shows every enabled item rather than hiding some behind an overflow menu. Editor configs that still list it keep working; the item is ignored.
- The `recursiveFieldCount` plugin setting, which no longer had any effect.
- The inline Block Type editor panel in Vizy field settings, and the `vizy/block-types/editor-panel` endpoint that served it. Saving a Vizy field can no longer modify global Block Type schema as a side effect.

### Fixed
- **Image / embed object chips.** Soft `rgba` ring (Vizy 3) instead of opaque white
  stroke; arrow is fill-only so it no longer draws a crossed diamond on the panel
  edge. First click anchors to the pointer (not top-center); re-click after blur
  re-shows the chip without needing to deselect first.
- **Selection bubble on blur.** Clicking out of the Vizy field (e.g. into Title)
  now hides the formatting bubble; blur already cleared link/image/embed chips
  but omitted the selection strip. Portaled bubble border uses a gray fallback
  when `--vizy-border` is not inherited under `body`.
- **Emit-time HTML/URI hardening (§8.4).** `SafeHtml` uses Craft/HTMLPurifier AttrDef_URI for link/iframe/image URLs and SafeIframe for migrated mediaEmbed HTML. Event-handler attrs (`onclick` / `onerror`) and `srcdoc` are stripped on emit; Image attrs are allowlisted. `IconsController` requires a CP request; `AssetsController::actionInfo` requires POST. GraphQL `raw` / `rawFieldValues` remain unredacted (document `renderedHtml` follows the same emit policy).
- **Manual Editor Config import — quote / code block.** Vizy 3 `blockquote` and
  `code-block` buttons are Formatting-dropdown members in Vizy 4; import now
  keeps them on that roster and in node capabilities so upgraded prose no longer
  renders as Unsupported content.
- **Toolbar Add Block — single type.** When only one Block Type is insertable,
  Add Block is a plain `+` (no chevron / menu affordance); several types still
  show the picker chevron. Matches direct-insert behaviour already used by
  gutter `+` and Block ⋯.
- **Clearer upgrade errors.** Missing Vizy 4 upgrade for leftover Vizy 3 JSON
  now says the field has not been upgraded yet (with handle), instead of
  “persisted field promotion provenance”.
- **Promotion provenance — empty schemaMap.** Craft Project Config may omit
  empty `schemaMap` arrays for rich-text-only fields; load treats missing as `[]`
  so Neo/Super Table (and other) hosts can still convert leftover Vizy 3 JSON
  instead of throwing a missing-upgrade error.
- **Vizy 3 list items — editor load.** Strip empty `text` from non-text nodes and
  wrap bare listItem inline children in `paragraph` during V3 convert and on
  canonical document upgrade (fixes `nonTextNodeText` / TipTap list schema on
  promoted rich-text entries).
- **Vizy 3 document convert — semantic links/images.** `Vizy3DocumentAdapter`
  rewrites TipTap `link` marks (`href`/`target`) to Craft Link attrs and
  `#asset:{id}` images to `assetUid` before canonical parse.
- **Block fieldSlots — V3 JSON strings.** `FieldSlotValues` decodes stringified
  Link objects and array-valued Craft fields so owner migration validates.
- **Semantic Image finalization.** Volume-resident Images are no longer queued
  as `semanticPending` work; only temporary uploads stay fail-closed.
- **Promotion fieldData fingerprints.** Source fingerprints hash
  key-order-stable `fieldData` so Project Config pack/unpack does not fail the
  verified stage.

- Block FieldLayouts render ordinary Craft fields again (Dropdown, Date, Link,
  JSON, Icon, Table, …): adapters follow the FieldLifecycle blocklist, with a
  `craft.generic` form transport for fields without a typed reader. Nested
  Element owners (Matrix, Content Block, …) still cannot mount.
- Block FieldLayout load/render failures no longer leave an empty white Block
  card: PHP returns an author message (and initial bootstrap keeps failures),
  and the Block body paints a role=alert panel with Retry. JS mount crashes
  take the same path.
- Layout columns no longer inflate with huge vertical whitespace: layout Lit UI uses flex (so ProseMirror `break-spaces` cannot paint template newlines), column wells drop forced min-heights, and the grid uses `align-items: start`. Column dotted borders are painted from light-DOM CSS so they stay visible in the CP.
- Two-column layouts render side-by-side again: the 12-col grid lives on the ProseMirror columns `contentDOM` (the only slotted node), not on a shadow wrapper that parked everything in one track. Column wells and gutters are visible by default so the empty right column is an obvious writing target.
- The selection bubble menu now sits above the highlighted text. Coordinates were applied to the inner panel (static flow) instead of the absolutely positioned host, so the menu parked at the editor’s bottom-left.
- Choosing a Layout preset no longer freezes the editor: layout/column NodeViews ignore Lit UI mutations (same remount-loop class as Content Area insert), parent Block/Slot fences nested layout UI, and the layout live region stays in shadow DOM instead of light-DOM siblings of `contentDOM`.
- Block Type field layout designer no longer lists fields that cannot be newly placed on Blocks (nested Vizy, Matrix, Neo, Super Table, Content Block, and other non-permitted lifecycle classes). Save already failed closed for those; the picker now matches.
- Block selection outline no longer keys off `.ProseMirror-focused` (that class flickers on control presses inside the contenteditable). Paint follows field authoring activity (`:focus-within` / `data-has-focus`); header select holds that for the gesture and claims DOM focus once on pointerup.
- Block header selection focus no longer drops on mouseup: Chromium blurs the contenteditable when a press ends on `contenteditable="false"` controls, so focus is reclaimed after pointerup (and header buttons/menus no longer trigger Block-activate).
- Clicking a Block header no longer parks the caret in a nested Content Area or select-alls the editor: header `pointerdown` preserves selection (`preventDefault`), then selects the Block as a node. Nested headers stop at their own Block. Drag grip presses are unchanged.
- Selecting a Block via its header now claims editor focus (microtask), so Enter inserts after the Block instead of submitting the Craft entry form when focus was still on the title or elsewhere.
- Block (and other node) selection outlines only paint while the editor is focused, so blurring the Vizy field clears the Block ring along with the field focus frame.
- Vizy no longer leaves a blank field when the editor fails to load or initialize: a visible alert explains the failure, keeps the saved document input intact, and (on module-load crashes) registers a stub `vizy-editor` so Craft’s bootstrap does not hang forever.
- Authoring UI no longer relies on per-control select-all workarounds: a field-wide capture `pointerdown` guard on `.vizy-editor-body` preventDefaults control presses (headers, toolbar, gutters, Add block, …) while still allowing writing surfaces, Craft inputs, and the Block drag grip.
- The horizontal Gapcursor caret no longer paints beside Vizy Blocks (root or nested). Gapcursor remains for targeting; insertion stays on gutter `+` / Add block / drop lines. Remaining Gapcursor paint (e.g. beside HR) is vertically centred in the prose rhythm gap.
- Nested Blocks inside Content Areas can be reordered again: parent Block `dragstart` capture no longer `preventDefault`s when the drag target is a nested `vizy-block` host.
- Blocks-only / mixed Content Areas no longer leave an extra gap above the first nested Block (`vizy-block` top margin zeroed for the first child).
- Long entries no longer stall after inserting a Block: block summary refresh and gutter insertion sync now run only on document changes, not on every selection transaction.
- Block insertion from the gutter palette now suspends gutter/summary side effects until the insert finishes, preventing synchronous overlay resync from freezing long documents before the first ProseMirror transaction completes.
- Inserting a Block with Content Areas no longer freezes the tab: Block/Slot `ignoreMutation` now ignores Lit UI and reflected attributes on nested `vizy-slot` hosts, which previously made ProseMirror remount those NodeViews in an infinite microtask loop.
- TipTap-native edits (e.g. Block Disable/Enable) write the canonical JSON into the field’s hidden document input and bubble `input`/`change` so Craft ElementEditor FormObserver can create provisional drafts. There is no ElementEditor pause; Save already worked via the `serializeForm` flush hook.
- Block collapse/expand uses Craft CP Velocity (same stack as Matrix entries): host height header↔full plus body opacity fade. Resting collapsed body is `display: none`. Collapsed summary still fades/clips into the header. Fold preference persists in `localStorage` by Block UID (Matrix-style; not in the saved document). Disable always collapses and Enable always expands (animated); both update that preference. `enabled` remains the durable document attribute.
- The CSS `grid-template-rows: 0fr↔1fr` clip and the interim WAAPI-only fold were removed.
- Inserting a Block no longer moves the caret into that Block’s Content Areas; structure is added without auto-focusing a nested writing surface.
- Inserting a Block from Add block / the insertion palette no longer select-alls the editor: block insert no longer calls TipTap `focus()` during the click gesture (a Chromium contenteditable footgun).

- Inserting a Block near the bottom of a long document no longer scrolls the Craft page back to the editor’s previous selection. Both insertion execution and the gutter palette’s post-insert focus restoration now preserve the current viewport.
- Rich Content Areas now receive the same Plugin Kit focus border and shadow as Craft inputs when the ProseMirror selection is inside them.
- Cmd/Ctrl+A now selects only the current contiguous prose run. Vizy Blocks are hard boundaries at the root, inside rich Content Areas, and inside layout columns, so select-all never sweeps through Block header, Craft fields, or nested Content Areas. Backspace/Delete also ignore direct or ranged Vizy Block node selections; Blocks remain removable through their explicit menu action.
- Empty Blocks Only Content Areas now use a compact Add block button with a registered Plugin Kit plus icon, and no longer reserve a separate invisible 2rem content target above it.
- Root gutter add controls now straddle the outer editor frame; nested rich Content Area controls straddle their own local frame.
- Field settings: creating a new Block Type from the add combobox (or typing a new name) now auto-adds it to that group on slideout save — no second pick from the combobox.
- Field settings: saving a new Block Type from the add picker (or combobox create) now patches the roster immediately — Craft's slideout `submit` event carries the model on `event.data`, not `event.data.blockType`.
- Blocks Only Content Areas now keep a Matrix-style Plugin Kit “Add block” control beneath existing rows until `maxBlocks` is reached. A single allowed type appends directly; multiple types open the shared insertion palette, and the competing hover gutter is suppressed inside these areas.
- Block FieldLayout columns now use Hyper's compact 1rem gap between adjacent fields instead of Vizy's wider 1.5rem gap; vertical field rhythm remains unchanged.
- Clicking blank Craft CP space no longer focuses Vizy. Toolbar menus restore ProseMirror focus only after a menu session that actually opened and ended through toolbar-owned interaction; closing an open menu with an outside pointer click leaves focus on the page, and Plugin Kit closed-state synchronization remains ignored.
- Gutter `+` open no longer flashes a solid panel before enter motion: the list stays opacity 0 until `pk-popup` fires `pk-reposition`, then `data-open` starts the animation (Plugin Kit combobox panel gate).
- Toggle-closing a toolbar Formatting/Alignment/Table menu no longer flashes the field focus ring or selects all text. Focus is governed by `editor-field-focus.ts`: preserve selection on mousedown (`preventDefault` only — never `view.focus()` mid-press), hold `data-has-focus` while the menu is open, restore ProseMirror focus on close via microtask.
- Closing the gutter insertion palette without inserting (second `+` click or Escape) returns focus to the editor so the caret is usable again.
- Gutter `+` no longer stutters on open: chip presses are ignored by document dismiss-on-pointerdown (toggle/switch owned by `click`). Same chip toggles closed; another line hard-switches without exit+enter. Multi-press on the same chip while closing is ignored; hard reopen tears down in-flight exit so orphan panels cannot stack.
- Insertion palette (`vizy-insertion-list`) now clamps to available viewport height on each `pk-reposition` and scrolls inside the panel (`overscroll-behavior: contain`) instead of extending off-screen and scrolling the CP page. Removed an inverted wheel handler that blocked native list scroll while a scrollbar was visible.
- Block drag-and-drop: grip initiates ProseMirror reorder (not a native drag of the 24×24 button), shows a Vizy 3-style type-name ghost pill, fades the source block while dragging, and paints a blue drop line via `Dropcursor`. Only the grip button can start a drag — the block header no longer reorders when PM marks the selected node draggable. Block reorder rejects self-nests (e.g. dropping a Card into its own Content Area); outer blocks can still drop into nested Content Areas when policy allows.
- Disabled blocks fold to their header summary instead of dimming the whole Block. The “Disabled” badge is replaced by a red `pk-status` (`off`) dot beside the block type name; disabled blocks stay collapsed and cannot be expanded until re-enabled.
- Block headers always show the Block Type name when expanded. Projected content summaries (from title/subtitle placements) appear beside the type name only when collapsed, matching Vizy 3.
- Opening FieldLayouts ship complete in the editor bootstrap (unbounded). Remaining/missing layouts use batched `render-batch` only as a safety net; viewport-lazy mounting is retired. Inserts prefetch before commit.
- Blocks with Craft field layouts no longer paint a large provisional card while custom fields arrive. A compact, full-width Plugin Kit spinner row holds the document position without header, tabs, body, frame, or visible loading copy; the complete Block appears only after `render-batch` mounts its FieldLayout. It replaces field-shaped skeletons and body-sized loading surfaces whose guessed geometry could not reliably represent arbitrary Craft fields and Content Areas. ProseMirror `break-spaces` whitespace between slotted hosts is also neutralized.
- Empty rich-text fields no longer show ProseMirror’s horizontal gap cursor on load. A phantom empty paragraph hosts the normal text caret while authoring; canonical storage for a cleared field stays `{ content: [] }`.
- Content Area labels no longer add an extra 4px margin below the heading; spacing comes from the slot region gap only.
- Empty blocks-only Content Areas no longer paint ProseMirror’s gap cursor line; insertion stays on gutter `+` and drop targeting.
- Gutter `+` press no longer drops the editor focus ring: `data-has-focus` is held from `pointerdown` (ProseMirror still blurs despite `preventDefault`). Insertion palette plays Plugin Kit–style 100ms enter/exit motion.
- Empty blocks-only Content Areas are clickable again: TipTap `Gapcursor` is always loaded. Clicks no longer snap the caret to a sibling rich area (e.g. end of “Content Rich”).
- Multi-area Cards no longer clip later Content Areas (`overflow: hidden` only while collapsed). Sibling Content Area `border-top` divider removed (it read as a line through the next label); blocks-only areas no longer paint a faux text-input frame.
- Block header showed the generic fallback “Block” on load/first insert, then the real Block Type name (e.g. “Card”) only after a later edit. Summaries were written to the UI registry but not painted onto the live `vizy-block` header until a node-view `update()`. First paint now projects the summary immediately, and refreshes push onto mounted hosts.
- Inserting a Block (or other block-level node) from an empty paragraph via gutter `+` or slash now replaces that empty line instead of leaving a blank paragraph above the new Block. Lines with content still insert after as before.
- While the insertion palette is open (Search focused in a portaled `pk-popup`), the editor field keeps its Craft focus ring via generic `data-has-focus` on `.vizy-editor-body` — real focus stays on Search; `:focus-within` alone would drop the frame.
- Slash `/` no longer steals focus into an in-panel Search field. Typing after `/` filters the menu in the editor (TipTap Notion-style); when nothing matches the menu dismisses and `/query` remains ordinary text. Gutter `+` still uses in-panel Search.
- Slash menu no longer flickers on each keystroke. Updating the filter was replacing `pk-popup`’s virtual anchor, which forced a hide-until-reposition cycle; the anchor object now stays stable for the session.

- Fixed the Block Type edit screen having no Cmd+S / “Save and continue editing”, and parking Duplicate and Delete as footer buttons in the body. It now matches Editor Configs and Craft’s own Fields / Entry Types screens: Save returns to the index, Cmd+S and the Save menu’s continue-editing action stay on the type, and Duplicate / Delete live in that same header menu (Delete with confirm).
- Fixed dismissing the Block Type icon picker by clicking in the empty band beside its trigger. The host stretched full field width, so the outside-click handler treated that band as still “inside” the control; clicks further away closed it normally. The host now shrink-wraps to the trigger, and only the trigger, Clear, and panel count as inside.
- The Formatting dropdown trigger in the field now keeps its pilcrow glyph, matching the Editor Config toolbar preview, Alignment/Table on the same row, and Vizy 3. It had been rewriting itself into a text label of the current block type (or “Formatting” when none matched), which is why the builder and the live editor disagreed.
- Editor configs can again be defined as JSON files in `config/vizy/`, alongside the Control Panel / Project Config path. Files are selectable on fields and listed in Settings → Editor Configs as inspect-only (label, ID, and a read-only JSON textarea). The CP never writes or deletes them. Project Config wins if both claim the same ID.
- Fixed a new Editor Config not suggesting its Config ID from the Label, leaving the one field on the screen that cannot be changed later to be typed by hand. Suggested in lowercase with dashes, as the field asks for, rather than in the camel case Craft's handle generator produces and this ID rejects; and only on a new config, since the ID is fixed once saved.
- Fixed an Editor Config having no way to save without leaving the page. Its edit screen now offers “Save and continue editing” in the Save menu and answers <kbd>Cmd</kbd>/<kbd>Ctrl</kbd>+<kbd>S</kbd> with it, as Craft's own settings screens do, while the Save button still returns to the index. The screen also no longer waits for a `submit` event to fill in what it posts — Craft submits through jQuery for both of those paths, which fires no such event, so the toolbar and capabilities would have posted empty.
- Fixed saving an Editor Config failing with “Unknown or non-selectable Vizy capability node:doc”. A loaded config reported its resolved schema — internal nodes and always-on capabilities included — under `capabilities`, so the edit screen posted `doc` and `text` back as if an author had ticked them. A config now carries the author's selection as `capabilities` and what it resolves to as `schema`.
- Fixed attributes being stored with an explicit `null`. ProseMirror writes every attribute a node declares, defaults included, so adding alignment would have put `"textAlign": null` on every paragraph in every document. Null attributes are now left out of stored content, where an absent one means the same thing.
- Fixed a press on a builder item being treated as a drag before the pointer had moved. The item was torn out of its list, a slot opened and the carried copy appeared on mousedown, so a click looked like the start of a move. A drag now begins once the pointer has travelled a few pixels.
- Fixed grabbing an item offering to move it one place along before the pointer had moved. The neighbours' positions were measured after the dragged item had been taken out of the flow, which put the "have I passed this one" boundary inside the grabbed item's own box — so a press on its trailing half proposed a move, and a press on its leading edge did not. That is why the fault looked positional.
- Fixed an icon picker rendered after a selection reading "Choose an icon" beside its Clear button. It now resolves the name and glyph of whatever value it was given.
- Fixed the empty part of a palette row in the Editor Config toolbar builder offering a grab cursor over nothing. The tray was carrying the buttons' own cursor to stop it flickering as the pointer crossed the 4px gaps between them, which covered the empty tail of a half-filled row as well. Each button now claims half the gap either side of it as hit area, so there is no dead space between them to flicker over and the tray no longer has to claim anything.
- Fixed clicking an item in the Editor Config toolbar builder throwing the page back to the top of the panel. Two faults: a click on a plain button re-rendered the whole panel to reach the state it was already in, and re-rendering briefly takes the panel's height out of the document — which is most of the page, so a scroll position further down was clamped to the shorter document and not restored when the height came back. A click that changes nothing no longer renders, and a render that does happen puts the page back where it was.
- Fixed the icon picker printing `Showing {count} of {total}` when Craft's translator was unavailable.

- Leaving the Editor Config Advanced tab with JSON that would not parse appeared to do nothing at all. It correctly refused to switch, but the “Invalid JSON” message was never drawn, so the Visual button looked broken.
- Built CP assets are now referenced relative to wherever Craft publishes them, rather than an absolute `/dist/` path. Only the entry files were being resolved through the manifest, so anything the browser fetched itself — a lazily loaded chunk, an asset referenced from CSS — would have 404’d.
- Dropping an Editor Config button at a particular place in the toolbar was erratic: the dashed placeholder often opened a position away from the cursor, and near the start of the strip it flickered between two positions. The placeholder is a full-size button, so opening it shifted every button after it, which changed what the cursor was over, which moved it again. Placement is now measured against the row as it rests, so the boundary between one position and the next falls exactly halfway between two buttons and does not move as you drag.
- An Editor Config with headings disallowed showed heading levels ticked and a Default level control, because the stored config keeps `headings.levels` populated whether or not `heading` is allowed. The allowed content is now treated as the authority, and orphaned levels are ignored.
- Dragging a separator into the Editor Config toolbar added two of them. A press that travels before being released still reports a click, and a click on a builder button adds it, so the drop and the click each added one. This went unnoticed for every other button because adding one already in the toolbar does nothing. The click a drag leaves behind is now ignored; clicking without dragging still adds and removes as before.
- Hovering a button in the Editor Config toolbar made the cursor flicker between a grab hand and the normal arrow. The hover hint paints an invisible “hover bridge” across the panel so that moving onto the tooltip does not dismiss it, and that bridge took the cursor wherever no button was drawn over it — so showing the hint looked like leaving the button, which hid the hint, which re-exposed the button, over and over. Pointer events coming from the hint are now ignored, since they say nothing about which button is being hovered.
- Moving the cursor near the top or bottom edge of the Editor Config toolbar sent the placeholder to the very start or very end of the strip, ignoring its horizontal position. Those few pixels of the strip are padding rather than button, so the cursor counted as being on a different line from every button in the toolbar. Vertical position now only chooses between rows, and a toolbar on one line places purely by horizontal position.
- The Editor Config available buttons no longer briefly show a drop placeholder as the pointer crosses into the toolbar. Those buttons are in a fixed order and cannot be rearranged, so they never offer a landing place.
- The Editor Config toolbar no longer offers a drop over the editor body beneath the toolbar strip. Only the strip itself takes a button.
- The Editor Config toolbar no longer keeps showing a dashed placeholder after the item has been dragged back out of it. The placeholder now appears only where the item would actually land.
- The Editor Config button being dragged no longer slides out from under the cursor as it reaches the toolbar. It holds a constant offset for the whole drag.
- Removed a `margin` offset on the Editor Config item being dragged that never applied, since dnd-kit rewrites the lifted element’s box every frame.
- Plugin Kit components in Vizy’s CP screens were missing their design tokens and popup styles, because the asset bundles registered only the stylesheets belonging to each entry’s own modules and not those reached through a shared chunk — which is where those styles land as soon as two bundles use a Plugin Kit component. Most visibly, the Editor Config tooltip rendered as dark text on its own dark background with square corners. All four Vizy asset bundles now resolve their stylesheets through the whole chunk graph.
- The Editor Config item being dragged appeared as a tiny sliver under the cursor with no background, instead of the button being carried. The drag library lifts the item into the browser’s top layer and sizes it from its own measurement, which came out as zero, collapsing a 32px button to 2px. The carried item now keeps the size it had in the list.
- Editor Config toolbar items could not be dragged at all by grabbing their icon — which is most of the button, and where a pointer naturally lands. The press landed on the glyph rather than the button, and the drag sensor does not recognise an SVG element as one of its draggables, so nothing happened; clicking kept working because a click bubbles up to the button. The glyph is now excluded from hit testing, and the browser is stopped from claiming the gesture for a native drag or a text selection.
- Most attempts to drag an item into an Editor Config toolbar silently did nothing. The builder took the drag library’s reported drop target as proof the gesture had landed, but that target is frequently empty — or names an element in the other list — even when the item has correctly resolved into the toolbar, so valid drops were being discarded. Where the pointer is released now decides the outcome.
- Abandoning a drag left a phantom button in the Editor Config toolbar that was not part of the saved value, because the drag library’s live rearrangement of the list was never undone.
- Toolbar items in the Editor Config editor could not be dragged to reorder; dropping an item already in the toolbar did nothing.
- Removing one separator from a toolbar removed all of them.
- Iframe and Media embed were offered as allowed content in the Editor Config editor despite having no implementation; ticking either failed on save.
- Enabling headings with no levels configured, or clearing the last heading level, no longer fails validation on save.
- Stray gap above the Label field on the Editor Config editor.
- Field settings Block Configuration now submits picker group UIDs under Craft’s field-type settings namespace, so picking an existing global Block Type is retained on save.
- Renaming a block type group in field settings no longer loses keyboard focus mid-edit, and no longer renders a stray invalid-state outline.
- Missing separator between Plain Text Paste and the block count fields in Vizy field settings.
- Overflow menu buttons in Vizy field settings are square rather than a squashed padless box, and the drag handle glyph now matches the size and centring of the adjacent menu glyph instead of sitting slightly large and off-baseline.
- Dropping a block type in Vizy field settings no longer flings the row to the top of the screen and animates it back; it now simply lands where it was dropped.
- Block types can once again be dragged into a block type group that has been emptied.
- Icon buttons across Vizy field settings and the icon picker no longer pop native browser tooltips on hover. They are named with `aria-label`, matching how Craft names its own icon buttons.
- The per-block availability switch in Vizy field settings had no accessible name at all; its `aria-label` sat on the custom element rather than the control inside it.
- Entry editor bootstrap survives Craft’s brief field DOM detach during Element Editor init instead of permanently blocking the Vizy editor from mounting.
- Entry editor bootstrap now uses Craft’s namespaced field input IDs so `Craft.Vizy.bootstrapEditor()` targets the rendered `<vizy-editor>` element.
- Content Baselines trust now resolves through Craft duplicate clones (`duplicateOf`) so owner migration persistence preserves unknown capabilities during `duplicateElement()` validation.
- Web controller test harness teardown restores console request/user state between integration tests; FieldLayout proofs include web-only User stubs (`getImpersonator`, elevated session).
- Owner migration persistence reloads the canonical owner before save and reports structured `InvalidElementException` validation details on failure.

- Replace the skipped multisite proof with real four-site Craft integration coverage for all outer translation methods, target-local nested field overlays, `propagateAll` target reloads, derivative identity retention, and recursive owner-duplicate UID regeneration.
- Extend the real four-site inner translation matrix across Plain Text, Entries, and Assets for NONE, SITE, SITE_GROUP, LANGUAGE, and compatible CUSTOM partitions.
- Prove Asset work remains pending until the outer owner transaction commits, disappears on rollback or validation failure, and remains inspectable through complete/pending/failed results.
- Prove private no-URL volumes, duplicate references, and conflicting destinations; conflicts fail closed while both canonical references remain persisted.
- Make the transitional GraphQL and Feed Me integrations consume canonical documents without requiring `NodeCollection::query()` or routing prose lists through Vizy 3 conversion.
- Delay Asset moves until the public outermost transaction commit boundary, persist draft deferrals, expose scoped finalization results, reject stale retries, deduplicate batch registration atomically, and fail untrusted semantic Image destinations closed.
- Serialize applicable safe-field defaults for missing placement slots while preserving hidden/unsupported absence, and conservatively reject untested relation subclasses.
- Transform complete nested Vizy subtrees before strict parsing so depth-three migrations preserve deterministic identities and unknown content.
- Reject unsupported non-empty legacy render configuration instead of silently treating it as canonical renderer configuration.
- Detect legacy MatrixAnchor data at live and historical Vizy 3 storage locations before canonical conversion.
- Enforce globally unique Block Type and owned schemUIDs independent of Project Config order.
- Reject invalid `vizySlot` placement and ambiguous duplicate Block UID normalization.
- Route canonical field settings, static HTML, search indexing, and temporary raw authoring through `VizyDocument` APIs.
- Complete Asset lifecycle recovery coverage for publish transitions, real actor permissions, concurrent registration, partial move retry, and multisite destination conflicts.
- Roll back real multisite propagation atomically on target failure, defer Asset moves until commit, and reject recursive propagation while preserving retry.
- Publish the built Vite JavaScript/CSS through Craft’s AssetBundle API so real field renders define `<vizy-editor>`.
- Build the TipTap schema exclusively from concrete trusted module factories; omitted paragraph, hard-break, node, and mark capabilities no longer leak in through StarterKit defaults.
- Separate accepted persisted-content baselines from finalization state, reconcile accepted server canonical documents, and ignore stale save generations.
- Regenerate recursive authored identities on native/private copy while preserving move identity, and version mounted hosts by Block Type and FieldLayout identity.
- Make lazy requests block-local and generation-owned, enforce nested Content Area allowances, sign unsaved Entry section/type context, and validate complete opaque clipboard slices.
- Stabilize preserve-existing policy identity by Block UID, Content AreUID, and authored/hash identity rather than document positions.
- Close Workshops 17–21 production proof gates A–F with real Craft acknowledgement/retry, exhaustive FieldLayout HTTP security, Craft capture integration, difficult-host adapter/policy proofs, expanded Chromium/Firefox/WebKit browser coverage, and removal of the leftover empty Vue `src/js` tree.


## 3.2.1 - 2026-06-27

### Added
- Add `vizy/anchors/backfill` console command to proactively migrate Matrix+Vizy content.

### Fixed
- Fix performance issues with Matrix Anchor handling.
- Fix matrix anchor race condition in load-balanced environments.

## 3.2.0 - 2026-06-20

### Fixed
- Fix Craft 5 Matrix-in-Vizy persistence via MatrixAnchor elements and portal-to-JSON save sync.

## 3.1.8 - 2026-05-30

### Fixed
- Fix Matrix content filtering for malformed block values.
- Fix `vizy/content/fix-vizy-block-field-uids` not repairing nested Vizy block field content.

## 3.1.7 - 2026-05-10

### Fixed
- Fix an issue with Vizy Blocks containing a Table field not preserving sort order.

## 3.1.6 - 2026-04-30

### Changed
- Updated documentation for field setup, block templates, insertion controls, and query behaviour, with a shared Limitations page.
- Update `tiptap` and `qs` dependencies.

## 3.1.5 - 2026-04-11

### Added
- Add automatic “mailto” handling for links that are emails.

### Fixed
- Fix whitespace-only text nodes not preserving spaces between marks.

## 3.1.4 - 2026-03-24

### Fixed
- Fix an issue where blocktype definition could be lost when rendering Vizy fields.
- Fix Vizy Block preview not persisting on page reload.

## 3.1.3 - 2026-03-15

### Changed
- Updated documentation for field setup, block templates, insertion controls, and query behaviour, with a shared Limitations page.
- Refactor Vizy field bootstrapping to DOM auto-mount.

### Fixed
- Fix Vizy Block content not being consistently site-aware.
- Fix an error for CKEditor 5+ and other plugins using `registerScriptWithVars()`.

## 3.1.2 - 2026-03-03

### Added
- Add `vizy/content/fix-vizy-block-field-uids` console command to assist with some migration issues for missing field layout fields in Vizy Blocks.

### Fixed
- Fix Vizy Block’s not normalize content when stored with deprecated field handles.

## 3.1.1 - 2026-02-07

### Added
- Add support for importing Vizy Blocks for Feed Me feeds. Still requires constructing payload manually.
- Add support for Craft Content Block fields within Vizy Blocks.

## 3.1.0 - 2026-01-25

### Changed
- Updated documentation for field setup, block templates, insertion controls, and query behaviour, with a shared Limitations page.
- Revamp Vizy Block field rendering to use DOM portals, rather than within Vue/Tiptap directly.

### Fixed
- Fix Vizy Block’s containing selectize dropdowns not working correctly when moving blocks.

## 3.0.14 - 2026-01-23

### Added
- Add Link Settings to Vizy fields to allow control of what settings a Link button has access to.

### Fixed
- Fix handling of corrupted list items not being normalized properly.

## 3.0.13 - 2025-11-29

### Changed
- Updated documentation for field setup, block templates, insertion controls, and query behaviour, with a shared Limitations page.
- Improve content-encoding handling for special-characters, HTML content, emoji’s and more.

### Fixed
- Fix empty text nodes not being filtered out correctly.

## 3.0.12 - 2025-11-06

### Changed
- Updated documentation for field setup, block templates, insertion controls, and query behaviour, with a shared Limitations page.
- Improve change-detection checks for Vizy Blocks.

### Fixed
- Fix an issue for Vizy Blocks that contained relational fields, when the fields were eager-loaded.
- Fix an issue for Table nodes, where attributes set on `table` were also set on `tbody`.

## 3.0.11 - 2025-09-16

### Changed
- Updated documentation for field setup, block templates, insertion controls, and query behaviour, with a shared Limitations page.
- Update migration-mode check.

### Fixed
- Fix an error for some field content, that appeared JSON-like, but wasn’t error-handled gracefully.

## 3.0.10 - 2025-07-18

### Added
- Add support for programatically creating Vizy Block content with the Vizy Block Type handle.

### Fixed
- Fix extra-small lightswitch style.
- Fix an error migrating Vizy 1 content containing Vizy Block fields with `<iframe>` content.
- Fix Super Table migration from Craft 4 handling.

## 3.0.9 - 2025-05-20

### Changed
- Updated documentation for field setup, block templates, insertion controls, and query behaviour, with a shared Limitations page.
- Vizy Blocks now only validate enabled blocks.

### Fixed
- Fix an error with Live Preview and some buttons (link, iframe, image).
- Fix an error for some nodes by not normalizing raw content.

## 3.0.8 - 2025-05-01

### Added
- Add Vizy field context to block templates.
- Add Craft 5 content migration for Vizy fields that contained Super Table fields.

### Fixed
- Fix an error when changing field layout fields in Craft 5.7+.
- Fix lightswitch UI for Craft 5.7+.
- Fix collapsed Vizy block’s truncated text overflow.
- Fix a namespace issue for Vizy block fields.
- Fix an error when migrating content for prefixed databases.

## 3.0.7 - 2025-03-05

### Fixed
- Fix handling of some complex fields, where their content wasn’t being JSON-decoded.

## 3.0.6 - 2025-02-02

### Added
- Add `Node::EVENT_MODIFY_RENDERED_NODE` event to modify the fully rendered HTML of a node.
- Add back content migration for some fields to use (Hyper).

### Changed
- Updated documentation for field setup, block templates, insertion controls, and query behaviour, with a shared Limitations page.
- Disable Matrix, Neo and Super Table fields from being able to be included in Vizy blocks, until proper support has been added.
- Improve source map bundle size.
- Update icons to Font Awesome 6.
- Update the element selector window for element-based links to only show the site menu for multi-site installs.
- Refactor change-handling to better deal with Craft 5 ElementEditor updates and other fields.

### Fixed
- Fix an error with element select fields in Craft 5.6+ when used in a Vizy block.
- Fix Vizy Block settings icon alignment.
- Fix an error when handling Matrix blocks in Vizy blocks.
- Fix an error when creating new Vizy Blocks for Vizy fields.
- Fix `Db::prepareForJsonColumn` deprecation and handling.

## 3.0.5 - 2024-11-14

### Fixed
- Fix `listenForChanges` check to include certain elements (element fields) which would prevent click event detection.
- Fix an error when editing a Vizy field within another field’s layout, in the slide-out pane.
- Fix duplicate Bold extension registration for editor.
- Fix fixed toolbar not working in element editor slideout.
- Fix compatibility with Hyper 2.1.x.
- Fix a Craft 5.5+ incompatibility.

## 3.0.4 - 2024-10-09

### Added
- Add support for modifying nested nodes through Twig (for Table nodes).
- Add support for entry/category/asset custom sources when picking links.
- Add `vizyInput` as a callback parameter when registering custom extensions/buttons/commands in JavaScript.

### Changed
- Updated documentation for field setup, block templates, insertion controls, and query behaviour, with a shared Limitations page.
- Update custom-registered Vizy extension registration format.

### Fixed
- Fix an error when inserting links on non-multi site installs.
- Fix an error when trying to deserialize HTML content.
- Fix Vizy Block group name being incorrectly saved as uppercase.
- Fix custom-registered Vizy extensions being globally enabled for all Vizy fields.

## 3.0.3 - 2024-08-14

### Fixed
- Fix an issue with multiple Vizy editors with different formatting or table configs.
- Fix buttons styles not working correctly.

## 3.0.2 - 2024-08-11

### Fixed
- Fix some click events in Vizy Block fields not triggering change event listener.
- Fix an error when initializing Vizy fields multiple times.
- Fix incorrect field serialization when in live preview.
- Fix Live Preview detection.
- Fix compatibility with Hyper.

## 3.0.1 - 2024-07-21

### Added
- Add the ability to set links to current site, or specific site for element-based links.

### Changed
- Updated documentation for field setup, block templates, insertion controls, and query behaviour, with a shared Limitations page.
- Change change-detection mechanism incorrectly flagging changed JSON due to discrepancies with PHP vs JS JSON encoding.

### Fixed
- Fix an error when creating search indexes.
- Fix default site for Link nodes.
- Fix Image node URLs not being dynamics when non-transforms are selected.
- Fix default transform value for Image nodes.
- Fix change detection mechanism for Vizy Blocks.

## 3.0.0 - 2024-05-18

### Added
- Add the `Craft.Vizy.Config.registerTemplates()` JS function for custom extensions to render their own template in a Vizy field.

### Changed
- Updated documentation for field setup, block templates, insertion controls, and query behaviour, with a shared Limitations page.
- Now requires PHP `8.2.0+`.
- Now requires Craft `5.0.0+`.
- Update Vizy block header actions to use an ellipsis icon instead of a settings cog.
- Vizy block inner custom fields now save custom field content via the field’s `layoutElementUid` instead of their handle.

### Fixed
- Fix an error for Image nodes, where the `id` attribute didn’t reflect an Asset Element ID.
- Fix an error when saving Vizy blocks in some scenarios, where blocks incorrectly had an invalid ID.
- Fix content changes being detected for nested fields when there are none. In addition, Vizy fields only listen for changes to their content when interacted with.
- Fix field layout designer in settings not serializing changes correctly.

## 2.1.31 - 2026-05-10

### Fixed
- Fix an issue with Vizy Blocks containing a Table field not preserving sort order.

## 2.1.30 - 2026-04-29

### Changed
- Updated documentation for field setup, block templates, insertion controls, and query behaviour, with a shared Limitations page.
- Update `tiptap` and `qs` dependencies.

## 2.1.29 - 2025-09-16

### Changed
- Updated documentation for field setup, block templates, insertion controls, and query behaviour, with a shared Limitations page.
- Update migration-mode check.

## 2.1.28 - 2025-07-18

### Fixed
- Fix an error migrating Vizy 1 content containing Vizy Block fields with `<iframe>` content.

## 2.1.27 - 2025-05-20

### Changed
- Updated documentation for field setup, block templates, insertion controls, and query behaviour, with a shared Limitations page.
- Vizy Blocks now only validate enabled blocks.

## 2.1.26 - 2025-05-01

### Added
- Add support for `utf8mb4` encoded values.
- Add Vizy field context to block templates.

### Fixed
- Fix an error with Vizy blocks containing relation fields.
- Fix migration from Craft 3, where special characters and HTML entities weren’t being decoded and content not correctly sanitized.
- Fix an error when using relation fields like Assets in Vizy blocks.

## 2.1.25 - 2025-02-02

### Added
- Add `Node::EVENT_MODIFY_RENDERED_NODE` event to modify the fully rendered HTML of a node.

## 2.1.24 - 2024-11-14

### Fixed
- Fix `listenForChanges` check to include certain elements (element fields) which would prevent click event detection.

## 2.1.23 - 2024-10-09

### Added
- Add support for modifying nested nodes through Twig (for Table nodes).

### Fixed
- Fix an error when inserting links on non-multi site installs.
- Fix an error when trying to deserialize HTML content.
- Fix Vizy Block group name being incorrectly saved as uppercase.

## 2.1.22 - 2024-08-14

### Fixed
- Fix an issue with multiple Vizy editors with different formatting or table configs.
- Fix buttons styles not working correctly.

## 2.1.21 - 2024-08-11

### Fixed
- Fix some click events in Vizy Block fields not triggering change event listener.
- Fix an error when initializing Vizy fields multiple times.

## 2.1.20 - 2024-07-21

### Added
- Add the ability to set links to current site, or specific site for element-based links.

### Changed
- Updated documentation for field setup, block templates, insertion controls, and query behaviour, with a shared Limitations page.
- Change change-detection mechanism incorrectly flagging changed JSON due to discrepancies with PHP vs JS JSON encoding.

### Fixed
- Fix an error when creating search indexes.
- Fix default site for Link nodes.
- Fix Image node URLs not being dynamics when non-transforms are selected.
- Fix default transform value for Image nodes.
- Fix change detection mechanism for Vizy Blocks.

## 2.1.19 - 2024-04-29

### Changed
- Updated documentation for field setup, block templates, insertion controls, and query behaviour, with a shared Limitations page.
- Update Tiptap dependancies.

### Fixed
- Fix element owner checks.
- Fix content changes being detected for nested fields when there are none. In addition, Vizy fields only listen for changes to their content when interacted with.
- Fix an error when re-ordering Vizy blocks with Asset fields.

## 2.1.18 - 2024-04-10

### Added
- Add the `Craft.Vizy.Config.registerTemplates()` JS function for custom extensions to render their own template in a Vizy field.

### Fixed
- Fix an error for Image nodes, where the `id` attribute didn’t reflect an Asset Element ID.

## 2.1.17 - 2024-03-18

### Fixed
- Fix an error with content not saving when two Vizy fields with Block-only and Rich Text configs are present.

## 2.1.16 - 2024-02-29

### Changed
- Updated documentation for field setup, block templates, insertion controls, and query behaviour, with a shared Limitations page.
- Update Vue.js version for some compatibility fixes.
- Update all Tiptap dependencies for the latest and greatest features/fixes.

### Fixed
- Fix CKEditor issue when moving Vizy Blocks.
- Fix an error when importing Vizy content with Feed Me, when field content is empty.
- Fix YouTube live URLs for media embed function.
- Fix Selectize fields not working properly when re-ordering Vizy blocks when contained in a Matrix/Super Table field.
- Fix spacing of non-full-width fields in Vizy blocks.
- Fix text overflowing issue in editor when no newlines were present.

## 2.1.15 - 2024-01-30

### Fixed
- Fix inline JS scripts for some fields throwing fatal Vizy Block errors.
- Fix tooltip for Image nodes not appearing when clicking on, in some instances.
- Fix extra CSS and JS generated by block types not being extracted out for new blocks.
- Fix an error when clicking on a link to edit its setting, when wrapped in other nodes or marks.

## 2.1.14 - 2023-12-08

### Added
- Add `NodeInterface::contentNodes` for GraphQL node queries for getting nested content nodes/marks.

### Fixed
- Fix Vizy fields not saving when they contained a Neo field.
- Fix `NodeInterface::marks` to actually return the marks of a node.
- Fix an error for Hyper fields with element custom fields, not saving correctly.

## 2.1.13 - 2023-11-25

### Added
- Add console log for fatal Vizy block renders to assist with debugging.

### Fixed
- Fix fatal Vue errors when inline `<style>` tags were included in Vizy block field rendering.
- Fix error state for invalid Vizy blocks.
- Fix and improve click and mouse events inside a Vizy block, due to drag-handling from Tiptap.
- Fix an issue where fields in a Vizy block couldn’t be focused, due to a Craft 4.5.7 change.
- Fix an error with code block nodes escaping code content.

## 2.1.12 - 2023-10-25

### Added
- Add exception message to console when failing to render a Vizy block.

### Fixed
- Fix an error when outputting iframe content, in some cases.

## 2.1.11 - 2023-10-03

### Fixed
- Fix `HardBreak` (`<br>`) nodes being rendered twice.
- Fix an issue where some fields (Hyper) in Vizy blocks weren’t being serialized properly.

## 2.1.10 - 2023-09-25

### Added
- Add better handling for fatal errors when rendering Vizy blocks.

### Fixed
- Fix Table node inner node styles (links, lists, etc).
- Fix when using the Image Editor on an Image node, transforms not being generated.

## 2.1.9 - 2023-09-08

### Added
- Add normalization fix for incorrect `ListItem` schema format.
- Add `title` setting to Link nodes.

### Fixed
- Fix an issue with project config and other new fields.
- Fix using Hyper and Icon Picker fields in Vizy blocks.
- Fix `ListItem` normalization.
- Fix an error with node normalization.
- Switch `htmlEncode` for `AntiXSS` for better special character handling.
- Fix Table nodes’ rendering.
- Fix node normalization not completing correctly for nested nodes.
- Fix field not initializing correctly in Super Table or Matrix field settings.
- Fix `rel` output for links.
- Fix overlapping marks not producing the correct HTML output.

## 2.1.8 - 2023-08-10

### Fixed
- Fix rendering nested JS for Vizy fields.
- Revamp Vue component initialization for input and settings. Improves performance and edge-cases with Vizy fields nested in Matrix/Neo/Super Table and nested Vizy fields.
- Fix an issue where nested Vizy fields trigger an unload warning.
- Fix GQL schema for Nodes to generating correctly.
- Fix Super Table/Matrix/Neo nested combinations not rendering Vizy fields correctly.
- Fix an issue for neste Vizy fields, and `isNew` checks.
- Fix an issue where deeply-nested Vizy fields within Matrix or Super Table fields weren’t having their content set correctly.
- Fix lightswitch UI for Vizy blocks on Craft 4.4.16+.
- Fix “fresh” check for blocks, affecting some defaults for some fields (Button Box) saving over content.
- Fix the media embed node not displaying correctly when toggling the code editor.
- Fix `ListItem` nodes throwing an error when their content was `null`.

## 2.1.7 - 2023-07-11

### Added
- Add error class to Vizy Block tabs, when one of their fields has an error.

### Fixed
- Fix an error parsing empty table field nodes.
- Fix an error when Vizy Blocks contain a dismissable UI element tip.
- Fix Matrix-nested fields and spacing.

## 2.1.6 - 2023-05-27

### Fixed
- Fix new Vizy blocks not having their `isFresh` set for new fields.

## 2.1.5 - 2023-05-17

### Added
- Add `recursiveFieldCount` plugin setting.

### Fixed
- Fix an error when no blocktypes are defined for a blocktype group.
- Fix an issue when new nested Vizy fields would wipe out other fields’ unsaved draft content.
- Fix incorrectly hijacking click events inside Vizy blocks.
- Fix an error for Media Embed nodes when containing special characters in embed data HTML.

## 2.1.4 - 2023-05-03

### Changed
- Updated documentation for field setup, block templates, insertion controls, and query behaviour, with a shared Limitations page.
- Improve gap cursor between Vizy blocks.

### Fixed
- Fix an error when editing nested Vizy fields in element slide-outs.
- Fix an issue where nested Vizy fields (Vizy > Matrix > Vizy) weren’t working correctly.
- Fix iframe nodes not rendering correctly.

## 2.1.3 - 2023-04-24

### Changed
- Updated documentation for field setup, block templates, insertion controls, and query behaviour, with a shared Limitations page.
- Lower the font size of preview text for Vizy Blocks.
- Update all JS dependencies.

### Fixed
- Fix Vizy block preview text not using correct values for some field types.
- Fix an error when re-ordering certain Vizy blocks, containing nested Vizy fields.
- Fix collapse transition with nested Vizy fields and the editor toolbar.
- Fix dropdown fields used in Vizy blocks rendering incorrectly when moving.
- Fix incorrect Table handling for Feed Me.
- Fix Redactor fields in nested Vizy fields getting reset (removed) when they shouldn’t.

## 2.1.2 - 2023-04-20

### Fixed
- Fix being unable to select an image when no default transform was set for the field.

## 2.1.1 - 2023-04-19

### Added
- Add Table support for Feed Me.
- Command Palette commands can now be part of the Editor Config.

### Changed
- Updated documentation for field setup, block templates, insertion controls, and query behaviour, with a shared Limitations page.
- Command Palette commands now filter out any extensions that are included, but don't have a button enabled.

### Fixed
- Fix ul/ol items being invalid in the editor and saved incorrectly. May require any items added after `2.1.0` to be re-input.
- Fix some users not being able to link to assets.

## 2.1.0 - 2023-04-13

### Added
- Add the ability to provide your own buttons, commands and extensions.
- Add support for Editor Config custom buttons.
- Vizy fields can now be included recursively (up to 10 levels of the same field).
- Add Media Embed node.
- Add Table node.
- Add iFrame node.
- Add `TextStyle` mark for creating span elements related to text styles.
- Add “Editor Mode” field setting to control whether block-only, rich-text-only or combined.
- Add “Commands Palette” to make creating content super-speedy. Just start typing “/“ anywhere.
- Add “Block Type Picker Behaviour” field setting to control whether having the block-picker shown on click or hover.
- Add “Expand All” and “Collapse All” option to Vizy blocks.
- Add `data-block` and `data-type` attributes to Vizy blocks.
- Add `Ctrl/Cmd` + `K` as a keyboard shortcut to add new links.
- Add “Plain Text Paste” field setting.
- Add “Classes” setting to Link nodes.
- Add “Min Blocks” and “Max Blocks” settings to field.
- Add “Min Blocks” and “Max Blocks” settings to each Vizy block type.
- Add `LinkMarkInterface` for Link Marks for GraphQL queries.
- Add proper support for Marks in GraphQL queries.
- Add `Link::getLinkElement()`.
- Add the ability to set a default source for images uploaded to the field.
- Add keyboard accessibility to menu button dropdowns.
- Add the ability to set render variables on the node with `node.renderHtml(config)` or `node.renderNode(config)`.
- Add keyboard support to block type picker.
- Add better ghost image when dragging Vizy blocks.
- Add support for disabling max picked blocks from the block-picker.
- Double-clicking a Vizy block now toggles its collapsed state.
- Add `Node::normalizeNode` to allow nodes to be normalized from the database.
- Add `values` to `VizyBlockInterface` for GraphQL.

### Changed
- Updated documentation for field setup, block templates, insertion controls, and query behaviour, with a shared Limitations page.
- Now requires Craft 4.4+.
- Update all JS dependancies.
- Update Tiptap to 2.0.
- Remove Vizy block focus state (for now).
- Refactor nested Vizy fields to correctly render with Vue 3 compilation, fixing lots of pesky issues.
- Formatting buttons (headings, blockquote, etc) can now be included outside of the formatting dropdown.
- Ordered/Unordered Lists nodes now longer wrap content with Paragraph nodes.
- Refine heading styles in the editor.
- Update `NodeInterface::text` to return a textual representation (plain text) of any content for GraphQL.
- Modifying other Craft fields included in Vizy fields now correctly updates content when fields’ handles are changed.
- Improve visibility of dropcursor when dragging Vizy blocks.
- Speed up tippy overlays for snappier feedback.
- Change top-level Paragraph node button icon.
- Move asset-related field settings to hidden “advanced” area for brevity.
- Update text align buttons to show `isActive` state.
- Provide better handling of invalid Vizy blocks if they occur.

### Fixed
- Fix modified field status badge for Vizy block fields.
- Fix field triggering a changed value behaviour (saving a new draft) when no content has changed.
- Fix edit image modal alignment and overflow scrolling issues.
- Fix settings cog color for Vizy blocks.
- Fix tab overflow issue for Vizy blocks.
- Fix missing translations for block settings.
- Fix toolbar button alignment issue for icons.
- Fix Paragraph node button not working correctly.
- Fix node selection when hovering.
- Fix empty blocktype picker UI when no block types are available.
- Fix being able to copy/paste Vizy blocks into other fields (in a nested setup) that don’t support the same block types.
- Fix a JS error when trying to drag blocks between nested Vizy fields.
- Fix copying field handles when editing field content not working.
- Fix an issue where field layout fields may not be saved when adding quickly.
- Fix some HTML characters being stripped incorrectly due to LitEmoji processing.
- Fix node attributes like classes not always merging correctly with template-defined and config-defined.
- Fix nodes saving attributes with `null` values.
- Fix Paragraph empty checks when containing nested nodes/marks.
- Fix node serialization not working for nested nodes.
- Fix an error when invalid nodes were used (crashes editor).
- Fix some special HTML characters being stripped out of content.
- Fix accessibility for button modals.
- Fix menu bar items in dropdowns not showing their active state.
- Fix dropcursor glitches between Vizy blocks, and improve style.
- Fix an issue where saving Vizy fields inside Vizy Block field type settings weren’t always saved.
- Fix Redactor changes in Vizy blocks not having their content serialized correctly.
- Fix Table fields used in Vizy Blocks not saving correctly when rows in the table are deleted.
- Fix height of menu button options and scrollable container.

## 2.0.12 - 2023-02-27

### Fixed
- Fix an error when querying Vizy blocks with GraphQL.

## 2.0.11 - 2023-02-21

### Added
- Add support for Preparse plugin.
- Add content service to handle updating Vizy field content (mostly for [Hyper](https://github.com/verbb/hyper).
- Add `$_type` and `$_field` to Block. (thanks @leevigraham).
- Add the ability to set the initial number of rows for a field, to control its initial height.

### Changed
- Updated documentation for field setup, block templates, insertion controls, and query behaviour, with a shared Limitations page.
- Change Vizy field data to be stored in `vizyData` to prevent collisions with inner fields (which are not needed but can override Vizy serialized content).
- Only admins are now allowed to access plugin settings.
- `text` for nodes is now automatically run through the `raw` Twig filter to decode HTML special characters.

### Fixed
- Fix a GraphQL type error for VizyBlocks.
- Fix node types not appearing in the Explorer or Introspection for GraphQL.

## 2.0.10 - 2022-12-25

### Changed
- Updated documentation for field setup, block templates, insertion controls, and query behaviour, with a shared Limitations page.
- Link marks now automatically parse for reference tags in their `href`.

### Fixed
- Fix GraphQL queries throwing an error when fields aren’t initialized fully.
- Fix heading styles in editor.
- Fix an error importing via Feed Me, in some cases.

## 2.0.9 - 2022-11-09

### Fixed
- Fix Feed Me importing not supporting all node types (just plain text).
- Fix an error where field settings for a block’s field layout can be corrupted.

## 2.0.8 - 2022-10-23

### Fixed
- Fix handling of Vizy fields inside element slideouts, instead of block relationship fields when being edited.

## 2.0.7 - 2022-09-25

### Added
- Add support for entries conditions for Vizy fields.

### Changed
- Updated documentation for field setup, block templates, insertion controls, and query behaviour, with a shared Limitations page.
- Switch deprecated `ueberdosis/html-to-prosemirror` package to `ueberdosis/tiptap-php`.

### Fixed
- Fix Vizy blocks not being site-aware.
- Fix “Open link in new tab” not saving correctly for link nodes.
- Fix asset fields within Matrix/Super Table fields not moving from the temporary upload directory.
- Fix an error when propagating element fields’s content for un-translated Vizy/SuperTable/Inner fields.
- Fix an error when propagating Super Table rows for un-translated Vizy/SuperTable/Inner fields.
- Fix an error when propagating Matrix blocks for un-translated Vizy/Matrix/Inner fields.
- Fix importing nodes via Feed Me not working for some node types.

## 2.0.6 - 2022-08-11

### Fixed
- Fix Vizy node content being reset when inserting other nodes directly before it.
- Fix a field alignment issue in nested Vizy fields.
- Fix Vizy fields not initializing when switching entry types.
- Fix fields not working correctly in element slideouts, in some instances.

## 2.0.5 - 2022-08-09

### Fixed
- Fix GraphQL queries throwing an error when fields aren’t initialized fully.
- Fix blocktype picker not appearing in Live Preview.
- Fix potential error for blocktypes.
- Update Vizy loading for input to handle proper loading using Vite.

## 2.0.4 - 2022-07-06

### Fixed
- Fix an error when making GraphQL queries.

## 2.0.3 - 2022-07-02

### Added
- Add `vite-plugin-compression` to generate gzipped JS/CSS assets.
- Add better handling for JS scripts on-load, to prevent against missing JS execution in some cases. (thanks @khalwat).

### Changed
- Updated documentation for field setup, block templates, insertion controls, and query behaviour, with a shared Limitations page.
- Update CP template `content` block.

### Fixed
- Fix a GQL deprecation notice.
- Fix HMR not working when making changes to `vizy.js`.
- Fix updating Block Type template not working correctly.
- Fix en error when trying to limit “Available Volumes” or “Available Transforms”.
- Fix an error when rendering an entry revision for nested Vizy fields.

## 2.0.2 - 2022-06-04

### Fixed
- Fix an error with JS translations.
- Fix return types for `node.renderHtml()`.

## 2.0.1 - 2022-05-28

### Added
- Add changes/improvements from `1.0.14`.

### Fixed
- Fix `renderHtml()` not rendering HTML correctly.
- Fix JS initialization for input and settings.
- Fix field settings not initializing in some cases.

## 2.0.0 - 2022-05-05

### Added
- Add checks for registering events for performance.

### Changed
- Updated documentation for field setup, block templates, insertion controls, and query behaviour, with a shared Limitations page.
- Now requires PHP `8.0.2+`.
- Now requires Craft `4.0.0+`.
- Merge updates with version 1.0.13.
- Migrate to Vite and Vue 3 for performance.
- Rename base plugin methods.
- Replace deprecated `Craft.postActionRequest()` for JS.
- Improve field performance when editing in the control panel.

### Fixed
- Fix Craft `4.0.0` compatibilities.
- Fix link sources having duplicate sources.
- Fix a type error when trying to render empty HTML.
- Fix Vizy field settings not picking up field layout changes when edited.

### Removed
- Remove `cleanDeltas()`, which is no longer needed in Craft 4.

## 1.0.22 - 2022-12-25

### Fixed
- Fix GraphQL queries throwing an error when fields aren’t initialized fully.

## 1.0.21 - 2022-10-23

### Fixed
- Fix handling of Vizy fields inside element slideouts, instead of block relationship fields when being edited.

## 1.0.20 - 2022-09-25

### Fixed
- Fix an issue where nested Vizy fields in Matrix/Super Table/etc fields weren’t having their content serialized correctly.

## 1.0.19 - 2022-09-23

### Fixed
- Fix display issues with Vizy fields in Live Preview.
- Fix an overflow issue for small screens for the block picker.
- Fix a legacy error where in some cases blocks were missing their block type.
- Fix toggling field tabs not working correctly for nested Vizy fields.
- Fix legacy handling of `HtmlToProseMirror` package when importing content via Feed Me.

## 1.0.18 - 2022-08-11

### Changed
- Updated documentation for field setup, block templates, insertion controls, and query behaviour, with a shared Limitations page.
- Update all tiptap dependancies to latest beta versions.

### Fixed
- Fix Vizy node content being reset when inserting other nodes directly before it.

## 1.0.17 - 2022-08-09

### Fixed
- Fix blocktype picker not appearing in Live Preview.

## 1.0.16 - 2022-07-02

### Added
- Add `isRoot` for Vue component top-level fields.

### Changed
- Updated documentation for field setup, block templates, insertion controls, and query behaviour, with a shared Limitations page.
- Update all tiptap dependancies to latest beta versions.
- Exclude any falsey attributes for a node when rendering.
- Lower debounce time for watched Vizy Block field changes.
- Only clicking on the header of Vizy Blocks selects a block.

### Fixed
- Fix link nodes always including `target` and `rel` attributes.
- Fix newly created Vizy blocks not having the correct namespace in some instances.
- Fix JS not initializing correctly for complex Vizy fields and in combination with Neo/SuperTable/Matrix.
- Fix an error where delta values for other fields was being stripped out when including a Vizy field.
- Fix an error when saving nested Vizy fields with validation errors and blocks losing their content.
- Fix unload warning when no content has been changed.
- Fix Vizy Block field alignment of fields.
- Fix selected state issues on nested Vizy fields and Vizy blocks, and add support for “Escape” key to remove selected Vizy Block.
- Fix being unable to click properly between Vizy blocks to add a new node, and fix gap cursor alignment.
- Fix an overlay issue for nested Vizy fields when picking Vizy blocks.
- Fix multiple Redactor fields in a single Vizy block not working correctly.

## 1.0.15 - 2022-06-04

### Fixed
- Fix incorrectly encoding quotes for Vizy field content.

## 1.0.14 - 2022-05-28

### Added
- Add `VizyImageNodeInterface` and the ability to query `asset` on image nodes.
- Add `Image::getAsset()` for image nodes.
- Add caching for block type definitions for each field, to speed up rendering of large Vizy fields.
- Improve field performance when editing in the control panel.

### Fixed
- Fix being unable to remove the template path for a Vizy blocktype when editing the field settings.
- Remove HTMLPurifier due to performance issues, as we can rely on proper HTML encoding via `StringHelper::htmlEncode`.
- Fix double-encoding of HTML strings.
- Fix volumes not working for selecting images.

## 1.0.13 - 2022-04-13

### Added
- Add support for `limit`, `orderBy` and `where` arguments for GraphQL queries, when querying `nodes`.
- Add descriptions for all attributes for GraphQL.
- Add `vizyBlock.getCollapsed()`.
- Add `vizyBlock.id`.
- Add `Node::isEmpty()`.

### Changed
- Updated documentation for field setup, block templates, insertion controls, and query behaviour, with a shared Limitations page.
- Change field layout instruction text for Vizy field settings.
- GraphQL queries using `nodes` now only return enabled nodes.

### Fixed
- Fix `NodeCollection::isEmpty` not working correctly.

## 1.0.12 - 2022-03-17

### Fixed
- Fix nested node content being incorrectly stripped out due to HTML purifier.

## 1.0.11 - 2022-03-13

### Changed
- Updated documentation for field setup, block templates, insertion controls, and query behaviour, with a shared Limitations page.
- Improve node collection performance.
- Minor Vizy block performance improvements.

### Fixed
- Fix serializing nested Vizy fields not being arrays.
- Fix a potential XSS vulnerability, where HTML wasn’t correctly encoded.
- Fix an error when serializing nested Vizy fields, when generating search keywords.
- Fix rendering node collections in the control panel automatically when not needed.
- Fix Vizy Block nodes not rendering correctly for GraphQL queries.
- Fix an error when querying `nodes` or `rawNodes` for GraphQL queries.

## 1.0.10 - 2022-02-28

### Added
- Add support for emoji’s in Vizy field content.

### Fixed
- Fix field content not updating when editing raw HTML.
- Fix non-translatable Vizy field with inner translatable fields not having their content propagated correctly.
- Fix Matrix field sanitizing not working correctly for Vizy Blocks containing Matrix fields where their sub-field handles have changed.
- Fix related elements in Vizy block fields not having their appropriate site (inherited from the owner element) applied to the field.
- Fix Matrix field sanitizing not working correctly for Vizy Blocks containing Matrix fields where their sub-field handles have changed.
- Fix a compatibility issue with Redactor, showing extra line breaks incorrectly.
- Fix rendering content not reporting back correctly for `length` Twig filter, and no longer require the use of `raw` Twig filter.
- Fix displaying encoded html characters in some cases (pasting from Word).

## 1.0.9 - 2022-01-17

### Added
- Add support for Feed Me.

### Changed
- Updated documentation for field setup, block templates, insertion controls, and query behaviour, with a shared Limitations page.
- Bump axios from 0.21.1 to 0.21.2.

### Fixed
- Fix "Remove Empty Paragraphs" not working correctly when content has been pasted from Word, or contained `&nbsp;` characters.
- Fix Firefox text selection issue, when trying to select text within a Vizy block (input, textarea fields).
- Fix `gapcursor` tiptap utility not working correctly.
- Fix when fields only containing images, the field is considered empty.

## 1.0.8 - 2021-10-23

### Changed
- Updated documentation for field setup, block templates, insertion controls, and query behaviour, with a shared Limitations page.
- Update all tiptap dependancies to latest beta versions.

### Fixed
- Fix Redactor fields not working correct in a Vizy block.
- Fix editor losing focus when pressing toolbar buttons.
- Fix z-index overflow issue when showing the block type selector.
- Fix block type selector not allowing scrollable area when a lot of blocks are available.
- Fix Image nodes not having ref tags parsed correctly for transforms.
- Fix ref parsing logic for Link nodes.
- Fix an error thrown during search indexing, when a Vizy block contained an element select field (assets, entries, etc).

## 1.0.7 - 2021-09-09

### Fixed
- Fix content not saving correctly when editing via the element slideout.
- Fix editor toolbar not behaving as fixed when opening the element editor slideout.
- Fix links containing ref tags not being parsed properly.
- Fix including incorrect attributes (`id`, `uid`) when querying Vizy field nodes via GraphQL.

## 1.0.6 - 2021-08-29

### Added
- Add `subscript` and `superscript` buttons.

### Changed
- Updated documentation for field setup, block templates, insertion controls, and query behaviour, with a shared Limitations page.
- Update all tiptap dependancies to latest beta versions.

### Fixed
- Ensure each field's content is serialized properly when saving Vizy blocks.
- Fix Vizy blocks using `isolating`, causing issues with backspacing some other nodes (blockquote).
- Fix an error when trying to add a link with only numbers.
- Remove field modification indicator (from Craft) for Vizy block inner fields.
- Fix lack of `enabled` attribute for all nodes.
- Fix disabled Vizy blocks returned in `query()` when using `all()` to query nodes.
- Fix text align buttons not working, due to `@tiptap/core@2.0.0-beta.85` change.
- Fix numerous errors when creating multiple Vizy fields in Matrix and Super Table fields.

## 1.0.5 - 2021-08-02

### Changed
- Updated documentation for field setup, block templates, insertion controls, and query behaviour, with a shared Limitations page.
- Update all tiptap dependancies to latest beta versions.

### Fixed
- Fix nested Vizy fields not rendering when used inside a Matrix block (also inside a Vizy field).
- Fix focus styling when selecting a Vizy Block.
- Fix Vizy Block inner field validation (including Matrix).
- Fix brand-new static Super Table blocks in a Vizy block having their rows duplicated when moving the block.
- Fix when moving a Vizy block containing a Redactor field, it Redactor would be initialized multiple times.
- Fix field layout changed in a Super Table-nested Vizy field not applying when running `project-config/apply`.
- Fix field layout changed in a Matrix-nested Vizy field not applying when running `project-config/apply`.
- Fix multiple Vizy fields in Matrix/Super Table parent fields not saving correctly.

## 1.0.4 - 2021-07-21

### Added
- Add `text` and `rawNode` to NodeInterface for GraphQL.

### Fixed
- Fix an error when saving Vizy blocks containing Matrix fields with no blocks defined.
- Fix Vizy fields failing to validate Vizy blocks, when only Vizy blocks are present in the field.
- Fix `content`, `attrs`, `marks` and `text` GraphQL node properties not having the correct values.
- Fix image node, and other self-closing nodes not displaying correctly.
- Fix required Vizy fields not validating when no content is set for the field.

## 1.0.3 - 2021-06-22

### Added
- Add `defaultTransform` field setting.
- Add `defaultTransform` field setting.
- Add `availableTransforms` field setting.
- Add `availableVolumes` field setting.
- Add `showUnpermittedFiles` field setting.
- Add `showUnpermittedVolumes` field setting.
- Add `trimEmptyParagraphs` field setting to automatically trim any empty paragraphs in content.
- Add `serializeValue()` to all nodes, to control the values saved to the database.

### Changed
- Updated documentation for field setup, block templates, insertion controls, and query behaviour, with a shared Limitations page.
- Update all tiptap dependancies to latest beta versions.
- Update Vizy Node GraphQL interface name.

### Fixed
- Fix multiple nested marks (bold + underline, etc) rendering text twice.
- Fix Matrix blocks throwing an error if a block type field was deleted. (thanks @dyerc).
- Fix Vizy block type fields not saving when nested in a Super Table/Matrix field.
- Fix nested Vizy fields’ image nodes not working correctly.
- Fix GQL Vizy Block field aliases not working.
- Fix fixed toolbar buttons overlapping for nested Vizy fields.
- Fix nested list elements `ul`, `ol` not appearing correctly in the control panel editor.
- Fix Vizy Block fields not validating when saving an element.
- Fix `getMarkAttributes` tiptap deprecation.
- Fix asset fields in Vizy blocks not resolving to the correct volume/paths.
- Fix incorrectly parsing Twig template code in block fields.
- Fix Vizy fields not showing as empty for empty content.

## 1.0.2 - 2021-05-30

### Added
- Allow marks to use `merge` when using template-based config.
- Add `getOwner()` to Vizy Block element, to allow use of `owner` for block field settings.

### Changed
- Updated documentation for field setup, block templates, insertion controls, and query behaviour, with a shared Limitations page.
- Update all tiptap dependancies to latest beta versions.
- Remove duplicate Vue dependancy, causing some conflicts with other plugins using Vue.

### Fixed
- Fix incompatibility issues with [Inventory](https://github.com/doublesecretagency/craft-inventory) plugin.
- Fix an error when a block type’s tab contained only numbers.
- Fix orphaned layouts for deleted block types, or deleted Vizy fields.
- Fix field layout setting updates not being stored to project config (adding or removing field).
- Ensure general block type errors are show when saving a field fails.
- Fix multiple field layouts being created if a block type fails validation when saving the field settings.
- Fix unload warnings when no content has changed, when a field has nested Vizy fields.
- Fix nested Vizy fields and their toolbars not sticking when using `toolbarFixed`.
- Fix “add block” button not always appearing on a new line, depending on formatted text.
- Fix incomplete field data being saved when a Matrix (or similar) field contained a nested Matrix, when the owner element has unchanged block content.

## 1.0.1 - 2021-05-09

### Changed
- Updated documentation for field setup, block templates, insertion controls, and query behaviour, with a shared Limitations page.
- Allow Icons Path setting to use auto-suggest field.
- Refactor block inner field change detection to use `MutationObserver`. Should prove more reliable for variety of edge-cases.

### Fixed
- Fix search indexing not factoring in Vizy block inner fields, and nested Vizy fields.
- Fix documentation link for editor config in field settings.
- Fix an error when trying to populate block content for a block field that has been changed or removed.
- Fix Vizy block elements not having inner field normalisation occur with owner element.
- Fix an error when adding new block types to the field.
- Fix WYSIWYG styles being applied to nested block elements.
- Fix changes from Redactor not serializing when saving Vizy field content.
- Fix changes from Position and Colour Swatches plugins not serializing when saving Vizy field content.
- Fix a potential error when a field that was included in a block type was deleted.
- Fix changes from Tag fields not serializing when saving Vizy field content.
- Fix extensions not always getting initialized properly, when being contained in the formatting menu.

## 1.0.0 - 2021-04-30

- Initial release.
