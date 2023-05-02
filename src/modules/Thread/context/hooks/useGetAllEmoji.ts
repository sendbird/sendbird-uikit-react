import { useEffect } from 'react';
import { SendbirdGroupChat } from '@sendbird/chat/groupChannel';
import { CustomUseReducerDispatcher, Logger } from '../../../../lib/SendbirdState';
import { ThreadContextActionTypes } from '../dux/actionTypes';

interface DanamicPrpos {
  sdk: SendbirdGroupChat;
}
interface StaticProps {
  logger: Logger;
  threadDispatcher: CustomUseReducerDispatcher;
}

export default function useGetAllEmoji({
  sdk,
}: DanamicPrpos, {
  logger,
  threadDispatcher,
}: StaticProps): void {
  useEffect(() => {
    if (sdk?.getAllEmoji) { // validation check
      sdk?.getAllEmoji()
        .then((emojiContainer) => {
          logger.info('Thread | useGetAllEmoji: Getting emojis succeeded.', emojiContainer);
          threadDispatcher({
            type: ThreadContextActionTypes.SET_EMOJI_CONTAINER,
            payload: { emojiContainer },
          });
        })
        .catch((error) => {
          logger.info('Thread | useGetAllEmoji: Getting emojis failed.', error);
        });
    }
  }, [sdk]);
}
