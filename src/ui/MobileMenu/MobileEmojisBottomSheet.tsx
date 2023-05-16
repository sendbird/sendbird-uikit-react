import React, { ReactElement, useMemo, useState } from 'react';
import { EmojiContainer } from '@sendbird/chat';
import { Member } from '@sendbird/chat/groupChannel';
import { FileMessage, Reaction, UserMessage } from '@sendbird/chat/message';

import './mobile-menu-emojis.scss';

import BottomSheet from '../BottomSheet';
import { getEmojiUrl } from '../../utils';
import ImageRenderer from '../ImageRenderer';
import Icon, { IconColors, IconTypes } from '../Icon';
import Label, { LabelColors, LabelTypography } from '../Label';
import { useChannelContext } from '../../modules/Channel/context/ChannelProvider';
import UserListItem from '../UserListItem';

export interface MobileEmojisBottomSheetProps {
  message: UserMessage | FileMessage;
  emojiKey: string;
  hideMenu: () => void;
  emojiContainer?: EmojiContainer;
}

export const MobileEmojisBottomSheet = (props: MobileEmojisBottomSheetProps): ReactElement => {
  const {
    message,
    emojiKey = '',
    hideMenu,
    emojiContainer,
  } = props;
  const { currentGroupChannel } = useChannelContext();
  const { members = [] } = currentGroupChannel;
  const [selectedEmoji, setSelectedEmoji] = useState(emojiKey);

  const ReactorList = useMemo(() => {
    const memberList = message.reactions?.find(reaction => reaction.key === selectedEmoji)
      ?.userIds.map((userId) => members.find((member) => member.userId === userId) ?? null)
      .filter((member) => member !== null) as Array<Member>;
    return (
      <div className="sendbird-message__bottomsheet__reactor-list">
        {memberList?.map((member) => (
          <UserListItem
            className="sendbird-message__bottomsheet__reactor-list__item"
            user={member}
            avatarSize="36px"
          />
        ))}
      </div>
    );
  }, [selectedEmoji, message.reactions]);

  return (
    <BottomSheet onBackdropClick={hideMenu}>
      <div className="sendbird-message__bottomsheet">
        <div className="sendbird-message__bottomsheet__emoji-list">
          {message.reactions?.map((reaction: Reaction): ReactElement => {
            const emojiUrl = getEmojiUrl(emojiContainer, reaction.key);
            return (
              <div
                key={reaction.key}
                className={`
                  sendbird-message__bottomsheet__emoji-list__item
                  ${selectedEmoji === reaction.key ? 'sendbird-message__bottomsheet__emoji-list__item__selected' : ''}
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
                    <div style={style}>
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
            )
          })}
        </div>
        {ReactorList}
      </div>
    </BottomSheet>
  );
};
