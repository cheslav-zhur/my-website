import fs from 'node:fs';
import path from 'node:path';
import { notesDir } from './notes-dir';
import { includeInSite } from './publish';

const VAULT_DIR = path.resolve(notesDir);
const SKIP_FILES = new Set(['AGENTS.md']);

export type NotesIndex = {
	resolve(target: string): string | undefined;
	/** Original filename stem (preserves casing/spaces), without `.md`. */
	filenameStem(id: string): string | undefined;
};

function slugifySegment(value: string): string {
	return value.trim().toLowerCase().replace(/\s+/g, '-');
}

function toNoteId(relativePath: string): string {
	const withoutExt = relativePath.replace(/\.md$/i, '');
	return withoutExt
		.split(path.sep)
		.map((segment) => slugifySegment(segment))
		.join('/');
}

function frontmatterField(source: string, key: string): string {
	if (!source.startsWith('---')) return '';
	const end = source.indexOf('\n---', 3);
	if (end === -1) return '';
	const match = source
		.slice(0, end)
		.match(new RegExp(`^${key}:\\s*(?:["']([^"']+)["']|(.+))\\s*$`, 'm'));
	return (match?.[1] ?? match?.[2] ?? '').trim();
}

function readTitle(source: string, fallback: string): string {
	return frontmatterField(source, 'title') || fallback;
}

function walkMarkdownFiles(dir: string): string[] {
	if (!fs.existsSync(dir)) return [];

	const out: string[] = [];
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			if (entry.name === '.obsidian') continue;
			out.push(...walkMarkdownFiles(full));
			continue;
		}
		if (!entry.isFile() || !entry.name.endsWith('.md')) continue;
		if (SKIP_FILES.has(entry.name)) continue;
		out.push(full);
	}
	return out;
}

/** Build a resolver for Obsidian-style `[[target]]` → note id. */
export function buildNotesIndex(vaultDir = VAULT_DIR): NotesIndex {
	const ids = new Set<string>();
	const stems = new Map<string, string>();
	const byBasename = new Map<string, string[]>();
	const byTitle = new Map<string, string[]>();

	const add = (map: Map<string, string[]>, key: string, id: string) => {
		const normalized = key.trim().toLowerCase();
		if (!normalized) return;
		const list = map.get(normalized) ?? [];
		if (!list.includes(id)) list.push(id);
		map.set(normalized, list);
	};

	for (const filePath of walkMarkdownFiles(vaultDir)) {
		const relative = path.relative(vaultDir, filePath);
		const id = toNoteId(relative);
		const stem = path.basename(relative, '.md');
		const source = fs.readFileSync(filePath, 'utf8');
		if (!includeInSite({ publish: frontmatterField(source, 'publish') })) continue;
		const title = readTitle(source, stem);

		ids.add(id);
		stems.set(id, stem);
		add(byBasename, stem, id);
		add(byBasename, slugifySegment(stem), id);
		add(byTitle, title, id);
	}

	const unique = (map: Map<string, string[]>, key: string): string | undefined => {
		const list = map.get(key.trim().toLowerCase());
		return list?.length === 1 ? list[0] : undefined;
	};

	return {
		resolve(target: string): string | undefined {
			const cleaned = target
				.trim()
				.replace(/\\/g, '/')
				.replace(/\.md$/i, '')
				.replace(/#.*/, '')
				.trim();
			if (!cleaned) return undefined;

			const asId = cleaned.split('/').map(slugifySegment).filter(Boolean).join('/');
			if (ids.has(asId)) return asId;

			const base = cleaned.includes('/') ? cleaned.slice(cleaned.lastIndexOf('/') + 1) : cleaned;
			return unique(byBasename, base) ?? unique(byBasename, slugifySegment(base)) ?? unique(byTitle, cleaned);
		},
		filenameStem(id: string): string | undefined {
			return stems.get(id);
		},
	};
}

let cachedIndex: NotesIndex | null = null;

export function getNotesIndex(): NotesIndex {
	if (!cachedIndex) cachedIndex = buildNotesIndex();
	return cachedIndex;
}

export function refreshNotesIndex(): NotesIndex {
	cachedIndex = buildNotesIndex();
	return cachedIndex;
}
