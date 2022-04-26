import React, { ReactElement, useContext } from 'react';
import SendBird from 'sendbird';
import './index.scss';

import Label, { LabelTypography, LabelColors } from '../Label';
import { getClassName, isEditedMessage } from '../../utils';
import { LocalizationContext } from '../../lib/LocalizationContext';
import uuidv4 from '../../utils/uuid';
import Word from '../Word';

interface Props {
  className?: string | Array<string>;
  message: SendBird.UserMessage;
  isByMe?: boolean;
  mouseHover?: boolean;
  isMentionEnabled?: boolean;
}

export default function TextMessageItemBody({
  className,
  message,
  isByMe = false,
  mouseHover = false,
  isMentionEnabled = false,
}: Props): ReactElement {
  console.log('text message', message);
  const { stringSet } = useContext(LocalizationContext);
  const isMessageMentioned = isMentionEnabled && message?.mentionedMessageTemplate?.length > 0 && message?.mentionedUsers?.length > 0;
  return (
    <Label
      type={LabelTypography.BODY_1}
      color={isByMe ? LabelColors.ONCONTENT_1 : LabelColors.ONBACKGROUND_1}
    >
      <p className={getClassName([
        className,
        'sendbird-text-message-item-body',
        isByMe ? 'outgoing' : 'incoming',
        mouseHover ? 'mouse-hover' : '',
        message?.reactions?.length > 0 ? 'reactions' : '',
      ])}>
        {
          isMessageMentioned
           ? (
              message.mentionedMessageTemplate.split(' ').map((word) => {
                console.log('word', word);
                return (
                  <Word
                    key={uuidv4()}
                    word={word}
                    message={message}
                    isByMe={isByMe}
                  />
                );
              })
           )
           : message?.message
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
      </p>
    </Label>
  );
}
