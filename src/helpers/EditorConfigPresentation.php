<?php
namespace verbb\vizy\helpers;

use verbb\vizy\Vizy;

/**
 * Authoring metadata for Editor Config toolbar and bubble presentation.
 */
final class EditorConfigPresentation
{
    // Static Methods
    // =========================================================================

    /**
     * Whether a dropdown owns this control, so a toolbar may not name it directly.
     *
     * @see MEMBER_ONLY_IDS
     */
    public static function isMemberOnlyToolbarId(string $id): bool
    {
        return in_array($id, self::MEMBER_ONLY_IDS, true);
    }

    /**
     * Whether an ID names a button Vizy cannot yet run.
     *
     * Public because the builder is not the only thing that has to know: a stored toolbar
     * keeps these, and anything reasoning about why one is not in a manifest needs the
     * distinction between "not yet built" and "not allowed here".
     */
    public static function isPendingToolbarId(string $id): bool
    {
        return isset(self::PENDING[$id]);
    }

    /**
     * Author-facing capability picker.
     *
     * Only capabilities that are installed *and* a genuine editorial choice are
     * offered. Always-on mechanics (Paragraph, Line break) and uninstalled
     * capabilities are excluded: advertising either produces a toggle whose state
     * the editor would silently ignore or reject.
     */
    public static function capabilityCatalog(): array
    {
        $extensions = Vizy::$plugin->getExtensions();

        $collect = static function(array $definitions, array $exclude = []): array {
            $items = [];
            foreach ($definitions as $name => $definition) {
                if (empty($definition['authorConfigurable']) || empty($definition['installed'])) {
                    continue;
                }
                if (in_array($name, $exclude, true)) {
                    continue;
                }
                $items[] = [
                    'label' => (string)($definition['label'] ?? ucfirst($name)),
                    'value' => $name,
                ];
            }
            usort($items, static fn(array $a, array $b) => $a['label'] <=> $b['label']);

            return $items;
        };

        $headingDefinition = $extensions->getDefinition('node', 'heading');

        return [
            'nodes' => $collect($extensions->getNodes(), self::HEADING_OWNED_NODES),
            'marks' => $collect($extensions->getMarks()),
            'extensions' => $collect($extensions->getExtensions()),
            'headingAvailable' => (bool)($headingDefinition['installed'] ?? false),
        ];
    }

    /**
     * The buttons a toolbar may hold.
     *
     * Buttons only: the dropdowns are their own catalog, `members` being theirs alone and the
     * roster lookups reading that catalog by name. They are drawn in the same palette row all the
     * same, merged by `paletteRank` — being two catalogs is a fact about how they are assembled
     * and looked up, not about how they are offered.
     *
     * Every control `controlFor` resolves is here, including the ones a registered dropdown owns
     * — a menu row needs a label, a glyph and a preview token like anything else. Those carry
     * `memberOnly`, and the palette leaves them out: a control is offered as a button or as a
     * menu member, never both. See `MEMBER_ONLY_IDS` for why that is a better rule than offering
     * both and hiding one.
     *
     * `preview` is carried on the same items `controlFor` puts it on, and for the same reason: it
     * is the token the menu styles a row by, so a Heading 2 previews at Heading 2's size. The
     * builder needs it because a selected dropdown draws a real menu of these, not a row of
     * glyphs — and a menu whose rows all look alike is not a preview of anything.
     *
     * Sequenced for the palette on the way out — see `PALETTE_ORDER`. Nothing
     * else depends on the order: a menu's rows follow its roster and a toolbar's follow the stored
     * list, so this is the palette's own business.
     */
    public static function toolbarCatalog(): array
    {
        $items = [];

        // Paragraph is assembled like any other block type, and has no capability of its own
        // because prose always permits it.
        $items[] = [
            'id' => 'paragraph',
            'label' => 'Paragraph',
            'kind' => 'node',
            'group' => 'Text',
            'icon' => ToolbarIcons::svgFor('paragraph'),
            'preview' => 'paragraph',
        ];

        // Vizy 3's `line-break`. Like Paragraph it needs no capability — a hard break is a
        // Shift+Enter mechanic rather than an editorial decision, so it is always enabled and
        // has no checkbox — which is exactly why it was missing here: the palette is built
        // from the capabilities, and this has none to be found under.
        $items[] = [
            'id' => 'hardBreak',
            'label' => 'Line break',
            'kind' => 'node',
            'group' => 'Text',
            'icon' => ToolbarIcons::svgFor('hardBreak'),
        ];

        foreach (self::ACTIONS as $id => $action) {
            $item = [
                'id' => $id,
                'label' => $action['label'],
                'kind' => 'action',
                'group' => $action['group'],
                'icon' => ToolbarIcons::svgFor($id),
            ];
            // Only the table operations have one. Carried in the same keys a node button
            // uses, so the builder gates it without needing to know that an action can be
            // gated at all.
            if (isset($action['capability'])) {
                $item['capabilityKind'] = 'node';
                $item['capabilityName'] = $action['capability'];
            }
            $items[] = $item;
        }

        // A separator is a rule, not a glyph.
        $items[] = ['id' => 'separator', 'label' => 'Separator', 'kind' => 'presentation', 'group' => 'Layout', 'icon' => null];

        // One button per level, as Vizy 3 offered them. `headingLevel` is here so the builder
        // can also hide the ones this config's levels leave out: `capabilityName` covers the
        // Heading capability, but not which of its six levels are allowed, and a palette
        // offering H5 to a config that permits H2–H4 offers a button that cannot render.
        for ($level = 1; $level <= 6; $level++) {
            $items[] = [
                'id' => 'heading' . $level,
                'label' => "Heading {$level}",
                'kind' => 'node',
                'group' => 'Headings',
                'icon' => ToolbarIcons::svgFor('heading' . $level),
                'abbr' => "H{$level}",
                'headingLevel' => $level,
                'capabilityKind' => 'node',
                'capabilityName' => 'heading',
                'preview' => 'heading' . $level,
            ];
        }

        foreach (Vizy::$plugin->getExtensions()->getMarks() as $name => $definition) {
            if (empty($definition['authorSelectable']) || empty($definition['installed']) || self::_isCarrierMark($name)) {
                continue;
            }
            if (!self::_definitionOffersSurface($definition, 'toolbar')) {
                continue;
            }
            $controlId = (string)$definition['controlId'];
            $items[] = [
                'id' => $controlId,
                'label' => (string)($definition['label'] ?? ucfirst($name)),
                'kind' => 'mark',
                'group' => (string)($definition['group'] ?? 'Marks'),
                'icon' => self::iconForDefinition($definition, $controlId),
                'capabilityKind' => 'mark',
                'capabilityName' => $name,
            ];
        }

        // Core nodes that ship with a toolbar glyph. Third-party nodes skip this allowlist
        // and land in `Extensions` (or an explicit `group`) so emoji / callout / etc.
        // appear in Available items without editing this map.
        $nodeGroups = [
            'blockquote' => 'Text',
            'codeBlock' => 'Text',
            'horizontalRule' => 'Text',
            'bulletList' => 'Lists',
            'orderedList' => 'Lists',
            'image' => 'Media',
            'iframe' => 'Media',
            'mediaEmbed' => 'Media',
            'table' => 'Layout',
            // Layout has been installed and author-configurable all along, and was left
            // out of this allowlist by omission rather than by decision — so the one
            // capability with its own columns UI had no way onto a toolbar.
            'layout' => 'Layout',
        ];
        foreach (Vizy::$plugin->getExtensions()->getNodes() as $name => $definition) {
            if (empty($definition['authorSelectable']) || empty($definition['installed'])) {
                continue;
            }
            if (!self::_definitionOffersSurface($definition, 'toolbar')) {
                continue;
            }
            // Paragraph / hard break / bare heading are assembled above as always-on
            // or levelled controls — not as a single capability-toggled button.
            if (in_array($name, ['paragraph', 'hardBreak', 'heading'], true)) {
                continue;
            }
            $group = $definition['group'] ?? ($nodeGroups[$name] ?? null);
            if ($group === null) {
                if (str_starts_with((string)$definition['module'], 'vizy/core/')) {
                    continue;
                }
                $group = 'Extensions';
            }
            $controlId = (string)$definition['controlId'];
            $items[] = [
                'id' => $controlId,
                // Menu copy: "Insert table" — the capability picker still says "Table".
                'label' => $name === 'table' ? 'Insert table' : (string)($definition['label'] ?? ucfirst($name)),
                'kind' => 'node',
                'group' => $group,
                'icon' => self::iconForDefinition($definition, $controlId),
                'capabilityKind' => 'node',
                'capabilityName' => $name,
                'preview' => $name,
            ];
        }

        foreach (Vizy::$plugin->getExtensions()->getExtensions() as $name => $definition) {
            if (empty($definition['authorSelectable']) || empty($definition['installed'])) {
                continue;
            }
            if (!self::_definitionOffersSurface($definition, 'toolbar')) {
                continue;
            }
            $controlId = (string)$definition['controlId'];
            $items[] = [
                'id' => $controlId,
                'label' => (string)($definition['label'] ?? ucfirst($name)),
                'kind' => 'extension',
                'group' => (string)($definition['group'] ?? 'Extensions'),
                'icon' => self::iconForDefinition($definition, $controlId),
                'capabilityKind' => 'extension',
                'capabilityName' => $name,
            ];
        }

        // Last, and deliberately: the palette reads top to bottom as what the editor can do,
        // and these are the things it cannot do yet. `pending` is what the builder gates on,
        // and it is not a state a config can change. (Currently none.)
        foreach (self::PENDING as $id => $item) {
            $items[] = [
                'id' => $id,
                'label' => $item['label'],
                'kind' => $item['kind'],
                'group' => $item['group'],
                'icon' => ToolbarIcons::svgFor($id),
                'pending' => true,
            ];
        }

        // Stamped in one pass rather than in each branch above, so a control cannot be added to
        // the catalog and quietly miss the mark — every family here is assembled somewhere
        // different (actions, the heading loop, the node allowlist) and three separate chances to
        // forget is three too many.
        foreach ($items as &$item) {
            if (self::isMemberOnlyToolbarId($item['id'])) {
                $item['memberOnly'] = true;
            }
        }
        unset($item);

        return self::_inPaletteOrder($items);
    }

    public static function bubbleCatalog(): array
    {
        $items = [];
        $registry = Vizy::$plugin->getExtensions();
        foreach ([
            ...array_values($registry->getMarks()),
            ...array_values($registry->getNodes()),
            ...array_values($registry->getExtensions()),
        ] as $definition) {
            if (empty($definition['authorSelectable']) || empty($definition['installed'])) {
                continue;
            }
            if (($definition['kind'] ?? null) === 'mark' && self::_isCarrierMark((string)$definition['name'])) {
                continue;
            }
            if (!self::_definitionOffersSurface($definition, 'bubble')) {
                continue;
            }
            $controlId = (string)$definition['controlId'];
            $name = (string)$definition['name'];
            $kind = (string)$definition['kind'];
            $items[] = [
                'id' => $controlId,
                'label' => (string)($definition['label'] ?? ucfirst($name)),
                'kind' => $kind,
                'group' => (string)($definition['group'] ?? ($kind === 'mark' ? 'Marks' : 'Extensions')),
                'icon' => self::iconForDefinition($definition, $controlId),
                'capabilityKind' => $kind,
                'capabilityName' => $name,
            ];
        }

        return $items;
    }

    /**
     * Inline SVG for a control: definition `icon` (raw SVG or glyph name), else catalogue map.
     */
    public static function iconForDefinition(array $definition, string $fallbackId): ?string
    {
        $icon = $definition['icon'] ?? null;
        if (is_string($icon) && $icon !== '') {
            if (str_starts_with(ltrim($icon), '<')) {
                return $icon;
            }

            return ToolbarIcons::glyph($icon) ?? ToolbarIcons::svgFor($fallbackId);
        }

        return ToolbarIcons::svgFor($fallbackId);
    }

    public static function defaultToolbar(): array
    {
        return [
            'addBlock',
            self::DROPDOWN_PREFIX . 'formatting',
            'bold',
            'italic',
            'link',
        ];
    }

    /**
     * The registration name a stored one resolves to, following any rename.
     *
     * @see DROPDOWN_ALIASES
     */
    public static function dropdownAlias(string $name): string
    {
        return self::DROPDOWN_ALIASES[$name] ?? $name;
    }

    /**
     * Author-facing entries for the registered dropdowns, shaped like any other palette item.
     *
     * `members` is the registration's roster, as concrete button IDs. The builder needs it to
     * draw the roster panel for a placed dropdown: the panel shows every member the dropdown
     * *may* hold, with the ones this config has trimmed marked as left out, so the roster has to
     * be known even for a dropdown whose stored membership is a subset of it.
     *
     * Sequenced on the way out like the buttons are, and by the same `PALETTE_ORDER`, because the
     * palette offers both in one row — see `inPaletteOrder` for how the two catalogs are merged
     * without being merged.
     */
    public static function dropdownCatalog(): array
    {
        $items = [];

        foreach (Vizy::$plugin->getExtensions()->getToolbarDropdowns() as $name => $definition) {
            $items[] = [
                'id' => self::DROPDOWN_PREFIX . $name,
                'label' => $definition['label'],
                'kind' => 'dropdown',
                'group' => 'Dropdowns',
                'icon' => self::_dropdownIcon($definition['icon']),
                'members' => self::dropdownRoster($name) ?? [],
            ];
        }

        return self::_inPaletteOrder($items);
    }

    /**
     * Every button a registered dropdown may hold, in registered order, or null if no such
     * dropdown is registered.
     *
     * Two jobs, which is why it is the only reading of a registration's members anywhere:
     *
     * - It is the vocabulary a config's membership is checked against. A dropdown may only ever
     *   hold less than it ships with — that is the whole shape of the feature — so an ID a stored
     *   membership names that is not in here is not a member being added, it is stale or
     *   hand-typed, and `EditorConfigs::normalizeDropdowns` drops it.
     * - It is what a placed dropdown holds when the config says nothing about it, which is the
     *   common case: nothing is stored until an author actually trims or reorders one, so an
     *   untouched dropdown keeps following its registration — and picks up whatever a later
     *   release adds to it, which a stored membership by design does not.
     *
     * The heading shorthand is expanded here, to all six levels rather than to the config's
     * allowed ones. Which levels a config *allows* is not a question about this dropdown, and
     * `controlFor` answers it per member when the toolbar is built.
     */
    public static function dropdownRoster(string $name): ?array
    {
        $definition = Vizy::$plugin->getExtensions()->getToolbarDropdown(self::dropdownAlias($name));
        if ($definition === null) {
            return null;
        }

        $roster = [];
        foreach ($definition['members'] as $member) {
            if ($member === self::HEADING_LEVELS_TOKEN) {
                array_push($roster, ...self::HEADING_LEVEL_IDS);
                continue;
            }
            $roster[] = $member;
        }

        return array_values(array_unique($roster));
    }

    /**
     * The control a plain toolbar item produces, or null if the config disallows it.
     *
     * The single place that decides what a toolbar ID *is*. Both the toolbar and the Bubble Menu
     * build from it, and a dropdown's members resolve through it too, so a button behaves
     * identically whether it was placed or came with a menu.
     *




     *     dropdown name. Carried through rather than looked up because a dropdown's members
     *     resolve through this method too, and a member that is itself a dropdown would
     *     otherwise lose the map on the way down.
     */
    public static function controlFor(
        string $id,
        array $enabledMarks,
        array $enabledNodes,
        array $headingLevels = [],
        array $dropdownMembers = [],
        array $enabledExtensions = [],
    ): ?array {
        // A retired token resolves to nothing, wherever one is still named. `heading` is why
        // this is needed: it remains a live capability, so the generic node branch below would
        // happily draw a button toggling an unspecified level.
        if (in_array($id, self::RETIRED_TOOLBAR_IDS, true)) {
            return null;
        }

        // Ahead of the node lookup on purpose. Pending IDs must not fall through
        // to a live-looking control (e.g. a generic insertNode for a missing factory).
        if (self::isPendingToolbarId($id)) {
            return null;
        }

        if (str_starts_with($id, self::DROPDOWN_PREFIX)) {
            // Aliased here as well as in normalization, because a manifest is also built from
            // hand-written config that normalization has not necessarily rewritten yet.
            $name = self::dropdownAlias(substr($id, strlen(self::DROPDOWN_PREFIX)));

            return self::_dropdownControl(
                $name,
                $enabledMarks,
                $enabledNodes,
                $headingLevels,
                $dropdownMembers,
                $dropdownMembers[$name] ?? null,
                $enabledExtensions,
            );
        }

        // Selection actions carry no capability, so they resolve before the lookups that
        // would find nothing behind them. See `ACTIONS`.
        if (isset(self::ACTIONS[$id])) {
            // The table operations are the exception: their commands come with the Table
            // extension, so without the capability there is nothing to run and the button
            // would be dead rather than merely useless.
            $capability = self::ACTIONS[$id]['capability'] ?? null;
            if ($capability !== null && !in_array($capability, $enabledNodes, true)) {
                return null;
            }

            return [
                'id' => $id,
                'kind' => 'action',
                'label' => self::ACTIONS[$id]['label'],
                'icon' => ToolbarIcons::svgFor($id),
                'action' => self::ACTIONS[$id]['action'],
            ];
        }

        // A levelled heading button, which is gated on both the Heading capability and on
        // that level being one of the configured ones.
        //
        // All six have a glyph, because Vizy 3 drew them itself rather than taking them from an
        // icon set — which is why the set Vizy ships with H1 to H6 and reads as a series. The
        // `abbr` stays as the fallback for a build with no glyph for a level.
        if (preg_match('/^heading([1-6])$/', $id, $matches) === 1) {
            $level = (int)$matches[1];
            if (!in_array('heading', $enabledNodes, true) || !in_array($level, array_map('intval', $headingLevels), true)) {
                return null;
            }

            return [
                'id' => $id,
                'kind' => 'node',
                'label' => "Heading {$level}",
                'icon' => ToolbarIcons::svgFor($id),
                'abbr' => "H{$level}",
                'action' => ['command' => 'setHeading', 'level' => $level],
                'preview' => "heading{$level}",
            ];
        }

        // Prose always permits a paragraph, so it is not gated on the capabilities and has
        // no checkbox of its own. Handled before the mark and node lookups because it will
        // never appear in either list.
        if ($id === 'paragraph') {
            return [
                'id' => 'paragraph',
                'kind' => 'node',
                'label' => 'Paragraph',
                'icon' => ToolbarIcons::svgFor('paragraph'),
                'action' => ['command' => 'setParagraph'],
                'preview' => 'paragraph',
            ];
        }

        // Always enabled, and so never in the capabilities either. No `preview`: a hard
        // break has nothing to be active in, being a character rather than a wrapper.
        if ($id === 'hardBreak') {
            return [
                'id' => 'hardBreak',
                'kind' => 'node',
                'label' => 'Line break',
                'icon' => ToolbarIcons::svgFor('hardBreak'),
                'action' => ['command' => 'insertNode', 'nodeName' => 'hardBreak'],
            ];
        }

        // Text style carries a value — a colour, a font — rather than toggling, so there is
        // nothing for a button to switch on and Vizy 3 never offered one. It stays a
        // capability, because it is what other features hang their attributes on, but it is
        // not a control: a button for it looked live and did nothing.
        if ($id === 'textStyle') {
            return null;
        }

        // Registry controls (core + third-party) resolve by controlId (often equal to TipTap name).
        $definition = Vizy::$plugin->getExtensions()->getControl($id);
        if ($definition !== null) {
            return self::_controlFromDefinition(
                $definition,
                $enabledMarks,
                $enabledNodes,
                $enabledExtensions,
            );
        }

        return null;
    }

    public static function defaultBubble(): array
    {
        return [
            'enabled' => true,
            'items' => ['bold', 'italic', 'link'],
        ];
    }

    public static function isPresentationItem(string $id): bool
    {
        return in_array($id, self::TOOLBAR_PRESENTATION_IDS, true);
    }

    public static function toolbarItemLabel(string $id): string
    {
        foreach (self::toolbarCatalog() as $item) {
            if ($item['id'] === $id) {
                return $item['label'];
            }
        }

        return ucfirst($id);
    }

    /**
     * A catalog, sequenced for the palette and stamped with where each item falls in it.
     *
     * The stamp is what lets the two catalogs be drawn as one row. They are assembled separately
     * and stay separate — a dropdown carries `members` and nothing else does — but the palette
     * offers them together, so neither can be sequenced on its own: Formatting belongs in front of
     * Bold, and sorting the buttons among themselves can never say that. Both go through here, and
     * the builder merges them by `paletteRank`.
     *
     * Kept as a number the client sorts by rather than one merged catalog from the server, because
     * the two are not interchangeable anywhere else — `#dropdownRoster` reads the dropdown catalog
     * specifically, and a merged list would have to be picked apart again to serve it.
     *
     * @see PALETTE_ORDER
     */
    private static function _inPaletteOrder(array $items): array
    {
        // The groups are flattened away here: they are how the sequence is written, not something
        // the palette knows about. See `PALETTE_ORDER`.
        $rank = [];
        foreach (self::PALETTE_ORDER as $ids) {
            foreach ($ids as $id) {
                $rank[$id] = count($rank);
            }
        }

        // Unnamed controls keep the order they were assembled in, after everything named. A stable
        // sort would say this on its own; PHP's is stable as of 8.0, and the explicit tiebreak
        // says it out loud rather than resting on that.
        //
        // Across the two catalogs this is a weaker promise: an unregistered button and an
        // unregistered dropdown can rank equally and fall either way round. Both are plugin
        // additions landing after everything Vizy names, which is the part worth guaranteeing.
        $unnamed = count($rank);
        $positions = [];
        foreach ($items as $index => $item) {
            $positions[$index] = $rank[$item['id']] ?? $unnamed + $index;
        }

        // Key association survives `uksort`, so the ranks can still be read off by original index.
        uksort($items, static fn(int $a, int $b) => $positions[$a] <=> $positions[$b]);

        foreach ($items as $index => &$item) {
            $item['paletteRank'] = $positions[$index];
        }
        unset($item);

        return array_values($items);
    }

    /**
     * Whether a registry definition advertises a catalogue surface.
     */
    private static function _definitionOffersSurface(array $definition, string $surface): bool
    {
        $controlId = $definition['controlId'] ?? null;
        if (!is_string($controlId) || $controlId === '') {
            return false;
        }
        $surfaces = $definition['surfaces'] ?? [];

        return is_array($surfaces) && in_array($surface, $surfaces, true);
    }

    /**
     * Whether a mark exists to hold a value rather than to be switched on.
     *
     * `textStyle` is the only one: it is what colour and font attributes hang off, so it has
     * no state of its own to toggle and Vizy 3 offered no button for it. It was reaching the
     * palette because that is built from what a config may legally enable, and it may legally
     * be enabled — so ticking Text style produced a button that looked live and did nothing.
     * A capability, then, but not a control.
     */
    private static function _isCarrierMark(string $name): bool
    {
        return $name === 'textStyle';
    }

    /**
     * A registered dropdown's glyph, or null when it has none.
     *
     * Registered icons are glyph names rather than control IDs, so a plugin can name any
     * glyph Vizy ships rather than only the ones a control happens to use. Null is allowed:
     * the trigger wears a chevron either way, so a dropdown with no glyph is a chevron on
     * its own rather than a placeholder standing in for one.
     */
    private static function _dropdownIcon(?string $icon): ?string
    {
        return $icon === null ? null : ToolbarIcons::glyph($icon);
    }

    /**
     * Resolve a registry definition into a live toolbar/bubble control, or null when disabled.
     */
    private static function _controlFromDefinition(
        array $definition,
        array $enabledMarks,
        array $enabledNodes,
        array $enabledExtensions,
    ): ?array {
        $controlId = (string)($definition['controlId'] ?? '');
        $name = (string)$definition['name'];
        $kind = (string)$definition['kind'];
        $label = (string)($definition['label'] ?? ucfirst($name));
        $icon = self::iconForDefinition($definition, $controlId !== '' ? $controlId : $name);

        if ($kind === 'mark') {
            if (!in_array($name, $enabledMarks, true) || self::_isCarrierMark($name)) {
                return null;
            }

            return [
                'id' => $controlId,
                'kind' => 'mark',
                'label' => $label,
                'icon' => $icon,
                // Link collects a URL rather than toggling straight on.
                'action' => $name === 'link'
                    ? ['command' => 'setLink']
                    : ['command' => 'toggleMark', 'markName' => $name],
            ];
        }

        if ($kind === 'extension') {
            if (!in_array($name, $enabledExtensions, true)) {
                return null;
            }

            // Behaviour-only modules must supply Craft.Vizy.registerControl; PHP has no
            // TipTap command of its own to fall back on.
            return [
                'id' => $controlId,
                'kind' => 'extension',
                'label' => $label,
                'icon' => $icon,
                'action' => ['command' => 'registeredControl'],
            ];
        }

        if ($kind !== 'node' || !in_array($name, $enabledNodes, true)) {
            return null;
        }

        // Layout wraps what is selected in columns rather than placing an empty one, so it
        // reaches for its own command. Built empty by `insertNode`, a layout would be
        // invalid content: its columns are required and cannot be filled generically.
        if ($name === 'layout') {
            return [
                'id' => $controlId,
                'kind' => 'node',
                'label' => $label,
                'icon' => $icon,
                'action' => ['command' => 'wrapInLayout'],
            ];
        }

        // Table as a menu member is the insert command — label must not collide with the
        // dropdown trigger also named Table (Vizy 3: "Insert Table").
        if ($name === 'table') {
            return [
                'id' => $controlId,
                'kind' => 'node',
                'label' => 'Insert table',
                'icon' => $icon,
                'action' => ['command' => 'insertNode', 'nodeName' => 'table'],
                'preview' => 'table',
            ];
        }

        return [
            'id' => $controlId,
            'kind' => 'node',
            'label' => $label,
            'icon' => $icon,
            'action' => in_array($name, self::TOGGLEABLE_NODES, true)
                ? ['command' => 'toggleNode', 'nodeName' => $name]
                : ['command' => 'insertNode', 'nodeName' => $name],
            'preview' => $name,
        ];
    }

    /**
     * The control a registered dropdown produces, or null if it would open an empty menu.
     *
     * A registration supplies the roster a dropdown starts with; a config may then say what it
     * holds here, and `$members` is that. Trimming was taken away for a while on the grounds
     * that it duplicated the capability checkboxes, and that was wrong in one specific way: the
     * case it does not cover is a content type an editor should keep *allowed* while offering
     * fewer ways to apply it, which is what "Formatting without Code block" is. Vizy 3 shipped
     * that as its `formatting` and `table` options, so taking it away also cost a JSON config
     * its meaning — and answering it with "register another dropdown" put a developer event in
     * front of a thing an author should be able to drag.
     *
     * What did not come back is a roster a config can *add* to out of order, or one that
     * silently disagrees with the next config along about what a dropdown is called. The
     * registration still supplies the starting members and their order, and the capabilities
     * still prune what a config disallows, so this can only ever render less than it names.
     *
     * A dropdown left with nothing in it is dropped rather than drawn as a trigger that opens
     * onto nothing. Not an error: the toolbar and the capabilities are edited independently, and
     * switching a capability off should quietly stop rendering things rather than refuse to save.
     *





     *     registration's. Null is not the same as an empty list: nothing stored means "whatever
     *     this dropdown ships with", while an empty membership is a config that has emptied it.
     */
    private static function _dropdownControl(
        string $name,
        array $enabledMarks,
        array $enabledNodes,
        array $headingLevels,
        array $dropdownMembers = [],
        ?array $members = null,
        array $enabledExtensions = [],
    ): ?array {
        $definition = Vizy::$plugin->getExtensions()->getToolbarDropdown($name);
        if ($definition === null) {
            return null;
        }

        // Nothing stored means the registration's roster. Either way these are concrete button
        // IDs, and the loop below drops the ones this config disallows — including a heading at a
        // level it does not permit, which `controlFor` gates. See `HEADING_LEVELS_TOKEN`.
        $members ??= self::dropdownRoster($name) ?? [];

        $items = [];
        foreach ($members as $member) {
            // A dropdown is not a member of anything, so nesting is not on the table: a member
            // naming one resolves through the same branch and would open a menu inside a menu.
            if (str_starts_with($member, self::DROPDOWN_PREFIX)) {
                continue;
            }
            $control = self::controlFor(
                $member,
                $enabledMarks,
                $enabledNodes,
                $headingLevels,
                $dropdownMembers,
                $enabledExtensions,
            );
            if ($control !== null) {
                $items[] = $control;
            }
        }

        if ($items === []) {
            return null;
        }

        return [
            // Prefixed as it is stored, so the client's open-menu state keys on the same token
            // the toolbar named. It was a hash of the member list once, which changed whenever a
            // member did — and members are editable again, which is exactly why it must stay the
            // name: an open menu should survive its contents being what they are.
            'id' => self::DROPDOWN_PREFIX . $name,
            'kind' => 'group',
            'label' => $definition['label'],
            'icon' => self::_dropdownIcon($definition['icon']) ?? ($items[0]['icon'] ?? null),
            'items' => $items,
        ];
    }


    // Constants
    // =========================================================================

    /**
     * Presentation tokens, which carry no capability of their own.
     *
     * Only the separator now. `dropdown` was here too — an empty menu an author dragged in,
     * named, gave a glyph and filled — and it went with the authoring of dropdowns: they are
     * a registered set now, so there is no such thing as a blank one to place.
     */
    public const TOOLBAR_PRESENTATION_IDS = ['separator'];

    /**
     * Nodes with a toggle command, as against ones that are placed.
     *
     * Kept in step with `TOGGLEABLE_NODES` in `toolbar/actions.ts` by hand, because
     * the split is a property of TipTap's command set rather than of the schema. A
     * node named in neither place still renders; it simply does nothing, which is why
     * the client drops unactionable controls rather than trusting this list.
     */
    private const TOGGLEABLE_NODES = ['heading', 'bulletList', 'orderedList', 'blockquote', 'codeBlock'];

    /**
     * Presentation tokens that were once valid and are now retired.
     *
     * Vizy 3's toolbar was a flat, wrapping row of icon buttons with everything
     * visible. `more` was an overflow container that hid enabled capabilities
     * behind a second click and had no modelled contents, so it is gone. Stored
     * configs still naming it are cleaned rather than rejected: refusing to load
     * would brick an existing install over a token that never carried meaning.
     *
     * `heading` and `dropdown` join it. A bare Heading button applied whatever a "Default
     * level" setting said, which made headings two things at once — that button plus
     * `heading1`–`heading6` — and gave a dropdown a member that was not a button but a
     * stand-in for several. One concrete button per level says the same thing with one idea
     * instead of three. `dropdown` was the empty menu an author placed and named, which
     * registered dropdowns replace.
     */
    public const RETIRED_TOOLBAR_IDS = ['more', 'heading', 'dropdown', 'html'];

    /**
     * Controls a dropdown owns, which a toolbar may therefore not name directly.
     *
     * The rule is one form per family: a control is offered either as a button or as a member of
     * the menu that covers it, never both. Vizy 4 briefly offered both and it read as two
     * inventories of the same goods — a palette of forty squares of which twenty-four were menu
     * contents, plus a rule that hid a family's buttons once its menu was placed, which fired
     * silently, at a distance, and only in one direction, so a toolbar could still end up holding
     * every alignment command twice.
     *
     * Removing the duplication removes the need for any of that: nothing has to be hidden,
     * because nothing is offered twice. Which is also how the editors with a visual toolbar
     * builder do it. Craft's CKEditor plugin has one palette entry per family — `heading`,
     * `alignment`, `insertTable` — and none of the individual items CKEditor 5 the library
     * provides. CKEditor and TinyMCE offer both forms because they are libraries, assembled in
     * code by a developer who can be trusted to pick one.
     *
     * Vizy 3 mostly agreed: its thirteen table operations existed *only* inside `table`, exactly
     * as here. Where this departs from it is headings and alignment, which it offered loose as
     * well — so `h1`–`h6`, `paragraph`, `align-left` and friends are dropped from a stored
     * toolbar rather than rejected, on the same grounds as `RETIRED_TOOLBAR_IDS`: a config that
     * will not open is a worse answer than a toolbar an author can put a dropdown back into.
     *
     * These are still ordinary catalog entries — `toolbarCatalog` returns them, `controlFor`
     * resolves them — because a menu row needs a label, a glyph and a preview token like anything
     * else. `memberOnly` marks them so the palette leaves them out; it is not a statement that
     * they are second-class.
     *
     * Listed rather than derived from the registrations, deliberately. Deriving it would let a
     * plugin registering a dropdown that happens to hold `bold` quietly take Bold out of every
     * config's palette. What is core is a product decision; tests assert this
     * list is exactly the union of the core dropdowns' rosters.
     */
    public const MEMBER_ONLY_IDS = [
        // Formatting
        'paragraph', 'heading1', 'heading2', 'heading3', 'heading4', 'heading5', 'heading6',
        'blockquote', 'codeBlock',
        // Alignment
        'alignLeft', 'alignCenter', 'alignRight', 'alignJustify',
        // Table. `table` itself is the insert operation, which is why it is in here with the
        // twelve that act on an existing one — Vizy 3's `insert-table` was a menu item too.
        'table',
        'tableAddRowBefore', 'tableAddRowAfter', 'tableDeleteRow',
        'tableAddColumnBefore', 'tableAddColumnAfter', 'tableDeleteColumn',
        'tableMergeCells', 'tableSplitCell',
        'tableToggleHeaderRow', 'tableToggleHeaderColumn', 'tableToggleHeaderCell',
        'tableDelete',
    ];

    /**
     * Vizy 3 buttons that are placeable but not yet runnable.
     *
     * Empty for now: whole-document HTML source (`html`) was retired rather than
     * implemented — schema round-trips discard unsupported markup, and the product
     * spec deprecates that authoring surface. Keep the pending slot for a future
     * honest feature (e.g. read-only inspector) without reviving source editing.
     */
    private const PENDING = [];

    /**
     * Nodes the Headings section owns, so they are not also offered as loose
     * checkboxes in the allowed-content grid.
     */
    private const HEADING_OWNED_NODES = ['heading'];

    /**
     * Buttons that act on the selection rather than standing for a capability.
     *
     * None of these has a node or a mark behind it, so none is gated on the allowed
     * content: there is nothing an author could switch off that would make Undo or
     * "align right" meaningless. That is the same reasoning that keeps Paragraph out of
     * the capability grid, and it is why these are resolved before the mark and node
     * lookups in `controlFor`, which would otherwise find nothing and return null.
     *
     * Alignment writes a `textAlign` attribute onto the block it is used on rather than
     * introducing a node or mark of its own, which is why it is modelled here instead of
     * as a registry capability. Undo and redo need history to be in the schema at all —
     * see `editor-schema.ts`, which now always loads it.
     */
    private const ACTIONS = [
        'undo' => ['label' => 'Undo', 'group' => 'History', 'action' => ['command' => 'undo']],
        'redo' => ['label' => 'Redo', 'group' => 'History', 'action' => ['command' => 'redo']],
        'clearFormatting' => [
            'label' => 'Clear formatting',
            'group' => 'Marks',
            'action' => ['command' => 'clearFormatting'],
        ],
        // Opens the shared Vizy Block insertion palette (not a TipTap command).
        // Placeable in Editor Config; Block Type membership is the field allowlist,
        // not a roster-editable dropdown like Formatting / Alignment / Table.
        'addBlock' => [
            'label' => 'Add Block',
            'group' => 'Blocks',
            'action' => ['command' => 'openAddBlock'],
        ],
        'alignLeft' => [
            'label' => 'Align left',
            'group' => 'Alignment',
            'action' => ['command' => 'setTextAlign', 'align' => 'left'],
        ],
        'alignCenter' => [
            'label' => 'Align centre',
            'group' => 'Alignment',
            'action' => ['command' => 'setTextAlign', 'align' => 'center'],
        ],
        'alignRight' => [
            'label' => 'Align right',
            'group' => 'Alignment',
            'action' => ['command' => 'setTextAlign', 'align' => 'right'],
        ],
        'alignJustify' => [
            'label' => 'Justify',
            'group' => 'Alignment',
            'action' => ['command' => 'setTextAlign', 'align' => 'justify'],
        ],

        // The table operations, which Vizy 3 offered as the members of its Table dropdown.
        // Actions rather than capabilities of their own — there is no such thing as allowing
        // "delete row" — but unlike every action above they do stand on one: without the
        // Table capability the commands do not exist, so they carry `capability` and are
        // gated on it exactly as a button for a node would be.
        'tableAddColumnBefore' => [
            'label' => 'Insert column before',
            'group' => 'Table',
            'capability' => 'table',
            'action' => ['command' => 'tableOperation', 'operation' => 'addColumnBefore'],
        ],
        'tableAddColumnAfter' => [
            'label' => 'Insert column after',
            'group' => 'Table',
            'capability' => 'table',
            'action' => ['command' => 'tableOperation', 'operation' => 'addColumnAfter'],
        ],
        'tableDeleteColumn' => [
            'label' => 'Delete column',
            'group' => 'Table',
            'capability' => 'table',
            'action' => ['command' => 'tableOperation', 'operation' => 'deleteColumn'],
        ],
        'tableAddRowBefore' => [
            'label' => 'Insert row above',
            'group' => 'Table',
            'capability' => 'table',
            'action' => ['command' => 'tableOperation', 'operation' => 'addRowBefore'],
        ],
        'tableAddRowAfter' => [
            'label' => 'Insert row below',
            'group' => 'Table',
            'capability' => 'table',
            'action' => ['command' => 'tableOperation', 'operation' => 'addRowAfter'],
        ],
        'tableDeleteRow' => [
            'label' => 'Delete row',
            'group' => 'Table',
            'capability' => 'table',
            'action' => ['command' => 'tableOperation', 'operation' => 'deleteRow'],
        ],
        'tableMergeCells' => [
            'label' => 'Merge cells',
            'group' => 'Table',
            'capability' => 'table',
            'action' => ['command' => 'tableOperation', 'operation' => 'mergeCells'],
        ],
        'tableSplitCell' => [
            'label' => 'Split cell',
            'group' => 'Table',
            'capability' => 'table',
            'action' => ['command' => 'tableOperation', 'operation' => 'splitCell'],
        ],
        'tableToggleHeaderRow' => [
            'label' => 'Toggle header row',
            'group' => 'Table',
            'capability' => 'table',
            'action' => ['command' => 'tableOperation', 'operation' => 'toggleHeaderRow'],
        ],
        'tableToggleHeaderColumn' => [
            'label' => 'Toggle header column',
            'group' => 'Table',
            'capability' => 'table',
            'action' => ['command' => 'tableOperation', 'operation' => 'toggleHeaderColumn'],
        ],
        'tableToggleHeaderCell' => [
            'label' => 'Toggle header cell',
            'group' => 'Table',
            'capability' => 'table',
            'action' => ['command' => 'tableOperation', 'operation' => 'toggleHeaderCell'],
        ],
        'tableDelete' => [
            'label' => 'Delete table',
            'group' => 'Table',
            'capability' => 'table',
            'action' => ['command' => 'tableOperation', 'operation' => 'deleteTable'],
        ],
    ];

    /**
     * The order the palette offers things in — buttons and dropdowns together, in one sequence.
     *
     * Assembly order used to decide this, which is to say nothing did. The marks came out in
     * registration order and the nodes fell alphabetical, so Bulleted list and Numbered list —
     * about the most reliable pair on any toolbar — sat four squares apart with Image and Layout
     * between them.
     *
     * The sequence is the one the editors agree on, which is more consensus than it sounds.
     * CKEditor's default toolbar, TinyMCE's, and the palette order in Craft's own CKEditor plugin
     * all read: block format, inline marks in the order bold-italic-underline-strikethrough-
     * subscript-superscript-code, link, alignment, lists, insertables, then cleanup and history at
     * one end or the other. Three of those steps are dropdowns here, and naming them here is what
     * lets the palette state the whole consensus rather than the half of it that happens to be
     * buttons: Formatting opens the row, Alignment sits with the lists it is usually next to, and
     * Table joins Image and Layout, all three being objects you insert.
     *
     * Written as groups purely to be read as groups — the palette draws one unbroken row, and the
     * grouping is expressed by what ends up next to what. It was briefly drawn too, with a gap
     * between each, which turned a hint into a set of dividers competing with `separator`, itself
     * drawn as a vertical rule a few squares along.
     *
     * Anything not named here sorts to the end, keeping its assembly order: a plugin's custom
     * button or dropdown has no place in a sequence that predates it, and guessing one from its
     * `group` would scatter it among Vizy's own. `separator` is named last but is sorted last
     * regardless, being the one control that never runs out — see `toolbarPoolItems`.
     */
    private const PALETTE_ORDER = [
        [self::DROPDOWN_PREFIX . 'formatting'],
        ['bold', 'italic', 'underline', 'strike', 'subscript', 'superscript', 'code', 'highlight'],
        ['link'],
        [self::DROPDOWN_PREFIX . 'alignment'],
        ['bulletList', 'orderedList'],
        ['image', 'iframe', 'mediaEmbed', 'layout', 'addBlock', self::DROPDOWN_PREFIX . 'table', 'horizontalRule', 'hardBreak'],
        ['undo', 'redo', 'clearFormatting'],
        ['separator'],
    ];

    /**
     * How a dropdown is named in a toolbar.
     *
     * A toolbar is a flat list of IDs, and a dropdown is one of them: where it sits and what it
     * holds are separate decisions, so membership lives in `dropdowns` and this list is order
     * and presence only. The prefix is not decoration: a `table` dropdown and
     * a `table` button would otherwise be the same token, and one namespace for two kinds of
     * thing is a bug waiting for someone to register the wrong name.
     */
    public const DROPDOWN_PREFIX = 'dropdown:';

    /**
     * Dropdowns that have been renamed, old name => new.
     *
     * A stored toolbar names a dropdown by registration name, so renaming one would otherwise
     * silently delete it from every config that had placed it — `normalizeToolbar` drops a
     * dropdown whose registration has gone away, and from out there a rename is indistinguishable
     * from a plugin being uninstalled. Aliased on the way in instead, in both the toolbar and the
     * membership map, so a rename costs an author nothing.
     *
     * Only for renames, where old and new mean the same thing. A dropdown that has been *retired*
     * is not in here: Headings went because its job is now a trim of Formatting, and quietly
     * turning one into the other would be a change of meaning wearing a rename's clothes.
     */
    public const DROPDOWN_ALIASES = ['align' => 'alignment'];

    /**
     * Registry shorthand for "all six heading levels", expanded by `dropdownRoster`.
     *
     * A convenience for whoever writes a registration, and nothing more: it does not leave this
     * class. A roster, a stored membership, the catalog the builder is handed and the panel it
     * draws all deal in `heading1` … `heading6`.
     *
     * It was briefly a first-class member — stored as itself, drawn as one chip reading "Heading
     * levels: H2, H3, H4". The reason was sound: the build before that wrote the currently
     * allowed levels into the config the moment a dropdown was placed, which froze them, so
     * ticking H5 under Content schema afterwards did nothing to the menu. But the fix overshot.
     * Storing a *snapshot of the schema* is what freezes; storing all six is not, because six is
     * all there will ever be. So the levels are ordinary members, individually trimmable, and
     * `controlFor` drops the ones the schema disallows at render — which it already did.
     *
     * @see HEADING_LEVEL_IDS
     */
    public const HEADING_LEVELS_TOKEN = 'headingLevels';

    /**
     * What that shorthand means. Fixed at six, for as long as HTML has six.
     */
    public const HEADING_LEVEL_IDS = ['heading1', 'heading2', 'heading3', 'heading4', 'heading5', 'heading6'];
}
