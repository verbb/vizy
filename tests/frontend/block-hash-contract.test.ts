import { expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import fixtures from '../Fixtures/block-hashes.json';
import { hashFieldLayoutBlock } from '../../src/web/assets/field/src/ts/FieldLayoutLoader';

it.each(fixtures)('hashes $name against independently specified canonical JSON', async (fixture) => {
    expect(createHash('sha256').update(fixture.canonicalJson).digest('hex')).toBe(fixture.sha256);
    expect(await hashFieldLayoutBlock(fixture.block)).toBe(fixture.sha256);
});
