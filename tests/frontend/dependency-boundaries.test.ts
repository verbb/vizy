import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { expect, it } from 'vitest';

it('does not ship the Vizy 3 Vue CodeMirror bridge or CodeMirror 5 package', () => {
    const lock = JSON.parse(readFileSync(resolve(process.cwd(), 'package-lock.json'), 'utf8'));

    expect(lock.packages).not.toHaveProperty('node_modules/codemirror-editor-vue3');
    expect(lock.packages).not.toHaveProperty('node_modules/codemirror');
});
