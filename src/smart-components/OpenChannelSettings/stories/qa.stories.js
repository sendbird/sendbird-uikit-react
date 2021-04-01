import React, {
  useState,
  useEffect,
} from 'react';

import Sendbird from '../../../lib/Sendbird';

import ChannelSetting from '../index';
import ModalRoot from '../../../hooks/useModal/ModalRoot';
import { MenuRoot } from '../../../ui/ContextMenu';

import { getSdk } from '../../../lib/selectors';
import withSendBird from '../../../lib/SendbirdSdkContext';

export default { title: 'OpenChannelSetting-QA' };

const Setup = ({ onSubmit }) => {

  return (
    <form onSubmit={e => {
      onSubmit(
        e.target.elements.appId.value,
        e.target.elements.userId.value,
      );
    }}>
      <input name="appId" placeholder="appId" />
      <input name="userId" placeholder="userId" />
      <div>
        <button type="submit">Submit</button>
      </div>
    </form>
  )
}

const ChannelList = ({ setCurrentChannel, sdk }) => {
  const [channels, setChannels] = useState([]);
  useEffect(() => {
    if (!sdk || !sdk.OpenChannel) { return }
    const openChannelListQuery = sdk.OpenChannel.createOpenChannelListQuery();
    openChannelListQuery.next(function(openChannels, error) {
      if (error) {
        return;
      }
      setChannels(openChannels);
    });
  }, [sdk]);
  return (
    <div style={{ width: '400px' }}>
      <p>Channels - click on a label to setup that channel</p>
      {
        channels.map((c) => (
          <a
            style={{ display: 'block', cursor: 'pointer' }}
            onClick={() => {
              setCurrentChannel(c.url)
            }}
            key={c.url}
          >
            {c.name}
          </a>
        ))
      }
    </div>
  );
}

const ConnectedChannel = withSendBird(ChannelList, (store) => ({
  sdk: getSdk(store),
}))

const App = ({ appId, userId }) => {
  const [currentChannel, setCurrentChannel] = useState(null);
  return (
    <Sendbird
      appId={appId}
      userId={userId}
    >
      <div
        style={{
          height: '600px',
          textAlign: 'center',
          display: 'flex'
        }}
      >
        <ConnectedChannel setCurrentChannel={setCurrentChannel} />
        <ChannelSetting channelUrl={currentChannel} />
      </div>
    </Sendbird>
  );
}

export const OpenChannelSettingQA = () => {
  const [appId, setAppId] = useState(null);
  const [userId, setUserId] = useState(null);
  // const [appId, setAppId] = useState("2D7B4CDB-932F-4082-9B09-A1153792DC8D");
  // const [userId, setUserId] = useState("leo.sub");
  if (!appId || !userId) {
    return <Setup onSubmit={(appId, userId) => {
      setAppId(appId);
      setUserId(userId);
    }} />
  }

  return (
    <App
      appId={appId}
      userId={userId}
    />
  )
}
