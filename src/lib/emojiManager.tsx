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
  private sdk: SendbirdChatType;

  private logger: Logger;

  private _emojiContainer: EmojiContainer;

  /**
   * Fetching the entire list of emojis at initialization delays the app startup.
   * Use this function to fetch emoji lists only when actually needed.
   */
  private _fetchAllEmojis() {
    if (!this._emojiContainer) {
      this.sdk?.getAllEmoji?.()
        .then((emojiContainer) => {
          this._emojiContainer = emojiContainer;
          this.logger?.info('EmojiManager | Succeeded getting all emojis. ', emojiContainer);
        })
        .catch(() => {
          this.logger?.warning('EmojiManager | Failed getting all emojis.');
        });
    }
  }

  constructor(props: EmojiManagerParams) {
    const { sdk, logger } = props;
    this.sdk = sdk;
    this.logger = logger;
  }

  private get AllEmojisAsArray() {
    this._fetchAllEmojis();
    return this._emojiContainer.emojiCategories.flatMap((category: EmojiCategory) => category.emojis);
  }

  private get AllEmojisAsMap() {
    this._fetchAllEmojis();
    return this._emojiContainer.emojiCategories
      .flatMap((category: EmojiCategory) => category.emojis)
      .reduce((map: Map<string, string>, emoji: Emoji) => {
        map.set(emoji.key, emoji.url);
        return map;
      }, new Map<string, string>());
  }

  public getAllEmojis(type: string) {
    this._fetchAllEmojis();
    return match(type)
      .when((type) => ['array', 'arr'].includes(type), () => this.AllEmojisAsArray)
      .when((type) => ['map'].includes(type), () => this.AllEmojisAsMap)
      .otherwise(() => this.AllEmojisAsArray);
  }

  public getEmojiUrl(reactionKey: Reaction['key']) {
    this._fetchAllEmojis();
    return this.AllEmojisAsArray.find((emoji) => emoji.key === reactionKey).url ?? '';
  }

  public get emojiContainer() {
    this._fetchAllEmojis();
    return this._emojiContainer;
  }
}
