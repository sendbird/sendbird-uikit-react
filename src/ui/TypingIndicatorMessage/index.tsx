import React from 'react';
import { Member } from '@sendbird/chat/groupChannel';
import Avatar from '../Avatar';
import TypingDots from './TypingDots';
import AvatarDefault from '../Avatar/AvatarDefault';

export interface TypingIndicatorMessageProps {
  typingMembers: Member[];
}

const AVATAR_BORDER_SIZE = 2;
const AVATAR_DIAMETER_WITHOUT_BORDER = 28;
const AVATAR_DIAMETER = AVATAR_DIAMETER_WITHOUT_BORDER + (AVATAR_BORDER_SIZE * 2);
const LEFT_GAP = 24;
const MAX_PROFILES_COUNT = 3;
const LEFT_FOR_BORDER = AVATAR_BORDER_SIZE;

export interface AvatarStackProps {
  sources: string[];
  max: number;
}

const AvatarStack = (props: AvatarStackProps) => {
  const { sources, max } = props;

  return (
    <> {
      sources.slice(0, max).map((src, index) => (
        <Avatar
          className={'sendbird-message-content__left__avatar multiple'}
          src={src || ''}
          key={`avatar_stack_item_${src}`}
          // TODO: Divide getting profileUrl logic to utils
          width={`${AVATAR_DIAMETER_WITHOUT_BORDER}px`}
          height={`${AVATAR_DIAMETER_WITHOUT_BORDER}px`}
          zIndex={index}
          left={`${index * LEFT_GAP - LEFT_FOR_BORDER}px`}
        />
      ))
    } </>
  );
};

const TypingIndicatorMessageAvatar = (props: TypingIndicatorMessageProps) => {
  const { typingMembers } = props;
  const membersCount = typingMembers.length;
  const displayCount = Math.min(membersCount, 4);
  const hiddenCount = membersCount - MAX_PROFILES_COUNT;
  const superImposedWidth = ((displayCount - 1) * (AVATAR_DIAMETER - LEFT_GAP));
  const rightPaddingSize = 12;

  return (
    <div
      className='sendbird-message-content__left incoming'
      style={{
        minWidth: (displayCount * AVATAR_DIAMETER) - superImposedWidth + rightPaddingSize,
      }}
    >
      <AvatarStack
        sources={typingMembers.map((member) => member.profileUrl)}
        max={MAX_PROFILES_COUNT}
      />
      {
        hiddenCount > 0
          ? <Avatar
            className={'sendbird-message-content__left__avatar multiple'}
            // TODO: Divide getting profileUrl logic to utils
            width={`${AVATAR_DIAMETER_WITHOUT_BORDER}px`}
            height={`${AVATAR_DIAMETER_WITHOUT_BORDER}px`}
            zIndex={MAX_PROFILES_COUNT}
            left={`${MAX_PROFILES_COUNT * LEFT_GAP}px`}
            customDefaultComponent={({ width, height }) => (
              <AvatarDefault width={width} height={height} text={`+${hiddenCount}`} />
            )}
          />
          : null
      }
    </div>
  );
};

const TypingIndicatorMessage = (props: TypingIndicatorMessageProps) => {
  const { typingMembers } = props;

  if (typingMembers.length === 0) return null;
  return <div
    className='sendbird-message-content incoming'
    style={{ marginBottom: '2px' }}
  >
    <TypingIndicatorMessageAvatar typingMembers={typingMembers} />
    <div className='sendbird-message-content__middle'>
      <TypingDots/>
    </div>
  </div>;

};

export default TypingIndicatorMessage;
