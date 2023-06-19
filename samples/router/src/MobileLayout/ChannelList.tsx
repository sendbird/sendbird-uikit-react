import SbChannelList from '@sendbird/uikit-react/ChannelList'

import { useNavigate } from 'react-router-dom'

export function ChannelList() {
  const navigate = useNavigate()
  return (
    <div style={{ height: '100vh' }}>
      <SbChannelList
        disableAutoSelect
        onChannelSelect={(channel) => {
          navigate(`/channels/${channel.url}`)
        }}
      />
    </div>
  )
}
