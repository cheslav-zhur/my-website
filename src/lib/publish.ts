/** Frontmatter `publish: ready` marks a note for the static site. */
export function isPublishReady(data: { publish?: unknown } | null | undefined): boolean {
	return data?.publish === 'ready';
}

/** Drafts stay on `pnpm dev`. `astro build` keeps only `publish: ready`. */
export function includeInSite(
	data: { publish?: unknown } | null | undefined,
	prod = import.meta.env.PROD,
): boolean {
	return !prod || isPublishReady(data);
}
