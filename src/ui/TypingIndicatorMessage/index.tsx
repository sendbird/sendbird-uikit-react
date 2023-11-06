import React, { ReactElement, useContext } from 'react';
import { Member } from '@sendbird/chat/groupChannel';
import { LocalizationContext } from '../../lib/LocalizationContext';
import Avatar from '../Avatar';
import Label, { LabelColors, LabelTypography } from '../Label';
import TypingDots from './TypingDots';

export interface TypingIndicatorMessageProps {
  typingMember: Member;
}

export default function TypingIndicatorMessage({
  typingMember,
}: TypingIndicatorMessageProps): ReactElement {
  const { stringSet } = useContext(LocalizationContext);

  return (
    <div
      className='sendbird-message-content incoming'
      style={{ marginBottom: '2px' }}
    >
      <div className='sendbird-message-content__left incoming'>
        <Avatar
          className={'sendbird-message-content__left__avatar'}
          src={typingMember.profileUrl || ''}
          // TODO: Divide getting profileUrl logic to utils
          width="28px"
          height="28px"
        />
      </div>

      <div className='sendbird-message-content__middle'>
        <Label
          className="sendbird-message-content__middle__sender-name"
          type={LabelTypography.CAPTION_2}
          color={LabelColors.ONBACKGROUND_2}
        >
          {`${typingMember.nickname} ${stringSet.TYPING_INDICATOR__IS_TYPING}`}
        </Label>
        <TypingDots/>
      </div>
    </div>
  );
}
