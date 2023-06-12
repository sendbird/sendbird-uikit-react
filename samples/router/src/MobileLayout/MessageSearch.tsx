import SbMessageSearch from '@sendbird/uikit-react/MessageSearch'
import { useParams, useNavigate } from 'react-router-dom'

import { useNavigateOnBan } from '../hooks/useNavigateOnBan'

export function MessageSearch() {
  const { channelUrl } = useParams()
  const navigator = useNavigate()
  useNavigateOnBan()
  return (
    <div style={{ height: '100vh' }}>
      <SbMessageSearch
        channelUrl={channelUrl as string}
        onCloseClick={() => {
          navigator(`/channels/${channelUrl}`)
        }}
        onResultClick={(message) => {
          navigator(`/channels/${channelUrl}?messageId=${message?.messageId}&createdAt=${message?.createdAt}`)
        }}
      />
    </div>
  )
}
