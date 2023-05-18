import { User } from '@sendbird/chat';
import { USER_MENTION_PREFIX } from '../../consts';
import { IdentifyMentionsType, MentionToken, Token, TOKEN_TYPES, TokenParams, UndeterminedToken } from './types';
import { isUrl } from '../../../../utils';

export function getUserMentionRegex(mentionedUsers: User[], templatePrefix_: string): RegExp {
  const templatePrefix = templatePrefix_ || USER_MENTION_PREFIX;

  return RegExp(`(${mentionedUsers.map(u => {
    const userId = u.userId.replace(
      // If user.id includes these patterns, need to convert it into an escaped one
      /([.*+?^${}()|[\]\\])/g,
      '\\$1');
    return `${templatePrefix}{${userId}}`;
  }).join('|')})`, 'g');
}

export function identifyMentions({
  tokens,
  mentionedUsers = [],
  templatePrefix = USER_MENTION_PREFIX,
}: IdentifyMentionsType): (MentionToken|UndeterminedToken)[] {
  if (!mentionedUsers?.length) {
    return tokens;
  }
  const userMentionRegex = getUserMentionRegex(mentionedUsers, templatePrefix);
  const results: (UndeterminedToken | MentionToken)[] = tokens.map((token) => {
    // if the token is not undetermined, return it as is
    // is kinda unnecessary with TS, but just in case
    if (token.type !== TOKEN_TYPES.undetermined) {
      return token;
    }
    const { value } = token;
    const parts = value.split(userMentionRegex);

    const tokens = parts.map((part) => {
      if (part.match(userMentionRegex)) {
        const matchedUser = mentionedUsers.find((user) => `@{${user?.userId}}` === part);
        const nickname = matchedUser?.nickname || '(No name)';
        return { value: nickname, type: TOKEN_TYPES.mention, userId: matchedUser?.userId };
      } else {
        return { value: part, type: TOKEN_TYPES.undetermined };
      }
    });
    return tokens;
  }).flat();
  return results;
}

export function identifyUrlsAndStrings(token: Token[]): Token[] {
  const results: Token[] = token.map((token) => {
    if (token.type !== TOKEN_TYPES.undetermined) {
      return token;
    }
    const { value = '' } = token;
    const parts = value.split(' ');
    const tokens = parts.map((part) => {
      if (isUrl(part)) {
        return { value: part, type: TOKEN_TYPES.url };
      } else {
        return { value: part, type: TOKEN_TYPES.string };
      }
    });
    return tokens;
  }).flat();

  return results;
}

export function combineNearbyStrings(tokens: Token[]): Token[] {
  const results: Token[] = tokens.reduce((acc, token) => {
    const lastToken = acc[acc.length - 1];
    if (lastToken?.type === TOKEN_TYPES.string && token.type === TOKEN_TYPES.string) {
      lastToken.value = `${lastToken.value} ${token.value}`;
      return acc;
    }
    return [...acc, token];
  }, []);
  return results;
}

/**
 * Converts text into set of rich tokens
 */
export function tokenizeMessage({
  messageText,
  mentionedUsers = [],
  templatePrefix = USER_MENTION_PREFIX,
}: TokenParams): Token[] {
  // mention can be squeezed-in(no-space-between) with other mentions and urls
  // if no users are mentioned, return the messageText as a single token
  const partialResult = [{
    type: TOKEN_TYPES.undetermined,
    value: messageText,
  }];

  // order is important because we want to identify mentions first
  // identifyMentions will return a token with type mention or undetermined
  const partialWithMentions = identifyMentions({
    tokens: partialResult,
    mentionedUsers,
    templatePrefix,
  });
  const partialsWithUrlsAndMentions = identifyUrlsAndStrings(partialWithMentions);
  const result = combineNearbyStrings(partialsWithUrlsAndMentions);

  return result;
}

/**
 * Don't need to use this util in DOM element since the white spaces will be kept as is,
 * but will need if the text is wrapped \w React.Fragement or </>
 * @link https://sendbird.slack.com/archives/GPGHESTL3/p1681180484341369
 */
export function getWhiteSpacePreservedText(text: string): string {
  return text
    // convert any space or tab into the non-breaking space
    // to preserve the leading & trailing white spaces
    .replace(/([ \t]+)/g, (_, spaces) => '\u00A0'.repeat(spaces.length));
}
