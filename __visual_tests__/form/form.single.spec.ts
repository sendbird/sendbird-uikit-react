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
  await testDraftValues(page, form, true);
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
  await testDraftValues(page, form, true);
  await assertScreenshot(page);
});

test('104', async ({ page }) => {
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
        draft_values: [
          'long text test long text test long text test long text test long text test long text test long '
          + 'text test long text test long text test long text test long text test long text test long text '
          + 'test long text test long text test long text test long text test long text test long text test '
          + 'long text test',
        ],
      },
    ],
  };
  await fillForm(page, JSON.stringify(form));
  await testDraftValues(page, form, true);
  await assertScreenshot(page);
});

test('105', async ({ page }) => {
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
        values: [
          'long text test long text test long text test long text test long text test long text test long '
          + 'text test long text test long text test long text test long text test long text test long text '
          + 'test long text test long text test long text test long text test long text test long text test '
          + 'long text test',
        ],
      },
    ],
  };
  await fillForm(page, JSON.stringify(form));
  await testDraftValues(page, form);
  await assertScreenshot(page);
});

test('106', async ({ page }) => {
  const form: MockMessageFormProps = {
    name: 'test form',
    items: [
      {
        name: 'text input',
        required: true,
        sort_order: 0,
        placeholder: 'hint',
        style: {
          layout: 'textarea',
        },
        validators: [
          {
            key: 'text',
            min_length: 0,
            max_length: 10,
          },
        ],
      },
    ],
  };
  await fillForm(page, JSON.stringify(form));
  await testDraftValues(page, form);
  await assertScreenshot(page);
});

test('107', async ({ page }) => {
  const form: MockMessageFormProps = {
    name: 'test form',
    items: [
      {
        name: 'text input',
        required: true,
        sort_order: 0,
        placeholder: 'hint',
        style: {
          layout: 'textarea',
        },
        validators: [
          {
            key: 'text',
            min_length: 0,
            max_length: 10,
          },
        ],
        draft_values: [
          'test test',
        ],
      },
    ],
  };
  await fillForm(page, JSON.stringify(form));
  await testDraftValues(page, form, true);
  await assertScreenshot(page);
});

test('108', async ({ page }) => {
  const form: MockMessageFormProps = {
    name: 'test form',
    items: [
      {
        name: 'text input',
        required: true,
        sort_order: 0,
        placeholder: 'hint',
        style: {
          layout: 'textarea',
        },
        validators: [
          {
            key: 'text',
            min_length: 0,
            max_length: 10,
          },
        ],
      },
    ],
  };
  await fillForm(page, JSON.stringify(form));
  await testDraftValues(page, form, true);
  await assertScreenshot(page);
});

test('109', async ({ page }) => {
  const form: MockMessageFormProps = {
    name: 'test form',
    items: [
      {
        name: 'text input',
        required: true,
        sort_order: 0,
        placeholder: 'hint',
        style: {
          layout: 'textarea',
        },
        validators: [
          {
            key: 'text',
            min_length: 0,
            max_length: 10,
          },
        ],
        draft_values: [
          'testtesttesttesttest',
        ],
      },
    ],
  };
  await fillForm(page, JSON.stringify(form));
  await testDraftValues(page, form, true);
  await assertScreenshot(page);
});

test('110', async ({ page }) => {
  const form: MockMessageFormProps = {
    name: 'test form',
    items: [
      {
        name: 'text input',
        required: true,
        sort_order: 0,
        style: {
          layout: 'textarea',
        },
        validators: [
          {
            key: 'text',
            min_length: 0,
            max_length: 10,
          },
        ],
        draft_values: [
          'long text test long text test long text test long text test long text test long '
          + 'text test long text test long text test long text test long text test long text '
          + 'test long text test long text test long text test long text test long text test '
          + 'long text test long text test long text test long text test',
        ],
      },
    ],
  };
  await fillForm(page, JSON.stringify(form));
  await testDraftValues(page, form, true);
  await assertScreenshot(page);
});

test('111', async ({ page }) => {
  const form: MockMessageFormProps = {
    name: 'test form',
    items: [
      {
        name: 'text input',
        required: true,
        sort_order: 0,
        style: {
          layout: 'textarea',
        },
        validators: [
          {
            key: 'text',
            min_length: 0,
            max_length: 10,
          },
        ],
        values: [
          'long text test long text test long text test long text test long text test long '
          + 'text test long text test long text test long text test long text test long text '
          + 'test long text test long text test long text test long text test long text test '
          + 'long text test long text test long text test long text test',
        ],
      },
    ],
  };
  await fillForm(page, JSON.stringify(form));
  await testDraftValues(page, form);
  await assertScreenshot(page);
});

test('112', async ({ page }) => {
  const form: MockMessageFormProps = {
    name: 'test form',
    items: [
      {
        name: 'text input',
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

test('113', async ({ page }) => {
  const form: MockMessageFormProps = {
    name: 'test form',
    items: [
      {
        name: 'text input',
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
        draft_values: [
          'Chip3',
        ],
      },
    ],
  };
  await fillForm(page, JSON.stringify(form));
  await testDraftValues(page, form, true);
  await assertScreenshot(page);
});

test('114', async ({ page }) => {
  const form: MockMessageFormProps = {
    name: 'test form',
    items: [
      {
        name: 'text input',
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
  await testDraftValues(page, form, true);
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
