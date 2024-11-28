import { useEffect } from 'react';
import useThread from '../useThread';
import type { Logger, SdkStore } from '../../../../lib/Sendbird/types';

interface DanamicPrpos {
  sdk: SdkStore['sdk'];
}
interface StaticProps {
  logger: Logger;
}

export default function useGetAllEmoji({
  sdk,
}: DanamicPrpos, {
  logger,
}: StaticProps): void {
  const {
    actions: {
      setEmojiContainer,
    },
  } = useThread();

  useEffect(() => {
    if (sdk?.getAllEmoji) { // validation check
      sdk?.getAllEmoji()
        .then((emojiContainer) => {
          logger.info('Thread | useGetAllEmoji: Getting emojis succeeded.', emojiContainer);
          setEmojiContainer(emojiContainer);
        })
        .catch((error) => {
          logger.info('Thread | useGetAllEmoji: Getting emojis failed.', error);
        });
    }
  }, [sdk]);
}
