import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

const zero = '0000000000000000000000000000000000000000';

function git(args) {
  return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
}

function lines(text) {
  return text.split('\n').filter(Boolean);
}

function isPrivate(file) {
  if (file === 'content/notes' || file.startsWith('content/notes/')) return true;
  if (file === 'archive' || file.startsWith('archive/')) return true;
  const base = file.slice(file.lastIndexOf('/') + 1);
  return base.startsWith('.env');
}

function report(found) {
  const leaked = [...new Set(found.filter(isPrivate))].sort();
  if (leaked.length === 0) return;
  console.error('These paths must stay out of git:');
  for (const file of leaked) console.error(`  ${file}`);
  process.exit(1);
}

if (process.argv.includes('--push')) {
  const found = [];
  for (const line of lines(fs.readFileSync(0, 'utf8'))) {
    const [, localSha, , remoteSha] = line.split(/\s+/);
    if (!localSha || localSha === zero) continue;
    found.push(...lines(git(['ls-tree', '-r', '--name-only', localSha])));
    const range = remoteSha === zero ? localSha : `${remoteSha}..${localSha}`;
    found.push(
      ...lines(
        git(['log', '--diff-filter=ARC', '--name-only', '--pretty=format:', range])
      )
    );
  }
  report(found);
} else {
  report(lines(git(['ls-files'])));
}
