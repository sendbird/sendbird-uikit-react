/**
 * @deprecated  This component is deprecated and will be removed in the next major version.
 * Use TextFragment instead.
 */
import './index.scss';
import React from 'react';
import type { UserMessage } from '@sendbird/chat/message';

import { LabelTypography } from '../Label';
import LinkLabel from '../LinkLabel';
import { convertWordToStringObj, StringObjType, StringObj } from '../../utils';
import MentionLabel from '../MentionLabel';

interface WordProps {
  word: string;
  message: UserMessage;
  isByMe?: boolean;
  mentionTemplate?: string;
  renderString?: (stringObj: StringObj) => JSX.Element;
}

// Word and StringObj will include types: normal, mention, url
export default function Word(props: WordProps): JSX.Element | null{
  const {
    word,
    message,
    isByMe = false,
    mentionTemplate = '@',
    renderString = null,
  } = props;
  if (word === '') {
    return null;
  }
  return (
    <span className="sendbird-word">
      {
        message?.mentionedUsers && convertWordToStringObj(word, message?.mentionedUsers).map((stringObj, index) => {
          const type = stringObj?.type || '';
          const value = stringObj?.value || '';
          const userId = stringObj?.userId || '';
          const key = `${value}-${index}`;
          if (renderString && typeof renderString === 'function') {
            return renderString(stringObj);
          }
          if (type === StringObjType.mention) {
            return (
              <MentionLabel
                key={key}
                mentionTemplate={mentionTemplate}
                mentionedUserId={userId}
                mentionedUserNickname={value}
                isByMe={isByMe}
              />
            );
          } else if (type === StringObjType.url) {
            return (
              <LinkLabel
                key={key}
                className="sendbird-word__url"
                src={word}
                type={LabelTypography.BODY_1}
              >
                {value}
              </LinkLabel>
            );
          } else {
            return value;
          }
        })
      }
    </span>
  );
}
