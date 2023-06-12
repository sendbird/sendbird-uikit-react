import { useNavigate, useParams } from 'react-router-dom'
import SbChannelSettings from '@sendbird/uikit-react/ChannelSettings'

import { useNavigateOnBan } from '../hooks/useNavigateOnBan'

export function ChannelSettings() {
  const { channelUrl } = useParams()
  const navigate = useNavigate()
  useNavigateOnBan()
  return (
    <div style={{ height: '100vh' }}>
      <SbChannelSettings
        channelUrl={channelUrl as string}
        onCloseClick={() => {
          navigate(`/channels/${channelUrl}`)
        }}
        onLeaveChannel={() => {
          navigate('/')
        }}
      />
    </div>
  )
}
