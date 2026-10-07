import fs from 'node:fs';
import path from 'node:path';

const root = 'content/notes';

if (!fs.existsSync(root)) {
	console.error(`Notes vault not found: ${root}`);
	process.exit(1);
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

const ready = files(root).filter((file) => {
	const text = fs.readFileSync(file, 'utf8');
	const end = text.startsWith('---') ? text.indexOf('\n---', 3) : -1;
	const frontmatter = end === -1 ? '' : text.slice(0, end);
	return /^publish:\s*['"]?ready['"]?\s*$/m.test(frontmatter);
});

if (ready.length === 0) {
	console.log('No notes with publish: ready');
} else {
	for (const file of ready.sort()) console.log(path.relative(root, file));
}
