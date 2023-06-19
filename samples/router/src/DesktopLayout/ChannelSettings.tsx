import SbChannelSettings from "@sendbird/uikit-react/ChannelSettings"
import { useNavigate, useParams } from "react-router-dom"

export default function ChannelSettings() {
  const { channelUrl } = useParams()
  const navigate = useNavigate()
  return (
    <div className='sendbird-chat-desktop__channel-settings'>
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
