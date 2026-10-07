import { getNotesIndex } from './notes-index';

/** Display title: frontmatter `title`, else original filename stem from the vault. */
export function noteTitle(data: { title?: unknown }, id: string): string {
	const fromData = data.title;
	if (typeof fromData === 'string' && fromData.trim()) return fromData.trim();

	const stem = getNotesIndex().filenameStem(id);
	if (stem) return stem;

	const base = id.includes('/') ? id.slice(id.lastIndexOf('/') + 1) : id;
	return base.replace(/-/g, ' ');
}
