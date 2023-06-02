import SbMessageSearch from '@sendbird/uikit-react/MessageSearch'
import { useParams, useNavigate } from 'react-router-dom'

export function MessageSearch() {
  const { channelUrl } = useParams();
  const navigator = useNavigate();
  return (
    <div style={{ height: '100vh' }}>
      <SbMessageSearch
        channelUrl={channelUrl as string}
        onCloseClick={() => {
          navigator(`/channel/${channelUrl}`)
        }}
        onResultClick={(message) => {
          navigator(`/channel/${channelUrl}?messageId=${message?.messageId}&createdAt=${message?.createdAt}`)
        }}
      />
    </div>
  )
}
