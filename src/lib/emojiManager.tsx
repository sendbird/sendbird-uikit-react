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
import type { Emoji, EmojiCategory, EmojiContainer } from '@sendbird/chat';

import type { SendbirdChatType } from './types';
import { Logger } from './SendbirdState';
import { match } from 'ts-pattern';
import { Reaction } from '@sendbird/chat/message';

export interface EmojiManagerParams {
  sdk: SendbirdChatType;
  logger?: Logger;
}

export class EmojiManager {
  private _emojiContainer!: EmojiContainer;

  constructor(props: EmojiManagerParams) {
    const { sdk, logger } = props;
    sdk?.getAllEmoji?.()
      .then((emojiContainer) => {
        this._emojiContainer = emojiContainer;
        logger?.info('EmojiManager | Succeeded getting all emojis. ', emojiContainer);
      })
      .catch(() => {
        logger?.warning('EmojiManager | Failed getting all emojis.');
      });
  }

  private get AllEmojisAsArray() {
    return this._emojiContainer.emojiCategories.flatMap((category: EmojiCategory) => category.emojis);
  }

  private get AllEmojisAsMap() {
    return this._emojiContainer.emojiCategories
      .flatMap((category: EmojiCategory) => category.emojis)
      .reduce((map: Map<string, string>, emoji: Emoji) => {
        map.set(emoji.key, emoji.url);
        return map;
      }, new Map<string, string>());
  }

  public getAllEmojis(type: string) {
    return match(type)
      .when((type) => ['array', 'arr'].includes(type), () => this.AllEmojisAsArray)
      .when((type) => ['map'].includes(type), () => this.AllEmojisAsMap)
      .otherwise(() => this.AllEmojisAsArray);
  }

  public getEmojiUrl(reactionKey: Reaction['key']) {
    return this.AllEmojisAsArray.find((emoji) => emoji.key === reactionKey)?.url ?? '';
  }

  public get emojiContainer() {
    return this._emojiContainer;
  }
}
