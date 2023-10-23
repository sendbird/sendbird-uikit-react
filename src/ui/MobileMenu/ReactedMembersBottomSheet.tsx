import React, { ReactElement, useState } from 'react';
import { EmojiContainer, User } from '@sendbird/chat';
import { GroupChannel, Member } from '@sendbird/chat/groupChannel';
import { Reaction } from '@sendbird/chat/message';

import './mobile-menu-reacted-members.scss';

import BottomSheet from '../BottomSheet';
import { getEmojiUrl, SendableMessageType } from '../../utils';
import ImageRenderer from '../ImageRenderer';
import Icon, { IconColors, IconTypes } from '../Icon';
import Label, { LabelColors, LabelTypography } from '../Label';
import UserListItem from '../UserListItem';

export interface ReactedMembersBottomSheetProps {
  message: SendableMessageType;
  channel: GroupChannel;
  emojiKey: string;
  hideMenu: () => void;
  emojiContainer?: EmojiContainer;
  onPressUserProfileHandler?: (member: User) => void;
}

export const ReactedMembersBottomSheet = ({
  message,
  channel,
  emojiKey = '',
  hideMenu,
  emojiContainer,
  onPressUserProfileHandler,
}: ReactedMembersBottomSheetProps): ReactElement => {
  const { members = [] } = channel;
  const [selectedEmoji, setSelectedEmoji] = useState(emojiKey);

  function onPressUserProfileCallBack() {
    if (onPressUserProfileHandler && message) {
      const sender = (message as SendableMessageType)?.sender;
      onPressUserProfileHandler(sender);
    }
  }

  return (
    <BottomSheet onBackdropClick={hideMenu}>
      <div className="sendbird-message__bottomsheet">
        <div className="sendbird-message__bottomsheet__reacted-members">
          {message.reactions?.map((reaction: Reaction): ReactElement => {
            const emojiUrl = getEmojiUrl(emojiContainer, reaction.key);
            return (
              <div
                key={reaction.key}
                className={`
                  sendbird-message__bottomsheet__reacted-members__item
                  ${selectedEmoji === reaction.key ? 'sendbird-message__bottomsheet__reacted-members__item__selected' : ''}
                `}
                onClick={() => {
                  setSelectedEmoji(reaction.key);
                }}
              >
                <ImageRenderer
                  url={emojiUrl}
                  width="28px"
                  height="28px"
                  placeHolder={(style) => (
                    <div style={style as any}>
                      <Icon
                        type={IconTypes.QUESTION}
                        fillColor={IconColors.ON_BACKGROUND_3}
                        width="28px"
                        height="28px"
                      />
                    </div>
                  )}
                />
                <Label
                  type={LabelTypography.BUTTON_2}
                  color={selectedEmoji === reaction.key ? LabelColors.PRIMARY : LabelColors.ONBACKGROUND_3}
                >
                  {reaction.userIds.length}
                </Label>
              </div>
            );
          })}
        </div>
        <div className="sendbird-message__bottomsheet__reactor-list">
          { // making a member list who reacted to the message with the `selectedEmoji`
            (
              message.reactions?.find(reaction => reaction.key === selectedEmoji)
                ?.userIds.map((userId) => members.find((member) => member.userId === userId))
                .filter((member) => member !== undefined) as Array<Member>
            )
              .map((member) => (
                <UserListItem
                  key={member.userId}
                  className="sendbird-message__bottomsheet__reactor-list__item"
                  user={member}
                  avatarSize="36px"
                  onClick={onPressUserProfileCallBack}
                />
              ))
          }
        </div>
      </div>
    </BottomSheet>
  );
};
