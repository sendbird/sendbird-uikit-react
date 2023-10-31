import { useEffect } from 'react';
import { CustomUseReducerDispatcher, Logger } from '../../../../lib/SendbirdState';
import { ThreadContextActionTypes } from '../dux/actionTypes';
import { SdkStore } from '../../../../lib/types';

interface DanamicPrpos {
  sdk: SdkStore['sdk'];
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
