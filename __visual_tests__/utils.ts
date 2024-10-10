import { Page, expect, test } from '@playwright/test';

const selectors = {
  input: 'form-input',
  canvas: 'form-rendered',
};

export async function fillForm(page: Page, form: string) {
  await page.getByTestId(selectors.input).fill(form);
}

export async function assertScreenshot(page: Page) {
  return expect(page.getByTestId(selectors.canvas)).toHaveScreenshot({ omitBackground: false });
}

export function runBeforeEach() {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5273/');
    await page.getByTestId(selectors.input).click();
  });
}
