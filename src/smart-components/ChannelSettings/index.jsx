import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';

import withSendbirdContext from '../../lib/SendbirdSdkContext';
import { UserProfileProvider } from '../../lib/UserProfileContext';
import { LocalizationContext } from '../../lib/LocalizationContext';

import './index.scss';
import Badge from '../../ui/Badge';
import Label, { LabelTypography, LabelColors } from '../../ui/Label';
import Icon, { IconTypes, IconColors } from '../../ui/Icon';
import IconButton from '../../ui/IconButton';

import ChannelProfile from './components/ChannelProfile';
import MembersAccordion from './components/MembersAccordion';
import LeaveChannelModal from './components/LeaveChannel';
import AdminPanel from './components/AdminPanel';
import PlaceHolder from '../../ui/PlaceHolder';
import PlaceHolderTypes from '../../ui/PlaceHolder/type';
import { uuidv4 } from '../../utils/uuid';
import { createDefaultUserListQuery } from '../ChannelList/components/utils';

const COMPONENT_CLASS_NAME = 'sendbird-channel-settings';

const kFormatter = (num) => (
  Math.abs(num) > 999
    ? `${(Math.abs(num) / 1000).toFixed(1)}K`
    : num
);

function ChannelSettings(props) {
  const {
    className,
    onCloseClick,
    channelUrl,
    disableUserProfile,
    renderUserProfile,
    onChannelModified,
    renderChannelProfile,
    onBeforeUpdateChannel,
  } = props;

  const {
    stores: { sdkStore },
    config: {
      userListQuery,
      theme,
      userId,
      logger,
      isOnline,
    },
    queries = {},
  } = props;

  const { config = {} } = props;
  const userDefinedDisableUserProfile = disableUserProfile || config.disableUserProfile;
  const userDefinedRenderProfile = renderUserProfile || config.renderUserProfile;

  const userFilledApplicationUserListQuery = queries.applicationUserListQuery;
  const { stringSet } = useContext(LocalizationContext);

  const { sdk, initialized } = sdkStore;

  // hack to kepp track of channel updates by triggering useEffect
  const [channelUpdateId, setChannelUpdateId] = useState(uuidv4());
  const [channel, setChannel] = useState(null);
  const [invalidChannel, setInvalidChannel] = useState(false);
  const [showAccordion, setShowAccordion] = useState(false);
  const [showLeaveChannelModal, setShowLeaveChannelModal] = useState(false);

  const componentClassNames = (
    Array.isArray(className)
      ? [COMPONENT_CLASS_NAME, ...className]
      : [COMPONENT_CLASS_NAME, className]
  ).join(' ');

  useEffect(() => {
    logger.info('ChannelSettings: Setting up');
    if (!channelUrl || !initialized || !sdk) {
      logger.warning('ChannelSettings: Setting up failed', 'No channelUrl or sdk uninitialized');
      setInvalidChannel(false);
    } else {
      if (!sdk || !sdk.GroupChannel) {
        logger.warning('ChannelSettings: No GroupChannel');
        return;
      }
      sdk.GroupChannel.getChannel(channelUrl, (groupChannel) => {
        if (!groupChannel) {
          logger.warning('ChannelSettings: Channel not found');
          setInvalidChannel(true);
        } else {
          logger.info('ChannelSettings: Fetched group channel', groupChannel);
          setInvalidChannel(false);
          setChannel(groupChannel);
        }
      });
    }
  }, [channelUrl, initialized, channelUpdateId]);

  if (!channel || invalidChannel) {
    return (
      <div className={componentClassNames}>
        <div className="sendbird-channel-settings__header">
          <Label type={LabelTypography.H_2} color={LabelColors.ONBACKGROUND_1}>
            {stringSet.CHANNEL_SETTING__HEADER__TITLE}
          </Label>
          <Icon
            className="sendbird-channel-settings__close-icon"
            type={IconTypes.CLOSE}
            height="24px"
            width="24px"
            onClick={() => {
              logger.info('ChannelSettings: Click close');
              onCloseClick();
            }}
          />
        </div>
        <div>
          <PlaceHolder type={PlaceHolderTypes.WRONG} />
        </div>
      </div>
    );
  }

  return (
    <UserProfileProvider
      className={componentClassNames}
      disableUserProfile={userDefinedDisableUserProfile}
      renderUserProfile={userDefinedRenderProfile}
    >
      <div className="sendbird-channel-settings__header">
        <Label type={LabelTypography.H_2} color={LabelColors.ONBACKGROUND_1}>
          {stringSet.CHANNEL_SETTING__HEADER__TITLE}
        </Label>
        <div className="sendbird-channel-settings__header-icon">
          <IconButton
            width="32px"
            height="32px"
            onClick={() => {
              logger.info('ChannelSettings: Click close');
              onCloseClick();
            }}
          >
            <Icon
              className="sendbird-channel-settings__close-icon"
              type={IconTypes.CLOSE}
              height="22px"
              width="22px"
            />
          </IconButton>
        </div>
      </div>
      <div className="sendbird-channel-settings__scroll-area">
        {
          renderChannelProfile
            ? renderChannelProfile({ channel })
            : (
              <ChannelProfile
                disabled={!isOnline}
                channel={channel}
                userId={userId}
                theme={theme}
                onChannelInfoChange={(currentImg, currentTitle) => {
                  logger.info('ChannelSettings: Channel information being updated');
                  const swapParams = sdk.getErrorFirstCallback();
                  if (onBeforeUpdateChannel) {
                    const params = onBeforeUpdateChannel(currentTitle, currentImg, channel.data);
                    // swapParams
                    channel.updateChannel(params, (response, error) => {
                      let groupChannel = response;
                      if (swapParams) {
                        groupChannel = error;
                      }

                      onChannelModified(groupChannel);
                      setChannelUpdateId(uuidv4());
                    });
                    return;
                  }
                  channel.updateChannel(
                    currentTitle,
                    currentImg,
                    channel.data,
                    (response, error) => {
                      let groupChannel = response;
                      if (swapParams) {
                        groupChannel = error;
                      }
                      logger.info('ChannelSettings: Channel information updated', groupChannel);
                      onChannelModified(groupChannel);
                      setChannelUpdateId(uuidv4());
                    },
                  );
                }}
              />
            )
        }
        {
          channel.myRole === 'operator'
            ? (
              <AdminPanel
                channel={channel}
                userId={userId}
                onChannelModified={(groupChannel) => {
                  // setChannelUpdateId(uuidv4());
                  onChannelModified(groupChannel);
                }}
                userQueryCreator={
                  () => ((userListQuery && typeof userListQuery === 'function')
                    ? userListQuery()
                    : createDefaultUserListQuery({ sdk, userFilledApplicationUserListQuery })
                  )
                }
              />
            )
            : (
              <>
                {/* Move to different file */}
                <div
                  className={[
                    'sendbird-channel-settings__panel-item',
                    'sendbird-channel-settings__members',
                  ].join(' ')}
                  role="switch"
                  aria-checked={showAccordion}
                  onKeyDown={() => setShowAccordion(!showAccordion)}
                  onClick={() => setShowAccordion(!showAccordion)}
                  tabIndex={0}
                >
                  <Icon
                    className="sendbird-channel-settings__panel-icon-left"
                    type={IconTypes.MEMBERS}
                    fillColor={IconColors.PRIMARY}
                    height="24px"
                    width="24px"
                  />
                  <Label
                    type={LabelTypography.SUBTITLE_1}
                    color={LabelColors.ONBACKGROUND_1}
                  >
                    {stringSet.CHANNEL_SETTING__MEMBERS__TITLE}
                    <Badge count={kFormatter(channel.memberCount)} />
                  </Label>
                  <Icon
                    className={[
                      'sendbird-channel-settings__panel-icon-right',
                      'sendbird-channel-settings__panel-icon--chevron',
                      (showAccordion ? 'sendbird-channel-settings__panel-icon--open' : ''),
                    ].join(' ')}
                    type={IconTypes.CHEVRON_RIGHT}
                    height="24px"
                    width="24px"
                  />
                </div>
                {
                  showAccordion && (
                    <MembersAccordion
                      currentUser={userId}
                      disabled={!isOnline}
                      // eslint-disable-next-line
                      userQueryCreator={
                        () => ((userListQuery && typeof userListQuery === 'function')
                          ? userListQuery()
                          : createDefaultUserListQuery({ sdk, userFilledApplicationUserListQuery })
                        )
                      }
                      swapParams={
                        sdk && sdk.getErrorFirstCallback && sdk.getErrorFirstCallback()
                      }
                      channel={channel}
                      members={channel.members}
                      onInviteMembers={(selectedMembers) => {
                        logger.info('ChannelSettings: Inviting new users');
                        channel.inviteWithUserIds(selectedMembers)
                          .then((res) => {
                            onChannelModified(res);
                            setChannelUpdateId(uuidv4());
                            logger.info('ChannelSettings: Inviting new users success!', res);
                          });
                      }}
                    />
                  )
                }
              </>
            )
        }

        <div
          className={[
            'sendbird-channel-settings__panel-item',
            'sendbird-channel-settings__leave-channel',
            !isOnline ? 'sendbird-channel-settings__panel-item__disabled' : '',
          ].join(' ')}
          role="button"
          disabled
          onKeyDown={() => {
            if (!isOnline) { return; }
            setShowLeaveChannelModal(true);
          }}
          onClick={() => {
            if (!isOnline) { return; }
            setShowLeaveChannelModal(true);
          }}
          tabIndex={0}
        >
          <Icon
            className={[
              'sendbird-channel-settings__panel-icon-left',
              'sendbird-channel-settings__panel-icon__leave',
            ].join(' ')}
            type={IconTypes.LEAVE}
            fillColor={IconColors.ERROR}
            height="24px"
            width="24px"
          />
          <Label
            type={LabelTypography.SUBTITLE_1}
            color={LabelColors.ONBACKGROUND_1}
          >
            {stringSet.CHANNEL_SETTING__LEAVE_CHANNEL__TITLE}
          </Label>
        </div>
        {
          showLeaveChannelModal && (
            <LeaveChannelModal
              onCloseModal={() => setShowLeaveChannelModal(false)}
              onLeaveChannel={() => {
                logger.info('ChannelSettings: Leaving channel', channel);
                channel.leave()
                  .then(() => {
                    logger.info('ChannelSettings: Leaving channel successful!', channel);
                    onCloseClick();
                  });
              }}
            />
          )
        }
      </div>
    </UserProfileProvider>
  );
}

ChannelSettings.propTypes = {
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  onCloseClick: PropTypes.func,
  onChannelModified: PropTypes.func,
  onBeforeUpdateChannel: PropTypes.func,
  renderChannelProfile: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.func,
  ]),
  disableUserProfile: PropTypes.bool,
  renderUserProfile: PropTypes.func,
  channelUrl: PropTypes.string.isRequired,
  queries: PropTypes.shape({
    applicationUserListQuery: PropTypes.shape({
      limit: PropTypes.number,
      userIdsFilter: PropTypes.arrayOf(PropTypes.string),
      metaDataKeyFilter: PropTypes.string,
      metaDataValuesFilter: PropTypes.arrayOf(PropTypes.string),
    }),
  }),
  // from withSendbirdContext
  stores: PropTypes.shape({
    sdkStore: PropTypes.shape({
      sdk: PropTypes.shape({
        getErrorFirstCallback: PropTypes.func,
        GroupChannel: PropTypes.oneOfType([
          PropTypes.shape({
            getChannel: PropTypes.func,
          }),
          PropTypes.func,
        ]),
        createApplicationUserListQuery: PropTypes.any,
      }),
      initialized: PropTypes.bool,
    }),
  }).isRequired,
  config: PropTypes.shape({
    userId: PropTypes.string,
    theme: PropTypes.string,
    userListQuery: PropTypes.func,
    isOnline: PropTypes.bool,
    logger: PropTypes.shape({
      info: PropTypes.func,
      error: PropTypes.func,
      warning: PropTypes.func,
    }),
  }).isRequired,
};

ChannelSettings.defaultProps = {
  className: '',
  onBeforeUpdateChannel: null,
  queries: {},
  disableUserProfile: false,
  renderUserProfile: null,
  renderChannelProfile: null,
  onCloseClick: () => { },
  onChannelModified: () => { },
};

export default withSendbirdContext(ChannelSettings);
