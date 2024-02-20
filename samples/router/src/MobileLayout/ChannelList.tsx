import SbChannelList from '@sendbird/uikit-react/GroupChannelList'

import { useNavigate, useParams } from 'react-router-dom'

export function ChannelList() {
  const navigate = useNavigate()
  const { channelUrl = '' } = useParams()

  return (
    <div style={{ height: '100vh' }}>
      <SbChannelList
        disableAutoSelect
        selectedChannelUrl={channelUrl}
        onChannelCreated={(channel) => {
          navigate(`/channels/${channel.url}`)
        }}
        onChannelSelect={(channel) => {
          if (channel) navigate(`/channels/${channel.url}`)
          else navigate('/')
        }}
      />
    </div>
  )
}
