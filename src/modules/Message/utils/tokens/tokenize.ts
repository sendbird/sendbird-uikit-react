import { User } from '@sendbird/chat';
import { USER_MENTION_PREFIX } from '../../consts';
import { IdentifyMentionsType, MentionToken, Token, TOKEN_TYPES, TokenParams, UndeterminedToken } from './types';

export function getUserMentionRegex(mentionedUsers: User[], templatePrefix_: string): RegExp {
  const templatePrefix = templatePrefix_ || USER_MENTION_PREFIX;

  return RegExp(`(${mentionedUsers.map(u => {
    const userId = u.userId.replace(
      // If user.id includes these patterns, need to convert it into an escaped one
      /([.*+?^${}()|[\]\\])/g,
      '\\$1');
      /**
       * //{ And //} are also for escaping
       * because curly braces `{}` are metacharacters in regular expressions used to specify repetition
       */
    return `${templatePrefix}\\{${userId}\\}`;
  }).join('|')})`, 'g');
}

export function identifyMentions({
  tokens,
  mentionedUsers = [],
  templatePrefix = USER_MENTION_PREFIX,
}: IdentifyMentionsType): (MentionToken | UndeterminedToken)[] {
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
  const URL_REG = /(?:https?:\/\/|www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.(xn--)?[a-z]{2,20}\b([-a-zA-Z0-9@:%_+[\],.~#?&/=]*[-a-zA-Z0-9@:%_+~#?&/=])*/g;
  const results: Token[] = token.map((token) => {
    if (token.type !== TOKEN_TYPES.undetermined) {
      return token;
    }
    const { value = '' } = token;

    const matches = Array.from(value.matchAll(URL_REG));
    const founds = matches.map((value) => {
      const text = value[0];
      const start = value.index ?? 0;
      const end = start + text.length;
      return { text, start, end };
    });

    const items: Token[] = [{ value, type: TOKEN_TYPES.string }];
    let cursor = 0;
    founds.forEach(({ text, start, end }) => {
      const restText = items.pop().value as string;
      const head = restText.slice(0, start - cursor);
      const mid = text;
      const tail = restText.slice(end - cursor);

      if (head.length > 0) items.push({ value: head, type: TOKEN_TYPES.string });
      items.push({ value: mid, type: TOKEN_TYPES.url });
      if (tail.length > 0) items.push({ value: tail, type: TOKEN_TYPES.string });
      cursor = end;
    });

    return items;
  }).flat();

  return results;
}

export function combineNearbyStrings(tokens: Token[]): Token[] {
  const results: Token[] = tokens.reduce((acc, token) => {
    const lastToken = acc[acc.length - 1];
    if (lastToken?.type === TOKEN_TYPES.string && token.type === TOKEN_TYPES.string) {
      lastToken.value = `${lastToken.value}${token.value}`;
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
 * Or!!! -> convert any space or tab in leading/trailing to nbsp
 * to preserve the leading & trailing white spaces
 */
export function getWhiteSpacePreservedText(text: string): string {
  const NON_BREAKING_SPACE = '\u00A0';
  // Split the input string into lines
  const lines = text.split('\n');

  // Process each line and convert leading and trailing white spaces to "\u00A0"
  const processedLines = lines.map((line) => {
    const leadingWhitespace = line.match(/^\s*/)?.[0] || '';
    const trailingWhitespace = line.match(/\s*$/)?.[0] || '';

    const convertedLeadingWhitespace = leadingWhitespace.replace(/ /g, NON_BREAKING_SPACE);
    const convertedTrailingWhitespace = trailingWhitespace.replace(/ /g, NON_BREAKING_SPACE);

    return convertedLeadingWhitespace + line.trim() + convertedTrailingWhitespace;
  });

  // Combine the processed lines into a new string with "\n"
  const result = processedLines.join('\n');

  return result;
}
