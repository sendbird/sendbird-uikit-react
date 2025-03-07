import React, {
  ReactElement,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import type { User } from '@sendbird/chat';
import type {
  OpenChannel,
  OpenChannelCreateParams,
  OpenChannelListQuery,
  SendbirdOpenChat,
} from '@sendbird/chat/openChannel';
import { withSendBird } from '../../../lib/Sendbird/index';
import * as sendbirdSelectors from '../../../lib/selectors';

import './community-channel-list.scss';
import OpenChannelPreview from './OpenChannelPreview';
import Profile from './Profile';
import Avatar from '../../../ui/Avatar';
import Label, { LabelColors, LabelTypography } from '../../../ui/Label';
import IconButton from '../../../ui/IconButton';
import Icon, { IconColors, IconTypes } from '../../../ui/Icon';
import Modal from '../../../ui/Modal';
import TextButton from '../../../ui/TextButton';
import { LocalizationContext } from '../../../lib/LocalizationContext';
import { ButtonTypes } from '../../../ui/Button';

const SB_COMMUNITY_TYPE = 'SB_COMMUNITY_TYPE';

interface Props {
  sdk: SendbirdOpenChat;
  user: User;
  currentChannelUrl: string;
  setCurrentChannel(channel: OpenChannel): void;
  channels: Array<OpenChannel>;
  setChannels(channels: Array<OpenChannel>): void;
}

function CommunityChannelList({
  sdk,
  user,
  currentChannelUrl,
  setCurrentChannel,
  channels,
  setChannels,
}: Props): ReactElement {
  const [channelSource, setChannelSource] = useState<OpenChannelListQuery | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [currentChannelName, setCurrentChannelName] = useState('');
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const { stringSet } = useContext(LocalizationContext);

  useEffect(() => {
    if (!sdk || !sdk.openChannel) {
      return;
    }
    const openChannelListQuery = sdk.openChannel.createOpenChannelListQuery();
    // @ts-ignore: Unreachable code error
    openChannelListQuery.customTypes = [SB_COMMUNITY_TYPE];
    setChannelSource(openChannelListQuery);
    openChannelListQuery.next().then((openChannels) => {
      setChannels(openChannels);
      if (openChannels.length > 0) {
        setCurrentChannel(openChannels[0]);
      }
    });

  }, [sdk]);

  return (
    <div className="community-channel-list">
      <div className="community-channel-list__header">
        <Label
          className="community-channel-list__header__title"
          type={LabelTypography.H_2}
          color={LabelColors.ONBACKGROUND_1}
        >
          Community
        </Label>
        <IconButton
          className="community-channel-list__header__create-channel"
          type="button"
          width="32px"
          height="32px"
          onClick={() => setShowModal(true)}
        >
          <Icon
            className="community-channel-list__header__create-channel__icon"
            type={IconTypes.CREATE}
            fillColor={IconColors.PRIMARY}
          />
        </IconButton>
        {showModal && (
          <Modal
            titleText="New channel profile"
            onCancel={() => setShowModal(false)}
            onSubmit={() => {
              const params: OpenChannelCreateParams = {
                name: currentChannelName,
                coverUrlOrImage: currentFile ?? undefined,
                customType: SB_COMMUNITY_TYPE,
                operatorUserIds: [user.userId],
              };
              // eslint-disable-next-line no-console
              console.log(
                'CommunityChannelList: Creating channel with OpenChannelCreateParams',
                params,
              );
              sdk.openChannel
                .createChannel(params)
                .then((openChannel) => {
                  // eslint-disable-next-line no-console
                  console.log(
                    'CommunityChannelList: OpenChannel has been created',
                    openChannel,
                  );
                  setChannels([openChannel, ...channels]);
                  setCurrentChannel(openChannel);
                  setShowModal(false);
                })
                .catch((error) => {
                  // eslint-disable-next-line no-console
                  console.log(
                    'CommunityChannelList: Failed to create OpenChannel',
                    error,
                  );
                });
            }}
            type={ButtonTypes.PRIMARY}
            submitText={stringSet.CREATE_OPEN_CHANNEL_LIST__SUBMIT}
          >
            <div className="community-channel__add-channel">
              <div className="community-channel__add-channel__image-box">
                <Label
                  className="community-channel__add-channel__image-box__title"
                  type={LabelTypography.CAPTION_3}
                  color={LabelColors.ONBACKGROUND_1}
                >
                  Channel image
                </Label>
                <div className="community-channel__add-channel__image-box__body">
                  <Avatar src={currentImage ?? undefined} width="80px" height="80px" />
                  <input
                    ref={hiddenInputRef}
                    type="file"
                    accept="image/gif, image/jpeg, image/png"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      if (e.target.files) {
                        setCurrentImage(URL.createObjectURL(e.target.files[0]));
                        setCurrentFile(e.target.files[0]);
                      }

                      if (hiddenInputRef.current) {
                        hiddenInputRef.current.value = '';
                      }
                    }}
                  />
                  <TextButton
                    className="community-channel__add-channel__image-box__body__upload"
                    disableUnderline
                    onClick={() => hiddenInputRef.current?.click()}
                  >
                    <Label
                      type={LabelTypography.BUTTON_1}
                      color={LabelColors.PRIMARY}
                    >
                      Upload
                    </Label>
                  </TextButton>
                </div>
              </div>
              <div className="community-channel__add-channel__name-box">
                <Label
                  className="community-channel__add-channel__name-box__title"
                  type={LabelTypography.CAPTION_3}
                  color={LabelColors.ONBACKGROUND_1}
                >
                  Channel name
                </Label>
                <input
                  className="community-channel__add-channel__name-box__input"
                  placeholder="Enter channel name"
                  onChange={(e) => {
                    setCurrentChannelName(e.target.value);
                  }}
                />
              </div>
            </div>
          </Modal>
        )}
      </div>
      <div
        className="community-channel-list__list"
        onScroll={(e: React.FormEvent<HTMLDivElement>) => {
          const target = e.target as HTMLDivElement;
          const fetchMore = target.clientHeight + target.scrollTop === target.scrollHeight;
          if (fetchMore && channelSource?.hasNext) {
            channelSource.next().then((openChannels) => {
              setChannels([...channels, ...openChannels]);
            });
          }
        }}
      >
        {channels.length === 0 ? (
          'No Channels'
        ) : (
          <div className="community-channel-list__scroll-wrap">
            <div>
              {channels.map((c) => (
                <OpenChannelPreview
                  key={c.url}
                  channel={c}
                  selected={c.url === currentChannelUrl}
                  onClick={() => {
                    setCurrentChannel(c);
                  }}
                />
              ))}
            </div>
          </div>
        )}
        <p className="community-channel-list__placeholder">
          Preset channels developed by UI Kit
        </p>
      </div>
      <div className="community-channel-list__footer">
        <Profile user={user} />
      </div>
    </div>
  );
}

export default withSendBird(CommunityChannelList, (store) => {
  return {
    sdk: sendbirdSelectors.getSdk(store),
    user: store.stores.userStore.user,
  };
});
