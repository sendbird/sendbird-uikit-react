import { Page, expect, test, Locator } from '@playwright/test';
import { MockMessageFormProps } from './__fixtures__/form/interface';

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

/**
 * This function takes form json object, fills draft_values (it is not defined in SDK nor server) as if
 * a user fills out input values. Afterward, if clickSubmit argument is given as true, the function clicks
 * submit button.
 */
export async function testDraftValues(page: Page, form: MockMessageFormProps, clickSubmit = false) {
  let numPriorChips = 0;
  await Promise.all(form.items.map(async (item, index) => {
    if (item.draft_values && item.draft_values.length > 0) {
      const layout: string = item.style['layout'];
      if (layout === 'chip') {
        await fillDraftValue(page, layout, numPriorChips++, item.draft_values);
      } else {
        await fillDraftValue(page, layout, index - numPriorChips, item.draft_values);
      }
    }
  }));
  if (clickSubmit) {
    await submitForm(page);
  }
}

async function submitForm(page: Page) {
  const submitButton = page.locator('.sendbird-form-message__submit-button');
  await submitButton.click();
}

async function fillDraftValue(page: Page, layout: string, index: number, values: string[]) {
  switch (layout) {
    case 'text':
    case 'textarea':
    case 'number':
    case 'phone':
    case 'email': {
      const inputField = page.locator('.sendbird-input__input').nth(index);
      await inputField.fill(values[0]);
      break;
    }
    case 'chip': {
      const chipRoot = page.locator('.sendbird-form-message__input__chip-container').nth(index);
      await toggleChips(page, chipRoot, values);
      break;
    }
    default:
  }
}

async function toggleChips(page: Page, chipContainer: Locator, chipsToToggle: string[]) {
  await Promise.all(chipsToToggle.map(async (value) => {
    // Locate the child element whose child has the specific value.
    const targetChild = chipContainer.locator('> *').locator(':scope', { hasText: value });
    await targetChild.click();
  }));
}
