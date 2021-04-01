import React, { useMemo, useContext } from 'react';

import { LocalizationContext } from '../../lib/LocalizationContext';
import Label, { LabelTypography, LabelColors } from '../Label';
import LinkLabel from '../LinkLabel';
import uuidv4 from '../../utils/uuid';
import { createUrlTester } from './utils';
import { URL_REG } from './const';

const isUrl = createUrlTester(URL_REG);

export default function useMemoizedMessageText({
  message,
  updatedAt,
  className,
  incoming = false,
}) {
  const { stringSet } = useContext(LocalizationContext);
  const WORD_TYPOGRAPHY = LabelTypography.BODY_1;
  const WORD_COLOR = incoming ? LabelColors.ONBACKGROUND_1 : LabelColors.ONCONTENT_1;
  const EDITED_COLOR = incoming ? LabelColors.ONBACKGROUND_2 : LabelColors.ONCONTENT_2;
  return useMemo(() => () => {
    const splitMessage = message.split(' ');
    const matchedMessage = splitMessage
      .map((word) => (
        isUrl(word)
          ? (
            <LinkLabel
              key={uuidv4()}
              className={className}
              src={word}
              type={WORD_TYPOGRAPHY}
              color={WORD_COLOR}
            >
              {word}
            </LinkLabel>
          )
          : (
            <Label
              key={uuidv4()}
              className={className}
              type={WORD_TYPOGRAPHY}
              color={WORD_COLOR}
            >
              {word}
            </Label>
          )
      ));
    if (updatedAt > 0) {
      matchedMessage.push(
        <Label
          key={uuidv4()}
          className={className}
          type={WORD_TYPOGRAPHY}
          color={EDITED_COLOR}
        >
          {stringSet.MESSAGE_EDITED}
        </Label>,
      );
    }
    return matchedMessage;
  }, [message, updatedAt, className]);
}
