import { useNavigate, useParams } from 'react-router-dom'

import SbChannelSettings from '@sendbird/uikit-react/ChannelSettings'

export function ChannelSettings() {
  const { channelUrl } = useParams()
  const navigate = useNavigate()
  return (
    <div>
      <SbChannelSettings
        channelUrl={channelUrl as string}
        onCloseClick={() => {
          navigate(`/channel/${channelUrl}`)
        }}
        onLeaveChannel={() => {
          navigate('/')
        }}
      />
    </div>
  )
}
