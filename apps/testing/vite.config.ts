import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import vitePluginSvgr from 'vite-plugin-svgr';
import postcssRtl from "postcss-rtlcss";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), vitePluginSvgr({ include: '**/*.svg' })],
  css: {
    postcss: {
      plugins: [postcssRtl({ mode: 'override' })],
    },
  },
});
