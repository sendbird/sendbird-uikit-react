import React from 'react';
import RemoveMessageModalView, {
  RemoveMessageModalProps,
} from '../../../GroupChannel/components/RemoveMessageModal/RemoveMessageModalView';
import { useChannelContext } from '../../context/ChannelProvider';

/**
 * @deprecated This component is deprecated and will be removed in the next major update.
 * Please use the `GroupChannel` component from '@sendbird/uikit-react/GroupChannel' instead.
 * For more information, please refer to the migration guide:
 * https://docs.sendbird.com/docs/chat/uikit/v3/react/introduction/group-channel-migration-guide
 */
const RemoveMessageModal = (props: RemoveMessageModalProps) => {
  const { deleteMessage } = useChannelContext();
  return <RemoveMessageModalView {...props} deleteMessage={deleteMessage} />;
};

export default RemoveMessageModal;
