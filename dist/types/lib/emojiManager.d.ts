/**
 * ## How to use?
 *
 * const { emojiManager } = useSendbirdStateContext();
 * const allEmojis = emojiManager.getAllEmojis();
 * const emojiUrl = emojiManager.getEmojiUrl(reactionKey: string);
 *
 *
 * ## Additional util
 *
 * isReactedByMe(userId)
 */
import type { Emoji, EmojiContainer } from '@sendbird/chat';
import type { SendbirdChatType } from './types';
import { Logger } from './SendbirdState';
import { Reaction } from '@sendbird/chat/message';
export interface EmojiManagerParams {
    sdk: SendbirdChatType;
    logger?: Logger;
}
export declare class EmojiManager {
    private _emojiContainer;
    constructor(props: EmojiManagerParams);
    private get AllEmojisAsArray();
    private get AllEmojisAsMap();
    getAllEmojis(type: string): Map<string, string> | Emoji[];
    getEmojiUrl(reactionKey: Reaction['key']): string;
    get emojiContainer(): EmojiContainer;
}
