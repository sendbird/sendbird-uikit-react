import React from "react";
import Modal from "../../../../ui/Modal";
import { GroupChannel } from "@sendbird/chat/groupChannel";
import useSendbirdStateContext from "../../../../hooks/useSendbirdStateContext";
import { useLocalization } from "../../../../lib/LocalizationContext";
import { noop } from "../../../../utils/utils";

export interface LeaveChannelViewProps {
  channel: GroupChannel;
  onSubmit?: () => void;
  onCancel?: () => void;
}
export const LeaveChannelView = ({
  channel,
  onCancel = noop,
  onSubmit = noop,
}: LeaveChannelViewProps) => {
  const { config } = useSendbirdStateContext();
  const { logger, isOnline } = config;
  const { stringSet } = useLocalization();

  return (
    <Modal
      disabled={!isOnline}
      onCancel={onCancel}
      onSubmit={() => {
        logger.info("ChannelSettings: Leaving channel", channel);
        channel.leave().then(() => {
          logger.info("ChannelSettings: Leaving channel successful!", channel);
          onSubmit();
        });
      }}
      submitText={stringSet.MODAL__LEAVE_CHANNEL__FOOTER}
      titleText={stringSet.MODAL__LEAVE_CHANNEL__TITLE}
    />
  );
};
