import React from 'react';
import { UserMessage } from '@sendbird/chat/message';
import { match } from 'ts-pattern';

import { TOKEN_TYPES, Token, MarkdownToken } from '../../utils/tokens/types';
import { useMessageContext } from '../../context/MessageProvider';
import { keyGenerator } from '../../utils/tokens/keyGenerator';
import MentionLabel from '../../../../ui/MentionLabel';
import { USER_MENTION_PREFIX } from '../../consts';
import LinkLabel from '../../../../ui/LinkLabel';
import { LabelColors, LabelTypography } from '../../../../ui/Label';
import { getWhiteSpacePreservedText, tokenizeMarkdown } from '../../utils/tokens/tokenize';
import { asSafeURL } from '../../utils/tokens/asSafeURL';

export type TextFragmentProps = {
  tokens: Token[];
  isByMe?: boolean;
};

export default function TextFragment({
  tokens,
  isByMe: isByMeProp,
}: TextFragmentProps): React.ReactElement {
  const messageStore = useMessageContext();

  const message = messageStore?.message as UserMessage;
  const isByMe = isByMeProp ?? messageStore?.isByMe;
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
                    <span style={{ fontWeight: 'bold' }}>
                      <TextFragment tokens={tokenizeMarkdown({ messageText: groups[1] })} isByMe={isByMe}/>
                    </span>
                  ))
                  .with('url', () => {
                    return (
                      <a
                        className={
                          isByMe
                            ? 'sendbird-label--color-oncontent-1'
                            : 'sendbird-label--color-onbackground-1'
                        }
                        href={asSafeURL(groups[2])}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <TextFragment tokens={tokenizeMarkdown({ messageText: groups[1] })} isByMe={isByMe}/>
                      </a>
                    );
                  })
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
                src={token.value}
                type={LabelTypography.BODY_1}
                color={isByMe ? LabelColors.ONCONTENT_1 : LabelColors.ONBACKGROUND_1}
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
