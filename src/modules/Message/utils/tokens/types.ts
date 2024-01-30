import { User } from '@sendbird/chat';
import { ObjectValues } from '../../../../utils/typeHelpers/objectValues';

export const TOKEN_TYPES = {
  string: 'string',
  mention: 'mention',
  url: 'url',
  undetermined: 'undetermined',
} as const;

export type TokenType = ObjectValues<typeof TOKEN_TYPES>;

export type BaseToken = {
  type: TokenType;
  value: string;
};

export type StringToken = BaseToken & {
  type: typeof TOKEN_TYPES.string;
};

export type MentionToken = BaseToken & {
  type: Exclude<TokenType, typeof TOKEN_TYPES.url>;
  userId: string;
};

export type UrlToken = BaseToken & {
  type: typeof TOKEN_TYPES.url;
  url: string;
};

export type UndeterminedToken = BaseToken & {
  type: typeof TOKEN_TYPES.undetermined;
};

export type Token = StringToken | MentionToken | UrlToken | UndeterminedToken;

export type TokenParams = {
  messageText: string;
  mentionedUsers?: User[];
  templatePrefix?: string;
};

export type IdentifyMentionsType = {
  tokens: UndeterminedToken[];
  mentionedUsers: User[];
  templatePrefix: string;
};
