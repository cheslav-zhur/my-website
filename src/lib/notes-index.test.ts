import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { buildNotesIndex } from './notes-index';

const dirs: string[] = [];

afterEach(() => {
	for (const dir of dirs.splice(0)) fs.rmSync(dir, { recursive: true, force: true });
});

function vault(files: Record<string, string>): string {
	const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'notes-index-'));
	dirs.push(dir);
	for (const [name, body] of Object.entries(files)) {
		const file = path.join(dir, name);
		fs.mkdirSync(path.dirname(file), { recursive: true });
		fs.writeFileSync(file, body);
	}
	return dir;
}

const ready = (title: string, body = 'Body') => `---\ntitle: ${title}\npublish: ready\n---\n${body}\n`;

describe('buildNotesIndex', () => {
	it('resolves a path, a basename, a title, and the original stem', () => {
		const index = buildNotesIndex(
			vault({
				'areas/Travel Notes.md': ready('Laos'),
			}),
		);

		expect(index.resolve('areas/travel-notes')).toBe('areas/travel-notes');
		expect(index.resolve('Travel Notes')).toBe('areas/travel-notes');
		expect(index.resolve('travel-notes.md')).toBe('areas/travel-notes');
		expect(index.resolve('areas/Travel Notes.md')).toBe('areas/travel-notes');
		expect(index.resolve('Laos')).toBe('areas/travel-notes');
		expect(index.filenameStem('areas/travel-notes')).toBe('Travel Notes');
	});

	it('returns undefined when a basename or title matches more than one note', () => {
		const index = buildNotesIndex(
			vault({
				'a/Note.md': ready('Same'),
				'b/Note.md': ready('Same'),
			}),
		);

		expect(index.resolve('Note')).toBeUndefined();
		expect(index.resolve('Same')).toBeUndefined();
		expect(index.resolve('a/note')).toBe('a/note');
	});

	it('returns undefined for an empty or unknown target', () => {
		const index = buildNotesIndex(vault({ 'only.md': ready('Only') }));
		expect(index.resolve('   ')).toBeUndefined();
		expect(index.resolve('missing')).toBeUndefined();
	});

	it('skips AGENTS.md and the .obsidian directory', () => {
		const index = buildNotesIndex(
			vault({
				'AGENTS.md': ready('Agents'),
				'.obsidian/cache.md': ready('Cache'),
				'kept.md': ready('Kept'),
			}),
		);

		expect(index.resolve('Agents')).toBeUndefined();
		expect(index.resolve('Cache')).toBeUndefined();
		expect(index.resolve('Kept')).toBe('kept');
	});
});
