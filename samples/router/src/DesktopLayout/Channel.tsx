import SbChannel from '@sendbird/uikit-react/Channel'

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
  const numCreatedAt = Number(createdAt)
  const navigate = useNavigate()
  return (
    <div className='sendbird-chat-desktop__channel'>
      <SbChannel
        channelUrl={channelUrl as string}
        onBackClick={() => {
          navigate('/')
        }}
        onSearchClick={() => {
          navigate(`/channels/${channelUrl}/search`)
        }}
        { ...(messageId && typeof numCreatedAt === 'number') && {
          startingPoint: numCreatedAt,
          highlightedMessageId: messageId,
          animatedMessageId: messageId,
        }}
        showSearchIcon
        onChatHeaderActionClick={() => {
          navigate(`/channels/${channelUrl}/settings`)
        }}
      />
      <Outlet />
    </div>
  )
}
