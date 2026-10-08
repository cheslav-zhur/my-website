import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

let hooksDir;
try {
  hooksDir = execFileSync('git', ['rev-parse', '--git-path', 'hooks'], {
    encoding: 'utf8',
  }).trim();
} catch {
  process.exit(0);
}

const source = new URL('./git-hooks/pre-push', import.meta.url);
fs.mkdirSync(hooksDir, { recursive: true });
fs.copyFileSync(source, path.join(hooksDir, 'pre-push'));
fs.chmodSync(path.join(hooksDir, 'pre-push'), 0o755);
