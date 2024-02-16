import SbChannel from '@sendbird/uikit-react/GroupChannel'
import SbChannelList from '@sendbird/uikit-react/GroupChannelList'
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
