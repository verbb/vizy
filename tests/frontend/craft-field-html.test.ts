import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { applyCraftFieldHtml } from '../../src/web/assets/field/src/ts/craft-field-html';

describe('applyCraftFieldHtml', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
        document.head.querySelectorAll('link[href="data:text/css,body%7B%7D"]').forEach((node) => node.remove());
    });

    afterEach(() => {
        document.body.innerHTML = '';
        document.head.querySelectorAll('link[href="data:text/css,body%7B%7D"]').forEach((node) => node.remove());
    });

    it('parses stylesheet links into document.head without duplicating hrefs', () => {
        applyCraftFieldHtml('<link rel="stylesheet" href="data:text/css,body%7B%7D">');
        applyCraftFieldHtml('<link rel="stylesheet" href="data:text/css,body%7B%7D">');
        expect(document.head.querySelectorAll('link[href="data:text/css,body%7B%7D"]')).toHaveLength(1);
    });

    it('appends non-script nodes to the body parent', () => {
        applyCraftFieldHtml('<div id="craft-extra">x</div>');
        expect(document.getElementById('craft-extra')?.textContent).toBe('x');
    });
});
