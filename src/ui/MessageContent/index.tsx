import React, { ReactElement, ReactNode, useContext, useMemo, useRef, useState } from 'react';
import format from 'date-fns/format';
import './index.scss';

import MessageStatus from '../MessageStatus';
import { MessageMenu, MessageMenuProps } from '../MessageItemMenu';
import { MessageEmojiMenu, MessageEmojiMenuProps } from '../MessageItemReactionMenu';
import Label, { LabelColors, LabelTypography } from '../Label';
import EmojiReactions, { EmojiReactionsProps } from '../EmojiReactions';

import AdminMessage from '../AdminMessage';
import QuoteMessage from '../QuoteMessage';

import type { OnBeforeDownloadFileMessageType } from '../../modules/GroupChannel/context/GroupChannelProvider';
import {
  CoreMessageType,
  getClassName,
  getMessageContentMiddleClassNameByContainerType,
  isAdminMessage,
  isMultipleFilesMessage,
  isOGMessage, isSendableMessage,
  isTemplateMessage,
  isThumbnailMessage,
  SendableMessageType,
  UI_CONTAINER_TYPES,
} from '../../utils';
import { LocalizationContext, useLocalization } from '../../lib/LocalizationContext';
import useSendbirdStateContext from '../../hooks/useSendbirdStateContext';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { EmojiContainer } from '@sendbird/chat';
import { Feedback, FeedbackRating } from '@sendbird/chat/message';
import useLongPress from '../../hooks/useLongPress';
import MobileMenu from '../MobileMenu';
import { useMediaQueryContext } from '../../lib/MediaQueryContext';
import ThreadReplies from '../ThreadReplies';
import { ThreadReplySelectType } from '../../modules/Channel/context/const';
import { Nullable, ReplyType } from '../../types';
import { noop } from '../../utils/utils';
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

export interface MessageContentProps {
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
  // onClick listener for thread replies view (for open thread module)
  onReplyInThread?: (props: { message: SendableMessageType }) => void;
  // onClick listener for thread quote message view (for open thread module)
  onQuoteMessageClick?: (props: { message: SendableMessageType }) => void;
  onMessageHeightChange?: () => void;
  onBeforeDownloadFileMessage?: OnBeforeDownloadFileMessageType;

  // For injecting customizable subcomponents
  renderSenderProfile?: (props: MessageProfileProps) => ReactNode;
  renderMessageBody?: (props: MessageBodyProps) => ReactNode;
  renderMessageHeader?: (props: MessageHeaderProps) => ReactNode;
  renderMessageMenu?: (props: MessageMenuProps) => ReactNode;
  renderEmojiMenu?: (props: MessageEmojiMenuProps) => ReactNode;
  renderEmojiReactions?: (props: EmojiReactionsProps) => ReactNode;
  renderMobileMenuOnLongPress?: (props: MobileBottomSheetProps) => React.ReactElement;
}

export default function MessageContent(props: MessageContentProps): ReactElement {
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
    onReplyInThread,
    onQuoteMessageClick,
    onMessageHeightChange,
    onBeforeDownloadFileMessage,

    // Public props for customization
    renderSenderProfile = (props: MessageProfileProps) => (
      <MessageProfile {...props}/>
    ),
    renderMessageBody = (props: MessageBodyProps) => (
      <MessageBody {...props}/>
    ),
    renderMessageHeader = (props: MessageHeaderProps) => (
      <MessageHeader {...props}/>
    ),
    renderMessageMenu = (props: MessageMenuProps) => (
      <MessageMenu {...props} />
    ),
    renderEmojiMenu = (props: MessageEmojiMenuProps) => (
      <MessageEmojiMenu {...props} />
    ),
    renderEmojiReactions = (props: EmojiReactionsProps) => (
      <EmojiReactions {...props} />
    ),
    renderMobileMenuOnLongPress = (props: MobileBottomSheetProps) => (
      <MobileMenu {...props} />
    ),
  } = props;

  const { dateLocale } = useLocalization();
  const { config, eventHandlers } = useSendbirdStateContext?.() || {};
  const { logger } = config;
  const onPressUserProfileHandler = eventHandlers?.reaction?.onPressUserProfile;
  const contentRef = useRef(null);
  const timestampRef = useRef(null);
  const threadRepliesRef = useRef(null);
  const feedbackButtonsRef = useRef(null);
  const { isMobile } = useMediaQueryContext();
  const [showMenu, setShowMenu] = useState(false);

  const [mouseHover, setMouseHover] = useState(false);
  const [supposedHover, setSupposedHover] = useState(false);
  // Feedback states
  const [showFeedbackOptionsMenu, setShowFeedbackOptionsMenu] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackFailedText, setFeedbackFailedText] = useState('');
  const [uiContainerType, setUiContainerType] = useState<UI_CONTAINER_TYPES>(getMessageContentMiddleClassNameByContainerType({
    message,
    isMobile,
  }));

  const onTemplateMessageRenderedCallback = (renderedTemplateType: 'failed' | 'composite' | 'simple') => {
    if (renderedTemplateType === 'failed') {
      setUiContainerType(UI_CONTAINER_TYPES.DEFAULT);
    } else if (renderedTemplateType === 'composite') {
      /**
       * Composite templates must have default carousel view irregardless of given containerType.
       */
      setUiContainerType(UI_CONTAINER_TYPES.DEFAULT_CAROUSEL);
    }
  };

  const { stringSet } = useContext(LocalizationContext);

  const isByMe = (userId === (message as SendableMessageType)?.sender?.userId)
    || ((message as SendableMessageType)?.sendingStatus === 'pending')
    || ((message as SendableMessageType)?.sendingStatus === 'failed');
  const isByMeClassName = isByMe ? 'outgoing' : 'incoming';
  const chainTopClassName = chainTop ? 'chain-top' : '';
  const isReactionEnabledInChannel = isReactionEnabled && !channel?.isEphemeral;
  const isReactionEnabledClassName = isReactionEnabledInChannel ? 'use-reactions' : '';
  const supposedHoverClassName = supposedHover ? 'sendbird-mouse-hover' : '';
  const useReplying = !!((replyType === 'QUOTE_REPLY' || replyType === 'THREAD')
    && message?.parentMessageId && message?.parentMessage
    && !disableQuoteMessage
  );
  const useReplyingClassName = useReplying ? 'use-quote' : '';

  // Thread replies
  const displayThreadReplies = message?.threadInfo?.replyCount > 0 && replyType === 'THREAD';

  // Feedback buttons
  const isFeedbackMessage = !isByMe
    && message?.myFeedbackStatus
    && message.myFeedbackStatus !== SbFeedbackStatus.NOT_APPLICABLE;
  const isFeedbackEnabled = config?.groupChannel?.enableFeedback && isFeedbackMessage;

  /**
   * For TemplateMessage, do not display:
   *   - in web view:
   *     - message menu
   *     - reaction menu
   *     - reply in thread
   *   - in mobile view:
   *     - bottom sheet on long click
   */
  const isNotTemplateMessage = !isTemplateMessage(message);
  const showLongPressMenu = isNotTemplateMessage && isMobile;
  const showOutgoingMenu = isNotTemplateMessage && isByMe && !isMobile;
  const showThreadReplies = isNotTemplateMessage && displayThreadReplies;
  const showRightContent = isNotTemplateMessage && !isByMe && !isMobile;

  const isTimestampBottom = !!uiContainerType;

  const getTotalBottom = (): number => {
    let sum = 2;
    if (timestampRef.current && isTimestampBottom) {
      sum += 4 + timestampRef.current.clientHeight;
    }
    if (threadRepliesRef.current) {
      sum += 4 + threadRepliesRef.current.clientHeight;
    }
    if (feedbackButtonsRef.current) {
      sum += 4 + feedbackButtonsRef.current.clientHeight;
    }
    return sum;
  };

  const totalBottom = useMemo(() => getTotalBottom(), [isTimestampBottom]);

  const onCloseFeedbackForm = () => {
    setShowFeedbackModal(false);
  };

  const openFeedbackFormOrMenu = () => {
    if (isMobile) {
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

  return (
    <div
      className={getClassName([
        className,
        'sendbird-message-content',
        isByMeClassName,
        uiContainerType,
      ])}
      onMouseOver={() => setMouseHover(true)}
      onMouseLeave={() => setMouseHover(false)}
    >
      {/* left */}
      {<div className={getClassName(['sendbird-message-content__left', isReactionEnabledClassName, isByMeClassName, useReplyingClassName])}>
        {
          renderSenderProfile({
            ...props,
            isByMe,
            displayThreadReplies,
            bottom: totalBottom > 0 ? totalBottom + 'px' : '',
          })
        }
        {/* outgoing menu */}
        {showOutgoingMenu && (
          <div className={getClassName(['sendbird-message-content-menu', isReactionEnabledClassName, supposedHoverClassName, isByMeClassName])}>
            {renderMessageMenu({
              channel,
              message,
              isByMe,
              replyType,
              disabled,
              showEdit,
              showRemove,
              resendMessage,
              setQuoteMessage,
              setSupposedHover,
              onReplyInThread: ({ message }) => {
                if (threadReplySelectType === ThreadReplySelectType.THREAD) {
                  onReplyInThread({ message });
                } else if (threadReplySelectType === ThreadReplySelectType.PARENT) {
                  scrollToMessage(message.parentMessage?.createdAt, message.parentMessageId);
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
                setSupposedHover,
              })
            )}
          </div>
        )}
      </div>}

      {/* middle */}
      <div
        className={getClassName([
          'sendbird-message-content__middle',
          isTemplateMessage(message) ? 'sendbird-message-content__middle__for_template_message' : '',
          uiContainerType,
        ])}
        {...(isMobile ? { ...longPress } : {})}
        ref={contentRef}
        >
        {
          !isByMe && !chainTop && !useReplying && renderMessageHeader(props)
        }
        {/* quote message */}
        {(useReplying) ? (
          <div
            className={getClassName(['sendbird-message-content__middle__quote-message', isByMe ? 'outgoing' : 'incoming', useReplyingClassName])}>
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
                  scrollToMessage(message.parentMessage.createdAt, message.parentMessageId);
                }
              }}
            />
          </div>
        ) : null}
        {/* container: message item body + emoji reactions */}

        <div
          className={getClassName([
            'sendbird-message-content__middle__body-container',
            isTemplateMessage(message) ? 'sendbird-message-content__middle__for_template_message' : '',
          ])}
        >
          {/* message status component when sent by me */}
          {(isByMe && !chainBottom) && (
            <div
              className={getClassName([
                'sendbird-message-content__middle__body-container__created-at',
                'left',
                supposedHoverClassName,
                uiContainerType,
              ])}
              ref={timestampRef}
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
              onTemplateMessageRenderedCallback,
              onBeforeDownloadFileMessage,
            })
          }
          {/* reactions */}
          {(isReactionEnabledInChannel && message?.reactions?.length > 0) && (
            <div className={getClassName([
              'sendbird-message-content-reactions',
              isMultipleFilesMessage(message)
                ? 'image-grid'
                : (!isByMe || isThumbnailMessage(message) || isOGMessage(message))
                  ? '' : 'primary',
              mouseHover ? 'mouse-hover' : '',
            ])}>
              {
                renderEmojiReactions({
                  userId,
                  message,
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
          {/* message timestamp when sent by others */}
          {(!isByMe && !chainBottom) && (
            <Label
              className={getClassName([
                'sendbird-message-content__middle__body-container__created-at',
                'right',
                supposedHoverClassName,
                uiContainerType,
              ])}
              type={LabelTypography.CAPTION_3}
              color={LabelColors.ONBACKGROUND_2}
              ref={timestampRef}
            >
              {format(message?.createdAt || 0, 'p', {
                locale: dateLocale,
              })}
            </Label>
          )}
        </div>
        {/* bottom timestamp empty container */}
        {isTimestampBottom && <div
          style={{
            width: '100%',
            height: (timestampRef.current?.clientHeight ?? 0) + 'px',
            marginTop: '4px',
          }}
        />}
        {/* thread replies */}
        {showThreadReplies && (
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
                if (!message?.myFeedback?.rating) {
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
                  openFeedbackFormOrMenu();
                }
              }}
              disabled={message?.myFeedback && message.myFeedback.rating !== FeedbackRating.GOOD}
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
                if (!message?.myFeedback?.rating) {
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
                  openFeedbackFormOrMenu();
                }
              }}
              disabled={message?.myFeedback && message.myFeedback.rating !== FeedbackRating.BAD}
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
        className={getClassName(['sendbird-message-content__right', chainTopClassName, isReactionEnabledClassName, useReplyingClassName])}>
          <div className={getClassName(['sendbird-message-content-menu', chainTopClassName, supposedHoverClassName, isByMeClassName])}>
            {isReactionEnabledInChannel && (
              renderEmojiMenu({
                className: 'sendbird-message-content-menu__reaction-menu',
                message,
                userId,
                emojiContainer,
                toggleReaction,
                setSupposedHover,
              })
            )}
            {renderMessageMenu({
              className: 'sendbird-message-content-menu__normal-menu',
              channel,
              message,
              isByMe,
              replyType,
              disabled,
              showRemove,
              resendMessage,
              setQuoteMessage,
              setSupposedHover,
              onReplyInThread: ({ message }) => {
                if (threadReplySelectType === ThreadReplySelectType.THREAD) {
                  onReplyInThread({ message });
                } else if (threadReplySelectType === ThreadReplySelectType.PARENT) {
                  scrollToMessage(message.parentMessage?.createdAt, message.parentMessageId);
                }
              },
              deleteMessage,
            })}
          </div>
      </div>
      )}

      {
        showMenu && isSendableMessage(message) && renderMobileMenuOnLongPress({
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
          onReplyInThread: ({ message }) => {
            if (threadReplySelectType === ThreadReplySelectType.THREAD) {
              onReplyInThread?.({ message });
            } else if (threadReplySelectType === ThreadReplySelectType.PARENT) {
              scrollToMessage?.(message?.parentMessage?.createdAt || 0, message?.parentMessageId || 0);
            }
          },
          onDownloadClick: async (e) => {
            if (!onBeforeDownloadFileMessage) {
              return null;
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
                await message.deleteFeedback(message.myFeedback.id);
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
              const newFeedback: Feedback = new Feedback({
                id: message.myFeedback.id,
                rating: selectedFeedback,
                comment,
              });
              try {
                await message.updateFeedback(newFeedback);
              } catch (error) {
                config?.logger?.error?.('Channel: Update feedback failed.', error);
                setFeedbackFailedText(stringSet.FEEDBACK_FAILED_SAVE);
              }
              onCloseFeedbackForm();
            }}
            onClose={onCloseFeedbackForm}
            onRemove={async () => {
              try {
                await message.deleteFeedback(message.myFeedback.id);
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
