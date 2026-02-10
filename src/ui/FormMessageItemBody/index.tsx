import { BaseMessage, MessageForm } from '@sendbird/chat/message';
import React, { useCallback, useContext, useState } from 'react';

import './index.scss';
import Button from '../Button';
import { Label, LabelColors, LabelTypography } from '../Label';
import MessageFeedbackFailedModal from '../MessageFeedbackFailedModal';
import { LocalizationContext } from '../../lib/LocalizationContext';
import FormInput from './FormInput';
import { getClassName } from '../../utils';
import { TEXT_MESSAGE_BODY_CLASSNAME } from '../TextMessageItemBody/consts';
import { isFormVersionCompatible } from '../../modules/GroupChannel/context/utils';
import { LoggerInterface } from '../../lib/Logger';

interface Props {
  message: BaseMessage;
  form: MessageForm;
  isByMe: boolean;
  logger?: LoggerInterface;
}

interface FormValue {
  draftValues: string[];
  required: boolean;
  errorMessage: string | null;
  isInvalidated: boolean;
}

const FallbackUserMessage = ({
  isByMe,
  text,
}) => {
  return (
    <div className={getClassName([
      'sendbird-unknown-message-item-body',
      isByMe ? 'outgoing' : 'incoming',
    ])}>
      <Label
        className="sendbird-unknown-message-item-body__description"
        type={LabelTypography.BODY_1}
        color={isByMe ? LabelColors.ONCONTENT_3 : LabelColors.ONBACKGROUND_3}
      >
        {text}
      </Label>
    </div>
  );
};

/**
 * @deprecated This feature is deprecated and will be removed in May 2026.
 */
export default function FormMessageItemBody(props: Props) {
  const {
    message,
    form,
    isByMe,
    logger,
  } = props;
  const { items, id: formId } = form;
  const { stringSet } = useContext(LocalizationContext);
  const [submitFailed, setSubmitFailed] = useState(false);
  const [isSubmitTried, setIsSubmitTried] = useState(false);
  const [formValues, setFormValues] = useState<FormValue[]>(() => {
    const initialFormValues: FormValue[] = [];
    items.forEach(({ required, style = {} }) => {
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
  const hasInvalidated = formValues.some(({ isInvalidated }) => isInvalidated);
  const isButtonDisabled = (hasError && (isSubmitTried || hasInvalidated)) || isSubmitted;

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

  if (!isFormVersionCompatible(form.version)) {
    return <FallbackUserMessage isByMe={isByMe} text={stringSet.FORM_VERSION_ERROR} />;
  }

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
              } else if (!errorMessage) {
                setFormValues(([...newInputs]) => {
                  newInputs[index] = {
                    ...newInputs[index],
                    isInvalidated: false,
                  };
                  return newInputs;
                });
              }
            }}
            onChange={(values) => {
              setFormValues(([...newInputs]) => {
                newInputs[index] = {
                  ...newInputs[index], // Create a new object for the updated item
                  draftValues: values,
                  errorMessage: (() => {
                    return stringSet.FORM_ITEM_INVALID;
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
