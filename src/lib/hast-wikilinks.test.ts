import { describe, expect, it } from 'vitest';
import { hastWikilinks } from './hast-wikilinks';
import type { NotesIndex } from './notes-index';

const index: NotesIndex = {
	resolve(target) {
		return target.trim().toLowerCase() === 'known' ? 'areas/known' : undefined;
	},
	filenameStem() {
		return undefined;
	},
};

type TextNode = { type: 'text'; value: string };

function parentOf(node: TextNode, tagName?: string) {
	return (current: unknown) => {
		if (current === node && tagName) return { tagName };
		return undefined;
	};
}

function render(value: string, tagName?: string) {
	const plugin = hastWikilinks();
	const node: TextNode = { type: 'text', value };
	let replaced: unknown;
	plugin.text(node, {
		data: { notesIndex: index },
		parent: parentOf(node, tagName),
		replaceNode(_node, parts) {
			replaced = parts;
		},
	});
	return replaced;
}

describe('hastWikilinks', () => {
	it('turns a known wikilink into a note anchor', () => {
		expect(render('See [[known]] now')).toEqual([
			{ type: 'text', value: 'See ' },
			{
				type: 'element',
				tagName: 'a',
				properties: { href: '/notes/areas/known/' },
				children: [{ type: 'text', value: 'known' }],
			},
			{ type: 'text', value: ' now' },
		]);
	});

	it('uses the alias as the link text and drops a heading anchor', () => {
		const alias = render('[[known|Laos]]') as Array<{
			properties?: { href?: string };
			children?: Array<{ value: string }>;
		}>;
		expect(alias[0]?.children?.[0]?.value).toBe('Laos');

		const headed = render('[[known#visa]]') as Array<{ properties?: { href?: string } }>;
		expect(headed[0]?.properties?.href).toBe('/notes/areas/known/');
	});

	it('marks a missing target and leaves embeds and code alone', () => {
		const missing = render('[[gone]]') as Array<{ tagName: string; properties: { className: string[] } }>;
		expect(missing[0]?.tagName).toBe('span');
		expect(missing[0]?.properties.className).toEqual(['wikilink-missing']);

		expect(render('![[known]]')).toBeUndefined();
		expect(render('[[known]]', 'code')).toBeUndefined();
		expect(render('[[known]]', 'pre')).toBeUndefined();
	});
});
