import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const notes = defineCollection({
	loader: glob({
		pattern: ['**/*.md', '!AGENTS.md'],
		base: './src/content/notes',
	}),
});

export const collections = { notes };

