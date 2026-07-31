/// <reference types="node" />
import * as fs from 'fs';
import * as path from 'path';
import { defineConfig, devices } from '@playwright/test';

/**
 * E2E Playwright config — separate from playwright.config.ts (which runs visual tests against
 * apps/visual-test). This drives the real apps/testing app in a real browser against a real
 * Sendbird backend. apps/testing is reused unmodified: connection + feature config is injected
 * via URL query params (see e2e/utils/env.ts).
 */

// Load .env.e2e without a dotenv dependency. Already-set vars (CI secrets) take precedence.
const envFile = path.resolve(__dirname, '.env.e2e');
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, 'utf8').split('\n')) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
    if (match && process.env[match[1]] === undefined) {
      process.env[match[1]] = match[2].replace(/^["']|["']$/g, '');
    }
  }
}

const PORT = Number(process.env.E2E_PORT || 5173);
const BASE_URL = process.env.E2E_BASE_URL || `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.spec.ts',
  globalSetup: './e2e/global-setup.ts',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: process.env.CI
    ? [['junit', { outputFile: 'test-results/e2e-results.xml' }], ['html', { open: 'never' }]]
    : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: BASE_URL,
    trace: process.env.E2E_ACCESS_TOKEN ? 'off' : 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    // Add webkit / mobile viewports as coverage grows.
  ],
  // Start apps/testing locally; skip when E2E_BASE_URL points at a deployed preview.
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
      command: 'yarn workspace @uikit-app/testing dev',
      url: BASE_URL,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
});
