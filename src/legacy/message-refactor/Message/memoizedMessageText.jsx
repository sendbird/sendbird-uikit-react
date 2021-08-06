import React, { useMemo, useContext } from 'react';

import { LocalizationContext } from '../../../lib/LocalizationContext';
import Label, { LabelTypography, LabelColors } from '../../../ui/Label';
import uuidv4 from '../../../utils/uuid';

export default function useMemoizedMessageText({
  message,
  updatedAt,
  className,
  incoming,
}) {
  const { stringSet } = useContext(LocalizationContext);
  const WORD_TYPOGRAPHY = LabelTypography.BODY_1;
  const EDITED_COLOR = incoming ? LabelColors.ONBACKGROUND_2 : LabelColors.ONCONTENT_2;
  return useMemo(() => () => {
    const splitMessage = message.split(/\r/);
    const matchedMessage = splitMessage
      .map((word) => (word !== '' ? word : <br />));
    if (updatedAt > 0) {
      matchedMessage.push(
        <Label
          key={uuidv4()}
          className={className}
          type={WORD_TYPOGRAPHY}
          color={EDITED_COLOR}
        >
          {` ${stringSet.MESSAGE_EDITED} `}
        </Label>,
      );
    }
    return matchedMessage;
  }, [message, updatedAt, className]);
}
