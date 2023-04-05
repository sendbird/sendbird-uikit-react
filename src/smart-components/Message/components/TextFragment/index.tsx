import React from 'react';
import { UserMessage } from '@sendbird/chat/message';

import { TOKEN_TYPES, Token } from '../../utils/tokens/types'
import { useMessageContext } from '../../context/MessageProvider';
import { keyGenerator } from '../../utils/tokens/keyGenerator';
import MentionLabel from '../../../../ui/MentionLabel';
import { USER_MENTION_PREFIX } from '../../consts';
import LinkLabel from '../../../../ui/LinkLabel';
import { LabelTypography } from '../../../../ui//Label';

export type TextFragmentProps = {
  tokens: Token[];
}

export default function TextFragment({ tokens }: TextFragmentProps) {
  const messageStore = useMessageContext();

  const message = messageStore?.message as UserMessage;
  const isByMe = messageStore?.isByMe;
  const { updatedAt, createdAt } = message;
  return (
    <>
      {
        tokens.map((token, idx) => {
          const key = keyGenerator(createdAt, updatedAt, idx);
          switch (token.type) {
            case TOKEN_TYPES.mention:
              return (
                <span className="sendbird-word">
                  <MentionLabel
                    key={key}
                    mentionTemplate={USER_MENTION_PREFIX}
                    mentionedUserId={token.userId}
                    mentionedUserNickname={token.value}
                    isByMe={isByMe}
                  />
                </span>
              );
            case TOKEN_TYPES.url:
              return (
                <span className='sendbird-word'>
                  <LinkLabel
                    key={key}
                    className="sendbird-word__url"
                    src={token.value}
                    type={LabelTypography.BODY_1}
                  >
                    {token.value}
                  </LinkLabel>
                </span>
              );
            case TOKEN_TYPES.string:
            default:
              return (
                <React.Fragment key={key}>{token.value}</React.Fragment>
              );
          }
        })
      }
    </>
  );
}