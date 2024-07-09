import { BaseMessage, MessageForm } from '@sendbird/chat/message';
import React, { useCallback, useContext, useState } from 'react';

import Button from '../Button';
import Label, { LabelTypography } from '../Label';
import MessageFeedbackFailedModal from '../MessageFeedbackFailedModal';
import { LocalizationContext } from '../../lib/LocalizationContext';
import FormInput from './FormInput';
import useSendbirdStateContext from '../../hooks/useSendbirdStateContext';

interface Props {
  message: BaseMessage;
  form: MessageForm;
}

interface FormValue {
  draftValues: string[];
  required: boolean;
  errorMessage: string | null;
}

export default function FormMessageItemBody(props: Props) {
  const { message, form } = props;
  const { items, id: formId } = form;
  const { stringSet } = useContext(LocalizationContext);
  const { config } = useSendbirdStateContext();
  const { logger } = config;

  const [submitFailed, setSubmitFailed] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [formValues, setFormValues] = useState<FormValue[]>(() => {
    const initialFormValues: FormValue[] = [];
    items.forEach(({ required, style }) => {
      const { layout, defaultOptions = [] } = style;
      initialFormValues.push({
        draftValues: layout === 'chip' ? defaultOptions : [],
        required,
        errorMessage: null,
      });
    });
    return initialFormValues;
  });
  const isSubmitted = form.isSubmitted;
  const hasError = formValues.some(({ errorMessage }) => !!errorMessage);

  const handleSubmit = useCallback(async () => {
    try {
      // If any of required fields are not valid,
      const hasError = formValues.some(({ errorMessage }) => errorMessage);
      if (hasError) {
        return;
      }
      // If form is empty, ignore submit
      const isMissingRequired = formValues.some(
        (formValue) => formValue.required
          && (!formValue.draftValues || formValue.draftValues.length === 0),
      );
      if (isMissingRequired) {
        setFormValues((oldFormValues) => {
          return oldFormValues.map((formValue) => {
            if (formValue.required && formValue.draftValues.length === 0) {
              return {
                ...formValue,
                errorMessage: stringSet.FORM_ITEM_REQUIRED,
              };
            }
            return formValue;
          });
        });
        return;
      }
      formValues.forEach((formValue, index) => {
        items[index].draftValues = formValue.draftValues;
      });
      await message.submitMessageForm();
    } catch (error) {
      setSubmitFailed(true);
      logger?.error(error);
    }
  }, [formValues, message.messageId, message.submitMessageForm, formId]);

  return (
    <div className='sendbird-form-message__root'>
      {items.map((item, index) => {
        const { name, placeholder, id, required, style } = item;
        const { draftValues = [], errorMessage } = formValues[index];

        return (
          <FormInput
            key={id}
            style={style}
            placeHolder={placeholder}
            values={item.submittedValues ?? draftValues}
            errorMessage={errorMessage}
            isValid={isSubmitted}
            disabled={isSubmitted}
            name={name}
            required={required}
            onFocused={(isFocus) => setIsInputFocused(isFocus)}
            onChange={(values) => {
              setFormValues(([...newInputs]) => {
                newInputs[index] = {
                  ...newInputs[index], // Create a new object for the updated item
                  draftValues: values,
                  errorMessage: (() => {
                    if (!item.isValid(values)) {
                      return stringSet.FORM_ITEM_INVALID;
                    }
                    if (required && values.length === 0) {
                      return stringSet.FORM_ITEM_REQUIRED;
                    }
                    return null;
                  })(),
                };
                return newInputs; // Return the new array
              });
            }}
            isSubmitted={isSubmitted}
          />
        );
      })}
      <Button
        className='sendbird-form-message-submit-button'
        onClick={handleSubmit}
        disabled={(!isInputFocused && hasError) || isSubmitted}
      >
        <Label type={LabelTypography.BUTTON_2}>
          <div
            className={`sendbird-form-message__submit-button-text ${
              (!isInputFocused && hasError) || isSubmitted ? 'disabled' : ''
            }`}
          >
            {isSubmitted ? 'Submitted successfully' : 'Submit'}
          </div>
        </Label>
      </Button>
      {submitFailed && (
        <MessageFeedbackFailedModal
          text={'Submit failed.'}
          onCancel={() => {
            setSubmitFailed(false);
          }}
        />
      )}
    </div>
  );
}
