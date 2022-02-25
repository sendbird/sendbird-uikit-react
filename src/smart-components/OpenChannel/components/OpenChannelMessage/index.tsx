import React, {
  useState,
  useRef,
  ReactElement,
  useMemo,
} from 'react';

import format from 'date-fns/format';

import OpenChannelUserMessage from '../../../../ui/OpenchannelUserMessage';
import OpenChannelAdminMessage from '../../../../ui/OpenChannelAdminMessage';
import OpenChannelOGMessage from '../../../../ui/OpenchannelOGMessage';
import OpenChannelThumbnailMessage from '../../../../ui/OpenchannelThumbnailMessage';
import OpenChannelFileMessage from '../../../../ui/OpenchannelFileMessage';
// import UnknownMessage from '../../../../ui/UnknownMessage';

import DateSeparator from '../../../../ui/DateSeparator';
import Label, { LabelTypography, LabelColors } from '../../../../ui/Label';
import MessageInput from '../../../../ui/MessageInput';
import FileViewer from '../../../../ui/FileViewer';

import RemoveMessageModal from './RemoveMessageModal';
import {
  MessageTypes,
  SendingMessageStatus,
  getMessageType,
} from './utils';
import { useOpenChannel } from '../../context/OpenChannelProvider';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import type { EveryMessage, RenderMessageProps } from '../../../../types';

export type OpenChannelMessageProps = {
  renderMessage?: (props: RenderMessageProps) => React.ReactNode;
  message: EveryMessage;
  chainTop?: boolean;
  chainBottom?: boolean;
  hasSeparator?: boolean;
  editDisabled?: boolean;
};

export default function MessagOpenChannelMessageeHoc(props: OpenChannelMessageProps): ReactElement {
  const {
    message,
    chainTop,
    chainBottom,
    hasSeparator,
    renderMessage,
  } = props;

  const {
    currentOpenChannel,
    deleteMessage,
    updateMessage,
    resendMessage,
  } = useOpenChannel();
  const editDisabled = currentOpenChannel?.isFrozen;

  const globalState = useSendbirdStateContext();
  const userId = globalState?.config?.userId;

  let sender: SendBird.User = null;
  if (message?.messageType !== 'admin') {
    sender = message?.sender;
  }

  const RenderedMessage = useMemo(() => {
    if (renderMessage) {
      return renderMessage({
        message,
        chainBottom,
        chainTop,
      });
    }
    return null;
  }, [message, renderMessage]);

  const [showEdit, setShowEdit] = useState(false);
  const [showRemove, setShowRemove] = useState(false);
  const [showFileViewer, setShowFileViewer] = useState(false);
  const editMessageInputRef = useRef(null);

  let isByMe = false;

  if (sender && message?.messageType !== 'admin') {
    // pending and failed messages are by me
    isByMe = (userId === sender.userId)
      || (message?.requestState === SendingMessageStatus.PENDING)
      || (message?.requestState === SendingMessageStatus.FAILED);
  }

  if(RenderedMessage) {
    return (
      <div className="sendbird-msg-hoc sendbird-msg--scroll-ref">
        <RenderedMessage />
      </div>
    );
  }

  if (message?.messageType === 'user' && showEdit) {
    return (
      <MessageInput
        isEdit
        disabled={editDisabled}
        ref={editMessageInputRef}
        name={message?.messageId}
        onSendMessage={updateMessage}
        onCancelEdit={() => { setShowEdit(false); }}
        value={message?.message}
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
              {format(message?.createdAt, 'MMMM dd, yyyy')}
            </Label>
          </DateSeparator>
        )
      }
      {/* Message */}
      {
        {
          [MessageTypes.ADMIN]: (() => {
            if (message?.messageType === 'admin') {
              return (
                <OpenChannelAdminMessage message={message} />
              )
            }
          })(),
          [MessageTypes.FILE]: (() => {
            if (message?.messageType === 'file') {
              return (
                <OpenChannelFileMessage
                  message={message}
                  disabled={editDisabled}
                  userId={userId}
                  showRemove={setShowRemove}
                  resendMessage={resendMessage}
                  chainTop={chainTop}
                  chainBottom={chainBottom}
                />
              );
            }
            return;
          })(),
          [MessageTypes.OG]: (() => {
            if (message?.messageType === 'user') {
              return (
                <OpenChannelOGMessage
                  message={message}
                  userId={userId}
                  showEdit={setShowEdit}
                  disabled={editDisabled}
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
            if (message?.messageType === 'file') {
              return (
                <OpenChannelThumbnailMessage
                  message={message}
                  disabled={editDisabled}
                  userId={userId}
                  showRemove={setShowRemove}
                  resendMessage={resendMessage}
                  onClick={setShowFileViewer}
                  chainTop={chainTop}
                  chainBottom={chainBottom}
                />
              );
            }
            return;
          })(),
          [MessageTypes.USER]: (() => {
            if (message?.messageType === 'user') {
              return (
                <OpenChannelUserMessage
                  message={message}
                  userId={userId}
                  disabled={editDisabled}
                  showEdit={setShowEdit}
                  showRemove={setShowRemove}
                  resendMessage={resendMessage}
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
              if (message?.messageType !== 'admin') {
                deleteMessage(message);
              }
            }}
          />
        )
      }
      {
        (showFileViewer && message?.messageType === 'file') && (
          <FileViewer
            onClose={() => setShowFileViewer(false)}
            message={message}
            onDelete={() => deleteMessage(message)}
            isByMe={isByMe}
          />
        )
      }
      {/* {
        !((message?.isFileMessage && message?.isFileMessage()) || message?.messageType === 'file')
        && !(message?.isAdminMessage && message?.isAdminMessage())
        && !(((message?.isUserMessage && message?.isUserMessage()) || message?.messageType === 'user'))
        && !(showFileViewer)
        && (
          <UnknownMessage
            message={message}
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
