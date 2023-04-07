import { User } from "@sendbird/chat";
import { USER_MENTION_PREFIX } from "../../consts";
import { IdentifyMentionsType, Token, TOKEN_TYPES, TokenParams } from "./types";
import { isUrl } from "../../../../utils";

export function getUserMentionRegex(mentionedUsers: User[], templatePrefix_: string): RegExp {
  const templatePrefix = templatePrefix_ || USER_MENTION_PREFIX;
  return RegExp(`(${mentionedUsers.map(u => `${templatePrefix}{${u.userId}}`).join('|')})`, 'g');
}

export function identifyMentions({
  tokens,
  mentionedUsers = [],
  templatePrefix = USER_MENTION_PREFIX,
}: IdentifyMentionsType): Token[] {
  if (!mentionedUsers?.length) {
    return tokens;
  }
  const userMentionRegex = getUserMentionRegex(mentionedUsers, templatePrefix);
  const results: Token[] = tokens.map((token) => {
    // if the token is not undetermined, return it as is
    if (token.type !== TOKEN_TYPES.undetermined) {
      return token;
    }
    const { value } = token;
    const parts = value.split(userMentionRegex);
    const tokens = parts.map((part) => {
      if (part.match(userMentionRegex)) {
        const matchedUser = mentionedUsers.find((user) => `@{${user?.userId}}` === part);
        const nickname = matchedUser?.nickname || '(No name)'
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
    const { value } = token;
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

  // const tokenize = pipe(
  //   identifyMentions,
  //   identifyUrlsAndStrings,
  //   combineNearbyStrings,
  // );
  // const result = tokenize(messageText);
  const partialResult = [{
    type: TOKEN_TYPES.undetermined,
    value: messageText,
  }];

  const partialWithMentions = identifyMentions({
    tokens: partialResult,
    mentionedUsers,
    templatePrefix,
  });
  const partialsWithUrlsAndMentions = identifyUrlsAndStrings(partialWithMentions);
  const result = combineNearbyStrings(partialsWithUrlsAndMentions);

  return result;
}

