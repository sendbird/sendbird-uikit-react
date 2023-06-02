import SbChannel from '@sendbird/uikit-react/Channel'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'

export function Channel() {
  const { channelUrl } = useParams()
  const [searchParams] = useSearchParams()
  const messageId = searchParams.get('messageId')
  const createdAt = searchParams.get('createdAt')
  const numCreatedAt = Number(createdAt)
  const navigate = useNavigate()
  return (
    <div style={{ height: '100vh' }}>
      <SbChannel
        channelUrl={channelUrl as string}
        onBackClick={() => {
          navigate('/')
        }}
        onSearchClick={() => {
          navigate(`/channel/${channelUrl}/search`)
        }}
        { ...(messageId && typeof numCreatedAt === 'number') && {
          startingPoint: numCreatedAt,
          highlightedMessageId: messageId,
          animatedMessageId: messageId,
        }}
        showSearchIcon
        onChatHeaderActionClick={() => {
          navigate(`/channel/${channelUrl}/settings`)
        }}
      />
    </div>
  )
}
