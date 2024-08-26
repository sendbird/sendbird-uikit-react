import React, { useRef, useState } from 'react';
import { EmojiContainer } from '@sendbird/chat';
import { FileMessage, UserMessage } from '@sendbird/chat/message';
import { GroupChannel } from '@sendbird/chat/groupChannel';

import './ThreadListItemContent.scss';

import { ReplyType } from '../../../../types';
import { EMOJI_MENU_ROOT_ID, getObservingId, MENU_OBSERVING_CLASS_NAME, MENU_ROOT_ID } from '../../../../ui/ContextMenu';
import { MessageEmojiMenu } from '../../../../ui/MessageItemReactionMenu';
import Label, { LabelTypography, LabelColors } from '../../../../ui/Label';
import {
  getClassName,
  isMultipleFilesMessage,
  isOGMessage,
  isThumbnailMessage,
  SendableMessageType,
} from '../../../../utils';
import MessageStatus from '../../../../ui/MessageStatus';
import EmojiReactions, { EmojiReactionsProps } from '../../../../ui/EmojiReactions';
import format from 'date-fns/format';
import { useLocalization } from '../../../../lib/LocalizationContext';
import { useMediaQueryContext } from '../../../../lib/MediaQueryContext';
import useLongPress from '../../../../hooks/useLongPress';
import MobileMenu from '../../../../ui/MobileMenu';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { ThreadMessageKind } from '../../../../ui/MultipleFilesMessageItemBody';
import { useThreadMessageKindKeySelector } from '../../../Channel/context/hooks/useThreadMessageKindKeySelector';
import { useFileInfoListWithUploaded } from '../../../Channel/context/hooks/useFileInfoListWithUploaded';
import { useThreadContext } from '../../context/ThreadProvider';
import { classnames, deleteNullish } from '../../../../utils/utils';
import { MessageMenu, MessageMenuProps } from '../../../../ui/MessageMenu';
import useElementObserver from '../../../../hooks/useElementObserver';
import type { MessageContentRenderSubComponentProps } from '../../../../ui/MessageContent';
import MessageProfile, { MessageProfileProps } from '../../../../ui/MessageContent/MessageProfile';
import MessageBody, { CustomSubcomponentsProps, MessageBodyProps } from '../../../../ui/MessageContent/MessageBody';
import { MessageHeaderProps, MessageHeader } from '../../../../ui/MessageContent/MessageHeader';
import { MobileBottomSheetProps } from '../../../../ui/MobileMenu/types';

export interface ThreadListItemContentProps extends MessageContentRenderSubComponentProps {
  className?: string;
  userId: string;
  channel: GroupChannel;
  message: SendableMessageType;
  chainTop?: boolean;
  chainBottom?: boolean;
  isReactionEnabled?: boolean;
  disableQuoteMessage?: boolean;
  replyType?: ReplyType;
  nicknamesMap?: Map<string, string>;
  emojiContainer?: EmojiContainer;
  showEdit?: (bool: boolean) => void;
  showRemove?: (bool: boolean) => void;
  showFileViewer?: (bool: boolean) => void;
  resendMessage?: (message: SendableMessageType) => void;
  toggleReaction?: (message: SendableMessageType, reactionKey: string, isReacted: boolean) => void;
  onReplyInThread?: (props: { message: SendableMessageType }) => void;
  /** @deprecated This prop is deprecated and no longer in use. */
  disabled?: boolean;
  /** @deprecated This props is deprecated and no longer in use. */
  isMentionEnabled?: boolean;
}

interface CustomMessageItemBodyType {
  customSubcomponentsProps?: CustomSubcomponentsProps;
}

export default function ThreadListItemContent(props: ThreadListItemContentProps): React.ReactElement {
  // Internal props
  const {
    className,
    userId,
    channel,
    message,
    chainTop = false,
    chainBottom = false,
    isReactionEnabled = false,
    disableQuoteMessage = false,
    replyType,
    nicknamesMap,
    emojiContainer,
    showEdit,
    showRemove,
    showFileViewer,
    resendMessage,
    toggleReaction,
    onReplyInThread,
  } = props;
  // Public props for customization
  const {
    renderSenderProfile = (props: MessageProfileProps) => <MessageProfile {...props} />,
    renderMessageBody = (props: MessageBodyProps & CustomMessageItemBodyType) => <MessageBody {...props} />,
    renderMessageHeader = (props: MessageHeaderProps) => <MessageHeader {...props} />,
    renderMessageMenu = (props: MessageMenuProps) => <MessageMenu {...props} />,
    renderEmojiMenu = () => <MessageEmojiMenu {...props} />,
    renderEmojiReactions = (props: EmojiReactionsProps) => <EmojiReactions {...props} />,
    renderMobileMenuOnLongPress = (props: MobileBottomSheetProps) => <MobileMenu {...props} />,
  } = deleteNullish(props);

  const { isMobile } = useMediaQueryContext();
  const { dateLocale } = useLocalization();
  const { config, eventHandlers } = useSendbirdStateContext?.() || {};
  const { logger } = config;
  const onPressUserProfileHandler = eventHandlers?.reaction?.onPressUserProfile;
  const isMenuMounted = useElementObserver(
    `#${getObservingId(message.messageId)}.${MENU_OBSERVING_CLASS_NAME}`,
    [
      document.getElementById(MENU_ROOT_ID),
      document.getElementById(EMOJI_MENU_ROOT_ID),
    ],
  );
  const { deleteMessage, onBeforeDownloadFileMessage } = useThreadContext();

  const isByMe = (userId === (message as SendableMessageType)?.sender?.userId)
    || ((message as SendableMessageType)?.sendingStatus === 'pending')
    || ((message as SendableMessageType)?.sendingStatus === 'failed');
  const useReplying = !!((replyType === 'QUOTE_REPLY' || replyType === 'THREAD')
    && message?.parentMessageId && message?.parentMessage
    && !disableQuoteMessage
  );
  const supposedHoverClassName = isMenuMounted ? 'sendbird-mouse-hover' : '';
  const isReactionEnabledInChannel = isReactionEnabled && !channel?.isEphemeral;
  const isOgMessageEnabledInGroupChannel = channel.isGroupChannel() && config.groupChannel.enableOgtag;

  // Mobile
  const mobileMenuRef = useRef(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const longPress = useLongPress({
    onLongPress: () => {
      if (isMobile) {
        setShowMobileMenu(true);
      }
    },
  }, {
    shouldPreventDefault: false,
  });

  const threadMessageKindKey = useThreadMessageKindKeySelector({
    threadMessageKind: ThreadMessageKind.CHILD,
    isMobile,
  });
  // For MultipleFilesMessage only.
  const statefulFileInfoList = useFileInfoListWithUploaded(message);

  return (
    <div
      className={classnames('sendbird-thread-list-item-content', className, isByMe ? 'outgoing' : 'incoming')}
      ref={mobileMenuRef}
    >
      <div className={classnames('sendbird-thread-list-item-content__left', isReactionEnabledInChannel && 'use-reaction', isByMe ? 'outgoing' : 'incoming')}>
        {(!isByMe && !chainBottom) && (
          renderSenderProfile({
            ...props,
            className: 'sendbird-thread-list-item-content__left__avatar',
            isByMe,
            displayThreadReplies: false,
          })
        )}
        {(isByMe && !isMobile) && (
          <div
            className={classnames(
              'sendbird-thread-list-item-content-menu',
              isReactionEnabledInChannel && 'use-reaction',
              isByMe ? 'outgoing' : 'incoming',
              supposedHoverClassName,
            )}
          >
            {renderMessageMenu({
              className: 'sendbird-thread-list-item-content-menu__normal-menu',
              channel: channel,
              message: message as SendableMessageType,
              isByMe: isByMe,
              replyType: replyType,
              showEdit: showEdit,
              showRemove: showRemove,
              resendMessage: resendMessage,
              onReplyInThread: onReplyInThread,
              deleteMessage: deleteMessage,
            })}
            {isReactionEnabledInChannel && (
              <>
                {renderEmojiMenu({
                  className: 'sendbird-thread-list-item-content-menu__reaction-menu',
                  message: message as SendableMessageType,
                  userId: userId,
                  emojiContainer: emojiContainer,
                  toggleReaction: toggleReaction,
                })}
              </>
            )}
          </div>
        )}
      </div>
      <div
        className="sendbird-thread-list-item-content__middle"
        {...(isMobile) ? { ...longPress } : {}}
      >
        {
          (!isByMe && !chainTop && !useReplying) && renderMessageHeader(props)
        }
        <div className={getClassName(['sendbird-thread-list-item-content__middle__body-container'])} >
          {/* message status component */}
          {(isByMe && !chainBottom) && (
            <div className={getClassName(['sendbird-thread-list-item-content__middle__body-container__created-at', 'left', supposedHoverClassName])}>
              <div className="sendbird-thread-list-item-content__middle__body-container__created-at__component-container">
                <MessageStatus
                  message={message as SendableMessageType}
                  channel={channel}
                />
              </div>
            </div>
          )}
          {/* message item body components */}
          {renderMessageBody({
            className: 'sendbird-thread-list-item-content__middle__message-item-body',
            message,
            channel,
            showFileViewer,
            mouseHover: false,
            isMobile,
            config,
            isReactionEnabledInChannel,
            isByMe,
            onBeforeDownloadFileMessage,
            /** This is for internal customization to keep the legacy */
            customSubcomponentsProps: {
              ThumbnailMessageItemBody: {
                style: {
                  width: isMobile ? '100%' : '200px',
                  height: '148px',
                },
              },
              MultipleFilesMessageItemBody: {
                threadMessageKindKey,
                statefulFileInfoList,
              },
            },
            // TODO: Support these props in Thread
            // onMessageHeightChange,
            // onTemplateMessageRenderedCallback,
          })}
          {/* reactions */}
          {(isReactionEnabledInChannel && message?.reactions?.length > 0) && (
            <div className={getClassName([
              'sendbird-thread-list-item-content-reactions',
              (
                !isByMe
                || isThumbnailMessage(message as FileMessage)
                || (isOgMessageEnabledInGroupChannel && isOGMessage(message as UserMessage))
                || isMultipleFilesMessage(message)
              ) ? '' : 'primary',
            ])}>
              {
                renderEmojiReactions({
                  userId,
                  message: message as SendableMessageType,
                  channel,
                  isByMe,
                  emojiContainer,
                  memberNicknamesMap: nicknamesMap,
                  toggleReaction,
                  onPressUserProfile: onPressUserProfileHandler,
                })
              }
            </div>
          )}
          {(!isByMe && !chainBottom) && (
            <Label
              className={getClassName(['sendbird-thread-list-item-content__middle__body-container__created-at', 'right', supposedHoverClassName])}
              type={LabelTypography.CAPTION_3}
              color={LabelColors.ONBACKGROUND_2}
            >
              {format(message?.createdAt || 0, 'p', {
                locale: dateLocale,
              })}
            </Label>
          )}
        </div>
      </div>
      <div className={classnames('sendbird-thread-list-item-content__right', chainTop && 'chain-top', isByMe ? 'outgoing' : 'incoming')}>
        {(!isByMe && !isMobile) && (
          <div className={`sendbird-thread-list-item-content-menu ${supposedHoverClassName}`}>
            {isReactionEnabledInChannel && (
              renderEmojiMenu({
                className: 'sendbird-thread-list-item-content-menu__reaction-menu',
                message: message as SendableMessageType,
                userId: userId,
                emojiContainer: emojiContainer,
                toggleReaction: toggleReaction,
              })
            )}
            {renderMessageMenu({
              className: 'sendbird-thread-list-item-content-menu__normal-menu',
              channel: channel,
              message: message as SendableMessageType,
              isByMe: isByMe,
              replyType: replyType,
              showRemove: showRemove,
              resendMessage: resendMessage,
              onReplyInThread: onReplyInThread,
              deleteMessage: deleteMessage,
            })}
          </div>
        )}
      </div>
      {showMobileMenu && (
        renderMobileMenuOnLongPress({
          parentRef: mobileMenuRef,
          channel,
          message,
          userId,
          replyType,
          hideMenu: () => {
            setShowMobileMenu(false);
          },
          isReactionEnabled,
          isByMe,
          emojiContainer,
          showEdit,
          showRemove,
          toggleReaction,
          isOpenedFromThread: true,
          deleteMessage,
          onDownloadClick: async (e) => {
            if (!onBeforeDownloadFileMessage) return;

            try {
              const allowDownload = await onBeforeDownloadFileMessage({ message: message as FileMessage });
              if (!allowDownload) {
                e.preventDefault();
                logger?.info?.('ThreadListItemContent: Not allowed to download.');
              }
            } catch (err) {
              logger?.error?.('ThreadListItemContent: Error occurred while determining download continuation:', err);
            }
          },
        })
      )}
    </div>
  );
}
