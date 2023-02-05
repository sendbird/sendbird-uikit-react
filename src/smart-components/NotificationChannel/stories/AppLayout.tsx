import './app-layout.scss';

import React, { useState, useEffect } from 'react';

import ChannelList from '../../ChannelList';
import ChannelListHeader from '../../ChannelList/components/ChannelListHeader';
import Channel from '../../Channel';
import AddChannel from '../../ChannelList/components/AddChannel';
import Label, { LabelTypography, LabelColors } from '../../../ui/Label';
import Icon, { IconTypes, IconColors } from '../../../ui/Icon';
import IconButton from '../../../ui/IconButton';
import ContextMenu, { MenuItems } from '../../../ui/ContextMenu';
import NotificationChannel from '../';
import useSendbirdStateContext from '../../../hooks/useSendbirdStateContext';
import { GroupChannel, GroupChannelCreateParams, GroupChannelHandler } from '@sendbird/chat/groupChannel';
import uuidv4 from '../../../utils/uuid';
import Badge from '../../../ui/Badge';

const getNotificationChannelUrl = (userId: string) => {
  return `SENDBIRD_NOTIFICATION_CHANNEL_NOTIFICATION_${userId}`;
};

export const CustomTitle = () => {
  const [ notificationChannel, setNotificationChannel ] = useState<GroupChannel>(null);
  const [ isNotficationsOpen, setIsNotficationsOpen ] = useState(false);
  const [ unreadCount, setUnreadCount] = useState(0);
  const store = useSendbirdStateContext();
  const userId = store?.config?.userId;
  const sdk = store?.stores?.sdkStore?.sdk;
  // create new channel id not exists
  useEffect(() => {
    if (userId && sdk?.groupChannel?.createPublicGroupChannelListQuery) {
      const notificaionChannelUrl = getNotificationChannelUrl(userId);
      sdk?.groupChannel?.getChannel(notificaionChannelUrl).then((channel) => {
        setNotificationChannel(channel);
        setUnreadCount(channel?.unreadMessageCount);
      }).catch(() => {
        const params: GroupChannelCreateParams = {
          channelUrl: notificaionChannelUrl,
          isDistinct: true,
          isStrict: true,
          operatorUserIds: [userId],
          customType: 'SENDBIRD_NOTIFICATION_CHANNEL_NOTIFICATION',
        };
        sdk?.groupChannel?.createChannel(params).then((channel) => {
          setNotificationChannel(channel);
          setUnreadCount(channel?.unreadMessageCount);
        });
      });
    }
  }, [userId, sdk]);

  useEffect(() => {
    if (sdk?.groupChannel?.addGroupChannelHandler && notificationChannel?.url) {
      const handlerId = uuidv4();
      const channelHandler: GroupChannelHandler = {
        onMessageReceived: (channel) => {
          if (channel?.url === notificationChannel?.url && !isNotficationsOpen) {
            const _channel = channel as GroupChannel;
            setUnreadCount(_channel?.unreadMessageCount);
          }
        },
      };
      sdk?.groupChannel?.addGroupChannelHandler(handlerId, new GroupChannelHandler(channelHandler));
      return () => {
        sdk?.groupChannel?.removeGroupChannelHandler(handlerId);
      };
    }
  }, [notificationChannel, sdk]);

  const parentRef = React.useRef(null);

  return (
    <div className="sendbird-app__channellist-header-title">
      <Label
        type={LabelTypography.H_2}
        color={LabelColors.ONBACKGROUND_1}
      >
        Channels
      </Label>
      <div className='sendbird-app__channellist-alarm' ref={parentRef}>
        <ContextMenu
          menuTrigger={(toggleDropdown) => (
            <IconButton
              width="32px"
              height="32px"
              onClick={() => {
                setIsNotficationsOpen(true);
                toggleDropdown();
              }}
            >
              <>
                <Icon
                  type={IconTypes.NOTIFICATIONS}
                  fillColor={IconColors.PRIMARY}
                />
                {
                  (unreadCount > 0) && !isNotficationsOpen && (
                    <Badge
                      count={unreadCount}
                      maxLevel={2}
                      className='sendbird-app__channellist-alarm-badge'
                    />
                  )
                }
              </>
            </IconButton>
          )}
          menuItems={(closeDropdown) => (
            <MenuItems
              parentRef={parentRef}
              parentContainRef={parentRef}
              closeDropdown={() => {
                setIsNotficationsOpen(false);
                closeDropdown();
              }}
              className='sendbird-app__channellist-alarm-dropdown'
            >
              <NotificationChannel
                channelUrl={notificationChannel?.url}
              />
            </MenuItems>
          )}
        />
      </div>
    </div>
  );
};

export const AppLayout: React.FC = () => {
  const [ currentChannel, setCurrentChannel ] = useState(null);
  const [ queries ] = useState({
    channelListQuery: {
      customTypesFilter: [''],
    },
  });
  return (
    <div className="sendbird-app__wrap">
      <div className="sendbird-app__channellist-wrap">
        <ChannelList
          onChannelSelect={(channel) => {
            if (channel) {
              setCurrentChannel(channel);
            } else {
              setCurrentChannel(null);
            }
          }}
          renderHeader={() => (
            <ChannelListHeader
              renderTitle={CustomTitle}
              renderIconButton={() => (
                <AddChannel />
              )}
            />
          )}
          queries={queries}
        />
      </div>
      <div className="sendbird-app__conversation-wrap">
        <Channel
          channelUrl={currentChannel?.url || ''}
        />
      </div>
    </div>
  )
};
