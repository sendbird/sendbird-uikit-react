import React, {
  useState,
  useRef,
  ReactElement,
  useMemo,
} from 'react';
import { AdminMessage, FileMessage, UserMessage } from '@sendbird/chat/message';
import { User } from '@sendbird/chat';
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
import { useOpenChannelContext } from '../../context/OpenChannelProvider';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import type { RenderMessageProps } from '../../../../types';
import { useLocalization } from '../../../../lib/LocalizationContext';

export type OpenChannelMessageProps = {
  renderMessage?: (props: RenderMessageProps) => React.ElementType<RenderMessageProps>;
  message: UserMessage | FileMessage | AdminMessage;
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
  } = useOpenChannelContext();
  const { dateLocale } = useLocalization();
  const editDisabled = currentOpenChannel?.isFrozen;

  const globalState = useSendbirdStateContext();
  const userId = globalState?.config?.userId;
  const isOgMessageEnabledInOpenChannel = globalState.config.openChannel.enableOgtag;

  let sender: User = null;
  if (message?.messageType !== 'admin') {
    sender = (message as UserMessage | FileMessage)?.sender;
  }

  const RenderedMessage = useMemo(() => (props: RenderMessageProps) => {
    return (
      <>
        {
          renderMessage
            ? (renderMessage(props))
            : null
        }
      </>
    );
  }, [message, renderMessage]);

  const [showEdit, setShowEdit] = useState(false);
  const [showRemove, setShowRemove] = useState(false);
  const [showFileViewer, setShowFileViewer] = useState(false);
  const editMessageInputRef = useRef(null);

  let isByMe = false;

  if (sender && message?.messageType !== 'admin') {
    // pending and failed messages are by me
    isByMe = (userId === sender.userId)
      || ((message as UserMessage | FileMessage)?.sendingStatus === SendingMessageStatus.PENDING)
      || ((message as UserMessage | FileMessage)?.sendingStatus === SendingMessageStatus.FAILED);
  }

  if (renderMessage && RenderedMessage) {
    return (
      <div className="sendbird-msg-hoc sendbird-msg--scroll-ref">
        <RenderedMessage message={message} chainTop={chainTop} chainBottom={chainBottom} />
      </div>
    );
  }

  if (message?.messageType === 'user' && showEdit) {
    return (
      <MessageInput
        isEdit
        disabled={editDisabled}
        ref={editMessageInputRef}
        message={message as UserMessage}
        name={message?.messageId}
        onUpdateMessage={({ messageId, message }) => {
          updateMessage(messageId, message);
          setShowEdit(false);
        }}
        onCancelEdit={() => { setShowEdit(false); }}
      />
    );
  }

  return (
    <div className="sendbird-msg-hoc sendbird-msg--scroll-ref">
      {/* date-separator */}
      {
        (hasSeparator && message?.createdAt) && (
          <DateSeparator>
            <Label type={LabelTypography.CAPTION_2} color={LabelColors.ONBACKGROUND_2}>
              {format(message?.createdAt, 'MMMM dd, yyyy', {
                locale: dateLocale,
              })}
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
                <OpenChannelAdminMessage message={message as AdminMessage} />
              );
            }
          })(),
          [MessageTypes.FILE]: (() => {
            if (message?.messageType === 'file') {
              return (
                <OpenChannelFileMessage
                  message={message as FileMessage}
                  isOperator={currentOpenChannel?.isOperator((message as FileMessage)?.sender?.userId)}
                  isEphemeral={currentOpenChannel?.isEphemeral}
                  disabled={editDisabled}
                  userId={userId}
                  showRemove={setShowRemove}
                  resendMessage={resendMessage}
                  chainTop={chainTop}
                  chainBottom={chainBottom}
                />
              );
            }
          })(),
          [MessageTypes.OG]: (() => {
            if (message?.messageType === 'user' && isOgMessageEnabledInOpenChannel) {
              return (
                <OpenChannelOGMessage
                  message={message as UserMessage}
                  isOperator={currentOpenChannel?.isOperator((message as UserMessage)?.sender?.userId)}
                  isEphemeral={currentOpenChannel?.isEphemeral}
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
          })(),
          [MessageTypes.THUMBNAIL]: (() => {
            if (message?.messageType === 'file') {
              return (
                <OpenChannelThumbnailMessage
                  message={message as FileMessage}
                  isOperator={currentOpenChannel?.isOperator((message as FileMessage)?.sender?.userId)}
                  isEphemeral={currentOpenChannel?.isEphemeral}
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
          })(),
          [MessageTypes.USER]: (() => {
            if (message?.messageType === 'user') {
              return (
                <OpenChannelUserMessage
                  message={message as UserMessage}
                  isOperator={currentOpenChannel?.isOperator((message as UserMessage)?.sender?.userId)}
                  isEphemeral={currentOpenChannel?.isEphemeral}
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
          })(),
          [MessageTypes.UNKNOWN]: (() => {
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
            message={message as FileMessage}
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
