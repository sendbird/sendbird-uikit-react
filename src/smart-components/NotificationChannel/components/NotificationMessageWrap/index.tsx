import '@sendbird/react-uikit-message-template-view/dist/index.css';
import './notification-message-wrap.scss';

import React, { useMemo } from "react";
import { BaseMessage, UserMessage } from "@sendbird/chat/message";
import isToday from "date-fns/isToday";
import format from "date-fns/format";
import isYesterday from "date-fns/isYesterday";

import { renderMessage, renderMessageHeader } from "../../types";
import UnknownMessageItemBody from "../../../../ui/UnknownMessageItemBody";
import Icon, { IconTypes, IconColors } from '../../../../ui/Icon';
import Label, { LabelTypography, LabelColors } from '../../../../ui/Label';
import { useLocalization } from '../../../../lib/LocalizationContext';
import { useNotficationChannelContext } from '../../context/NotificationChannelProvider';

import { MessageTemplate, MessageProvider } from '@sendbird/react-uikit-message-template-view';
// import { MessageTemplate } from "../../_externals/react-message-template-view/src/ui";
// import { MessageProvider } from '../../_externals/react-message-template-view/src/context/MessageContextProvider';

const NotificationIcon = () => (
  <div className="sendbird-notification-channel__channel-icon-wrap">
    <div className="sendbird-notification-channel__channel-icon">
      <Icon
        className="sendbird-notification-channel__channel-icon-hash"
        fillColor={IconColors.CONTENT}
        width="12px"
        height="12px"
        type={IconTypes.CHANNELS}
      />
    </div>
  </div>
);

type Props = {
  renderMessage?: renderMessage;
  renderMessageHeader?: renderMessageHeader;
  message: BaseMessage;
}

export default function NotificationMessageWrap({
  renderMessage,
  renderMessageHeader,
  message,
}: Props) {
  const { dateLocale, stringSet } = useLocalization();
  const {
    lastSeen,
    handleWebAction,
    handleCustomAction,
    handlePredefinedAction,
  } = useNotficationChannelContext();
  // Typecasting to UserMessage to pass custom error message to UnknownMessage
  const _message = message as UserMessage;
  const customErrorLabel = _message?.message ||  stringSet?.NOTIFICATION_CHANNEL__UNKNOWN_MESSAGE;

  let messageTemplate;
  try {
    // todo: typecaste properly after moving to seperate package
    // @ts-ignore
    messageTemplate = JSON.parse(message?.extendedMessage?.sub_data);
  } catch (error) {
    //
  }
  const memoizedCustomMessage = useMemo(() => {
    if (typeof renderMessage === 'function') {
      return renderMessage?.({ message });
    }
    return null;
  }, [message, renderMessage]);

  const memoizedCustomHeader = useMemo(() => {
    if (typeof renderMessageHeader === 'function') {
      return renderMessageHeader?.({ message });
    }
    return null;
  }, [message, renderMessageHeader]);

  const formatDate = (createdAt: number) => {
    const optionalParam = dateLocale ? { locale: dateLocale } : null;
    if (!createdAt) {
      return '';
    }
    if (isToday(createdAt)) {
      return format(createdAt, 'p', optionalParam);
    }
    if (isYesterday(createdAt)) {
      return stringSet.NOTIFICATION_CHANNEL__YESTERDAY;
    }
    return format(createdAt, 'MMM dd', optionalParam);
  };

  return (
    <MessageProvider
      message={message}
      handleWebAction={handleWebAction}
      handleCustomAction={handleCustomAction}
      handlePredefinedAction={handlePredefinedAction}
    >
      <div className="sendbird-notification-channel__message-wrap" data-messageid={message?.messageId}>
        <div className="sendbird-notification-channel__message-wrap-header">
          {
            memoizedCustomHeader || (
              <>
                <NotificationIcon />
                <Label
                  className="sendbird-notification-channel__message-caption"
                  type={LabelTypography.CAPTION_2}
                >
                  {message?.customType}
                </Label>
                <div className='sendbird-notification-channel__message-date-wrap'>
                  {
                    message?.createdAt > lastSeen && (
                      <span className="sendbird-notification-channel__unread" />
                    )
                  }
                  <Label
                    className="sendbird-notification-channel__message-date"
                    type={LabelTypography.CAPTION_3}
                    color={LabelColors.ONBACKGROUND_3}
                  >
                    {formatDate(message?.createdAt || 0)}
                  </Label>
                </div>
              </>
            )
          }
        </div>
        {/* render custom message or unknown message or message template */}
        { memoizedCustomMessage || (
          messageTemplate?.body?.items === undefined ? (
            <UnknownMessageItemBody
              message={message}
              customText={customErrorLabel}
            />
          ) : (
            <MessageTemplate templateItems={messageTemplate?.body?.items} />
          )
        )}
      </div>

    </MessageProvider>
  );
}
