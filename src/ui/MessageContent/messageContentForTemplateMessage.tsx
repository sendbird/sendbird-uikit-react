import React, { ReactElement } from 'react';
import Label, { LabelColors, LabelTypography } from '../Label';
import { classnames } from '../../utils/utils';
import format from 'date-fns/format';
import { MessageTemplateData } from '../TemplateMessageItemBody/types';
import { MessageComponentRenderers, MessageContentProps } from './index';
import useSendbirdStateContext from '../../hooks/useSendbirdStateContext';
import { UI_CONTAINER_TYPES } from '../../utils';
import { useLocalization } from '../../lib/LocalizationContext';

type MessageContentForTemplateMessageProps = MessageContentProps & MessageComponentRenderers & {
  isByMe: boolean;
  displayThreadReplies: boolean;
  mouseHover: boolean;
  isMobile: boolean;
  isReactionEnabledInChannel: boolean;
  onTemplateMessageRenderedCallback: (renderedTemplateType: UI_CONTAINER_TYPES) => void;
  hoveredMenuClassName: string;
  uiContainerType: UI_CONTAINER_TYPES;
  timestampRef: React.LegacyRef<HTMLDivElement>;
  useReplying: boolean;
};

export function MessageContentForTemplateMessage(props: MessageContentForTemplateMessageProps): ReactElement {
  const {
    channel,
    message,
    chainTop = false,
    chainBottom = false,
    showFileViewer,
    onMessageHeightChange,
    onBeforeDownloadFileMessage,

    renderSenderProfile,
    renderMessageHeader,
    renderMessageBody,

    isByMe,
    displayThreadReplies,
    mouseHover,
    isMobile,
    isReactionEnabledInChannel,
    onTemplateMessageRenderedCallback,
    hoveredMenuClassName,
    uiContainerType,
    timestampRef,
    useReplying,
  } = props;

  const { config } = useSendbirdStateContext();
  const { dateLocale } = useLocalization();

  const senderProfile = renderSenderProfile({
    ...props,
    className: '',
    isByMe,
    displayThreadReplies,
  });
  const messageHeader = renderMessageHeader(props);
  const messageBody = renderMessageBody({
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
  });
  const timeStamp = <Label
    className={classnames(
      'sendbird-message-content__middle__body-container__created-at',
      'right',
      hoveredMenuClassName,
      uiContainerType,
    )}
    type={LabelTypography.CAPTION_3}
    color={LabelColors.ONBACKGROUND_2}
    ref={timestampRef}
  >
    {format(message?.createdAt || 0, 'p', {
      locale: dateLocale,
    })}
  </Label>;

  // FIXME: change to message_template once server changes
  const templateData: MessageTemplateData = message.extendedMessagePayload?.['template'] as MessageTemplateData;
  const { profile = true, time = true, nickname = true } = templateData.container_options;
  return (
    <div className="sendbird-message-content__sendbird-ui-container-type__default__root">
      {
        !isByMe
        && !chainTop
        && !useReplying
        && !chainBottom
        && (
          <div className="sendbird-message-content__sendbird-ui-container-type__default__header-container">
            {profile && <div
              className="sendbird-message-content__sendbird-ui-container-type__default__header-container__left__profile">
              {senderProfile}
            </div>}
            {nickname && messageHeader}
          </div>
        )
      }
      {messageBody}
      {
        (!isByMe && !chainBottom && time)
        && <div className="sendbird-message-content__sendbird-ui-container-type__default__bottom">
          {timeStamp}
        </div>
      }
    </div>
  );
}
