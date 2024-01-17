import React, { ReactElement, useContext, useRef } from 'react';
import { LocalizationContext } from '../../../../lib/LocalizationContext';
import Modal from '../../../../ui/Modal';
import Button, { ButtonTypes } from '../../../../ui/Button';
import Label, { LabelColors, LabelTypography } from '../../../../ui/Label';
import '../MessageFeedbackModal/index.scss';
import { useKeyDown } from '../../../../hooks/useKeyDown/useKeyDown';

export interface MessageFeedbackFailedModalProps {
  onCancel?: () => void;
}

export default function MessageFeedbackFailedModal(props: MessageFeedbackFailedModalProps): ReactElement {
  const {
    onCancel,
  } = props;

  const { stringSet } = useContext(LocalizationContext);

  const modalRef = useRef(null);
  const onKeyDown = useKeyDown(modalRef, {
    Enter: () => onCancel?.(),
    Escape: () => onCancel?.(),
  });

  return (
    <div onKeyDown={onKeyDown}>
      <Modal
        contentClassName='sendbird-message-feedback-modal-content__mobile'
        type={ButtonTypes.PRIMARY}
        onSubmit={onCancel}
        submitText={stringSet.BUTTON__OK}
        renderHeader={() => (
          <div className='sendbird-modal__header'>
            <Label
              type={LabelTypography.H_1}
              color={LabelColors.ONBACKGROUND_1}
              className='sendbird-message-feedback-modal-header'
            >
              {stringSet.FEEDBACK_FAILED_TITLE}
            </Label>
          </div>
        )}
        customFooter={
          <div className='sendbird-message-feedback-modal-footer__root_failed'>
            <Button onClick={onCancel}>
              <Label type={LabelTypography.BUTTON_3} color={LabelColors.ONCONTENT_1}>
                { stringSet.BUTTON__OK }
              </Label>
            </Button>
          </div>
        }
      />
    </div>
  );
}
