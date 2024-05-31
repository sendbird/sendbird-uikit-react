import React from 'react';
import { UserMessage } from '@sendbird/chat/message';
import { match } from 'ts-pattern';

import { TOKEN_TYPES, Token, MarkdownToken } from '../../utils/tokens/types';
import { useMessageContext } from '../../context/MessageProvider';
import { keyGenerator } from '../../utils/tokens/keyGenerator';
import MentionLabel from '../../../../ui/MentionLabel';
import { USER_MENTION_PREFIX } from '../../consts';
import LinkLabel from '../../../../ui/LinkLabel';
import { LabelTypography } from '../../../../ui/Label';
import { getWhiteSpacePreservedText } from '../../utils/tokens/tokenize';

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
          .with(TOKEN_TYPES.markdown, () => {
            const markdownToken = token as MarkdownToken;
            const groups = markdownToken.groups;
            return <span className="sendbird-word" key={key} data-testid="sendbird-ui-word">
              {
                match(markdownToken.markdownType)
                  .with('bold', () => (
                    <strong>{groups[1]}</strong>
                  ))
                  .with('url', () => (
                    <a
                      className="sendbird-word__url"
                      href={groups[2]}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {groups[1]}
                    </a>
                  ))
                  .otherwise(() => <></>)
              }
          </span>;
          })
          .with(TOKEN_TYPES.mention, () => (
            <span className="sendbird-word" key={key} data-testid="sendbird-ui-word">
              <MentionLabel
                mentionTemplate={USER_MENTION_PREFIX}
                // @ts-ignore
                mentionedUserId={token.userId}
                mentionedUserNickname={token.value}
                isByMe={isByMe}
              />
            </span>
          ))
          .with(TOKEN_TYPES.url, () => (
            <span className="sendbird-word" key={key} data-testid="sendbird-ui-word">
              <LinkLabel
                className="sendbird-word__url"
                src={token.value}
                type={LabelTypography.BODY_1}
              >
                {token.value}
              </LinkLabel>
            </span>
          ))
          .otherwise(() => <React.Fragment key={key}>{getWhiteSpacePreservedText(token.value)}</React.Fragment>);
      })}
    </>
  );
}
