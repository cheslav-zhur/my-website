import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { notesDir } from './lib/notes-dir';

const notes = defineCollection({
	loader: glob({
		pattern: ['**/*.md', '!AGENTS.md'],
		base: `./${notesDir}`,
	}),
});

export const collections = { notes };

