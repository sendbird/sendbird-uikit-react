import './index.scss';
import React, { ReactElement, useContext } from 'react';
import type { UserMessage } from '@sendbird/chat/message';

import Label, { LabelTypography, LabelColors } from '../Label';
import { getClassName, isEditedMessage } from '../../utils';
import { LocalizationContext } from '../../lib/LocalizationContext';
import uuidv4 from '../../utils/uuid';
import Word from '../Word';

interface Props {
  className?: string | Array<string>;
  message: UserMessage;
  isByMe?: boolean;
  mouseHover?: boolean;
  isMentionEnabled?: boolean;
  isReactionEnabled?: boolean;
}

export default function TextMessageItemBody({
  className,
  message,
  isByMe = false,
  mouseHover = false,
  isMentionEnabled = false,
  isReactionEnabled = false,
}: Props): ReactElement {
  const { stringSet } = useContext(LocalizationContext);
  const isMessageMentioned = isMentionEnabled && message?.mentionedMessageTemplate?.length > 0 && message?.mentionedUsers?.length > 0;
  return (
    <Label
      type={LabelTypography.BODY_1}
      color={isByMe ? LabelColors.ONCONTENT_1 : LabelColors.ONBACKGROUND_1}
    >
      <div className={getClassName([
        className,
        'sendbird-text-message-item-body',
        isByMe ? 'outgoing' : 'incoming',
        mouseHover ? 'mouse-hover' : '',
        (isReactionEnabled && message?.reactions?.length > 0) ? 'reactions' : '',
      ])}>
        {
          isMessageMentioned
            ? (
              message?.mentionedMessageTemplate.split(' ').map((word: string) => (
                <Word
                  key={uuidv4()}
                  word={word}
                  message={message}
                  isByMe={isByMe}
                />
              ))
            )
            : (
              message?.message.split(' ').map((word: string) => (
                <Word
                  key={uuidv4()}
                  word={word}
                  message={message}
                  isByMe={isByMe}
                />
              ))
            )
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
    </Label>
  );
}
