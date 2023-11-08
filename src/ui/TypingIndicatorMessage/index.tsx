import React from 'react';
import { Member } from '@sendbird/chat/groupChannel';
import Avatar, {DefaultComponent} from '../Avatar';
import TypingDots from './TypingDots';

export interface TypingIndicatorMessageProps {
  typingMembers: Member[];
}

const AVATAR_BORDER_SIZE = 2;
const AVATAR_DIAMETER = 26 + AVATAR_BORDER_SIZE;
const LEFT_GAP = 20;

const TypingIndicatorMessageAvatar = (props : React.PropsWithChildren<TypingIndicatorMessageProps>) => {
  const { typingMembers } = props;
  const membersCount = typingMembers.length;
  const displayCount = Math.min(membersCount, 4);
  const hiddenCount = membersCount - 3;
  const superImposedWidth = ((displayCount - 1) * (AVATAR_DIAMETER - LEFT_GAP));
  const rightPaddingSize = 12;

  return (
    <div
      className='sendbird-message-content__left incoming'
      style={{
        minWidth: (displayCount * AVATAR_DIAMETER) - superImposedWidth + rightPaddingSize,
      }}
    >
      {
        typingMembers.slice(0, 3).map((typingMember: Member, index: number) => (
          <Avatar
            className={'sendbird-message-content__left__avatar'}
            src={typingMember.profileUrl || ''}
            // TODO: Divide getting profileUrl logic to utils
            width={`${AVATAR_DIAMETER}px`}
            height={`${AVATAR_DIAMETER}px`}
            zIndex={index}
            left={`${index * LEFT_GAP}px`}
            border={`${AVATAR_BORDER_SIZE}px solid white`}
          />
        ))
      }
      {
        hiddenCount > 0
          ? <Avatar
            className={'sendbird-message-content__left__avatar'}
            // TODO: Divide getting profileUrl logic to utils
            width={`${AVATAR_DIAMETER}px`}
            height={`${AVATAR_DIAMETER}px`}
            zIndex={3}
            left={`${3 * LEFT_GAP}px`}
            border={`${AVATAR_BORDER_SIZE}px solid white`}
            customDefaultComponent={({ width, height }) => (
              <DefaultComponent width={width} height={height} text={`+${hiddenCount}`} />
            )}
          />
          : null
      }
    </div>
  );
}

const TypingIndicatorMessage = (props : React.PropsWithChildren<TypingIndicatorMessageProps>) => {
  const { typingMembers } = props;
  return (
    typingMembers.length === 0
      ? <></>
      : <div
        className='sendbird-message-content incoming'
        style={{ marginBottom: '2px' }}
      >
        <TypingIndicatorMessageAvatar typingMembers={typingMembers} />
        <div className='sendbird-message-content__middle'>
          <TypingDots/>
        </div>
      </div>
  );
}

export default TypingIndicatorMessage;
