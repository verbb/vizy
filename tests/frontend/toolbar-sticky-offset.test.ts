import { afterEach, describe, expect, it, vi } from 'vitest';
import {
    TOOLBAR_STICKY_TOP_VAR,
    applyToolbarStickyTop,
    measureLivePreviewStickyTopPx,
    measureSlideoutScrollportStickyTopPx,
    measureSlideoutStickyTopPx,
} from '../../src/web/assets/field/src/ts/toolbar/toolbar-sticky-offset';

const originalGetComputedStyle = window.getComputedStyle.bind(window);

describe('toolbar sticky offset (Live Preview + slideout)', () => {
    afterEach(() => {
        document.body.replaceChildren();
        vi.restoreAllMocks();
    });

    it('measures LP sticky top as header height minus content padding', () => {
        const container = document.createElement('div');
        container.className = 'lp-editor-container';
        const header = document.createElement('header');
        header.className = 'lp-editor-header';
        Object.defineProperty(header, 'offsetHeight', { value: 44, configurable: true });
        const content = document.createElement('div');
        content.className = 'lp-content';
        container.append(header, content);
        document.body.append(container);

        // Craft LP: absolute header (~44) + padding-block-start (~68) on the
        // scrollport — sticky top:0 already sits at the padding edge.
        vi.spyOn(window, 'getComputedStyle').mockImplementation((el) => {
            if (el === content) {
                return { paddingBlockStart: '68px' } as CSSStyleDeclaration;
            }
            return originalGetComputedStyle(el);
        });

        // 44 - 68 = -24 pulls the strip flush under the absolute header.
        expect(measureLivePreviewStickyTopPx()).toBe(-24);
    });

    it('returns 0 when Live Preview UI is absent', () => {
        expect(measureLivePreviewStickyTopPx()).toBe(0);
    });

    it('pins padded slideout .so-body at -padding (pane header is a sibling)', () => {
        const slideout = document.createElement('div');
        slideout.className = 'slideout';
        const header = document.createElement('div');
        header.className = 'pane-header';
        const body = document.createElement('div');
        body.className = 'so-body';
        slideout.append(header, body);
        document.body.append(slideout);

        vi.spyOn(window, 'getComputedStyle').mockImplementation((el) => {
            if (el === body) {
                return { paddingBlockStart: '24px' } as CSSStyleDeclaration;
            }
            return originalGetComputedStyle(el);
        });

        expect(measureSlideoutScrollportStickyTopPx(body)).toBe(-24);
        expect(measureSlideoutStickyTopPx()).toBe(0);
    });

    it('pins sidebar .so-content at 0 when padding is 0', () => {
        const content = document.createElement('div');
        content.className = 'so-content';
        document.body.append(content);

        vi.spyOn(window, 'getComputedStyle').mockImplementation((el) => {
            if (el === content) {
                return { paddingBlockStart: '0px' } as CSSStyleDeclaration;
            }
            return originalGetComputedStyle(el);
        });

        expect(measureSlideoutScrollportStickyTopPx(content)).toBe(0);
    });

    it('returns null when no slideout scrollport is present', () => {
        expect(measureSlideoutStickyTopPx()).toBeNull();
    });

    it('writes negative and positive --vizy-toolbar-sticky-top values', () => {
        const content = document.createElement('div');
        applyToolbarStickyTop(content, 52);
        expect(content.style.getPropertyValue(TOOLBAR_STICKY_TOP_VAR)).toBe('52px');
        applyToolbarStickyTop(content, -24);
        expect(content.style.getPropertyValue(TOOLBAR_STICKY_TOP_VAR)).toBe('-24px');
        applyToolbarStickyTop(content, null);
        expect(content.style.getPropertyValue(TOOLBAR_STICKY_TOP_VAR)).toBe('');
    });
});
