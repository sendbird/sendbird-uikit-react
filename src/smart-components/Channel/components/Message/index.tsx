import React, {
  useState,
  useRef,
  useLayoutEffect,
  useMemo,
} from 'react';
import format from 'date-fns/format';

import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { useChannel } from '../../context/ChannelProvider';
import { getClassName } from '../../../../utils';
import { isDisabledBecauseFrozen } from '../../context/utils';

import DateSeparator from '../../../../ui/DateSeparator';
import Label, { LabelTypography, LabelColors } from '../../../../ui/Label';
import MessageInput from '../../../../ui/MessageInput';
import MessageContent from '../../../../ui/MessageContent';
import FileViewer from '../FileViewer';
import RemoveMessageModal from '../RemoveMessageModal';
import { EveryMessage, RenderMessageProps } from '../../../../types';
import SendBird from 'sendbird';

type MessageUIProps = {
  message: EveryMessage;
  hasSeparator?: boolean;
  chainTop?: boolean;
  chainBottom?: boolean;
  // for extending
  renderMessage?: (props: RenderMessageProps) => React.ReactNode;
  renderCustomSeperator?: () => React.ReactNode;
  renderEditInput?: () => React.ReactNode;
  renderMessageContent?: () => React.ReactNode;
};

const Message: React.FC<MessageUIProps> = (props: MessageUIProps) => {
  const {
    message,
    hasSeparator,
    chainTop,
    chainBottom,
    renderCustomSeperator,
    renderEditInput,
    renderMessage,
    renderMessageContent,
  } = props;

  const globalStore = useSendbirdStateContext();
  const userId = globalStore?.config?.userId;
  const isOnline = globalStore?.config?.isOnline;

  const {
    currentGroupChannel,
    highLightedMessageId,
    animatedMessageId,
    updateMessage,
    scrollToMessage,
    replyType,
    useReaction,
    toggleReaction,
    emojiContainer,
    nicknamesMap,
    quoteMessage,
    setQuoteMessage,
    handleScroll,
    resendMessage,
  } = useChannel();

  const [showEdit, setShowEdit] = useState(false);
  const [showRemove, setShowRemove] = useState(false);
  const [showFileViewer, setShowFileViewer] = useState(false);
  const [isAnimated, setIsAnimated] = useState(false);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const editMessageInputRef = useRef(null);
  const useMessageScrollRef = useRef(null);

  useLayoutEffect(() => {
    handleScroll?.();
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
    return renderMessage?.({
      message,
      chainTop,
      chainBottom,
    });
  }, [message, message?.message, renderMessage]);

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
          hasSeparator && renderCustomSeperator?.() || (
            <DateSeparator>
              <Label type={LabelTypography.CAPTION_2} color={LabelColors.ONBACKGROUND_2}>
                {format(message.createdAt, 'MMMM dd, yyyy')}
              </Label>
            </DateSeparator>
          )
        }
        <RenderedMessage />
      </div>
    );
  }

  if (showEdit) {
    return renderEditInput?.() || (
      <MessageInput
        isEdit
        disabled={isDisabledBecauseFrozen(currentGroupChannel)}
        ref={editMessageInputRef}
        name={message.messageId}
        onSendMessage={updateMessage}
        onCancelEdit={() => { setShowEdit(false); }}
        value={message?.message}
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
        hasSeparator && (renderCustomSeperator?.() || (
          <DateSeparator>
            <Label type={LabelTypography.CAPTION_2} color={LabelColors.ONBACKGROUND_2}>
              {format(message.createdAt, 'MMMM dd, yyyy')}
            </Label>
          </DateSeparator>
        ))
      }
      {/* Message */}
      {
        renderMessageContent?.() || (
          <MessageContent
            className="sendbird-message-hoc__message-content"
            userId={userId}
            scrollToMessage={scrollToMessage}
            channel={currentGroupChannel}
            message={message}
            disabled={!isOnline}
            chainTop={chainTop}
            chainBottom={chainBottom}
            useReaction={useReaction}
            replyType={replyType}
            nicknamesMap={nicknamesMap}
            emojiContainer={emojiContainer}
            showEdit={setShowEdit}
            showRemove={setShowRemove}
            showFileViewer={setShowFileViewer}
            resendMessage={resendMessage}
            toggleReaction={toggleReaction}
            quoteMessage={quoteMessage}
            setQuoteMessage={setQuoteMessage}
          />
        )
      }
      {/* Modal */}
      {
        showRemove && (
          <RemoveMessageModal
            message={message}
            onCancel={() => setShowRemove(false)}
          />
        )
      }
      {
        showFileViewer && (
          <FileViewer
            message={message as SendBird.FileMessage}
            onCancel={() => setShowFileViewer(false)}
          />
        )
      }
    </div>
  );
};

export default Message;
