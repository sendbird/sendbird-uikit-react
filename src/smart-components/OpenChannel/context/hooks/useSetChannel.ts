import { useEffect } from 'react';
import * as messageActionTypes from '../dux/actionTypes';
import * as utils from '../utils';

interface DynamicParams {
  channelUrl: string;
  sdkInit: boolean;
  fetchingParticipants: boolean;
  userId: string;
}
interface StaticParams {
  sdk: SendbirdUIKit.Sdk;
  logger: SendbirdUIKit.Logger;
  messagesDispatcher: ({ type: string, payload: any }) => void;
}

function useSetChannel(
  { channelUrl, sdkInit, fetchingParticipants, userId }: DynamicParams,
  { sdk, logger, messagesDispatcher }: StaticParams,
): void {
  useEffect(() => {
    if (channelUrl && sdkInit && sdk && sdk.OpenChannel) {
      logger.info('OpenChannel | useSetChannel fetching channel', channelUrl);
      sdk.OpenChannel.getChannel(channelUrl, (openChannel, error) => {
        if (!error) {
          logger.info('OpenChannel | useSetChannel fetched channel', openChannel);
          messagesDispatcher({
            type: messageActionTypes.SET_CURRENT_CHANNEL,
            payload: openChannel,
          });
          openChannel.enter((_, error) => {
            if (error) {
              logger.warning('OpenChannel | useSetChannel enter channel failed', { channelUrl, error });
              messagesDispatcher({
                type: messageActionTypes.SET_CHANNEL_INVALID,
                payload: null,
              });
            }
            if (openChannel.isOperatorWithUserId(userId)) { // only operator has a permission to fetch these list
              const bannedParticipantListQuery = openChannel.createBannedUserListQuery();
              const mutedParticipantListQuery = openChannel.createMutedUserListQuery();
              utils.fetchWithListQuery(
                bannedParticipantListQuery,
                logger,
                (users) => {
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
                  messagesDispatcher({
                    type: messageActionTypes.FETCH_MUTED_USER_LIST,
                    payload: {
                      channel: openChannel,
                      users,
                    },
                  });
                },
              );
            }
            if (fetchingParticipants) {
              // fetch participants list
              const participantListQuery = openChannel.createParticipantListQuery();
              utils.fetchWithListQuery(
                participantListQuery,
                logger,
                (users) => {
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
          });
        } else {
          logger.warning('OpenChannel | useSetChannel fetching channel failed', { channelUrl, error });
          messagesDispatcher({
            type: messageActionTypes.SET_CHANNEL_INVALID,
            payload: null,
          });
        }
      });
      // .then((openChannel) => {
      //   logger.info('OpenChannel | useSetChannel fetched channel', openChannel);
      //   messagesDispatcher({
      //     type: messageActionTypes.SET_CURRENT_CHANNEL,
      //     payload: openChannel,
      //   });
      //   openChannel.enter((_, error) => {
      //     if (error) {
      //       logger.warning('OpenChannel | useSetChannel enter channel failed', { channelUrl, error });
      //       messagesDispatcher({
      //         type: messageActionTypes.SET_CHANNEL_INVALID,
      //       });
      //     }
      //     if (fetchingParticipants) {
      //       // fetch participants, banned participantIds, muted participantIds
      //       const participantListQuery = openChannel.createParticipantListQuery();
      //       const bannedParticipantListQuery = openChannel.createBannedUserListQuery();
      //       const mutedParticipantListQuery = openChannel.createMutedUserListQuery();
      //       utils.fetchWithListQuery(
      //         participantListQuery,
      //         logger,
      //         (users) => {
      //           messagesDispatcher({
      //             type: messageActionTypes.FETCH_PARTICIPANT_LIST,
      //             payload: {
      //               channel: openChannel,
      //               users,
      //             },
      //           });
      //         },
      //       );
      //       utils.fetchWithListQuery(
      //         bannedParticipantListQuery,
      //         logger,
      //         (users) => {
      //           messagesDispatcher({
      //             type: messageActionTypes.FETCH_BANNED_USER_LIST,
      //             payload: {
      //               channel: openChannel,
      //               users,
      //             },
      //           });
      //         },
      //       );
      //       utils.fetchWithListQuery(
      //         mutedParticipantListQuery,
      //         logger,
      //         (users) => {
      //           messagesDispatcher({
      //             type: messageActionTypes.FETCH_MUTED_USER_LIST,
      //             payload: {
      //               channel: openChannel,
      //               users,
      //             },
      //           });
      //         },
      //       );
      //     }
      //   });
      // })
      // .catch((error) => {
      //   logger.warning('OpenChannel | useSetChannel fetching channel failed', { channelUrl, error });
      //   messagesDispatcher({
      //     type: messageActionTypes.SET_CHANNEL_INVALID,
      //   });
      // });
    }
  }, [channelUrl, sdkInit, fetchingParticipants]);
}

export default useSetChannel;
