import { describe, expect, it } from 'vitest';
import { includeInSite, isPublishReady } from './publish';

describe('isPublishReady', () => {
	it('accepts only the ready string', () => {
		expect(isPublishReady({ publish: 'ready' })).toBe(true);
		expect(isPublishReady({ publish: 'draft' })).toBe(false);
		expect(isPublishReady({ publish: 'Ready' })).toBe(false);
		expect(isPublishReady({})).toBe(false);
		expect(isPublishReady(null)).toBe(false);
		expect(isPublishReady(undefined)).toBe(false);
	});
});

describe('includeInSite', () => {
	it('keeps drafts when the site is not a production build', () => {
		expect(includeInSite({ publish: 'draft' }, false)).toBe(true);
		expect(includeInSite({}, false)).toBe(true);
		expect(includeInSite(null, false)).toBe(true);
	});

	it('keeps only ready notes in a production build', () => {
		expect(includeInSite({ publish: 'ready' }, true)).toBe(true);
		expect(includeInSite({ publish: 'draft' }, true)).toBe(false);
		expect(includeInSite({}, true)).toBe(false);
		expect(includeInSite(null, true)).toBe(false);
	});
});
