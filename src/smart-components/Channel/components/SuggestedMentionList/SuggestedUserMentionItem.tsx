import React, { useContext, useEffect, useMemo, useRef } from 'react';

import Avatar from '../../../../ui/Avatar';
import Label, { LabelTypography, LabelColors } from '../../../../ui/Label';
import { LocalizationContext } from '../../../../lib/LocalizationContext';
import SendBird from 'sendbird';

interface SuggestedUserMentionItemProps {
  member: SendBird.User;
  isFocused?: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onMouseOver?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  renderUserMentionItem?: (props: { user: SendBird.User }) => JSX.Element;
}

function SuggestedUserMentionItem(props: SuggestedUserMentionItemProps): JSX.Element {
  const {
    member,
    isFocused = false,
    onClick,
    onMouseOver,
    renderUserMentionItem,
  } = props;
  const scrollRef = useRef(null);
  const { stringSet = {} } = useContext(LocalizationContext);
  useEffect(() => {
    if (isFocused) {
      scrollRef?.current?.scrollIntoView({ block: 'center', inline: 'center' });
    }
  }, [isFocused]);
  const customMentionItem = useMemo(() => {
    if (renderUserMentionItem) {
      return (
        <div
          className="sendbird-mention-suggest-list__user-item"
          onClick={onClick}
          onMouseOver={onMouseOver}
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
      onClick={onClick}
      onMouseOver={onMouseOver}
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
