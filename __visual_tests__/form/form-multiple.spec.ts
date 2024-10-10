import { Page, test } from '@playwright/test';

import { assertScreenshot, fillForm, runBeforeEach } from '../utils';
import { MockMessageFormProps } from '../__fixtures__/form/interface';

runBeforeEach();

test('201', async ({ page }) => {
  const form: MockMessageFormProps = {
    name: 'test form',
    items: [
      {
        name: 'Text form',
        required: true,
        sort_order: 0,
        placeholder: 'Text hint',
        style: {
          layout: 'text',
        },
        draft_values: [],
      },
      {
        name: 'Textarea form',
        required: true,
        sort_order: 0,
        placeholder: 'Textarea hint',
        style: {
          layout: 'textarea',
        },
      },
      {
        name: 'Chip form',
        required: true,
        sort_order: 0,
        style: {
          layout: 'chip',
          options: [
            'Chip1',
            'Chip2',
            'Chip3',
            'Chip4Chip4Chip4Chip4Chip4Chip4Chip4Chip4Chip4Chip4Chip4Chip4Chip4Chip4Chip4Chip4Chip4Chip4'
            + 'Chip4Chip4Chip4Chip4Chip4Chip4Chip4Chip4',
          ],
        },
      },
    ],
  };
  await fillForm(page, JSON.stringify(form));
  await testDraftValues(page, form);
  await assertScreenshot(page);
});

test('202', async ({ page }) => {
  const form: MockMessageFormProps = {
    name: 'test form',
    items: [
      {
        name: 'Text form 1',
        required: true,
        sort_order: 0,
        placeholder: 'Text 1 hint',
        style: {
          layout: 'text',
        },
      },
      {
        name: 'Text form 1',
        required: false,
        sort_order: 1,
        placeholder: 'Text 2 hint',
        style: {
          layout: 'text',
        },
      },
    ],
  };
  await fillForm(page, JSON.stringify(form));
  await testDraftValues(page, form);
  await assertScreenshot(page);
});

test('203', async ({ page }) => {
  const form: MockMessageFormProps = {
    name: 'test form',
    items: [
      {
        name: 'Textarea form 1',
        required: true,
        sort_order: 0,
        placeholder: 'Textarea 1 hint',
        style: {
          layout: 'textarea',
        },
      },
      {
        name: 'Textarea form 2',
        required: false,
        sort_order: 1,
        placeholder: 'Textarea 2 hint',
        style: {
          layout: 'textarea',
        },
      },
    ],
  };
  await fillForm(page, JSON.stringify(form));
  await testDraftValues(page, form);
  await assertScreenshot(page);
});

test('204', async ({ page }) => {
  const form: MockMessageFormProps = {
    name: 'test form',
    items: [
      {
        name: 'Chip form 1',
        required: true,
        sort_order: 0,
        style: {
          layout: 'chip',
          options: [
            'Chip1',
            'Chip2',
            'Chip3',
            'Chip4',
          ],
        },
      },
      {
        name: 'Chip form 2',
        required: true,
        sort_order: 1,
        style: {
          layout: 'chip',
          options: [
            'Chip5',
            'Chip6',
            'Chip7',
            'Chip8',
          ],
          default_options: [
            'Chip5',
          ],
        },
      },
      {
        name: 'Chip form 3',
        required: true,
        sort_order: 2,
        style: {
          layout: 'chip',
          options: [
            'Chip9',
            'Chip10',
            'Chip11',
            'Chip12',
          ],
        },
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
