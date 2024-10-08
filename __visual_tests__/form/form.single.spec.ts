import { test } from '@playwright/test';

import { formSingleFixture } from '../__fixtures__/form/form.single.fixture';
import { assertScreenshot, fillForm, runBeforeEach } from '../utils';

runBeforeEach();

formSingleFixture.forEach(({ name, form }) => {
  test(name, async ({ page }) => {
    await fillForm(page, JSON.stringify(form));
    await assertScreenshot(page);
  });
});
