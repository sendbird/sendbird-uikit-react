/**
 * @deprecated  This component is deprecated and will be removed in the next major version.
 * Use TextFragment instead.
 */
import './index.scss';
import React from 'react';
import type { UserMessage } from '@sendbird/chat/message';

import { LabelTypography } from '../Label';
import LinkLabel from '../LinkLabel';
import uuidv4 from '../../utils/uuid';
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
export default function Word(props: WordProps): JSX.Element {
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
        convertWordToStringObj(word, message?.mentionedUsers).map((stringObj) => {
          const type = stringObj?.type || '';
          const value = stringObj?.value || '';
          const userId = stringObj?.userId || '';
          if (renderString && typeof renderString === 'function') {
            return renderString(stringObj);
          }
          if (type === StringObjType.mention) {
            return (
              <MentionLabel
                mentionTemplate={mentionTemplate}
                mentionedUserId={userId}
                mentionedUserNickname={value}
                key={uuidv4()}
                isByMe={isByMe}
              />
            );
          } else if (type === StringObjType.url) {
            const urlRegex = new RegExp('([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?');
            const targetUrl = urlRegex.exec(value)?.[0];
            const stringUrl = { front: '', url: '', back: '' };
            if (targetUrl) {
              const targetUrlIndex = value.indexOf(targetUrl);
              if (targetUrlIndex > 0) {
                stringUrl.front = value.slice(0, targetUrlIndex);
              }
              stringUrl.url = value.slice(targetUrlIndex, targetUrlIndex + targetUrl.length);
              if (targetUrlIndex + targetUrl.length < value.length) {
                stringUrl.back = value.slice(targetUrlIndex + targetUrl.length);
              }
            }
            if (targetUrl) {
              return [
                stringUrl.front ? stringUrl.front : '',
                stringUrl.url ? (
                  <LinkLabel
                    className="sendbird-word__url"
                    key={uuidv4()}
                    src={stringUrl.url}
                    type={LabelTypography.BODY_1}
                  >
                    {stringUrl.url}
                  </LinkLabel>
                ) : null,
                stringUrl.back ? stringUrl.back : '',
              ];
            }
            return (
              <LinkLabel
                className="sendbird-word__url"
                key={uuidv4()}
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
