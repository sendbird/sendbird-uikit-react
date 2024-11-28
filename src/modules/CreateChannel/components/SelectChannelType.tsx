import React, { useContext } from 'react';

import * as sendbirdSelectors from '../../../lib/selectors';

import { LocalizationContext } from '../../../lib/LocalizationContext';
import Label, { LabelColors, LabelTypography } from '../../../ui/Label';
import Icon, { IconTypes, IconColors } from '../../../ui/Icon';

import Modal from '../../../ui/Modal';

import {
  isBroadcastChannelEnabled,
  isSuperGroupChannelEnabled,
} from '../utils';
import { CHANNEL_TYPE } from '../types';
import useCreateChannel from '../context/useCreateChannel';
import useSendbird from '../../../lib/Sendbird/context/hooks/useSendbird';

export interface SelectChannelTypeProps {
  onCancel?(): void;
}

const SelectChannelType: React.FC<SelectChannelTypeProps> = (props: SelectChannelTypeProps) => {
  const { onCancel } = props;
  const { state } = useSendbird();
  const sdk = sendbirdSelectors.getSdk(state);

  const {
    actions: {
      setPageStep,
      setType,
    },
  } = useCreateChannel();

  const { stringSet } = useContext(LocalizationContext);

  const isBroadcastAvailable = isBroadcastChannelEnabled(sdk);
  const isSupergroupAvailable = isSuperGroupChannelEnabled(sdk);

  return (
    <Modal
      titleText={stringSet?.MODAL__CREATE_CHANNEL__TITLE}
      hideFooter
      onCancel={() => { onCancel?.(); }}
      className="sendbird-add-channel__modal"
    >
      <div className="sendbird-add-channel__rectangle-wrap">
        <div
          className="sendbird-add-channel__rectangle"
          onClick={() => {
            setType(CHANNEL_TYPE.GROUP);
            setPageStep(1);
          }}
          role="button"
          tabIndex={0}
          onKeyDown={() => {
            setType(CHANNEL_TYPE.GROUP);
            setPageStep(1);
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
            {stringSet.MODAL__CREATE_CHANNEL__GROUP}
          </Label>
        </div>
        {
          isSupergroupAvailable && (
            <div
              className="sendbird-add-channel__rectangle"
              onClick={() => {
                setType(CHANNEL_TYPE.SUPERGROUP);
                setPageStep(1);
              }}
              role="button"
              tabIndex={0}
              onKeyDown={() => {
                setType(CHANNEL_TYPE.SUPERGROUP);
                setPageStep(1);
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
                {stringSet.MODAL__CREATE_CHANNEL__SUPER}
              </Label>
            </div>
          )
        }
        {
          isBroadcastAvailable && (
            <div
              className="sendbird-add-channel__rectangle"
              onClick={() => {
                setType(CHANNEL_TYPE.BROADCAST);
                setPageStep(1);
              }}
              role="button"
              tabIndex={0}
              onKeyDown={() => {
                setType(CHANNEL_TYPE.BROADCAST);
                setPageStep(1);
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
                {stringSet.MODAL__CREATE_CHANNEL__BROADCAST}
              </Label>
            </div>
          )
        }
      </div>
    </Modal>
  );
};

export default SelectChannelType;
