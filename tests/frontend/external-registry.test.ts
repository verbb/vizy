import { Mark } from '@tiptap/core';
import { afterEach, describe, expect, it } from 'vitest';
import {
    applyModuleReplacers,
    getExternalModuleFactory,
    getRegisteredControl,
    registerControl,
    registerModule,
    replaceModule,
    resetExternalRegistryForTests,
} from '../../src/web/assets/field/src/ts/external-registry';
import { resolveTrustedModules, TRUSTED_MODULES } from '../../src/web/assets/field/src/ts/modules';

describe('partner TipTap module registry', () => {
    afterEach(() => {
        resetExternalRegistryForTests();
    });

    it('registers an external module factory by PHP module id', () => {
        const Abbr = Mark.create({ name: 'abbr' });
        registerModule('acme/mark/abbr', () => Abbr);

        expect(getExternalModuleFactory('acme/mark/abbr')).toBeTypeOf('function');
        expect(resolveTrustedModules(['acme/mark/abbr']).map((ext) => ext.name)).toEqual(['abbr']);
    });

    it('refuses to overwrite the vizy/core namespace via registerModule', () => {
        expect(() => registerModule('vizy/core/mark/bold', () => Mark.create({ name: 'bold' })))
            .toThrow(/vizyRegisterModuleCoreId/);
    });

    it('fails closed when a manifest module id was never registered', () => {
        expect(() => resolveTrustedModules(['acme/mark/missing']))
            .toThrow('untrustedEditorModule:acme/mark/missing');
    });

    it('still resolves core modules from the compile-time map', () => {
        expect(TRUSTED_MODULES['vizy/core/mark/bold']).toBeTypeOf('function');
        const [bold] = resolveTrustedModules(['vizy/core/mark/bold']);
        expect(bold.name).toBe('bold');
    });

    it('applies replaceModule by TipTap extension name', () => {
        let seen = false;
        replaceModule('bold', ({ extension }) => {
            seen = true;
            return extension;
        });

        const [bold] = resolveTrustedModules(['vizy/core/mark/bold']);
        expect(seen).toBe(true);
        expect(bold.name).toBe('bold');
    });

    it('stores registerControl runners for custom toolbar commands', () => {
        const run = () => true;
        registerControl('abbr', { run, isActive: () => false });
        expect(getRegisteredControl('abbr')?.run).toBe(run);
    });

    it('applyModuleReplacers is a no-op without replacers', () => {
        const [bold] = resolveTrustedModules(['vizy/core/mark/bold']);
        expect(applyModuleReplacers([bold])).toEqual([bold]);
    });
});
