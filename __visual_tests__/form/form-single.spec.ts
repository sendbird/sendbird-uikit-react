import { test } from '@playwright/test';

import { assertScreenshot, fillForm, runBeforeEach, testDraftValues } from '../utils';
import { MockMessageFormProps } from '../__fixtures__/form/interface';

runBeforeEach();

// 100: Form with one text input with number only regex (no fill)
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

// 101: Form with one text input with number only regex (fill number)
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

// 102: Form with one text input with number only regex (no fill). Click submit
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

// 103: Form with one text input with number only regex (fill text). Click submit
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

// 104: Form with one text input (fill long text). Click submit
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

// 105: Submitted form with one text input (long text)
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

// 106: Form with one text area input with max length 10 regex (no fill)
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

// 107: Form with one text area input with max length 10 regex (fill short text). Click submit
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

// 108: Form with one text area input with max length 10 regex (no fill). Click submit
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

// 109: Form with one text area input with max length 10 regex (fill long text). Click submit
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

// 110: Form with one text area input with max length 10 regex (fill very long text). Click submit
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

// 111: Submitted form with one text area input with max length 10 regex (fill short text)
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

// 112: Form with one chip input
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

// 113: Form with one chip input (select one chip). Click submit
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

// 114: Form with one chip input (no select). Click submit
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
