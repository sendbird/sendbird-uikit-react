import { BaseMessage, MessageForm } from '@sendbird/chat/message';
import React, { useCallback, useContext, useState } from 'react';

import './index.scss';
import Button from '../Button';
import { LabelColors, LabelTypography } from '../Label';
import MessageFeedbackFailedModal from '../MessageFeedbackFailedModal';
import { LocalizationContext } from '../../lib/LocalizationContext';
import FormInput from './FormInput';
import useSendbirdStateContext from '../../hooks/useSendbirdStateContext';
import { getClassName } from '../../utils';
import { TEXT_MESSAGE_BODY_CLASSNAME } from '../TextMessageItemBody/consts';

interface Props {
  message: BaseMessage;
  form: MessageForm;
}

interface FormValue {
  draftValues: string[];
  required: boolean;
  errorMessage: string | null;
  isInvalidated: boolean;
}

export default function FormMessageItemBody(props: Props) {
  const {
    message,
    form,
  } = props;
  const { items, id: formId } = form;
  const { stringSet } = useContext(LocalizationContext);
  const { config } = useSendbirdStateContext();
  const { logger } = config;
  const [submitFailed, setSubmitFailed] = useState(false);
  const [focusedInputIndex, setFocusedInputIndex] = useState(-1);
  const [isSubmitTried, setIsSubmitTried] = useState(false);
  const [formValues, setFormValues] = useState<FormValue[]>(() => {
    const initialFormValues: FormValue[] = [];
    items.forEach(({ required, style }) => {
      const { layout, defaultOptions = [] } = style;
      initialFormValues.push({
        draftValues: layout === 'chip' ? defaultOptions : [],
        required,
        errorMessage: null,
        isInvalidated: false,
      });
    });
    return initialFormValues;
  });
  const isSubmitted = form.isSubmitted;
  const hasError = formValues.some(({ errorMessage }) => !!errorMessage);
  const isFocusedInvalidated = focusedInputIndex > -1
    ? formValues[focusedInputIndex].isInvalidated
    : formValues.some(({ isInvalidated }) => isInvalidated);
  const isButtonDisabled = (hasError && (isSubmitTried || isFocusedInvalidated)) || isSubmitted;

  const handleSubmit = useCallback(async () => {
    setIsSubmitTried(true);
    try {
      // If any of required fields are not valid, ignore submit.
      // Note that below code might never reach because focus out happens before submit button click
      // and submit button becomes disabled on focus out event.
      const hasError = formValues.some(({ errorMessage }) => errorMessage);
      if (hasError) {
        return;
      }
      // If form is empty, ignore submit.
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
    <div className={getClassName([
      `${TEXT_MESSAGE_BODY_CLASSNAME} disable-hover`,
      'sendbird-form-message__root',
      'incoming',
    ])}>
      {items.map((item, index) => {
        const {
          name,
          placeholder,
          id,
          required,
          style,
        } = item;
        const {
          draftValues = [],
          errorMessage,
        } = formValues[index];

        return (
          <FormInput
            key={id}
            style={style}
            placeHolder={placeholder}
            values={item.submittedValues ?? draftValues}
            isInvalidated={formValues[index].isInvalidated}
            isSubmitTried={isSubmitTried}
            errorMessage={errorMessage}
            isValid={isSubmitted}
            isSubmitted={isSubmitted}
            name={name}
            required={required}
            onFocused={(isFocus) => {
              if (errorMessage && !isFocus && !formValues[index].isInvalidated) {
                setFormValues(([...newInputs]) => {
                  newInputs[index] = {
                    ...newInputs[index],
                    isInvalidated: true,
                  };
                  return newInputs;
                });
              }
              setFocusedInputIndex(isFocus ? index : -1);
            }}
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
          />
        );
      })}
      <Button
        className='sendbird-form-message__submit-button'
        onClick={handleSubmit}
        disabled={isButtonDisabled}
        labelType={LabelTypography.BUTTON_2}
        labelColor={LabelColors.ONCONTENT_1}
      >
        {isSubmitted ? 'Submitted successfully' : 'Submit'}
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
