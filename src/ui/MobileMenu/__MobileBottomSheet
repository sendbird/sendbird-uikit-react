import type { Emoji } from '@sendbird/chat';
import { FileMessage, Reaction, UserMessage } from '@sendbird/chat/message';
import React, { ReactElement, useState } from 'react';

import type { MobileBottomSheetProps } from './types';
import type { GroupChannel } from '@sendbird/chat/groupChannel';

import {
  getEmojiListAll,
  isFailedMessage,
  isPendingMessage,
  isSentMessage,
  isUserMessage,
  copyToClipboard,
  isFileMessage,
  isVoiceMessage,
  isThreadMessage,
} from '../../utils';
import BottomSheet from '../BottomSheet';
import ImageRenderer from '../ImageRenderer';
import ReactionButton from '../ReactionButton';
import Icon, { IconTypes, IconColors } from '../Icon';
import Label, { LabelTypography, LabelColors } from '../Label';
import { useLocalization } from '../../lib/LocalizationContext';
import useSendbirdStateContext from '../../hooks/useSendbirdStateContext';
import { classnames } from '../../utils/utils';
import { PrebuildMenuItemPropsType } from '../MessageMenu/items';
import { BottomSheetMenuItem } from './bottomSheetMenuItem';

const EMOJI_SIZE = 38;

const MobileBottomSheet: React.FunctionComponent<MobileBottomSheetProps> = (props: MobileBottomSheetProps) => {
  const {
    hideMenu,
    channel,
    emojiContainer,
    message,
    replyType,
    userId,
    resendMessage,
    deleteMessage,
    toggleReaction,
    isReactionEnabled = false,
    showEdit,
    showRemove,
    deleteMenuState,
    setQuoteMessage,
    onReplyInThread,
    isOpenedFromThread = false,
    onDownloadClick,
    renderMenuItems,
  } = props;
  const isByMe = message?.sender?.userId === userId;
  const { stringSet } = useLocalization();
  const globalStore = useSendbirdStateContext();
  const {
    isOnline,
  } = globalStore.config;
  const showMenuItemCopy: boolean = isUserMessage(message as UserMessage);
  const showMenuItemEdit: boolean = (isUserMessage(message as UserMessage) && isSentMessage(message) && isByMe);
  const showMenuItemResend: boolean = (isOnline && isFailedMessage(message) && message?.isResendable && isByMe);

  const showMenuItemDelete: boolean = !isPendingMessage(message) && isByMe;
  const showMenuItemDeleteByState = isByMe && (deleteMenuState === undefined || deleteMenuState !== 'HIDE');
  const showMenuItemDeleteFinal = showMenuItemDeleteByState && showMenuItemDelete;

  const disableDelete = (
    (deleteMenuState !== undefined && deleteMenuState === 'DISABLE')
    || (message?.threadInfo?.replyCount ?? 0) > 0
  );

  const showMenuItemDownload: boolean = isSentMessage(message) && isFileMessage(message) && !isVoiceMessage(message);
  const showReaction: boolean = !isFailedMessage(message) && !isPendingMessage(message) && isReactionEnabled;
  const showMenuItemReply: boolean = (replyType === 'QUOTE_REPLY')
    && !isFailedMessage(message)
    && !isPendingMessage(message)
    && (channel?.isGroupChannel() && !(channel as GroupChannel)?.isBroadcast);
  const showMenuItemThread: boolean = (replyType === 'THREAD') && !isOpenedFromThread
    && !isFailedMessage(message)
    && !isPendingMessage(message)
    && !isThreadMessage(message)
    && (channel?.isGroupChannel() && !(channel as GroupChannel)?.isBroadcast);
  const disableReaction = message?.parentMessageId > 0;

  const fileMessage = message as FileMessage;
  const maxEmojisPerRow = Math.floor(window.innerWidth / EMOJI_SIZE) - 1;
  const [showEmojisOnly, setShowEmojisOnly] = useState<boolean>(false);
  const emojis = emojiContainer && getEmojiListAll(emojiContainer);
  // calculate max emojis that can be shown in screen
  const visibleEmojis = showEmojisOnly
    ? emojis
    : emojis?.slice(0, maxEmojisPerRow);
  const canShowMoreEmojis = emojis && emojis.length > maxEmojisPerRow;

  const Copy = (props: PrebuildMenuItemPropsType) => (
    <BottomSheetMenuItem
      onClick={() => {
        hideMenu();
        copyToClipboard((message as UserMessage)?.message);
      }}
    >
      {props?.children ?? (
        <>
          <Icon
            type={IconTypes.COPY}
            fillColor={IconColors.PRIMARY}
            width="24px"
            height="24px"
          />
          <Label type={LabelTypography.SUBTITLE_1} color={LabelColors.ONBACKGROUND_1}>
            {stringSet?.MESSAGE_MENU__COPY}
          </Label>
        </>
      )}
    </BottomSheetMenuItem>
  );
  const Edit = (props: PrebuildMenuItemPropsType) => (
    <BottomSheetMenuItem
      onClick={() => {
        hideMenu();
        showEdit?.(true);
      }}
    >
      {props?.children ?? (
        <>
          <Icon
            type={IconTypes.EDIT}
            fillColor={IconColors.PRIMARY}
            width="24px"
            height="24px"
          />
          <Label type={LabelTypography.SUBTITLE_1} color={LabelColors.ONBACKGROUND_1}>
            {stringSet?.MESSAGE_MENU__EDIT}
          </Label></>
      )}
    </BottomSheetMenuItem>
  );
  const Resend = (props: PrebuildMenuItemPropsType) => (
    <BottomSheetMenuItem onClick={() => {
      hideMenu();
      resendMessage?.(message);
    }}>
      {props?.children ?? (
        <><Icon
          type={IconTypes.REFRESH}
          fillColor={IconColors.PRIMARY}
          width="24px"
          height="24px"
        />
          <Label type={LabelTypography.SUBTITLE_1} color={LabelColors.ONBACKGROUND_1}>
            {stringSet?.MESSAGE_MENU__RESEND}
          </Label></>
      )}
    </BottomSheetMenuItem>
  );
  const Reply = (props: PrebuildMenuItemPropsType) => (
    <BottomSheetMenuItem disabled={disableReaction ? true : false} onClick={() => {
      if (!disableReaction) {
        hideMenu();
        setQuoteMessage?.(message);
      }
    }}>
      {props?.children ?? (
        <>
          <Icon
            type={IconTypes.REPLY}
            fillColor={disableReaction
              ? IconColors.ON_BACKGROUND_3
              : IconColors.PRIMARY
            }
            width="24px"
            height="24px"
          />
          <Label
            type={LabelTypography.SUBTITLE_1}
            color={disableReaction ? LabelColors.ONBACKGROUND_4 : LabelColors.ONBACKGROUND_1}
          >
            {stringSet?.MESSAGE_MENU__REPLY}
          </Label></>
      )}
    </BottomSheetMenuItem>
  );
  const Thread = (props: PrebuildMenuItemPropsType) => (
    <BottomSheetMenuItem onClick={() => {
      hideMenu();
      onReplyInThread?.({ message });
    }}>
      {props?.children ?? (
        <><Icon
          type={IconTypes.THREAD}
          fillColor={IconColors.PRIMARY}
          width="24px"
          height="24px"
        />
          <Label type={LabelTypography.SUBTITLE_1} color={LabelColors.ONBACKGROUND_1}>
            {stringSet.MESSAGE_MENU__THREAD}
          </Label></>
      )}
    </BottomSheetMenuItem>
  );
  const Delete = (props: PrebuildMenuItemPropsType) => (
    <BottomSheetMenuItem onClick={() => {
      if (isFailedMessage(message)) {
        hideMenu();
        deleteMessage?.(message);
      } else if (!disableDelete) {
        hideMenu();
        showRemove?.(true);
      }
    }}>
      {props?.children ?? (
        <><Icon
          type={IconTypes.DELETE}
          fillColor={
            disableDelete
              ? IconColors.ON_BACKGROUND_4
              : IconColors.PRIMARY
          }
          width="24px"
          height="24px"
        />
          <Label
            type={LabelTypography.SUBTITLE_1}
            color={
              disableDelete
                ? LabelColors.ONBACKGROUND_4
                : LabelColors.ONBACKGROUND_1
            }
          >
            {stringSet?.MESSAGE_MENU__DELETE}
          </Label></>
      )}
    </BottomSheetMenuItem>
  );
  const Download = (props: PrebuildMenuItemPropsType) => (
    <BottomSheetMenuItem onClick={() => {
      hideMenu();
    }}>
      {props?.children ?? (
        <a
          className="sendbird-message__bottomsheet--hyperlink"
          rel="noopener noreferrer"
          href={fileMessage?.url}
          target="_blank"
          onClick={onDownloadClick}
        >
          <Icon
            type={IconTypes.DOWNLOAD}
            fillColor={IconColors.PRIMARY}
            width="24px"
            height="24px"
          />
          <Label type={LabelTypography.SUBTITLE_1} color={LabelColors.ONBACKGROUND_1}>
            {stringSet?.MESSAGE_MENU__SAVE}
          </Label>
        </a>
      )}
    </BottomSheetMenuItem>
  );
  const prebuildItems = {
    Copy,
    Edit,
    Resend,
    Reply,
    Thread,
    Delete,
    Download,
  };

  return (
    <BottomSheet onBackdropClick={hideMenu}>
      <div className='sendbird-message__bottomsheet'>
        {
          showReaction && (
            <div className='sendbird-message__bottomsheet-reactions'>
              <ul
                className="sendbird-message__bottomsheet-reaction-bar"
              >
                <div className={classnames(
                  'sendbird-message__bottomsheet-reaction-bar__row',
                  showEmojisOnly && 'sendbird-message__bottomsheet-reaction-bar__all',
                )}>
                  {visibleEmojis.map((emoji: Emoji): React.ReactElement => {
                    const isReacted: boolean = message?.reactions
                      ?.filter((reaction: Reaction): boolean => reaction.key === emoji.key)[0]
                      ?.userIds
                      ?.some((reactorId: string): boolean => reactorId === userId);
                    return (
                      <ReactionButton
                        key={emoji.key}
                        width={`${EMOJI_SIZE}px`}
                        height={`${EMOJI_SIZE}px`}
                        selected={isReacted}
                        onClick={(): void => {
                          hideMenu();
                          toggleReaction?.(message, emoji.key, isReacted);
                        }}
                        testID={`ui_mobile_emoji_reactions_menu_${emoji.key}`}
                      >
                        <ImageRenderer
                          url={emoji?.url || ''}
                          width="28px"
                          height="28px"
                          placeHolder={({ style }): ReactElement => (
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
                      </ReactionButton>
                    );
                  })}
                  {
                    canShowMoreEmojis && !showEmojisOnly && (
                      <ReactionButton
                        key="emoji_more"
                        width="38px"
                        height="38px"
                        onClick={(): void => {
                          setShowEmojisOnly(true);
                        }}
                        testID="ui_mobile_emoji_reactions_menu_emojiadd"
                      >
                        <ImageRenderer
                          url={''}
                          width="28px"
                          height="28px"
                          placeHolder={({ style }): React.ReactElement => (
                            <div style={style}>
                              <Icon
                                type={IconTypes.EMOJI_MORE}
                                fillColor={IconColors.ON_BACKGROUND_3}
                                width="28px"
                                height="28px"
                              />
                            </div>
                          )}
                        />
                      </ReactionButton>
                    )
                  }
                </div>
              </ul>
            </div>
          )
        }
        {
          !showEmojisOnly && (
            <div className='sendbird-message__bottomsheet--actions'>
              {renderMenuItems?.({ close: hideMenu, prebuildItems }) ?? (
                <>
                  {showMenuItemCopy && (<Copy />)}
                  {showMenuItemEdit && (<Edit />)}
                  {showMenuItemResend && (<Resend />)}
                  {showMenuItemReply && (<Reply />)}
                  {showMenuItemThread && (<Thread />)}
                  {showMenuItemDeleteFinal && (<Delete />)}
                  {showMenuItemDownload && (<Download />)}
                </>
              )}
            </div>
          )
        }
      </div>
    </BottomSheet>
  );
};

export default MobileBottomSheet;
