import React, { ReactElement, useContext } from 'react';
import { UserMessage } from 'sendbird';
import './index.scss';

import Label, { LabelTypography, LabelColors } from '../Label';
import {
  getClassName,
  isEditedMessage,
} from '../../utils';
import { LocalizationContext } from '../../lib/LocalizationContext';

interface Props {
  className?: string | Array<string>;
  message: UserMessage;
  isByMe?: boolean;
  mouseHover?: boolean;
}

export default function TextMessageItemBody({
  className,
  message,
  isByMe = false,
  mouseHover = false,
}: Props): ReactElement {
  const { stringSet } = useContext(LocalizationContext);
  return (
    <div className={getClassName([
      className,
      'sendbird-text-message-item-body',
      isByMe ? 'outgoing' : 'incoming',
      mouseHover ? 'mouse-hover' : '',
      message?.reactions?.length > 0 ? 'reactions' : '',
    ])}>
      {
        message?.message.split(/\r/).map((word) => (
          (word === '')
            ? <br key={word} />
            : (
              <Label
                key={word}
                className="sendbird-text-message-item-body__message"
                type={LabelTypography.BODY_1}
                color={isByMe ? LabelColors.ONCONTENT_1 : LabelColors.ONBACKGROUND_1}
              >
                {word}
              </Label>
            )
        ))
      }
      {
        isEditedMessage(message) && (
          <Label
            className="sendbird-text-message-item-body__message edited"
            type={LabelTypography.BODY_1}
            color={isByMe ? LabelColors.ONCONTENT_2 : LabelColors.ONBACKGROUND_2}
          >
            {` ${stringSet.MESSAGE_EDITED} `}
          </Label>
        )
      }
    </div>
  );
}
