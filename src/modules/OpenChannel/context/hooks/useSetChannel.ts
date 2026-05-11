import type { OpenChannel } from '@sendbird/chat/openChannel';
import { useEffect } from 'react';
import type { Logger, SdkStore } from '../../../../lib/Sendbird/types';
import * as messageActionTypes from '../dux/actionTypes';
import * as utils from '../utils';

interface DynamicParams {
  channelUrl: string;
  sdkInit: boolean;
  fetchingParticipants: boolean;
  userId: string;
  currentOpenChannel: OpenChannel | null;
}
interface StaticParams {
  sdk: SdkStore['sdk'];
  logger: Logger;
  messagesDispatcher: ({ type, payload }: { type: string, payload: any }) => void;
}

function useSetChannel(
  { channelUrl, sdkInit, fetchingParticipants, userId, currentOpenChannel }: DynamicParams,
  { sdk, logger, messagesDispatcher }: StaticParams,
): void {
  useEffect(() => {
    let disposed = false;

    if (sdkInit && !channelUrl) {
      if (currentOpenChannel && currentOpenChannel?.exit) {
        currentOpenChannel.exit?.().then(() => {
          logger.info('OpenChannel | useSetChannel: Exit from the previous open channel', currentOpenChannel?.url);
        });
        messagesDispatcher({
          type: messageActionTypes.EXIT_CURRENT_CHANNEL,
          payload: currentOpenChannel,
        });
      }
      messagesDispatcher({
        type: messageActionTypes.RESET_MESSAGES,
        payload: null,
      });
      return;
    }

    if (channelUrl && sdkInit && sdk?.openChannel) {
      if (currentOpenChannel && currentOpenChannel?.exit) {
        currentOpenChannel.exit?.().then(() => {
          logger.info('OpenChannel | useSetChannel: Exit from the previous open channel', currentOpenChannel?.url);
          messagesDispatcher({
            type: messageActionTypes.EXIT_CURRENT_CHANNEL,
            payload: currentOpenChannel,
          });
        });
      }
      logger.info('OpenChannel | useSetChannel: Fetching channel', channelUrl);
      sdk.openChannel.getChannel(channelUrl).then((openChannel) => {
        if (disposed) return;
        logger.info('OpenChannel | useSetChannel: Succeeded to fetch channel', openChannel);
        messagesDispatcher({
          type: messageActionTypes.SET_CURRENT_CHANNEL,
          payload: openChannel,
        });
        openChannel.enter().then(() => {
          if (disposed) return;
          if (openChannel.isOperator(userId)) { // only operator has a permission to fetch these list
            const bannedParticipantListQuery = openChannel.createBannedUserListQuery();
            const mutedParticipantListQuery = openChannel.createMutedUserListQuery();
            utils.fetchWithListQuery(
              bannedParticipantListQuery,
              logger,
              (users) => {
                if (disposed) return;
                messagesDispatcher({
                  type: messageActionTypes.FETCH_BANNED_USER_LIST,
                  payload: {
                    channel: openChannel,
                    users,
                  },
                });
              },
            );
            utils.fetchWithListQuery(
              mutedParticipantListQuery,
              logger,
              (users) => {
                if (disposed) return;
                messagesDispatcher({
                  type: messageActionTypes.FETCH_MUTED_USER_LIST,
                  payload: {
                    channel: openChannel,
                    users,
                  },
                });
              },
            );
          } else {
            openChannel.getMyMutedInfo()
              .then((mutedInfo) => {
                if (disposed) return;
                if (mutedInfo?.isMuted) {
                  messagesDispatcher({
                    type: messageActionTypes.FETCH_MUTED_USER_LIST,
                    payload: {
                      channel: openChannel,
                      users: [sdk?.currentUser],
                    },
                  });
                }
              });
          }
          if (fetchingParticipants) {
            // fetch participants list
            const participantListQuery = openChannel.createParticipantListQuery({
              limit: openChannel.participantCount,
            });
            utils.fetchWithListQuery(
              participantListQuery,
              logger,
              (users) => {
                if (disposed) return;
                messagesDispatcher({
                  type: messageActionTypes.FETCH_PARTICIPANT_LIST,
                  payload: {
                    channel: openChannel,
                    users,
                  },
                });
              },
            );
          }
        }).catch((error) => {
          if (disposed) return;
          logger.warning('OpenChannel | useSetChannel: Failed to enter channel', { channelUrl, error });
          messagesDispatcher({
            type: messageActionTypes.SET_CHANNEL_INVALID,
            payload: null,
          });
        });
      }).catch((error) => {
        if (disposed) return;
        logger.warning('OpenChannel | useSetChannel: Failed to fetch channel', { channelUrl, error });
        messagesDispatcher({
          type: messageActionTypes.SET_CHANNEL_INVALID,
          payload: null,
        });
      });
    }
    return () => {
      disposed = true;
    };
  }, [channelUrl, sdkInit, fetchingParticipants]);
}

export default useSetChannel;
