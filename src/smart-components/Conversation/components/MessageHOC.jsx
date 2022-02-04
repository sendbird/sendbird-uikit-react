import React, {
  useState,
  useRef,
  useMemo,
  useLayoutEffect,
  useContext,
} from 'react';
import PropTypes from 'prop-types';
import format from 'date-fns/format';

import { LocalizationContext } from '../../../lib/LocalizationContext';
import MessageContent from '../../../ui/MessageContent';
import DateSeparator from '../../../ui/DateSeparator';
import Label, { LabelTypography, LabelColors } from '../../../ui/Label';
import MessageInput from '../../../ui/MessageInput';
import FileViewer from '../../../ui/FileViewer';
import RemoveMessageModal from './RemoveMessage';
import { getClassName } from '../../../utils';

export default function MessageHoc({
  message,
  userId,
  disabled,
  editDisabled,
  hasSeparator,
  deleteMessage,
  updateMessage,
  scrollToMessage,
  resendMessage,
  useReaction,
  replyType,
  chainTop,
  chainBottom,
  membersMap,
  emojiContainer,
  animatedMessageId,
  highLightedMessageId,
  toggleReaction,
  quoteMessage,
  setQuoteMessage,
  renderCustomMessage,
  currentGroupChannel,
  handleScroll,
}) {
  const { sender = {} } = message;
  const [showEdit, setShowEdit] = useState(false);
  const [showRemove, setShowRemove] = useState(false);
  const [showFileViewer, setShowFileViewer] = useState(false);
  const [isAnimated, setIsAnimated] = useState(false);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const editMessageInputRef = useRef(null);
  const useMessageScrollRef = useRef(null);

  const { dateLocale } = useContext(LocalizationContext);
  useLayoutEffect(() => {
    handleScroll();
  }, [showEdit, message?.reactions?.length]);

  useLayoutEffect(() => {
    if (highLightedMessageId === message.messageId) {
      if (useMessageScrollRef && useMessageScrollRef.current) {
        useMessageScrollRef.current.scrollIntoView({
          block: 'center',
          inline: 'center',
        });
        setIsAnimated(false);
        setTimeout(() => {
          setIsHighlighted(true);
        }, 500);
      }
    } else {
      setIsHighlighted(false);
    }
  }, [highLightedMessageId, useMessageScrollRef.current, message.messageId]);
  useLayoutEffect(() => {
    if (animatedMessageId === message.messageId) {
      if (useMessageScrollRef && useMessageScrollRef.current) {
        useMessageScrollRef.current.scrollIntoView({
          block: 'center',
          inline: 'center',
        });
        setIsHighlighted(false);
        setTimeout(() => {
          setIsAnimated(true);
        }, 500);
      }
    } else {
      setIsAnimated(false);
    }
  }, [animatedMessageId, useMessageScrollRef.current, message.messageId]);
  const RenderedMessage = useMemo(() => {
    if (renderCustomMessage) {
      return renderCustomMessage(message, currentGroupChannel, chainTop, chainBottom);
      // TODO: Let's change this to object type on next major version up
      // and add params 'hasSeparator' and 'menuDisabled', scrollToMessage
    }
    return null;
  }, [message, message.message, renderCustomMessage]);

  const isByMe = (userId === sender?.userId)
    || (message.requestState === 'pending')
    || (message.requestState === 'failed');

  if (RenderedMessage) {
    return (
      <div
        ref={useMessageScrollRef}
        className={getClassName([
          'sendbird-msg-hoc sendbird-msg--scroll-ref',
          isAnimated ? 'sendbird-msg-hoc__animated' : '',
          isHighlighted ? 'sendbird-msg-hoc__highlighted' : '',
        ])}
      >
        {/* date-separator */}
        {
          hasSeparator && (
            <DateSeparator>
              <Label type={LabelTypography.CAPTION_2} color={LabelColors.ONBACKGROUND_2}>
                {format(message?.createdAt, 'MMMM dd, yyyy', { locale: dateLocale })}
              </Label>
            </DateSeparator>
          )
        }
        <RenderedMessage message={message} />
      </div>
    );
  }

  if (showEdit) {
    return (
      <MessageInput
        isEdit
        disabled={editDisabled}
        ref={editMessageInputRef}
        name={message.messageId}
        onSendMessage={updateMessage}
        onCancelEdit={() => { setShowEdit(false); }}
        value={message.message}
      />
    );
  }

  return (
    <div
      ref={useMessageScrollRef}
      className={getClassName([
        'sendbird-msg-hoc sendbird-msg--scroll-ref',
        isAnimated ? 'sendbird-msg-hoc__animated' : '',
        isHighlighted ? 'sendbird-msg-hoc__highlighted' : '',
      ])}
      style={{ marginBottom: '2px' }}
    >
      {/* date-separator */}
      {
        hasSeparator && (
          <DateSeparator>
            <Label type={LabelTypography.CAPTION_2} color={LabelColors.ONBACKGROUND_2}>
              {format(message?.createdAt, 'MMMM dd, yyyy', { locale: dateLocale })}
            </Label>
          </DateSeparator>
        )
      }
      {/* Message */}
      <MessageContent
        className="sendbird-message-hoc__message-content"
        userId={userId}
        scrollToMessage={scrollToMessage}
        channel={currentGroupChannel}
        message={message}
        disabled={disabled}
        chainTop={chainTop}
        chainBottom={chainBottom}
        useReaction={useReaction}
        replyType={replyType}
        nicknamesMap={membersMap}
        emojiContainer={emojiContainer}
        showEdit={setShowEdit}
        showRemove={setShowRemove}
        showFileViewer={setShowFileViewer}
        resendMessage={resendMessage}
        toggleReaction={toggleReaction}
        quoteMessage={quoteMessage}
        setQuoteMessage={setQuoteMessage}
      />
      {/* Modal */}
      {
        showRemove && (
          <RemoveMessageModal
            message={message}
            onCloseModal={() => setShowRemove(false)}
            onDeleteMessage={() => {
              deleteMessage(message);
              if (message?.messageId === quoteMessage?.messageId) {
                setQuoteMessage(null);
              }
            }}
          />
        )
      }
      {
        showFileViewer && (
          <FileViewer
            onClose={() => setShowFileViewer(false)}
            message={message}
            onDelete={() => {
              deleteMessage(message, () => {
                setShowFileViewer(false);
              });
            }}
            isByMe={isByMe}
          />
        )
      }
    </div>
  );
}

MessageHoc.propTypes = {
  userId: PropTypes.string,
  message: PropTypes.shape({
    isFileMessage: PropTypes.func,
    isAdminMessage: PropTypes.func,
    isUserMessage: PropTypes.func,
    isDateseparator: PropTypes.func,
    // should be a number, but there's a bug in SDK shich returns string
    messageId: PropTypes.number,
    type: PropTypes.string,
    createdAt: PropTypes.number,
    message: PropTypes.string,
    requestState: PropTypes.string,
    messageType: PropTypes.string,
    sender: PropTypes.shape({ userId: PropTypes.string }),
    ogMetaData: PropTypes.shape({}),
    parentMessageId: PropTypes.number,
    reactions: PropTypes.arrayOf(PropTypes.number),
  }),
  animatedMessageId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  highLightedMessageId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  renderCustomMessage: PropTypes.func,
  currentGroupChannel: PropTypes.shape({}),
  hasSeparator: PropTypes.bool,
  disabled: PropTypes.bool,
  editDisabled: PropTypes.bool,
  deleteMessage: PropTypes.func.isRequired,
  scrollToMessage: PropTypes.func,
  updateMessage: PropTypes.func.isRequired,
  resendMessage: PropTypes.func.isRequired,
  useReaction: PropTypes.bool.isRequired,
  replyType: PropTypes.oneOf(['NONE', 'QUOTE_REPLY', 'THREAD']).isRequired,
  chainTop: PropTypes.bool.isRequired,
  chainBottom: PropTypes.bool.isRequired,
  membersMap: PropTypes.instanceOf(Map).isRequired,
  emojiContainer: PropTypes.shape({
    emojiCategories: PropTypes.arrayOf(PropTypes.shape({
      emojis: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string,
        url: PropTypes.string,
      })),
    })),
  }),
  toggleReaction: PropTypes.func,
  quoteMessage: PropTypes.shape({
    messageId: PropTypes.string,
  }),
  setQuoteMessage: PropTypes.func.isRequired,
  handleScroll: PropTypes.func.isRequired,
};

MessageHoc.defaultProps = {
  userId: '',
  editDisabled: false,
  renderCustomMessage: null,
  currentGroupChannel: {},
  message: {},
  hasSeparator: false,
  disabled: false,
  animatedMessageId: null,
  highLightedMessageId: null,
  toggleReaction: () => { },
  scrollToMessage: () => { },
  emojiContainer: {},
  quoteMessage: null,
};
