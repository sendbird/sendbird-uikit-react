import React, { ReactElement } from 'react';
import BottomSheet from '../BottomSheet';
import Label, { LabelColors, LabelTypography } from '../Label';
import './index.scss';
import { useLocalization } from '../../lib/LocalizationContext';

export interface MobileFeedbackMenuProps {
  hideMenu(): void;
  onEditFeedback(): void;
  onRemoveFeedback(): void;
}

export default function MobileFeedbackMenu(
  props: MobileFeedbackMenuProps,
): ReactElement {
  const {
    hideMenu,
    onEditFeedback,
    onRemoveFeedback,
  } = props;

  const { stringSet } = useLocalization();

  return (
    <BottomSheet onBackdropClick={hideMenu}>
      <div className='sendbird-message__bottomsheet--feedback-options-menu'>
        <div
          className='sendbird-message__bottomsheet--feedback-option'
          onClick={() => {
            hideMenu();
            onEditFeedback();
          }}
        >
          <Label type={LabelTypography.BODY_1} color={LabelColors.ONBACKGROUND_1}>
            {stringSet?.EDIT_COMMENT}
          </Label>
        </div>
        <div
          className='sendbird-message__bottomsheet--feedback-option'
          onClick={() => {
            hideMenu();
            onRemoveFeedback();
          }}
        >
          <Label type={LabelTypography.BODY_1} color={LabelColors.ERROR}>
            {stringSet?.REMOVE_FEEDBACK}
          </Label>
        </div>
      </div>
    </BottomSheet>
  );
}
