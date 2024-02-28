import type {BaseMessage} from '@sendbird/chat/message';
import React, {ReactElement, useContext} from 'react';
import {LocalizationContext} from '../../lib/LocalizationContext';
import {getClassName} from '../../utils';
import Label, {LabelColors, LabelTypography} from '../Label';

export interface FallbackTemplateMessageItemBodyProps {
  className?: string | Array<string>;
  message: BaseMessage;
  isByMe?: boolean;
}
export function FallbackTemplateMessageItemBody({
  className,
  message,
  isByMe,
}: FallbackTemplateMessageItemBodyProps): ReactElement {
  const { stringSet } = useContext(LocalizationContext);
  const text = message['message'];

  return (
    <div
      className={getClassName([
        className,
        isByMe ? 'outgoing' : 'incoming',
        'sendbird-template-message-item-body__fallback_message',
      ])}
    >
      {
        text
          ? <>
            <Label
              type={LabelTypography.BODY_1}
              color={LabelColors.ONCONTENT_INVERSE_1}
            >
              {text}
            </Label>
          </>
          : <>
            <Label
              className='sendbird-template-message-item-body__fallback_message__header'
              type={LabelTypography.BODY_1}
              color={LabelColors.ONCONTENT_INVERSE_1}
            >
              {stringSet.UNKNOWN__TEMPLATE_ERROR}
            </Label>
            <Label
              className='sendbird-template-message-item-body__fallback_message__description'
              type={LabelTypography.BODY_1}
              color={LabelColors.ONCONTENT_INVERSE_5}
            >
              {stringSet.UNKNOWN__CANNOT_READ_TEMPLATE}
            </Label>
          </>
      }
    </div>
  );
}

export default FallbackTemplateMessageItemBody;