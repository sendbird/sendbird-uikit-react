import { MessageFormItemStyle } from '@sendbird/chat/message';
import React, { ReactElement, ReactNode, useState } from 'react';

import './index.scss';
import Label, { LabelColors, LabelTypography } from '../Label';
import Icon, { IconColors, IconTypes } from '../Icon';
import { classnames } from '../../utils/utils';

export interface InputLabelProps {
  children: ReactNode;
}

export const InputLabel = ({ children }: InputLabelProps): ReactElement => (
  <div style={{ marginBottom: '6px' }}>
    <Label
      className='sendbird-form-message__input__label'
      type={LabelTypography.CAPTION_2}
      color={LabelColors.ONBACKGROUND_2}
    >
      {children}
    </Label>
  </div>
);

export interface InputProps {
  name: string;
  style: MessageFormItemStyle;
  required?: boolean;
  disabled?: boolean;
  isValid?: boolean;
  errorMessage: string | null;
  values: string[];
  placeHolder?: string;
  onFocused?: (isFocus: boolean) => void;
  onChange: (values: string[]) => void;
  isSubmitted: boolean;
}

type ChipState =
  | 'default'
  | 'selected'
  | 'submittedDefault'
  | 'submittedSelected';

interface ChipData {
  state: ChipState;
  option: string;
}

const FormInput = (props: InputProps) => {
  const {
    name,
    required,
    disabled,
    errorMessage,
    isValid,
    values,
    style,
    onFocused,
    onChange,
    placeHolder,
    isSubmitted,
  } = props;

  const { layout, options = [], resultCount }: MessageFormItemStyle = style;
  const { min = 1, max = 1 } = resultCount ?? {};
  const chipDataList: ChipData[] = getInitialChipDataList();

  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
    onFocused?.(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    onFocused?.(false);
  };

  function getInitialChipDataList(): ChipData[] {
    if (isSubmitted) {
      return options.map((option) => ({
        state: values.includes(option)
          ? 'submittedSelected'
          : 'submittedDefault',
        option,
      }));
    } else {
      return options.map((option) => ({
        state: values.includes(option) ? 'selected' : 'default',
        option,
      }));
    }
  }

  const onChipClick = (index: number) => {
    if (isSubmitted) return;
    let newDraftedValues: string[];
    if (min === 1 && max === 1) {
      // Single select
      newDraftedValues = chipDataList[index].state === 'selected' ? [] : [chipDataList[index].option];
    } else {
      /**
       * Multi select case
       * Upon chip click, if it is:
       *   1. not selected and can select more -> select the chip. Keep other selected chips as is.
       *   2. already selected ->  deselect the chip. Keep other selected chips as is.
       */
      newDraftedValues = chipDataList.reduce((acc, chipData, i) => {
        if (i === index) {
          if (chipData.state === 'default' && values.length < max) {
            acc.push(chipData.option);
          }
        } else if (chipData.state === 'selected') {
          acc.push(chipData.option);
        }
        return acc;
      }, [] as string[]);
    }
    onChange(newDraftedValues);
  };

  return (
    <div className='sendbird-form-message__input__root'>
      <InputLabel>
        <div className='sendbird-form-message__input__title-container'>
          {name} {!required && <span className='sendbird-form-message__input__title-optional'>(optional)</span>}
        </div>
      </InputLabel>
      <div className='sendbird-input_for_form'>
        {(() => {
          switch (layout) {
            case 'chip': {
              return (
                <div className='sendbird-form-message__input__chip-container'>
                  {chipDataList.map((chipData, index) => {
                    return (
                      <div className={`sendbird-form-message__input__chip ${chipData.state}`}
                        key={index}
                        onClick={() => onChipClick(index)}
                      >
                        <div className='sendbird-form-message__input__chip-text'>{chipData.option}</div>
                        {isSubmitted
                          && chipData.state === 'submittedSelected' && (
                            <Icon
                              className='sendbird-form-message__submitted-check-icon-chip'
                              type={IconTypes.DONE}
                              fillColor={IconColors.SECONDARY_2}
                              width='20px'
                              height='20px'
                            />
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            }
            case 'textarea': {
              const currentValue = values.length > 0 ? values[0] : '';
              return (
                <div className='sendbird-form-message__input__container'>
                  {isSubmitted ? (
                    <div className='sendbird-form-message__submitted-input-box textarea'>
                      <div className='sendbird-form-message__submitted-input-box-text'>{currentValue}</div>
                      {isValid && (
                        <div className='sendbird-form-message__submitted-check-icon-container'>
                          <Icon
                            type={IconTypes.DONE}
                            fillColor={IconColors.SECONDARY_2}
                            width='20px'
                            height='20px'
                          />
                        </div>
                      )}
                      {(placeHolder && !currentValue) && (
                        <Label
                          className='sendbird-input__placeholder'
                          type={LabelTypography.BODY_1}
                          color={LabelColors.ONBACKGROUND_3}
                        >
                          No Response
                        </Label>
                      )}
                    </div>
                  ) : (
                    <>
                      <textarea
                        className={classnames(
                          `sendbird-input__input ${errorMessage ? 'error' : ''}`,
                          'sendbird-form-message__input__textarea'
                        )}
                        required={required}
                        disabled={disabled}
                        value={currentValue}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        onChange={(event) => {
                          const value = event.target.value;
                          onChange(value ? [value] : []);
                        }}
                      />
                      {(!disabled && placeHolder && !currentValue) && (
                        <Label
                          className='sendbird-input__placeholder'
                          type={LabelTypography.BODY_1}
                          color={LabelColors.ONBACKGROUND_3}
                        >
                          {placeHolder}
                        </Label>
                      )}
                    </>
                  )}
                </div>
              );
            }
            case 'text':
            case 'number':
            case 'phone':
            case 'email': {
              const currentValue = values.length > 0 ? values[0] : '';
              return (
                <div className="sendbird-form-message__input__container">
                  {isSubmitted ? (
                    <div className="sendbird-form-message__submitted-input-box">
                      <div className="sendbird-form-message__submitted-input-box-text">{currentValue}</div>
                      {isValid && (
                        <div className="sendbird-form-message__submitted-check-icon-container">
                          <Icon
                            type={IconTypes.DONE}
                            fillColor={IconColors.SECONDARY_2}
                            width="20px"
                            height="20px"
                          />
                        </div>
                      )}
                      {(placeHolder && !currentValue) && (
                        <Label
                          className='sendbird-input__placeholder'
                          type={LabelTypography.BODY_1}
                          color={LabelColors.ONBACKGROUND_3}
                        >
                          No response
                        </Label>
                      )}
                    </div>
                  ) : (
                    <>
                      <input
                        type={layout === 'number' ? 'text' : layout}
                        inputMode={layout === 'number' ? 'numeric' : 'text'}
                        className={`sendbird-input__input ${errorMessage ? 'error' : ''}`}
                        name={name}
                        required={required}
                        disabled={disabled}
                        value={currentValue}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        onChange={(event) => {
                          const value = event.target.value;
                          onChange(value ? [value] : []);
                        }}
                      />
                      {(!disabled && placeHolder && !currentValue) && (
                        <Label
                          className='sendbird-input__placeholder'
                          type={LabelTypography.BODY_1}
                          color={LabelColors.ONBACKGROUND_3}
                        >
                          {placeHolder}
                        </Label>
                      )}
                    </>
                  )}
                </div>
              );
            }
            default: {
              return <></>;
            }
          }
        })()}
        {!isFocused && errorMessage && (
          <Label
            className='sendbird-form-message__error-label'
            type={LabelTypography.CAPTION_3}
          >
            {errorMessage}
          </Label>
        )}
      </div>
    </div>
  );
};

export default FormInput;
