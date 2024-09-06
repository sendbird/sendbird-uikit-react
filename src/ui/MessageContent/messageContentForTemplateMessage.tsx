import React, { ReactElement } from 'react';
import Label, { LabelColors, LabelTypography } from '../Label';
import { classnames } from '../../utils/utils';
import format from 'date-fns/format';
import { MessageTemplateData, TemplateType } from '../TemplateMessageItemBody/types';
import { MessageComponentRenderers, MessageContentProps } from './index';
import useSendbirdStateContext from '../../hooks/useSendbirdStateContext';
import { uiContainerType } from '../../utils';
import { useLocalization } from '../../lib/LocalizationContext';
import { MESSAGE_TEMPLATE_KEY } from '../../utils/consts';

type MessageContentForTemplateMessageProps = MessageContentProps & MessageComponentRenderers & {
  isByMe: boolean;
  displayThreadReplies: boolean;
  mouseHover: boolean;
  isMobile: boolean;
  isReactionEnabledInChannel: boolean;
  onTemplateMessageRenderedCallback: (renderedTemplateType: TemplateType | null) => void;
  hoveredMenuClassName: string;
  templateType: TemplateType | null;
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
    templateType,
    timestampRef,
    useReplying,
  } = props;

  const { config } = useSendbirdStateContext();
  const { dateLocale } = useLocalization();

  const uiContainerTypeClassName = uiContainerType[templateType] ?? '';

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
      uiContainerTypeClassName,
    )}
    type={LabelTypography.CAPTION_3}
    color={LabelColors.ONBACKGROUND_2}
    ref={timestampRef}
  >
    {format(message?.createdAt || 0, 'p', {
      locale: dateLocale,
    })}
  </Label>;

  const templateData: MessageTemplateData = message.extendedMessagePayload?.[MESSAGE_TEMPLATE_KEY] as MessageTemplateData;
  const { profile = true, time = true, nickname = true } = templateData?.container_options ?? {};
  const hasContainerHeader = profile || nickname;
  return (
    <div className="sendbird-message-content__sendbird-ui-container-type__default__root">
      {
        !isByMe
        && hasContainerHeader
        && !chainTop
        && !useReplying
        && !chainBottom
        && (
          <div className="sendbird-message-content__sendbird-ui-container-type__default__header-container">
            <div
              className="sendbird-message-content__sendbird-ui-container-type__default__header-container__left__profile">
              {profile && senderProfile}
            </div>
            {nickname && messageHeader}
          </div>
        )
      }
      {messageBody}
      {
        (!isByMe && time && !chainBottom)
        && <div className="sendbird-message-content__sendbird-ui-container-type__default__bottom">
          {timeStamp}
        </div>
      }
    </div>
  );
}
