import React, { ReactElement, ReactNode, useEffect, useRef, useState } from 'react';
import format from 'date-fns/format';
import './index.scss';

import MessageStatus from '../MessageStatus';
import { MessageMenu, type MessageMenuProps } from '../MessageMenu';
import { MessageEmojiMenu, MessageEmojiMenuProps } from '../MessageItemReactionMenu';
import Label, { LabelColors, LabelTypography } from '../Label';
import EmojiReactions, { EmojiReactionsProps } from '../EmojiReactions';

import AdminMessage from '../AdminMessage';
import QuoteMessage from '../QuoteMessage';

import type { OnBeforeDownloadFileMessageType } from '../../modules/GroupChannel/context/types';
import {
  CoreMessageType,
  getClassName,
  isAdminMessage,
  isFormMessage,
  isMultipleFilesMessage,
  isOGMessage, isSendableMessage,
  isTemplateMessage,
  isThumbnailMessage,
  isValidTemplateMessageType,
  SendableMessageType,
} from '../../utils';
import { useLocalization } from '../../lib/LocalizationContext';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { type EmojiCategory, EmojiContainer } from '@sendbird/chat';
import { Feedback, FeedbackRating } from '@sendbird/chat/message';
import useLongPress from '../../hooks/useLongPress';
import MobileMenu from '../MobileMenu';
import { useMediaQueryContext } from '../../lib/MediaQueryContext';
import ThreadReplies from '../ThreadReplies';
import { ThreadReplySelectType } from '../../modules/Channel/context/const';
import { Nullable, ReplyType } from '../../types';
import { classnames, deleteNullish, noop } from '../../utils/utils';
import MessageProfile, { MessageProfileProps } from './MessageProfile';
import MessageBody, { MessageBodyProps } from './MessageBody';
import MessageHeader, { MessageHeaderProps } from './MessageHeader';
import Icon, { IconTypes } from '../Icon';
import FeedbackIconButton from '../FeedbackIconButton';
import MobileFeedbackMenu from '../MobileFeedbackMenu';
import MessageFeedbackModal from '../MessageFeedbackModal';
import { SbFeedbackStatus } from './types';
import MessageFeedbackFailedModal from '../MessageFeedbackFailedModal';
import { MobileBottomSheetProps } from '../MobileMenu/types';
import useElementObserver from '../../hooks/useElementObserver';
import { EMOJI_MENU_ROOT_ID, getObservingId, MENU_OBSERVING_CLASS_NAME, MENU_ROOT_ID } from '../ContextMenu';
import { MessageContentForTemplateMessage } from './MessageContentForTemplateMessage';
import { MESSAGE_TEMPLATE_KEY } from '../../utils/consts';
import useSendbird from '../../lib/Sendbird/context/hooks/useSendbird';

export { MessageBody } from './MessageBody';
export { MessageHeader } from './MessageHeader';
export { MessageProfile } from './MessageProfile';

export interface MessageContentProps extends MessageComponentRenderers {
  className?: string | Array<string>;
  userId: string;
  channel: Nullable<GroupChannel>;
  message: CoreMessageType;
  disabled?: boolean;
  chainTop?: boolean;
  chainBottom?: boolean;
  isReactionEnabled?: boolean;
  disableQuoteMessage?: boolean;
  replyType?: ReplyType;
  threadReplySelectType?: ThreadReplySelectType;
  nicknamesMap?: Map<string, string>;
  emojiContainer?: EmojiContainer;
  scrollToMessage?: (createdAt: number, messageId: number) => void;
  showEdit?: (bool: boolean) => void;
  showRemove?: (bool: boolean) => void;
  showFileViewer?: (bool: boolean) => void;
  resendMessage?: (message: SendableMessageType) => void;
  deleteMessage?: (message: CoreMessageType) => Promise<void>;
  toggleReaction?: (message: SendableMessageType, reactionKey: string, isReacted: boolean) => void;
  setQuoteMessage?: (message: SendableMessageType) => void;
  markAsUnread?: (message: SendableMessageType) => void;
  // onClick listener for thread replies view (for open thread module)
  onReplyInThread?: (props: { message: SendableMessageType }) => void;
  // onClick listener for thread quote message view (for open thread module)
  onQuoteMessageClick?: (props: { message: SendableMessageType }) => void;
  onMessageHeightChange?: () => void;
  onBeforeDownloadFileMessage?: OnBeforeDownloadFileMessageType;
}

export interface MessageComponentRenderers {
  renderSenderProfile?: (props: MessageProfileProps) => ReactNode;
  renderMessageBody?: (props: MessageBodyProps) => ReactNode;
  renderMessageHeader?: (props: MessageHeaderProps) => ReactNode;
  renderMessageMenu?: (props: MessageMenuProps) => ReactNode;
  renderEmojiMenu?: (props: MessageEmojiMenuProps) => ReactNode;
  renderEmojiReactions?: (props: EmojiReactionsProps) => ReactNode;
  renderMobileMenuOnLongPress?: (props: MobileBottomSheetProps) => React.ReactElement;
  filterEmojiCategoryIds?: (message: SendableMessageType) => EmojiCategory['id'][];
}

export function MessageContent(props: MessageContentProps): ReactElement {
  const {
    // Internal props
    className,
    userId,
    channel,
    message,
    disabled = false,
    chainTop = false,
    chainBottom = false,
    isReactionEnabled = false,
    disableQuoteMessage = false,
    replyType,
    threadReplySelectType,
    nicknamesMap,
    emojiContainer,
    scrollToMessage,
    showEdit,
    showRemove,
    showFileViewer,
    resendMessage,
    deleteMessage,
    toggleReaction,
    setQuoteMessage,
    markAsUnread,
    onReplyInThread,
    onQuoteMessageClick,
    onMessageHeightChange,
    onBeforeDownloadFileMessage,
    filterEmojiCategoryIds,
  } = props;

  // Public props for customization
  const {
    renderSenderProfile = (props: MessageProfileProps) => <MessageProfile {...props} />,
    renderMessageBody = (props: MessageBodyProps) => <MessageBody {...props} />,
    renderMessageHeader = (props: MessageHeaderProps) => <MessageHeader {...props} />,
    renderMessageMenu = (props: MessageMenuProps) => <MessageMenu {...props} />,
    renderEmojiMenu = (props: MessageEmojiMenuProps) => <MessageEmojiMenu {...props} />,
    renderEmojiReactions = (props: EmojiReactionsProps) => <EmojiReactions {...props} />,
    renderMobileMenuOnLongPress = (props: MobileBottomSheetProps) => <MobileMenu {...props} />,
  } = deleteNullish(props);

  const { dateLocale, stringSet } = useLocalization();
  const { state: { config, eventHandlers } } = useSendbird();
  const { logger } = config;
  const onPressUserProfileHandler = eventHandlers?.reaction?.onPressUserProfile;
  const contentRef = useRef<HTMLDivElement>();
  const threadRepliesRef = useRef<HTMLDivElement>();
  const feedbackButtonsRef = useRef<HTMLDivElement>();
  const { isMobile } = useMediaQueryContext();
  const [showMenu, setShowMenu] = useState(false);

  const [mouseHover, setMouseHover] = useState(false);
  const isMenuMounted = useElementObserver(
    `#${getObservingId(message.messageId)}.${MENU_OBSERVING_CLASS_NAME}`,
    [
      document.getElementById(MENU_ROOT_ID),
      document.getElementById(EMOJI_MENU_ROOT_ID),
    ],
  );
  // Feedback states
  const [showFeedbackOptionsMenu, setShowFeedbackOptionsMenu] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackFailedText, setFeedbackFailedText] = useState('');

  const isByMe = (userId === (message as SendableMessageType)?.sender?.userId)
    || ((message as SendableMessageType)?.sendingStatus === 'pending')
    || ((message as SendableMessageType)?.sendingStatus === 'failed');
  const isByMeClassName = isByMe ? 'outgoing' : 'incoming';
  const chainTopClassName = chainTop ? 'chain-top' : '';
  const isReactionEnabledInChannel = isReactionEnabled && !channel?.isEphemeral;
  const isReactionEnabledClassName = isReactionEnabledInChannel ? 'use-reactions' : '';
  const hoveredMenuClassName = isMenuMounted ? 'sendbird-mouse-hover' : '';
  const useReplying = !!((replyType === 'QUOTE_REPLY' || replyType === 'THREAD')
    && message?.parentMessageId && message?.parentMessage
    && !disableQuoteMessage
  );
  const useReplyingClassName = useReplying ? 'use-quote' : '';

  useEffect(() => {
    if (useReplying) {
      onMessageHeightChange?.();
    }
  }, [useReplying]);

  // Thread replies
  const displayThreadReplies = message?.threadInfo
    && message.threadInfo.replyCount > 0
    && replyType === 'THREAD';

  // Feedback buttons
  const isFeedbackMessage = !isByMe
    && !!message?.myFeedbackStatus
    && message.myFeedbackStatus !== SbFeedbackStatus.NOT_APPLICABLE;
  // Force-disable feedback regardless of config/message state.
  const isFeedbackEnabled = false && isFeedbackMessage;
  const hasFeedback = message?.myFeedback?.rating;

  /**
   * For TemplateMessage or FormMessage, do not display:
   *   - in web view:
   *     - message menu
   *     - reaction menu
   *     - reply in thread
   *   - in mobile view:
   *     - bottom sheet on long click
   */
  const isNotSpecialMessage = !isTemplateMessage(message) && !isFormMessage(message);
  const showLongPressMenu = isNotSpecialMessage && isMobile;
  const showOutgoingMenu = isNotSpecialMessage && isByMe && !isMobile;
  const showThreadReplies = isNotSpecialMessage && displayThreadReplies;
  const showRightContent = isNotSpecialMessage && !isByMe && !isMobile;

  const getTotalBottom = (): string => {
    let sum = 2;
    if (threadRepliesRef.current) {
      sum += 4 + threadRepliesRef.current.clientHeight;
    }
    if (feedbackButtonsRef.current) {
      sum += 4 + feedbackButtonsRef.current.clientHeight;
    }
    return sum > 0 ? sum + 'px' : '';
  };

  const onCloseFeedbackForm = () => {
    setShowFeedbackModal(false);
  };

  const openFeedbackFormOrMenu = (hasFeedback = false) => {
    if (isMobile && hasFeedback) {
      setShowFeedbackOptionsMenu(true);
    } else {
      setShowFeedbackModal(true);
    }
  };

  // onMouseDown: (e: React.MouseEvent<T>) => void;
  // onTouchStart: (e: React.TouchEvent<T>) => void;
  // onMouseUp: (e: React.MouseEvent<T>) => void;
  // onMouseLeave: (e: React.MouseEvent<T>) => void;
  // onTouchEnd: (e: React.TouchEvent<T>) => void;
  const longPress = useLongPress({
    onLongPress: () => {
      if (showLongPressMenu) {
        setShowMenu(true);
      }
    },
    onClick: noop,
  }, {
    delay: 300,
    shouldPreventDefault: false,
  });

  if (isAdminMessage(message)) {
    return (<AdminMessage message={message} />);
  }

  if (isTemplateMessage(message)) {
    const templatePayload = message.extendedMessagePayload[MESSAGE_TEMPLATE_KEY];
    if (isValidTemplateMessageType(templatePayload)) {
      return (
        <MessageContentForTemplateMessage
          {...props}
          renderSenderProfile={renderSenderProfile}
          renderMessageHeader={renderMessageHeader}
          renderMessageBody={renderMessageBody}
          isByMe={isByMe}
          displayThreadReplies={displayThreadReplies}
          mouseHover={mouseHover}
          isMobile={isMobile}
          isReactionEnabledInChannel={isReactionEnabledInChannel}
          hoveredMenuClassName={hoveredMenuClassName}
          templateType={templatePayload['type']}
          useReplying={useReplying}
        />
      );
    }
  }

  return (
    <div
      className={getClassName([
        className ?? '',
        'sendbird-message-content',
        isByMeClassName,
      ])}
      onMouseOver={() => setMouseHover(true)}
      onMouseLeave={() => setMouseHover(false)}
    >
      {/* left */}
      {<div
        className={classnames('sendbird-message-content__left', isReactionEnabledClassName, isByMeClassName, useReplyingClassName)}
        data-testid="sendbird-message-content__left"
      >
        {
          renderSenderProfile({
            ...props,
            className: 'sendbird-message-content__left__avatar',
            isByMe,
            displayThreadReplies,
            bottom: getTotalBottom(),
          })
        }
        {/* outgoing menu */}
        {showOutgoingMenu && (
          <div className={classnames('sendbird-message-content-menu', isReactionEnabledClassName, hoveredMenuClassName, isByMeClassName)}>
            {renderMessageMenu({
              channel,
              message,
              isByMe,
              replyType,
              showEdit,
              showRemove,
              resendMessage,
              setQuoteMessage,
              markAsUnread,
              onReplyInThread: ({ message }) => {
                if (threadReplySelectType === ThreadReplySelectType.THREAD) {
                  onReplyInThread?.({ message });
                } else if (threadReplySelectType === ThreadReplySelectType.PARENT) {
                  scrollToMessage?.(message.parentMessage?.createdAt ?? 0, message.parentMessageId);
                }
              },
              deleteMessage,
            })}
            {isReactionEnabledInChannel && (
              renderEmojiMenu({
                message,
                userId,
                emojiContainer,
                toggleReaction,
                filterEmojiCategoryIds,
              })
            )}
          </div>
        )}
      </div>}

      {/* middle */}
      <div
        className={classnames(
          'sendbird-message-content__middle',
        )}
        data-testid="sendbird-message-content__middle"
        {...(isMobile ? { ...longPress } : {})}
        ref={contentRef}
      >
        {
          (!isByMe && !chainTop && !useReplying) && renderMessageHeader(props)
        }
        {/* quote message */}
        {(useReplying) ? (
          <div
            className={classnames('sendbird-message-content__middle__quote-message', isByMe ? 'outgoing' : 'incoming', useReplyingClassName)}
            data-testid="sendbird-message-content__middle__quote-message"
          >
            <QuoteMessage
              className="sendbird-message-content__middle__quote-message__quote"
              message={message}
              userId={userId}
              isByMe={isByMe}
              isUnavailable={(channel?.messageOffsetTimestamp ?? 0) > (message.parentMessage?.createdAt ?? 0)}
              onClick={() => {
                if (replyType === 'THREAD' && threadReplySelectType === ThreadReplySelectType.THREAD) {
                  onQuoteMessageClick?.({ message });
                }
                if (
                  (replyType === 'QUOTE_REPLY' || (replyType === 'THREAD' && threadReplySelectType === ThreadReplySelectType.PARENT))
                  && message?.parentMessage?.createdAt && message?.parentMessageId
                ) {
                  scrollToMessage?.(message.parentMessage.createdAt, message.parentMessageId);
                }
              }}
            />
          </div>
        ) : null}
        {/* container: message item body + emoji reactions */}

        <div
          className={classnames(
            'sendbird-message-content__middle__body-container',
            isThumbnailMessage(message) && 'sendbird-message-content__middle__body-container--thumbnail',
          )}
        >
          {/* message status component when sent by me */}
          {(isByMe && !chainBottom) && (
            <div
              className={classnames(
                'sendbird-message-content__middle__body-container__created-at',
                'left',
                hoveredMenuClassName,
              )}
            >
              <div className="sendbird-message-content__middle__body-container__created-at__component-container">
                <MessageStatus
                  message={message}
                  channel={channel}
                />
              </div>
            </div>
          )}
          {
            renderMessageBody({
              message,
              channel,
              showFileViewer,
              onMessageHeightChange,
              mouseHover,
              isMobile,
              config,
              isReactionEnabledInChannel,
              isByMe,
              onBeforeDownloadFileMessage,
            })
          }
          {/* reactions */}
          {(isReactionEnabledInChannel && message?.reactions?.length > 0) && (
            <div className={classnames(
              'sendbird-message-content-reactions',
              isMultipleFilesMessage(message) ? 'image-grid'
                : (isByMe && !isThumbnailMessage(message) && !isOGMessage(message)) && 'primary',
              mouseHover && 'mouse-hover',
            )}>
              {
                renderEmojiReactions({
                  userId,
                  message,
                  channel,
                  isByMe,
                  emojiContainer: emojiContainer,
                  memberNicknamesMap: nicknamesMap ?? new Map(),
                  toggleReaction,
                  onPressUserProfile: onPressUserProfileHandler,
                  filterEmojiCategoryIds,
                })
              }
            </div>
          )}
          {/* message timestamp when sent by others */}
          {(!isByMe && !chainBottom) && (
            <Label
              className={classnames(
                'sendbird-message-content__middle__body-container__created-at',
                'right',
                hoveredMenuClassName,
              )}
              type={LabelTypography.CAPTION_3}
              color={LabelColors.ONBACKGROUND_2}
            >
              {format(message?.createdAt || 0, stringSet.DATE_FORMAT__MESSAGE_CREATED_AT, {
                locale: dateLocale,
              })}
            </Label>
          )}
        </div>
        {/* thread replies */}
        {showThreadReplies && message?.threadInfo && (
          <ThreadReplies
            className="sendbird-message-content__middle__thread-replies"
            threadInfo={message?.threadInfo}
            onClick={() => onReplyInThread?.({ message })}
            ref={threadRepliesRef}
          />
        )}
        {/* Feedback buttons */}
        {
          isFeedbackEnabled && <div
            className="sendbird-message-content__middle__body-container__feedback-buttons-container"
            ref={feedbackButtonsRef}
          >
            <FeedbackIconButton
              isSelected={message?.myFeedback?.rating === FeedbackRating.GOOD}
              onClick={async () => {
                if (!hasFeedback) {
                  try {
                    await message.submitFeedback({
                      rating: FeedbackRating.GOOD,
                    });
                    openFeedbackFormOrMenu();
                  } catch (error) {
                    config?.logger?.error?.('Channel: Submit feedback failed.', error);
                    setFeedbackFailedText(stringSet.FEEDBACK_FAILED_SUBMIT);
                  }
                } else {
                  openFeedbackFormOrMenu(true);
                }
              }}
              disabled={!!message?.myFeedback && message.myFeedback.rating !== FeedbackRating.GOOD}
            >
              <Icon
                type={IconTypes.FEEDBACK_LIKE}
                width='24px'
                height='24px'
              />
            </FeedbackIconButton>
            <FeedbackIconButton
              isSelected={message?.myFeedback?.rating === FeedbackRating.BAD}
              onClick={async () => {
                if (!hasFeedback) {
                  try {
                    await message.submitFeedback({
                      rating: FeedbackRating.BAD,
                    });
                    openFeedbackFormOrMenu();
                  } catch (error) {
                    config?.logger?.error?.('Channel: Submit feedback failed.', error);
                    setFeedbackFailedText(stringSet.FEEDBACK_FAILED_SUBMIT);
                  }
                } else {
                  openFeedbackFormOrMenu(true);
                }
              }}
              disabled={!!message?.myFeedback && message.myFeedback.rating !== FeedbackRating.BAD}
            >
              <Icon
                type={IconTypes.FEEDBACK_DISLIKE}
                width='24px'
                height='24px'
              />
            </FeedbackIconButton>
          </div>
        }
      </div>

      {/* right */}
      {showRightContent && (
        <div
          className={classnames('sendbird-message-content__right', chainTopClassName, isReactionEnabledClassName, useReplyingClassName)}
          data-testid="sendbird-message-content__right"
        >
          <div className={classnames('sendbird-message-content-menu', chainTopClassName, hoveredMenuClassName, isByMeClassName)}>
            {isReactionEnabledInChannel && (
              renderEmojiMenu({
                className: 'sendbird-message-content-menu__reaction-menu',
                message,
                userId,
                emojiContainer,
                toggleReaction,
                filterEmojiCategoryIds,
              })
            )}
            {renderMessageMenu({
              className: 'sendbird-message-content-menu__normal-menu',
              channel,
              message,
              isByMe,
              replyType,
              showRemove,
              resendMessage,
              setQuoteMessage,
              markAsUnread,
              onReplyInThread: ({ message }) => {
                if (threadReplySelectType === ThreadReplySelectType.THREAD) {
                  onReplyInThread?.({ message });
                } else if (threadReplySelectType === ThreadReplySelectType.PARENT) {
                  scrollToMessage?.(message.parentMessage?.createdAt ?? 0, message.parentMessageId);
                }
              },
              deleteMessage,
            })}
          </div>
        </div>
      )}

      {
        showMenu && isSendableMessage(message) && channel && renderMobileMenuOnLongPress({
          parentRef: contentRef,
          channel,
          hideMenu: () => { setShowMenu(false); },
          message,
          isReactionEnabled: isReactionEnabledInChannel,
          isByMe,
          userId,
          replyType,
          disabled,
          showRemove,
          emojiContainer,
          resendMessage,
          deleteMessage,
          setQuoteMessage,
          toggleReaction,
          showEdit,
          markAsUnread,
          onReplyInThread: ({ message }) => {
            if (threadReplySelectType === ThreadReplySelectType.THREAD) {
              onReplyInThread?.({ message });
            } else if (threadReplySelectType === ThreadReplySelectType.PARENT) {
              scrollToMessage?.(message?.parentMessage?.createdAt || 0, message?.parentMessageId || 0);
            }
          },
          onDownloadClick: async (e) => {
            if (!onBeforeDownloadFileMessage) {
              return;
            }
            try {
              const allowDownload = await onBeforeDownloadFileMessage({ message });
              if (!allowDownload) {
                e.preventDefault();
                logger?.info?.('MessageContent: Not allowed to download.');
              }
            } catch (err) {
              logger?.error?.('MessageContent: Error occurred while determining download continuation:', err);
            }
          },
        })
      }
      {
        message?.myFeedback?.rating && showFeedbackOptionsMenu && (
          <MobileFeedbackMenu
            hideMenu={() => {
              setShowFeedbackOptionsMenu(false);
            }}
            onEditFeedback={() => {
              setShowFeedbackOptionsMenu(false);
              setShowFeedbackModal(true);
            }}
            onRemoveFeedback={async () => {
              try {
                if (message.myFeedback !== null) {
                  await message.deleteFeedback(message.myFeedback.id);
                }
              } catch (error) {
                config?.logger?.error?.('Channel: Delete feedback failed.', error);
                setFeedbackFailedText(stringSet.FEEDBACK_FAILED_DELETE);
              }
              setShowFeedbackOptionsMenu(false);
            }}
          />
        )
      }
      {/* Feedback modal */}
      {
        message?.myFeedback?.rating && showFeedbackModal && (
          <MessageFeedbackModal
            selectedFeedback={message.myFeedback.rating}
            message={message}
            onUpdate={async (selectedFeedback: FeedbackRating, comment: string) => {
              if (message.myFeedback !== null) {
                const newFeedback: Feedback = {
                  id: message.myFeedback.id,
                  rating: selectedFeedback,
                  comment,
                };
                try {
                  await message.updateFeedback(newFeedback);
                } catch (error) {
                  config?.logger?.error?.('Channel: Update feedback failed.', error);
                  setFeedbackFailedText(stringSet.FEEDBACK_FAILED_SAVE);
                }
              }
              onCloseFeedbackForm();
            }}
            onClose={onCloseFeedbackForm}
            onRemove={async () => {
              try {
                if (message.myFeedback !== null) {
                  await message.deleteFeedback(message.myFeedback.id);
                }
              } catch (error) {
                config?.logger?.error?.('Channel: Delete feedback failed.', error);
                setFeedbackFailedText(stringSet.FEEDBACK_FAILED_DELETE);
              }
              onCloseFeedbackForm();
            }}
          />
        )
      }
      {/* Feedback failed modal */}
      {
        feedbackFailedText && (
          <MessageFeedbackFailedModal
            text={feedbackFailedText}
            onCancel={() => {
              setFeedbackFailedText('');
            }}
          />
        )
      }
    </div>
  );
}

export default MessageContent;
