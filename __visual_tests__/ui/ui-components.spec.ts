import { expect, test, type Page } from '@playwright/test';

import {
  UI_VISUAL_CASE_IDS,
  UI_VISUAL_MOBILE_SMOKE_CASE_IDS,
} from './visualCaseIds';

const baseUrl = 'http://localhost:5273';
const canvas = 'visual-case';
const visualCasesModuleUrl = `${baseUrl}/@fs${process.cwd()}/__visual_tests__/ui/VisualCases.tsx`;

async function mountVisualCase(page: Page, caseId: string) {
  await page.goto(baseUrl);
  await page.evaluate(() => {
    document.body.innerHTML = '<div id="visual-root"></div>';
  });
  await page.addScriptTag({
    type: 'module',
    content: `
      import { mountVisualCase } from ${JSON.stringify(visualCasesModuleUrl)};
      mountVisualCase(${JSON.stringify(caseId)});
    `,
  });
  await page.getByTestId(canvas).waitFor();
}

test.describe('ui visual cases', () => {
  for (const caseId of UI_VISUAL_CASE_IDS) {
    test(caseId, async ({ page }) => {
      await mountVisualCase(page, caseId);
      await expect(page.getByTestId(canvas)).toHaveScreenshot({ omitBackground: false });
    });
  }
});

test.describe('ui mobile smoke visual cases', () => {
  for (const caseId of UI_VISUAL_MOBILE_SMOKE_CASE_IDS) {
    test(`mobile-${caseId}`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await mountVisualCase(page, caseId);
      await expect(page.getByTestId(canvas)).toHaveScreenshot({ omitBackground: false });
    });
  }
});
