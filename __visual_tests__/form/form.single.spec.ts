import { Page, test } from '@playwright/test';

import { assertScreenshot, fillForm, runBeforeEach } from '../utils';
import { MockMessageFormProps } from '../__fixtures__/form/interface';

runBeforeEach();

test('100', async ({ page }) => {
  const form: MockMessageFormProps = {
    name: 'test form',
    items: [
      {
        name: 'text input',
        required: true,
        sort_order: 0,
        placeholder: 'hint',
        style: {
          layout: 'text',
        },
        validators: [
          {
            key: 'regex',
            regex: '^[0-9]+$',
          },
        ],
      },
    ],
  };
  await fillForm(page, JSON.stringify(form));
  await testDraftValues(page, form);
  await assertScreenshot(page);
});

test('101', async ({ page }) => {
  const form: MockMessageFormProps = {
    name: 'test form',
    items: [
      {
        name: 'text input',
        required: true,
        sort_order: 0,
        placeholder: 'hint',
        style: {
          layout: 'text',
        },
        validators: [
          {
            key: 'regex',
            regex: '^[0-9]+$',
          },
        ],
        draft_values: [
          '123',
        ],
      },
    ],
  };
  await fillForm(page, JSON.stringify(form));
  await testDraftValues(page, form);
  await assertScreenshot(page);
});

test('102', async ({ page }) => {
  const form: MockMessageFormProps = {
    name: 'test form',
    items: [
      {
        name: 'text input',
        required: true,
        sort_order: 0,
        placeholder: 'hint',
        style: {
          layout: 'text',
        },
        validators: [
          {
            key: 'regex',
            regex: '^[0-9]+$',
          },
        ],
      },
    ],
  };
  await fillForm(page, JSON.stringify(form));
  await testDraftValues(page, form, true);
  await assertScreenshot(page);
});

test('103', async ({ page }) => {
  const form: MockMessageFormProps = {
    name: 'test form',
    items: [
      {
        name: 'text input',
        required: true,
        sort_order: 0,
        placeholder: 'hint',
        style: {
          layout: 'text',
        },
        validators: [
          {
            key: 'regex',
            regex: '^[0-9]+$',
          },
        ],
        draft_values: [
          'test',
        ],
      },
    ],
  };
  await fillForm(page, JSON.stringify(form));
  await testDraftValues(page, form);
  await assertScreenshot(page);
});

async function testDraftValues(page: Page, form: MockMessageFormProps, clickSubmit = false) {
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
    const submitButton = page.locator('.sendbird-form-message__submit-button');
    await submitButton.click();
  }
}

async function fillDraftValue(page: Page, layout: string, index: number, values: string[]) {
  // Locate the input field using its className
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
      await Promise.all(values.map(async (value) => {
        // Locate the child element whose child has the specific value.
        const targetChild = chipRoot.locator('> *').locator(':scope', { hasText: value });
        await targetChild.click();
      }));
      break;
    }
    default:
  }
}
