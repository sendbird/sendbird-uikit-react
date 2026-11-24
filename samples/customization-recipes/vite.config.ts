import { resolve } from 'node:path';
import { defineConfig } from 'vite';

const topics = [
  'message-timestamp-and-reaction',
  'composer-above-message-list',
  'theme-variables-and-css',
  'jump-to-latest-and-send-icon',
  'composer-action-button',
  'product-message-and-channel-preview',
  'per-screen-channel-options',
  'copy-message-id-menu',
  'localized-reply-count',
  'upgrade-and-migration',
];

const page = (...path: string[]) => resolve(import.meta.dirname, ...path, 'index.html');

// One production build contains the gallery and one page per topic.
// Every page shares one UIKit chunk, which is larger than Vite's default warning limit.
export default defineConfig({
  build: {
    chunkSizeWarningLimit: 2_000,
    rolldownOptions: { input: [page(), ...topics.map(topic => page(topic))] },
  },
});
