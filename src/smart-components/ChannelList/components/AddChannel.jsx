import './add-channel.scss';

import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';

import { LocalizationContext } from '../../../lib/LocalizationContext';
import IconButton from '../../../ui/IconButton';
import Label, { LabelColors, LabelTypography } from '../../../ui/Label';
import Icon, { IconTypes, IconColors } from '../../../ui/Icon';
import InviteMembers from '../../InviteMembers';

import {
  createChannel,
  createDefaultUserListQuery,
  isBroadcastChannelEnabled,
  isSuperGroupChannelEnabled,
} from './utils';
import { CREATE_CHANNEL } from '../dux/actionTypes';
import Modal from '../../../ui/Modal';

export default function AddChannel({
  sdk,
  disabled,
  channelListDispatcher,
  onBeforeCreateChannel,
  userId,
  userFilledApplicationUserListQuery,
  userListQuery,
}) {
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(0);
  const [type, setType] = useState('group');
  const { stringSet } = useContext(LocalizationContext);

  if (!sdk || !sdk.createApplicationUserListQuery) {
    return null;
  }

  const isBroadcastAvailable = isBroadcastChannelEnabled(sdk);
  const isSupergroupAvailable = isSuperGroupChannelEnabled(sdk);

  return (
    <>
      <IconButton
        height="32px"
        width="32px"
        onClick={() => {
          setShowModal(true);
        }}
        disabled={disabled}
      >
        <Icon
          type={IconTypes.CREATE}
          fillColor={IconColors.PRIMARY}
          width="24px"
          height="24px"
        />
      </IconButton>
      {
        showModal && step === 0 && (
          <Modal
            titleText={stringSet.MODAL__CHOOSE_CHANNEL_TYPE__TITLE}
            hideFooter
            onCancel={() => { setShowModal(false); }}
            onSubmit={() => { }}
          >
            <div className="sendbird-add-channel__rectangle-wrap">
              <div
                className="sendbird-add-channel__rectangle"
                onClick={() => {
                  setType('group');
                  setStep(1);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={() => {
                  setType('group');
                  setStep(1);
                }}
              >
                <Icon
                  className="sendbird-add-channel__rectangle__chat-icon"
                  type={IconTypes.CHAT}
                  fillColor={IconColors.PRIMARY}
                  width="28px"
                  height="28px"
                />
                <Label type={LabelTypography.SUBTITLE_1} color={LabelColors.ONBACKGROUND_1}>
                  {stringSet.MODAL__CHOOSE_CHANNEL_TYPE__GROUP}
                </Label>
              </div>
              {
                isSupergroupAvailable && (
                  <div
                    className="sendbird-add-channel__rectangle"
                    onClick={() => {
                      setType('supergroup');
                      setStep(1);
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={() => {
                      setType('supergroup');
                      setStep(1);
                    }}
                  >
                    <Icon
                      className="sendbird-add-channel__rectangle__supergroup-icon"
                      type={IconTypes.SUPERGROUP}
                      fillColor={IconColors.PRIMARY}
                      width="28px"
                      height="28px"
                    />
                    <Label type={LabelTypography.SUBTITLE_1} color={LabelColors.ONBACKGROUND_1}>
                      {stringSet.MODAL__CHOOSE_CHANNEL_TYPE__SUPER_GROUP}
                    </Label>
                  </div>
                )
              }
              {
                isBroadcastAvailable && (
                  <div
                    className="sendbird-add-channel__rectangle"
                    onClick={() => {
                      setType('broadcast');
                      setStep(1);
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={() => {
                      setType('broadcast');
                      setStep(1);
                    }}
                  >
                    <Icon
                      className="sendbird-add-channel__rectangle__broadcast-icon"
                      type={IconTypes.BROADCAST}
                      fillColor={IconColors.PRIMARY}
                      width="28px"
                      height="28px"
                    />
                    <Label type={LabelTypography.SUBTITLE_1} color={LabelColors.ONBACKGROUND_1}>
                      {stringSet.MODAL__CHOOSE_CHANNEL_TYPE__BROADCAST}
                    </Label>
                  </div>
                )
              }
            </div>
          </Modal>
        )
      }
      {
        showModal && step === 1 && (
          <InviteMembers
            swapParams={
              sdk && sdk.getErrorFirstCallback && sdk.getErrorFirstCallback()
            }
            titleText={stringSet.MODAL__CREATE_CHANNEL__TITLE}
            submitText={stringSet.BUTTON__CREATE}
            closeModal={() => {
              setStep(0);
              setShowModal(false);
            }}
            idsToFilter={[userId]}
            userQueryCreator={() => ((userListQuery && typeof userListQuery === 'function')
              ? userListQuery()
              : createDefaultUserListQuery({ sdk, userFilledApplicationUserListQuery })
            )}
            onSubmit={(selectedUsers) => createChannel(
              sdk,
              selectedUsers,
              onBeforeCreateChannel,
              userId,
              type,
            ).then((channel) => {
              // maybe - do this in event listener
              channelListDispatcher({
                type: CREATE_CHANNEL,
                payload: channel,
              });
            })}
          />
        )
      }
    </>
  );
}

AddChannel.propTypes = {
  sdk: PropTypes.shape({
    getErrorFirstCallback: PropTypes.func,
    createApplicationUserListQuery: PropTypes.func,
  }).isRequired,
  disabled: PropTypes.bool,
  channelListDispatcher: PropTypes.func.isRequired,
  userFilledApplicationUserListQuery: PropTypes.shape({}),
  onBeforeCreateChannel: PropTypes.func,
  userId: PropTypes.string.isRequired,
  userListQuery: PropTypes.func,
};

AddChannel.defaultProps = {
  disabled: false,
  userFilledApplicationUserListQuery: {},
  onBeforeCreateChannel: null,
  userListQuery: null,
};
