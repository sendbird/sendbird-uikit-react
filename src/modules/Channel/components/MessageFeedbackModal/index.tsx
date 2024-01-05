import React, { ReactElement, useContext, useRef } from 'react';
import { LocalizationContext } from '../../../../lib/LocalizationContext';
import Modal from '../../../../ui/Modal';
import Button, { ButtonTypes } from '../../../../ui/Button';
import Input from '../../../../ui/Input';
import Label, { LabelColors, LabelTypography } from '../../../../ui/Label';
import './index.scss';
import { useMediaQueryContext } from '../../../../lib/MediaQueryContext';
import { CoreMessageType } from '../../../../utils';

export interface MessageFeedbackModalProps {
  message: CoreMessageType;
  onCancel: () => void;
  onSubmit?: (comment: string) => void;
  onRemove?: () => void;
}

export default function MessageFeedbackModal(props: MessageFeedbackModalProps): ReactElement {
  const {
    message,
    onCancel,
    onSubmit,
    onRemove,
  } = props;

  const { stringSet } = useContext(LocalizationContext);
  const { isMobile } = useMediaQueryContext();

  const inputRef = useRef(null);

  return (
    <Modal
      contentClassName='sendbird-message-feedback-modal-content__mobile'
      type={ButtonTypes.PRIMARY}
      onCancel={onCancel}
      onSubmit={() => {
        onSubmit?.(inputRef.current.value ?? '');
        onCancel();
      }}
      submitText={stringSet.BUTTON__SUBMIT}
      renderHeader={() => (
        <div className='sendbird-modal__header'>
          <Label
            type={LabelTypography.H_1}
            color={LabelColors.ONBACKGROUND_1}
            className='sendbird-message-feedback-modal-header'
          >
            {stringSet.FEEDBACK_MODAL_TITLE}
          </Label>
        </div>
      )}
      customFooter={
        <div className='sendbird-message-feedback-modal-footer__root'>
          {
            !isMobile && message?.myFeedback
              ? <Button type={ButtonTypes.WARNING} onClick={onRemove}>
                <Label type={LabelTypography.BUTTON_3} color={LabelColors.ERROR}>
                  {stringSet.BUTTON__REMOVE_FEEDBACK}
                </Label>
              </Button>
              : <div/>
          }
          <div className='sendbird-message-feedback-modal-footer__right-content'>
            <Button type={ButtonTypes.SECONDARY} onClick={onCancel}>
              <Label type={LabelTypography.BUTTON_3} color={LabelColors.ONBACKGROUND_1}>
                {stringSet.BUTTON__CANCEL}
              </Label>
            </Button>
            <Button onClick={() => onSubmit?.(inputRef.current.value ?? '')}>
              <Label type={LabelTypography.BUTTON_3} color={LabelColors.ONCONTENT_1}>
                {stringSet.BUTTON__SUBMIT}
              </Label>
            </Button>
          </div>
        </div>
      }
    >
      <div className='sendbird-message-feedback-modal-body__root'>
        <Input
          name='sendbird-message-feedback-modal-body__root'
          ref={inputRef}
          placeHolder={stringSet.FEEDBACK_CONTENT_PLACEHOLDER}
        />
      </div>
    </Modal>
  );
}
