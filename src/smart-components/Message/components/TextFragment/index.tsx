import React from 'react';
import { UserMessage } from '@sendbird/chat/message';
import { match } from 'ts-pattern';

import { TOKEN_TYPES, Token } from '../../utils/tokens/types';
import { useMessageContext } from '../../context/MessageProvider';
import { keyGenerator } from '../../utils/tokens/keyGenerator';
import MentionLabel from '../../../../ui/MentionLabel';
import { USER_MENTION_PREFIX } from '../../consts';
import LinkLabel from '../../../../ui/LinkLabel';
import { LabelTypography } from '../../../../ui/Label';

export type TextFragmentProps = {
  tokens: Token[];
};

export default function TextFragment({
  tokens,
}: TextFragmentProps): React.ReactElement {
  const messageStore = useMessageContext();

  const message = messageStore?.message as UserMessage;
  const isByMe = messageStore?.isByMe;
  const { updatedAt, createdAt } = message;

  return (
    <>
      {tokens?.map((token, idx) => {
        const key = keyGenerator(createdAt, updatedAt, idx);
        return match(token.type)
          .with(TOKEN_TYPES.mention, () => (
            <span className="sendbird-word" key={key}>
              <MentionLabel
                mentionTemplate={USER_MENTION_PREFIX}
                mentionedUserId={token.userId}
                mentionedUserNickname={token.value}
                isByMe={isByMe}
              />
            </span>
          ))
          .with(TOKEN_TYPES.url, () => (
            <span className="sendbird-word" key={key}>
              <LinkLabel
                className="sendbird-word__url"
                src={token.value}
                type={LabelTypography.BODY_1}
              >
                {token.value}
              </LinkLabel>
            </span>
          ))
          .otherwise(() => {
            /**
             * To preserve the leading / trailing white spaces
             * by not using additional span tag convert them like below
             * '160' is the Unicode code point for the non-breaking space character (&nbsp; entity)
             * @link https://sendbird.slack.com/archives/GPGHESTL3/p1681180484341369
             */
            const whiteSpacePreservedText = token.value.replace(/\s/g, () => String.fromCharCode(160));
            return (
              <>{whiteSpacePreservedText}</>
            );
          });
      })}
    </>
  );
}
