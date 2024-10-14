import { Page, test } from '@playwright/test';

import { assertScreenshot, fillForm, runBeforeEach, testDraftValues } from '../utils';
import { MockMessageFormProps } from '../__fixtures__/form/interface';

runBeforeEach();

test('100: Form with one text input with number only regex (no fill)', async ({ page }) => {
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

test('101: Form with one text input with number only regex (fill number)', async ({ page }) => {
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

test('102: Form with one text input with number only regex (no fill). Click submit', async ({ page }) => {
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

test('103: Form with one text input with number only regex (fill text). Click submit', async ({ page }) => {
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

test('104: Form with one text input (fill long text). Click submit', async ({ page }) => {
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

test('105: Submitted form with one text input (long text)', async ({ page }) => {
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

test('106: Form with one text area input with max length 10 regex (no fill)', async ({ page }) => {
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

test('107: Form with one text area input with max length 10 regex (fill short text). Click submit', async ({ page }) => {
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

test('108: Form with one text area input with max length 10 regex (no fill). Click submit', async ({ page }) => {
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

test('109: Form with one text area input with max length 10 regex (fill long text). Click submit', async ({ page }) => {
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

test('110: Form with one text area input with max length 10 regex (fill very long text). Click submit', async ({ page }) => {
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

test('111: Submitted form with one text area input with max length 10 regex (fill short text)', async ({ page }) => {
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

test('112: Form with one chip input', async ({ page }) => {
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

test('113: Form with one chip input (select one chip). Click submit', async ({ page }) => {
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

test('114: Form with one chip input (no select). Click submit', async ({ page }) => {
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
