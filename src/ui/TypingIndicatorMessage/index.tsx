import React, {ReactElement, useContext, useRef} from 'react';
import './index.scss';
import {Member} from '@sendbird/chat/groupChannel';
// @ts-ignore
import typingIndicatorLogo from '../../gifs/message-typing-indicator.gif';
import {LocalizationContext} from '../../lib/LocalizationContext';
import Avatar from '../Avatar';
import Label, {LabelColors, LabelTypography} from '../Label';

export interface TypingIndicatorMessageProps {
  typingMember: Member;
}

export default function TypingIndicatorMessage({
  typingMember,
}: TypingIndicatorMessageProps): ReactElement {
  const { stringSet } = useContext(LocalizationContext);
  const avatarRef = useRef(null);

  return (
    <div className='cutom-xxx'>
      <div className={'sendbird-message-content__left incoming'}>
        <Avatar
          className={'sendbird-message-content__left__avatar'}// @ts-ignore
          // @ts-ignore
          src={typingMember.profileUrl || ''}
          // TODO: Divide getting profileUrl logic to utils
          ref={avatarRef}
          width="28px"
          height="28px"
        />
      </div>

      <div className='sendbird-message-content-middle'>
        <div>
          <Label
            className="sendbird-message-content__middle__sender-name"
            type={LabelTypography.CAPTION_2}
            color={LabelColors.ONBACKGROUND_2}
          >
            {`${typingMember.nickname} is typing...`}
          </Label>
        </div>
        <img
          src={typingIndicatorLogo}
          alt={`${typingMember.nickname} ${stringSet.TYPING_INDICATOR__IS_TYPING}`}
          style={{
            height: '40px',
          }}
        />
      </div>
    </div>
  );
}
