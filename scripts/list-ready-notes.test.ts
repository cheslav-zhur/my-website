import { describe, expect, it } from 'vitest';
import { isPublishReadySource } from './list-ready-notes.mjs';

describe('isPublishReadySource', () => {
	it('matches a ready line with or without quotes', () => {
		expect(isPublishReadySource('---\npublish: ready\n---\n')).toBe(true);
		expect(isPublishReadySource('---\npublish: "ready"\n---\n')).toBe(true);
		expect(isPublishReadySource("---\npublish: 'ready'\n---\n")).toBe(true);
	});

	it('rejects drafts, missing frontmatter, and trailing words', () => {
		expect(isPublishReadySource('---\npublish: draft\n---\n')).toBe(false);
		expect(isPublishReadySource('No frontmatter')).toBe(false);
		expect(isPublishReadySource('---\npublish: ready later\n---\n')).toBe(false);
		expect(isPublishReadySource('publish: ready\n')).toBe(false);
	});
});
