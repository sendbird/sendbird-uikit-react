import React, {
  useContext,
  useState,
  useEffect,
} from 'react';
import { OpenChannelSettingsProps } from '../../index';

import { UserProfileProvider } from '../../lib/UserProfileContext';
import { LocalizationContext } from '../../lib/LocalizationContext';
import withSendbirdContext from '../../lib/SendbirdSdkContext';
import selectors from '../../lib/selectors';

import { copyToClipboard } from '../../ui/Message/utils.js'

import './index.scss';
import Label, { LabelTypography, LabelColors } from '../../ui/Label';
import Icon, { IconTypes } from '../../ui/Icon';
import ChannelProfile from './components/ChannelProfile';
import ParticipantsAccordion from './components/ParticipantsAccordion';
import DeleteChannel from './components/DeleteChannel';
import ParticipantsList from './components/ParticipantsList';
import InvalidChannel from './components/InvalidChannel';
import { AccordionGroup } from '../../ui/Accordion';
import { noop } from '../../utils/utils';

const emptyLogger = () => ({
  info: noop,
  error: noop,
  warning: noop,
});

interface Props extends OpenChannelSettingsProps {
  logger: SendbirdUIKit.Logger;
  sdk: SendBird.SendBirdInstance;
  theme: string;
  user: SendBird.User;
  isOnline: boolean;
}

function OpenChannelSettings(props: Props) {
  const {
    channelUrl,
    onCloseClick = noop,
    onBeforeUpdateChannel,
    onChannelModified = noop,
    renderChannelProfile,
    renderUserProfile,
    onDeleteChannel,
    disableUserProfile = false,
    logger = emptyLogger(),
    sdk,
    theme,
    user,
    isOnline,
  } = props;

  const currentUser = user.userId;
  const [channel, setChannel] = useState<SendBird.OpenChannel | null>(null);
  const { stringSet } = useContext(LocalizationContext);
  useEffect(() => {
    if (!channelUrl || !sdk || !sdk.getConnectionState) {
      setChannel(null);
      return;
    }

    sdk.OpenChannel.getChannel(channelUrl, (openChannel, error) => {
      if (!error) {
        setChannel(openChannel);
      } else {
        setChannel(null);
      }
    });
  }, [channelUrl, sdk])
  if (!channel) {
    return (
      <InvalidChannel
        onCloseClick={() => {
          logger.info('OpenChannelSettings: Click close');
          if (onCloseClick) {
            onCloseClick();
          }
        }}
      />
    );
  }
  return (
    <UserProfileProvider
      className="sendbird-openchannel-settings"
      disableUserProfile={disableUserProfile}
      renderUserProfile={renderUserProfile}
    >
      {
        channel.isOperator(user)
          ? (
            <>
              <div className="sendbird-openchannel-settings__header">
                <Label type={LabelTypography.H_2} color={LabelColors.ONBACKGROUND_1}>
                  {stringSet.CHANNEL_SETTING__HEADER__TITLE}
                </Label>
                <Icon
                  className="sendbird-openchannel-settings__close-icon"
                  type={IconTypes.CLOSE}
                  height="24px"
                  width="24px"
                  onClick={() => {
                    onCloseClick();
                  }}
                />
              </div>
              <div className="sendbird-openchannel-settings__profile">
              {
                renderChannelProfile
                  ? renderChannelProfile({ channel, user })
                  : (
                    <ChannelProfile
                      disabled={!isOnline}
                      channel={channel}
                      theme={theme}
                      onChannelInfoChange={(currentImg: File, currentTitle: string) => {
                        logger.info('ChannelSettings: Channel information being updated');
                        if (onBeforeUpdateChannel) {
                          const params = onBeforeUpdateChannel(currentTitle, currentImg, channel.data);
                          logger.info('ChannelSettings: onBeforeUpdateChannel', params);
                          channel.updateChannel(params, (openChannel) => {
                            onChannelModified(openChannel);
                            // setChannel(openChannel) => alone not working
                            setChannel(null);
                            setChannel(openChannel);
                          });
                        } else {
                          channel.updateChannel(
                            currentTitle,
                            currentImg,
                            channel.data,
                            (openChannel) => {
                              logger.info('ChannelSettings: Channel information updated', openChannel);
                              onChannelModified(openChannel);
                              // setChannel(openChannel) => alone not working
                              setChannel(null);
                              setChannel(openChannel);
                            },
                          );
                        }
                      }}
                    />
                  )
                }
              </div>
              <div className="sendbird-openchannel-settings__url">
                <Icon
                  className="sendbird-openchannel-settings__copy-icon"
                  type={IconTypes.COPY}
                  height="22px"
                  width="22px"
                  onClick={() => {
                    copyToClipboard(channel.url);
                  }}
                />
                <Label
                  className="sendbird-openchannel-settings__url-label"
                  type={LabelTypography.CAPTION_2}
                  color={LabelColors.ONBACKGROUND_2}
                >
                  {stringSet.OPEN_CHANNEL_SETTINGS__OPERATOR_URL}
                </Label>
                <Label
                  className="sendbird-openchannel-settings__url-value"
                  type={LabelTypography.SUBTITLE_2}
                >
                  {channel.url}
                </Label>
              </div>
              <AccordionGroup>
                <ParticipantsAccordion
                  channel={channel}
                  currentUser={currentUser}
                />
              </AccordionGroup>
              <DeleteChannel
                isOnline={isOnline}
                onDeleteChannel={() => {
                  channel.delete((response, error) => {
                    if (error) {
                      logger.warning('OpenChannelSettings: Delete channel failed', error);
                      return;
                    }
                    logger.info('OpenChannelSettings: Delete channel success', response);
                    if (onDeleteChannel) {
                      onDeleteChannel(channel);
                    }
                  });
                }}
              />
            </>
          ) : (
            <ParticipantsList
              currentUser={currentUser}
              channel={channel}
              onCloseClick={() => {
                onCloseClick();
              }}
            />
          )
      }
    </UserProfileProvider>
  )
}

const ChannelSettingsWithSendbird = withSendbirdContext(OpenChannelSettings, (store) => {
  const logger = (store && store.config && store.config.logger);
  const theme = (store && store.config && store.config.theme) || 'light';
  const isOnline = (store && store.config && store.config.isOnline);
  const user = (store && store.stores && store.stores.userStore
    && store.stores.userStore.user);
  return {
    sdk: selectors.getSdk(store),
    logger,
    theme,
    isOnline,
    user,
  };
});

export default ChannelSettingsWithSendbird;
