import React, {ReactElement, useContext, useRef} from 'react';
import './index.scss';
import {getClassName} from '../../utils';
import Avatar from '../Avatar';
import {Member} from '@sendbird/chat/groupChannel';
// @ts-ignore
import typingIndicatorLogo from '../../gifs/message-typing-indicator.gif';
import {LocalizationContext} from '../../lib/LocalizationContext';

const AVATAR_SIZE = '28px';

export interface TypingIndicatorMessageProps {
  className?: string | Array<string>;
  typingMember: Member;
}

export default function TypingIndicatorMessage({
  className,
  typingMember,
}: TypingIndicatorMessageProps): ReactElement {
  const avatarRef = useRef(null);
  const { stringSet } = useContext(LocalizationContext);

  return (
    <div className={getClassName([
      className,
      'sendbird-typing-indicator-message',
    ])}>
      <div className='sendbird-typing-indicator-message__sender-profile-container'>
        {
          <Avatar
            src={typingMember.profileUrl}
            ref={avatarRef}
            width={AVATAR_SIZE}
            height={AVATAR_SIZE}
          />
        }
      </div>
      <img
        src={typingIndicatorLogo}
        alt={`${typingMember.nickname} ${stringSet.TYPING_INDICATOR__IS_TYPING}`}
        style={{
          height: '52px',
        }}
      />
    </div>
  );
}
