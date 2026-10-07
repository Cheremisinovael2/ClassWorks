import { cpSync, mkdirSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
for (const [name, source] of [['random-number-generator', 'random-number-generator'], ['wheel-of-fortune', 'wheel-of-fortune/dist']]) {
  const target = resolve(root, 'site/public', name);
  rmSync(target, { recursive: true, force: true });
  mkdirSync(target, { recursive: true });
  cpSync(resolve(root, source), target, { recursive: true, filter: path => !['source', '.git', 'node_modules'].includes(path.split(/[\\/]/).at(-1)) });
}
