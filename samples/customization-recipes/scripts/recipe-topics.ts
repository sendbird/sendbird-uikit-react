import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

export function readRecipeTopics(root: string) {
  return readdirSync(root, { withFileTypes: true })
    .filter(entry => entry.isDirectory()
      && existsSync(join(root, entry.name, 'index.html'))
      && existsSync(join(root, entry.name, 'README.md')))
    .map(entry => entry.name)
    .sort();
}
