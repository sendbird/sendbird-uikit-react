import './notification-message-wrap.scss';

import React, { useMemo } from "react";
import { BaseMessage } from "@sendbird/chat/message";
import format from 'date-fns/format';

import { renderMessage, renderMessageHeader } from "../../types";
import { MessageTemplate } from "../../_externals/react-message-template-view/src/ui";
import UnknownMessageItemBody from "../../../../ui/UnknownMessageItemBody";
import Icon, { IconTypes, IconColors } from '../../../../ui/Icon';
import Label, { LabelTypography, LabelColors } from '../../../../ui/Label';
import { useLocalization } from '../../../../lib/LocalizationContext';

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
  const { dateLocale } = useLocalization();
  let messageTemplate;
  try {
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

  if (memoizedCustomMessage) {
    return (
      <div className="sendbird-notification-channel__message-wrap" data-messageId={message?.messageId}>
        <div className="sendbird-notification-channel__message-wrap-header">
          {
            memoizedCustomHeader || (
              <>
                <NotificationIcon />
                <Label
                  className="sendbird-notification-channel__message-caption"
                  type={LabelTypography.CAPTION_2}
                >
                  caption
                </Label>
                <div className='sendbird-notification-channel__message-date-wrap'>
                  {/* todo: implement greendot */}
                  <span className="sendbird-notification-channel__unread" />
                  <Label
                    className="sendbird-notification-channel__message-date"
                    type={LabelTypography.CAPTION_3}
                    color={LabelColors.ONBACKGROUND_3}
                  >
                    {format(message?.createdAt || 0, 'p', { locale: dateLocale })}
                  </Label>
                </div>
              </>
            )
          }
        </div>
        { memoizedCustomMessage }
      </div>
    );
  }
  return (
    <div className="sendbird-notification-channel__message-wrap" data-messageid={message?.messageId}>
      <div className="sendbird-notification-channel__message-wrap-header">
        {
          memoizedCustomHeader || (
            <>
              <NotificationIcon />
              <Label
                className="sendbird-notification-channel__message-caption"
                type={LabelTypography.CAPTION_2}
                color={LabelColors.ONBACKGROUND_3}
                >
                caption
              </Label>
              <div className='sendbird-notification-channel__message-date-wrap'>
                {/* todo: implement greendot */}
                <span className="sendbird-notification-channel__unread" />
                <Label
                  className="sendbird-notification-channel__message-date"
                  type={LabelTypography.CAPTION_3}
                  color={LabelColors.ONBACKGROUND_3}
                >
                  {format(message?.createdAt || 0, 'p', { locale: dateLocale })}
                </Label>
              </div>
            </>
          )
        }
      </div>
      {
        messageTemplate?.body?.items === undefined ? (
          <UnknownMessageItemBody message={message} />
        ) : (
          <MessageTemplate templateItems={messageTemplate?.body?.items} />
        )
      }
    </div>
  )
}
