import SbChannel from '@sendbird/uikit-react/GroupChannel'

import {
  Outlet,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom'

export default function Channel() {
  const { channelUrl } = useParams()
  const [searchParams] = useSearchParams()
  const messageId = searchParams.get('messageId')
  const createdAt = searchParams.get('createdAt')
  const navigate = useNavigate()
  return (
    <div className='sendbird-chat-desktop__channel'>
      <SbChannel
        channelUrl={channelUrl!}
        onBackClick={() => {
          navigate('/')
        }}
        onSearchClick={() => {
          navigate(`/channels/${channelUrl}/search`)
        }}
        startingPoint={Number(createdAt)}
        animatedMessageId={Number(messageId)}
        showSearchIcon
        onChatHeaderActionClick={() => {
          navigate(`/channels/${channelUrl}/settings`)
        }}
      />
      <Outlet />
    </div>
  )
}
