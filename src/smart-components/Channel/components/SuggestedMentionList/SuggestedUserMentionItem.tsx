import React, { useContext, useEffect, useMemo, useRef } from 'react';

import Avatar from '../../../../ui/Avatar';
import Label, { LabelTypography, LabelColors } from '../../../../ui/Label';
import { LocalizationContext } from '../../../../lib/LocalizationContext';
import SendBird from 'sendbird';
import { MentionItemUIEvent } from '../../../..';

interface SuggestedUserMentionItemProps {
  member: SendBird.User | SendBird.Member;
  isFocused?: boolean;
  parentScrollRef?: React.RefObject<HTMLDivElement>;
  onClick?: (props: MentionItemUIEvent) => void;
  onMouseOver?: (props: MentionItemUIEvent) => void;
  onMouseMove?: (props: MentionItemUIEvent) => void;
  renderUserMentionItem?: (props: { user: SendBird.User | SendBird.Member }) => JSX.Element;
}

function SuggestedUserMentionItem(props: SuggestedUserMentionItemProps): JSX.Element {
  const {
    member,
    isFocused = false,
    parentScrollRef,
    onClick,
    onMouseOver,
    onMouseMove,
    renderUserMentionItem,
  } = props;
  const scrollRef = useRef(null);
  const { stringSet = {} } = useContext(LocalizationContext);
  useEffect(() => {
    if (isFocused) {
      if (parentScrollRef?.current?.scrollTop >= scrollRef?.current?.offsetTop) {
        scrollRef?.current?.scrollIntoView({ block: "start", inline: "nearest" });
      } else if (parentScrollRef?.current?.scrollTop + parentScrollRef?.current?.clientHeight <= scrollRef?.current?.offsetTop) {
        scrollRef?.current?.scrollIntoView({ block: "end", inline: "nearest" });
      }
    }
  }, [isFocused]);
  const customMentionItem = useMemo(() => {
    if (renderUserMentionItem) {
      return (
        <div
          className="sendbird-mention-suggest-list__user-item"
          onClick={(event) => onClick?.({ event, member: (member as SendBird.Member), itemRef: scrollRef })}
          onMouseOver={(event) => onMouseOver?.({ event, member: (member as SendBird.Member), itemRef: scrollRef })}
          onMouseMove={(event) => onMouseMove?.({ event, member: (member as SendBird.Member), itemRef: scrollRef })}
          key={member.nickname}
          ref={scrollRef}
        >
          {renderUserMentionItem({ user: member })}
        </div>
      );
    }
  }, [renderUserMentionItem]);
  if (customMentionItem) {
    return customMentionItem;
  }
  return (
    <div
      className={`sendbird-mention-suggest-list__user-item ${isFocused ? 'focused' : ''}`}
      onClick={(event) => onClick?.({ event, member: (member as SendBird.Member), itemRef: scrollRef })}
      onMouseOver={(event) => onMouseOver?.({ event, member: (member as SendBird.Member), itemRef: scrollRef })}
      onMouseMove={(event) => onMouseMove?.({ event, member: (member as SendBird.Member), itemRef: scrollRef })}
      key={member.nickname}
      ref={scrollRef}
    >
      <Avatar
        className="sendbird-mention-suggest-list__user-item__avatar"
        src={member?.profileUrl}
        alt="user-profile"
        width="24px"
        height="24px"
      />
      <Label
        className="sendbird-mention-suggest-list__user-item__nickname"
        type={LabelTypography.SUBTITLE_2}
        color={member?.nickname ? LabelColors.ONBACKGROUND_1 : LabelColors.ONBACKGROUND_3}
      >
        {member?.nickname || stringSet?.MENTION_NAME__NO_NAME}
      </Label>
      <Label
        className="sendbird-mention-suggest-list__user-item__user-id"
        type={LabelTypography.SUBTITLE_2}
        color={LabelColors.ONBACKGROUND_2}
      >
        {member?.userId}
      </Label>
    </div>
  );
}

export default SuggestedUserMentionItem;
