import React from 'react';
import SendBird from 'sendbird';
import './index.scss';

import Label, { LabelTypography, LabelColors } from '../Label';
import LinkLabel from '../LinkLabel';
import uuidv4 from '../../utils/uuid';
import { convertWordToStringObj, StringObjType, StringObj } from '../../utils';

interface WordProps {
  word: string;
  message: SendBird.UserMessage;
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
  return (
    <span className="sendbird-word">
      {
        convertWordToStringObj(word, message?.mentionedUsers).map((stringObj) => {
          const { type, value } = stringObj;
          if (renderString && typeof renderString === 'function') {
            return renderString(stringObj);
          }
          if (type === StringObjType.mention) {
            return (
              <Label
                key={uuidv4()}
                className="sendbird-word__mention"
                type={LabelTypography.CAPTION_1}
                color={isByMe ? LabelColors.ONCONTENT_1 : LabelColors.ONBACKGROUND_1}
              >
                {`${mentionTemplate}${value}`}
              </Label>
            );
          } else if (type === StringObjType.url) {
            return (
              <LinkLabel
                className="sendbird-word__url"
                key={uuidv4()}
                src={word}
                type={LabelTypography.BODY_1}
                color={isByMe ? LabelColors.ONCONTENT_1 : LabelColors.ONBACKGROUND_1}
              >
                {value}
              </LinkLabel>
            );
          } else {
            return value
          }
        })
      }
    </span>
  );
}
