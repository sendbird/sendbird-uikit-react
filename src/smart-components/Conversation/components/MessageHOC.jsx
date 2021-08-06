import React, {
  useState,
  useRef,
  useMemo,
  useLayoutEffect,
} from 'react';
import PropTypes from 'prop-types';
import format from 'date-fns/format';

import MessageContent from '../../../ui/MessageContent';
import DateSeparator from '../../../ui/DateSeparator';
import Label, { LabelTypography, LabelColors } from '../../../ui/Label';
import MessageInput from '../../../ui/MessageInput';
import FileViewer from '../../../ui/FileViewer';
import RemoveMessageModal from './RemoveMessage';

export default function MessageHoc({
  message,
  userId,
  disabled,
  editDisabled,
  hasSeperator,
  deleteMessage,
  updateMessage,
  resendMessage,
  useReaction,
  chainTop,
  chainBottom,
  membersMap,
  emojiContainer,
  highLightedMessageId,
  toggleReaction,
  renderCustomMessage,
  currentGroupChannel,
}) {
  const { sender = {} } = message;
  const [showEdit, setShowEdit] = useState(false);
  const [showRemove, setShowRemove] = useState(false);
  const [showFileViewer, setShowFileViewer] = useState(false);
  const [isAnimated, setIsAnimated] = useState(false);
  const editMessageInputRef = useRef(null);
  const useMessageScrollRef = useRef(null);

  useLayoutEffect(() => {
    if (highLightedMessageId === message.messageId) {
      if (useMessageScrollRef && useMessageScrollRef.current) {
        useMessageScrollRef.current.scrollIntoView({
          block: 'center',
          inline: 'center',
        });
        setTimeout(() => {
          setIsAnimated(true);
        }, 500);
      }
    } else {
      setIsAnimated(false);
    }
  }, [highLightedMessageId, useMessageScrollRef.current, message.messageId]);
  const RenderedMessage = useMemo(() => {
    if (renderCustomMessage) {
      return renderCustomMessage(message, currentGroupChannel, chainTop, chainBottom);
      // Let's change this to object type on next major version up
    }
    return null;
  }, [message, message.message, renderCustomMessage]);

  const isByMe = (userId === sender.userId)
    || (message.requestState === 'pending')
    || (message.requestState === 'failed');

  if (RenderedMessage) {
    return (
      <div
        ref={useMessageScrollRef}
        className={`
          sendbird-msg-hoc sendbird-msg--scroll-ref
          ${isAnimated ? 'sendbird-msg-hoc__highlighted' : ''}
        `}
      >
        {/* date-seperator */}
        {
          hasSeperator && (
            <DateSeparator>
              <Label type={LabelTypography.CAPTION_2} color={LabelColors.ONBACKGROUND_2}>
                {format(message.createdAt, 'MMMM dd, yyyy')}
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
      className={`
        sendbird-msg-hoc sendbird-msg--scroll-ref
        ${isAnimated ? 'sendbird-msg-hoc__animated' : ''}
      `}
      style={{ marginBottom: '2px' }}
    >
      {/* date-seperator */}
      {
        hasSeperator && (
          <DateSeparator>
            <Label type={LabelTypography.CAPTION_2} color={LabelColors.ONBACKGROUND_2}>
              {format(message.createdAt, 'MMMM dd, yyyy')}
            </Label>
          </DateSeparator>
        )
      }
      {/* Message */}
      <MessageContent
        className="sendbird-message-hoc__message-content"
        message={message}
        channel={currentGroupChannel}
        userId={userId}
        optionalProps={{
          disabled,
          chainTop,
          chainBottom,
          useReaction,
          resendMessage,
          showEdit: setShowEdit,
          showRemove: setShowRemove,
          toggleReaction,
          emojiContainer,
          nicknamesMap: membersMap,
        }}
      />
      {/* Modal */}
      {
        showRemove && (
          <RemoveMessageModal
            onCloseModal={() => setShowRemove(false)}
            onDeleteMessage={() => {
              deleteMessage(message);
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
    isDateSeperator: PropTypes.func,
    // should be a number, but there's a bug in SDK shich returns string
    messageId: PropTypes.number,
    type: PropTypes.string,
    createdAt: PropTypes.number,
    message: PropTypes.string,
    requestState: PropTypes.string,
    messageType: PropTypes.string,
    sender: PropTypes.shape({ userId: PropTypes.string }),
    ogMetaData: PropTypes.shape({}),
  }),
  highLightedMessageId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  renderCustomMessage: PropTypes.func,
  currentGroupChannel: PropTypes.shape({}),
  hasSeperator: PropTypes.bool,
  disabled: PropTypes.bool,
  editDisabled: PropTypes.bool,
  deleteMessage: PropTypes.func.isRequired,
  updateMessage: PropTypes.func.isRequired,
  resendMessage: PropTypes.func.isRequired,
  useReaction: PropTypes.bool.isRequired,
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
};

MessageHoc.defaultProps = {
  userId: '',
  editDisabled: false,
  renderCustomMessage: null,
  currentGroupChannel: {},
  message: {},
  hasSeperator: false,
  disabled: false,
  highLightedMessageId: null,
  toggleReaction: () => { },
  emojiContainer: {},
};
