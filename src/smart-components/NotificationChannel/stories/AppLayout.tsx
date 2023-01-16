import './app-layout.scss';

import React, { useState, useEffect } from 'react';

import ChannelList from '../../ChannelList';
import ChannelListHeader from '../../ChannelList/components/ChannelListHeader';
import Channel from '../../Channel';
import AddChannel from '../../ChannelList/components/AddChannel';
import Label, { LabelTypography, LabelColors } from '../../../ui/Label';
import Icon, { IconTypes, IconColors } from '../../../ui/Icon';
import IconButton from '../../../ui/IconButton';
import ContextMenu, { MenuItem, MenuItems } from '../../../ui/ContextMenu';
import NotificationChannel from '../';
import useSendbirdStateContext from '../../../hooks/useSendbirdStateContext';
import { GroupChannelCreateParams, SendbirdGroupChat } from '@sendbird/chat/groupChannel';

const getNotificationChannelUrl = (userId: string) => {
  return `SENDBIRD_NOTIFICATION_CHANNEL_NOTIFICATION_${userId}`;
};

export const CustomTitle = () => {
  const [ notificationChannel, setNotificationChannel ] = useState(null);
  const store = useSendbirdStateContext();
  const userId = store?.config?.userId;
  const sdk = store?.stores?.sdkStore?.sdk;
  // create new channel id not exists
  useEffect(() => {
    if (userId && sdk?.groupChannel?.createPublicGroupChannelListQuery) {
      const notificaionChannelUrl = getNotificationChannelUrl(userId);
      sdk?.groupChannel?.getChannel(notificaionChannelUrl).then((channel) => {
        setNotificationChannel(channel);
      }).catch(() => {
        const params: GroupChannelCreateParams = {
          channelUrl: notificaionChannelUrl,
          isDistinct: true,
          isStrict: true,
          customType: 'SENDBIRD_NOTIFICATION_CHANNEL_NOTIFICATION',
        };
        sdk?.groupChannel?.createChannel(params).then((channel) => {
          setNotificationChannel(channel);
        });
      });
    }
  }, [userId, sdk]);

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
                toggleDropdown();
              }}
            >
              <Icon
                type={IconTypes.NOTIFICATIONS}
                fillColor={IconColors.PRIMARY}
              />
            </IconButton>
          )}
          menuItems={(closeDropdown) => (
            <MenuItems
              parentRef={parentRef}
              parentContainRef={parentRef}
              closeDropdown={closeDropdown}
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
  })
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
