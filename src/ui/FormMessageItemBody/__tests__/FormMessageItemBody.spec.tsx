import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import FormMessageItemBody from '..';
import FormInput from '../FormInput';
import { LocalizationContext } from '../../../lib/LocalizationContext';

jest.mock('../../MessageFeedbackFailedModal', () => (props: any) => {
  const React = require('react');
  return React.createElement('button', { type: 'button', onClick: props.onCancel }, props.text);
});

const stringSet = {
  FORM_VERSION_ERROR: 'Unsupported form version',
  FORM_ITEM_REQUIRED: 'Required field',
  FORM_ITEM_INVALID: 'Invalid field',
  FORM_ITEM_OPTIONAL_EMPTY: 'No response',
  BUTTON__OK: 'OK',
};

const renderWithLocale = (ui: React.ReactElement) => {
  return render(
    <LocalizationContext.Provider value={{ stringSet } as any}>
      {ui}
    </LocalizationContext.Provider>
  );
};

const createForm = (overrides = {}) => ({
  id: 'form-id',
  version: 1,
  isSubmitted: false,
  items: [
    {
      id: 'item-1',
      name: 'Question',
      placeholder: 'Type answer',
      required: true,
      style: {
        layout: 'chip',
        options: ['A', 'B', 'C'],
        defaultOptions: ['A'],
        resultCount: { min: 1, max: 1 },
      },
    },
  ],
  ...overrides,
});

describe('FormMessageItemBody', () => {
  it('renders fallback text for unsupported form versions', () => {
    renderWithLocale(
      <FormMessageItemBody
        isByMe={false}
        message={{ submitMessageForm: jest.fn() } as any}
        form={createForm({ version: 999 }) as any}
      />
    );

    expect(screen.getByText('Unsupported form version')).toBeInTheDocument();
  });

  it('marks missing required fields and does not submit', () => {
    const submitMessageForm = jest.fn();
    renderWithLocale(
      <FormMessageItemBody
        isByMe={false}
        message={{ messageId: 1, submitMessageForm } as any}
        form={createForm({
          items: [{
            id: 'item-1',
            name: 'Question',
            required: true,
            style: { layout: 'text' },
          }],
        }) as any}
      />
    );

    fireEvent.click(screen.getByText('Submit'));

    expect(screen.getByText('Required field')).toBeInTheDocument();
    expect(submitMessageForm).not.toHaveBeenCalled();
  });

  it('copies draft values into form items and submits the message form', () => {
    const submitMessageForm = jest.fn().mockResolvedValue(undefined);
    const form = createForm();

    renderWithLocale(
      <FormMessageItemBody
        isByMe={false}
        message={{ messageId: 1, submitMessageForm } as any}
        form={form as any}
      />
    );

    fireEvent.click(screen.getByText('Submit'));

    expect(form.items[0].draftValues).toEqual(['A']);
    expect(submitMessageForm).toHaveBeenCalled();
  });

  it('logs submit failures and lets users dismiss the failure modal', async () => {
    const error = new Error('submit failed');
    const logger = { error: jest.fn() };
    renderWithLocale(
      <FormMessageItemBody
        isByMe={false}
        logger={logger as any}
        message={{ messageId: 1, submitMessageForm: jest.fn().mockRejectedValue(error) } as any}
        form={createForm() as any}
      />
    );

    fireEvent.click(screen.getByText('Submit'));

    expect(await screen.findByText('Submit failed.')).toBeInTheDocument();
    expect(logger.error).toHaveBeenCalledWith(error);

    fireEvent.click(screen.getByText('Submit failed.'));
    expect(screen.queryByText('Submit failed.')).not.toBeInTheDocument();
  });
});

describe('FormInput', () => {
  const baseProps = {
    name: 'Question',
    style: { layout: 'text' },
    isSubmitted: false,
    errorMessage: null,
    values: [],
    isInvalidated: false,
    isSubmitTried: false,
    onChange: jest.fn(),
    onFocused: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('handles single and multi select chip changes', () => {
    const onChange = jest.fn();
    const { rerender } = renderWithLocale(
      <FormInput
        {...baseProps}
        style={{ layout: 'chip', options: ['A', 'B'], resultCount: { min: 1, max: 1 } } as any}
        values={[]}
        onChange={onChange}
      />
    );

    fireEvent.click(screen.getByText('A'));
    expect(onChange).toHaveBeenCalledWith(['A']);

    rerender(
      <LocalizationContext.Provider value={{ stringSet } as any}>
        <FormInput
          {...baseProps}
          style={{ layout: 'chip', options: ['A', 'B', 'C'], resultCount: { min: 1, max: 2 } } as any}
          values={['A', 'B']}
          onChange={onChange}
        />
      </LocalizationContext.Provider>
    );

    fireEvent.click(screen.getByText('C'));
    expect(onChange).toHaveBeenLastCalledWith(['A', 'B']);
  });

  it('renders submitted chip and text states', () => {
    const { rerender, container } = renderWithLocale(
      <FormInput
        {...baseProps}
        isSubmitted
        isValid
        style={{ layout: 'chip', options: ['A', 'B'] } as any}
        values={['A']}
      />
    );

    expect(container.getElementsByClassName('submittedSelected').length).toBe(1);

    rerender(
      <LocalizationContext.Provider value={{ stringSet } as any}>
        <FormInput
          {...baseProps}
          isSubmitted
          isValid
          style={{ layout: 'text' } as any}
          values={[]}
        />
      </LocalizationContext.Provider>
    );

    expect(screen.getByText('No response')).toBeInTheDocument();
  });

  it('handles textarea focus, blur, placeholder, and changes', () => {
    const onChange = jest.fn();
    const onFocused = jest.fn();
    renderWithLocale(
      <FormInput
        {...baseProps}
        required
        style={{ layout: 'textarea' } as any}
        placeHolder="Write details"
        onChange={onChange}
        onFocused={onFocused}
      />
    );

    expect(screen.getByText('Write details')).toBeInTheDocument();
    const textarea = screen.getByRole('textbox');
    fireEvent.focus(textarea);
    fireEvent.change(textarea, { target: { value: 'details' } });
    fireEvent.blur(textarea);

    expect(onFocused).toHaveBeenNthCalledWith(1, true);
    expect(onFocused).toHaveBeenNthCalledWith(2, false);
    expect(onChange).toHaveBeenCalledWith(['details']);
  });

  it('renders number inputs as text fields with numeric input mode and shows errors', () => {
    renderWithLocale(
      <FormInput
        {...baseProps}
        required
        errorMessage="Invalid field"
        isSubmitTried
        style={{ layout: 'number' } as any}
        values={['12']}
      />
    );

    const input = screen.getByDisplayValue('12');
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveAttribute('inputmode', 'numeric');
    expect(screen.getByText('Invalid field')).toBeInTheDocument();
  });

  it('renders no control for unknown layouts', () => {
    const { container } = renderWithLocale(
      <FormInput
        {...baseProps}
        style={{ layout: 'unknown' } as any}
      />
    );

    expect(container.querySelector('input')).toBeNull();
    expect(container.querySelector('textarea')).toBeNull();
  });
});
