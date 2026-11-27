import { resolve } from 'node:path';
import { defineConfig } from 'vite';

import { readRecipeTopics } from './scripts/recipe-topics.ts';

const topics = readRecipeTopics(import.meta.dirname);

const page = (...path: string[]) => resolve(import.meta.dirname, ...path, 'index.html');

// One production build contains the gallery and one page per topic.
// Every page shares one UIKit chunk, which is larger than Vite's default warning limit.
export default defineConfig({
  build: {
    chunkSizeWarningLimit: 2_000,
    rolldownOptions: { input: [page(), ...topics.map(topic => page(topic))] },
  },
});
