// @ts-check
import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import tailwindcss from '@tailwindcss/vite';
import { hastWikilinks } from './src/lib/hast-wikilinks.ts';

// https://astro.build/config
export default defineConfig({
  markdown: {
    processor: satteri({
      hastPlugins: [hastWikilinks()],
    }),
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
