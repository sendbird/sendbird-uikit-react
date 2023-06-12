import SbChannel from '@sendbird/uikit-react/Channel'
import SbChannelList from '@sendbird/uikit-react/ChannelList'
import {
  Outlet,
  useNavigate,
  useParams,
} from 'react-router-dom'

import { useNavigateOnBan } from '../hooks/useNavigateOnBan'

export default function ChannelList() {
  const navigate = useNavigate()
  const { channelUrl } = useParams()

  useNavigateOnBan()

  return (
    <div className='sendbird-chat-desktop'>
      <div className='sendbird-chat-desktop__channel-list'>
        <SbChannelList
          disableAutoSelect
          onChannelSelect={(channel) => {
            navigate(`/channels/${channel.url}`)
          }}
        />
      </div>
      {
        // An empty channel!
        // You might want to implement a custom placeholder instead
        !channelUrl && (
          <SbChannel
            channelUrl=''
          />
        )
      }
      <Outlet />
    </div>
  )
}
