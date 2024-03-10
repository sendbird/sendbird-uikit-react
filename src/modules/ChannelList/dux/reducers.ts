import { match, P } from 'ts-pattern';
import { filterChannelListParams, getChannelsWithUpsertedChannel } from '../../../utils';
import * as channelListActions from './actionTypes';
import { ChannelListActionTypes } from './actionTypes';
import { getNextChannel } from './getNextChannel';
import initialState, { ChannelListInitialStateType } from './initialState';
import { GroupChannel } from '@sendbird/chat/groupChannel';

export default function channelListReducer(
  state: ChannelListInitialStateType,
  action: ChannelListActionTypes
): ChannelListInitialStateType {
  return (
    match(action)
      .with({ type: channelListActions.INIT_CHANNELS_START }, ({ payload }) => ({
        ...state,
        loading: true,
        error: null,
        currentUserId: payload.currentUserId,
      }))
      .with({ type: channelListActions.RESET_CHANNEL_LIST }, () => {
        return initialState;
      })
      .with({ type: channelListActions.INIT_CHANNELS_SUCCESS }, (action) => {
        const { channelList, disableAutoSelect } = action.payload;
        return {
          ...state,
          initialized: true,
          loading: false,
          error: null,
          allChannels: channelList,
          disableAutoSelect,
          currentChannel:
            !disableAutoSelect && channelList && channelList.length && channelList.length > 0 ? channelList[0] : state.currentChannel,
        };
      })
      .with({ type: channelListActions.REFRESH_CHANNELS_SUCCESS }, (action) => {
        const { channelList, currentChannel } = action.payload;
        return {
          ...state,
          loading: false,
          error: null,
          allChannels: channelList,
          currentChannel,
        };
      })
      .with({ type: channelListActions.FETCH_CHANNELS_START }, (action) => {
        return {
          ...state,
          loading: true,
          error: null,
        };
      })
      .with({ type: channelListActions.FETCH_CHANNELS_SUCCESS }, (action) => {
        const currentChannels = state.allChannels.map((c) => c.url);
        const filteredChannels = action.payload.filter(({ url }) => !currentChannels.find((c) => c === url));
        return {
          ...state,
          allChannels: [...state.allChannels, ...filteredChannels],
        };
      })
      .with({ type: P.union(channelListActions.FETCH_CHANNELS_FAILURE, channelListActions.INIT_CHANNELS_FAILURE) }, (action) => {
        return {
          ...state,
          loading: false,
          error: action.payload ?? new Error('Failed to fetch channels'),
        };
      })
      .with({ type: channelListActions.CREATE_CHANNEL }, (action) => {
        const channel = action.payload;
        const { allChannels, currentUserId, channelListQuery } = state;
        if (channelListQuery) {
          if (filterChannelListParams(channelListQuery, channel, currentUserId)) {
            // Good to add to the ChannelList
            return {
              ...state,
              currentChannel: channel,
              allChannels: getChannelsWithUpsertedChannel(allChannels, channel, state.channelListQuery?.order),
            };
          }
          // Do not add to the ChannelList
          return {
            ...state,
            currentChannel: channel,
          };
        }
        // No channelListQuery
        // Add to the top of the ChannelList
        return {
          ...state,
          currentChannel: channel,
          allChannels: [channel, ...allChannels.filter((ch) => ch.url !== channel?.url)],
        };
      })
      // A hidden channel will be unhidden when getting new message
      .with({ type: channelListActions.ON_CHANNEL_ARCHIVED }, (action) => {
        const channel = action.payload;
        const { allChannels, currentUserId, currentChannel, channelListQuery, disableAutoSelect } = state;
        if (channelListQuery) {
          if (filterChannelListParams(channelListQuery, channel, currentUserId)) {
            // Good to [add to/keep in] the ChannelList
            return {
              ...state,
              allChannels: getChannelsWithUpsertedChannel(allChannels, channel, state.channelListQuery?.order),
            };
          }
          // * Remove the channel from the ChannelList: because the channel is filtered
        }

        // No channelListQuery
        // * Remove the channel from the ChannelList: because the channel is hidden
        // Replace the currentChannel if it's filtered or hidden
        const nextChannel = getNextChannel({
          channel,
          currentChannel,
          allChannels,
          disableAutoSelect,
        });
        return {
          ...state,
          currentChannel: nextChannel,
          allChannels: allChannels.filter(({ url }) => url !== channel?.url),
        };
      })
      .with({ type: P.union(channelListActions.LEAVE_CHANNEL_SUCCESS, channelListActions.ON_CHANNEL_DELETED) }, (action) => {
        const channelUrl = action.payload;
        const allChannels = state.allChannels.filter(({ url }) => url !== channelUrl);
        return {
          ...state,
          currentChannel: channelUrl === state.currentChannel?.url ? allChannels[0] : state.currentChannel,
          allChannels,
        };
      })
      .with({ type: channelListActions.ON_USER_LEFT }, (action) => {
        const { channel, isMe } = action.payload;
        const { allChannels, currentUserId, currentChannel, channelListQuery, disableAutoSelect } = state;
        let nextChannels = [...allChannels];
        let nextChannel: GroupChannel = channel;

        /**
         * 1. If I left channel:
         *   - Remove the channel from channel list
         *   - Replace currentChannel with the next ordered channel
         * 2. If other member left channel:
         *   2-1. If query is given:
         *     2-1-1. If channel no longer matches the query
         *       - Same as step 1
         *     2-1-2. If channel matches the query:
         *       - Upsert channel list with the channel
         *       - Replace currentChannel IFF url is same
         *   2-2. If query is not given,
         *     - Same as step 2-1-2
         */
        /* `1` and `2-1-1` */
        if (isMe || (channelListQuery && !filterChannelListParams(channelListQuery, channel, currentUserId))) {
          const channelAt = allChannels.findIndex((ch: GroupChannel) => ch.url === channel.url);
          if (channelAt > -1) {
            nextChannels.splice(channelAt, 1);
            nextChannel = getNextChannel({
              channel,
              currentChannel,
              allChannels,
              disableAutoSelect,
            });
          }
        } else {
          /* `2-1-2` and `2-2` */
          nextChannels = getChannelsWithUpsertedChannel(allChannels, channel, state.channelListQuery?.order);
          if (currentChannel?.url === channel.url) {
            nextChannel = channel;
          }
        }
        return {
          ...state,
          currentChannel: nextChannel,
          allChannels: nextChannels,
        };
      })
      .with(
        {
          type: P.union(
            channelListActions.ON_USER_JOINED,
            channelListActions.ON_CHANNEL_CHANGED,
            channelListActions.ON_READ_RECEIPT_UPDATED,
            channelListActions.ON_DELIVERY_RECEIPT_UPDATED
          ),
        },
        (action) => {
          const channel = action.payload;
          const { allChannels = [], currentUserId, currentChannel, channelListQuery, disableAutoSelect } = state;
          const { unreadMessageCount } = channel;

          if (channelListQuery) {
            if (filterChannelListParams(channelListQuery, channel, currentUserId)) {
              // Good to [add to/keep in] the ChannelList
              return {
                ...state,
                allChannels: getChannelsWithUpsertedChannel(allChannels, channel, state.channelListQuery?.order),
              };
            }
            // Filter the channel from the ChannelList
            // Replace the currentChannel if it's filtered channel
            const nextChannel = getNextChannel({
              channel,
              currentChannel,
              allChannels,
              disableAutoSelect,
            });
            return {
              ...state,
              currentChannel: nextChannel,
              allChannels: allChannels.filter(({ url }) => url !== channel?.url),
            };
          }

          if (
            // When marking as read the channel
            unreadMessageCount === 0 &&
            // @ts-ignore - When sending a message by the current peer
            channel?.lastMessage?.sender?.userId !== currentUserId
          ) {
            // Don't move to the top
            return {
              ...state,
              allChannels: allChannels.map((ch) => (ch.url === channel?.url ? channel : ch)),
            };
          }
          // Move to the top
          return {
            ...state,
            allChannels: [channel, ...allChannels.filter(({ url }) => url !== channel.url)],
          };
        }
      )
      .with({ type: channelListActions.SET_CURRENT_CHANNEL }, (action) => {
        return {
          ...state,
          currentChannel: action.payload,
        };
      })
      .with({ type: channelListActions.ON_LAST_MESSAGE_UPDATED }, (action) => {
        return {
          ...state,
          allChannels: state.allChannels.map((channel) => (channel?.url === action.payload.url ? action.payload : channel)),
        };
      })
      .with({ type: channelListActions.ON_CHANNEL_FROZEN }, (action) => {
        const channel = action.payload;
        const { allChannels, currentUserId, currentChannel, channelListQuery, disableAutoSelect } = state;
        if (channelListQuery) {
          if (filterChannelListParams(channelListQuery, channel, currentUserId)) {
            // Good to [add to/keep in] the ChannelList
            return {
              ...state,
              allChannels: getChannelsWithUpsertedChannel(allChannels, channel, state.channelListQuery?.order),
            };
          }
          // Filter the channel from the ChannelList
          // Replace the currentChannel if it's filtered channel
          const nextChannel = getNextChannel({
            channel,
            currentChannel,
            allChannels,
            disableAutoSelect,
          });
          return {
            ...state,
            currentChannel: nextChannel,
            allChannels: allChannels.filter(({ url }) => url !== channel?.url),
          };
        }
        return {
          ...state,
          allChannels: allChannels.map((ch) => {
            if (ch.url === channel?.url) {
              // eslint-disable-next-line no-param-reassign
              ch.isFrozen = true;
              return ch;
            }
            return ch;
          }),
        };
      })
      .with({ type: channelListActions.ON_CHANNEL_UNFROZEN }, (action) => {
        const channel = action.payload;
        const { allChannels, currentUserId, currentChannel, channelListQuery, disableAutoSelect } = state;
        if (channelListQuery) {
          if (filterChannelListParams(channelListQuery, channel, currentUserId)) {
            // Good to [add to/keep in] the ChannelList
            return {
              ...state,
              allChannels: getChannelsWithUpsertedChannel(allChannels, channel, state.channelListQuery?.order),
            };
          }
          // Filter the channel from the ChannelList
          // Replace the currentChannel if it's filtered channel
          const nextChannel = getNextChannel({
            channel,
            currentChannel,
            allChannels,
            disableAutoSelect,
          });
          return {
            ...state,
            currentChannel: nextChannel,
            allChannels: allChannels.filter(({ url }) => url !== channel?.url),
          };
        }

        // No channelListQuery
        return {
          ...state,
          allChannels: allChannels.map((ch) => {
            if (ch.url === channel?.url) {
              // eslint-disable-next-line no-param-reassign
              ch.isFrozen = false;
              return ch;
            }
            return ch;
          }),
        };
      })
      .with({ type: channelListActions.CHANNEL_LIST_PARAMS_UPDATED }, (action) => ({
        ...state,
        channelListQuery: action.payload.channelListQuery,
        currentUserId: action.payload.currentUserId,
      }))
      .otherwise(() => state)
  );
}
