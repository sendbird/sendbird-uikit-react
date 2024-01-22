import React, {
  ReactElement, ReactNode, useContext,
  useRef,
  useState,
} from 'react';
import format from 'date-fns/format';
import './index.scss';

import MessageStatus from '../MessageStatus';
import { MessageMenu, MessageMenuProps } from '../MessageItemMenu';
import { MessageEmojiMenu, MessageEmojiMenuProps } from '../MessageItemReactionMenu';
import Label, { LabelTypography, LabelColors } from '../Label';
import EmojiReactions, { EmojiReactionsProps } from '../EmojiReactions';

import ClientAdminMessage from '../AdminMessage';
import QuoteMessage from '../QuoteMessage';

import {
  getClassName,
  isOGMessage,
  isThumbnailMessage,
  SendableMessageType,
  CoreMessageType,
  isMultipleFilesMessage,
} from '../../utils';
import { LocalizationContext, useLocalization } from '../../lib/LocalizationContext';
import useSendbirdStateContext from '../../hooks/useSendbirdStateContext';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { EmojiContainer } from '@sendbird/chat';
import { AdminMessage, Feedback, FeedbackRating, FileMessage, UserMessage } from '@sendbird/chat/message';
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
import MessageFeedbackModal from '../../modules/Channel/components/MessageFeedbackModal';
import { SbFeedbackStatus } from './types';
import MessageFeedbackFailedModal from '../../modules/Channel/components/MessageFeedbackFailedModal';

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
  deleteMessage?: (message: CoreMessageType) => Promise<CoreMessageType>;
  toggleReaction?: (message: SendableMessageType, reactionKey: string, isReacted: boolean) => void;
  setQuoteMessage?: (message: SendableMessageType) => void;
  onReplyInThread?: (props: { message: SendableMessageType }) => void;
  onQuoteMessageClick?: (props: { message: SendableMessageType }) => void;
  onMessageHeightChange?: () => void;

  // For injecting customizable sub-components
  renderSenderProfile?: (props: MessageProfileProps) => ReactNode;
  renderMessageBody?: (props: MessageBodyProps) => ReactNode;
  renderMessageHeader?: (props: MessageHeaderProps) => ReactNode;
  renderMessageMenu?: (props: MessageMenuProps) => ReactNode;
  renderEmojiMenu?: (props: MessageEmojiMenuProps) => ReactNode;
  renderEmojiReactions?: (props: EmojiReactionsProps) => ReactNode;
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
  } = props;

  const { dateLocale } = useLocalization();
  const { config, eventHandlers } = useSendbirdStateContext?.() || {};
  const onPressUserProfileHandler = eventHandlers?.reaction?.onPressUserProfile;
  const contentRef = useRef(null);
  const { isMobile } = useMediaQueryContext();
  const [showMenu, setShowMenu] = useState(false);

  const [mouseHover, setMouseHover] = useState(false);
  const [supposedHover, setSupposedHover] = useState(false);
  // Feedback states
  const [showFeedbackOptionsMenu, setShowFeedbackOptionsMenu] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackFailedText, setFeedbackFailedText] = useState('');

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
  const feedbackMessageClassName = isFeedbackEnabled ? 'sendbird-message-content__feedback' : '';

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
      if (isMobile) {
        setShowMenu(true);
      }
    },
    onClick: noop,
  }, {
    delay: 300,
    shouldPreventDefault: false,
  });

  if (message?.isAdminMessage?.() || message?.messageType === 'admin') {
    return (<ClientAdminMessage message={message as AdminMessage} />);
  }

  return (
    <div
      className={getClassName([className, 'sendbird-message-content', isByMeClassName, feedbackMessageClassName])}
      onMouseOver={() => setMouseHover(true)}
      onMouseLeave={() => setMouseHover(false)}
    >
      {/* left */}
      <div className={getClassName(['sendbird-message-content__left', isReactionEnabledClassName, isByMeClassName, useReplyingClassName])}>
        {
          renderSenderProfile({
            ...props,
            isByMe,
            displayThreadReplies,
          })
        }
        {/* outgoing menu */}
        {isByMe && !isMobile && (
          <div className={getClassName(['sendbird-message-content-menu', isReactionEnabledClassName, supposedHoverClassName, isByMeClassName])}>
            {renderMessageMenu({
              channel: channel,
              message: message as SendableMessageType,
              isByMe: isByMe,
              replyType: replyType,
              disabled: disabled,
              showEdit: showEdit,
              showRemove: showRemove,
              resendMessage: resendMessage,
              setQuoteMessage: setQuoteMessage,
              setSupposedHover: setSupposedHover,
              onReplyInThread: ({ message }) => {
                if (threadReplySelectType === ThreadReplySelectType.THREAD) {
                  onReplyInThread({ message });
                } else if (threadReplySelectType === ThreadReplySelectType.PARENT) {
                  scrollToMessage(message.parentMessage?.createdAt, message.parentMessageId);
                }
              },
            })}
            {isReactionEnabledInChannel && (
              renderEmojiMenu({
                message: message as SendableMessageType,
                userId: userId,
                emojiContainer: emojiContainer,
                toggleReaction: toggleReaction,
                setSupposedHover: setSupposedHover,
              })
            )}
          </div>
        )}
      </div>
      {/* middle */}
      <div
        className={'sendbird-message-content__middle'}
        {...(isMobile ? { ...longPress } : {})}
        ref={contentRef}
      >
        {
          !isByMe && !chainTop && !useReplying && renderMessageHeader(props)
        }
        {/* quote message */}
        {(useReplying) ? (
          <div className={getClassName(['sendbird-message-content__middle__quote-message', isByMe ? 'outgoing' : 'incoming', useReplyingClassName])}>
            <QuoteMessage
              className="sendbird-message-content__middle__quote-message__quote"
              message={message as SendableMessageType}
              userId={userId}
              isByMe={isByMe}
              isUnavailable={(channel?.messageOffsetTimestamp ?? 0) > (message.parentMessage?.createdAt ?? 0)}
              onClick={() => {
                if (replyType === 'THREAD' && threadReplySelectType === ThreadReplySelectType.THREAD) {
                  onQuoteMessageClick?.({ message: message as SendableMessageType });
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
        <div className={getClassName(['sendbird-message-content__middle__body-container'])} >
          {/* message status component when sent by me */}
          {(isByMe && !chainBottom) && (
            <div className={getClassName(['sendbird-message-content__middle__body-container__created-at', 'left', supposedHoverClassName])}>
              <div className="sendbird-message-content__middle__body-container__created-at__component-container">
                <MessageStatus
                  message={message as SendableMessageType}
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
            })
          }
          {/* reactions */}
          {(isReactionEnabledInChannel && message?.reactions?.length > 0) && (
            <div className={getClassName([
              'sendbird-message-content-reactions',
              isMultipleFilesMessage(message as CoreMessageType)
                ? 'image-grid'
                : (!isByMe || isThumbnailMessage(message as FileMessage) || isOGMessage(message as UserMessage))
                  ? '' : 'primary',
              mouseHover ? 'mouse-hover' : '',
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
          {/* Feedback buttons */}
          {
            isFeedbackEnabled && <div
              className={getClassName([
                'sendbird-message-content__middle__body-container__feedback-buttons-container',
                displayThreadReplies
                  ? 'sendbird-message-content__middle__body-container__feedback-buttons-container_with-thread-replies'
                  : '',
              ])}
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
          {/* message timestamp when sent by others */}
          {(!isByMe && !chainBottom) && (
            <Label
              className={getClassName(['sendbird-message-content__middle__body-container__created-at', 'right', supposedHoverClassName])}
              type={LabelTypography.CAPTION_3}
              color={LabelColors.ONBACKGROUND_2}
            >
              {format(message?.createdAt || 0, 'p', {
                locale: dateLocale,
              })}
            </Label>
          )}
        </div>
        {/* thread replies */}
        {displayThreadReplies && (
          <ThreadReplies
            className="sendbird-message-content__middle__thread-replies"
            threadInfo={message?.threadInfo}
            onClick={() => onReplyInThread?.({ message: message as SendableMessageType })}
          />
        )}
      </div>
      {/* right */}
      <div className={getClassName(['sendbird-message-content__right', chainTopClassName, isReactionEnabledClassName, useReplyingClassName])}>
        {!isByMe && !isMobile && (
          <div className={getClassName(['sendbird-message-content-menu', chainTopClassName, supposedHoverClassName, isByMeClassName])}>
            {isReactionEnabledInChannel && (
              renderEmojiMenu({
                className: 'sendbird-message-content-menu__reaction-menu',
                message: message as SendableMessageType,
                userId: userId,
                emojiContainer: emojiContainer,
                toggleReaction: toggleReaction,
                setSupposedHover: setSupposedHover,
              })
            )}
            {renderMessageMenu({
              className: 'sendbird-message-content-menu__normal-menu',
              channel,
              message: message as SendableMessageType,
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
            })}
          </div>
        )}
      </div>
      {
        showMenu && (
          message?.isUserMessage?.() || message?.isFileMessage?.() || message?.isMultipleFilesMessage?.()
        ) && (
          <MobileMenu
            parentRef={contentRef}
            channel={channel}
            hideMenu={() => { setShowMenu(false); }}
            message={message}
            isReactionEnabled={isReactionEnabledInChannel}
            isByMe={isByMe}
            userId={userId}
            replyType={replyType}
            disabled={disabled}
            showRemove={showRemove}
            emojiContainer={emojiContainer}
            resendMessage={resendMessage}
            deleteMessage={deleteMessage}
            setQuoteMessage={setQuoteMessage}
            toggleReaction={toggleReaction}
            showEdit={showEdit}
            onReplyInThread={({ message }) => {
              if (threadReplySelectType === ThreadReplySelectType.THREAD) {
                onReplyInThread?.({ message });
              } else if (threadReplySelectType === ThreadReplySelectType.PARENT) {
                scrollToMessage?.(message?.parentMessage?.createdAt || 0, message?.parentMessageId || 0);
              }
            }}
          />
        )
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
              await message.deleteFeedback(message.myFeedback.id);
              setShowFeedbackOptionsMenu(false);
            }}
          />
        )
      }
      {/* Feedback modal */}
      {
        message.myFeedback.rating && showFeedbackModal && (
          <MessageFeedbackModal
            selectedFeedback={message.myFeedback.rating}
            message={message}
            onSubmit={async (selectedFeedback: FeedbackRating, comment: string) => {
              try {
                await message.submitFeedback({
                  rating: selectedFeedback,
                  comment,
                });
              } catch (error) {
                config?.logger?.error?.('Channel: Submit feedback failed.', error);
                setFeedbackFailedText(stringSet.FEEDBACK_FAILED_SUBMIT);
              }
              onCloseFeedbackForm();
            }}
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
