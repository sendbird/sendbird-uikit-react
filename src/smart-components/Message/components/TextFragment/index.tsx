import React from 'react';
import { UserMessage } from '@sendbird/chat/message';

import { TOKEN_TYPES, Token } from '../../utils/tokens/types'
import { useMessageContext } from '../../context/MessageProvider';
import { keyGenerator } from '../../utils/tokens/keyGenerator';
import MentionLabel from '../../../../ui/MentionLabel';
import { USER_MENTION_PREFIX } from '../../consts';
import LinkLabel from '../../../../ui/LinkLabel';
import { LabelTypography } from '../../../../ui//Label';
import { match } from "ts-pattern";

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
        return (
          <span className="sendbird-word" key={key}>
            {match(token.type)
              .with(TOKEN_TYPES.mention, () => (
                <MentionLabel
                  mentionTemplate={USER_MENTION_PREFIX}
                  mentionedUserId={token.userId}
                  mentionedUserNickname={token.value}
                  isByMe={isByMe}
                />
              ))
              .with(TOKEN_TYPES.url, () => (
                <LinkLabel
                  className="sendbird-word__url"
                  src={token.value}
                  type={LabelTypography.BODY_1}
                >
                  {token.value}
                </LinkLabel>
              ))
              .otherwise(() => (
                <>{token.value}</>
              ))}
          </span>
        );
      })}
    </>
  );
}
