import { test } from '@playwright/test';

import { assertScreenshot, fillForm, runBeforeEach, testDraftValues } from '../utils';
import { MockMessageFormProps } from '../__fixtures__/form/interface';

runBeforeEach();

test('201 - Form with one text input (no fill), one text area input (no fill), '
  + 'and one chip input (no select)', async ({ page }) => {
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

test('202 - Form with one text input (no fill), one text input (no fill, not required)', async ({ page }) => {
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

test('203 - Form with one text area input (no fill), one text area input (no fill, not required)'
  + 'and one chip input (no select)', async ({ page }) => {
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

test('204 - Form with one chip input (no select), one chip input (select one chip), '
  + 'and one chip input (no select)', async ({ page }) => {
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
