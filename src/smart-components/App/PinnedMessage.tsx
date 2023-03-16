import React from 'react'

import useSendbirdStateContext from '../../hooks/useSendbirdStateContext';


type Props = {
  channelUrl?: string;
}

export default function PinnedMessage(props: Props) {
  // const { channelUrl } = props;
  // even lisnetener => pinned message
  const { stores } = useSendbirdStateContext();
  const sb = stores.sdkStore.sdk;
  // add event listener for pinned message useEffect
  // sb.addChannelHandler('pinnedMessage', ChannelHandler.onMessageReceived);
  // sb.removeChannelHandler('pinnedMessage');
  // const pinnedMessage = stores.messageStore.pinnedMessage;
  // store
  return (
    <div  style={{
      position: 'absolute',
      top: '0',
      left: '0',
    }}>`PinnedMessage`</div>
  )
}
