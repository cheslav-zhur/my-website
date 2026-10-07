import { defineHastPlugin } from 'satteri';
import { refreshNotesIndex, type NotesIndex } from './notes-index';

const WIKILINK_RE = /\[\[([^\]|#]+)(?:#[^\]|]*)?(?:\|([^\]]+))?\]\]/g;

type NotesIndexData = {
	notesIndex?: NotesIndex;
};

function isInsideCode(ctx: { parent: (node: unknown) => unknown }, node: unknown): boolean {
	let current: unknown = ctx.parent(node);
	while (current && typeof current === 'object') {
		const tagName = 'tagName' in current ? String((current as { tagName?: string }).tagName) : '';
		if (tagName === 'code' || tagName === 'pre') return true;
		current = ctx.parent(current);
	}
	return false;
}

/** Turn Obsidian `[[wikilinks]]` in note HTML into internal `/notes/.../` anchors. */
export function hastWikilinks() {
	return defineHastPlugin({
		name: 'hast-wikilinks',
		before(_root, ctx) {
			(ctx.data as NotesIndexData).notesIndex = refreshNotesIndex();
		},
		text(node, ctx) {
			if (!node.value.includes('[[')) return;
			if (isInsideCode(ctx, node)) return;

			const index = (ctx.data as NotesIndexData).notesIndex;
			if (!index) return;

			const value = node.value;
			const parts: Array<
				| { type: 'text'; value: string }
				| {
						type: 'element';
						tagName: string;
						properties: Record<string, unknown>;
						children: Array<{ type: 'text'; value: string }>;
				  }
			> = [];

			let lastIndex = 0;
			WIKILINK_RE.lastIndex = 0;
			let match: RegExpExecArray | null;

			while ((match = WIKILINK_RE.exec(value)) !== null) {
				if (match.index > 0 && value[match.index - 1] === '!') {
					continue;
				}

				if (match.index > lastIndex) {
					parts.push({ type: 'text', value: value.slice(lastIndex, match.index) });
				}

				const target = match[1]?.trim() ?? '';
				const label = (match[2] ?? match[1] ?? '').trim();
				const id = index.resolve(target);

				if (id) {
					parts.push({
						type: 'element',
						tagName: 'a',
						properties: { href: `/notes/${id}/` },
						children: [{ type: 'text', value: label }],
					});
				} else {
					parts.push({
						type: 'element',
						tagName: 'span',
						properties: { className: ['wikilink-missing'] },
						children: [{ type: 'text', value: match[0] }],
					});
				}

				lastIndex = match.index + match[0].length;
			}

			if (parts.length === 0) return;
			if (lastIndex < value.length) {
				parts.push({ type: 'text', value: value.slice(lastIndex) });
			}

			ctx.replaceNode(node, parts);
		},
	});
}
