import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = 'content/notes';

/** True when frontmatter contains a `publish: ready` line. */
export function isPublishReadySource(text) {
	const end = text.startsWith('---') ? text.indexOf('\n---', 3) : -1;
	const frontmatter = end === -1 ? '' : text.slice(0, end);
	return /^publish:\s*['"]?ready['"]?\s*$/m.test(frontmatter);
}

function files(dir) {
	if (!fs.existsSync(dir)) return [];
	return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) return entry.name === '.obsidian' ? [] : files(full);
		if (!entry.name.endsWith('.md') || entry.name === 'AGENTS.md') return [];
		return [full];
	});
}

const isCli =
	process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (isCli) {
	if (!fs.existsSync(root)) {
		console.error(`Notes vault not found: ${root}`);
		process.exit(1);
	}

	const ready = files(root).filter((file) => isPublishReadySource(fs.readFileSync(file, 'utf8')));

	if (ready.length === 0) {
		console.log('No notes with publish: ready');
	} else {
		for (const file of ready.sort()) console.log(path.relative(root, file));
	}
}
