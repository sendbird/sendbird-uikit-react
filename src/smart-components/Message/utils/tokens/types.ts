import { User } from "@sendbird/chat";
import { ObjectValues } from "../../../../utils/typeHelpers/objectValues";

export const TOKEN_TYPES = {
  string: 'string',
  mention: 'mention',
  url: 'url',
  undetermined: 'undetermined',
} as const;

export type TokenType = ObjectValues<typeof TOKEN_TYPES>;

export type StringToken = {
  type: typeof TOKEN_TYPES.string;
  value: string;
};

export type MentionToken = {
  type: typeof TOKEN_TYPES.mention;
  value: string;
  userId: string;
};

export type UrlToken = {
  type: typeof TOKEN_TYPES.url;
  value: string;
};

export type UndeterminedToken = {
  type: typeof TOKEN_TYPES.undetermined;
  value: string;
};

export type Token = StringToken | MentionToken | UrlToken | UndeterminedToken;

export type TokenParams = {
  messageText: string;
  mentionedUsers?: User[];
  templatePrefix?: string;
};

export type IdentifyMentionsType = {
  tokens: (UndeterminedToken)[];
  mentionedUsers: User[];
  templatePrefix: string;
};
