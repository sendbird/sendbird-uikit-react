import { User } from '@sendbird/chat';
import { IdentifyMentionsType, MentionToken, Token, TokenParams, UndeterminedToken } from './types';
export declare function getUserMentionRegex(mentionedUsers: User[], templatePrefix_: string): RegExp;
export declare function identifyMentions({ tokens, mentionedUsers, templatePrefix, }: IdentifyMentionsType): (MentionToken | UndeterminedToken)[];
export declare function identifyUrlsAndStrings(token: Token[]): Token[];
export declare function combineNearbyStrings(tokens: Token[]): Token[];
/**
 * Converts text into set of rich tokens
 */
export declare function tokenizeMessage({ messageText, mentionedUsers, templatePrefix, }: TokenParams): Token[];
/**
 * Don't need to use this util in DOM element since the white spaces will be kept as is,
 * but will need if the text is wrapped \w React.Fragement or </>
 * @link https://sendbird.slack.com/archives/GPGHESTL3/p1681180484341369
 * Or!!! -> convert any space or tab in leading/trailing to nbsp
 * to preserve the leading & trailing white spaces
 */
export declare function getWhiteSpacePreservedText(text: string): string;
