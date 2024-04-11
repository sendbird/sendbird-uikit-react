import './open-channel-ui.scss';

import React from 'react';
import { useOpenChannelContext } from '../../context/OpenChannelProvider';

import OpenChannelInput from '../OpenChannelInput';
import FrozenChannelNotification from '../FrozenChannelNotification';
import OpenChannelHeader from '../OpenChannelHeader';
// import OpenchannelConversationScroll from './components/OpenchannelConversationScroll';
import PlaceHolder, { PlaceHolderTypes } from '../../../../ui/PlaceHolder';
import OpenChannelMessageList from '../OpenChannelMessageList';
import { RenderMessageProps } from '../../../../types';

export interface OpenChannelUIProps {
  renderMessage?: (props: RenderMessageProps) => React.ReactElement;
  renderHeader?: () => React.ReactElement;
  renderMessageInput?: () => React.ReactElement;
  renderPlaceHolderEmptyList?: () => React.ReactElement;
  renderPlaceHolderError?: () => React.ReactElement;
  renderPlaceHolderLoading?: () => React.ReactElement;

  /** @deprecated Please use renderMessageInput instead * */
  renderInput?: () => React.ReactElement;
}

const COMPONENT_CLASS_NAME = 'sendbird-openchannel-conversation';

const OpenChannelUI: React.FC<OpenChannelUIProps> = ({
  renderMessage,
  renderHeader,
  renderPlaceHolderEmptyList,
  renderPlaceHolderError,
  renderPlaceHolderLoading,
  renderMessageInput,
  renderInput,
}: OpenChannelUIProps) => {
  const {
    currentOpenChannel,
    amIBanned,
    loading,
    isInvalid,
    messageInputRef,
    conversationScrollRef,
  } = useOpenChannelContext();
  if (
    !currentOpenChannel
    || !currentOpenChannel?.url
    || amIBanned
  ) {
    return (renderPlaceHolderError?.()
      || <div className={COMPONENT_CLASS_NAME}><PlaceHolder type={PlaceHolderTypes.NO_CHANNELS} /></div>
    );
  }
  if (loading) {
    return (renderPlaceHolderLoading?.()
      || <div className={COMPONENT_CLASS_NAME}><PlaceHolder type={PlaceHolderTypes.LOADING} /></div>
    );
  }
  if (isInvalid) {
    return (renderPlaceHolderError?.()
      || <div className={COMPONENT_CLASS_NAME}><PlaceHolder type={PlaceHolderTypes.WRONG} /></div>
    );
  }

  const renderInputComponent = renderMessageInput || renderInput;

  return (
    <div className={COMPONENT_CLASS_NAME}>
      {renderHeader?.() || <OpenChannelHeader />}
      {currentOpenChannel?.isFrozen && <FrozenChannelNotification />}
      <OpenChannelMessageList
        ref={conversationScrollRef}
        renderMessage={renderMessage}
        renderPlaceHolderEmptyList={renderPlaceHolderEmptyList}
      />
      {renderInputComponent?.() || <OpenChannelInput ref={messageInputRef} />}
    </div>
  );
};

export default OpenChannelUI;
