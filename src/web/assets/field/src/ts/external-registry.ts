import type { AnyExtension, Editor } from '@tiptap/core';
import type { TrustedModuleContext, TrustedModuleFactory } from './modules';

/**
 * Runtime TipTap module + toolbar control registry for third-party extensions.
 *
 * Core modules stay in the compile-time map in `modules.ts`. Partners register
 * factories here under the same module IDs PHP declared on
 * `EVENT_REGISTER_EXTENSIONS`. The editor only loads IDs listed in the field
 * manifest — registration alone never injects into every field.
 */

export type ModuleReplacer = (args: {
    extension: AnyExtension;
    context?: TrustedModuleContext;
}) => AnyExtension;

export interface RegisteredControl {
    /** Run the toolbar / bubble action. */
    run: (editor: Editor, args?: Record<string, unknown>) => boolean | void;
    /** Whether the control should appear pressed. */
    isActive?: (editor: Editor, args?: Record<string, unknown>) => boolean;
    /** Optional visibility gate for the control. */
    isVisible?: (editor: Editor, args?: Record<string, unknown>) => boolean;
}

const externalModules = new Map<string, TrustedModuleFactory>();
const moduleReplacers = new Map<string, ModuleReplacer>();
const registeredControls = new Map<string, RegisteredControl>();

/**
 * Register a TipTap factory for a PHP-declared module ID (e.g. `acme/mark/abbr`).
 * Core `vizy/core/…` IDs cannot be overwritten here — use {@link replaceModule}.
 */
export function registerModule(id: string, factory: TrustedModuleFactory): void {
    if (typeof id !== 'string' || id === '') {
        throw new Error('vizyRegisterModuleInvalidId');
    }
    if (id.startsWith('vizy/core/')) {
        throw new Error(`vizyRegisterModuleCoreId:${id}`);
    }
    if (typeof factory !== 'function') {
        throw new Error(`vizyRegisterModuleInvalidFactory:${id}`);
    }
    externalModules.set(id, factory);
}

/**
 * Replace or reconfigure an already-resolved TipTap extension by its schema name
 * (e.g. `heading`). Only affects extensions the manifest loaded.
 */
export function replaceModule(tipTapName: string, replacer: ModuleReplacer): void {
    if (typeof tipTapName !== 'string' || tipTapName === '') {
        throw new Error('vizyReplaceModuleInvalidName');
    }
    if (typeof replacer !== 'function') {
        throw new Error(`vizyReplaceModuleInvalidReplacer:${tipTapName}`);
    }
    moduleReplacers.set(tipTapName, replacer);
}

/**
 * Optional client runner for a toolbar / bubble control id.
 *
 * Standard marks/nodes that PHP already maps to `toggleMark` / `toggleNode` /
 * `insertNode` do not need this — the built-in action table handles them.
 * Use it for custom commands (dialogs, multi-step flows).
 */
export function registerControl(id: string, control: RegisteredControl): void {
    if (typeof id !== 'string' || id === '') {
        throw new Error('vizyRegisterControlInvalidId');
    }
    if (!control || typeof control.run !== 'function') {
        throw new Error(`vizyRegisterControlInvalid:${id}`);
    }
    registeredControls.set(id, control);
}

export function getRegisteredControl(id: string): RegisteredControl | undefined {
    return registeredControls.get(id);
}

export function getExternalModuleFactory(id: string): TrustedModuleFactory | undefined {
    return externalModules.get(id);
}

export function applyModuleReplacers(
    extensions: AnyExtension[],
    context?: TrustedModuleContext,
): AnyExtension[] {
    if (moduleReplacers.size === 0) {
        return extensions;
    }

    return extensions.map((extension) => {
        const replacer = moduleReplacers.get(extension.name);
        if (!replacer) {
            return extension;
        }
        const next = replacer({ extension, context });
        if (!next || typeof next !== 'object' || typeof next.name !== 'string') {
            throw new Error(`vizyReplaceModuleInvalidResult:${extension.name}`);
        }
        return next;
    });
}

/** Test helper — clears partner registrations between cases. */
export function resetExternalRegistryForTests(): void {
    externalModules.clear();
    moduleReplacers.clear();
    registeredControls.clear();
}
