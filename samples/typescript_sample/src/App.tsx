import './App.css'
import '@sendbird/uikit-react/dist/index.css'

import React from 'react'

import SendbirdProvider from '@sendbird/uikit-react/SendbirdProvider'
import GroupChannelList from '@sendbird/uikit-react/GroupChannelList'
import GroupChannel from '@sendbird/uikit-react/GroupChannel'

import { APP_ID, USER_ID, NICKNAME } from './const'

function App() {
  const [currentChannelUrl, setCurrentChannelUrl] = React.useState<string>()

  return (
    <div className="App">
      <SendbirdProvider appId={APP_ID} userId={USER_ID} nickname={NICKNAME}>
      <>
          <div className="sendbird-app__channellist-wrap">
              <GroupChannelList
                  selectedChannelUrl={currentChannelUrl}
                  onChannelCreated={(channel) => {
                      setCurrentChannelUrl(channel.url)
                  }}
                  onChannelSelect={(channel) => {
                      setCurrentChannelUrl(channel?.url)
                  }}
              />
          </div>
          <div className="sendbird-app__conversation-wrap">
              <GroupChannel channelUrl={currentChannelUrl!}/>
          </div>
      </>
      </SendbirdProvider>
    </div>
  )
}

export default App
