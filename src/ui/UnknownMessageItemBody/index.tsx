import React, { ReactElement, useContext } from 'react';
import './index.scss';

import Label, { LabelTypography, LabelColors } from '../Label';
import { getClassName } from '../../utils';
import { LocalizationContext } from '../../lib/LocalizationContext';
import { BaseMessage } from '@sendbird/chat/message';

interface Props {
  className?: string | Array<string>;
  isByMe?: boolean;
  message: BaseMessage;
  customText?: string;
  mouseHover?: boolean;
  isReactionEnabled?: boolean;
}

export default function UnknownMessageItemBody({
  className,
  message,
  customText,
  isByMe = false,
  mouseHover = false,
  isReactionEnabled = false,
}: Props): ReactElement {
  const { stringSet } = useContext(LocalizationContext);
  return (
    <div className={getClassName([
      className,
      'sendbird-unknown-message-item-body',
      isByMe ? 'outgoing' : 'incoming',
      mouseHover ? 'mouse-hover' : '',
      (isReactionEnabled && message?.reactions?.length > 0) ? 'reactions' : '',
    ])}>
      {
        !customText && (
          <Label
            className="sendbird-unknown-message-item-body__header"
            type={LabelTypography.BODY_1}
            color={isByMe ? LabelColors.ONCONTENT_1 : LabelColors.ONBACKGROUND_1}
          >
            {stringSet.UNKNOWN__UNKNOWN_MESSAGE_TYPE}
          </Label>
        )
      }
      <Label
        className="sendbird-unknown-message-item-body__description"
        type={LabelTypography.BODY_1}
        color={isByMe ? LabelColors.ONCONTENT_2 : LabelColors.ONBACKGROUND_2}
      >
        {customText || stringSet.UNKNOWN__CANNOT_READ_MESSAGE}
      </Label>
    </div>
  );
}
