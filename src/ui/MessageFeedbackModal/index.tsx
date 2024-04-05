import React, { ReactElement, useContext, useRef } from 'react';
import { LocalizationContext } from '../../lib/LocalizationContext';
import Modal from '../Modal';
import Button, { ButtonTypes } from '../Button';
import Input from '../Input';
import Label, { LabelColors, LabelTypography } from '../Label';
import './index.scss';
import { useMediaQueryContext } from '../../lib/MediaQueryContext';
import { CoreMessageType } from '../../utils';
import { FeedbackRating } from '@sendbird/chat/message';
import { useKeyDown } from '../../hooks/useKeyDown/useKeyDown';

export interface MessageFeedbackModalProps {
  selectedFeedback: FeedbackRating | undefined;
  message: CoreMessageType;
  onClose?: () => void;
  onSubmit?: (selectedFeedback: FeedbackRating, comment: string) => void;
  onUpdate?: (selectedFeedback: FeedbackRating, comment: string) => void;
  onRemove?: () => void;
}

export default function MessageFeedbackModal(props: MessageFeedbackModalProps): ReactElement {
  const {
    selectedFeedback,
    message,
    onClose,
    onSubmit,
    onUpdate,
    onRemove,
  } = props;

  const { stringSet } = useContext(LocalizationContext);
  const { isMobile } = useMediaQueryContext();

  const isEdit = message?.myFeedback && selectedFeedback === message.myFeedback.rating;
  const hasComment = message?.myFeedback?.comment;

  const onSubmitWrapper = () => {
    if (!selectedFeedback) return;
    const comment = inputRef.current.value ?? '';
    if (isEdit) {
      if (comment !== message.myFeedback.comment) {
        onUpdate?.(selectedFeedback, comment);
      } else {
        onClose?.();
      }
    } else if (!message.myFeedback) {
      onSubmit?.(selectedFeedback, comment);
    }
  };

  const modalRef = useRef(null);
  const inputRef = useRef(null);

  const onKeyDown = useKeyDown(modalRef, {
    Enter: () => onSubmitWrapper(),
    Escape: () => onClose?.(),
  });

  return (
    <div onKeyDown={onKeyDown}>
      <Modal
        contentClassName='sendbird-message-feedback-modal-content__mobile'
        type={ButtonTypes.PRIMARY}
        onCancel={onClose}
        onSubmit={() => {
          onSubmitWrapper();
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
              !isMobile && message?.myFeedback && selectedFeedback === message.myFeedback.rating
                ? <Button
                  type={ButtonTypes.WARNING}
                  onClick={onRemove}
                  labelType={LabelTypography.BUTTON_3}
                >
                  {stringSet.BUTTON__REMOVE_FEEDBACK}
                </Button>
                : <div/>
            }
            <div className='sendbird-message-feedback-modal-footer__right-content'>
              <Button type={ButtonTypes.SECONDARY} onClick={onClose}>
                <Label type={LabelTypography.BUTTON_3} color={LabelColors.ONBACKGROUND_1}>
                  {stringSet.BUTTON__CANCEL}
                </Label>
              </Button>
              <Button onClick={() => onSubmitWrapper()}>
                <Label type={LabelTypography.BUTTON_3} color={LabelColors.ONCONTENT_1}>
                  { hasComment ? stringSet.BUTTON__SAVE : stringSet.BUTTON__SUBMIT }
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
            value={isEdit ? message.myFeedback?.comment : undefined}
            placeHolder={stringSet.FEEDBACK_CONTENT_PLACEHOLDER}
            autoFocus={true}
          />
        </div>
      </Modal>
    </div>
  );
}
