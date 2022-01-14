import React, {
  useState,
  useRef,
  ReactElement,
  useMemo,
  useContext,
} from 'react';

import format from 'date-fns/format';
import * as types from '../../../index';

import { LocalizationContext } from '../../../lib/LocalizationContext';

import OpenChannelUserMessage from '../../../ui/OpenchannelUserMessage';
import OpenChannelAdminMessage from '../../../ui/OpenChannelAdminMessage';
import OpenChannelOGMessage from '../../../ui/OpenchannelOGMessage';
import OpenChannelThumbnailMessage from '../../../ui/OpenchannelThumbnailMessage';
import OpenChannelFileMessage from '../../../ui/OpenchannelFileMessage';
// import UnknownMessage from '../../../ui/UnknownMessage';

import DateSeparator from '../../../ui/DateSeparator';
import Label, { LabelTypography, LabelColors } from '../../../ui/Label';
import MessageInput from '../../../ui/MessageInput';
import FileViewer from '../../../ui/FileViewer';

import RemoveMessageModal from './RemoveMessageModal';
import {
  MessageTypes,
  SendingMessageStatus,
  getMessageType,
} from './types';
import { OpenChannel } from 'sendbird';

interface Props {
  message: types.EveryMessage;
  userId: string;
  disabled: boolean;
  editDisabled: boolean;
  hasSeparator: boolean;
  channel: OpenChannel;
  renderCustomMessage?: types.RenderCustomMessage,
  deleteMessage(message: types.ClientUserMessage | types.ClientFileMessage, callback?: () => void): void;
  updateMessage(messageId: number, text: string, callback?: () => void): void;
  resendMessage(failedMessage: types.ClientUserMessage | types.ClientFileMessage): void;
  status?: string;
  chainTop: boolean;
  chainBottom: boolean;
}

export default function MessageHoc({
  message,
  userId,
  disabled,
  editDisabled,
  hasSeparator,
  channel,
  renderCustomMessage,
  deleteMessage,
  updateMessage,
  resendMessage,
  status,
  chainTop,
  chainBottom,
}: Props): ReactElement {
  let sender: SendBird.User = null;
  if (message.messageType !== 'admin') {
    sender = message.sender;
  }

  const { dateLocale } = useContext(LocalizationContext);

  const RenderedMessage = useMemo(() => {
    if (renderCustomMessage) {
      return renderCustomMessage(message, channel, chainTop, chainBottom);
    }
    return null;
  }, [message, renderCustomMessage]);

  const [showEdit, setShowEdit] = useState(false);
  const [showRemove, setShowRemove] = useState(false);
  const [showFileViewer, setShowFileViewer] = useState(false);
  const editMessageInputRef = useRef(null);

  let isByMe = false;

  if (sender && message.messageType !== 'admin') {
    // pending and failed messages are by me
    isByMe = (userId === sender.userId)
      || (message.requestState === SendingMessageStatus.PENDING)
      || (message.requestState === SendingMessageStatus.FAILED);
  }

  if(RenderedMessage) {
    return (
      <div className="sendbird-msg-hoc sendbird-msg--scroll-ref">
        <RenderedMessage message={message} />
      </div>
    );
  }

  if (message.messageType === 'user' && showEdit) {
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
    <div className="sendbird-msg-hoc sendbird-msg--scroll-ref">
      {/* date-separator */}
      {
        hasSeparator && (
          <DateSeparator>
            <Label type={LabelTypography.CAPTION_2} color={LabelColors.ONBACKGROUND_2}>
              {format(message.createdAt, 'MMMM dd, yyyy', { locale: dateLocale })}
            </Label>
          </DateSeparator>
        )
      }
      {/* Message */}
      {
        {
          [MessageTypes.ADMIN]: (() => {
            if (message.messageType === 'admin') {
              return (
                <OpenChannelAdminMessage message={message} />
              )
            }
          })(),
          [MessageTypes.FILE]: (() => {
            if (message.messageType === 'file') {
              return (
                <OpenChannelFileMessage
                  message={message}
                  disabled={disabled}
                  userId={userId}
                  showRemove={setShowRemove}
                  resendMessage={resendMessage}
                  status={status}
                  chainTop={chainTop}
                  chainBottom={chainBottom}
                />
              );
            }
            return;
          })(),
          [MessageTypes.OG]: (() => {
            if (message.messageType === 'user') {
              return (
                <OpenChannelOGMessage
                  message={message}
                  status={status}
                  userId={userId}
                  showEdit={setShowEdit}
                  disabled={disabled}
                  showRemove={setShowRemove}
                  resendMessage={resendMessage}
                  chainTop={chainTop}
                  chainBottom={chainBottom}
                />
              );
            }
            return;
          })(),
          [MessageTypes.THUMBNAIL]: (() => {
            if (message.messageType === 'file') {
              return (
                <OpenChannelThumbnailMessage
                  message={message}
                  disabled={disabled}
                  userId={userId}
                  showRemove={setShowRemove}
                  resendMessage={resendMessage}
                  onClick={setShowFileViewer}
                  status={status}
                  chainTop={chainTop}
                  chainBottom={chainBottom}
                />
              );
            }
            return;
          })(),
          [MessageTypes.USER]: (() => {
            if (message.messageType === 'user') {
              return (
                <OpenChannelUserMessage
                  message={message}
                  userId={userId}
                  disabled={disabled}
                  showEdit={setShowEdit}
                  showRemove={setShowRemove}
                  resendMessage={resendMessage}
                  status={status}
                  chainTop={chainTop}
                  chainBottom={chainBottom}
                />
              );
            }
            return;
          })(),
          [MessageTypes.UNKNOWN]: (() => {
            return;
            // return (
            //   <OpenChannelUnknownMessage message={message} />
            // );
          })(),
        }[getMessageType(message)]
      }
      {/* Modal */}
      {
        showRemove && (
          <RemoveMessageModal
            onCloseModal={() => setShowRemove(false)}
            onDeleteMessage={() => {
              if (message.messageType !== 'admin') {
                deleteMessage(message);
              }
            }}
          />
        )
      }
      {
        (showFileViewer && message.messageType === 'file') && (
          <FileViewer
            onClose={() => setShowFileViewer(false)}
            message={message}
            onDelete={() => deleteMessage(message)}
            isByMe={isByMe}
          />
        )
      }
      {/* {
        !((message.isFileMessage && message.isFileMessage()) || message.messageType === 'file')
        && !(message.isAdminMessage && message.isAdminMessage())
        && !(((message.isUserMessage && message.isUserMessage()) || message.messageType === 'user'))
        && !(showFileViewer)
        && (
          <UnknownMessage
            message={message}
            status={status}
            isByMe={isByMe}
            showRemove={setShowRemove}
            chainTop={chainTop}
            chainBottom={chainBottom}
          />
        )
      } */}
    </div>
  );
}
