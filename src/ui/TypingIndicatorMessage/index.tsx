import React, {ReactElement, useContext} from 'react';
import './index.scss';
import {Member} from '@sendbird/chat/groupChannel';
// @ts-ignore
import typingIndicatorLogo from '../../gifs/message-typing-indicator.gif';
import {LocalizationContext} from '../../lib/LocalizationContext';
import MessageProfile from '../MessageProfile';
import MessageHeader from '../MessageHeader';

export interface TypingIndicatorMessageProps {
  typingMember: Member;
}

export default function TypingIndicatorMessage({
  typingMember,
}: TypingIndicatorMessageProps): ReactElement {
  const { stringSet } = useContext(LocalizationContext);

  return (
    <div className='sendbird-message-content incoming'>
      <MessageProfile member={typingMember}/>
      <div className='sendbird-message-content-middle'>
        <div>
          <MessageHeader text={`${typingMember.nickname} is typing...`}/>
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
