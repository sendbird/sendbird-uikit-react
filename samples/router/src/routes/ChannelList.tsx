import SbChannelList from '@sendbird/uikit-react/ChannelList'

import { useNavigate } from 'react-router-dom'

export function ChannelList() {
  const navigate = useNavigate()
  return (
    <div style={{ height: '100vh' }}>
      <SbChannelList
        disableAutoSelect
        onChannelSelect={(channel) => {
          console.log(channel)
          navigate(`/channel/${channel.url}`)
        }}
      />
    </div>
  )
}
