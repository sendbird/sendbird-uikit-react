import SbChannel from '@sendbird/uikit-react/GroupChannel'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'

import { useNavigateOnBan } from '../hooks/useNavigateOnBan'

export function Channel() {
  const { channelUrl } = useParams()
  const [searchParams] = useSearchParams()
  const messageId = searchParams.get('messageId')
  const createdAt = searchParams.get('createdAt')
  const navigate = useNavigate()
  useNavigateOnBan()
  return (
    <div style={{ height: '100vh' }}>
      <SbChannel
        channelUrl={channelUrl as string}
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
    </div>
  )
}
